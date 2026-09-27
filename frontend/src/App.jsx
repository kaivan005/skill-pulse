import { useEffect, useState } from 'react'
import './App.css'
import LoginPage from './components/LoginPage'
import AppShell from './components/AppShell'
import RoleDashboard from './pages/RoleDashboard'
import RolePage from './pages/RolePage'
import { funnel, trainees } from './data/demo'

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
    fetch('/api/dashboard').then((response) => response.json()).then(setDashboard).catch(() => setDashboard((current) => ({ ...current, mode: 'demo' })))
  }, [user])
  const login = (account) => { setUser(account); setRole(account.role); setActive('Dashboard'); notify(`Signed in as ${account.role}`) }
  if (!user) return <LoginPage onLogin={login} />
  const content = active === 'Dashboard'
    ? <RoleDashboard role={role} dashboard={dashboard} setActive={setActive} />
    : <RolePage role={role} active={active} notify={notify} />
  return <AppShell user={user} role={role} active={active} setActive={setActive} status={dashboard.mode} notify={notify} onLogout={() => setUser(null)} toast={toast}>{content}</AppShell>
}
