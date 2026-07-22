# Weeb — Fil Rouge

API REST Django pour le blog Weeb : authentification JWT, articles, contact, monitoring et Sentry.

## Stack

- Python 3.11 / Django 5
- Django REST Framework + SimpleJWT
- django-cors-headers, django-environ
- SQLite (dev) — Postgres recommandé en production
- Sentry (optionnel)
- Docker + GitHub Actions

## Démarrage rapide

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # Windows — cp sur Linux/macOS

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

- API : http://localhost:8000/api/
- Admin : http://localhost:8000/admin/
- Health : http://localhost:8000/api/health/

Copiez `backend/.env.example` vers `backend/.env` et adaptez les variables.

## Configuration

| Variable | Description |
|----------|-------------|
| `DJANGO_SETTINGS_MODULE` | `config.development` ou `config.production` |
| `SECRET_KEY` | Clé secrète Django |
| `DATABASE_URL` | URL de base (SQLite ou Postgres) |
| `FRONTEND_URL` | URL du frontend (liens reset password) |
| `SENTRY_DSN` | DSN Sentry (optionnel) |
| `ALLOWED_HOSTS` | Domaines autorisés (production) |
| `CORS_ALLOWED_ORIGINS` | Origines CORS (production) |

Voir `backend/.env.example` pour la liste complète.

## Endpoints principaux

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/auth/signup/` | Public | Inscription (`is_active=False`) |
| POST | `/api/auth/login/` | Public | Connexion JWT + cookies HttpOnly |
| POST | `/api/auth/logout/` | Public | Déconnexion (blacklist refresh) |
| POST | `/api/auth/refresh/` | Public | Rafraîchissement du token |
| GET | `/api/auth/me/` | Bearer | Profil courant |
| GET | `/api/auth/me/export/` | Bearer | Export RGPD |
| DELETE | `/api/auth/me/delete/` | Bearer | Suppression de compte |
| GET | `/api/auth/admin/users/` | Staff | Liste des utilisateurs |
| PATCH | `/api/auth/admin/users/<id>/` | Staff | Activation d'un compte |
| GET | `/api/articles/` | Public | Liste paginée des articles |
| POST | `/api/articles/` | Actif | Création d'un article |
| GET/PUT/PATCH/DELETE | `/api/articles/<id>/` | Public / auteur | Détail et modification |
| POST | `/api/contacts/` | Public | Formulaire de contact |
| GET | `/api/contacts/` | Staff | Liste des messages |
| GET | `/api/health/` | Public | Santé API + base de données |
| GET | `/api/monitoring/metrics/` | Staff | Métriques de performance |

## Structure du backend

```
backend/
├── config/           # settings dev / prod
├── weeb/             # projet Django (settings, urls)
├── users/            # auth JWT, profil, admin users
├── articles/         # CRUD blog
├── contacts/         # formulaire de contact
├── monitoring/       # health, métriques, Sentry
├── tests/            # suite pytest
├── Dockerfile
└── requirements.txt
```

## Tests

```bash
cd backend

# Windows
.\run_tests.ps1

# Linux / macOS / CI
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 pytest -p django -v
```

La CI GitHub (`.github/workflows/backend-ci.yml`) exécute `check`, `migrate` et les 26 tests à chaque push sur `backend/`.

## Docker

```bash
cd backend
docker build -t weeb-backend .

docker run --rm -p 8000:8000 \
  -e SECRET_KEY=votre-cle-secrete \
  -e ALLOWED_HOSTS=localhost,127.0.0.1 \
  -e DATABASE_URL=sqlite:///db.sqlite3 \
  weeb-backend
```

En production, fournissez une `DATABASE_URL` Postgres et les variables listées dans `.env.example`.

## Rôles utilisateurs

- **Anonyme** : lecture du blog, contact, signup, login.
- **En attente** (`is_active=False`) : ne peut pas se connecter.
- **Validé** (`is_active=True`) : CRUD sur ses propres articles.
- **Staff** (`is_staff=True`) : admin Django, métriques, gestion des utilisateurs et messages contact.

## Sécurité et RGPD

- Rate limiting auth (10 req/min) et contact (5 req/min).
- Reset password anti-énumération.
- Export et suppression de compte (`/api/auth/me/export/`, `/api/auth/me/delete/`).
- Consentement obligatoire sur le formulaire contact.
- Headers de sécurité activés en production (`config.production`).
