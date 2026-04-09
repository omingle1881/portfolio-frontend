import { useEffect, useState, useCallback } from 'react'
import { adminAPI } from '../../services/api'
import AdminCRUD from '../../components/admin/AdminCRUD'
import styles from './AdminForm.module.css'

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other']

function SkillForm({ item, onSave, saving, onCancel }) {
  const [form, setForm] = useState({
    name:         item?.name         ?? '',
    category:     item?.category     ?? 'Frontend',
    proficiency:  item?.proficiency  ?? 80,
    icon:         item?.icon         ?? '',
    displayOrder: item?.displayOrder ?? 0,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    const isNum = name === 'proficiency' || name === 'displayOrder'
    setForm(f => ({ ...f, [name]: isNum ? Number(value) : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      name: form.name.trim(),
      category: form.category,
      proficiency: Number(form.proficiency),
      // icon: form.icon.trim(),
      // displayOrder: Number(form.displayOrder),
    })
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row}>
        <div className="form-group">
          <label className="form-label">Skill Name *</label>
          <input name="name" value={form.name} onChange={handleChange}
            className="form-input" placeholder="e.g. React, Spring Boot" required />
        </div>
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select name="category" value={form.category} onChange={handleChange}
            className="form-input" style={{ cursor: 'pointer', background: 'var(--bg-3)', color: 'var(--text-1)' }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Proficiency: <strong style={{ color: 'var(--accent-2)' }}>{form.proficiency}%</strong>
        </label>
        <input type="range" name="proficiency" min="1" max="100"
          value={form.proficiency} onChange={handleChange}
          style={{ width: '100%', accentColor: 'var(--accent)', marginTop: '0.5rem', cursor: 'pointer' }}/>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'var(--text-3)', marginTop:'0.25rem' }}>
          <span>Beginner</span><span>Expert</span>
        </div>
      </div>

      {/* <div className={styles.row}>
        <div className="form-group">
          <label className="form-label">Icon / Label (optional)</label>
          <input name="icon" value={form.icon} onChange={handleChange}
            className="form-input" placeholder="e.g. react, java" />
        </div>
        <div className="form-group">
          <label className="form-label">Display Order</label>
          <input type="number" name="displayOrder" value={form.displayOrder} onChange={handleChange}
            className="form-input" min="0" max="999" />
        </div>
      </div> */}

      <div className={styles.formActions}>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : item ? 'Update Skill' : 'Add Skill'}
        </button>
      </div>
    </form>
  )
}

export default function AdminSkills() {
  const [skills,  setSkills]  = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminAPI.getSkills()
      setSkills(res.data?.data ?? [])
    } catch (err) {
      console.error('Failed to load skills:', err)
      setSkills([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async (data, id) => {
    if (id) await adminAPI.updateSkill(id, data)
    else     await adminAPI.createSkill(data)
    await load()
  }

  const handleDelete = async (id) => {
    await adminAPI.deleteSkill(id)
    setSkills(prev => prev.filter(x => x.id !== id))
  }

  const columns = [
    { key: 'name',        label: 'Skill Name' },
    { key: 'category',    label: 'Category' },
    { key: 'proficiency', label: 'Proficiency', render: s => (
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
        <div style={{ width:'80px', height:'6px', background:'var(--bg-3)', borderRadius:'3px', overflow:'hidden' }}>
          <div style={{ width:`${s.proficiency}%`, height:'100%', background:'linear-gradient(90deg,var(--accent),var(--accent-2))', borderRadius:'3px' }}/>
        </div>
        <span style={{ fontSize:'0.8rem', color:'var(--accent-2)', fontWeight:600 }}>{s.proficiency}%</span>
      </div>
    )},
    { key: 'displayOrder', label: 'Order' },
  ]

  return (
    <AdminCRUD title="Skills" items={skills} loading={loading}
      columns={columns}
      renderForm={(props) => <SkillForm {...props} />}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  )
}
