import { useEffect, useState } from 'react'
import './App.css'

const navGroups = [
  { label: 'Workspace', items: [['Dashboard', '▦'], ['Trainees', '♙'], ['Courses', '▤'], ['Outcomes', '↗']] },
  { label: 'Insights', items: [['Follow-ups', '◷'], ['Skill gaps', '⌁'], ['Analytics', '◒']] },
  { label: 'Platform', items: [['Initiatives', '⇄'], ['Audit logs', '≡']] },
]
const trainees = [
  { initials: 'AM', name: 'Aarav Mehta', course: 'Web Development', district: 'Pune', status: 'Employed', color: 'teal' },
  { initials: 'SK', name: 'Sana Khan', course: 'Data Analytics', district: 'Jaipur', status: 'Follow-up due', color: 'orange' },
  { initials: 'RN', name: 'Riya Nair', course: 'EV Technician', district: 'Kochi', status: 'Certified', color: 'blue' },
  { initials: 'VK', name: 'Vikram Kumar', course: 'Web Development', district: 'Patna', status: 'Looking for work', color: 'red' },
]
const funnel = [['Training', 100, '3,240'], ['Certified', 78, '2,528'], ['Placed', 62, '2,009'], ['Employed', 54, '1,750'], ['180-day retention', 43, '1,393']]

function Icon({ children }) { return <span className="icon" aria-hidden="true">{children}</span> }

