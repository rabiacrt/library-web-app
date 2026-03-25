import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  
  const coverImage = book.formats['image/jpeg'] || 'https://via.placeholder.com/200x300?text=No+Cover';

  return (
    <div className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white flex flex-col h-full">
     
      <div className="relative overflow-hidden h-64">
        <img 
          src={coverImage} 
          alt={book.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>

     
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg line-clamp-2 mb-2 text-gray-800 group-hover:text-blue-500 transition-colors">
          {book.title}
        </h3>
        
        <p className="text-gray-500 text-sm mb-4">
          {book.authors.length > 0 
            ? book.authors.map(a => a.name).join(', ') 
            : 'Bilinmeyen Yazar'}
        </p>

        
        <Link 
          to={`/book/${book.id}`}
          className="mt-auto block text-center bg-blue-300 text-white py-2 rounded-md hover:bg-blue-200 transition-colors font-medium"
        >
          Detayları Gör
        </Link>
      </div>
    </div>
  );
};

export default BookCard;