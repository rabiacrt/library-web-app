import React, { useState, useEffect, useCallback, useRef } from 'react';
import { bookService } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const BOOK_COLORS = [
  ['#8B2020','#C9A84C'],['#1A3A5C','#EDE5D5'],['#5A6B3A','#F5F0E8'],
  ['#2C2418','#C9A84C'],['#7A3B1E','#F5F0E8'],['#1E3A2F','#EDE5D5'],
  ['#4A3520','#C9A84C'],['#6B1A2A','#F5E6C8'],['#3D5A3E','#EDE5D5'],
  ['#7A5C1E','#2C2418'],['#1A2A4A','#C9A84C'],['#2A2A2A','#A04030'],
  ['#4A6B8B','#F5F0E8'],['#1E3A4A','#EDE5D5'],['#5C2A3A','#F5E6C8'],
  ['#3A4A5C','#C9A84C'],['#6B4A1A','#EDE5D5'],['#3A1A2A','#C9A84C'],
  ['#4A2A1A','#F5E6C8'],['#2A4A3A','#EDE5D5'],['#1A1A3A','#C9A84C'],
  ['#3A2A1A','#F5E6C8'],['#2A3A2A','#C9A84C'],['#5C3A1A','#EDE5D5'],
  ['#2A1A3A','#C9A84C'],['#3A5C2A','#F5E6C8'],['#1A3A2A','#C9A84C'],
]
const WIDTHS  = [28,22,34,26,30,24,32,28,26,34,30,22,28,36,24,30,26,20,32,28,24,36,28,26,30,22,34]
const HEIGHTS = [90,108,72,118,92,102,75,112,84,106,94,72,114,88,100,80,108,90,76,104,96,86,82,100,90,70,110]

const QUOTES = [
  { text: "Bir kitap yüz arkadaşa bedeldir.", author: "APJ Abdul Kalam" },
  { text: "Okuduğun kitaplar seni şekillendirir.", author: "Ralph Waldo Emerson" },
  { text: "Kitaplar sessiz dostlardır, her an yanında.", author: "Thomas Carlyle" },
  { text: "Her kitap yeni bir dünyaya açılan kapıdır.", author: "C.S. Lewis" },
  { text: "Kitaplar aklın gıdasıdır.", author: "Cicero" },
  { text: "Bir gün okumadım mı, kendimi eksik hissederim.", author: "Voltaire" },
]

function QuotePopup({ quote, onClose, anchorX }) {
  useEffect(() => {
    const t = setTimeout(onClose, 7000)
    return () => clearTimeout(t)
  }, [onClose])

  const safeX = Math.min(Math.max(anchorX, 150), (window.innerWidth || 800) - 150)

  return (
    <>
      <style>{`
        @keyframes fadeUpQ {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
      <div style={{
        position: 'absolute', bottom: 82, left: safeX,
        transform: 'translateX(-50%)',
        zIndex: 50, animation: 'fadeUpQ 0.35s ease both',
        pointerEvents: 'auto',
      }}>
        <div style={{
          background: 'rgba(26,18,8,0.97)',
          border: '1px solid rgba(201,168,76,0.4)',
          borderRadius: 3, padding: '16px 20px 14px',
          width: 260, backdropFilter: 'blur(12px)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
          position: 'relative',
        }}>
          <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '1.8rem', lineHeight: 1, marginBottom: 6, color: 'rgba(201,168,76,0.3)' }}>"</div>
          <p style={{ fontFamily: '"Cormorant Garamond",serif', fontStyle: 'italic', fontSize: '0.95rem', color: 'rgba(245,240,232,0.92)', lineHeight: 1.6, marginBottom: 10 }}>{quote.text}</p>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)' }}>— {quote.author}</p>
          <button onClick={onClose} style={{ position: 'absolute', top: 6, right: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>×</button>
        </div>
      </div>
    </>
  )
}

//kitap sırtı 
function BookSpine({ color1, color2, width, height, dark, onBookClick }) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const ref = useRef(null)

  const handleClick = () => {
    setClicked(true)
    setTimeout(() => setClicked(false), 400)
    const rect = ref.current?.getBoundingClientRect()
    onBookClick(rect ? rect.left + rect.width / 2 : window.innerWidth / 2)
  }

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{
        width: `${width}px`, minWidth: `${width}px`,
        height: `${height}px`, alignSelf: 'flex-end',
        flexShrink: 0, position: 'relative',
        zIndex: hovered ? 20 : 1,
        transform: clicked ? 'translateY(-16px) scale(1.04)' : hovered ? 'translateY(-9px)' : 'translateY(0)',
        transition: 'transform 0.22s ease',
        cursor: 'pointer',
        opacity: dark ? 0.72 : 1,
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(105deg, ${color1} 0%, ${color1}ee 50%, ${color1}bb 100%)`,
        boxShadow: hovered ? '3px 0 14px rgba(0,0,0,0.5), inset -2px 0 5px rgba(0,0,0,0.2)' : '1px 0 4px rgba(0,0,0,0.4)',
        transition: 'box-shadow 0.22s',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 7, background: `linear-gradient(180deg, ${color2}50 0%, transparent 100%)` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 7, background: `linear-gradient(0deg, ${color2}50 0%, transparent 100%)` }} />
        <div style={{ position: 'absolute', top: 10, left: 4, right: 4, height: 1, background: `${color2}55` }} />
        <div style={{ position: 'absolute', bottom: 10, left: 4, right: 4, height: 1, background: `${color2}55` }} />
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.04) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />
      </div>
    </div>
  )
}

