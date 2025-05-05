import React from 'react';
import { ChevronRight, Home } from 'lucide-react';



export const Breadcrumb = ({ path, onNavigate }) => {
  const handleNavigate = (index) => {
    onNavigate(path.slice(0, index + 1));
  };

  const handleHome = () => {
    onNavigate([]);
  };

  return (
    <div className="flex items-center overflow-x-auto whitespace-nowrap py-1">
      <button 
        onClick={handleHome}
        className="text-[#CCCCCC] hover:text-white flex items-center transition-colors duration-150"
      >
        <Home className="h-4 w-4 mr-1" />
        <span>Home</span>
      </button>
      
      {path.map((segment, index) => (
        <React.Fragment key={`${segment}-${index}`}>
          <ChevronRight className="h-4 w-4 mx-2 text-[#6B6B6B]" />
          <button
            onClick={() => handleNavigate(index)}
            className="text-[#CCCCCC] hover:text-white transition-colors duration-150"
          >
            {segment}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};