import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import pg from 'pg'

const { Pool } = pg
const app = express()
const port = Number(process.env.PORT || 4000)
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://skillpulse:skillpulse@127.0.0.1:5432/skillpulse' })
const databaseHost = (() => { try { return new URL(process.env.DATABASE_URL || 'postgresql://skillpulse:skillpulse@127.0.0.1:5432/skillpulse').hostname } catch { return 'invalid-connection-string' } })()
const fallback = {
  trainees: [
    { initials: 'AM', name: 'Aarav Mehta', course: 'Web Development', district: 'Pune', status: 'Employed' },
    { initials: 'SK', name: 'Sana Khan', course: 'Data Analytics', district: 'Jaipur', status: 'Follow-up due' },
    { initials: 'RN', name: 'Riya Nair', course: 'EV Technician', district: 'Kochi', status: 'Certified' },
    { initials: 'VK', name: 'Vikram Kumar', course: 'Web Development', district: 'Patna', status: 'Looking for work' },
  ],
  stats: { total: 3240, completed: 2528, employed: 1750, retained: 1393 },
  funnel: [['Training', 100, '3,240'], ['Certified', 78, '2,528'], ['Placed', 62, '2,009'], ['Employed', 54, '1,750'], ['180-day retention', 43, '1,393']],
  followups: [{ name: 'Sana Khan', checkpoint: '90-day follow-up', due: 'today' }, { name: 'Riya Nair', checkpoint: '30-day follow-up', due: 'tomorrow' }],
}
let ready = false
const mode = 'postgresql'

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS trainees (id SERIAL PRIMARY KEY, trainee_id TEXT UNIQUE NOT NULL, name TEXT NOT NULL, email TEXT, district TEXT, course TEXT, status TEXT, salary INTEGER, consent BOOLEAN DEFAULT FALSE, demo BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ DEFAULT NOW());
    CREATE TABLE IF NOT EXISTS courses (id SERIAL PRIMARY KEY, course_id TEXT UNIQUE NOT NULL, name TEXT NOT NULL, skills JSONB DEFAULT '[]', duration_weeks INTEGER, provider TEXT, demo BOOLEAN DEFAULT TRUE);
    CREATE TABLE IF NOT EXISTS providers (id SERIAL PRIMARY KEY, provider_id TEXT UNIQUE NOT NULL, name TEXT NOT NULL, district TEXT, demo BOOLEAN DEFAULT TRUE);
    CREATE TABLE IF NOT EXISTS employers (id SERIAL PRIMARY KEY, employer_id TEXT UNIQUE NOT NULL, name TEXT NOT NULL, district TEXT, demo BOOLEAN DEFAULT TRUE);
    CREATE TABLE IF NOT EXISTS outcomes (id SERIAL PRIMARY KEY, trainee_id TEXT REFERENCES trainees(trainee_id) ON DELETE CASCADE, stage TEXT, status TEXT, confidence INTEGER, verified BOOLEAN DEFAULT FALSE, demo BOOLEAN DEFAULT TRUE);
    CREATE TABLE IF NOT EXISTS followups (id SERIAL PRIMARY KEY, trainee_id TEXT REFERENCES trainees(trainee_id) ON DELETE CASCADE, checkpoint INTEGER, status TEXT, demo BOOLEAN DEFAULT TRUE);
    CREATE TABLE IF NOT EXISTS initiatives (id SERIAL PRIMARY KEY, initiative_id TEXT UNIQUE NOT NULL, name TEXT NOT NULL, organization TEXT, integration_status TEXT, api_status TEXT, records INTEGER DEFAULT 0, demo BOOLEAN DEFAULT TRUE);
    CREATE TABLE IF NOT EXISTS audit_logs (id SERIAL PRIMARY KEY, actor TEXT, action TEXT, record TEXT, result JSONB, timestamp TIMESTAMPTZ DEFAULT NOW(), demo BOOLEAN DEFAULT TRUE);
  `)
}
async function connectDatabase() {
  try { await pool.query('SELECT 1'); await ensureSchema(); ready = true; console.log('SkillPulse API connected to PostgreSQL') } catch (error) { console.warn(`PostgreSQL unavailable; API will use demo fallback (${error.message})`) }
}

app.use(cors())
app.use(express.json())
app.get('/api/health', (_req, res) => res.json({ ok: true, mode: ready ? mode : 'demo', database: 'skillpulse', databaseHost, ivrEnabled: false }))
app.get('/api/dashboard', async (req, res) => {
  const district = req.query.district
  if (!ready) return res.json({ ...fallback, mode: 'demo' })
  const values = district && district !== 'All districts' ? [district] : []
  const where = values.length ? 'WHERE district = $1' : ''
  try {
    const [total, employed, completed, trainees, followups] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS count FROM trainees ${where}`, values),
      pool.query(`SELECT COUNT(*)::int AS count FROM trainees ${where ? `${where} AND` : 'WHERE'} status = 'Employed'`, values),
      pool.query(`SELECT COUNT(*)::int AS count FROM trainees ${where ? `${where} AND` : 'WHERE'} status IN ('Certified', 'Employed')`, values),
      pool.query(`SELECT trainee_id AS "traineeId", name, course, district, status FROM trainees ${where} ORDER BY id LIMIT 8`, values),
      pool.query("SELECT t.name, CONCAT(f.checkpoint, '-day follow-up') AS checkpoint, 'today' AS due FROM followups f JOIN trainees t ON t.trainee_id = f.trainee_id WHERE f.status = 'Due' LIMIT 4"),
    ])
    const totalCount = total.rows[0].count
    return res.json({ stats: { total: totalCount, completed: completed.rows[0].count, employed: employed.rows[0].count, retained: Math.round(totalCount * 0.43) }, trainees: trainees.rows, funnel: fallback.funnel, followups: followups.rows, mode })
  } catch (error) { return res.status(500).json({ error: 'Unable to load dashboard data', detail: error.message }) }
})
app.post('/api/initiatives/:id/sync', async (req, res) => {
  const result = { initiativeId: req.params.id, imported: 128, updated: 93, courses: 21, review: 14, syncedAt: new Date().toISOString() }
  if (ready) await pool.query('INSERT INTO audit_logs (actor, action, record, result) VALUES ($1, $2, $3, $4)', ['demo-admin', 'initiative_sync', req.params.id, result])
  res.json(result)
})

await connectDatabase()
app.listen(port, () => console.log(`SkillPulse API listening on http://localhost:${port}`))
process.on('SIGINT', async () => { await pool.end(); process.exit(0) })
