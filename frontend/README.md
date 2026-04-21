# Weeb — Frontend React

Interface du projet Weeb (vitrine, blog, authentification). Construite avec React 19 et Vite.

## Stack

- React 19 + React Router 7
- Vite 7
- react-icons (icônes sociales et burger)

## Installation

```bash
cd frontend
npm install
copy .env.example .env      # Windows
# cp .env.example .env      # macOS / Linux
npm run dev
```

L'application est servie sur `http://localhost:5173`. Elle consomme l'API Django définie par `VITE_API_URL` (`http://localhost:8000/api` par défaut).

## Variables d'environnement

| Nom | Description | Défaut |
|-----|-------------|--------|
| `VITE_API_URL` | URL de base de l'API Django | `http://localhost:8000/api` |

## Arborescence

```
frontend/
  index.html
  vite.config.js
  .env.example
  src/
    main.jsx
    App.jsx
    App.css                 # fichier CSS unique du projet
    api/
      client.js             # wrapper fetch + gestion JWT + refresh
    assets/                 # SVG locaux (logo, illustrations, logos techno)
    context/
      AuthContext.jsx       # état d'authentification global
    components/
      navigation.jsx        # header + menu burger responsive
      footer.jsx
      home_hero.jsx
      home_logo.jsx         # marquee infinie
      home_section.jsx
      ProtectedRoute.jsx
    pages/
      Home.jsx
      Contact.jsx
      Login.jsx
      SignUp.jsx
      ResetPassword.jsx
      Blog.jsx
      Article.jsx
      ArticleNew.jsx
```

## Pages et routes

| Route | Description | Accès |
|-------|-------------|-------|
| `/` | Page d'accueil (hero, logos, sections) | Public |
| `/contact` | Formulaire de contact | Public |
| `/login` | Connexion | Public |
| `/signup` | Création de compte | Public |
| `/reset-password` | Réinitialisation du mot de passe | Public |
| `/blog` | Liste des articles | Public |
| `/blog/:id` | Détail d'un article | Public |
| `/blog/nouveau` | Formulaire de création / édition d'article | Authentifié + `is_active` |

## Authentification

L'état utilisateur est géré par `AuthContext` :

- `login(email, password)` : appelle `/api/auth/login/`, stocke `access` + `refresh` dans `localStorage` et charge le profil via `/api/auth/me/`.
- `signup(payload)` : crée un compte `is_active=False`. L'accès au login sera refusé tant qu'un administrateur ne l'aura pas validé.
- `logout()` : efface les tokens et l'utilisateur courant.
- `resetPassword(email, newPassword)` : réinitialisation simplifiée via l'API.

Le client `src/api/client.js` ajoute automatiquement l'en-tête `Authorization: Bearer <access>` et tente un refresh transparent sur `401`.

## Retours Datascientest pris en compte

- Menu burger fonctionnel qui se ferme au clic sur un lien ou au changement de route.
- Footer intégralement traduit en français.
- Lien « About us » supprimé, remplacé par Blog + Contact.
- Boutons « Découvrir les articles » et « S'abonner à la newsletter » avec contrastes et hover distincts.
- Marges tablette (breakpoint `1024px`) ajustées pour éviter le collage aux bords.
- Placeholders `placehold.co` remplacés par des SVG locaux cohérents avec la palette.
- Nouveau parcours « S'enregistrer » branché sur l'API.

## Scripts

- `npm run dev` : serveur de développement Vite.
- `npm run build` : build de production dans `dist/`.
- `npm run preview` : prévisualisation du build.
- `npm run lint` : ESLint.
