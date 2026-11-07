import json
import os
import secrets
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Dict, List, Optional, Tuple

import requests
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from sse_starlette.sse import EventSourceResponse

import auth
import documents
import emails

load_dotenv()

API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

app = FastAPI(title="Forsa API")
auth.init_db()
documents.init_db()
app.include_router(auth.router)
app.include_router(documents.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def no_cache_static(request, call_next):
    """Évite que le navigateur garde une ancienne version du site."""
    response = await call_next(request)
    if not request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store, max-age=0"
    return response


PLACES_URL = "https://places.googleapis.com/v1/places:searchText"

FIELD_MASK = (
    "places.id,"
    "places.displayName,"
    "places.formattedAddress,"
    "places.location,"
    "places.googleMapsUri,"
    "places.websiteUri,"
    "places.nationalPhoneNumber,"
    "places.rating,"
    "places.userRatingCount,"
    "places.primaryTypeDisplayName"
)


class SearchRequest(BaseModel):
    queries: List[str] = Field(..., min_length=1, description="Liste de mots-clés / requêtes de recherche")
    language_code: str = Field("fr", description="Code langue, ex: fr, en")
    region_code: Optional[str] = Field(None, description="Code pays, ex: MA, FR")


def search_one_query(query: str, language_code: str, region_code: Optional[str]) -> List[dict]:
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": FIELD_MASK,
    }

    body = {"textQuery": query, "languageCode": language_code}
    if region_code:
        body["regionCode"] = region_code

    response = requests.post(PLACES_URL, headers=headers, json=body, timeout=30)

    if response.status_code != 200:
        raise RuntimeError(f"{response.status_code}: {response.text[:300]}")

    places = response.json().get("places", [])

    results = []
    for place in places:
        location = place.get("location", {})
        results.append(
            {
                "query": query,
                "place_id": place.get("id"),
                "nom": place.get("displayName", {}).get("text"),
                "adresse": place.get("formattedAddress"),
                "telephone": place.get("nationalPhoneNumber"),
                "site_web": place.get("websiteUri"),
                "email": None,
                "google_maps": place.get("googleMapsUri"),
                "categorie": place.get("primaryTypeDisplayName", {}).get("text"),
                "note": place.get("rating"),
                "nombre_avis": place.get("userRatingCount"),
                "latitude": location.get("latitude"),
                "longitude": location.get("longitude"),
            }
        )
    return results


@app.post("/api/search")
def search_places(payload: SearchRequest, current_user: dict = Depends(auth.get_current_user)):
    if not API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Clé API Google Maps manquante côté serveur. Ajoute GOOGLE_MAPS_API_KEY dans le fichier .env.",
        )

    all_results = []
    seen_ids = set()
    errors = []

    for raw_query in payload.queries:
        query = raw_query.strip()
        if not query:
            continue

        try:
            results = search_one_query(query, payload.language_code, payload.region_code)
        except Exception as exc:  # noqa: BLE001
            errors.append({"query": query, "error": str(exc)})
            continue

        for result in results:
            place_id = result.get("place_id")
            if place_id and place_id in seen_ids:
                continue
            if place_id:
                seen_ids.add(place_id)
            all_results.append(result)

        time.sleep(0.2)  # reste raisonnable vis-à-vis des quotas Google

    # Google Places ne fournit pas d'email : on le cherche sur le site web de chaque entreprise
    emails.enrich_with_emails(all_results)

    return {"count": len(all_results), "results": all_results, "errors": errors}



# --------------------------------------------------------------------------
# Recherche en streaming (Server-Sent Events)
# --------------------------------------------------------------------------
# EventSource ne sait ni faire de POST ni envoyer l'en-tête Authorization.
# Flux en 2 étapes : 1) POST authentifié -> ticket à usage unique (60 s),
# 2) GET /api/search/stream?ticket=... -> flux SSE. Le token de session
# n'apparaît donc jamais dans l'URL.

