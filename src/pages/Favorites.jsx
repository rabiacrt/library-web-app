import React, { useState, useEffect } from 'react';
import { getFavorites, toggleFavorite } from '../utils/favoritesHelper';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, BookOpen, Trash2, ArrowLeft } from 'lucide-react';
import BookCard from '../components/BookCard';

const Favorites = () => {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setFavoriteBooks(getFavorites());
  }, []);

  const handleFavChange = () => {
    setFavoriteBooks(getFavorites());
  };

  const handleClearAll = () => {
    favoriteBooks.forEach(book => toggleFavorite(book));
    setFavoriteBooks([]);
  };

  if (favoriteBooks.length === 0) {
    return (
      <div className="min-h-screen bg-cream dark:bg-dark flex flex-col items-center justify-center px-8 text-center">
        <div className="font-italic-serif text-[8rem] leading-none text-warm/10 select-none">♡</div>
        <h2 className="font-display text-4xl font-bold text-dark dark:text-cream mb-3 -mt-4">
          Henüz favori kitabınız yok.
        </h2>
        <p className="text-ink/50 dark:text-cream/40 text-sm max-w-xs leading-relaxed mb-8">
          Kitap kartlarındaki kalp ikonuna tıklayarak favorilerine kitap ekleyebilirsin.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 bg-rust text-cream px-8 py-3 hover:bg-dark dark:hover:bg-warm transition-colors">
          <BookOpen size={15} /> Koleksiyona Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-dark px-8 md:px-16 pt-5 pb-12">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[0.7rem] tracking-widest uppercase text-warm hover:text-rust dark:hover:text-gold transition-colors mb-10"
      >
        <ArrowLeft size={13} /> Geri Dön
      </button>

      <div className="mb-10 pb-6 border-b border-warm/20 dark:border-warm/10 flex items-end justify-between">
        <div>
          
          <h1 className=" font-italic text-[clamp(2rem,5vw,2.5rem)] font-black text-dark dark:text-cream -mt-4 leading-tight">
            Favorilerim
          </h1>
          <p className="text-ink/45 dark:text-cream/40 text-sm mt-2 flex items-center gap-2">
            <Heart size={12} className="text-rust" fill="currentColor" />
            {favoriteBooks.length} kitap kaydedildi
          </p>
        </div>

        {favoriteBooks.length > 1 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 text-[0.65rem] tracking-widest uppercase text-ink/30 dark:text-cream/25 hover:text-rust transition-colors self-end mb-1"
          >
            <Trash2 size={12} /> Tümünü Temizle
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {favoriteBooks.map(book => {
          const addedAt = book.addedAt
            ? new Date(book.addedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
            : null;

          return (
            <div key={book.id} className="flex flex-col gap-1">
              <BookCard book={book} onFavChange={handleFavChange} />
              {addedAt && (
                <p className="text-[0.6rem] text-ink/30 dark:text-cream/25 text-center">
                  {addedAt} tarihinde eklendi
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Favorites;