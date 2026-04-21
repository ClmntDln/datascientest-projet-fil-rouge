# Weeb — Projet Fil Rouge

Application full stack : API **Django REST** avec authentification **JWT**, interface **React (Vite)**.

## Structure

- `backend/` — Projet Django `weeb` (apps `users`, `articles`, `contacts`), SQLite en développement
- `frontend/` — SPA React, client HTTP vers `/api`

## Prérequis

- Python 3.10+
- Node.js 20+ (recommandé pour Vite 7)

## Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py runserver
```

L’API est exposée sous `http://127.0.0.1:8000/api/` (auth : `api/auth/`, articles : `api/articles/`, contacts : `api/contacts/`). L’admin Django : `http://127.0.0.1:8000/admin/`.

### Données de démonstration (optionnel)

```bash
python manage.py seed
```

Crée notamment un superuser `admin@weeb.local` / `admin1234`, un rédacteur `redacteur@weeb.local` / `redacteur1234` et des articles de démo.

## Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Par défaut, l’URL de l’API est `http://localhost:8000/api` (variable `VITE_API_URL`). Le serveur de dev Vite écoute en général sur le port **5173** ; les origines CORS correspondantes sont déjà prévues côté backend.

## Variables d’environnement

- Backend : voir `backend/.env.example` (`SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`)
- Frontend : voir `frontend/.env.example` (`VITE_API_URL`)

En production, définir une `SECRET_KEY` forte, `DEBUG=False`, des hôtes et origines CORS adaptés.
