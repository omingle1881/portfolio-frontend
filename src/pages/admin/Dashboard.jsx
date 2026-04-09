import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderOpen, Zap, MessageSquare, Briefcase, GraduationCap, Mail } from 'lucide-react'
import { adminAPI } from '../../services/api'
import styles from './Dashboard.module.css'

const STAT_CARDS = [
  { key:'totalProjects',   label:'Projects',    icon: FolderOpen,     link:'/admin/projects',   color:'#6c63ff' },
  { key:'totalSkills',     label:'Skills',      icon: Zap,            link:'/admin/skills',     color:'#38bdf8' },
  { key:'totalExperiences',label:'Experiences', icon: Briefcase,      link:'/admin/experience', color:'#f59e0b' },
  { key:'totalEducation',  label:'Education',   icon: GraduationCap,  link:'/admin/education',  color:'#22c55e' },
  { key:'totalMessages',   label:'Messages',    icon: MessageSquare,  link:'/admin/messages',   color:'#f472b6' },
  { key:'unreadMessages',  label:'Unread Msgs', icon: Mail,           link:'/admin/messages',   color:'#ef4444' },
]

export default function Dashboard() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getDashboard()
      .then(r => setStats(r.data.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Welcome back! Here's an overview of your portfolio.</p>
      </div>

      {loading ? (
        <div className="spinner"/>
      ) : (
        <div className={styles.grid}>
          {STAT_CARDS.map(({ key, label, icon: Icon, link, color }) => (
            <Link to={link} key={key} className={styles.card}>
              <div className={styles.cardIcon} style={{ background: `${color}22`, color }}>
                <Icon size={24}/>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardValue}>{stats?.[key] ?? 0}</div>
                <div className={styles.cardLabel}>{label}</div>
              </div>
              {key === 'unreadMessages' && stats?.unreadMessages > 0 && (
                <span className={styles.badge}>{stats.unreadMessages}</span>
              )}
            </Link>
          ))}
        </div>
      )}

      <div className={styles.quickLinks}>
        <h2 className={styles.qlTitle}>Quick Actions</h2>
        <div className={styles.qlGrid}>
          {[
            { to:'/admin/projects', label:'Add Project',    desc:'Showcase a new project' },
            { to:'/admin/skills',   label:'Add Skill',      desc:'Add a new technology' },
            { to:'/admin/profile',  label:'Edit Profile',   desc:'Update your info & bio' },
            { to:'/admin/messages', label:'View Messages',  desc:'Check contact ' },
          ].map(({ to, label, desc }) => (
            <Link key={to} to={to} className={`card ${styles.qlCard}`}>
              <div className={styles.qlLabel}>{label}</div>
              <div className={styles.qlDesc}>{desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
