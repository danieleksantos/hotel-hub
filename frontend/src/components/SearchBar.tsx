import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

export type SearchType = 'all' | 'hotel' | 'guest';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  searchType: SearchType;
  onTypeChange: (type: SearchType) => void;
  placeholder?: string;
  count?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  value, onChange, searchType, onTypeChange, placeholder, count 
}) => {
  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row items-center gap-4">
      <div className="flex-1 w-full flex items-center gap-2">
        <div className="relative shrink-0">
          <select
            value={searchType}
            onChange={(e) => onTypeChange(e.target.value as SearchType)}
            className="appearance-none pl-4 pr-10 py-2 text-xs font-bold uppercase tracking-widest bg-white border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-all text-gray-700"
          >
            <option value="all">Tudo</option>
            <option value="hotel">Hotel</option>
            <option value="guest">Hóspede</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-primary transition-all bg-white"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
      {count !== undefined && (
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter shrink-0">
          {count} {count === 1 ? 'resultado' : 'resultados'}
        </div>
      )}
    </div>
  );
};