function App() {
  const [active, setActive] = useState('Dashboard')
  const [role, setRole] = useState('Admin')
  const [district, setDistrict] = useState('All districts')
  const [toast, setToast] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [dashboard, setDashboard] = useState({ stats: { total: 3240, completed: 2528, employed: 1750, retained: 1393 }, trainees, funnel, mode: 'loading' })
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2800) }
  useEffect(() => {
    fetch(`/api/dashboard?district=${encodeURIComponent(district)}`)
      .then((response) => response.json())
      .then(setDashboard)
      .catch(() => setDashboard((current) => ({ ...current, mode: 'demo' })))
  }, [district])
  const syncInitiative = () => {
    setSyncing(true)
    fetch('/api/initiatives/INIT-1/sync', { method: 'POST' })
      .then((response) => response.json())
      .then((result) => notify(`Initiative Alpha synced: ${result.imported} imported, ${result.updated} updated`))
      .catch(() => notify('Sync queued in demo mode'))
      .finally(() => setSyncing(false))
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">S</span><span>Skill<span>Pulse</span><small>AI</small></span></div>
      <div className="demo-pill"><span className="live-dot" /> {dashboard.mode === 'mongodb' ? 'MongoDB connected' : 'Demo workspace'}</div>
      <nav>{navGroups.map((group) => <div className="nav-group" key={group.label}><p>{group.label}</p>{group.items.map(([label, icon]) => <button className={active === label ? 'nav-item active' : 'nav-item'} key={label} onClick={() => setActive(label)}><Icon>{icon}</Icon>{label}{label === 'Follow-ups' && <b>4</b>}</button>)}</div>)}</nav>
      <div className="sidebar-footer"><div className="privacy"><Icon>◉</Icon><span><strong>Privacy first</strong><small>Consent-based tracking</small></span></div><button className="profile-mini" onClick={() => notify('Profile settings opened')}><span className="avatar dark">AK</span><span><strong>Arjun Kapoor</strong><small>{role} account</small></span><span>⌄</span></button></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div className="crumb"><span>Workspace</span><b>/</b><strong>{active}</strong></div><div className="top-actions"><label className="role-select"><span>Viewing as</span><select value={role} onChange={(e) => { setRole(e.target.value); notify(`${e.target.value} workspace selected`) }}><option>Admin</option><option>Provider</option><option>Employer</option><option>Trainee</option></select></label><button className="icon-button" aria-label="Notifications" onClick={() => notify('You have 4 follow-ups needing attention')}>♧<i /></button><button className="avatar">AK</button></div></header>
      <div className="content-wrap">
        <section className="welcome"><div><p className="eyebrow">SUNDAY, 27 SEPTEMBER 2026 <span className="status-dot" /> LIVE DEMO DATA</p><h1>Track what happens <em>after training.</em></h1><p className="subtitle">A clear view of the journey from learning to lasting livelihoods.</p></div><div className="quick-actions"><button className="button secondary" onClick={() => notify('Opening trainee directory')}><Icon>♙</Icon> View trainee</button><button className="button primary" onClick={syncInitiative}><Icon>↗</Icon> {syncing ? 'Syncing...' : 'Sync initiative'}</button></div></section>
        <section className="filter-row"><div className="filter-label"><Icon>⌖</Icon><span>Outcomes overview</span></div><select value={district} onChange={(e) => setDistrict(e.target.value)}><option>All districts</option><option>Pune</option><option>Jaipur</option><option>Kochi</option><option>Patna</option></select><select><option>All providers</option><option>Bridge Skills Foundation</option><option>Udaan Learning</option></select><select><option>Last 12 months</option><option>Last 90 days</option></select><button className="filter-button" onClick={() => notify('Filters reset')}>↻ Reset</button></section>
        <section className="stats-grid">{[['Total trainees', dashboard.stats.total.toLocaleString(), '↑ 12.8%', 'teal', '♙'], ['Training completed', dashboard.stats.completed.toLocaleString(), '↑ 8.4%', 'blue', '✓'], ['Currently employed', dashboard.stats.employed.toLocaleString(), '↑ 16.2%', 'orange', '↗'], ['Retained 180 days', dashboard.stats.retained.toLocaleString(), '↑ 6.7%', 'red', '◷']].map(([label, value, change, color, icon]) => <article className="stat-card" key={label}><div className={`stat-icon ${color}`}>{icon}</div><div><p>{label}</p><strong>{value}</strong><small className="positive">{change} <span>vs last period</span></small></div><span className="spark">⌁</span></article>)}</section>
        <section className="dashboard-grid"><article className="panel funnel-panel"><div className="panel-heading"><div><p className="eyebrow">THE JOURNEY</p><h2>Training to livelihood</h2></div><button className="more-button" onClick={() => setActive('Analytics')}>View analytics <span>↗</span></button></div><div className="journey"><div className="journey-line" />{dashboard.funnel.map(([label, width, count], index) => <div className="journey-step" key={label}><div className={`step-marker marker-${index}`}>{index + 1}</div><div className="step-copy"><span>{label}</span><strong>{count}</strong><div className="bar"><i style={{ width: `${width}%` }} /></div></div><small>{width}%</small></div>)}</div></article><article className="panel confidence-panel"><div className="panel-heading"><div><p className="eyebrow">DATA QUALITY</p><h2>Outcome confidence</h2></div><span className="info">i</span></div><div className="confidence-score"><div className="ring"><strong>82</strong><span>/100</span></div><div><strong>Strong signal</strong><p>Across verified outcome records</p></div></div><div className="confidence-list"><div><span className="legend teal-bg" />Employer verified <b>64%</b></div><div><span className="legend yellow-bg" />Provider verified <b>21%</b></div><div><span className="legend pale-bg" />Self reported <b>15%</b></div></div><button className="full-button" onClick={() => setActive('Outcomes')}>Review low-confidence records <span>→</span></button></article></section>
        <section className="lower-grid"><article className="panel"><div className="panel-heading"><div><p className="eyebrow">RECENT ACTIVITY</p><h2>People to watch</h2></div><button className="more-button" onClick={() => setActive('Trainees')}>See all <span>↗</span></button></div><div className="table-wrap"><table><thead><tr><th>TRAINEE</th><th>COURSE</th><th>LOCATION</th><th>STATUS</th><th /></tr></thead><tbody>{(dashboard.trainees || []).map((person) => <tr key={person.name}><td><div className="person"><span className={`avatar ${person.color || 'teal'}`}>{person.initials || person.name?.slice(0, 2).toUpperCase()}</span><strong>{person.name}</strong></div></td><td>{person.course}</td><td>{person.district}</td><td><span className={`badge ${person.color || 'teal'}`}>{person.status}</span></td><td><button className="row-more" onClick={() => notify(`${person.name}'s profile opened`)}>···</button></td></tr>)}</tbody></table></div></article><article className="panel follow-panel"><div className="panel-heading"><div><p className="eyebrow">NEXT BEST ACTION</p><h2>Follow-ups</h2></div><span className="count-badge">4 due</span></div><div className="follow-highlight"><span className="big-icon">◷</span><div><strong>Close the feedback loop</strong><p>4 trainees are due for their 90-day check-in.</p></div></div><div className="follow-row"><span className="avatar orange">SK</span><div><strong>Sana Khan</strong><small>90-day follow-up · due today</small></div><button onClick={() => notify('Follow-up marked as sent')}>Send ↗</button></div><div className="follow-row"><span className="avatar blue">RN</span><div><strong>Riya Nair</strong><small>30-day follow-up · due tomorrow</small></div><button onClick={() => notify('Follow-up marked as sent')}>Send ↗</button></div><button className="full-button" onClick={() => setActive('Follow-ups')}>Open follow-up queue <span>→</span></button></article></section>
        <footer className="app-footer"><span><i className="live-dot" /> All systems operational</span><span>Last data sync: 8 min ago</span><span className="footer-right">IVR integration <strong>Coming soon / disabled</strong></span></footer>
      </div>
    </main>
    {toast && <div className="toast"><span>✓</span>{toast}</div>}
  </div>
}

export default App
