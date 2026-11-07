"""Recherche d'adresses email et de profils sociaux à partir du site web d'une entreprise.

Google Places ne fournit PAS d'email. On le récupère donc en visitant le site
web de l'entreprise (page d'accueil + quelques pages "contact") et en
extrayant :

* les adresses email (liens mailto:, texte brut, formats obfusqués comme
  "nom [at] domaine [dot] com", "nom(at)domaine.com", entités HTML, etc.) ;
* les profils sociaux professionnels présents dans des balises <a> :
  LinkedIn (company/school, à défaut /in), Facebook et Instagram.

Les recherches sont faites en parallèle pour rester rapides.
"""

import html
import re
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, List, Optional
from urllib.parse import unquote, urljoin, urlparse

import requests

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(?:\.[A-Za-z0-9\-]+)*\.[A-Za-z]{2,}")
MAILTO_RE = re.compile(r"mailto:([^\"'?>\s]+)", re.IGNORECASE)
HREF_RE = re.compile(r"href=[\"']([^\"'#]+)[\"']", re.IGNORECASE)
ANCHOR_HREF_RE = re.compile(r"<a\b[^>]*?\bhref\s*=\s*[\"']([^\"']+)[\"']", re.IGNORECASE | re.DOTALL)
TAG_RE = re.compile(r"<[^>]+>")
SCRIPT_STYLE_RE = re.compile(r"<(script|style)\b.*?</\1\s*>", re.IGNORECASE | re.DOTALL)

# --- Désobfuscation ---------------------------------------------------------
_AT_WORDS = r"(?:at|arobase|chez)"
_DOT_WORDS = r"(?:dot|point)"
# "nom [at] domaine", "nom (at) domaine", "nom{at}domaine", "nom <at> domaine"
_AT_BRACKETED_RE = re.compile(rf"\s*[\[\(\{{<]\s*{_AT_WORDS}\s*[\]\)\}}>]\s*", re.IGNORECASE)
_DOT_BRACKETED_RE = re.compile(rf"\s*[\[\(\{{<]\s*{_DOT_WORDS}\s*[\]\)\}}>]\s*", re.IGNORECASE)
# "nom @ domaine . com" (espaces autour du @)
_AT_SPACED_RE = re.compile(r"([A-Za-z0-9._%+\-]+)\s+@\s+([A-Za-z0-9\-]+)")
# "nom at domaine dot com" (sans crochets) : volontairement strict (exige un "dot" + TLD)
_PLAIN_WORDS_RE = re.compile(
    rf"\b([A-Za-z0-9._%+\-]+)\s+{_AT_WORDS}\s+([A-Za-z0-9\-]+(?:\s+{_DOT_WORDS}\s+[A-Za-z0-9\-]+)*)\s+{_DOT_WORDS}\s+([A-Za-z]{{2,}})\b",
    re.IGNORECASE,
)

CONTACT_PATHS = ["/contact", "/contact-us", "/contactez-nous", "/nous-contacter", "/a-propos", "/about", "/recrutement"]
CONTACT_HINTS = ("contact", "propos", "about", "recrut", "career", "carri", "join", "equipe", "team")

REQUEST_TIMEOUT = 6
MAX_PAGE_BYTES = 600_000
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; PlacesFinderBot/1.0)",
    "Accept-Language": "fr,en;q=0.8",
}

# Extensions / domaines qui ressemblent à des emails mais n'en sont pas
BAD_SUFFIXES = (".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif", ".bmp", ".ico", ".tiff",
                ".css", ".js", ".mjs", ".map", ".json", ".woff", ".woff2", ".ttf", ".eot", ".otf",
                ".pdf", ".mp4", ".webm")
BAD_DOMAINS = ("sentry.io", "sentry-next.wixpress.com", "sentry.wixpress.com", "wixpress.com", "example.com",
               "example.org", "example.net", "domain.com", "email.com", "yourdomain.com", "yoursite.com",
               "votredomaine.com", "monsite.com", "test.com", "mysite.com", "schema.org", "w3.org",
               "godaddy.com", "sentry.wixpress.com")
