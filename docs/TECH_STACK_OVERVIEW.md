# Tech Stack Overview

Short reference for the main platforms, services, and libraries used in this project.

## Main Platforms and Services

- `React`: used to build the website UI.
- `Vite`: used to run the frontend locally and build the frontend for production.
- `Node.js`: runs the backend server.
- `Express`: used to create the backend API endpoints.
- `PostgreSQL`: stores the website data in the database.
- `Prisma`: used to talk to the PostgreSQL database and define the schema.
- `Resend`: used to send email notifications for contact forms and orders.
- `Docker`: used to run the full stack locally in containers.

## Frontend Libraries

- `TypeScript`: adds type safety to frontend and backend code.
- `React Router`: handles page routing in the frontend.
- `Tailwind CSS`: used for styling.
- `React Hook Form`: used to manage forms.
- `Zod`: used to validate form and API data.
- `TanStack React Query`: used for data fetching and server state in the frontend.
- `Radix UI`: provides accessible UI primitives/components.
- `Sonner`: used for toast notifications.
- `Lucide React`: used for icons.

## Backend Libraries

- `@prisma/client`: Prisma database client used inside the backend code.
- `dotenv`: loads environment variables from `.env`.
- `cors`: allows frontend and backend to communicate across origins.
- `tsx`: runs TypeScript files directly during development.

## What Data Goes Where

- `orders` + `order_items`: stores capsule orders from the website.
- `espresso_inquiries` + `espresso_inquiry_products`: stores espresso inquiry submissions.
- `contact_messages`: stores contact form submissions.

## Email Use

- Order, inquiry, and contact submissions are saved in the database.
- If `RESEND_API_KEY` is configured, the backend also sends an email notification.
- `MAIL_TO`: the inbox that receives those notifications.
- `MAIL_FROM`: the sender address used for those emails.
