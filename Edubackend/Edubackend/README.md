# EduBaka backend

Spring Boot 4 / Java 21 REST API for [EduBaka](../../README.md).

## Stack

Spring Boot, Spring Security (JWT + Google OAuth2), Spring Data JPA + Hibernate, PostgreSQL, MapStruct, Lombok, Gradle (Kotlin DSL).

## Prerequisites

- JDK 21
- A local PostgreSQL instance (or point `.env` at a remote one — see `docs/DEPLOY.md` at the repo root for a free option that won't get wiped)

## Local setup

```bash
cp .env.example .env
# edit .env: at minimum set real values for JWT_SECRET; DB_* defaults to a local
# postgres/postgres on localhost:5432/edubaka_db. GOOGLE_CLIENT_ID/SECRET and
# GEMINI_API_KEY are optional - without them, Google login and the chat feature
# just stay disabled.

./gradlew bootRun
```

Runs on `http://localhost:8080`. On first boot, `DataSeeder` creates the preloaded academic cycles (2026-2 through 2030-2) and a default admin account (`admin@edubaka.com`, password in `DataSeeder.java`). `jpa.hibernate.ddl-auto` is set to `update`, so restarting the app evolves the schema without dropping existing data.

## Tests

```bash
./gradlew test
```

## Architecture at a glance

Layered by responsibility under `com.EduBacka.pe`:

- `domain/entity` — JPA entities, all extending `AuditableEntity` for automatic `createdAt`/`createdBy`/etc.
- `domain/enumerate` — enums implement `DisplayableEnum` and persist as short string codes via matching `AttributeConverter`s in `infrastructure/util/converter`, not their Java name.
- `domain/repository` / `domain/service` — Spring Data repositories and one `XService`/`XServiceImpl` pair per feature.
- `application/dto` — request/response records, one subpackage per feature.
- `infrastructure/controller` — thin REST controllers.
- `infrastructure/security` — JWT (`JwtUtil`/`JwtFilter`) and Google OAuth2 (`OAuth2UserService`/`OAuth2SuccessHandler`) both converge on the same JWT-in-header model the frontend uses.
- `infrastructure/exception` — `BusinessException`/`ResourceNotFoundException` + a global `@RestControllerAdvice` producing a consistent error shape.

Auth is stateless (`SessionCreationPolicy.STATELESS`) — every authenticated request carries its own JWT, no server-side session.

## Docker

```bash
docker build -t edubaka-backend .
docker run -p 8080:8080 --env-file .env edubaka-backend
```

See [`docs/DEPLOY.md`](../../docs/DEPLOY.md) at the repo root for deploying this for free without your data getting wiped on a schedule.
