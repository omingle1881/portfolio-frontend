import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, Eye, EyeOff, Code2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const { login, loading, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAdmin) navigate('/admin')
  }, [isAdmin, navigate])

  const handleSubmit = async e => {
    e.preventDefault()
    const ok = await login(username, password)
    if (ok) navigate('/admin')
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.blob1}/><div className={styles.blob2}/>
      </div>

      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <div className={styles.logo}><Code2 size={28}/></div>
          <h1 className={styles.title}>Admin Login</h1>
          <p className={styles.subtitle}>Enter your credentials to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className={styles.inputWrap}>
              <User size={16} className={styles.inputIcon}/>
              <input
                value={username} onChange={e => setUsername(e.target.value)}
                className={`form-input ${styles.input}`}
                placeholder="admin" required autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className={styles.inputWrap}>
              <Lock size={16} className={styles.inputIcon}/>
              <input
                type={showPass ? 'text' : 'password'}
                value={password} onChange={e => setPassword(e.target.value)}
                className={`form-input ${styles.input}`}
                placeholder="••••••••" required
              />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(s => !s)}>
                {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* <p className={styles.hint}>Default: <code>admin</code> / <code>Admin@123</code></p> */}
      </div>
    </div>
  )
}
