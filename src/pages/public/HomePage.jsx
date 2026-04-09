import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Github, Linkedin, Mail, ArrowRight, MapPin, Phone, ExternalLink, ChevronRight } from 'lucide-react'
import { publicAPI } from '../../services/api'
import styles from './HomePage.module.css'

export default function HomePage() {
  const [profile,    setProfile]    = useState(null)
  const [skills,     setSkills]     = useState([])
  const [experience, setExperience] = useState([])
  const [education,  setEducation]  = useState([])
  const [projects,   setProjects]   = useState([])

  useEffect(() => {
    Promise.all([
      publicAPI.getProfile(),
      publicAPI.getSkills(),
      publicAPI.getExperience(),
      publicAPI.getEducation(),
      publicAPI.getFeatured(),
    ]).then(([p, s, ex, edu, proj]) => {
      setProfile(p.data.data)
      setSkills(s.data.data)
      setExperience(ex.data.data)
      setEducation(edu.data.data)
      setProjects(proj.data.data)
    }).catch(() => {})
  }, [])

  // Group skills by category
  const skillGroups = skills.reduce((acc, s) => {
    acc[s.category] = acc[s.category] || []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.blob1}/>
          <div className={styles.blob2}/>
          <div className={styles.grid}/>
        </div>
        <div className="container">
          <div className={styles.heroInner}>
            <div className={styles.heroText}>
              <span className={`tag ${styles.badge}`}>Software Developer</span>
              <h1 className={styles.heroTitle}>
                Hi, I'm <span className={styles.heroName}>{profile?.name || 'Om Ingle'}</span>
              </h1>
              <p className={styles.heroRole}>{profile?.title || 'Full Stack Developer'}</p>
              <p className={styles.heroBio}>
                {profile?.bio || 'Passionate about building full-stack applications with Java Spring Boot and React. Currently interning at Fourise Software Solution, crafting scalable SaaS platforms.'}
              </p>
              <div className={styles.heroMeta}>
                {profile?.location && <span><MapPin size={14}/> {profile.location}</span>}
                {profile?.email    && <span><Mail size={14}/> {profile.email}</span>}
              </div>
              <div className={styles.heroCTA}>
                <Link to="/projects" className="btn btn-primary">
                  View Projects <ArrowRight size={16}/>
                </Link>
                <Link to="/contact" className="btn btn-outline">
                  Contact Me
                </Link>
              </div>
              <div className={styles.socials}>
                {profile?.githubUrl   && <a href={profile.githubUrl}   target="_blank" rel="noreferrer" className={styles.social}><Github size={20}/></a>}
                {profile?.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className={styles.social}><Linkedin size={20}/></a>}
                {profile?.email       && <a href={`mailto:${profile.email}`} className={styles.social}><Mail size={20}/></a>}
              </div>
            </div>

            <div className={styles.heroPhoto}>
              {profile?.profileImageUrl
                ? <img src={profile.profileImageUrl} alt={profile.name} className={styles.photo}/>
                : <div className={styles.photoPlaceholder}>
                    <span>{(profile?.name || 'O')[0]}</span>
                  </div>
              }
              <div className={styles.photoRing}/>
              {/* <div className={styles.floatCard1}><Linkedin size={16}/> Open to work</div>
              <div className={styles.floatCard2}><span className={styles.dot}/>Available now</div> */}
            </div>
          </div>
        </div>
      </section>

      {/* ── Skills ── */}
      <section className={`section ${styles.skillsSection}`}>
        <div className="container">
          <p className={styles.sectionLabel}></p>
          <h2 className="section-title">Technical Skills</h2>
          <p className="section-subtitle">A toolkit built through real projects and internship experience.</p>

          <div className={styles.skillGroups}>
            {Object.entries(skillGroups).map(([cat, items]) => (
              <div key={cat} className={`card ${styles.skillCard}`}>
                <h3 className={styles.skillCat}>{cat}</h3>
                <div className={styles.skillList}>
                  {items.map(skill => (
                    <div key={skill.id} className={styles.skillItem}>
                      <div className={styles.skillTop}>
                        <span className={styles.skillName}>{skill.name}</span>
                        <span className={styles.skillPct}>{skill.proficiency}%</span>
                      </div>
                      <div className={styles.skillBar}>
                        <div className={styles.skillFill} style={{ width: `${skill.proficiency}%` }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Static fallback if no skills in DB yet */}
            {skills.length === 0 && [
              { cat: 'Frontend', items: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Tailwind'] },
              { cat: 'Backend',  items: ['Java', 'Spring Boot', 'Spring Security', 'Apache Kafka'] },
              { cat: 'Database', items: ['MongoDB', 'MySQL', 'Hibernate ORM'] },
              { cat: 'Tools',    items: ['Git', 'GitHub', 'Postman', 'IntelliJ IDEA', 'VS Code'] },
            ].map(({ cat, items }) => (
              <div key={cat} className={`card ${styles.skillCard}`}>
                <h3 className={styles.skillCat}>{cat}</h3>
                <div className={styles.tagList}>
                  {items.map(i => <span key={i} className="tag">{i}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience ── */}
      <section className={`section ${styles.expSection}`}>
        <div className="container">
          <p className={styles.sectionLabel}></p>
          <h2 className="section-title">Experience</h2>
          <p className="section-subtitle">Hands-on professional experience building real products.</p>

          <div className={styles.timeline}>
            {(experience.length > 0 ? experience : [{
              id: '1', company: 'Fourise Software Solution Pvt. Ltd.', role: 'Software Developer Intern',
              startDate: 'Jan 2026', endDate: 'Present', location: 'Pune', current: true,
              highlights: [
                'Developed full-stack SaaS platform features using React.js and Java Spring Boot.',
                'Designed RESTful APIs with JWT authentication and Role-Based Access Control (RBAC).',
                'Worked in Agile environment, contributing to sprint planning and code reviews.',
              ]
            }]).map((exp, i) => (
              <div key={exp.id || i} className={styles.timelineItem}>
                <div className={styles.timelineDot}>{exp.current && <span className={styles.pulse}/>}</div>
                <div className={`card ${styles.timelineCard}`}>
                  <div className={styles.expHeader}>
                    <div>
                      <h3 className={styles.expRole}>{exp.role}</h3>
                      <p className={styles.expCompany}>{exp.company}</p>
                    </div>
                    <div className={styles.expMeta}>
                      <span className="tag">{exp.startDate} – {exp.endDate || 'Present'}</span>
                      {exp.location && <span className={styles.expLoc}><MapPin size={12}/> {exp.location}</span>}
                    </div>
                  </div>
                  <ul className={styles.highlights}>
                    {(exp.highlights || []).map((h, j) => (
                      <li key={j}><ChevronRight size={14} className={styles.bullet}/> {h}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Education ── */}
      <section className={`section ${styles.eduSection}`}>
        <div className="container">
          <p className={styles.sectionLabel}></p>
          <h2 className="section-title">Education</h2>

          <div className={styles.eduGrid}>
            {(education.length > 0 ? education : [
              { id:'1', institution:'J D College Of Engineering And Management', degree:'B.Tech', field:'Computer Science Engineering', startYear:'2022', endYear:'2026', grade:'7.80 CGPA', location:'Nagpur' },
              { id:'2', institution:'Shivaji Highschool And Junior College', degree:'HSC', grade:'81.83%', startYear:'2021', endYear:'2022', location:'Sawaldabara' },
              { id:'3', institution:'M E S Highschool Dhamangaon Badhe', degree:'SSC', grade:'89.60%', startYear:'2019', endYear:'2020', location:'Dhamangaon' },
            ]).map(edu => (
              <div key={edu.id} className={`card ${styles.eduCard}`}>
                <div className={styles.eduIcon}>🎓</div>
                <h3 className={styles.eduInstitution}>{edu.institution}</h3>
                <p className={styles.eduDegree}>{edu.degree}{edu.field ? ` — ${edu.field}` : ''}</p>
                <div className={styles.eduBottom}>
                  <span className="tag">{edu.grade}</span>
                  <span className={styles.eduYear}>{edu.startYear}–{edu.endYear}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Projects ── */}
      {projects.length > 0 && (
        <section className={`section ${styles.featuredSection}`}>
          <div className="container">
            <p className={styles.sectionLabel}></p>
            <h2 className="section-title">Projects</h2>
            <div className={styles.featuredGrid}>
              {projects.slice(0, 3).map(proj => (
                <div key={proj.id} className={`card ${styles.projCard}`}>
                  {proj.imageUrl && <img src={proj.imageUrl} alt={proj.title} className={styles.projImg}/>}
                  <h3 className={styles.projTitle}>{proj.title}</h3>
                  <p className={styles.projDesc}>{proj.description}</p>
                  <div className={styles.projTech}>
                    {(proj.techStack || []).map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <div className={styles.projLinks}>
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><Github size={14}/> Code</a>}
                    {proj.liveUrl  && <a href={proj.liveUrl}   target="_blank" rel="noreferrer" className="btn btn-primary btn-sm"><ExternalLink size={14}/> Live</a>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center', marginTop:'2.5rem' }}>
              <Link to="/projects" className="btn btn-outline">View All Projects <ArrowRight size={16}/></Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBanner}>
            <h2>Let's build something great together</h2>
            <p>Looking for a passionate full-stack developer? I'm available for internships and full-time roles.</p>
            <Link to="/contact" className="btn btn-primary">Get In Touch <ArrowRight size={16}/></Link>
          </div>
        </div>
      </section>

    </div>
  )
}
