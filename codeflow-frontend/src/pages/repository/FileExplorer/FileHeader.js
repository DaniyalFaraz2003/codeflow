import React from 'react';
import { ArrowUpDown, Clock } from 'lucide-react';



export const FileHeader = ({ 
  sortOption, 
  sortDirection, 
  onSort 
}) => {
  const renderSortIcon = (option) => {
    if (sortOption === option) {
      return (
        <ArrowUpDown 
          className={`ml-1 inline-block h-4 w-4 transition-transform duration-200 ${
            sortDirection === 'desc' ? 'rotate-180' : ''
          }`} 
        />
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-[#2D2D30] text-[#CCCCCC] text-sm font-medium border-b border-[#3E3E42]">
      <div 
        className="col-span-6 flex items-center cursor-pointer hover:text-white transition-colors duration-200"
        onClick={() => onSort('name')}
      >
        Name {renderSortIcon('name')}
      </div>
      <div 
        className="col-span-3 flex items-center cursor-pointer hover:text-white transition-colors duration-200"
        onClick={() => onSort('lastChange')}
      >
        <Clock className="mr-1 h-4 w-4" />
        Created {renderSortIcon('lastChange')}
      </div>
      <div 
        className="col-span-3 flex items-center cursor-pointer hover:text-white transition-colors duration-200"
        onClick={() => onSort('commits')}
      >
        Hash {renderSortIcon('commits')}
      </div>
    </div>
  );
};