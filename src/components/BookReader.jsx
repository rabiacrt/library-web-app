import React, { useState, useEffect, useRef, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { X, ChevronLeft, ChevronRight, BookOpen, Loader, Languages } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const PROXIES = [
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  (url) => `https://thingproxy.freeboard.io/fetch/${url}`,
]

async function fetchWithProxy(url) {
  for (const proxy of PROXIES) {
    try {
      const res = await fetch(proxy(url), { signal: AbortSignal.timeout(8000) })
      if (res.ok) {
        const text = await res.text()
        if (text && text.length > 200) return text
      }
    } catch {
      continue
    }
  }
  throw new Error('Tüm proxy\'ler başarısız oldu.')
}

function htmlToText(html) {
  const div = document.createElement('div')
  div.innerHTML = html
  div.querySelectorAll('script, style, nav, header, footer, .toc, #toc').forEach(el => el.remove())
  return div.innerText || div.textContent || ''
}

function splitIntoPages(text, linesPerPage = 15, charsPerLine = 35) {
  const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0)
  const pages = []
  let currentPage = []
  let currentLines = 0

  for (const para of paragraphs) {
    const paraLines = Math.ceil(para.length / charsPerLine)
    if (currentLines + paraLines <= linesPerPage) {
      currentPage.push(para)
      currentLines += paraLines + 1
    } else {
      let remainingPara = para
      while (remainingPara.length > 0) {
        let linesLeft = linesPerPage - currentLines
        if (linesLeft <= 1) {
          if (currentPage.length > 0) { pages.push(currentPage.join('\n\n')); currentPage = []; currentLines = 0 }
          linesLeft = linesPerPage
        }
        const charsToTake = linesLeft * charsPerLine
        if (remainingPara.length <= charsToTake) {
          currentPage.push(remainingPara)
          currentLines += Math.ceil(remainingPara.length / charsPerLine) + 1
          remainingPara = ''
        } else {
          let splitIdx = remainingPara.lastIndexOf('. ', charsToTake)
          if (splitIdx === -1 || splitIdx < charsToTake * 0.5) splitIdx = remainingPara.lastIndexOf(' ', charsToTake)
          if (splitIdx === -1 || splitIdx === 0) splitIdx = charsToTake
          currentPage.push(remainingPara.slice(0, splitIdx + 1).trim())
          pages.push(currentPage.join('\n\n'))
          currentPage = []; currentLines = 0
          remainingPara = remainingPara.slice(splitIdx + 1).trim()
        }
      }
    }
  }
  if (currentPage.length > 0) pages.push(currentPage.join('\n\n'))
  return pages
}

const LANG_MAP = {
  en: 'en', fr: 'fr', de: 'de', zh: 'zh', es: 'es',
  it: 'it', ru: 'ru', pt: 'pt', ja: 'ja', ar: 'ar',
}

