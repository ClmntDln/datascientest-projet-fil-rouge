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
| POST | `/api/auth/reset-password/` | publique | Réinitialise le mot de passe (démo) |
| GET  | `/api/auth/me/` | Bearer | Profil de l'utilisateur courant |
| GET  | `/api/articles/` | publique | Liste des articles |
| POST | `/api/articles/` | Bearer (`is_active`) | Création d'un article |
| GET  | `/api/articles/<id>/` | publique | Détail d'un article |
| PUT/PATCH | `/api/articles/<id>/` | auteur | Modification |
| DELETE | `/api/articles/<id>/` | auteur | Suppression |
| POST | `/api/contacts/` | publique | Soumission du formulaire de contact |

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
```

## Activer un utilisateur

Depuis l'admin Django (`/admin/users/user/`) : sélectionner les utilisateurs concernés et exécuter l'action « Activer les utilisateurs sélectionnés », ou cocher `is_active` individuellement.

## Tests Postman

Une collection Postman peut être construite en s'appuyant sur le tableau d'endpoints ci-dessus. Pour les routes protégées, obtenir un `access` via `/api/auth/login/` puis l'ajouter dans l'en-tête `Authorization: Bearer <token>`.
