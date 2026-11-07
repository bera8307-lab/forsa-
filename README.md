# Forsa

Petit site pour lancer des recherches Google Places (plusieurs mots-clés à la fois, avec déduplication) sans passer par un notebook. La clé API reste côté serveur, jamais visible dans le navigateur.

## 1. Prérequis

- Python 3.9+
- Une clé API Google avec la **Places API (New)** activée dans Google Cloud Console
- Idéalement, restreins cette clé (dans Google Cloud Console) à l'API "Places API (New)" uniquement, et si possible à l'IP de ton serveur

## 2. Installation

```bash
cd places-finder
python -m venv venv
source venv/bin/activate        # sous Windows : venv\Scripts\activate
pip install -r requirements.txt
```

## 3. Configuration de la clé API

```bash
cp .env.example .env
```

Puis ouvre `.env` et remplace la valeur :

```
GOOGLE_MAPS_API_KEY=ta_vraie_cle_ici
```

## 4. Lancer le site

```bash
uvicorn app:app --reload --port 8000
```

Ouvre ensuite `http://localhost:8000` dans ton navigateur.

## 5. Utiliser le site

1. Colle un mot-clé par ligne dans le champ "Mots-clés" (ex : `agence intelligence artificielle Marrakech`, `consultant IA Marrakech`, `startups Marrakech`).
2. Choisis la langue et, si tu veux, un code pays (ex : `MA`) pour cibler les résultats.
3. Clique sur "Lancer la recherche" : le serveur interroge Google Places pour chaque ligne, fusionne les résultats et retire les doublons (même `place_id`).
4. Le tableau affiche nom, catégorie, adresse, téléphone, site web, note, avis et lien Google Maps.
5. Boutons "Exporter CSV" / "Exporter Excel" pour télécharger les résultats, comme le faisait le notebook d'origine.

## 7. Postuler avec un CV et une lettre de motivation générés par l'IA

Un bouton **"Mon CV"** est disponible en haut à droite, à côté du profil et des favoris.