function Hero({ dark, searchTerm, onSearchChange, language, onLanguageChange, topic, onTopicChange, onClear, onQuote, quote, quoteAnchorX }) {
  const allBooks = Array.from({ length: 4 }, () => BOOK_COLORS).flat()

  const heroBg = dark
    ? 'linear-gradient(180deg, #1A1410 0%, #2C2418 60%, #1A1410 100%)'
    : 'linear-gradient(180deg, #F5F0E8 0%, #EDE5D5 40%, #D4C4A0 100%)'

  const titleColor    = dark ? '#F5F0E8' : '#2C2418'
  const subColor      = dark ? 'rgba(201,168,76,0.45)' : 'rgba(44,36,24,0.45)'
  const tagColor      = dark ? 'rgba(201,168,76,0.55)' : 'rgba(139,94,60,0.7)'
  const shelfBg       = dark
    ? 'linear-gradient(180deg, #3a2810 0%, #2a1e0c 60%, #1a1208 100%)'
    : 'linear-gradient(180deg, #7a5230 0%, #5a3a18 55%, #3a2410 100%)'
  const shelfGlow     = dark
    ? 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(139,94,60,0.15) 0%, transparent 70%)'
    : 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(255,185,65,0.22) 0%, transparent 70%)'
  const lightRay      = dark
    ? 'radial-gradient(ellipse 50% 55% at 50% 0%, rgba(139,94,60,0.1) 0%, transparent 70%)'
    : 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,230,160,0.45) 0%, rgba(255,200,80,0.1) 55%, transparent 80%)'
  const filterBg      = dark ? 'rgba(44,36,24,0.85)' : 'rgba(237,229,213,0.9)'
  const filterBorder  = dark ? 'rgba(139,94,60,0.35)' : 'rgba(139,94,60,0.3)'
  const filterColor   = dark ? '#EDE5D5' : '#2C2418'
  const clearColor    = dark ? 'rgba(201,168,76,0.6)' : 'rgba(139,94,60,0.7)'
  const tipColor      = dark ? 'rgba(201,168,76,0.3)' : 'rgba(139,94,60,0.4)'

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'visible' }}>

      <div style={{ position: 'absolute', inset: 0, background: heroBg, transition: 'background 0.8s ease' }} />

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: lightRay, transition: 'background 0.8s ease' }} />

      {!dark && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
          backgroundImage: `repeating-linear-gradient(45deg, #8B5E3C, #8B5E3C 1px, transparent 1px, transparent 8px)`,
        }} />
      )}

      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(90deg, rgba(0,0,0,0.08) 0%, transparent 8%, transparent 92%, rgba(0,0,0,0.08) 100%)',
      }} />

      <div style={{
        position: 'relative', zIndex: 5,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '48px 16px 32px',
      }}>
        <p style={{
          fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase',
          marginBottom: 10, color: tagColor, transition: 'color 0.6s',
        }}>Hoş Geldiniz</p>

        <h1 style={{
          fontFamily: '"Playfair Display",serif',
          fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900,
          color: titleColor, lineHeight: 1.1, marginBottom: 8,
          textShadow: dark ? '0 2px 16px rgba(0,0,0,0.8)' : '0 1px 4px rgba(0,0,0,0.08)',
          transition: 'color 0.6s',
        }}>
          Çevrimiçi Kütüphane
        </h1>

        <p style={{
          fontFamily: '"Cormorant Garamond",serif',
          fontStyle: 'italic', fontSize: '1rem', marginBottom: 24,
          color: subColor, transition: 'color 0.6s',
        }}>
          Binlerce kitap, tek bir yerde
        </p>

        <div style={{ width: '100%', maxWidth: 520, marginBottom: 14 }}>
          <SearchBar value={searchTerm} onChange={onSearchChange} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {[
            {
              value: language, onChange: onLanguageChange,
              options: [
                { value: '', label: 'Tüm Diller' },
                { value: 'en', label: '🇬🇧 İngilizce' },
                { value: 'fr', label: '🇫🇷 Fransızca' },
                { value: 'de', label: '🇩🇪 Almanca' },
                { value: 'zh', label: '🇨🇳 Çince' },
              ]
            },
            {
              value: topic, onChange: onTopicChange,
              options: [
                { value: '', label: 'Tüm Kategoriler' },
                { value: 'fiction', label: 'Kurgu' },
                { value: 'drama', label: 'Drama' },
                { value: 'history', label: 'Tarih' },
                { value: 'science', label: 'Bilim' },
                { value: 'children', label: 'Çocuk' },
              ]
            }
          ].map((sel, i) => (
            <select key={i} value={sel.value} onChange={e => sel.onChange(e.target.value)}
              style={{
                padding: '8px 16px', borderRadius: 999, fontSize: '0.75rem',
                outline: 'none', cursor: 'pointer',
                background: filterBg,
                border: `1px solid ${filterBorder}`,
                color: filterColor,
                backdropFilter: 'blur(4px)',
                transition: 'all 0.5s',
              }}
            >
              {sel.options.map(o => (
                <option key={o.value} value={o.value} style={{ background: dark ? '#2C2418' : '#EDE5D5', color: dark ? '#F5F0E8' : '#2C2418' }}>
                  {o.label}
                </option>
              ))}
            </select>
          ))}

          {(language || topic || searchTerm) && (
            <button onClick={onClear} style={{
              padding: '8px 16px', borderRadius: 999, fontSize: '0.75rem',
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: clearColor, transition: 'color 0.4s',
            }}>
              Temizle ✕
            </button>
          )}
        </div>
      </div>

      <div style={{ position: 'relative', paddingTop: 12, overflow: 'visible' }}>
{/* raftaki kitaplar için */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
          pointerEvents: 'none',
          background: shelfGlow, transition: 'background 0.8s',
        }} />

        <div style={{
          display: 'flex', gap: '2px', padding: '0 4px',
          alignItems: 'flex-end', overflowX: 'hidden', overflowY: 'visible',
          position: 'relative', zIndex: 10,
        }}>
          {allBooks.map(([c1, c2], i) => (
            <BookSpine
              key={i}
              color1={c1} color2={c2}
              width={WIDTHS[i % WIDTHS.length]}
              height={HEIGHTS[i % HEIGHTS.length]}
              dark={dark}
              onBookClick={onQuote}
            />
          ))}
        </div>

        <div style={{
          height: 14,
          background: shelfBg,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
          transition: 'background 0.8s',
        }} />

        <div style={{
          background: dark ? '#1A1410' : '#D4C4A0',
          textAlign: 'center', padding: '8px 0 10px',
          fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase',
          color: tipColor, transition: 'all 0.6s',
        }}>
          kitaplara tıkla ✦
        </div>
      </div>

      {quote && (
        <QuotePopup quote={quote} onClose={() => onQuote(null)} anchorX={quoteAnchorX} />
      )}
    </div>
  )
}
const cache = new Map()

