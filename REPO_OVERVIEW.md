# Repository Overview

## What this project is
MBW is a content-driven website with:
- A single-page frontend shell (vanilla JavaScript + CSS) served as static assets.
- A Node.js/Express backend that provides JSON APIs, admin pages, and a SQLite-backed content/mailbox store.

## High-level architecture
- `server/server.js` boots Express, serves static frontend files from the repo root, mounts API/admin routers, and falls back to `index.html` for app routes.
- Frontend runtime starts in `assets/js/main.js`, resolves the route, fetches page/site content, renders sections/components, and wires interactions.
- Route interpretation is centralized in `assets/js/router.js`.
- API endpoints (public JSON) live in `server/routes/api.js`.
- Admin endpoints (HTML dashboard + CRUD UI) live in `server/routes/admin.js`.
- SQLite database files live in `server/data/` (currently `content.db` plus WAL/SHM files).

## Key backend capabilities
- Contact form ingest: `POST /api/contact` validates required fields and persists mailbox messages.
- Site/navigation payload: `GET /api/site` returns company info + nav metadata.
- Content APIs: blog index/post, helpdesk index/topic/article, and other page feeds consumed by frontend renderers.
- Admin UI includes:
  - Login/session flow
  - Dashboard metrics
  - Mailbox review/delete
  - CRUD-like management for services/pages, works, posts, topics, and helpdesk articles

## Frontend notes
- Client-side navigation uses History API (`navigate()`), with a route map for major pages.
- Boot sequence:
  1. Wait for CSS readiness.
  2. Resolve route.
  3. Fetch site/page content.
  4. Resolve page renderer and mount header/page/footer.
  5. Bind UI handlers (nav, theme toggle, reveal observer, contact form, helpdesk search).
- Contact form submits JSON to `/api/contact` and surfaces status states (`pending`, `success`, `error`).

## Ops / developer workflow
- Backend scripts in `server/package.json` include:
  - `npm start`
  - `npm run migrate`
  - `npm run import:pages`
  - `npm run build:assets`
  - `npm run deploy:prod`
- README documents local startup and production deployment helper script.

## First places to inspect when making changes
- Routing behavior: `assets/js/router.js`, `server/server.js`
- API contract changes: `server/routes/api.js` + matching frontend section/component usage
- Admin behavior: `server/routes/admin.js`
- Styling/layout: `assets/css/*.css`
