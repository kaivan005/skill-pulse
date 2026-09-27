import { useState } from 'react'
import { accounts } from '../data/demo'

function Avatar({ children, color = '' }) { return <span className={`avatar ${color}`}>{children}</span> }

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState(accounts[0].email)
  const [password, setPassword] = useState(accounts[0].password)
  const [error, setError] = useState('')
  const submit = (event) => {
    event.preventDefault()
    const account = accounts.find((item) => item.email === email && item.password === password)
    if (!account) return setError('Use one of the demo accounts below.')
    onLogin(account)
  }
  return <main className="login-page"><div className="login-art"><div className="brand login-brand"><span className="brand-mark">S</span><span>Skill<span>Pulse</span><small>AI</small></span></div><div className="login-message"><p className="eyebrow">OUTCOME INTELLIGENCE PLATFORM</p><h1>See the full journey<br /><em>after training.</em></h1><p>Connect learning, work, and long-term outcomes in one clear view.</p><div className="login-journey"><span>Training</span><i>→</i><span>Employment</span><i>→</i><span>Livelihoods</span></div></div></div><section className="login-card"><div className="login-heading"><p className="eyebrow">WELCOME BACK</p><h2>Sign in to SkillPulse</h2><p>Use a demo account to explore each role workspace.</p></div><form onSubmit={submit}><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{error && <p className="form-error">{error}</p>}<button className="button primary login-button" type="submit">Sign in <span>→</span></button></form><div className="demo-accounts"><div className="account-title"><span>Demo accounts</span><small>For testing only</small></div>{accounts.map((account) => <button className="account-row" key={account.role} onClick={() => { setEmail(account.email); setPassword(account.password); setError('') }}><Avatar color={account.role.toLowerCase()}>{account.initials}</Avatar><span><strong>{account.role}</strong><small>{account.email}</small></span><code>{account.password}</code></button>)}</div><p className="login-foot"><span className="live-dot" /> Demo environment · No real personal data</p></section></main>
}
