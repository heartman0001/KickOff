import React from 'react';
import { Search } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentView: 'feed' | 'history';
}

export const FilterBar: React.FC<FilterBarProps> = ({ searchTerm, setSearchTerm, currentView }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between border border-gray-100">
      {/* Search */}
      <div className="relative w-full">
        <input
          type="text"
          placeholder={currentView === 'feed' ? "Search upcoming matches..." : "Search past matches..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent focus:bg-white border focus:border-orange-300 rounded-lg outline-none transition-all text-sm"
        />
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
      </div>
      
      <div className="text-sm text-gray-500 whitespace-nowrap">
          Showing <span className="font-bold text-orange-600">{currentView === 'feed' ? 'Upcoming' : 'History'}</span>
      </div>
    </div>
  );
};
