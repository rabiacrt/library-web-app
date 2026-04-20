import { useState } from 'react'

const STORAGE_KEY = 'library_user'

export function useAuth() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  })

  const login = (username) => {
    const userData = {
      id: username.toLowerCase().trim().replace(/\s+/g, '_'),
      username: username.trim(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return { user, login, logout }
}