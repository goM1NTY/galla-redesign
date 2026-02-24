# DB and Docker Implementation

This document summarizes what was implemented for database persistence and containerization.

## 1) Database Implementation

Backend now uses **PostgreSQL** with **Prisma ORM**.

### Added

- Prisma schema:
  - `backend/prisma/schema.prisma`
- Initial migration:
  - `backend/prisma/migrations/20260224100000_init/migration.sql`
- Prisma seed script:
  - `backend/prisma/seed.ts`
- Prisma client helper:
  - `backend/src/lib/prisma.ts`
- Startup bootstrap seeding (if products table is empty):
  - `backend/src/services/bootstrap.ts`
- Product seed source:
  - `backend/src/data/productSeeds.ts`

### Tables Created

- `products`
- `contact_messages`
- `orders`
- `order_items`
- `espresso_inquiries`
- `espresso_inquiry_products`

### Backend Routes Refactored to DB

- `POST /contact` writes to `contact_messages`
- `POST /orders/capsules` writes to `orders` + `order_items`
- `POST /orders/espresso-inquiry` writes to `espresso_inquiries` + `espresso_inquiry_products`
- `GET /products` reads from `products`

Updated files:

- `backend/src/routes/contact.ts`
- `backend/src/routes/orders.ts`
- `backend/src/routes/products.ts`
- `backend/src/server.ts`

Removed old in-memory storage:

- deleted `backend/src/data/store.ts`

### Environment

`backend/.env.example` now includes:

```env
DATABASE_URL=postgresql://galla:galla123@localhost:5432/galla?schema=public
```

## 2) Docker Implementation

Project now runs with 3 containers via Docker Compose:

- `frontend` (Nginx serving built Vite app)
- `backend` (Node.js + Express + Prisma)
- `postgres` (PostgreSQL 16)

### Added Docker Files

- Root compose file:
  - `docker-compose.yml`
- Frontend container files:
  - `frontend/Dockerfile`
  - `frontend/nginx.conf`
  - `frontend/.dockerignore`
- Backend container files:
  - `backend/Dockerfile`
  - `backend/.dockerignore`

### Runtime Ports

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:4000`
- PostgreSQL: `localhost:5432`

### Backend Container Startup

Backend container runs:

```sh
npm run prisma:deploy && npm run start
```

This applies migrations before starting API.

## 3) Commands

Run full stack:

```sh
docker compose up --build
```

Stop:

```sh
docker compose down
```

Stop + remove DB data volume:

```sh
docker compose down -v
```

## 4) Notes

- API payload shape remains compatible with frontend.
- Product IDs used by frontend (like `capsules-classic`) are preserved as product `code` in DB responses.
- Resend email notifications remain active and are still sent from backend after DB writes.
