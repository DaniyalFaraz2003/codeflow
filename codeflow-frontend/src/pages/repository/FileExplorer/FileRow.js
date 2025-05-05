import React from 'react';
import { 
  Folder, 
  FileText, 
  FileCode, 
  FileJson, 
  Image, 
  FileArchive,
  File as FileIcon
} from 'lucide-react';


export const FileRow = ({ file, onClick }) => {
  const getFileIcon = () => {
    if (file.type === 'folder') {
      return <Folder className="h-5 w-5 text-[#E6AA17]" />;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
        return <FileCode className="h-5 w-5 text-[#519ABA]" />;
      case 'json':
        return <FileJson className="h-5 w-5 text-[#8BC34A]" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
      case 'gif':
        return <Image className="h-5 w-5 text-[#A074C4]" />;
      case 'zip':
      case 'rar':
      case 'tar':
      case 'gz':
        return <FileArchive className="h-5 w-5 text-[#DB696F]" />;
      case 'md':
      case 'txt':
        return <FileText className="h-5 w-5 text-[#C8C8C8]" />;
      default:
        return <FileIcon className="h-5 w-5 text-[#C8C8C8]" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div 
      className="grid grid-cols-12 gap-2 px-4 py-3 text-[#CCCCCC] hover:bg-[#2A2D2E] cursor-pointer transition-colors duration-150"
      onClick={onClick}
    >
      <div className="col-span-6 flex items-center">
        <div className="mr-3 flex-shrink-0">
          {getFileIcon()}
        </div>
        <span className="truncate">{file.name}</span>
      </div>
      <div className="col-span-3 flex items-center text-sm">
        {formatDate(file.createdAt)}
      </div>
      <div className="col-span-3 flex items-center text-sm">
        <span className="inline-block px-2 py-1 bg-[#37373D] rounded text-xs font-mono mr-2">
          {file.hash?.substring(0, 8) || ''}
        </span>
        
      </div>
    </div>
  );
};