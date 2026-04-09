import axios from 'axios'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request interceptor: attach JWT ────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Response interceptor: handle 401 ───────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('admin')
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

// ─── Auth ────────────────────────────────────────────────────────
export const authAPI = {
  login:  (data) => api.post('/auth/login', data),
  logout: ()     => api.post('/auth/logout'),
}

// ─── Public ──────────────────────────────────────────────────────
export const publicAPI = {
  getProfile:   ()     => api.get('/public/profile'),
  getProjects:  ()     => api.get('/public/projects'),
  getFeatured:  ()     => api.get('/public/projects/featured'),
  getSkills:    ()     => api.get('/public/skills'),
  getExperience:()     => api.get('/public/experience'),
  getEducation: ()     => api.get('/public/education'),
  sendContact:  (data) => api.post('/public/contact', data),
}

// ─── Admin ───────────────────────────────────────────────────────
export const adminAPI = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),

  // Projects
  getProjects:    ()         => api.get('/admin/projects'),
  createProject:  (data)     => api.post('/admin/projects', data),
  updateProject:  (id, data) => api.put(`/admin/projects/${id}`, data),
  deleteProject:  (id)       => api.delete(`/admin/projects/${id}`),

  // Skills
  getSkills:    ()         => api.get('/admin/skills'),
  createSkill:  (data)     => api.post('/admin/skills', data),
  updateSkill:  (id, data) => api.put(`/admin/skills/${id}`, data),
  deleteSkill:  (id)       => api.delete(`/admin/skills/${id}`),

  // Experience
  getExperience:    ()         => api.get('/admin/experience'),
  createExperience: (data)     => api.post('/admin/experience', data),
  updateExperience: (id, data) => api.put(`/admin/experience/${id}`, data),
  deleteExperience: (id)       => api.delete(`/admin/experience/${id}`),

  // Education
  getEducation:    ()         => api.get('/admin/education'),
  createEducation: (data)     => api.post('/admin/education', data),
  updateEducation: (id, data) => api.put(`/admin/education/${id}`, data),
  deleteEducation: (id)       => api.delete(`/admin/education/${id}`),

  // Profile
  getProfile:    ()     => api.get('/admin/profile'),
  updateProfile: (data) => api.put('/admin/profile', data),

  // Messages
  getMessages:   ()   => api.get('/admin/messages'),
  markRead:      (id) => api.patch(`/admin/messages/${id}/read`),
  deleteMessage: (id) => api.delete(`/admin/messages/${id}`),
}

export default api
