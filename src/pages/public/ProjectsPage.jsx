import { useEffect, useState } from 'react'
import { Github, ExternalLink, Search } from 'lucide-react'
import { publicAPI } from '../../services/api'
import styles from './ProjectsPage.module.css'

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search,   setSearch]   = useState('')
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    publicAPI.getProjects()
      .then(r => { setProjects(r.data.data); setFiltered(r.data.data) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(projects.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.techStack || []).some(t => t.toLowerCase().includes(q))
    ))
  }, [search, projects])

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          {/* <p className={styles.label}>Portfolio</p> */}
          <h1 className="section-title">All Projects</h1>
          {/* <p className="section-subtitle">A collection of what I've built — from full-stack apps to hobby projects.</p> */}

          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon}/>
            <input
              className={styles.searchInput}
              placeholder="Search by name or tech..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="spinner"/>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>No projects found{search ? ` for "${search}"` : ''}.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(proj => (
              <div key={proj.id} className={`card ${styles.card}`}>
                {proj.imageUrl && <img src={proj.imageUrl} alt={proj.title} className={styles.img}/>}
                <div className={styles.cardBody}>
                  <div className={styles.titleRow}>
                    <h3 className={styles.title}>{proj.title}</h3>
                    {proj.featured && <span className="tag">Featured</span>}
                  </div>
                  <p className={styles.desc}>{proj.description}</p>
                  <div className={styles.tech}>
                    {(proj.techStack || []).map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <div className={styles.links}>
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                        <Github size={14}/> Code
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                        <ExternalLink size={14}/> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
