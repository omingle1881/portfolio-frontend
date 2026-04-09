import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'
import { Menu, X, Code2 } from 'lucide-react'
import styles from './PublicLayout.module.css'

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={styles.layout}>
      {/* ── Navbar ── */}
      <header className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link to="/" className={styles.logo}>
            <Code2 size={22} />
            <span>Om<span className={styles.accent}></span></span>
          </Link>

          <nav className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
            {[['/', 'Home'], ['/projects', 'Projects'], ['/contact', 'Contact']].map(([to, label]) => (
              <NavLink key={to} to={to} end className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              } onClick={() => setMenuOpen(false)}>
                {label}
              </NavLink>
            ))}
            <Link to="/admin/login" className={`btn btn-outline btn-sm ${styles.adminBtn}`}>
              Admin
            </Link>
          </nav>

          <button className={styles.burger} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ── Content ── */}
      <main className={styles.main}>
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className="container">
          <p>© {new Date().getFullYear()} Om Prem Ingle — Built with Spring Boot & React</p>
        </div>
      </footer>
    </div>
  )
}
