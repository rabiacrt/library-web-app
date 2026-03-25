import React from 'react';
//sayfalama işlemi için

const Pagination = ({ onPageChange, hasPrev, hasNext }) => {
  return (
    <div className="flex items-center justify-center space-x-4 mt-12 mb-8">
      <button
        onClick={() => onPageChange('prev')}
        disabled={!hasPrev}
        className={`flex items-center px-6 py-2 border rounded-full font-medium transition-all
          ${!hasPrev 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
            : 'bg-white text-pink-600 border-pink-600 hover:bg-blue-50 active:scale-95'}`}
      >
        <span className="mr-2">←</span> Önceki
      </button>

      <button
        onClick={() => onPageChange('next')}
        disabled={!hasNext}
        className={`flex items-center px-6 py-2 border rounded-full font-medium transition-all
          ${!hasNext 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
            : 'bg-pink-600 text-white border-pink-600 hover:bg-pink-700 active:scale-95'}`}
      >
        Sonraki <span className="ml-2">→</span>
      </button>
    </div>
  );
};

export default Pagination;