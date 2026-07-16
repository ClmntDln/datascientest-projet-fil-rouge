# Weeb — Backend Django

API REST du projet Weeb (blog, contact, authentification JWT).

## Stack

- Django 5 / Python 3.11+
- Django REST Framework
- djangorestframework-simplejwt (authentification JWT)
- django-cors-headers (CORS pour le frontend Vite)
- SQLite (base par défaut)

## Installation

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
copy .env.example .env          # Windows
# cp .env.example .env          # macOS / Linux

python manage.py migrate
python manage.py seed           # crée un admin et des articles de démo
python manage.py runserver
```

Si vous voyez `no such table: users_user`, exécutez d'abord `python manage.py makemigrations` (les fichiers de migration sont versionnés dans le dépôt), puis `python manage.py migrate`.

Si Django signale `InconsistentMigrationHistory` (base créée sans le modèle `User` personnalisé), en **développement uniquement** vous pouvez supprimer le fichier `db.sqlite3` à la racine du dossier `backend`, puis relancer `python manage.py migrate`.

Par défaut, l'API est servie sur `http://localhost:8000/api/` et l'admin Django sur `http://localhost:8000/admin/`.

Identifiants de démonstration créés par `seed` :
- Admin : `admin@weeb.local` / `admin1234`
- Rédacteur validé : `redacteur@weeb.local` / `redacteur1234`

## Endpoints

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/auth/signup/` | publique | Inscription (crée un compte `is_active=False`) |
| POST | `/api/auth/login/` | publique | Connexion JWT (refusée si compte non validé) |
| POST | `/api/auth/refresh/` | publique | Rafraîchit un access token |
| POST | `/api/auth/reset-password/request/` | publique | Demande de reset (uid/token en DEBUG) |
| POST | `/api/auth/reset-password/confirm/` | publique | Confirme le reset avec uid + token |
| GET  | `/api/auth/me/` | Bearer | Profil de l'utilisateur courant |
| GET  | `/api/auth/me/export/` | Bearer | Export RGPD des données personnelles |
| DELETE | `/api/auth/me/delete/` | Bearer | Suppression du compte (RGPD) |
| GET  | `/api/health/` | publique | État de santé de l'API et de la base |
| GET  | `/api/monitoring/metrics/` | Bearer staff | Indicateurs de performance et seuils d'alerte |
| GET  | `/api/articles/` | publique | Liste des articles (paginée) |
| POST | `/api/articles/` | Bearer (`is_active`) | Création d'un article |
| GET  | `/api/articles/<id>/` | publique | Détail d'un article |
| PUT/PATCH | `/api/articles/<id>/` | auteur | Modification |
| DELETE | `/api/articles/<id>/` | auteur | Suppression |
| POST | `/api/contacts/` | publique | Soumission du formulaire de contact (`consent_given` requis) |

## Rôles utilisateurs

- **Anonyme** : lecture du blog, formulaire de contact, signup, login.
- **En attente de validation** (`is_active=False`) : ne peut pas se connecter tant qu'un admin ne l'active pas.
- **Validé** (`is_active=True`) : connexion, création et gestion de ses propres articles.
- **Administrateur** (`is_staff=True`) : accès à `/admin/` pour gérer utilisateurs, articles et messages.

## Structure

```
backend/
  manage.py
  requirements.txt
  .env.example
  weeb/                 # projet Django (settings, urls)
  apps/
    users/              # User custom + auth (signup, login JWT, me, reset)
    articles/           # modèle + ViewSet CRUD + IsOwnerOrReadOnly
    contacts/           # formulaire de contact public
    monitoring/       # health check /api/health/
```

## Monitoring

- **Health check** : `GET /api/health/` retourne `{"status": "ok", "database": "ok"}`.
- **Métriques** : `GET /api/monitoring/metrics/` (staff) — requêtes, taux d'erreur, latence moyenne/P95.
- **Alertes** : log + Sentry si taux d'erreur ou latence P95 dépassent les seuils (`MONITORING_*` dans `.env`).
- **Sentry** : définir `SENTRY_DSN` dans `.env` pour activer le suivi des erreurs (optionnel en dev).

## Sécurité et RGPD

- Rate limiting sur les endpoints d'authentification (10 req/min).
- Export des données : `GET /api/auth/me/export/`.
- Suppression de compte : `DELETE /api/auth/me/delete/` (interdit pour les comptes staff).
- Consentement obligatoire sur le formulaire de contact (`consent_given: true`).
- Headers de sécurité activés automatiquement quand `DEBUG=False`.

## Tests

```bash
pip install -r requirements-dev.txt
pytest
```

## Activer un utilisateur

Depuis l'admin Django (`/admin/users/user/`) : sélectionner les utilisateurs concernés et exécuter l'action « Activer les utilisateurs sélectionnés », ou cocher `is_active` individuellement.