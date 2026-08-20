# EduBaka

A study companion PWA for university students — task/exam tracking, a Pomodoro timer with streaks, an academic-cycle calendar, and an optional AI study chat. Its signature feature is **Modo WoW**: an alternate World of Warcraft–themed skin for the whole app, on top of the regular light/dark theme.

"EduBaka" — a playful mashup of "educación" and "baka" (Japanese for fool), i.e. "school for dummies."

## Monorepo layout

```
Edubackend/Edubackend/   Spring Boot 4 + Java 21 + Gradle REST API
EduBakaFront/            React 19 + Vite + TypeScript + Tailwind CSS 4 PWA
docs/                    Deploy guide, avatar-asset guide, original project brief
```

See each subproject's own README for local setup:
- [`Edubackend/Edubackend/README.md`](Edubackend/Edubackend/README.md) — backend
- [`EduBakaFront/README.md`](EduBakaFront/README.md) — frontend

For deploying this publicly (GitHub Pages + a Docker host + a free Postgres that won't get wiped), see [`docs/DEPLOY.md`](docs/DEPLOY.md).

## Features

- Google OAuth2 or email/password login, JWT-based sessions
- Academic cycles + per-course color coding, exam calendar
- Todo list with subtasks, priorities, due dates, and soft-delete/restore
- Configurable Pomodoro timer that survives navigating away or reloading the page
- Duolingo-style study streaks, tracked automatically from completed tasks and pomodoros
- Gemini-powered study chat with conversation memory and a daily message cap
- Full light/dark theme, plus Modo WoW — a complete alternate visual theme
- Installable PWA, mobile-first responsive layout
- An in-app guided tour of the main views, shown once on first login and reopenable anytime

## Stack

**Backend:** Spring Boot, Spring Security (JWT + OAuth2), Spring Data JPA, MapStruct, Lombok, PostgreSQL, Gradle (Kotlin DSL).

**Frontend:** React, Vite, TypeScript, Tailwind CSS 4, react-router, vite-plugin-pwa.
