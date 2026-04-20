# Deploy Option A: Vercel + Railway

This setup uses:

- `Vercel` for the frontend
- `Railway` for the backend
- `Railway Postgres` for the database
- `Resend` for email notifications

## Recommended Structure

- `frontend/` -> deploy to Vercel
- `backend/` -> deploy to Railway
- `PostgreSQL` -> create on Railway

## Before You Start

You need accounts for:

- `Vercel`
- `Railway`
- `Resend`
- `GitHub` if you want to connect the repo directly

## 1. Prepare Environment Variables

### Backend on Railway

Set these variables in Railway for the backend service:

- `DATABASE_URL`: provided by Railway Postgres
- `RESEND_API_KEY`: your Resend API key
- `MAIL_FROM`: sender email, for example `hello@yourdomain.com`
- `MAIL_TO`: inbox that should receive website notifications
- `PORT`: Railway usually provides this automatically

### Frontend on Vercel

Set this variable in Vercel for the frontend project:

- `VITE_API_BASE_URL`: your Railway backend URL, for example `https://your-backend.up.railway.app`

## 2. Deploy the Backend to Railway

Create a new Railway project.

Add a `PostgreSQL` database service.

Add a `GitHub`-connected service for the backend and point it to:

- Root Directory: `backend`

Use these commands:

- Install Command: `npm install`
- Build Command: `npm run build`
- Start Command: `npm run prisma:deploy && npm run start`

Then add the backend environment variables listed above.

Important:

- Railway Postgres will give you the `DATABASE_URL`
- paste that value into the backend service env vars

## 3. Deploy the Frontend to Vercel

Create a new Vercel project from the same repository.

Set:

- Root Directory: `frontend`

Framework should be detected as `Vite`.

Add:

- `VITE_API_BASE_URL=https://your-backend-url`

Then deploy.

## 4. Check That It Works

After deployment, test these:

- open the frontend site on Vercel
- submit the contact form
- submit a capsule order
- check that the data appears in the database
- check that the email notification arrives

Useful backend test URL:

- `https://your-backend-url/health`

It should return a success response.

## 5. Production Email Note

For real production email, use a verified domain in Resend.

Do not rely on the default testing sender long-term.

## 6. Quick Summary

- `Vercel`: hosts the frontend
- `Railway backend service`: runs Express API
- `Railway Postgres`: stores orders, inquiries, and contact messages
- `Resend`: sends notification emails

## 7. Exact Order To Do It

1. Push the project to GitHub.
2. Create a Railway project.
3. Add Railway Postgres.
4. Create Railway backend service from the repo with root `backend`.
5. Set backend env vars in Railway.
6. Deploy backend.
7. Copy the Railway backend public URL.
8. Create a Vercel project from the same repo with root `frontend`.
9. Set `VITE_API_BASE_URL` in Vercel.
10. Deploy frontend.
11. Test forms, database writes, and email notifications.

## 8. Notes For This Project

- Orders are stored in `orders` and `order_items`
- Espresso inquiries are stored in `espresso_inquiries` and `espresso_inquiry_products`
- Contact messages are stored in `contact_messages`
- If `RESEND_API_KEY` is missing, submissions are still saved but email sending is skipped
