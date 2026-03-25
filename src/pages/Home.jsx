import React, { useState, useEffect, useCallback } from 'react';
import { bookService } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const loadBooks = useCallback(async (url) => {
    setLoading(true);
    try {
      const data = await bookService.getAllBooks(url);
      setBooks(data.results || []);
      setNextPageUrl(data.next);
      setPrevPageUrl(data.previous);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialUrl = debouncedSearch 
      ? `/books/?search=${encodeURIComponent(debouncedSearch)}` 
      : '/books/';
    
    loadBooks(initialUrl);
  }, [debouncedSearch, loadBooks]);

  const handlePageChange = (direction) => {
    const targetUrl = direction === 'next' ? nextPageUrl : prevPageUrl;
    if (targetUrl) {
      loadBooks(targetUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="container mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Çevrimiçi Kütüphane</h1>
          <p className="text-gray-600">📖 </p>
        </header>

        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {books.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {books.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">Kitap bulunamadı.</p>
            ) : (
              <Pagination 
                hasPrev={!!prevPageUrl} 
                hasNext={!!nextPageUrl} 
                onPageChange={handlePageChange} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;