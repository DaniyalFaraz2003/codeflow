import React from 'react';
import { Search, X } from 'lucide-react';



export const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = 'Search...' 
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-[#6B6B6B]" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#3C3C3C] w-full pl-10 pr-10 py-2 rounded-md text-[#CCCCCC] placeholder-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#0078D4] focus:border-transparent transition-all duration-200"
        placeholder={placeholder}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6B6B6B] hover:text-[#CCCCCC] transition-colors duration-150"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};