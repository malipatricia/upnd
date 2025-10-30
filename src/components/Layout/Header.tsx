'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession(); 
  const user = session?.user;

  if (!user) return null;

  return (
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Logo_of_the_United_Party_for_National_Development.svg/400px-Logo_of_the_United_Party_for_National_Development.svg.png"
              alt="UPND Logo"
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-upnd-black">UPND Membership Platform</h1>
              <p className="text-sm text-upnd-yellow font-medium">Unity, Work, Progress</p>
            </div>
          </div>
        </div>

        <div className="lg:flex items-center space-x-4 lg:block hidden">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-upnd-red-light rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-upnd-black">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
              {user.constituency && (
                <p className="text-xs text-upnd-red font-medium">{user.constituency}</p>
              )}
            </div>
          </div>

          <button
            onClick={()=>{}}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-upnd-red hover:bg-gray-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
  );
}