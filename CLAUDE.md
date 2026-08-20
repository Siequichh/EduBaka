# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

EduBaka is a PWA study-companion app for university students (mobile-first). One public monorepo, two independent apps:

- `Edubackend/Edubackend/` — Java 21 + Spring Boot 4 + Gradle (Kotlin DSL) REST API. Ships a `Dockerfile` for Render or any container host; see `docs/DEPLOY.md` for the recommended free setup (Render web service + Neon Postgres, since Render's own free Postgres expires after ~30 days).
- `EduBakaFront/` — React 19 + Vite + TypeScript + Tailwind CSS 4 PWA, deployed to GitHub Pages via `.github/workflows/deploy-frontend.yml` (auto-deploys on push to `main`).
- `docs/` — `DEPLOY.md`, `AVATARS.md` (how to swap in real avatar art), `GUIA.md`/`FirstPrompt.txt` (original project brief, Spanish). **`CLAUDE.md` itself stays at the repo root** — Claude Code auto-loads it from there specifically, don't move it into `docs/`.

It was scaffolded to mirror the structure of an earlier project (`luxestay-project`): layered backend (domain/application/infrastructure), MapStruct mappers, `AuditableEntity`, custom exceptions, service/serviceImpl pairs.

Core features: Google OAuth2 + JWT login, per-user academic cycles/courses/exam calendar, a soft-deletable todo list with subtasks, a Pomodoro timer whose state survives navigation/reload, Duolingo-style study streaks, a Gemini-powered chat with conversation memory, and an in-app onboarding tour. A signature feature is the "WOW mode" theme (`ThemeContext`) that reskins the whole UI as a WoW-game-like interface with flavor-text toasts, independent of the light/dark toggle.

## Commands

### Backend (`Edubackend/Edubackend/`)

```bash
./gradlew bootRun          # run dev server on :8080 (Windows: .\gradlew bootRun)
./gradlew build            # compile + test + package
./gradlew test             # run all tests (JUnit 5 / useJUnitPlatform)
./gradlew test --tests "com.EduBacka.pe.EdubackendApplicationTests"   # single test class
```

Requires a local PostgreSQL on `5432` (db `edubaka_db`) or env vars `DB_URL`/`DB_USERNAME`/`DB_PASSWORD`. Config in `.env` (see `.env.example`) plus `src/main/resources/application.yaml`. `ddl-auto: update` — schema evolves in place across restarts, data is not dropped; seed data (`DataSeeder`) adds the default academic cycles (2026-2 through 2030-2) and a default admin (`admin@edubaka.com`) only if they don't already exist.

### Frontend (`EduBakaFront/`)

```bash
npm install
npm run dev        # Vite dev server on :5173
npm run build       # tsc -b && vite build
npm run lint         # eslint .
npm run preview
```

`.env` sets `VITE_API_URL` (defaults to `http://localhost:8080/api`, see `src/api/config.ts`). `vite.config.ts`'s `base` is `/EduBakaFront/` for production builds only (GitHub Pages project-page path) and `/` for `npm run dev` — don't hardcode that prefix into `index.html`/manifest paths, use Vite's `%BASE_URL%` placeholder or relative paths instead (see how `index.html` and the PWA `icons` array already do this).

Run both servers concurrently for full-stack work: backend on 8080, frontend on 5173. CORS in `SecurityConfig` allows only `app.frontend.url` (default `http://localhost:5173`).

## Backend architecture

Package root: `com.EduBacka.pe`. Layered by responsibility, not by feature:

- `domain/entity` — JPA entities. All extend `AuditableEntity` (`domain/audit`), which auto-populates `createdAt`/`modifiedAt`/`createdBy`/`modifiedBy` via `@EntityListeners(AuditingEntityListener.class)` — **never set these fields manually**, `JpaAuditingConfig` wires the current-user extraction from the JWT/Authentication.
- `domain/enumerate` — enums implement `DisplayableEnum` (`getCode()`, `getDisplayName()`, `isAvailable()`) and are persisted via a matching `AttributeConverter` in `infrastructure/util/converter` (e.g. `UserRole` ↔ `UserRoleConverter`), storing a short string code (`"01"`, `"02"`) instead of the enum name. When adding a new enum: implement `DisplayableEnum`, add a converter, and mark the entity field `@Convert(converter = ...)`.
- `domain/repository` — Spring Data JPA interfaces.
- `domain/service` — one `XService` interface + `XServiceImpl` per feature. Impls are `@Transactional(readOnly = true)` at the class level, with individual write methods annotated `@Transactional`. Ownership checks (a Task/Course/etc. belongs to the authenticated user) are done inline via `.filter(x -> x.getUser().getId().equals(user.getId()))` before `orElseThrow(() -> new ResourceNotFoundException(...))` — follow this pattern rather than adding a separate authorization layer.
- `application/dto/<feature>` — request/response DTOs as Java records, one subpackage per feature (`task`, `course`, `exam`, `pomodoro`, `subtask`, `activity`, `chat`, `auth`, `user`, `cycle`).
- `infrastructure/mapper` — MapStruct interfaces (`@Mapper(componentModel = "spring")`) mapping entity → response DTO, e.g. `TaskMapper` flattens `course.id`/`course.name` into `courseId`/`courseName`.
- `infrastructure/controller` — thin `@RestController`s. Pull the authenticated `User` from `Authentication` via `userRepository.findByEmail(authentication.getName())` (see `getUser()` helper repeated in each controller) — there is no `@AuthenticationPrincipal` custom resolver.
- `infrastructure/security` — JWT (`JwtUtil`, `JwtFilter`) + Google OAuth2 (`OAuth2UserService`, `OAuth2SuccessHandler`/`FailureHandler`, `CustomOAuth2User`). `SecurityConfig` permits `/api/auth/**`, `/api/public/**`, `/oauth2/**`, `/login/oauth2/code/**`; everything else requires authentication. Fully stateless (`SessionCreationPolicy.STATELESS` — the app is JWT-only, no server-side session), CSRF disabled.
- `infrastructure/exception` — `BusinessException` (carries an `HttpStatus`) and `ResourceNotFoundException` are the two custom exceptions services throw; `GlobalExceptionHandler` (`@RestControllerAdvice`) converts these plus validation/auth/generic exceptions into a uniform `ErrorResponse` record (status, error, message, path, timestamp, field errors). Error/log messages are in Spanish — keep that convention.
- `config/DataSeeder` — `CommandLineRunner` seeding academic cycles and the default admin; edit here to change preloaded data, not via manual SQL.

Soft-delete pattern: entities like `Task`/`Course` use an `isDeleted` boolean flag instead of physical deletes; queries filter `...AndIsDeletedFalse`/`...AndIsDeletedTrue`, and a `restore` endpoint flips the flag back.

Streaks (`StudyActivityServiceImpl.getStreak`): computed on read from distinct `StudyActivity` dates (today or yesterday as the anchor, then walk backwards while consecutive dates exist) — there is no stored streak counter to keep in sync. A `StudyActivity` row is logged on task creation, task completion (`TASK_COMPLETION`), and completed focus pomodoros — follow that pattern for any new streak-worthy action rather than adding a separate counter.

Gemini chat (`GeminiChatServiceImpl`): builds the `contents` array from `ChatRequest.history()` (capped to the last `MAX_HISTORY_TURNS`) plus the new message, so conversations stay multi-turn — the frontend is responsible for sending prior turns back on every request, the backend doesn't persist chat history itself. The system preamble explicitly forbids LaTeX (plain-text math only). `callGeminiWithRetry` retries 503s a few times with backoff and maps a 429 (free-tier quota exhausted — shared across all users of the API key, not per-account) to a distinct user-facing message; don't add a generic catch-all retry for 429, retrying a quota wall doesn't help. Daily per-user quota is tracked on `User.dailyChatCount`/`chatCountDate`, separate from Gemini's own quota.

## Frontend architecture

- Routing in `src/App.tsx` (`react-router-dom` v7): public routes (`/login`, `/register`, `/oauth2/callback`) plus a `PrivateRoute` + `MainLayout` wrapped group for authenticated pages (`dashboard`, `tasks`, `streaks`, `chat`, `calendar`, `settings`, `admin/users`). `MainLayout` also mounts `TourProvider`/`TourGuide` (the onboarding walkthrough) and `PomodoroProvider` is mounted once in `App.tsx` above the router so timer state survives route changes.
- `context/AuthContext` — holds `user`/`token` in React state, persisted to `localStorage` (`token`, `user` keys); `PrivateRoute` gates on `isAuthenticated`. `updateUser(patch)` merges into the current user and re-persists — call it after any profile-editing API call (e.g. Settings saving a new avatar) so the rest of the UI (sidebar, etc.) reflects the change immediately, since nothing else re-fetches the profile. All exported functions (`login`/`logout`/`updateUser`) are wrapped in `useCallback` — keep them that way, an unstable reference here previously caused an effect-driven re-render loop in `OAuthCallback`.
- `context/ThemeContext` — two independent axes stored separately in `localStorage` and mirrored onto `document.documentElement` as `data-theme` (`light`/`dark`) and `data-mode` (`default`/`wow`). Styling for WOW mode should hook off `[data-mode="wow"]`/`.wow-mode-active` selectors in `index.css` rather than component-level conditionals where possible. Dark-mode base styles must target `:where([data-theme="dark"])`, **not** a literal `.dark` class — nothing in this app ever adds a `.dark` class, that selector silently never matches (bit twice by this already, e.g. `body`'s dark background/text).
- `context/PomodoroContext` — timer state lives here (not in `PomodoroTimer.tsx`) specifically so it survives navigating away from `/tasks`. Persists to `localStorage` and computes remaining time from an `endTimestamp` (not a decrementing counter), so it's also correct across a full page reload. All exported setters are `useCallback`-wrapped for the same stale-reference reason as `AuthContext`.
- `context/TourContext` + `components/tour/TourGuide.tsx` — the onboarding walkthrough. Steps are defined in `lib/tourSteps.ts`. Auto-starts once on first Dashboard visit (`localStorage` flag), manually reopenable from the sidebar. Spotlights real sidebar nav items via refs registered by `NavItem`, and forces the mobile sidebar open while active so there's something to point at on small screens.
- `src/api/axiosClient.ts` — single shared axios instance; request interceptor attaches `Authorization: Bearer <token>` from `localStorage`, response interceptor force-logs-out (clears storage, redirects to `/login`) on any `401`.
- `src/lib/wowQuotes.ts` / `wowCopy.ts` — flavor text/copy banks for WOW-mode toasts and nav/UI labels (`wowLabel(mode, text)`); add new lines here rather than inlining strings in components, and reuse `wowLabel` for any new UI text that needs a WoW-flavored variant.
- `components/chat/ChatMessageText.tsx` — the shared renderer for chat bubbles (`Chat.tsx` and the floating `ChatBubble.tsx` both use it). Handles `**bold**`/`` `code` ``/newlines from Gemini's markdown-ish replies without a full markdown library. `useChat.ts` sends the prior `messages` back as `history` on every request (mapped `assistant`→`model`) so follow-up questions stay in context.
- `public/avatars/{wow,anime}` — hand-drawn placeholder SVG avatars (no image server/upload pipeline by design, no third-party character art for copyright reasons); see `docs/AVATARS.md` for how to swap in real art. User avatar selection falls back to two-letter initials if no avatar is set or the image fails to load.
- PWA config lives in `vite.config.ts` (`vite-plugin-pwa`, `registerType: 'autoUpdate'`) plus the meta tags in `index.html`.

## Cross-cutting notes

- Auth flow: local login issues a JWT (`AuthService`/`JwtUtil`); Google OAuth2 goes through Spring Security's `oauth2Login`, and `OAuth2SuccessHandler` mints a JWT and redirects to the frontend's `/oauth2/callback` with it, unifying both auth methods on the same JWT-in-`Authorization`-header model on the frontend. `OAuthCallback.tsx` guards its effect with a `handledRef` so a dev-mode double-invoke or stale-closure re-fire can't re-trigger navigation or spuriously show its fallback error after a real success — keep that guard if touching this file.
- When adding a new resource end-to-end, follow the existing vertical slice for an existing feature (e.g. Task: entity → converter (if new enum) → repository → DTO records → mapper → service/serviceImpl → controller) rather than introducing a different layering.
- Deploying: see `docs/DEPLOY.md`. Frontend auto-deploys via GitHub Actions on push to `main`; backend is manual (Render or any Docker host, pointed at `Edubackend/Edubackend/Dockerfile`) with a free Neon Postgres recommended over Render's own free Postgres, which expires ~30 days after creation.
