# Galla Redesign

Project is now split into two clean apps:

- `frontend/` - Vite + React + TypeScript
- `backend/` - Node.js + Express + TypeScript API + Prisma

## Frontend

```sh
cd frontend
npm install
npm run dev
```

Build:

```sh
cd frontend
npm run build
npm run preview
```

## Backend

```sh
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Optional email env vars for Resend notifications:

```sh
DATABASE_URL=postgresql://galla:galla123@localhost:5432/galla?schema=public
RESEND_API_KEY=your_resend_api_key
MAIL_FROM=onboarding@resend.dev
MAIL_TO=minetamexhiti01@gmail.com
```

Build:

```sh
cd backend
npm run build
npm run start
```

## Database (PostgreSQL + Prisma)

- Prisma schema: `backend/prisma/schema.prisma`
- Initial migration: `backend/prisma/migrations/20260224100000_init/migration.sql`
- Seed script: `backend/prisma/seed.ts`

Useful commands:

```sh
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:seed
```

## Implemented API Endpoints

- `POST /contact`
- `POST /orders/capsules`
- `POST /orders/espresso-inquiry`
- `GET /products`

## Docker (Frontend + Backend + PostgreSQL)

Run full stack:

```sh
docker compose up --build
```

Services:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:4000`
- PostgreSQL: `localhost:5432`

Stop stack:

```sh
docker compose down
```