// MyMemory API ile çeviri
async function translateToTurkish(text, sourceLang = 'en') {
  const lang = LANG_MAP[sourceLang] || 'en'
  const langpair = `${lang}|tr`

  const chunks = []
  let remaining = text.trim()
  while (remaining.length > 0) {
    let end = 400
    if (remaining.length > 400) {
      const spaceIdx = remaining.lastIndexOf(' ', 400)
      if (spaceIdx > 200) end = spaceIdx
    }
    chunks.push(remaining.slice(0, end).trim())
    remaining = remaining.slice(end).trim()
  }

  const translated = []
  for (const chunk of chunks) {
    if (!chunk) continue
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${langpair}`,
        { signal: AbortSignal.timeout(12000) }
      )
      if (!res.ok) { translated.push(chunk); continue }
      const data = await res.json()
      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        translated.push(data.responseData.translatedText)
      } else {
        translated.push(chunk)
      }
    } catch {
      translated.push(chunk)
    }
  }
  return translated.join(' ')
}

//  sayfa bileşeni 
const Page = React.forwardRef(({ content, translatedContent, pageNumber, totalPages, title, isDark, isTranslated, isTranslating, onTranslate, sourceLang }, ref) => (
  <div ref={ref} style={{
    background: isDark ? 'linear-gradient(135deg, #1e1b18 0%, #171512 100%)' : 'linear-gradient(135deg, #fdf8f0 0%, #f5ede0 100%)',
    boxShadow: isDark ? 'inset -3px 0 8px rgba(0,0,0,0.3)' : 'inset -3px 0 8px rgba(0,0,0,0.08)',
    fontFamily: '"Cormorant Garamond", Georgia, serif',
    position: 'relative', overflow: 'hidden',
  }}>
    <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    <div style={{
      position: 'absolute', inset: 0, opacity: isDark ? 0.05 : 0.025, pointerEvents: 'none',
      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(0,0,0,0.4) 28px, rgba(0,0,0,0.4) 29px)`,
    }} />

    <div style={{ padding: '28px 28px 36px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
     
      <div style={{
        borderTop: `1px solid ${isDark ? 'rgba(201,168,76,0.15)' : 'rgba(139,94,60,0.2)'}`,
        marginBottom: 10, paddingTop: 6,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>

        <button
          onClick={onTranslate}
          disabled={isTranslating}
          style={{
            display: 'flex', alignItems: 'center', gap: 3,
            fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '2px 6px', borderRadius: 2,
            border: `1px solid ${isTranslated ? (isDark ? 'rgba(201,168,76,0.5)' : 'rgba(160,64,48,0.4)') : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
            background: isTranslated ? (isDark ? 'rgba(201,168,76,0.1)' : 'rgba(160,64,48,0.08)') : 'transparent',
            color: isTranslated ? (isDark ? 'rgba(201,168,76,0.8)' : '#A04030') : (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'),
            cursor: isTranslating ? 'wait' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {isTranslating ? (
            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
          ) : '🌐'}
          {isTranslated ? 'TR' : 'Çevir'}
        </button>

        
        <span style={{ fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: isDark ? 'rgba(201,168,76,0.4)' : 'rgba(139,94,60,0.45)' }}>
          {title.slice(0, 25)}{title.length > 25 ? '...' : ''}
        </span>
      </div>

     
      <div className="hide-scrollbar" style={{
        flex: 1, overflowY: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none',
        fontSize: '0.82rem', lineHeight: 1.5,
        color: isDark ? '#D9D3CA' : '#2C2418',
        textAlign: 'justify', padding: '0 2px', wordBreak: 'break-word',
      }}>
        {isTranslating ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
            <div style={{ fontSize: '1.5rem', animation: 'spin 1s linear infinite' }}>⟳</div>
            <span style={{ fontSize: '0.7rem', color: isDark ? 'rgba(201,168,76,0.5)' : 'rgba(139,94,60,0.5)' }}>Çevriliyor...</span>
          </div>
        ) : (
          (isTranslated && translatedContent ? translatedContent : content)
            .split('\n\n')
            .map((para, i) => (
              <p key={i} style={{ marginBottom: '0.5em', textIndent: '1.2em', marginTop: 0 }}>
                {para}
              </p>
            ))
        )}
      </div>

      
      <div style={{
        borderTop: `1px solid ${isDark ? 'rgba(201,168,76,0.15)' : 'rgba(139,94,60,0.15)'}`,
        marginTop: 8, paddingTop: 6,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: '0.5rem', color: isDark ? 'rgba(201,168,76,0.35)' : 'rgba(139,94,60,0.4)', letterSpacing: '0.1em' }}>
          {isTranslated ? '🇹🇷 Türkçe' : (() => {
            const flags = { en: '🇬🇧', fr: '🇫🇷', de: '🇩🇪', zh: '🇨🇳', es: '🇪🇸', it: '🇮🇹', ru: '🇷🇺', pt: '🇵🇹', ja: '🇯🇵', ar: '🇸🇦' }
            return (flags[sourceLang] || '📖') + ' Orijinal'
          })()}
        </span>
        <span style={{ fontSize: '0.55rem', color: isDark ? 'rgba(201,168,76,0.4)' : 'rgba(139,94,60,0.45)', letterSpacing: '0.1em' }}>
          {pageNumber} / {totalPages}
        </span>
      </div>
    </div>

    <style>{`
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `}</style>
  </div>
))
Page.displayName = 'Page'

// kapak
const CoverPage = React.forwardRef(({ title, author, cover, isDark }, ref) => (
  <div ref={ref} style={{
    background: isDark ? 'linear-gradient(160deg, #14120E 0%, #201A12 50%, #14120E 100%)' : 'linear-gradient(160deg, #2C2418 0%, #4a3520 50%, #2C2418 100%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: cover ? 0 : 36, position: 'relative', overflow: 'hidden',
  }}>
    {cover ? (
      <img src={cover} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    ) : (
      <>
        <div style={{ position: 'absolute', inset: 14, border: '1px solid rgba(201,168,76,0.3)', pointerEvents: 'none' }} />
        <BookOpen size={40} color="rgba(201,168,76,0.5)" style={{ marginBottom: 20 }} />
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1rem', fontWeight: 900, color: '#F5F0E8', textAlign: 'center', lineHeight: 1.3, marginBottom: 10 }}>{title}</h2>
        <div style={{ width: 36, height: 1, background: 'rgba(201,168,76,0.5)', margin: '6px 0 10px' }} />
        <p style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: '0.8rem', color: 'rgba(201,168,76,0.7)', textAlign: 'center' }}>{author}</p>
      </>
    )}
  </div>
))
CoverPage.displayName = 'CoverPage'

// ana bileşen 
export default function BookReader({ book, onClose }) {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [translations, setTranslations] = useState({})
  const flipBook = useRef(null)
  const { dark } = useDarkMode()

  const author = book.authors?.length > 0 ? book.authors.map(a => a.name).join(', ') : 'Bilinmeyen Yazar'
  const cover = book.formats?.['image/jpeg']

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true); setError(null)
      const textUrl = book.formats?.['text/plain; charset=utf-8'] || book.formats?.['text/plain; charset=us-ascii']
      const htmlUrl = book.formats?.['text/html']
      const targetUrl = textUrl || htmlUrl
      if (!targetUrl) { setError('Bu kitap için okunabilir bir format bulunamadı.'); setLoading(false); return }
      try {
        const raw = await fetchWithProxy(targetUrl)
        let text = ''
        if (textUrl) {
          text = raw
          const startMatch = raw.match(/\*\*\* START OF (THE|THIS) PROJECT GUTENBERG/i)
          const endMatch = raw.match(/\*\*\* END OF (THE|THIS) PROJECT GUTENBERG/i)
          if (startMatch) { const si = raw.indexOf(startMatch[0]) + startMatch[0].length; text = raw.slice(raw.indexOf('\n', si) + 1) }
          if (endMatch) { const ei = text.indexOf(endMatch[0]); if (ei > 0) text = text.slice(0, ei) }
        } else { text = htmlToText(raw) }
        text = text.trim()
        if (text.length < 100) { setError('Kitap içeriği çok kısa veya okunamadı.'); setLoading(false); return }
        setPages(splitIntoPages(text, 15, 35))
      } catch { setError('Kitap içeriği yüklenemedi. Lütfen başka bir kitap deneyin.') }
      finally { setLoading(false) }
    }
    fetchContent()
  }, [book])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') flipBook.current?.pageFlip()?.flipNext()
      if (e.key === 'ArrowLeft') flipBook.current?.pageFlip()?.flipPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [onClose])

  // sayfa translate
  const handleTranslate = useCallback(async (pageIndex) => {
    const t = translations[pageIndex]

    if (t?.content) {
      setTranslations(prev => ({ ...prev, [pageIndex]: { ...prev[pageIndex], translated: !prev[pageIndex].translated } }))
      return
    }

    setTranslations(prev => ({ ...prev, [pageIndex]: { translated: false, content: null, translating: true } }))
    try {
      const sourceLang = book.languages?.[0] || 'en'
      const result = await translateToTurkish(pages[pageIndex], sourceLang)
      setTranslations(prev => ({ ...prev, [pageIndex]: { translated: true, content: result, translating: false } }))
    } catch {
      setTranslations(prev => ({ ...prev, [pageIndex]: { translated: false, content: null, translating: false } }))
    }
  }, [pages, translations])

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center px-4 transition-colors duration-300"
      style={{ background: dark ? 'rgba(10,8,4,0.97)' : 'rgba(253,248,240,0.97)', backdropFilter: 'blur(8px)' }}
    >

      <div className="flex items-center justify-between w-full mb-4" style={{ maxWidth: 800 }}>
        <div className="min-w-0 flex-1 pr-4">
          <p className={`font-display font-bold text-sm leading-tight truncate ${dark ? 'text-cream/90' : 'text-dark/90'}`}>{book.title}</p>
          <p className={`font-italic-serif italic text-xs truncate ${dark ? 'text-warm/60' : 'text-rust/60'}`}>{author}</p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          {!loading && !error && (
            <span className={`text-xs tracking-wide ${dark ? 'text-cream/30' : 'text-dark/40'}`}>
              {currentPage === 0 ? 'Kapak' : `Sayfa ${currentPage} / ${pages.length}`}
            </span>
          )}
          <button onClick={onClose} className={`transition-colors ${dark ? 'text-cream/40 hover:text-rust' : 'text-dark/40 hover:text-rust'}`}>
            <X size={20} />
          </button>
        </div>
      </div>

      {loading && (
        <div className={`flex flex-col items-center gap-4 ${dark ? 'text-cream/50' : 'text-dark/50'}`}>
          <Loader size={32} className="animate-spin text-gold" />
          <p className="text-sm">Kitap yükleniyor...</p>
          <p className={`text-xs ${dark ? 'text-cream/25' : 'text-dark/30'}`}>Bu birkaç saniye sürebilir</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center gap-4 text-center px-8 max-w-sm">
          <BookOpen size={40} className={dark ? 'text-warm/30' : 'text-rust/30'} />
          <p className={`text-sm leading-relaxed ${dark ? 'text-cream/50' : 'text-dark/60'}`}>{error}</p>
          <button onClick={onClose} className={`text-xs tracking-widest uppercase border px-6 py-2.5 transition-colors ${dark ? 'text-warm border-warm/30 hover:bg-warm/10' : 'text-rust border-rust/30 hover:bg-rust/10'}`}>
            Kapat
          </button>
        </div>
      )}

      {!loading && !error && pages.length > 0 && (
        <>
          <div className="flex items-center gap-4">
            <button onClick={() => flipBook.current?.pageFlip()?.flipPrev()}
              className={`transition-colors p-2 hidden md:block ${dark ? 'text-cream/30 hover:text-cream' : 'text-dark/30 hover:text-dark'}`}>
              <ChevronLeft size={28} />
            </button>

            <HTMLFlipBook
              ref={flipBook}
              width={300} height={440}
              size="fixed" showCover={true} flippingTime={650}
              style={{ boxShadow: dark ? '0 20px 60px rgba(0,0,0,0.8)' : '0 20px 50px rgba(0,0,0,0.15)' }}
              onFlip={(e) => setCurrentPage(e.data)}
              mobileScrollSupport={true} drawShadow={true}
              maxShadowOpacity={dark ? 0.4 : 0.2}
            >
              <CoverPage title={book.title} author={author} cover={cover} isDark={dark} />
              {pages.map((content, i) => (
                <Page
                  key={i}
                  content={content}
                  translatedContent={translations[i]?.content}
                  pageNumber={i + 1}
                  totalPages={pages.length}
                  title={book.title}
                  isDark={dark}
                  isTranslated={translations[i]?.translated || false}
                  isTranslating={translations[i]?.translating || false}
                  onTranslate={() => handleTranslate(i)}
                  sourceLang={book.languages?.[0] || 'en'}
                />
              ))}
            </HTMLFlipBook>

            <button onClick={() => flipBook.current?.pageFlip()?.flipNext()}
              className={`transition-colors p-2 hidden md:block ${dark ? 'text-cream/30 hover:text-cream' : 'text-dark/30 hover:text-dark'}`}>
              <ChevronRight size={28} />
            </button>
          </div>

          <div className="flex gap-8 mt-5 md:hidden">
            <button onClick={() => flipBook.current?.pageFlip()?.flipPrev()}
              className={`flex items-center gap-1.5 transition-colors text-sm ${dark ? 'text-cream/40 hover:text-cream' : 'text-dark/50 hover:text-dark'}`}>
              <ChevronLeft size={16} /> Önceki
            </button>
            <button onClick={() => flipBook.current?.pageFlip()?.flipNext()}
              className={`flex items-center gap-1.5 transition-colors text-sm ${dark ? 'text-cream/40 hover:text-cream' : 'text-dark/50 hover:text-dark'}`}>
              Sonraki <ChevronRight size={16} />
            </button>
          </div>

          <p className={`text-xs mt-3 tracking-wide ${dark ? 'text-cream/20' : 'text-dark/30'}`}>
            Sayfaya tıkla veya ← → tuşlarını kullan
          </p>
        </>
      )}
    </div>
  )
}
