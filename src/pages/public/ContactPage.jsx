import { useState } from 'react'
import { Mail, MapPin, Github, Linkedin, Send, CheckCircle } from 'lucide-react'
import { publicAPI } from '../../services/api'
import toast from 'react-hot-toast'
import styles from './ContactPage.module.css'

export default function ContactPage() {
  const [form, setForm]       = useState({ senderName:'', senderEmail:'', subject:'', message:'' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await publicAPI.sendContact(form)
      setSent(true)
      toast.success('Message sent! I\'ll get back to you soon.')
      setForm({ senderName:'', senderEmail:'', subject:'', message:'' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          {/* <p className={styles.label}>Get In Touch</p> */}
          <h1 className="section-title">Contact Me</h1>
          <p className="section-subtitle">I'm open to opportunities, collaborations, and just a good conversation.</p>
        </div>

        <div className={styles.layout}>
          {/* Info */}
          <div className={styles.info}>
            <div className="card">
              <h3 className={styles.infoTitle}>Let's Talk</h3>
              <p className={styles.infoText}>Whether you have a project in mind, want to collaborate, or just want to say hi — I'd love to hear from you.</p>
              <div className={styles.contacts}>
                <a href="mailto:ompremingle1881@gmail.com" className={styles.contactItem}>
                  <Mail size={18}/> ompremingle1881@gmail.com
                </a>
                <div className={styles.contactItem}>
                  <MapPin size={18}/> Pune, Maharashtra, India
                </div>
              </div>
              <div className={styles.socials}>
                <a href="https://github.com/omingle1881" target="_blank" rel="noreferrer" className={styles.social}><Github size={20}/></a>
                <a href="https://www.linkedin.com/in/om-ingle-a0752325a/" target="_blank" rel="noreferrer" className={styles.social}><Linkedin size={20}/></a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card">
            {sent ? (
              <div className={styles.success}>
                <CheckCircle size={48} color="var(--accent)"/>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out. I'll get back to you within 24 hours.</p>
                <button className="btn btn-outline" onClick={() => setSent(false)}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.row}>
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input name="senderName" value={form.senderName} onChange={handleChange}
                      className="form-input" placeholder="xyz" required/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input name="senderEmail" type="email" value={form.senderEmail} onChange={handleChange}
                      className="form-input" placeholder="your@email.com" required/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <input name="subject" value={form.subject} onChange={handleChange}
                    className="form-input" placeholder="Project Collaboration" required/>
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange}
                    className="form-input" placeholder="Tell me about your project..." required rows={6}/>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%', justifyContent:'center' }}>
                  {loading ? 'Sending...' : <><Send size={16}/> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