BAD_LOCALS = ("noreply", "no-reply", "donotreply", "do-not-reply", "mailer-daemon", "postmaster", "abuse",
              "privacy", "user", "username", "name", "nom", "prenom", "firstname", "lastname", "yourname",
              "youremail", "your-email", "email", "mail", "test", "exemple", "example", "john.doe", "jane.doe")
# Emails factices exacts (local@domaine) fréquemment laissés dans les templates
BAD_EXACT = ("user@domain.com", "name@domain.com", "email@domain.com", "your@email.com", "name@email.com",
             "nom@domaine.com", "prenom.nom@domaine.com", "john.doe@email.com", "info@example.com")

# Préférence : les adresses les plus adaptées à une candidature d'abord
PREFERRED_LOCALS = ("recrutement", "recruitment", "rh", "hr", "jobs", "job", "carriere", "carrieres",
                    "careers", "career", "contact", "info", "hello", "bonjour", "direction", "admin")

# --- Réseaux sociaux --------------------------------------------------------
# Chemins non-profils (partage, connexion, widgets…) par réseau
_FB_RESERVED = {"sharer", "sharer.php", "share", "share.php", "dialog", "plugins", "tr", "login", "login.php",
                "home.php", "policies", "privacy", "help", "groups", "events", "watch", "marketplace",
                "hashtag", "l.php", "permalink.php", "photo", "photo.php", "photos", "video", "videos",
                "reel", "reels", "stories", "gaming", "pages", "public", "business", "ads", "legal",
                "terms", "recover", "r.php", "about", "profile.php"}
_IG_RESERVED = {"p", "reel", "reels", "tv", "explore", "accounts", "stories", "direct", "about", "legal",
                "developer", "directory", "web", "challenge", "oauth", "privacy", "press", "api", "share"}
_SOCIAL_KEYS = ("linkedin", "facebook", "instagram")


def _is_valid(email: str) -> bool:
    e = email.lower().strip(".").strip()
    if e.endswith(BAD_SUFFIXES):
        return False
    if e in BAD_EXACT:
        return False
    local, _, domain = e.partition("@")
    if not local or not domain or "@" in domain:
        return False
    if any(domain == d or domain.endswith("." + d) for d in BAD_DOMAINS):
        return False
    if local in BAD_LOCALS:
        return False
    if re.fullmatch(r"[0-9a-f]{16,}", local):  # identifiants techniques
        return False
    # Les noms d'images type "logo@2x.png" sont déjà écartés par BAD_SUFFIXES ;
    # on écarte aussi un TLD qui n'est pas alphabétique ou trop court
    tld = domain.rsplit(".", 1)[-1]
    if not tld.isalpha() or len(tld) < 2:
        return False
    return True


def _fetch(url: str) -> Optional[str]:
    try:
        resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT, allow_redirects=True, stream=True)
        ctype = resp.headers.get("Content-Type", "")
        if resp.status_code != 200 or "html" not in ctype.lower():
            resp.close()
            return None
        content = resp.raw.read(MAX_PAGE_BYTES, decode_content=True)
        resp.close()
        encoding = resp.encoding or "utf-8"
        return content.decode(encoding, errors="replace")
    except Exception:  # noqa: BLE001
        return None


# ---------------------------------------------------------------------------
# Extraction des emails
# ---------------------------------------------------------------------------

def _deobfuscate(text: str) -> str:
    """Transforme les formats obfusqués courants en adresses email normales."""
    # Entités encodées en pourcentage / unicode courantes : %40 -> @
    text = text.replace("%40", "@").replace("&#64;", "@").replace("&#x40;", "@")
    # "nom [at] domaine [dot] com" / "nom(at)domaine.com" / "nom{at}domaine.com"
    text = _AT_BRACKETED_RE.sub("@", text)
    text = _DOT_BRACKETED_RE.sub(".", text)
    # "nom @ domaine.com"
    text = _AT_SPACED_RE.sub(r"\1@\2", text)
    # "nom at domaine dot com" (sans crochets, strict)
    def _plain(m: "re.Match[str]") -> str:
        domain = re.sub(rf"\s+{_DOT_WORDS}\s+", ".", m.group(2), flags=re.IGNORECASE)
        return f"{m.group(1)}@{domain}.{m.group(3)}"
    text = _PLAIN_WORDS_RE.sub(_plain, text)
    # Espaces résiduels autour des points d'un domaine : "domaine . com"
    text = re.sub(r"(@[A-Za-z0-9\-]+)\s*\.\s*([A-Za-z]{2,})\b", r"\1.\2", text)
    return text


