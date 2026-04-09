import { useEffect, useState } from 'react'
import { Save, User } from 'lucide-react'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'
import styles from './AdminProfile.module.css'

export default function AdminProfile() {
  const [form, setForm]     = useState({
    name:'', title:'', bio:'', email:'', phone:'', location:'',
    profileImageUrl:'', resumeUrl:'',
    githubUrl:'', linkedinUrl:'', twitterUrl:'', websiteUrl:'',
  })
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    adminAPI.getProfile()
      .then(r => { if (r.data.data) setForm(f => ({ ...f, ...r.data.data })) })
      .finally(() => setLoading(false))
  }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminAPI.updateProfile(form)
      toast.success('Profile updated successfully!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="spinner"/>

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Profile</h1>
        <p className={styles.subtitle}>Update your public portfolio information</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.grid}>

          {/* Personal Info */}
          <div className={`card ${styles.section}`}>
            <h2 className={styles.sectionTitle}><User size={18}/> Personal Info</h2>
            <div className={styles.row}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange}
                  className="form-input" placeholder="Om Prem Ingle"/>
              </div>
              <div className="form-group">
                <label className="form-label">Professional Title</label>
                <input name="title" value={form.title} onChange={handleChange}
                  className="form-input" placeholder="Full Stack Developer"/>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange}
                className="form-input" rows={4}
                placeholder="A passionate developer who loves building scalable applications..."/>
            </div>
            <div className={styles.row}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  className="form-input" placeholder="ompremingle1881@gmail.com"/>
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  className="form-input" placeholder="+91 9322461881"/>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input name="location" value={form.location} onChange={handleChange}
                className="form-input" placeholder="Pune, Maharashtra, India"/>
            </div>
          </div>

          {/* Media */}
          <div className={`card ${styles.section}`}>
            <h2 className={styles.sectionTitle}>🖼 Media & Resume</h2>
            <div className="form-group">
              <label className="form-label">Profile Image URL</label>
              <input name="profileImageUrl" value={form.profileImageUrl} onChange={handleChange}
                className="form-input" placeholder="https://... (paste a hosted image URL)"/>
              {form.profileImageUrl && (
                <img src={form.profileImageUrl} alt="Preview"
                  style={{ width:80, height:80, borderRadius:'50%', objectFit:'cover', marginTop:'0.75rem', border:'2px solid var(--border)' }}/>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Resume URL</label>
              <input name="resumeUrl" value={form.resumeUrl} onChange={handleChange}
                className="form-input" placeholder="https://drive.google.com/..."/>
            </div>

            <h2 className={styles.sectionTitle} style={{ marginTop:'1.5rem' }}>🔗 Social Links</h2>
            <div className="form-group">
              <label className="form-label">GitHub</label>
              <input name="githubUrl" value={form.githubUrl} onChange={handleChange}
                className="form-input" placeholder="https://github.com/ompremingle"/>
            </div>
            <div className="form-group">
              <label className="form-label">LinkedIn</label>
              <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange}
                className="form-input" placeholder="https://linkedin.com/in/..."/>
            </div>
            <div className="form-group">
              <label className="form-label">Twitter / X</label>
              <input name="twitterUrl" value={form.twitterUrl} onChange={handleChange}
                className="form-input" placeholder="https://twitter.com/..."/>
            </div>
            {/* <div className="form-group">
              <label className="form-label">Website</label>
              <input name="websiteUrl" value={form.websiteUrl} onChange={handleChange}
                className="form-input" placeholder="https://yourwebsite.com"/>
            </div> */}
          </div>
        </div>

        <div className={styles.saveRow}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={16}/> {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}
