# Email Notifications Setup

This document explains how email notifications are configured in this project.

## Current Behavior

When users submit forms from the website, backend endpoints create records and attempt to send notification emails via Resend:

- `POST /contact`
- `POST /orders/capsules`
- `POST /orders/espresso-inquiry`

Emails are sent from the backend service in:

- `backend/src/services/email.ts`

## Where Emails Go

Recipient is controlled by environment variable:

- `MAIL_TO=minetamexhiti01@gmail.com`

So website submissions should arrive in that Gmail inbox.

## Required Environment Variables

Set these in:

- `backend/.env`

Example:

```env
RESEND_API_KEY=your_resend_api_key
MAIL_FROM=onboarding@resend.dev
MAIL_TO=minetamexhiti01@gmail.com
```

Notes:

- `RESEND_API_KEY` is required for real sending.
- `MAIL_FROM` can be `onboarding@resend.dev` for testing.
- For production, use a verified sender domain like `notifications@galla.mk`.

## Start Backend

```sh
cd backend
npm run dev
```

## How to Verify Email Sending

1. Submit one form from the frontend.
2. Check inbox of `MAIL_TO` (`minetamexhiti01@gmail.com`).
3. If no email arrives, check Resend dashboard logs.

## API Response Field

Each submit endpoint includes:

- `emailSent: true` if send succeeded
- `emailSent: false` if send did not happen (e.g., missing key or provider error)

## Troubleshooting

- Ensure backend is running on correct port.
- Ensure `.env` exists in `backend/`.
- Ensure key is valid and active in Resend.
- Check spam/promotions tab in Gmail.
- Check Resend activity logs for delivery errors.

## Security Note

Do not commit real API keys.

- `.env` is gitignored in root `.gitignore`.
- Use `backend/.env.example` as template.
