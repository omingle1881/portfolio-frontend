import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  const login = async (username, password) => {
    setLoading(true)
    try {
      const res = await authAPI.login({ username, password })
      const { token, username: uname, role } = res.data.data
      localStorage.setItem('token', token)
      localStorage.setItem('admin', JSON.stringify({ username: uname, role }))
      setAdmin({ username: uname, role })
      toast.success('Welcome back, Admin!')
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try { await authAPI.logout() } catch {}
    localStorage.removeItem('token')
    localStorage.removeItem('admin')
    setAdmin(null)
    toast.success('Logged out')
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading, isAdmin: !!admin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