def _clean_candidate(e: str) -> str:
    e = unquote(e).strip().strip(".,;:!?)>]}\"'").lower()
    return e


def _extract_emails(page: str) -> List[str]:
    text = html.unescape(page)
    found: List[str] = []

    # 1) liens mailto: (avant tout nettoyage, y compris dans les attributs)
    for m in MAILTO_RE.findall(text):
        found.append(m.split("?")[0])

    # 2) texte visible : on retire scripts/styles, puis on remplace les balises par des espaces
    #    pour que "nom<span>[at]</span>domaine" soit aussi reconnu
    visible = SCRIPT_STYLE_RE.sub(" ", text)
    visible = TAG_RE.sub("", visible)
    for source in (_deobfuscate(visible), _deobfuscate(text)):
        found.extend(EMAIL_RE.findall(source))

    cleaned: List[str] = []
    seen = set()
    for e in found:
        e = _clean_candidate(e)
        if e and e not in seen:
            seen.add(e)
            cleaned.append(e)
    return cleaned


# ---------------------------------------------------------------------------
# Extraction des profils sociaux (balises <a>)
# ---------------------------------------------------------------------------

def _normalize_href(href: str, base_url: str) -> Optional[str]:
    href = html.unescape(href).strip()
    if not href or href.lower().startswith(("mailto:", "tel:", "javascript:", "#")):
        return None
    full = urljoin(base_url, href)
    parsed = urlparse(full)
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        return None
    return full


def _host(netloc: str) -> str:
    host = netloc.lower().split(":")[0]
    for prefix in ("www.", "m.", "mobile.", "web.", "fr-fr.", "fr.", "ma."):
        if host.startswith(prefix):
            host = host[len(prefix):]
    return host


def _clean_social_url(network: str, url: str) -> Optional[str]:
    """Retourne l'URL canonique d'un profil professionnel, ou None si ce n'en est pas un."""
    p = urlparse(url)
    host = _host(p.netloc)
    segments = [s for s in p.path.split("/") if s]

    if network == "linkedin":
        if host != "linkedin.com" and not host.endswith(".linkedin.com"):
            return None
        # Pages entreprise (/company, /school, /showcase) et profils (/in)
        if len(segments) >= 2 and segments[0].lower() in ("company", "school", "showcase", "in"):
            slug = segments[1]
            if slug.lower() in ("share", "login", "signup") or slug.isdigit() and len(slug) < 3:
                return None
            return f"https://www.linkedin.com/{segments[0].lower()}/{slug}"
        return None

    if network == "facebook":
        if host not in ("facebook.com", "fb.com", "fb.me") and not host.endswith(".facebook.com"):
            return None
        if not segments or segments[0].lower() in _FB_RESERVED:
            # profile.php?id=… est un profil/page valide
            if segments and segments[0].lower() == "profile.php" and "id=" in p.query:
                return f"https://www.facebook.com/profile.php?{p.query.split('&')[0]}"
            return None
        if segments[0].lower() == "pages" and len(segments) >= 3:
            return f"https://www.facebook.com/pages/{segments[1]}/{segments[2]}"
        return f"https://www.facebook.com/{segments[0]}"

    if network == "instagram":
        if host != "instagram.com" and not host.endswith(".instagram.com") and host != "instagr.am":
            return None
        if not segments or segments[0].lower() in _IG_RESERVED:
            return None
        return f"https://www.instagram.com/{segments[0].strip('@')}/"

    return None


def _extract_socials(page: str, base_url: str = "") -> Dict[str, Optional[str]]:
    """Cherche dans les balises <a> les liens LinkedIn (entreprise), Facebook et Instagram."""
    result: Dict[str, Optional[str]] = {k: None for k in _SOCIAL_KEYS}
    personal_linkedin: Optional[str] = None
    for href in ANCHOR_HREF_RE.findall(page):
        full = _normalize_href(href, base_url)
        if not full:
            continue
        for network in _SOCIAL_KEYS:
            if result[network]:
                continue
            clean = _clean_social_url(network, full)
            if not clean:
                continue
            if network == "linkedin" and "/in/" in clean:
                personal_linkedin = personal_linkedin or clean  # secours si aucune page entreprise
                continue
            result[network] = clean
    if not result["linkedin"]:
        result["linkedin"] = personal_linkedin
    return result


