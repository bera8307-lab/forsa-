"""Connexion à la base de données Postgres (Supabase).

Remplace l'ancien fichier SQLite (users.db). Le reste du code continue d'écrire :

    with get_connection() as conn:
        row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()

… et cette couche s'occupe du reste :
  - les `?` sont convertis en `%s` (syntaxe de pg8000) ;
  - chaque ligne est un dict : row["email"] fonctionne comme avant ;
  - `with` valide la transaction (COMMIT) si tout va bien, l'annule (ROLLBACK) en cas
    d'erreur, puis rend la connexion au pool ;
  - un petit pool de connexions évite de rouvrir une connexion TLS à chaque requête.

Pilote : pg8000, écrit uniquement en Python. Contrairement à psycopg, il n'embarque aucune DLL,
donc Windows (Smart App Control / Application Control) n'a rien à bloquer.

Configuration (fichier .env) :
    DATABASE_URL=postgresql://postgres.<ref>:<mot_de_passe>@aws-0-<region>.pooler.supabase.com:5432/postgres
    DB_POOL_MAX=10            # optionnel : nombre maximum de connexions simultanées
"""

import collections
import os
import ssl
import threading
import time
from typing import Any, Dict, List, Optional, Sequence
from urllib.parse import parse_qs, unquote, urlparse

import pg8000.dbapi
from dotenv import load_dotenv

load_dotenv()

CONNECT_TIMEOUT_SECONDS = 20
POOL_WAIT_SECONDS = 30      # attente maximale d'une connexion libre quand le pool est plein
IDLE_CHECK_SECONDS = 10     # une connexion restée inactive plus longtemps est testée avant réutilisation
IDLE_MAX_SECONDS = 300      # une connexion inactive depuis plus longtemps est fermée

_LOCAL_HOSTS = ("localhost", "127.0.0.1", "::1")


def _parse_database_url() -> Dict[str, Any]:
    url = (os.getenv("DATABASE_URL") or "").strip()
    if not url:
        raise RuntimeError(
            "DATABASE_URL est manquante. Ajoute-la dans ton fichier .env : "
            "dans Supabase, clique sur « Connect » en haut du projet, copie la chaîne "
            "« Session pooler » et remplace [YOUR-PASSWORD] par le mot de passe de ta base."
        )
    parsed = urlparse(url)
    if parsed.scheme not in ("postgresql", "postgres") or not parsed.hostname:
        raise RuntimeError(
            "DATABASE_URL n'est pas valide. Elle doit ressembler à "
            "postgresql://utilisateur:mot_de_passe@hote:5432/postgres"
        )
    host = parsed.hostname
    sslmode = (parse_qs(parsed.query).get("sslmode") or [""])[0].lower()
    use_ssl = sslmode != "disable" and (sslmode != "" or host.lower() not in _LOCAL_HOSTS)

    ssl_context = None
    if use_ssl:
        # Équivalent de sslmode=require : connexion chiffrée (TLS), sans vérifier le certificat.
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE

    return {
        "user": unquote(parsed.username or "postgres"),
        "password": unquote(parsed.password) if parsed.password else None,
        "host": host,
        "port": parsed.port or 5432,
        "database": (parsed.path or "/postgres").lstrip("/") or "postgres",
        "ssl_context": ssl_context,
        "timeout": CONNECT_TIMEOUT_SECONDS,
        "application_name": "forsa",
    }


# --------------------------------------------------------------------------
# Pool de connexions
# --------------------------------------------------------------------------

class _Pool:
    def __init__(self, max_size: int) -> None:
        self._slots = threading.BoundedSemaphore(max_size)
        self._idle: "collections.deque" = collections.deque()  # (connexion, instant de retour)
        self._lock = threading.Lock()
        self._params = _parse_database_url()

    def _connect(self):
        return pg8000.dbapi.connect(**self._params)

    @staticmethod
    def _close_quietly(conn) -> None:
        try:
            conn.close()
        except Exception:
            pass

    def getconn(self):
        if not self._slots.acquire(timeout=POOL_WAIT_SECONDS):
            raise RuntimeError(
                "Trop de connexions simultanées à la base de données. "
                "Réessaie dans un instant (ou augmente DB_POOL_MAX)."
            )
        try:
            while True:
                with self._lock:
                    item = self._idle.pop() if self._idle else None  # la plus récente d'abord
                if item is None:
                    return self._connect()
                conn, since = item
                idle_for = time.monotonic() - since
                if idle_for > IDLE_MAX_SECONDS:
                    self._close_quietly(conn)
                    continue
                if idle_for > IDLE_CHECK_SECONDS:
                    # Le pooler Supabase ferme les connexions inactives : on vérifie qu'elle répond.
                    try:
                        cur = conn.cursor()
                        cur.execute("SELECT 1")
                        cur.fetchall()
                        conn.rollback()
                    except Exception:
                        self._close_quietly(conn)
                        continue
                return conn
        except BaseException:
            self._slots.release()
            raise

    def putconn(self, conn, discard: bool = False) -> None:
        try:
            if discard:
                self._close_quietly(conn)
            else:
                with self._lock:
                    self._idle.append((conn, time.monotonic()))
        finally:
            self._slots.release()

    def close(self) -> None:
        with self._lock:
            while self._idle:
                conn, _ = self._idle.pop()
                self._close_quietly(conn)


