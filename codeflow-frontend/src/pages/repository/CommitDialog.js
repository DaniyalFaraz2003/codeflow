import React, { useState, useRef } from 'react';
import { X, FileText, Code, FileInput } from 'lucide-react';

export const CommitDialog = ({ isOpen, onClose, onCommit }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['text/', 'application/json', '.txt', '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.c', '.cpp', '.h', '.html', '.css', '.scss', '.php', '.rb', '.go', '.rs', '.sh'];
    const isValidType = validTypes.some(type => 
      file.type.includes(type) || file.name.endsWith(type.replace('.', ''))
    );

    if (!isValidType) {
      setError('Only code and text files are allowed');
      setFileName('');
      return;
    }

    setFileName(file.name);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fileInputRef.current?.files?.[0]) {
      setError('Please select a file');
      return;
    }

    if (!message.trim()) {
      setError('Please enter a commit message');
      return;
    }

    try {
      await onCommit(fileInputRef.current.files[0], message);
      setMessage('');
      setFileName('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to commit file');
    }
  };

  const getFileIcon = () => {
    if (!fileName) return <FileInput className="h-5 w-5" />;
    if (fileName.endsWith('.txt')) return <FileText className="h-5 w-5" />;
    return <Code className="h-5 w-5" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#252526] rounded-lg shadow-xl w-full max-w-md border border-[#3E3E42]">
        <div className="flex justify-between items-center p-4 border-b border-[#3E3E42]">
          <h2 className="text-lg font-semibold text-white">Commit Changes</h2>
          <button 
            onClick={onClose}
            className="text-[#CCCCCC] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#CCCCCC]">
              File to Commit
            </label>
            <div 
              onClick={() => fileInputRef.current.click()}
              className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-colors
                ${fileName ? 'border-[#0078D4] bg-[#0078D4]/10' : 'border-[#3E3E42] hover:border-[#0078D4]'}`}
            >
              <div className={`p-2 rounded-md ${fileName ? 'bg-[#0078D4]' : 'bg-[#2D2D2D]'}`}>
                {getFileIcon()}
              </div>
              <div className="flex-1 truncate">
                {fileName || 'Select a file...'}
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.h,.html,.css,.scss,.php,.rb,.go,.rs,.sh,.json"
            />
            <p className="text-xs text-[#6B6B6B]">
              Allowed: .txt, .js, .jsx, .ts, .tsx, .py, .java, .c, .cpp, .h, .html, .css, .scss, .php, .rb, .go, .rs, .sh, .json
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#CCCCCC]">
              Commit Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 bg-[#1E1E1E] text-white rounded-md border border-[#3E3E42]
                focus:outline-none focus:ring-2 focus:ring-[#0078D4] focus:border-transparent
                placeholder-[#6B6B6B]"
              rows={4}
              placeholder="Describe your changes..."
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#CCCCCC] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!message.trim() || !fileName}
              className="px-4 py-2 bg-[#0078D4] text-white rounded-md
                hover:bg-[#006CBD] transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Commit Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};