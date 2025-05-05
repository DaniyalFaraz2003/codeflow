import React from 'react';
import { Navbar } from '../Navbar';
import { Sidebar } from '../DashboardSidebar';

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}