_pool: Optional[_Pool] = None
_pool_lock = threading.Lock()


def get_pool() -> _Pool:
    """Crée le pool au premier appel (après le chargement du .env)."""
    global _pool
    if _pool is None:
        with _pool_lock:
            if _pool is None:
                _pool = _Pool(max_size=max(1, int(os.getenv("DB_POOL_MAX", "10"))))
    return _pool


def close_pool() -> None:
    global _pool
    with _pool_lock:
        if _pool is not None:
            _pool.close()
            _pool = None


# --------------------------------------------------------------------------
# Connexion « façon sqlite3 »
# --------------------------------------------------------------------------

def _to_postgres(sql: str) -> str:
    """`?` (SQLite) → `%s` (pg8000). Les `%` littéraux sont protégés."""
    return sql.replace("%", "%%").replace("?", "%s")


class Cursor:
    """Résultat d'une requête : lignes sous forme de dict, comme sqlite3.Row."""

    def __init__(self, cursor) -> None:
        self._cursor = cursor
        desc = cursor.description
        self._columns: Optional[List[str]] = (
            [c[0].decode() if isinstance(c[0], bytes) else c[0] for c in desc] if desc else None
        )

    @property
    def rowcount(self) -> int:
        return self._cursor.rowcount

    def _as_dict(self, values: Sequence[Any]) -> Dict[str, Any]:
        return dict(zip(self._columns, values))

    def fetchone(self) -> Optional[Dict[str, Any]]:
        if self._columns is None:
            return None
        values = self._cursor.fetchone()
        return None if values is None else self._as_dict(values)

    def fetchall(self) -> List[Dict[str, Any]]:
        if self._columns is None:
            return []
        return [self._as_dict(values) for values in self._cursor.fetchall()]


class Connection:
    """Même usage que l'ancien sqlite3.Connection : `with get_connection() as conn:`."""

    def __init__(self) -> None:
        self._pool = get_pool()
        self._conn = None
        self._broken = False

    def __enter__(self) -> "Connection":
        self._conn = self._pool.getconn()
        self._broken = False
        return self

    def __exit__(self, exc_type, exc, tb) -> bool:
        conn, self._conn = self._conn, None
        discard = self._broken
        try:
            if exc_type is None:
                try:
                    conn.commit()
                except pg8000.dbapi.InterfaceError as err:
                    # Transaction déjà en erreur (requête échouée puis exception rattrapée) :
                    # pour Postgres, COMMIT équivaut alors à ROLLBACK, sans lever d'erreur.
                    if "failed transaction" not in str(err):
                        raise
                    conn.rollback()
            else:
                conn.rollback()
        except Exception:
            # Connexion coupée : on ne la réutilise pas. Si c'était le COMMIT, l'erreur remonte.
            self._pool.putconn(conn, discard=True)
            if exc_type is None:
                raise
            return False
        self._pool.putconn(conn, discard=discard)
        return False  # ne masque jamais l'exception

    def execute(self, sql: str, params: Sequence[Any] = ()) -> Cursor:
        """Exécute une requête ; renvoie un curseur (fetchone / fetchall / rowcount)."""
        if self._conn is None:
            raise RuntimeError("get_connection() doit être utilisé avec « with ».")
        cursor = self._conn.cursor()
        try:
            if params:
                cursor.execute(_to_postgres(sql), tuple(params))
            else:
                cursor.execute(sql)
        except (pg8000.dbapi.InterfaceError, OSError):
            self._broken = True
            raise
        return Cursor(cursor)


def get_connection() -> Connection:
    return Connection()
