import { useEffect, useState, useCallback } from 'react'
import { adminAPI } from '../../services/api'
import AdminCRUD from '../../components/admin/AdminCRUD'
import styles from './AdminForm.module.css'

function ExperienceForm({ item, onSave, saving, onCancel }) {
  const [form, setForm] = useState({
    company:      item?.company      ?? '',
    role:         item?.role         ?? '',
    startDate:    item?.startDate    ?? '',
    endDate:      item?.endDate      ?? '',
    location:     item?.location     ?? '',
    highlights:   (item?.highlights  ?? []).join('\n'),
    current:      item?.current      ?? false,
    displayOrder: item?.displayOrder ?? 0,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      company:      form.company.trim(),
      role:         form.role.trim(),
      startDate:    form.startDate.trim(),
      endDate:      form.current ? 'Present' : form.endDate.trim(),
      location:     form.location.trim(),
      highlights:   form.highlights.split('\n').map(h => h.trim()).filter(Boolean),
      current:      form.current,
      displayOrder: Number(form.displayOrder),
    })
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row}>

        <div className="form-group">
          <label className="form-label">Company *</label>
          <input name="company" value={form.company} onChange={handleChange}
            className="form-input" placeholder="xyz" required />
        </div>

        <div className="form-group">
          <label className="form-label">Role / Position *</label>
          <input name="role" value={form.role} onChange={handleChange}
            className="form-input" placeholder="Developer" required />
        </div>
      </div>

      <div className={styles.row}>
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input name="startDate" value={form.startDate} onChange={handleChange}
            className="form-input" placeholder="12 Jan 2026" />
        </div>
        <div className="form-group">
          <label className="form-label">End Date</label>
          <input name="endDate" value={form.endDate} onChange={handleChange}
            className="form-input" placeholder="12 Dec 2026"
            disabled={form.current}
            style={{ opacity: form.current ? 0.5 : 1 }}
          />
        </div>
      </div>

      <div className={styles.checkRow}>
        <label className={styles.checkLabel}>
          <input type="checkbox" name="current" checked={form.current} onChange={handleChange} />
          <span>I currently work here</span>
        </label>
      </div>

      <div className={styles.row}>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input name="location" value={form.location} onChange={handleChange}
            className="form-input" placeholder="Pune, Nagpur" />
        </div>

        {/* <div className="form-group">
          <label className="form-label">Display Order</label>
          <input type="number" name="displayOrder" value={form.displayOrder} onChange={handleChange}
            className="form-input" min="0" max="999" />
        </div> */}
      </div>

      <div className="form-group">
        <label className="form-label">Highlights / Responsibilities</label>
        <textarea name="highlights" value={form.highlights} onChange={handleChange}
          className="form-input" rows={5} required
          //placeholder={`Developed full-stack SaaS features using React.js and Spring Boot\nDesigned RESTful APIs with JWT authentication and RBAC\nWorked in Agile sprints with code reviews`}
        />
        {/* <small style={{ color: 'var(--text-3)', fontSize: '0.78rem' }}>Each line becomes a separate bullet point</small> */}
      </div>

      <div className={styles.formActions}>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : item ? 'Update Experience' : 'Add Experience'}
        </button>
      </div>
    </form>
  )
}

export default function AdminExperience() {
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminAPI.getExperience()
      setItems(res.data?.data ?? [])
    } catch (err) {
      console.error('Failed to load experience:', err)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async (data, id) => {
    if (id) await adminAPI.updateExperience(id, data)
    else     await adminAPI.createExperience(data)
    await load()
  }

  const handleDelete = async (id) => {
    await adminAPI.deleteExperience(id)
    setItems(prev => prev.filter(x => x.id !== id))
  }

  const columns = [
    { key: 'company',   label: 'Company' },
    { key: 'role',      label: 'Role' },
    { key: 'startDate', label: 'Start' },
    { key: 'endDate',   label: 'End', render: e => e.current ? '✅ Present' : (e.endDate || '—') },
    { key: 'location',  label: 'Location' },
  ]

  return (
    <AdminCRUD title="Experience" items={items} loading={loading}
      columns={columns}
      renderForm={(props) => <ExperienceForm {...props} />}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  )
}
