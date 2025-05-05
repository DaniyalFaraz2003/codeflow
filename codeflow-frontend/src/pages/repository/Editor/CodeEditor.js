import React from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css';



export const CodeEditor = ({ content, language = 'typescript' }) => {
  const highlighted = language 
    ? hljs.highlight(content, { language }).value 
    : hljs.highlightAuto(content).value;

  return (
    <div className="h-full w-full bg-[#1E1E1E] text-[#CCCCCC] overflow-auto relative">
      <pre className="p-6 m-0">
        <code 
          dangerouslySetInnerHTML={{ __html: highlighted }} 
          className={`language-${language} hljs`}
        />
      </pre>
    </div>
  );
};