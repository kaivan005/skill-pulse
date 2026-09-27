# SkillPulse API

PostgreSQL-backed REST API for the SkillPulse dashboard.

## Docker

The recommended setup is from the repository root:

```sh
docker compose up --build
```

Compose starts PostgreSQL, waits for its health check, creates the schema, seeds demo data, and starts the API on port `4000`.

## Local API

```sh
cp .env.example .env
npm install
npm run seed
npm start
```

Set `DATABASE_URL` in `.env` to a PostgreSQL database. Credentials stay in `.env` and are excluded from Git.

## Endpoints

- `GET /api/health`
- `GET /api/dashboard?district=Pune`
- `POST /api/initiatives/:id/sync`

Tables created by the API: `trainees`, `courses`, `providers`, `employers`, `outcomes`, `followups`, `initiatives`, and `audit_logs`.
