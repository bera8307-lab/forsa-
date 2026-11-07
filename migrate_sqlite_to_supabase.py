"""Copie les données de l'ancien fichier SQLite (users.db) vers Supabase.

Usage (depuis le dossier du projet, avec DATABASE_URL dans .env) :

    python migrate_sqlite_to_supabase.py                 # lit ./users.db
    python migrate_sqlite_to_supabase.py chemin/users.db # autre fichier
    python migrate_sqlite_to_supabase.py --dry-run       # compte seulement, n'écrit rien

Sans danger si on le relance : les lignes déjà copiées sont ignorées (ON CONFLICT DO NOTHING),
et le fichier SQLite n'est jamais modifié. Les identifiants (users.id, applications.id…)
sont conservés, donc les sessions, candidatures et CV restent rattachés au bon compte.
"""

import argparse
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

import auth
import db
import documents

# Ordre imposé par les clés étrangères (users d'abord).
TABLES = ["users", "sessions", "candidates", "applications", "email_codes"]
IDENTITY_TABLES = ["users", "applications", "email_codes"]


def read_sqlite(path: Path) -> dict:
    conn = sqlite3.connect(f"file:{path}?mode=ro", uri=True)  # lecture seule
    conn.row_factory = sqlite3.Row
    data = {}
    existing = {r["name"] for r in conn.execute("SELECT name FROM sqlite_master WHERE type = 'table'")}
    for table in TABLES:
        if table not in existing:
            data[table] = []
            continue
        data[table] = [dict(r) for r in conn.execute(f"SELECT * FROM {table}")]
    conn.close()
    return data


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("sqlite_path", nargs="?", default=str(Path(__file__).parent / "users.db"))
    parser.add_argument("--dry-run", action="store_true", help="affiche ce qui serait copié, sans rien écrire")
    args = parser.parse_args()

    path = Path(args.sqlite_path)
    if not path.is_file():
        print(f"Fichier introuvable : {path}")
        return 1

    data = read_sqlite(path)
    print(f"Source SQLite : {path}")
    for table in TABLES:
        print(f"  {table:<13} {len(data[table]):>5} ligne(s)")

    if args.dry_run:
        print("\n--dry-run : rien n'a été écrit.")
        return 0

    # Crée les tables (même schéma que l'application) si elles n'existent pas encore.
    auth.init_db()
    documents.init_db()

    now = datetime.now(timezone.utc)
    inserted = {}
    skipped_sessions = 0

    with db.get_connection() as conn:
        for table in TABLES:
            rows = data[table]
            if table == "sessions":
                # Inutile de recopier des sessions déjà expirées.
                live = [r for r in rows if datetime.fromisoformat(r["expires_at"]) >= now]
                skipped_sessions = len(rows) - len(live)
                rows = live
            count = 0
            for row in rows:
                columns = list(row.keys())
                placeholders = ", ".join("?" for _ in columns)
                cursor = conn.execute(
                    f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({placeholders}) ON CONFLICT DO NOTHING",
                    tuple(row[c] for c in columns),
                )
                count += cursor.rowcount
            inserted[table] = count

        # Les identifiants ont été copiés tels quels : on avance les compteurs pour que
        # les prochaines inscriptions / candidatures ne réutilisent pas un id existant.
        for table in IDENTITY_TABLES:
            conn.execute(
                f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), "
                f"COALESCE((SELECT MAX(id) FROM {table}), 1), (SELECT COUNT(*) > 0 FROM {table}))"
            )

    print("\nCopié vers Supabase :")
    for table in TABLES:
        extra = f"  ({skipped_sessions} session(s) expirée(s) ignorée(s))" if table == "sessions" and skipped_sessions else ""
        already = len(data[table]) - inserted[table] - (skipped_sessions if table == "sessions" else 0)
        note = f", {already} déjà présente(s)" if already > 0 else ""
        print(f"  {table:<13} {inserted[table]:>5} ajoutée(s){note}{extra}")

    print("\nVérification :")
    ok = True
    with db.get_connection() as conn:
        for table in TABLES:
            total = conn.execute(f"SELECT COUNT(*) AS n FROM {table}").fetchone()["n"]
            expected = len(data[table]) - (skipped_sessions if table == "sessions" else 0)
            status = "OK" if total >= expected else "MANQUANT"
            ok = ok and total >= expected
            print(f"  {table:<13} Supabase : {total:>5}   attendu au moins : {expected:>5}   {status}")

    db.close_pool()
    print("\nMigration terminée." if ok else "\nATTENTION : des lignes manquent, ne supprime pas users.db.")
    return 0 if ok else 2


if __name__ == "__main__":
    sys.exit(main())
