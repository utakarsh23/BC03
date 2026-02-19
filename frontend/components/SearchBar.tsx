'use client';

import { useState, useEffect, useRef, forwardRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  function SearchBar({ onSearch, placeholder = 'Search...' }, ref) {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load search history from localStorage
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }

    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveToHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    let history = [...searchHistory];
    
    // Remove duplicates
    history = history.filter(item => item.toLowerCase() !== searchQuery.toLowerCase());
    
    // Add to beginning
    history.unshift(searchQuery);
    
    // Keep only last 25
    history = history.slice(0, 25);
    
    setSearchHistory(history);
    localStorage.setItem('searchHistory', JSON.stringify(history));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveToHistory(query);
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    saveToHistory(suggestion);
    setShowSuggestions(false);
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.currentTarget.blur();
      setShowSuggestions(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl relative" ref={searchRef}>
      <div className="relative">
        <input
          ref={ref}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />
        <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">🔍</span>
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && searchHistory.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2">Recent Searches</span>
            <button
              type="button"
              onClick={clearHistory}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-2"
            >
              Clear
            </button>
          </div>
          {searchHistory.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(item)}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-900 dark:text-white">{item}</span>
            </button>
          ))}
        </div>
      )}
    </form>
  );
});

export default SearchBar;
