# EduBaka

[![Deploy frontend](https://github.com/Siequichh/EduBaka/actions/workflows/deploy-frontend.yml/badge.svg)](https://github.com/Siequichh/EduBaka/actions/workflows/deploy-frontend.yml)
![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4-6DB33F?logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Vite-3178C6?logo=typescript&logoColor=white)

A study companion PWA for university students — task and exam tracking, a Pomodoro timer with streaks, an academic-cycle calendar, and an optional AI study chat.

Its signature feature is **Modo WoW**: an alternate World of Warcraft–themed skin for the entire app, independent of the regular light/dark theme toggle.

> "EduBaka" — a playful mashup of *educación* and *baka* (Japanese for "fool"): school for dummies.

**[Live demo →](https://siequichh.github.io/EduBaka/)**

## Contents

- [Features](#features)
- [Stack](#stack)
- [Project layout](#project-layout)
- [Getting started](#getting-started)
- [Deployment](#deployment)

## Features

- Google OAuth2 or email/password login, JWT-based sessions
- Academic cycles with per-course color coding, and an exam calendar
- Todo list with subtasks, priorities, due dates, and soft-delete/restore
- Configurable Pomodoro timer whose state survives navigating away or reloading the page
- Duolingo-style study streaks, tracked automatically from completed tasks and pomodoros
- Gemini-powered study chat with conversation memory and a daily message cap
- Full light/dark theme, plus Modo WoW — a complete alternate visual theme, not just a palette swap
- Installable PWA, mobile-first responsive layout
- An in-app guided tour of the main views, shown once on first login and reopenable anytime

## Stack

| | |
|---|---|
| **Backend** | Spring Boot 4, Spring Security (JWT + Google OAuth2), Spring Data JPA, MapStruct, Lombok, PostgreSQL, Gradle (Kotlin DSL) |
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS 4, react-router, vite-plugin-pwa |

## Project layout

```
Edubackend/Edubackend/   Spring Boot REST API
EduBakaFront/            React PWA
```

## Getting started

Each app has its own README with local setup instructions:

- [`Edubackend/Edubackend/README.md`](Edubackend/Edubackend/README.md) — backend
- [`EduBakaFront/README.md`](EduBakaFront/README.md) — frontend

## Deployment

- **Frontend** auto-deploys to GitHub Pages on every push to `main` via [`.github/workflows/deploy-frontend.yml`](.github/workflows/deploy-frontend.yml).
- **Backend** deploys as a Docker container to any host (Render, Fly.io, etc.) via [`Edubackend/Edubackend/Dockerfile`](Edubackend/Edubackend/Dockerfile).

---

<sub>Personal project, unlicensed — all rights reserved unless a license is added.</sub>
