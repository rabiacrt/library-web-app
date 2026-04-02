import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react'

const Navbar = ({ onToggleDark, dark }) => {
  const location = useLocation();

  const navLinks = [
    { name: 'Keşfet', path: '/' },
    { name: 'Favoriler', path: '/favorites' },
  ];

  return (
    <nav className="bg-cream dark:bg-dark shadow-sm border-b border-warm/20 dark:border-warm/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
        <Link to="/" className="font-display text-2xl font-black tracking-tight text-dark dark:text-cream">
  KÜTÜP<span className="text-rust dark:text-gold">HANE</span>
</Link>

          <button onClick={onToggleDark}>
  {dark ? <Sun size={18} /> : <Moon size={18} />}
</button>

          
          <div className="flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-display transition-colors ${
                  location.pathname === link.path 
                    ? 'text-rust dark:text-gold' 
                    : 'text-ink/60 dark:text-cream/60 hover:text-rust dark:hover:text-gold'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;