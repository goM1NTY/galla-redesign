# Galla Redesign

Project is now split into two clean apps:

- `frontend/` - Vite + React + TypeScript
- `backend/` - Node.js + Express + TypeScript API

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
npm run dev
```

Optional email env vars for Resend notifications:

```sh
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

## Implemented API Endpoints

- `POST /contact`
- `POST /orders/capsules`
- `POST /orders/espresso-inquiry`
- `GET /products`
