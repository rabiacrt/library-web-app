import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Keşfet', path: '/' },
    { name: 'Favoriler', path: '/favorites' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          <Link to="/" className="text-2xl font-black text-pink-400 tracking-tighter">
            KÜTÜP<span className="text-gray-900">HANE</span>
          </Link>

          
          <div className="flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors ${
                  location.pathname === link.path 
                    ? 'text-pink-400' 
                    : 'text-gray-600 hover:text-pink-400'
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