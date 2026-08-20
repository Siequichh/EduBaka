# Deploy guide

## Frontend — GitHub Pages (automatic)

Already wired up via `.github/workflows/deploy-frontend.yml`: pushing to `main` builds `EduBakaFront` and publishes it, no manual steps per deploy.

One-time setup after creating the GitHub repo:

1. **Settings → Pages → Source: GitHub Actions.**
2. Push to `main`. Check the **Actions** tab for the run; the deployed URL shows up there and in the repo's Pages settings once it finishes.
3. If the repo is ever renamed away from `EduBakaFront`, update `base` in `EduBakaFront/vite.config.ts` to match (`base: '/<new-repo-name>/'`) — GitHub Pages project sites are served under `/<repo-name>/`, and asset paths break otherwise. (A GitHub *user/org* site — a repo literally named `<username>.github.io` — doesn't need this prefix at all; set `base: '/'` in that case instead.)
4. Set `VITE_API_URL` for the production build — either bake it in via a repo variable/env step in the workflow, or point it at wherever the backend ends up (see below). Until the backend is deployed, the live frontend will fail API calls but still load/install as a PWA.

## Backend — Render (Docker) + a database that won't get wiped

Render's own **free Postgres add-on is deleted ~30 days after creation** — that's the "gets erased" behavior flagged in the original project brief. The web service itself is fine on Render's free tier (it just cold-starts after inactivity, no data loss there); it's specifically their free database you want to avoid.

**Recommended: Render (backend container) + Neon (Postgres).** Neon's free tier never auto-deletes or force-expires — compute idles after a few minutes of inactivity and wakes on the next query, but the data itself persists indefinitely. (Supabase's free tier is a close alternative but pauses entirely after 7 days idle and needs manually un-pausing in their dashboard — Neon doesn't have that problem for this kind of light, sporadic usage.)

### 1. Database — Neon

1. Create a free project at [neon.tech](https://neon.tech).
2. Copy the **JDBC** connection string it gives you (not the `postgres://` one — Spring needs `jdbc:postgresql://...`). Note the host, database name, username, and password separately too; you'll set them as three env vars.

### 2. Backend — Render

1. New **Web Service** on [render.com](https://render.com), pointed at this repo.
2. **Root Directory:** `Edubackend/Edubackend` (this is a monorepo — Render needs to know the Dockerfile isn't at the repo root).
3. **Environment: Docker** (it'll pick up `Edubackend/Edubackend/Dockerfile` automatically).
4. Environment variables (see `.env.example` for the full list):
   - `DB_URL` — the Neon JDBC connection string
   - `DB_USERNAME` / `DB_PASSWORD` — from Neon
   - `JWT_SECRET` — a long random string, don't reuse the local dev default
   - `FRONTEND_URL` — the GitHub Pages URL from above (needed for CORS + OAuth2 redirects)
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from Google Cloud Console, add the Render URL's `/login/oauth2/code/google` as an authorized redirect URI there
   - `GEMINI_API_KEY` — from [aistudio.google.com/apikey](https://aistudio.google.com/apikey), optional (chat just shows "no configurado" without it)
   - `CHAT_DAILY_LIMIT` — optional, defaults to 30
5. Deploy. `ddl-auto: update` means the schema builds itself into Neon on first boot and evolves in place on every redeploy after — no manual migration step, and no data loss from restarts or redeploys either.

### Why not Render's free Postgres, or Supabase?

| | Free Postgres persistence |
|---|---|
| Render free Postgres | Deleted ~30 days after creation |
| Supabase free tier | Pauses entirely after 7 days idle (needs manual resume) |
| **Neon free tier** | **Never auto-deletes; compute idles but data persists indefinitely** |

Sources: [Neon vs Supabase vs Railway (2026)](https://codelesssync.com/blog/supabase-vs-neon-vs-railway-postgresql-for-saas), [Free PostgreSQL Hosting: Every Real Option (2026)](https://swyftstack.com/blog/free-postgresql-hosting).
