import React from 'react';
import { User } from '../types';
import { LogOut, PlusCircle, History, LayoutGrid, Settings } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  currentView: 'feed' | 'history';
  onNavigate: (view: 'feed' | 'history') => void;
  onLogout: () => void;
  onCreateClick: () => void;
  onEditProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
    user, 
    currentView, 
    onNavigate, 
    onLogout, 
    onCreateClick,
    onEditProfile
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-orange-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('feed')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold italic">
              K
            </div>
            <span className="font-bold text-2xl tracking-tight text-gray-900">
              Kick<span className="text-orange-500">Off</span>
            </span>
          </div>

          {/* Navigation Links (Desktop) */}
          {user && (
              <div className="hidden md:flex items-center gap-1 mx-4">
                  <button 
                    onClick={() => onNavigate('feed')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                        currentView === 'feed' 
                        ? 'bg-orange-50 text-orange-600' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <LayoutGrid size={18} />
                    Feed
                  </button>
                  <button 
                    onClick={() => onNavigate('history')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                        currentView === 'history' 
                        ? 'bg-orange-50 text-orange-600' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <History size={18} />
                    History
                  </button>
              </div>
          )}

          {/* Actions */}
          {user && (
            <div className="flex items-center gap-4">
              <button
                onClick={onCreateClick}
                className="hidden sm:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-medium transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <PlusCircle size={18} />
                <span>Create Match</span>
              </button>
              
              {/* Mobile Create Icon Only */}
              <button
                 onClick={onCreateClick}
                 className="sm:hidden flex items-center justify-center w-10 h-10 bg-orange-500 text-white rounded-full shadow-md"
              >
                <PlusCircle size={20} />
              </button>

              <div className="h-6 w-px bg-gray-200 mx-1"></div>

              <div className="flex items-center gap-3 group relative">
                <button 
                    onClick={onEditProfile}
                    className="flex items-center gap-3 hover:bg-gray-50 p-1 pr-2 rounded-full transition-colors"
                    title="Edit Profile"
                >
                    <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-9 w-9 rounded-full ring-2 ring-orange-100 object-cover"
                    />
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-semibold text-gray-700 leading-none">{user.name}</p>
                    </div>
                    <Settings size={16} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                </button>
                
                <button
                  onClick={onLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1 ml-2"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation (Bottom Bar style or just extra row) - keeping simple for now, added to top */}
      {user && (
        <div className="md:hidden flex border-t border-gray-100">
            <button 
                onClick={() => onNavigate('feed')}
                className={`flex-1 py-3 flex justify-center items-center gap-2 text-sm font-medium ${
                    currentView === 'feed' ? 'text-orange-600 bg-orange-50' : 'text-gray-500'
                }`}
            >
                <LayoutGrid size={16} /> Feed
            </button>
            <div className="w-px bg-gray-100"></div>
            <button 
                onClick={() => onNavigate('history')}
                className={`flex-1 py-3 flex justify-center items-center gap-2 text-sm font-medium ${
                    currentView === 'history' ? 'text-orange-600 bg-orange-50' : 'text-gray-500'
                }`}
            >
                <History size={16} /> History
            </button>
        </div>
      )}
    </nav>
  );
};
