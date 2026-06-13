# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Longan Apex is a Chinese-language second-hand goods marketplace (similar to Xianyu). Full-stack web app with a Vue 3 SPA frontend and a Java Spring Boot REST API backend, using MySQL. The UI is in Chinese.

The frontend (`front/`) and backend (`longan_apex/`) are separate git repositories within this directory.

## Common Commands

### Backend (from `longan_apex/`)
```bash
mvn clean package          # Build JAR
mvn spring-boot:run        # Run dev server on port 8080
mvn test                   # Run tests
```
Requires MySQL at `localhost:3306` with database `longan_apex`. Initialize schema with `src/main/resources/init.sql`.

### Frontend (from `front/`)
```bash
npm install                # Install dependencies
npm run dev                # Vite dev server (proxies /api to localhost:8080)
npm run build              # Production build
npm run preview            # Preview production build
```

### API Docs
Swagger UI at `http://localhost:8080/swagger-ui.html` when backend is running. Per-module API docs in `longan_apex/src/main/resources/api/`.

## Architecture

### Backend: Spring Boot 3.5 + MyBatis-Plus + MySQL (Java 17)

Layered architecture under `com.longan`: **Controller → Service → Mapper**. Each domain module has controller/service/mapper/entity/dto/vo layers.

**Modules:**
- `user` — Registration, login, profile, wallet, credit score (`/api/user/**`)
- `goods` — CRUD for goods listings, categories, collections (`/api/goods/**`, `/api/category/**`)
- `order` — Order lifecycle: create, pay (platform currency), ship, receive, cancel, refund (`/api/order/**`)
- `chat` — Buyer/seller conversations and messages (services exist, controller incomplete)
- `common` — File upload, platform config (`/api/common/**`)

**Cross-cutting:**
- JWT auth via `JwtTokenInterceptor` — intercepts `/api/**` except `/api/user/login` and `/api/user/register`. Stores user ID in `UserContext` (ThreadLocal).
- All endpoints return `Result<T>` (`code`, `msg`, `data`). Paginated results use `PageResult<T>`.
- `GlobalExceptionHandler` handles exceptions uniformly.
- `MyMetaObjectHandler` auto-fills `createTime`, `updateTime`, `username`, `nickname`.

**Key paths:**
- Entry point: `longan_apex/src/main/java/com/longan/LonganApexApplication.java`
- Config: `longan_apex/src/main/resources/application.yml`
- DB schema + seed data: `longan_apex/src/main/resources/init.sql`
- MyBatis XML mappers: `longan_apex/src/main/resources/com/longan/*/mapper/`
- Architecture diagrams: `longan_apex/architecture-diagrams.md`

### Frontend: Vue 3 + Element Plus + Pinia + Vite

**Key paths:**
- Entry: `front/src/main.js`
- App shell: `front/src/layout/Layout.vue` (header + sidebar + content area)
- Routes: `front/src/router/index.js`
- API layer: `front/src/api/` (thin Axios wrappers by domain)
- Axios config: `front/src/utils/request.js` (JWT injection, 401 handling)
- Pinia stores: `front/src/stores/` (user, order, mine)

**Routes:** `/login`, `/register`, `/home` (goods grid), `/publish`, `/message`, `/mine` (profile/orders/wallet), `/goods/detail`, `/order/confirm`, `/order/detail`.

## Conventions

- Backend uses Lombok (`@Data`, `@Slf4j`, etc.) extensively — do not write manual getters/setters.
- MyBatis-Plus provides base CRUD via `IService`/`ServiceImpl` — check for existing base methods before writing custom SQL.
- The Vite dev server proxies `/api` to `localhost:8080` — frontend API calls use relative `/api/...` paths.
- User identity in the backend is obtained via `UserContext.getCurrentId()` (ThreadLocal set by the JWT interceptor).
