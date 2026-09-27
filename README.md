# SkillPulse AI

SkillPulse tracks what happens after training: completion, certification, placement, employment, follow-ups, retention, and wage outcomes.

## Docker quick start

Docker Desktop must be running.

```sh
docker compose up --build
```

Open the app at [http://localhost:3000](http://localhost:3000).

The stack contains:

- `frontend`: React dashboard served by Nginx
- `api`: Express REST API
- `postgres`: PostgreSQL 16 with persistent volume `skillpulse_pgdata`

The API container waits for PostgreSQL, creates the schema, and seeds the demo dataset automatically. The API is also available at [http://localhost:4000/api/health](http://localhost:4000/api/health).

## Useful commands

```sh
# Start in the background
docker compose up --build -d

# View logs
docker compose logs -f api

# Stop containers, preserve database volume
docker compose down

# Stop containers and delete all local PostgreSQL data
docker compose down -v
```

## Local development without Docker

```sh
cd backend
cp .env.example .env
npm install
npm run seed
npm start

# In another terminal
cd frontend
npm install
npm start
```

For local development, PostgreSQL must be available at the `DATABASE_URL` in `backend/.env`. The Vite dev server proxies `/api` to port `4000`.

## PostgreSQL data model

The API creates these tables: `trainees`, `courses`, `providers`, `employers`, `outcomes`, `followups`, `initiatives`, and `audit_logs`. Demo records are marked with `demo = true` and can be replaced by real records later.

## GitHub upload

```sh
git init
git add .
git commit -m "Build SkillPulse PostgreSQL Docker MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

`.env`, database files, `node_modules`, build output, and logs are ignored. Do not commit database passwords or API credentials. The committed `backend/.env.example` is safe to share.

## IVR status

IVR remains isolated under `ignore/ivr/` and disabled. `IVR_ENABLED=false` is set in Docker Compose and no active application code imports that directory.
