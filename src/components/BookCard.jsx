import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  const coverImage = book.formats['image/jpeg'] || 'https://via.placeholder.com/200x300?text=No+Cover';

  return (
    <div className="group border border-warm/20 dark:border-warm/10 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-light-warm dark:bg-ink flex flex-col h-full">
      
      <div className="relative overflow-hidden h-64">
        <img 
          src={coverImage} 
          alt={book.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-display font-bold text-lg line-clamp-2 mb-2 text-dark dark:text-cream group-hover:text-rust dark:group-hover:text-gold transition-colors">
          {book.title}
        </h3>
        
        <p className="text-ink/50 dark:text-cream/50 text-sm mb-4">
          {book.authors.length > 0 
            ? book.authors.map(a => a.name).join(', ') 
            : 'Bilinmeyen Yazar'}
        </p>

        <Link 
          to={`/book/${book.id}`}
          className="mt-auto block text-center bg-rust dark:bg-warm text-cream py-2 rounded-md hover:bg-dark dark:hover:bg-gold transition-colors font-medium text-sm tracking-wide"
        >
          Detayları Gör
        </Link>
      </div>
    </div>
  );
};

export default BookCard;