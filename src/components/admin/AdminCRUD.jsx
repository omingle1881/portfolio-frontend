import { useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './AdminCRUD.module.css'

/**
 * Generic CRUD table component used by all admin sections.
 * Props: title, items, loading, columns, renderForm, onSave, onDelete
 */
export default function AdminCRUD({ title, items = [], loading, columns, renderForm, onSave, onDelete }) {
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [saving,   setSaving]   = useState(false)

  const openCreate = () => { setEditItem(null); setShowForm(true) }
  const openEdit   = (item) => { setEditItem(item); setShowForm(true) }
  const closeForm  = () => { setShowForm(false); setEditItem(null) }

  const handleSave = useCallback(async (data) => {
    setSaving(true)
    try {
      await onSave(data, editItem?.id || null)
      toast.success(editItem ? 'Updated successfully!' : 'Created successfully!')
      closeForm()
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Operation failed'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }, [onSave, editItem])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    setDeleting(id)
    try {
      await onDelete(id)
      toast.success('Deleted successfully!')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.count}>{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16}/> Add New
        </button>
      </div>

      {/* ── Modal Form ── */}
      {showForm && (
        <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) closeForm() }}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editItem ? `Edit ${title}` : `Add ${title}`}</h2>
              <button onClick={closeForm} className={styles.closeBtn} type="button"><X size={20}/></button>
            </div>
            {renderForm({ item: editItem, onSave: handleSave, saving, onCancel: closeForm })}
          </div>
        </div>
      )}

      {/* ── Table / States ── */}
      {loading ? (
        <div className="spinner"/>
      ) : items.length === 0 ? (
        <div className={styles.empty}>
          <p>No {title.toLowerCase()} yet. Click <strong>Add New</strong> to get started.</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map(c => <th key={c.key}>{c.label}</th>)}
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  {columns.map(c => (
                    <td key={c.key} title={c.render ? '' : String(item[c.key] ?? '')}>
                      {c.render ? c.render(item) : (item[c.key] ?? '—')}
                    </td>
                  ))}
                  <td>
                    <div className={styles.actions}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => openEdit(item)}
                        title="Edit"
                      >
                        <Pencil size={14}/>
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleting === item.id}
                        title="Delete"
                      >
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
