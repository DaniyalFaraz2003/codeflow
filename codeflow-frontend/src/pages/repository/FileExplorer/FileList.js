import React from 'react';
import { FileRow } from './FileRow';



export const FileList = ({ 
  files,
  sortOption,
  sortDirection,
  onFileClick,
}) => {
  const sortFiles = (a, b) => {
    // Always sort folders first
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;

    let result = 0;
    
    switch (sortOption) {
      case 'name':
        result = a.name.localeCompare(b.name);
        break;
      case 'lastChange':
        result = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'commits':
        // Assuming commits might be a string or number
        const aCommits = typeof a.hash === 'string' ? a.hash : a.hash?.toString() || '';
        const bCommits = typeof b.hash === 'string' ? b.hash : b.hash?.toString() || '';
        result = aCommits.localeCompare(bCommits);
        break;
      default:
        result = 0;
    }

    return sortDirection === 'asc' ? result : -result;
  };

  const sortedFiles = [...files].sort(sortFiles);

  return (
    <div className="divide-y divide-[#3E3E42]">
      {sortedFiles.length > 0 ? (
        sortedFiles.map((file, index) => (
          <FileRow 
            key={`${file.name}-${index}`} 
            file={file} 
            onClick={() => onFileClick(file)} 
          />
        ))
      ) : (
        <div className="py-8 text-center text-[#CCCCCC]">
          No files found
        </div>
      )}
    </div>
  );
};