# Docker + PostgreSQL Setup

This project runs as a 3-service Docker Compose stack:

- `frontend` (Nginx serving Vite build)
- `backend` (Express + Prisma)
- `postgres` (PostgreSQL 16)

## Start Everything

From repository root:

```sh
docker compose up --build
```

## Service URLs

- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:4000`
- PostgreSQL: `localhost:5432`

## Database Details

Compose uses:

- DB: `galla`
- User: `galla`
- Password: `galla123`

Backend gets:

```env
DATABASE_URL=postgresql://galla:galla123@postgres:5432/galla?schema=public
```

## Prisma in Container

Backend container runs on startup:

```sh
npm run prisma:deploy && npm run start
```

This applies migrations before starting the API.

Products are auto-seeded at backend startup if `products` table is empty.

## Stop

```sh
docker compose down
```

Remove DB volume too:

```sh
docker compose down -v
```
