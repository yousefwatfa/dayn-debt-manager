# Dayn — Debt Manager

Web app to track debts and receivables: parties, debts, partial payments, reports, Telegram reminders.
Arabic (RTL) / English, light / dark mode, mobile-first. Zero npm dependencies.

## Requirements
Node.js 22+ (uses built-in `node:sqlite`).

## Run
```
node server.js
```
Open http://localhost:3000. The first account registered becomes admin.

Env vars: `PORT` (default 3000), `DATA_DIR` (default `./data`), `JWT_SECRET` (default: generated in `data/jwt.secret`).

## Test
Start the server on a throwaway data dir, then run the smoke test:
```
set DATA_DIR=%TEMP%\dayn-test && set PORT=3100 && node server.js
set BASE=http://localhost:3100 && node test.js
```

## Stack
Node `http` + SQLite, scrypt password hashing, HS256 JWT, vanilla JS SPA.
