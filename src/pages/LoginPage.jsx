import { useState } from 'react'
import { BookOpen, Sun, Moon } from 'lucide-react'

export default function LoginPage({ onLogin, dark, onToggleDark }) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username.trim().length < 2) {
      setError('Kullanıcı adı en az 2 karakter olmalı.')
      return
    }
    onLogin(username)
  }

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-cream dark:bg-dark flex items-center justify-center px-4 relative">

        <button
          onClick={onToggleDark}
          className="absolute top-5 right-5 text-ink/40 dark:text-cream/40 hover:text-rust dark:hover:text-gold transition-colors"
          title={dark ? 'Gündüz Modu' : 'Gece Modu'}
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="w-full max-w-sm">

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-rust/10 dark:bg-rust/20 rounded-sm mb-4">
              <BookOpen size={28} className="text-rust" />
            </div>
            <h1 className="font-display text-3xl font-black text-dark dark:text-cream">
              KÜTÜP<span className="text-rust">HANE</span>
            </h1>
            
          </div>

          <div className="bg-light-warm dark:bg-ink border border-warm/20 dark:border-warm/10 p-8">
            <h2 className="font-display text-xl font-bold text-dark dark:text-cream mb-1">
              Hoş Geldiniz
            </h2>
            <p className="text-xs text-ink/45 dark:text-cream/35 mb-6">
              Favorilerinizi kaydetmek için kullanıcı adı girin.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="text-[0.65rem] tracking-widest uppercase text-warm dark:text-gold/60 block mb-2">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError('') }}
                  placeholder="..."
                  className="w-full bg-cream dark:bg-dark border border-warm/30 dark:border-warm/20
                             text-ink dark:text-cream placeholder:text-ink/30 dark:placeholder:text-cream/25
                             px-4 py-3 text-sm outline-none focus:border-warm transition-colors"
                  autoFocus
                />
                {error && (
                  <p className="text-xs text-rust mt-2">{error}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-rust text-cream py-3 text-xs tracking-widest uppercase
                           hover:bg-dark dark:hover:bg-warm transition-colors duration-300 font-medium"
              >
                Giriş Yap
              </button>
            </form>

            <p className="text-[0.6rem] text-ink/30 dark:text-cream/25 mt-6 text-center leading-relaxed">
              Şifre gerekmez. Kullanıcı adınız cihazınızda saklanır.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
