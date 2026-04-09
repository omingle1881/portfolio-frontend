import { useEffect, useState, useCallback } from 'react'
import { adminAPI } from '../../services/api'
import AdminCRUD from '../../components/admin/AdminCRUD'
import styles from './AdminForm.module.css'

// ── Form component ───────────────────────────────────────────────
function ProjectForm({ item, onSave, saving, onCancel }) {
  const [form, setForm] = useState({
    title:       item?.title       || '',
    description: item?.description || '',
    imageUrl:    item?.imageUrl    || '',
    techStack:   (item?.techStack  || []).join(', '),
    githubUrl:   item?.githubUrl   || '',
    liveUrl:     item?.liveUrl     || '',
    featured:    item?.featured    || false,
  })

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSave({
      ...form,
      techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input name="title" value={form.title} onChange={handleChange}
          className="form-input" placeholder="Hospital Management System" required />
      </div>
      <div className="form-group">
        <label className="form-label">Description *</label>
        <textarea name="description" value={form.description} onChange={handleChange}
          className="form-input" placeholder="A full-stack application..." required rows={4}/>
      </div>
      <div className="form-group">
        <label className="form-label">Image URL</label>
        <input name="imageUrl" value={form.imageUrl} onChange={handleChange}
          className="form-input" placeholder="https://..." />
      </div>
      <div className="form-group">
        <label className="form-label">Tech Stack (comma-separated)</label>
        <input name="techStack" value={form.techStack} onChange={handleChange}
          className="form-input" placeholder="React, Spring Boot, MongoDB" />
      </div>
      <div className={styles.row}>
        <div className="form-group">
          <label className="form-label">GitHub URL</label>
          <input name="githubUrl" value={form.githubUrl} onChange={handleChange}
            className="form-input" placeholder="https://github.com/..." />
        </div>
        <div className="form-group">
          <label className="form-label">Live URL</label>
          <input name="liveUrl" value={form.liveUrl} onChange={handleChange}
            className="form-input" placeholder="https://..." />
        </div>
      </div>
      <div className={styles.checkRow}>
        <label className={styles.checkLabel}>
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
          <span>Feature on homepage</span>
        </label>
      </div>
      <div className={styles.formActions}>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : item ? 'Update Project' : 'Add Project'}
        </button>
      </div>
    </form>
  )
}

// ── Page ─────────────────────────────────────────────────────────
export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminAPI.getProjects()
      setProjects(res.data?.data ?? [])
    } catch (err) {
      console.error('Failed to load projects:', err)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async (data, id) => {
    if (id) await adminAPI.updateProject(id, data)
    else     await adminAPI.createProject(data)
    await load()
  }

  const handleDelete = async (id) => {
    await adminAPI.deleteProject(id)
    setProjects(p => p.filter(x => x.id !== id))
  }

  const columns = [
    { key: 'title',       label: 'Title' },
    { key: 'techStack',   label: 'Stack',    render: p => (p.techStack || []).slice(0,3).join(', ') },
    // { key: 'featured',    label: 'Featured', render: p => p.featured ? '⭐ Yes' : 'No' },
    { key: 'createdAt',   label: 'Added',    render: p => p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—' },
  ]

  return (
    <AdminCRUD
      title="Projects"
      items={projects}
      loading={loading}
      columns={columns}
      renderForm={props => <ProjectForm {...props}/>}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  )
}
