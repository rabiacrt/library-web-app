import React from 'react';
import { Search } from 'lucide-react'

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative max-w-xl mx-auto mb-10">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        
      </div>
      <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Kitap adı veya yazar..."
      className="w-full bg-cream border border-warm/30 text-ink placeholder:text-ink/35
                 px-6 py-4 pr-16 text-sm outline-none focus:border-warm transition-colors"

       
      />
      <button className="absolute right-0 top-0 bottom-0 px-5 bg-rust dark:bg-warm text-cream hover:bg-dark transition-colors">
          <Search size={16} />
        </button>
      
    </div>
  );
};

export default SearchBar;