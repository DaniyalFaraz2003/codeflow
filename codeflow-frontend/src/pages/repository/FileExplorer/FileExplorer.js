import React, { useState } from 'react';
import { FileHeader } from './FileHeader';
import { FileList } from './FileList';
import { SearchBar } from './SearchBar';
import { GitBranch } from 'lucide-react';

const FileExplorer = ({
  initialFiles = [],
  onFileSelect,
  className = '',
  setIsCommitDialogOpen
}) => {
  const [files, setFiles] = useState(initialFiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPath, setCurrentPath] = useState([]);
  const [sortOption, setSortOption] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSort = (option) => {
    if (option === sortOption) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOption(option);
      setSortDirection('asc');
    }
  };

  const handlePathChange = (path) => {
    setCurrentPath(path);
  };

  const handleFileClick = (file) => {
    if (file.type === 'folder') {
      setCurrentPath([...currentPath, file.name]);
    } else if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`bg-[#252526] overflow-hidden border border-[#3E3E42] shadow-lg flex flex-col ${className}`}>
      <div className="p-4 border-b border-[#3E3E42]">
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Type to find a file or folder..."
        />
      </div>
      <div className="px-4 py-2 border-b border-[#3E3E42]">
        <button
          onClick={() => setIsCommitDialogOpen(true)}
          className="flex items-center px-3 py-1.5 bg-[#2D2D2D] hover:bg-[#3D3D3D] 
                            rounded-md text-sm text-[#CCCCCC] transition-colors ml-auto"
        >
          <GitBranch className="h-4 w-4 mr-2" />
          Commit Changes
        </button>
      </div>
      <FileHeader
        sortOption={sortOption}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
      <div className="overflow-y-auto flex-1">
        <FileList
          files={filteredFiles}
          sortOption={sortOption}
          sortDirection={sortDirection}
          onFileClick={handleFileClick}
        />
      </div>
    </div>
  );
};

export default FileExplorer;