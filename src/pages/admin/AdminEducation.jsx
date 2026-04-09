import { useEffect, useState, useCallback } from 'react'
import { adminAPI } from '../../services/api'
import AdminCRUD from '../../components/admin/AdminCRUD'
import styles from './AdminForm.module.css'

function EducationForm({ item, onSave, saving, onCancel }) {
  const [form, setForm] = useState({
    institution:  item?.institution  ?? '',
    degree:       item?.degree       ?? '',
    field:        item?.field        ?? '',
    startYear:    item?.startYear    ?? '',
    endYear:      item?.endYear      ?? '',
    grade:        item?.grade        ?? '',
    location:     item?.location     ?? '',
    displayOrder: item?.displayOrder ?? 0,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      institution:  form.institution.trim(),
      degree:       form.degree.trim(),
      field:        form.field.trim(),
      startYear:    form.startYear.trim(),
      endYear:      form.endYear.trim(),
      grade:        form.grade.trim(),
      location:     form.location.trim(),
      displayOrder: Number(form.displayOrder),
    })
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className="form-group">
        <label className="form-label">Institution / College *</label>
        <input name="institution" value={form.institution} onChange={handleChange}
          className="form-input" placeholder="Institution Name" required />
      </div>

      <div className={styles.row}>
        <div className="form-group">
          <label className="form-label">Degree *</label>
          <input name="degree" value={form.degree} onChange={handleChange}
            className="form-input" placeholder="B.Tech / HSC / SSC" required />
        </div>
        <div className="form-group">
          <label className="form-label">Field of Study</label>
          <input name="field" value={form.field} onChange={handleChange}
            className="form-input" placeholder="CSE, IT, AI, DS" />
        </div>
      </div>

      <div className={styles.row}>
        <div className="form-group">
          <label className="form-label">Start Year</label>
          <input name="startYear" value={form.startYear} onChange={handleChange}
            className="form-input" placeholder="2000" />
        </div>
        <div className="form-group">
          <label className="form-label">End Year</label>
          <input name="endYear" value={form.endYear} onChange={handleChange}
            className="form-input" placeholder="2004" />
        </div>
      </div>

      <div className={styles.row}>
        <div className="form-group">
          <label className="form-label">Grade / Score</label>
          <input name="grade" value={form.grade} onChange={handleChange}
            className="form-input" placeholder="7.80 CGPA  or  81.83%" />
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input name="location" value={form.location} onChange={handleChange}
            className="form-input" placeholder="Nagpur, Pune" />
        </div>
      </div>

      {/* <div className="form-group">
        <label className="form-label">Display Order</label>
        <input type="number" name="displayOrder" value={form.displayOrder} onChange={handleChange}
          className="form-input" min="0" max="999" style={{ maxWidth: '140px' }} />
      </div> */}

      <div className={styles.formActions}>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : item ? 'Update Education' : 'Add Education'}
        </button>
      </div>
    </form>
  )
}

export default function AdminEducation() {
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminAPI.getEducation()
      setItems(res.data?.data ?? [])
    } catch (err) {
      console.error('Failed to load education:', err)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async (data, id) => {
    if (id) await adminAPI.updateEducation(id, data)
    else     await adminAPI.createEducation(data)
    await load()
  }

  const handleDelete = async (id) => {
    await adminAPI.deleteEducation(id)
    setItems(prev => prev.filter(x => x.id !== id))
  }

  const columns = [
    { key: 'institution', label: 'Institution' },
    { key: 'degree',      label: 'Degree' },
    { key: 'field',       label: 'Field' },
    { key: 'grade',       label: 'Grade' },
    { key: 'endYear',     label: 'Year' },
  ]

  return (
    <AdminCRUD title="Education" items={items} loading={loading}
      columns={columns}
      renderForm={(props) => <EducationForm {...props} />}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  )
}
