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
            : 'bg-rust text-cream hover:bg-dark   focus:ring-2 focus:ring-amber-600 active:scale-95'}`}
      >
        <span className="mr-2">←</span> Önceki
      </button>

      <button
        onClick={() => onPageChange('next')}
        disabled={!hasNext}
        className={`flex items-center px-6 py-2 border rounded-full font-medium transition-all
          ${!hasNext 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
            : 'bg-rust text-cream hover:bg-dark   focus:ring-2 focus:ring-amber-600 active:scale-95'}`}
      >
        Sonraki <span className="ml-2">→</span>
      </button>
    </div>
  );
};

export default Pagination;