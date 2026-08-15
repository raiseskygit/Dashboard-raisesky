# YourSaaS — Client / CRM / Invoicing / Portal platform

A multi-tenant SaaS starter modeled on Clienter (clienter.co.in): client
management, a leads/CRM pipeline, project tracking, GST-ready invoicing,
a white-label client portal, and Free/Pro/Ultra billing via Razorpay.

## Stack
- Next.js 14 (App Router) — pages + API routes in one app
- PostgreSQL + Prisma — every table scoped by `organizationId` (row-level isolation)
- NextAuth (credentials) — email/password auth, one Organization per signup
- Razorpay — checkout + webhook that upgrades an org's plan on payment
- Tailwind CSS

## Project structure
```
app/
  page.js                  landing + pricing
  login/, signup/           auth pages
  (dashboard)/              protected app (dashboard, leads, clients, projects, invoices, settings)
  portal/[token]/           public client portal (magic link, no login)
  api/                      all backend routes (clients, leads, projects, invoices, billing, auth)
prisma/schema.prisma        data model
lib/                        prisma client, auth config, plan limits
components/                 shared UI (nav, pricing cards)
render.yaml                 Render deployment blueprint
```

## 1. Local setup
```bash
npm install
cp .env.example .env         # fill in DATABASE_URL, NEXTAUTH_SECRET
npx prisma migrate dev --name init
npm run dev
```
Generate a secret: `openssl rand -base64 32`

## 2. Deploy to Render

**Option A — one-click blueprint (recommended)**
1. Push this project to a GitHub repo.
2. In the Render dashboard: New → Blueprint → connect the repo. Render reads
   `render.yaml` and provisions a free Postgres database plus the web service
   automatically, wiring `DATABASE_URL` between them.
3. Once created, open the web service → Environment and set:
   - `NEXTAUTH_URL` = your Render URL, e.g. `https://yoursaas-web.onrender.com`
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` (from the Razorpay dashboard)
   - `RAZORPAY_WEBHOOK_SECRET` (create a webhook in Razorpay pointing to
     `https://<your-render-url>/api/billing/webhook`, subscribed to
     `payment.captured`, and paste its secret here)
4. Deploy. The build runs `prisma generate && prisma migrate deploy && next build`,
   so your schema is applied automatically on every deploy.

**Option B — manual**
1. Create a Postgres instance on Render (or use Neon/Supabase).
2. Create a Web Service from the repo:
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
3. Add the same env vars as above.

## 3. First account
Visit `/signup` on your deployed URL. The first user you create becomes the
`OWNER` of a new Organization on the `FREE` plan.

## Plan limits
Defined centrally in `lib/plans.js` — edit this file to change pricing,
limits, or feature flags per tier. Free/Pro/Ultra limits are enforced
server-side in the clients and projects API routes.

## What's stubbed / next steps
- **Team members & roles**: schema has `Role` (OWNER/ADMIN/MEMBER) but there's
  no invite-teammate UI yet — add an `/api/team` route + settings page.
- **PDF invoice export**: invoices render in-app; add a `/invoices/[id]/print`
  page styled for browser "Print to PDF", or wire in a PDF library
  (`@react-pdf/renderer`) for a downloadable file.
- **Google Calendar & Meet integration**: not implemented — would need
  Google OAuth + Calendar API scopes added to NextAuth.
- **Razorpay subscriptions**: the current billing flow is a one-off order
  per upgrade. For true recurring monthly billing, create Plan IDs in the
  Razorpay dashboard and switch `app/api/billing/checkout/route.js` to
  `razorpay.subscriptions.create`.
- **Email notifications** (invoice sent, follow-up reminders): no email
  provider wired in yet — add Resend/Postmark/SES and trigger from the
  relevant API routes.
