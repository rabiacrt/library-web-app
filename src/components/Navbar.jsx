import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, LogOut, User, Menu, X } from 'lucide-react';

const Navbar = ({ onToggleDark, dark, user, onLogout }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Keşfet', path: '/' },
    { name: 'Favoriler', path: '/favorites' },
  ];

  return (
    <>
      <nav className="bg-cream dark:bg-dark shadow-sm border-b border-warm/20 dark:border-warm/10 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">

            <Link to="/" className="font-display text-2xl font-black tracking-tight text-dark dark:text-cream">
              KÜTÜP<span className="text-rust dark:text-gold">HANE</span>
            </Link>

            {/* desktop — linkler */}
            <div className="hidden md:flex space-x-8">
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

            {/* desktop — sağ */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={onToggleDark}
                className="text-ink/50 dark:text-cream/50 hover:text-rust dark:hover:text-gold transition-colors"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {user && (
                <div className="flex items-center gap-2 border-l border-warm/20 dark:border-warm/10 pl-4">
                  <div className="flex items-center gap-1.5 text-xs text-ink/50 dark:text-cream/40">
                    <User size={13} />
                    <span className="font-medium text-ink/70 dark:text-cream/60">{user.username}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    title="Çıkış Yap"
                    className="text-ink/30 dark:text-cream/30 hover:text-rust transition-colors"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* mobil — sağ */}
            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={onToggleDark}
                className="text-ink/50 dark:text-cream/50 hover:text-rust dark:hover:text-gold transition-colors"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="text-ink/60 dark:text-cream/60 hover:text-rust dark:hover:text-gold transition-colors"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* mobil menü */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-cream dark:bg-dark border-t border-warm/20 dark:border-warm/10 flex flex-col px-6 pt-8 gap-6">

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`font-display text-2xl font-bold transition-colors ${
                location.pathname === link.path
                  ? 'text-rust dark:text-gold'
                  : 'text-ink/70 dark:text-cream/70 hover:text-rust dark:hover:text-gold'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* kullanıcı bilgisi */}
          {user && (
            <div className="mt-auto mb-8 pt-6 border-t border-warm/20 dark:border-warm/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-ink/50 dark:text-cream/40">
                <User size={15} />
                <span className="font-medium text-ink/70 dark:text-cream/60">{user.username}</span>
              </div>
              <button
                onClick={() => { setMenuOpen(false); onLogout(); }}
                className="flex items-center gap-1.5 text-xs tracking-widest uppercase text-rust/60 hover:text-rust transition-colors"
              >
                <LogOut size={13} /> Çıkış
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
