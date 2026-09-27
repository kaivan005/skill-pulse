import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://skillpulse:skillpulse@127.0.0.1:5432/skillpulse' })
const districts = ['Pune', 'Jaipur', 'Kochi', 'Patna', 'Bengaluru', 'Nashik']
const statuses = ['Employed', 'Follow-up due', 'Certified', 'Looking for work']
const courses = [
  { name: 'Web Development Fundamentals', skills: ['HTML', 'CSS', 'JavaScript', 'Git'], durationWeeks: 12, provider: 'Bridge Skills Foundation' },
  { name: 'Data Analytics Fundamentals', skills: ['Excel', 'SQL', 'Python', 'Data Visualization'], durationWeeks: 10, provider: 'Udaan Learning' },
  { name: 'Electric Vehicle Technician', skills: ['EV fundamentals', 'Battery systems', 'Electrical safety', 'Diagnostics'], durationWeeks: 14, provider: 'Nirmaan Skills Centre' },
]
const trainees = Array.from({ length: 24 }, (_, index) => ({
  traineeId: `SP-${String(index + 1).padStart(4, '0')}`,
  name: ['Aarav Mehta', 'Sana Khan', 'Riya Nair', 'Vikram Kumar'][index % 4],
  email: `demo.trainee${index + 1}@skillpulse.test`, district: districts[index % districts.length], course: courses[index % courses.length].name,
  status: statuses[index % statuses.length], salary: 18000 + ((index * 1750) % 23000), consent: true,
}))

async function seed() {
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
  await pool.query('TRUNCATE trainees, courses, providers, employers, outcomes, followups, initiatives, audit_logs RESTART IDENTITY CASCADE')
  for (const [index, trainee] of trainees.entries()) await pool.query('INSERT INTO trainees (trainee_id, name, email, district, course, status, salary, consent) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [trainee.traineeId, trainee.name, trainee.email, trainee.district, trainee.course, trainee.status, trainee.salary, trainee.consent])
  for (const [index, course] of courses.entries()) await pool.query('INSERT INTO courses (course_id, name, skills, duration_weeks, provider) VALUES ($1,$2,$3,$4,$5)', [`COURSE-${index + 1}`, course.name, JSON.stringify(course.skills), course.durationWeeks, course.provider])
  for (const [index, name] of ['Bridge Skills Foundation', 'Udaan Learning', 'Nirmaan Skills Centre'].entries()) await pool.query('INSERT INTO providers (provider_id, name, district) VALUES ($1,$2,$3)', [`PROVIDER-${index + 1}`, name, districts[index]])
  for (const [index, name] of ['Northstar Digital', 'Kinetic Mobility', 'Civic Data Labs'].entries()) await pool.query('INSERT INTO employers (employer_id, name, district) VALUES ($1,$2,$3)', [`EMPLOYER-${index + 1}`, name, districts[index]])
  for (const [index, trainee] of trainees.entries()) {
    await pool.query('INSERT INTO outcomes (trainee_id, stage, status, confidence, verified) VALUES ($1,$2,$3,$4,$5)', [trainee.traineeId, 'employment', trainee.status, 65 + (index % 30), index % 3 === 0])
    await pool.query('INSERT INTO followups (trainee_id, checkpoint, status) VALUES ($1,$2,$3)', [trainee.traineeId, index % 2 ? 30 : 90, index < 4 ? 'Due' : 'Responded'])
  }
  for (const [index, name] of ['Initiative Alpha', 'Initiative Beta', 'Initiative Gamma'].entries()) await pool.query('INSERT INTO initiatives (initiative_id, name, organization, integration_status, api_status, records) VALUES ($1,$2,$3,$4,$5,$6)', [`INIT-${index + 1}`, name, 'Demo programme', 'Connected', 'Mock API', 128 - index * 17])
  await pool.query("INSERT INTO audit_logs (actor, action, record) VALUES ('seed', 'seed_demo_dataset', 'all')")
  console.log('Seeded SkillPulse demo data in PostgreSQL')
}

try { await seed() } finally { await pool.end() }