STREAM_TICKET_TTL = 60
_stream_tickets: Dict[str, Tuple[SearchRequest, float]] = {}
_stream_tickets_lock = threading.Lock()


def _sse(event: str, data: dict) -> dict:
    return {"event": event, "data": json.dumps(data, ensure_ascii=False)}


def _purge_tickets() -> None:
    now = time.time()
    for key in [k for k, (_, exp) in _stream_tickets.items() if exp < now]:
        _stream_tickets.pop(key, None)


@app.post("/api/search/stream-ticket")
def create_stream_ticket(payload: SearchRequest, current_user: dict = Depends(auth.get_current_user)):
    if not API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Clé API Google Maps manquante côté serveur. Ajoute GOOGLE_MAPS_API_KEY dans le fichier .env.",
        )
    ticket = secrets.token_urlsafe(24)
    with _stream_tickets_lock:
        _purge_tickets()
        _stream_tickets[ticket] = (payload, time.time() + STREAM_TICKET_TTL)
    return {"ticket": ticket}


def _stream_search(payload: SearchRequest):
    """Générateur SSE : événements progress -> total -> place (x N) -> done."""
    queries = [q.strip() for q in payload.queries if q.strip()]
    all_results: List[dict] = []
    seen_ids = set()
    errors: List[dict] = []

    # Phase 1 : recherche Google Places (0 -> 10 %)
    yield _sse("progress", {"phase": "search", "percent": 0})
    for i, query in enumerate(queries):
        try:
            results = search_one_query(query, payload.language_code, payload.region_code)
        except Exception as exc:  # noqa: BLE001
            errors.append({"query": query, "error": str(exc)})
            results = []
        for result in results:
            place_id = result.get("place_id")
            if place_id and place_id in seen_ids:
                continue
            if place_id:
                seen_ids.add(place_id)
            all_results.append(result)
        yield _sse("progress", {"phase": "search", "percent": int((i + 1) / len(queries) * 10)})
        time.sleep(0.2)  # reste raisonnable vis-à-vis des quotas Google

    total = len(all_results)
    yield _sse("total", {"total": total})

    # Phase 2 : emails + réseaux sociaux, un événement par lieu dès qu'il est résolu (10 -> 100 %)
    cache: Dict[str, dict] = {}
    blank = {"email": None, "linkedin": None, "facebook": None, "instagram": None}

    def resolve(place: dict) -> dict:
        site = place.get("site_web")
        if not site:
            place.update(blank)
            return place
        if site not in cache:
            cache[site] = emails.find_contact_for_site(site)
        place.update(cache[site])
        return place

    pool = ThreadPoolExecutor(max_workers=12)
    try:
        futures = {pool.submit(resolve, place): place for place in all_results}
        done = 0
        for future in as_completed(futures):
            place = futures[future]
            try:
                future.result()
            except Exception:  # noqa: BLE001
                place.update(blank)
            done += 1
            yield _sse("place", {
                "place": place,
                "done": done,
                "total": total,
                "percent": 10 + int(done / total * 90),
            })
    finally:
        # Client parti (fermeture de l'EventSource) : on abandonne les recherches en attente
        pool.shutdown(wait=False, cancel_futures=True)

    yield _sse("done", {"count": total, "errors": errors, "percent": 100})


@app.get("/api/search/stream")
def search_places_stream(ticket: str = Query(...)):
    with _stream_tickets_lock:
        _purge_tickets()
        entry = _stream_tickets.pop(ticket, None)
    if entry is None:
        raise HTTPException(status_code=401, detail="Ticket de recherche invalide ou expiré.")
    payload, _ = entry
    return EventSourceResponse(_stream_search(payload))


@app.get("/api/health")
def health():
    return {"ok": True, "api_key_configured": bool(API_KEY), "email_feature": True}


app.mount("/", StaticFiles(directory="static", html=True), name="static")
