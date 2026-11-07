# Passer Forsa de SQLite à Supabase

Forsa utilisait un fichier `users.db` (SQLite). Il utilise maintenant **Postgres sur Supabase**.
Les comptes, sessions, profils, CV et candidatures sont dans la même base, sur Internet.
Les routes de l'API et le site (dossier `static/`) ne changent pas.

## 1. Créer le projet Supabase

1. Va sur <https://supabase.com>, crée un projet et choisis une région proche de tes utilisateurs.
2. Note le **mot de passe de la base** demandé à la création (tu peux le réinitialiser plus tard dans
   *Project Settings → Database*).

## 2. Récupérer l'adresse de connexion

1. Dans ton projet, clique sur **Connect** (en haut de la page).
2. Choisis **Session pooler** et copie la chaîne. Elle ressemble à :
   `postgresql://postgres.abcdefgh:[YOUR-PASSWORD]@aws-0-eu-west-3.pooler.supabase.com:5432/postgres`
3. Remplace `[YOUR-PASSWORD]` par ton mot de passe.
   Si ton mot de passe contient `@ : / ? # %`, encode ces caractères (`@` devient `%40`, `#` devient `%23`…),
   ou mets un mot de passe sans caractères spéciaux.

> **Pourquoi « Session pooler » ?** La connexion « Direct » de Supabase n'accepte que l'IPv6 : elle échoue
> sur beaucoup de réseaux (maison, 4G, certains hébergeurs). Le Session pooler marche partout et convient
> à un serveur qui reste allumé comme `uvicorn`. Le « Transaction pooler » (port 6543) fonctionne aussi.

## 3. Configurer le projet

Ouvre ton fichier `.env` (il n'est pas dans ce zip, pour ne pas écraser tes clés) et **ajoute une ligne** :

```
DATABASE_URL=postgresql://postgres.abcdefgh:ton_mot_de_passe@aws-0-eu-west-3.pooler.supabase.com:5432/postgres
```

Puis installe les nouvelles dépendances :

```
python -m pip install -r requirements.txt
```

Forsa se connecte à Postgres avec **pg8000**, un pilote écrit uniquement en Python. Il n'embarque aucune DLL,
donc il fonctionne aussi sur les PC Windows où « Smart App Control / Application Control » bloque les fichiers
compilés (c'était le cas de `psycopg`). Si tu avais installé `psycopg`, tu peux le supprimer :
`python -m pip uninstall psycopg psycopg_binary psycopg_pool`.

## 4. Copier tes données existantes

Dans le dossier du projet (là où se trouve `users.db`) :

```
python migrate_sqlite_to_supabase.py --dry-run     # compte ce qui sera copié, n'écrit rien
python migrate_sqlite_to_supabase.py               # copie réellement
```

- Le script crée les tables, copie comptes, sessions encore valides, profils (CV compris), candidatures
  et codes en attente, en gardant les mêmes identifiants.
- Tu peux le relancer sans risque : les lignes déjà copiées sont ignorées.
- Il ne modifie jamais `users.db`. **Garde ce fichier comme sauvegarde** tant que tu n'as pas vérifié
  que tout fonctionne.
- Les utilisateurs actuels restent connectés et gardent leur mot de passe.

## 5. Lancer l'application

```
uvicorn app:app --reload
```

Les tables sont créées automatiquement si elles n'existent pas. Pour vérifier : Supabase → **Table Editor**
doit montrer `users`, `sessions`, `candidates`, `applications`, `email_codes`.

> Si tu préfères créer les tables toi-même, exécute `supabase_schema.sql` dans *SQL Editor*. C'est facultatif.

## 6. Mise en ligne

Sur ton hébergeur, ajoute la variable d'environnement `DATABASE_URL` (comme pour `GOOGLE_MAPS_API_KEY`).
Ne publie jamais le fichier `.env` ni cette adresse : elle donne un accès total à la base.

## Sécurité : à savoir

- Supabase publie les tables du schéma `public` via une API ouverte avec la clé « anon ». Forsa **active
  la Row Level Security sans aucune règle** sur toutes ses tables : cette API ne peut donc rien lire,
  même si quelqu'un trouve la clé anon. Ton serveur, lui, se connecte directement à Postgres.
  **N'ajoute jamais de règle « autoriser tout » sur ces tables** (elles contiennent les mots de passe hachés et les CV).
- La clé `service_role` de Supabase n'est **pas** utilisée par Forsa. Ne la mets nulle part.

## Ce qui n'a pas changé (et pourquoi)

- Les dates restent du texte ISO (`2026-10-12T10:00:00+00:00`), comme avant. Aucun risque de décalage ;
  on pourra passer à de vrais types `timestamptz` plus tard.
- Les CV envoyés restent stockés dans la base (colonne `cv_blob`, 8 Mo maximum par fichier). Le plan gratuit
  de Supabase offre 500 Mo de base. Si tu as beaucoup de CV, l'étape suivante serait *Supabase Storage*.

## Problèmes fréquents

| Message | Cause et solution |
|---|---|
| `DATABASE_URL est manquante` | La ligne n'est pas dans `.env`, ou le fichier n'est pas à côté de `app.py`. |
| `password authentication failed` | Mauvais mot de passe, ou caractère spécial non encodé. Réinitialise-le dans *Project Settings → Database*. |
| `could not translate host name` / délai dépassé | Tu utilises la connexion « Direct » (IPv6). Prends la chaîne **Session pooler**. |
| `Tenant or user not found` | Le nom d'utilisateur doit être `postgres.<ref>` (avec le point) pour le pooler : recopie la chaîne depuis *Connect*. |
| `DLL load failed … Application Control policy` | Tu utilises encore l'ancienne version de `db.py` (pilote `psycopg`). Remplace `db.py` par celui de ce zip : il utilise `pg8000`, sans DLL. |
| `remaining connection slots are reserved` | Trop de connexions : baisse `DB_POOL_MAX` dans `.env` (ex. `DB_POOL_MAX=5`). |
