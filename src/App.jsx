import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Public Pages
import PublicLayout   from './components/public/PublicLayout'
import HomePage       from './pages/public/HomePage'
import ProjectsPage   from './pages/public/ProjectsPage'
import ContactPage    from './pages/public/ContactPage'

// Admin Pages
import AdminLayout    from './components/admin/AdminLayout'
import LoginPage      from './pages/admin/LoginPage'
import Dashboard      from './pages/admin/Dashboard'
import AdminProjects  from './pages/admin/AdminProjects'
import AdminSkills    from './pages/admin/AdminSkills'
import AdminExperience from './pages/admin/AdminExperience'
import AdminEducation from './pages/admin/AdminEducation'
import AdminMessages  from './pages/admin/AdminMessages'
import AdminProfile   from './pages/admin/AdminProfile'

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { isAdmin } = useAuth()
  return isAdmin ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ── Public Routes ── */}
        <Route path="/" element={<PublicLayout />}>
          <Route index          element={<HomePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="contact"  element={<ContactPage />} />
        </Route>

        {/* ── Admin Auth ── */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* ── Protected Admin Routes ── */}
        <Route path="/admin" element={
          <ProtectedRoute><AdminLayout /></ProtectedRoute>
        }>
          <Route index                element={<Dashboard />} />
          <Route path="projects"      element={<AdminProjects />} />
          <Route path="skills"        element={<AdminSkills />} />
          <Route path="experience"    element={<AdminExperience />} />
          <Route path="education"     element={<AdminEducation />} />
          <Route path="messages"      element={<AdminMessages />} />
          <Route path="profile"       element={<AdminProfile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
