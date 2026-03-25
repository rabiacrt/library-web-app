import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../services/api';
import { toggleFavorite, getFavorites } from '../utils/favoritesHelper';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await bookService.getBookDetails(id);
        setBook(data);
        
        
        const favorites = getFavorites();
        setIsFav(favorites.some(f => f.id === data.id));
      } catch (err) {
        console.error("Detaylar yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleToggleFavorite = () => {
    toggleFavorite(book);
    setIsFav(!isFav);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!book) return <div className="text-center py-20">Kitap bulunamadı.</div>;

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-pink-400 hover:text-pink-600 transition-colors"
      >
        ← Geri Dön
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 bg-white p-6 rounded-2xl shadow-lg">
     
        <div className="md:col-span-1">
          <img 
            src={book.formats['image/jpeg']} 
            alt={book.title} 
            className="w-full rounded-lg shadow-md sticky top-10"
          />
          <button
            onClick={handleToggleFavorite}
            className={`w-full mt-4 py-3 rounded-lg font-semibold transition-all border ${
              isFav 
                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {isFav ? '❤️ Favorilerden Çıkar' : '🤍 Favorilere Ekle'}
          </button>
        </div>

        
        <div className="md:col-span-2 space-y-6">
          <header>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-2">
              {book.title}
            </h1>
            <p className="text-xl text-gray-600 italic">
              {book.authors.map(a => a.name).join(', ')}
            </p>
          </header>

          <hr />

          <section className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Konular:</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {book.subjects.map((sub, i) => (
                  <span key={i} className="bg-blue-100 text-pink-400 px-3 py-1 rounded-full text-xs font-medium">
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500 uppercase tracking-wider">Dil</p>
                <p className="font-semibold text-gray-800 capitalize">{book.languages.join(', ')}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500 uppercase tracking-wider">İndirme Sayısı</p>
                <p className="font-semibold text-gray-800">{book.download_count.toLocaleString()}</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Okuma ve İndirme Seçenekleri</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {book.formats['text/html'] && (
                <a 
                  href={book.formats['text/html']} 
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  🌐 Çevrimiçi Oku
                </a>
              )}
              {book.formats['application/epub+zip'] && (
                <a 
                  href={book.formats['application/epub+zip']} 
                  className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition"
                >
                  📖 EPUB İndir
                </a>
              )}
              {book.formats['application/pdf'] && (
                <a 
                  href={book.formats['application/pdf']} 
                  className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition"
                >
                  📄 PDF İndir
                </a>
              )}
              {book.formats['text/plain; charset=us-ascii'] && (
                <a 
                  href={book.formats['text/plain; charset=us-ascii']} 
                  className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition"
                >
                  📝 TXT Olarak Gör
                </a>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;