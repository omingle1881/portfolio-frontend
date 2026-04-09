import { useEffect, useState, useCallback } from 'react'
import { Mail, CheckCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'
import styles from './AdminMessages.module.css'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [expanded, setExpanded] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminAPI.getMessages()
      setMessages(res.data?.data ?? [])
    } catch (err) {
      console.error('Failed to load messages:', err)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleMarkRead = async (id) => {
    try {
      await adminAPI.markRead(id)
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
    } catch {
      toast.error('Failed to mark as read')
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this message?')) return
    try {
      await adminAPI.deleteMessage(id)
      setMessages(prev => prev.filter(m => m.id !== id))
      if (expanded === id) setExpanded(null)
      toast.success('Message deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  const toggleExpand = (id) => {
    setExpanded(prev => prev === id ? null : id)
    const msg = messages.find(m => m.id === id)
    if (msg && !msg.read) handleMarkRead(id)
  }

  const unread = messages.filter(m => !m.read).length

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      })
    } catch { return '—' }
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Messages</h1>
          <p className={styles.subtitle}>
            {messages.length} total &nbsp;•&nbsp;
            <span className={styles.unreadBadge}>{unread} unread</span>
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={load} disabled={loading}>
          {loading ? 'Refreshing...' : '↻ Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : messages.length === 0 ? (
        <div className={styles.empty}>
          <Mail size={52} style={{ color: 'var(--text-3)', marginBottom: '1rem' }} />
          <p>No messages yet.</p>
          {/* <small>Contact form submissions will appear here.</small> */}
        </div>
      ) : (
        <div className={styles.list}>
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`${styles.card} ${!msg.read ? styles.unread : ''}`}
            >
              {/* ── Card Header ── */}
              <div className={styles.cardHeader} onClick={() => toggleExpand(msg.id)}>
                <div className={styles.cardLeft}>
                  <div className={styles.iconWrap}>
                    {msg.read
                      ? <CheckCircle size={18} style={{ color: 'var(--text-3)' }} />
                      : <Mail size={18} style={{ color: 'var(--accent)' }} />
                    }
                  </div>
                  <div className={styles.info}>
                    <div className={styles.sender}>
                      <span>{msg.senderName || 'Unknown'}</span>
                      {!msg.read && <span className={styles.dot} />}
                    </div>
                    <div className={styles.subject}>{msg.subject || '(no subject)'}</div>
                  </div>
                </div>

                <div className={styles.cardRight}>
                  <span className={styles.emailLabel}>{msg.senderEmail}</span>
                  <span className={styles.date}>{formatDate(msg.createdAt)}</span>
                  <button
                    className={styles.deleteBtn}
                    onClick={(e) => handleDelete(msg.id, e)}
                    title="Delete message"
                  >
                    <Trash2 size={15} />
                  </button>
                  {expanded === msg.id
                    ? <ChevronUp size={16} style={{ color: 'var(--text-3)' }} />
                    : <ChevronDown size={16} style={{ color: 'var(--text-3)' }} />
                  }
                </div>
              </div>

              {/* ── Expanded Body ── */}
              {expanded === msg.id && (
                <div className={styles.body}>
                  <div className={styles.metaRow}>
                    <span><strong>From:</strong> {msg.senderName} &lt;{msg.senderEmail}&gt;</span>
                    <span><strong>Date:</strong> {formatDate(msg.createdAt)}</span>
                  </div>
                  <p className={styles.message}>{msg.message}</p>
                  <div className={styles.bodyActions}>
                    <a
                      href={`mailto:${msg.senderEmail}?subject=Re: ${encodeURIComponent(msg.subject || '')}`}
                      className="btn btn-primary btn-sm"
                    >
                      <Mail size={14} /> Reply via Email
                    </a>
                    {!msg.read && (
                      <button className="btn btn-outline btn-sm" onClick={() => handleMarkRead(msg.id)}>
                        <CheckCircle size={14} /> Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
