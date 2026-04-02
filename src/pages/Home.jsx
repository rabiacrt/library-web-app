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
  const [language, setLanguage] = useState('');
  const [topic, setTopic] = useState('');
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
    let url = `/books/?search=${encodeURIComponent(debouncedSearch)}`;

    if (language) {
      url += `&languages=${language}`;
    }
  
    if (topic) {
      url += `&topic=${topic}`;
    }
  
    loadBooks(url);
  }, [debouncedSearch, language, topic, loadBooks]);

  const handlePageChange = (direction) => {
    const targetUrl = direction === 'next' ? nextPageUrl : prevPageUrl;
    if (targetUrl) {
      loadBooks(targetUrl);
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-dark py-10 px-4">
      <div className="container mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-display text-dark dark:text-cream mb-2">Çevrimiçi Kütüphane</h1>
          <p className="text-gray-600">📖 </p>
        </header>

        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-4 py-2 border border-warm/30 rounded-full bg-rust dark:bg-warm text-cream 
           focus:ring-2 focus:ring-amber-600 transition-colors outline-none">
            <option value="">Tüm Diller</option>
            <option value="en">🇬🇧 İngilizce</option>
            <option value="fr">🇫🇷 Fransızca</option>
            <option value="de">🇩🇪 Almanca</option>
            <option value="tr">🇹🇷 Türkçe</option>
          </select>

          <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="px-4 py-2 border border-warm/30 rounded-full bg-rust dark:bg-warm text-cream 
           focus:ring-2 focus:ring-amber-600 transition-colors outline-none">
            <option value="">Tüm Kategoriler</option>
            <option value="fiction">Kurgu (Fiction)</option>
            <option value="drama">Drama</option>
            <option value="history">Tarih</option>
            <option value="science">Bilim</option>
            <option value="children">Çocuk</option>
          </select>

          {(language || topic || searchTerm) && (
            <button onClick={() => { setLanguage(''); setTopic(''); setSearchTerm(''); }} className="text-ink dark:text-cream/60 hover:text-rust dark:hover:text-gold text-sm font-medium">
              Temizle
            </button>
          )} 
        </div>


        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rust dark:border-gold"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {books.slice(0, 12).map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {books.length === 0 ? (
              <p className="text-center text-ink/40 dark:text-cream/40 mt-10">Kitap bulunamadı.</p>
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