import React, { useState, useEffect } from 'react';
import { getFavorites } from '../utils/favoritesHelper';
import BookCard from '../components/BookCard';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favoriteBooks, setFavoriteBooks] = useState([]);

  
  useEffect(() => {
    const favs = getFavorites();
    setFavoriteBooks(favs);
  }, []);

  return (
    <div className="min-h-screen bg-cream dark:bg-dark py-10 px-4">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-display font-bold text-dark dark:text-cream mb-2">Favori Kitaplarım</h1>
            <p className="text-dark dark:text-cream font-display mt-1">Kaydettiğiniz kitaplara buradan ulaşabilirsiniz.</p>
          </div>
          <Link 
            to="/" 
            className="text-gold hover:text-rust font-medium"
          >
            ← Kitap Keşfet
          </Link>
        </header>

        {favoriteBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {favoriteBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <div className="text-5xl mb-4">📚</div>
            <h2 className="text-xl font-semibold text-gray-700">Henüz favori kitabınız yok.</h2>
            <p className="text-gray-500 mt-2 mb-6">Keşfetmeye başlamak için ana sayfaya göz atın.</p>
            <Link 
              to="/" 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              Kitapları Listele
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;