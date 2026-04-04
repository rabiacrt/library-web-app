import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BookCard from './components/BookCard';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import { useDarkMode } from './hooks/useDarkMode'

function App() {
  const { dark, toggleDark } = useDarkMode()

  return (
    <Router>
      <div className={`min-h-screen bg-cream ${dark ? 'dark' : ''}`}>
        <Navbar onToggleDark={toggleDark} dark={dark}/>
        <Routes>
          <Route path="/book/:id" element={<BookCard />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/" element={<Home dark={dark} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;