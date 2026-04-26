import { useState, useEffect } from 'react'

let currentTheme = localStorage.getItem('theme') === 'dark'
const listeners = new Set()

// Ensure initial body class
if (typeof document !== 'undefined') {
  document.body.classList.toggle('dark', currentTheme)
}

export function useDarkMode() {
  const [dark, setDark] = useState(currentTheme)

  useEffect(() => {
    listeners.add(setDark)
    return () => listeners.delete(setDark)
  }, [])

  const toggleDark = () => {
    currentTheme = !currentTheme
    document.body.classList.toggle('dark', currentTheme)
    localStorage.setItem('theme', currentTheme ? 'dark' : 'light')
    listeners.forEach(listener => listener(currentTheme))
  }

  return { dark, toggleDark }
}