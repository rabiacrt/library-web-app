import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Favorites from './pages/Favorites';
import { useDarkMode } from './hooks/useDarkMode'

function App() {
  const { dark, toggleDark } = useDarkMode()

  return (
    <Router>
      <div className="{`min-h-screen bg-cream ${dark ? 'dark' : ''}`}">
        <Navbar onToggleDark={toggleDark} dark={dark}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;