const Home = ({ dark, userId }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [language, setLanguage] = useState('');
  const [topic, setTopic] = useState('');
  const [quote, setQuote] = useState(null);
  const [quoteAnchorX, setQuoteAnchorX] = useState(0);
  const usedQuotes = useRef([]);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const handleBookClick = (x) => {
    if (usedQuotes.current.length >= QUOTES.length) usedQuotes.current = []
    const available = QUOTES.filter((_, i) => !usedQuotes.current.includes(i))
    const pick = available[Math.floor(Math.random() * available.length)]
    usedQuotes.current.push(QUOTES.indexOf(pick))
    setQuoteAnchorX(x)
    setQuote(pick)
  }

  const loadBooks = useCallback(async (url) => {
    //cache'de varsa direkt kullanılır
    if (cache.has(url)) {
      const cached = cache.get(url)
      setBooks(cached.results || [])
      setNextPageUrl(cached.next)
      setPrevPageUrl(cached.previous)
      setLoading(false)
      return
    }
    
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
    if (language) url += `&languages=${language}`;
    if (topic) url += `&topic=${topic}`;
    loadBooks(url);
  }, [debouncedSearch, language, topic, loadBooks]);

  const handlePageChange = (direction) => {
    const targetUrl = direction === 'next' ? nextPageUrl : prevPageUrl;
    if (targetUrl) loadBooks(targetUrl);
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-dark">
      <div className="">
        <Hero
          dark={dark}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          language={language}
          onLanguageChange={setLanguage}
          topic={topic}
          onTopicChange={setTopic}
          onClear={() => { setLanguage(''); setTopic(''); setSearchTerm(''); }}
          onQuote={(x) => typeof x === 'number' ? handleBookClick(x) : setQuote(null)}
          quote={quote}
          quoteAnchorX={quoteAnchorX}
        />
      </div>

      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rust dark:border-gold" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {books.slice(0, 12).map(book => (
                <BookCard key={book.id} book={book} userId={userId} />
              ))}
            </div>
            {books.length === 0 ? (
              <p className="text-center text-ink/40 dark:text-cream/40 mt-10">Kitap bulunamadı.</p>
            ) : (
              <Pagination hasPrev={!!prevPageUrl} hasNext={!!nextPageUrl} onPageChange={handlePageChange} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
