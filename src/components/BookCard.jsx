import React, { useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';
import { Heart, X, BookOpen } from 'lucide-react';
import { toggleFavorite, getFavorites } from '../utils/favoritesHelper';

function BookModal({ book, onClose, isFav, onToggleFav }) {
  const author = book.authors?.length > 0
    ? book.authors.map(a => a.name).join(', ')
    : 'Bilinmeyen Yazar';
  const cover = book.formats?.['image/jpeg'];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-dark/60 backdrop-blur-sm" />
      <div
        className="relative z-10 bg-cream dark:bg-ink w-full max-w-lg rounded-sm shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-ink/40 dark:text-cream/40 hover:text-rust transition-colors z-10">
          <X size={20} />
        </button>

        <div className="flex gap-6 p-6">
          {cover ? (
            <img src={cover} alt={book.title} className="w-32 flex-shrink-0 rounded-sm shadow-md object-cover self-start" />
          ) : (
            <div className="w-32 flex-shrink-0 aspect-[2/3] bg-warm/20 rounded-sm flex items-center justify-center">
              <BookOpen size={24} className="text-warm/40" />
            </div>
          )}

          <div className="flex-1 min-w-0 pt-1">
            <h2 className="font-display text-xl font-bold text-dark dark:text-cream leading-tight mb-1 pr-6">{book.title}</h2>
            <p className="font-italic-serif text-base text-warm dark:text-gold mb-4">{author}</p>

            {book.languages?.length > 0 && (
              <div className="mb-2">
                <span className="text-[0.6rem] tracking-widest uppercase text-ink/40 dark:text-cream/30 block">Dil</span>
                <p className="text-sm text-dark dark:text-cream capitalize">{book.languages.join(', ')}</p>
              </div>
            )}
            {book.download_count && (
              <div className="mb-3">
                <span className="text-[0.6rem] tracking-widest uppercase text-ink/40 dark:text-cream/30 block">İndirme</span>
                <p className="text-sm text-dark dark:text-cream">{book.download_count.toLocaleString()}</p>
              </div>
            )}

            <button
              onClick={onToggleFav}
              className={`flex items-center gap-2 text-xs tracking-wide border px-3 py-1.5 rounded-sm transition-all duration-200 ${
                isFav
                  ? 'bg-rust/10 text-rust border-rust/30 hover:bg-rust/20'
                  : 'text-ink/50 dark:text-cream/50 border-warm/30 hover:bg-warm/10'
              }`}
            >
              <Heart size={12} fill={isFav ? 'currentColor' : 'none'} />
              {isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
            </button>
          </div>
        </div>

        {book.subjects?.length > 0 && (
          <div className="px-6 pb-4">
            <span className="text-[0.6rem] tracking-widest uppercase text-ink/40 dark:text-cream/30 block mb-2">Konular</span>
            <div className="flex flex-wrap gap-2">
              {book.subjects.slice(0, 8).map((sub, i) => (
                <span key={i} className="text-[0.6rem] tracking-wide bg-rust/10 dark:bg-warm/20 text-rust dark:text-gold px-2 py-1 rounded-full border border-rust/20 dark:border-warm/20">
                  {sub}
                </span>
              ))}
            </div>
          </div>
        )}

        <hr className="border-warm/15 dark:border-warm/10 mx-6" />

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {book.formats?.['text/html'] && (
            <a href={book.formats['text/html']} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-rust text-cream px-4 py-2.5 rounded-sm hover:bg-dark dark:hover:bg-warm transition text-sm">
              🌐 Çevrimiçi Oku
            </a>
          )}
          {book.formats?.['application/epub+zip'] && (
            <a href={book.formats['application/epub+zip']} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-rust text-cream px-4 py-2.5 rounded-sm hover:bg-dark dark:hover:bg-warm transition text-sm">
              📖 EPUB İndir
            </a>
          )}
          {book.formats?.['application/pdf'] && (
            <a href={book.formats['application/pdf']} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-rust text-cream px-4 py-2.5 rounded-sm hover:bg-dark dark:hover:bg-warm transition text-sm">
              📄 PDF İndir
            </a>
          )}
          {book.formats?.['text/plain; charset=us-ascii'] && (
            <a href={book.formats['text/plain; charset=us-ascii']} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-rust text-cream px-4 py-2.5 rounded-sm hover:bg-dark dark:hover:bg-warm transition text-sm">
              📝 TXT Olarak Gör
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

  const BookCard = ({ book, onFavChange, userId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(getFavorites(userId).some(f => f.id === book.id));
  }, [userId, book.id]);

  const coverImage = book.formats?.['image/jpeg'] || 'https://via.placeholder.com/200x300?text=No+Cover';

  const handleToggleFav = (e) => {
    e?.stopPropagation();
    toggleFavorite(book, userId);
    setIsFav(prev => !prev);
    onFavChange?.();
  };

  return (
    <>
      <Tilt
        className="parallax-effect h-full"
        perspective={1000} scale={1.02} gyroscope={true}
        glareEnable={true} glareMaxOpacity={0.1}
        glareColor="#ffffff" glareBorderRadius="8px"
        transitionSpeedAttributes={1500}
      >
        <div className="group border border-warm/20 dark:border-warm/10 rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 bg-light-warm dark:bg-ink flex flex-col h-full cursor-pointer">
          <div onClick={() => setModalOpen(true)} className="relative w-full h-72 overflow-hidden bg-gray-200">
            <img src={coverImage} alt={book.title} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
            <button
              onClick={handleToggleFav}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                isFav ? 'bg-rust text-white scale-110' : 'bg-black/25 text-white/70 hover:bg-rust/80 hover:text-white hover:scale-110'
              }`}
            >
              <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="p-4 flex flex-col flex-grow" onClick={() => setModalOpen(true)}>
            <h3 className="font-display font-bold text-lg line-clamp-2 mb-2 text-dark dark:text-cream group-hover:text-rust dark:group-hover:text-gold transition-colors duration-300">
              {book.title}
            </h3>
            <p className="text-ink/50 dark:text-cream/50 text-sm mb-4 italic">
              {book.authors?.length > 0 ? book.authors.map(a => a.name).join(', ') : 'Bilinmeyen Yazar'}
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-auto block w-full text-center bg-rust dark:bg-warm text-cream py-2.5 rounded-md hover:bg-dark dark:hover:bg-gold transition-all duration-300 font-medium text-sm tracking-wide shadow-md"
            >
              Detayları Gör
            </button>
          </div>
        </div>
      </Tilt>

      {modalOpen && (
        <BookModal book={book} onClose={() => setModalOpen(false)} isFav={isFav} onToggleFav={handleToggleFav} />
      )}
    </>
  );
};

export default BookCard;