# ---------------------------------------------------------------------------
# Score / orchestration
# ---------------------------------------------------------------------------

def _score(email: str, site_domain: str) -> int:
    local, _, domain = email.partition("@")
    score = 0
    base = site_domain.lower().removeprefix("www.")
    if domain == base or domain.endswith("." + base) or base.endswith("." + domain):
        score += 100  # email du même domaine que le site = très fiable
    for i, pref in enumerate(PREFERRED_LOCALS):
        if local == pref or local.startswith(pref):
            score += 50 - i
            break
    if domain in ("gmail.com", "yahoo.fr", "yahoo.com", "hotmail.com", "outlook.com", "hotmail.fr"):
        score += 10  # fréquent chez les petites structures, mais moins sûr qu'un domaine pro
    return score


def find_contact_for_site(website: Optional[str]) -> Dict[str, Optional[str]]:
    """Retourne {'email', 'linkedin', 'facebook', 'instagram'} pour un site (valeurs None si absentes)."""
    empty: Dict[str, Optional[str]] = {"email": None, **{k: None for k in _SOCIAL_KEYS}}
    if not website:
        return empty
    if not website.startswith(("http://", "https://")):
        website = "https://" + website

    parsed = urlparse(website)
    site_domain = parsed.netloc
    if not site_domain:
        return empty

    pages_to_try: List[str] = [website]
    candidates: Dict[str, int] = {}
    socials: Dict[str, Optional[str]] = {k: None for k in _SOCIAL_KEYS}

    def collect(page_html: Optional[str], page_url: str) -> None:
        if not page_html:
            return
        for e in _extract_emails(page_html):
            if _is_valid(e):
                candidates[e] = _score(e, site_domain)
        for network, link in _extract_socials(page_html, page_url).items():
            if link and not socials[network]:
                socials[network] = link

    home = _fetch(website)
    collect(home, website)

    # Liens "contact / à propos / recrutement" trouvés sur l'accueil
    if home:
        for href in HREF_RE.findall(home):
            low = href.lower()
            if any(h in low for h in CONTACT_HINTS) and not low.startswith(("mailto:", "tel:", "javascript:")):
                full = urljoin(website, href)
                if urlparse(full).netloc == site_domain and full not in pages_to_try:
                    pages_to_try.append(full)
                if len(pages_to_try) >= 4:
                    break

    base = f"{parsed.scheme}://{site_domain}"
    for path in CONTACT_PATHS:
        if len(pages_to_try) >= 6:
            break
        full = base + path
        if full not in pages_to_try:
            pages_to_try.append(full)

    for url in pages_to_try[1:]:
        has_good_email = any(s >= 100 for s in candidates.values())
        if has_good_email and all(socials.values()):
            break  # email du bon domaine + tous les profils : inutile d'aller plus loin
        if has_good_email and socials["linkedin"]:
            break  # le plus utile pour une candidature est déjà là
        collect(_fetch(url), url)

    best_email = max(candidates.items(), key=lambda kv: kv[1])[0] if candidates else None
    return {"email": best_email, **socials}


def find_email_for_site(website: Optional[str]) -> Optional[str]:
    """Retourne la meilleure adresse email trouvée pour un site, ou None (compatibilité)."""
    return find_contact_for_site(website)["email"]


def enrich_with_emails(results: List[dict], max_workers: int = 12) -> None:
    """Ajoute les clés 'email', 'linkedin', 'facebook' et 'instagram' à chaque résultat (en place), en parallèle."""
    cache: Dict[str, Dict[str, Optional[str]]] = {}
    blank: Dict[str, Optional[str]] = {"email": None, **{k: None for k in _SOCIAL_KEYS}}

    def work(place: dict) -> None:
        site = place.get("site_web")
        if not site:
            place.update(blank)
            return
        if site not in cache:
            cache[site] = find_contact_for_site(site)
        place.update(cache[site])

    with ThreadPoolExecutor(max_workers=max_workers) as pool:
        list(pool.map(work, results))