- **Téléverser un CV existant** (PDF, Word ou .txt, 8 Mo max), ou
- **Générer un CV avec l'IA** : remplis un petit formulaire (nom, poste recherché, formation, expérience, compétences, langues) et l'IA rédige un CV structuré à partir de ce que tu as saisi (rien n'est inventé). Le résultat reste **modifiable** directement dans la fenêtre avant d'être enregistré ou téléchargé en .txt.

Chaque ligne de résultat a maintenant un bouton **"Postuler"** :
1. Renseigne (optionnellement) le poste visé et quelques précisions.
2. Clique sur **"Générer la lettre avec l'IA"** : une lettre de motivation personnalisée est rédigée à partir de ton profil et des infos de l'entreprise (nom, adresse, catégorie).
3. La lettre est **entièrement modifiable** dans la zone de texte.
4. **"Enregistrer la candidature"** garde une trace (le bouton devient "✓ Postulé"), ou **"Télécharger (.txt)"** pour l'envoyer toi-même.

Pour activer la génération IA, ajoute une clé Groq dans `.env` (clé gratuite sur console.groq.com) :

```
GROQ_API_KEY=ta_vraie_cle_ici
GROQ_MODEL=llama-3.3-70b-versatile
```

Sans cette clé, le reste du site (recherche, favoris, upload de CV brut) fonctionne normalement ; seules la génération de CV et de lettre de motivation renverront une erreur explicite tant que la clé n'est pas renseignée.

## 7bis. Emails des entreprises + envoi automatique

**Récupération de l'email (pendant la recherche).** Google Places ne fournit pas d'email. Pour chaque résultat qui a un site web, le serveur visite la page d'accueil et quelques pages « contact / à propos / recrutement », puis extrait les adresses (liens `mailto:` et texte). Il garde la plus pertinente (même domaine que le site, préfixes `recrutement`, `rh`, `contact`, `info`...). L'email apparaît sous le téléphone dans le tableau et dans les exports CSV/Excel. Les entreprises sans site web ou sans email publié n'auront pas d'email : tu peux le saisir à la main dans la fenêtre « Postuler ».

**Envoi.** Dans « Postuler », le champ *Email de l'entreprise* est pré-rempli. Le bouton **Envoyer par email** envoie le message (la lettre, modifiable) avec ton CV en pièce jointe depuis ton compte SMTP, avec ton email en *Reply-To* (les réponses arrivent chez toi). La candidature passe en statut « Envoyé ».

Configuration dans `.env` (Gmail : mot de passe d'application obligatoire) :

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ton.adresse@gmail.com
SMTP_PASSWORD=mot_de_passe_application
```

## 8. Déploiement

Pour le mettre en ligne (Render, Railway, un VPS...), garde `GOOGLE_MAPS_API_KEY` comme variable d'environnement du serveur — ne la mets jamais dans le code ou dans un fichier envoyé au navigateur.

## Limites connues

- Chaque requête texte Google Places retourne au maximum 20 résultats (pas de pagination automatique dans cette première version).
- Le CV téléversé (PDF/Word) est stocké tel quel mais **son contenu n'est pas extrait** : la lettre de motivation s'appuie sur les champs de profil saisis dans "Mon CV", pas sur le texte du fichier téléversé.
- La génération IA (CV + lettre) nécessite une clé `GROQ_API_KEY` valide et une connexion internet depuis le serveur.

## Inscription : données collectées

Le formulaire d'inscription demande : prénom, nom, téléphone, email, date de naissance et mot de passe.
Chaque nouvelle inscription est enregistrée :

- dans la base Postgres Supabase (voir `SUPABASE_SETUP.md`), utilisée par l'application ;
- dans `signups.csv` (créé automatiquement à côté de `app.py`, ouvrable avec Excel). Le mot de passe n'y figure jamais.

Colonnes de `signups.csv` : `id, first_name, last_name, phone, email, birth_date, created_at`.
Les tables sont créées et mises à jour automatiquement au démarrage (nouvelles colonnes ajoutées).

## Vérification de l'email et mot de passe oublié

- **Nouvelle inscription** : après le formulaire, un code à 6 chiffres est envoyé par email (page `verify-email.html`).
  Le compte n'est actif, et la ligne n'est ajoutée à `signups.csv`, qu'après saisie du bon code.
  Tant que l'email n'est pas vérifié, la connexion renvoie vers la page de saisie du code.
- **Mot de passe oublié** : lien sur la page de connexion (`forgot-password.html`). L'utilisateur reçoit un code,
  puis choisit un nouveau mot de passe. Toutes ses sessions ouvertes sont fermées.
- Les codes sont valables 15 minutes, limités à 5 essais, et un renvoi n'est possible qu'après 60 secondes.
  Ils sont stockés hachés dans la table `email_codes` de la base Supabase.
- Les comptes créés avant cette fonction sont automatiquement considérés comme vérifiés.
- Les emails partent via les réglages SMTP du fichier `.env` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`).
  Si les emails n'arrivent pas, regarde les messages dans la console du serveur.

## Tutoriel guidé

Un bouton **Tutoriel** (barre du haut, et menu latéral) lance une visite guidée de l'application en 11 étapes.
Il est visible pour tous les utilisateurs, nouveaux comme anciens : il ne dépend d'aucune donnée du compte.
Un petit point lumineux signale le bouton tant qu'il n'a jamais été ouvert sur le navigateur.

- Le code est dans `static/tutorial.js` : les textes (français / anglais) et la liste des étapes sont en haut du fichier.
- Pour ajouter une étape : ajouter son texte dans `STR.fr.steps` et `STR.en.steps`, puis une ligne dans `STEPS`
  avec le sélecteur CSS de l'élément à mettre en avant.
- Clavier : flèches gauche / droite pour naviguer, Échap pour quitter.
