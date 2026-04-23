# One99 Properties

Real Estate Lead Automation & Management System built with React, Tailwind CSS, Express, JWT authentication, and Supabase Postgres.

## Folder structure

```text
one99-properties/
├── backend/
│   ├── sql/schema.sql
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── styles/
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## Features delivered

- JWT login and registration
- Role-based access for `channel_partner`, `staff`, `manager`, `admin`, and `rental_team`
- Lead creation, CSV import, assignment, status changes, hot lead forwarding, and booking flow
- Admin user management
- Reporting endpoints and charts for lead source, lead status, hot lead visibility, assignment distribution, and activity trends
- Email notification hooks for assignment plus delay-alert endpoints for admin review
- Supabase-ready Postgres schema with status history, activity logs, assignments, notification logs, and reporting views

## Backend setup

```bash
cd backend
cp .env.example .env
npm install
```

In Supabase:

1. Create a new Supabase project.
2. Open the SQL Editor.
3. Run [schema.sql](/Users/harshshukla/Documents/New project/one99-properties/backend/sql/schema.sql).
4. Copy the Postgres connection string from Supabase.

Set your backend env values:

```bash
SUPABASE_DB_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
SUPABASE_DB_SSL=true
```

Run the API:

```bash
npm run dev
```

Create or reset the admin user:

```bash
npm run seed:admin
```

The admin seed script uses the same `SUPABASE_DB_URL` and creates or resets the local JWT admin record in the `users` table.

API base URL:

```text
http://localhost:5000/api
```

## Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Docker setup

```bash
export SUPABASE_DB_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
docker compose up --build
```

## Default admin bootstrap

The admin bootstrap script creates or resets:

- Email: `admin@one99properties.com`
- Password: `Admin@123`

## Key API routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Leads

- `GET /api/leads`
- `POST /api/leads`
- `POST /api/leads/upload-csv`
- `PATCH /api/leads/:id/status`
- `POST /api/leads/:id/assign`
- `POST /api/leads/:id/forward-hot`
- `POST /api/leads/:id/book`
- `GET /api/leads/stats/overview`

### Admin and reports

- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`
- `GET /api/reports/summary`
- `GET /api/reports/calendar`
- `GET /api/reports/delay-alerts`
- `GET /api/reports/export/csv`
- `GET /api/reports/export/pdf`

## Production notes

- Restrict `CLIENT_URLS` and rotate `JWT_SECRET`
- Replace the placeholder PDF export endpoint with `pdfkit` or `puppeteer`
- Configure SMTP credentials to activate outgoing assignment emails
- Add a scheduler such as cron or BullMQ for automatic follow-up reminders and delay sweeps
- Supabase recommends using the project Postgres connection string with SSL enabled for backend services: [Supabase Docs](https://supabase.com/docs/)

## Hosting plan

This project includes deployment config for:

- Render backend web service: `render.yaml`
- Netlify frontend site: `netlify.toml`

Required production environment values:

Backend:

```bash
NODE_ENV=production
CLIENT_URLS=https://your-frontend-domain.netlify.app,https://your-custom-domain.com
JWT_SECRET=use-a-long-random-secret
JWT_EXPIRES_IN=7d
SUPABASE_DB_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SUPABASE_DB_SSL=true
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=no-reply@one99properties.com
```

Frontend:

```bash
VITE_API_BASE=https://your-render-service.onrender.com/api
```
