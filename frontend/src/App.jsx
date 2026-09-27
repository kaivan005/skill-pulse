import { useEffect, useState } from 'react'
import './App.css'
import LoginPage from './components/LoginPage'
import AppShell from './components/AppShell'
import RoleDashboard from './pages/RoleDashboard'
import RolePage from './pages/RolePage'
import { funnel, trainees } from './data/demo'
import { apiFetch } from './api'

const initialDashboard = { stats: { total: 3240, completed: 2528, employed: 1750, retained: 1393 }, trainees, funnel, mode: 'loading' }

export default function App() {
  const [user, setUser] = useState(null)
  const [active, setActive] = useState('Dashboard')
  const [role, setRole] = useState('Admin')
  const [dashboard, setDashboard] = useState(initialDashboard)
  const [toast, setToast] = useState('')
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2800) }
  useEffect(() => {
    if (!user) return
    apiFetch('/api/dashboard', { headers: { 'x-skillpulse-role': role } }).then((response) => response.json()).then(setDashboard).catch(() => setDashboard((current) => ({ ...current, mode: 'demo' })))
  }, [role, user])
  const login = (account) => { apiFetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: account.email, password: account.password }) }).then((response) => { if (!response.ok) throw new Error('Login failed'); return response.json() }).then((session) => { localStorage.setItem('skillpulse-role', session.role); setUser(session); setRole(session.role); setActive('Dashboard'); notify(`Signed in as ${session.role}`) }).catch(() => { localStorage.setItem('skillpulse-role', account.role); setUser(account); setRole(account.role); setActive('Dashboard'); notify(`Signed in as ${account.role} in demo mode`) }) }
  const apiAction = (action, record = 'workspace') => { apiFetch('/api/actions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-skillpulse-role': role }, body: JSON.stringify({ action, record }) }).then((response) => response.json()).then((result) => notify(result.status === 'completed' ? `${action} completed` : result.error)).catch(() => notify(`${action} completed in demo mode`)) }
  if (!user) return <LoginPage onLogin={login} />
  const content = active === 'Dashboard'
    ? <RoleDashboard role={role} dashboard={dashboard} setActive={setActive} onAction={apiAction} />
    : <RolePage role={role} active={active} notify={notify} />
  return <AppShell user={user} role={role} active={active} setActive={setActive} status={dashboard.mode} notify={notify} onLogout={() => { localStorage.removeItem('skillpulse-role'); setUser(null) }} toast={toast}>{content}</AppShell>
}
