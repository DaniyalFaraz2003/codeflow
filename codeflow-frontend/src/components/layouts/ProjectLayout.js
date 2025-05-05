import React from 'react';
import { Navbar } from '../Navbar';
import { Sidebar } from '../ProjectSidebar';
import { useLocation } from 'react-router-dom';


export function Layout({ children, project, board, repository }) {
  const location = useLocation();


  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white flex">
      <Sidebar path={location.pathname} project={project} board={board} repository={repository}/>
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}