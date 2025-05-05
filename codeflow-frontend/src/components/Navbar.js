import React from 'react';
import { User2, LogOut } from 'lucide-react';
import logo from "../assets/logo.png";
const { useAuth } = require('../context/AuthContext');

export function Navbar() {
  const { currentUser, logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

  return (
    <header className="h-14 bg-[#2D2D2D] border-b border-[#333] flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-8 h-8" />
          <span>CodeFlow</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-1 hover:bg-[#3D3D3D] rounded transition-all">
          <User2 size={20} className="text-gray-400" />

        </button>
        <button onClick={handleLogout} className="p-1 hover:bg-[#3D3D3D] rounded transition-all">
          <LogOut size={20} className="text-red-500" />

        </button>


      </div>
    </header>
  );
}