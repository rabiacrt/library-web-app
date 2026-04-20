import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BookCard from './components/BookCard';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import { useDarkMode } from './hooks/useDarkMode'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'


function App() {
  const { dark, toggleDark } = useDarkMode()
  const { user, login, logout } = useAuth()

  if (!user) return <LoginPage onLogin={login} dark={dark} onToggleDark={toggleDark} />

  return (
    <Router>
      <div className={`min-h-screen bg-cream ${dark ? 'dark' : ''}`}>
        <Navbar onToggleDark={toggleDark} dark={dark} user={user} onLogout={logout} />
        <Routes>
          <Route path="/" element={<Home dark={dark} userId={user.id} />} />
          <Route path="/favorites" element={<Favorites userId={user.id} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;