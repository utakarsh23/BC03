'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import FloatingActionButton from '@/components/FloatingActionButton';
import { CompanyList } from '@/types';
import { mockCompanies } from '@/data/mockCompanies';

export default function ListsPage() {
  const router = useRouter();
  const [lists, setLists] = useState<CompanyList[]>([]);
  const [newListName, setNewListName] = useState('');
  const [viewingList, setViewingList] = useState<CompanyList | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showViewListDownloadModal, setShowViewListDownloadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get page from URL if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page');
      if (page) setCurrentPage(parseInt(page, 10));
    }
  }, []);

  useEffect(() => {
    const savedLists = localStorage.getItem('lists');
    if (savedLists) {
      setLists(JSON.parse(savedLists));
    }
  }, []);

  const updatePageInUrl = (page: number) => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (page === 1) {
        params.delete('page');
      } else {
        params.set('page', page.toString());
      }
      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    updatePageInUrl(1);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + F - Focus search
      if (modifier && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // 1 - Go to companies
      if (e.key === '1' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        router.push('/companies');
      }

      // 2 - Go to lists
      if (e.key === '2' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        router.push('/lists');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  useEffect(() => {
    const handleViewListKeyDown = (e: KeyboardEvent) => {
      if (!viewingList) return;
      
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + S - Download current list
      if (modifier && e.key === 's') {
        e.preventDefault();
        setShowViewListDownloadModal(true);
      }
    };

    document.addEventListener('keydown', handleViewListKeyDown);
    return () => document.removeEventListener('keydown', handleViewListKeyDown);
  }, [viewingList]);

  useEffect(() => {
    const handleViewListKeyDown = (e: KeyboardEvent) => {
      if (!viewingList) return;
      
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + S - Download current list
      if (modifier && e.key === 's') {
        e.preventDefault();
        setShowViewListDownloadModal(true);
      }
    };

    document.addEventListener('keydown', handleViewListKeyDown);
    return () => document.removeEventListener('keydown', handleViewListKeyDown);
  }, [viewingList]);

  const filteredLists = useMemo(() => {
    if (!searchQuery.trim()) return lists;
    
    return lists.filter((list) => {
      // Search by list name
      if (list.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return true;
      }
      
      // Search by company names in the list
      const companies = mockCompanies.filter((c) => list.companyIds.includes(c.id));
      return companies.some((c) => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.stage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [lists, searchQuery]);

  const totalPages = Math.ceil(filteredLists.length / itemsPerPage);
  const paginatedLists = filteredLists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateList = () => {
    if (!newListName.trim()) return;

    const newList: CompanyList = {
      id: Date.now().toString(),
      name: newListName,
      companyIds: [],
      createdAt: new Date().toISOString(),
    };

    const updatedLists = [...lists, newList];
    setLists(updatedLists);
    localStorage.setItem('lists', JSON.stringify(updatedLists));
    setNewListName('');
    setShowCreateModal(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let companies: any[] = [];
        let listName = file.name.replace(/\.(json|csv)$/, '');

        if (file.name.endsWith('.json')) {
          companies = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          // Parse CSV
          const lines = content.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          
          companies = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            const company: any = {};
            headers.forEach((header, index) => {
              company[header] = values[index];
            });
            return company;
          });
        }

        // Extract company IDs or match by name
        const companyIds = companies
          .map(c => {
            // Try to find matching company by name or website
            const match = mockCompanies.find(
              mc => mc.name.toLowerCase() === (c.name || c.Name || '').toLowerCase() ||
                    mc.website.toLowerCase() === (c.website || c.Website || '').toLowerCase()
            );
            return match?.id;
          })
          .filter(Boolean) as string[];

        const newList: CompanyList = {
          id: Date.now().toString(),
          name: listName,
          companyIds,
          createdAt: new Date().toISOString(),
        };

        const updatedLists = [...lists, newList];
        setLists(updatedLists);
        localStorage.setItem('lists', JSON.stringify(updatedLists));
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Error parsing file. Please ensure it\'s a valid JSON or CSV file.');
      }
    };

    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteList = (listId: string) => {
    const updatedLists = lists.filter((list) => list.id !== listId);
    setLists(updatedLists);
    localStorage.setItem('lists', JSON.stringify(updatedLists));
    if (viewingList?.id === listId) setViewingList(null);
  };

  const handleDownloadLists = (format: 'csv' | 'json') => {
    setShowDownloadModal(false);

    const listsToDownload = filteredLists.map(list => ({
      name: list.name,
      companies: mockCompanies
        .filter(c => list.companyIds.includes(c.id))
        .map(c => ({
          name: c.name,
          sector: c.sector,
          stage: c.stage,
          location: c.location,
          fundingRaised: c.fundingRaised,
          employeeCount: c.employeeCount,
          website: c.website,
        })),
      createdAt: list.createdAt,
    }));

    if (format === 'json') {
      const dataStr = JSON.stringify(listsToDownload, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `lists_${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } else {
      // CSV format - flatten all companies from all lists
      const csvRows = [];
      csvRows.push('List Name,Company Name,Sector,Stage,Location,Funding Raised,Employee Count,Website,Created At');
      
      listsToDownload.forEach(list => {
        list.companies.forEach(company => {
          csvRows.push([
            `"${list.name}"`,
            `"${company.name}"`,
            `"${company.sector}"`,
            `"${company.stage}"`,
            `"${company.location}"`,
            `"${company.fundingRaised}"`,
            `"${company.employeeCount}"`,
            `"${company.website}"`,
            `"${list.createdAt}"`,
          ].join(','));
        });
      });

      const csvString = csvRows.join('\n');
      const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);
      const exportFileDefaultName = `lists_${new Date().toISOString().split('T')[0]}.csv`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const handleRemoveCompany = (listId: string, companyId: string) => {
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          companyIds: list.companyIds.filter((id) => id !== companyId),
        };
      }
      return list;
    });

    setLists(updatedLists);
    localStorage.setItem('lists', JSON.stringify(updatedLists));
  };

  const handleExport = (list: CompanyList, format: 'csv' | 'json') => {
    const companies = mockCompanies.filter((c) => list.companyIds.includes(c.id));

    if (format === 'json') {
      const dataStr = JSON.stringify(companies, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `${list.name.replace(/\s+/g, '_')}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } else {
      const headers = ['Name', 'Website', 'Sector', 'Stage', 'Location', 'Funding', 'Employees'];
      const csvRows = [
        headers.join(','),
        ...companies.map((c) =>
          [c.name, c.website, c.sector, c.stage, c.location, c.fundingRaised, c.employeeCount].join(',')
        ),
      ];
      const csvStr = csvRows.join('\n');
      const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvStr);
      const exportFileDefaultName = `${list.name.replace(/\s+/g, '_')}.csv`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const handleDownloadCurrentList = (format: 'csv' | 'json') => {
    setShowViewListDownloadModal(false);
    if (!viewingList) return;

    const listToDownload = {
      name: viewingList.name,
      companies: mockCompanies
        .filter(c => viewingList.companyIds.includes(c.id))
        .map(c => ({
          name: c.name,
          sector: c.sector,
          stage: c.stage,
          location: c.location,
          fundingRaised: c.fundingRaised,
          employeeCount: c.employeeCount,
          website: c.website,
        })),
      createdAt: viewingList.createdAt,
    };

    if (format === 'json') {
      const dataStr = JSON.stringify(listToDownload, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `${viewingList.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } else {
      // CSV format
      const csvRows = [];
      csvRows.push('Company Name,Sector,Stage,Location,Funding Raised,Employee Count,Website');
      
      listToDownload.companies.forEach(company => {
        csvRows.push([
          `"${company.name}"`,
          `"${company.sector}"`,
          `"${company.stage}"`,
          `"${company.location}"`,
          `"${company.fundingRaised}"`,
          `"${company.employeeCount}"`,
          `"${company.website}"`,
        ].join(','));
      });

      const csvString = csvRows.join('\n');
      const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);
      const exportFileDefaultName = `${viewingList.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  return (
    <div className="p-8 pb-24">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Lists</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar ref={searchInputRef} onSearch={setSearchQuery} placeholder="Search lists or companies..." />
      </div>

      {lists.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No lists yet. Click the + button to create your first list!</p>
        </div>
      ) : filteredLists.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No lists found matching "{searchQuery}"</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedLists.map((list) => {
            const companies = mockCompanies.filter((c) => list.companyIds.includes(c.id));

            return (
              <div key={list.id} className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{list.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {companies.length} companies • Created {new Date(list.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExport(list, 'csv')}
                        className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        Export CSV
                      </button>
                      <button
                        onClick={() => handleExport(list, 'json')}
                        className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        Export JSON
                      </button>
                      <button
                        onClick={() => setViewingList(list)}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteList(list.id)}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredLists.length)} of{' '}
              {filteredLists.length} lists
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newPage = Math.max(1, currentPage - 1);
                  setCurrentPage(newPage);
                  updatePageInUrl(newPage);
                }}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    updatePageInUrl(page);
                  }}
                  className={`px-4 py-2 border rounded-lg ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => {
                  const newPage = Math.min(totalPages, currentPage + 1);
                  setCurrentPage(newPage);
                  updatePageInUrl(newPage);
                }}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
        </>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".json,.csv"
        className="hidden"
      />

      {/* Floating Action Button */}
      <FloatingActionButton
        mainIcon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }
        actions={[
          {
            label: 'Upload CSV/JSON',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            ),
            onClick: () => fileInputRef.current?.click(),
          },
          {
            label: 'Create New List',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ),
            onClick: () => setShowCreateModal(true),
          },
          {
            label: 'Download Lists',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            ),
            onClick: () => setShowDownloadModal(true),
          },
        ]}
      />

      {/* Create List Modal */}
      {showCreateModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 w-96 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create New List</h3>
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
              placeholder="Enter list name..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewListName('');
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateList}
                disabled={!newListName.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </>
      )}

      {/* Download Format Modal */}
      {showDownloadModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowDownloadModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 w-96 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Download Lists</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Select download format:</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleDownloadLists('csv')}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download as CSV
              </button>
              <button
                onClick={() => handleDownloadLists('json')}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Download as JSON
              </button>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="w-full px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* View List Modal */}
      {viewingList && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setViewingList(null)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{viewingList.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {mockCompanies.filter((c) => viewingList.companyIds.includes(c.id)).length} companies • Created {new Date(viewingList.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setViewingList(null)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {viewingList.companyIds.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No companies in this list yet. Add companies from their profile pages.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {mockCompanies
                    .filter((c) => viewingList.companyIds.includes(c.id))
                    .map((company) => (
                      <div
                        key={company.id}
                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <div>
                          <Link
                            href={`/companies/${company.id}`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                            onClick={() => setViewingList(null)}
                          >
                            {company.name}
                          </Link>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {company.sector} • {company.stage} • {company.location}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {company.fundingRaised} • {company.employeeCount} employees
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveCompany(viewingList.id, company.id)}
                          className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
            
            {/* Keyboard Shortcut Info */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-900/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300">⌘/Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300">S</kbd> to save this list
              </p>
            </div>
          </div>
        </>
      )}

      {/* Download Current List Format Modal */}
      {showViewListDownloadModal && viewingList && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowViewListDownloadModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-[60] w-96 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Download "{viewingList.name}"</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Select download format:</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleDownloadCurrentList('csv')}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download as CSV
              </button>
              <button
                onClick={() => handleDownloadCurrentList('json')}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Download as JSON
              </button>
              <button
                onClick={() => setShowViewListDownloadModal(false)}
                className="w-full px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
