import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FolderOpen, Zap, Briefcase,
  GraduationCap, MessageSquare, User, LogOut, Menu, X, Code2
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import styles from './AdminLayout.module.css'

const NAV = [
  { to: '/admin',            label: 'Dashboard',  icon: LayoutDashboard, end: true },
  { to: '/admin/projects',   label: 'Projects',   icon: FolderOpen },
  { to: '/admin/skills',     label: 'Skills',     icon: Zap },
  { to: '/admin/experience', label: 'Experience', icon: Briefcase },
  { to: '/admin/education',  label: 'Education',  icon: GraduationCap },
  { to: '/admin/messages',   label: 'Messages',   icon: MessageSquare },
  { to: '/admin/profile',    label: 'Profile',    icon: User },
]

export default function AdminLayout() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}><Code2 size={20}/> Admin</div>
          <button className={styles.closeBtn} onClick={() => setSidebarOpen(false)}><X size={18}/></button>
        </div>

        <div className={styles.adminInfo}>
          <div className={styles.avatar}>{admin?.username?.[0]?.toUpperCase()}</div>
          <div>
            <div className={styles.adminRole}>Administrator</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18}/> {label}
            </NavLink>
          ))}
        </nav>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={18}/> Logout
        </button>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}><Menu size={22}/></button>
          <span className={styles.topbarTitle}>Admin Portfolio</span>
        </header>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
