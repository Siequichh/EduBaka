# EduBaka frontend

React 19 + Vite + TypeScript PWA for [EduBaka](../README.md).

## Stack

React, Vite, TypeScript, Tailwind CSS 4, react-router, vite-plugin-pwa, axios.

## Local setup

```bash
npm install
cp .env.example .env
# VITE_API_URL defaults to http://localhost:8080/api - point it at your backend
npm run dev
```

Runs on `http://localhost:5173`. Needs the backend running (see [`../Edubackend/Edubackend/README.md`](../Edubackend/Edubackend/README.md)) for anything past the login screen.

## Build

```bash
npm run build    # tsc -b && vite build, output in dist/
npm run preview  # serve the production build locally
npm run lint
```

`vite.config.ts` sets `base: '/EduBaka/'` for production builds only (GitHub Pages project-page path, matching the repo name — `npm run dev` still serves from `/`). If you rename the repo, update that value to match, or deploy is scoped to a "user/org root" site instead.

## Deploying

The default target is GitHub Pages via the `.github/workflows/deploy-frontend.yml` workflow at the repo root — push to `main` and it builds + publishes automatically. See [`../docs/DEPLOY.md`](../docs/DEPLOY.md) for the one-time repo setting to flip.

A `Dockerfile` + `nginx.conf` are also included here as an alternative if you'd rather self-host the built static files instead of GitHub Pages:

```bash
docker build -t edubaka-frontend --build-arg VITE_API_URL=https://your-api.example.com/api .
docker run -p 8080:80 edubaka-frontend
```

## Notable pieces

- `src/context/` — `AuthContext` (JWT/user), `ThemeContext` (light/dark + Modo WoW), `PomodoroContext` (timer state, survives navigation/reload via `localStorage`), `TourContext` (the onboarding walkthrough).
- `src/lib/wowCopy.ts` / `wowQuotes.ts` — Modo WoW copy — reuse `wowLabel()` for any new UI text rather than hardcoding a themed string inline.
- `public/avatars/` — static avatar images (no image server). See [`../docs/AVATARS.md`](../docs/AVATARS.md) to swap in your own art.
