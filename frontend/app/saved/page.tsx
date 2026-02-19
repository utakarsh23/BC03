'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SavedSearch } from '@/types';

export default function SavedSearchesPage() {
  const router = useRouter();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('savedSearches');
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  }, []);

  const handleDeleteSearch = (searchId: string) => {
    const updated = savedSearches.filter((s) => s.id !== searchId);
    setSavedSearches(updated);
    localStorage.setItem('savedSearches', JSON.stringify(updated));
  };

  const handleRunSearch = (search: SavedSearch) => {
    const params = new URLSearchParams();
    if (search.query) params.set('q', search.query);
    if (search.filters.sector) params.set('sector', search.filters.sector);
    if (search.filters.stage) params.set('stage', search.filters.stage);
    if (search.filters.location) params.set('location', search.filters.location);

    router.push(`/companies?${params.toString()}`);
  };

  const handleSaveCurrentSearch = () => {
    if (!newSearchName.trim()) return;

    const params = new URLSearchParams(window.location.search);
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: newSearchName,
      query: params.get('q') || '',
      filters: {
        sector: params.get('sector') || undefined,
        stage: params.get('stage') || undefined,
        location: params.get('location') || undefined,
      },
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);
    localStorage.setItem('savedSearches', JSON.stringify(updated));
    setNewSearchName('');
    setShowSaveForm(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Saved Searches</h1>
        <button
          onClick={() => setShowSaveForm(!showSaveForm)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showSaveForm ? 'Cancel' : 'Save Current Search'}
        </button>
      </div>

      {showSaveForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Save Current Search</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newSearchName}
              onChange={(e) => setNewSearchName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSaveCurrentSearch()}
              placeholder="Enter search name..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleSaveCurrentSearch}
              disabled={!newSearchName.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            This will save the current search query and filters from the Companies page.
          </p>
        </div>
      )}

      {savedSearches.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No saved searches yet.</p>
          <p className="text-gray-400 dark:text-gray-500">
            Go to the Companies page, apply filters and search, then come back here to save your search.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedSearches.map((search) => (
            <div key={search.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{search.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    {search.query && (
                      <p>
                        <span className="font-medium">Query:</span> {search.query}
                      </p>
                    )}
                    {search.filters.sector && (
                      <p>
                        <span className="font-medium">Sector:</span> {search.filters.sector}
                      </p>
                    )}
                    {search.filters.stage && (
                      <p>
                        <span className="font-medium">Stage:</span> {search.filters.stage}
                      </p>
                    )}
                    {search.filters.location && (
                      <p>
                        <span className="font-medium">Location:</span> {search.filters.location}
                      </p>
                    )}
                    {!search.query && !search.filters.sector && !search.filters.stage && !search.filters.location && (
                      <p className="text-gray-400">No filters applied</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Saved {new Date(search.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRunSearch(search)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Run Search
                  </button>
                  <button
                    onClick={() => handleDeleteSearch(search.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
