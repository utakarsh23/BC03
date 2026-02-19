'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import FloatingActionButton from '@/components/FloatingActionButton';
import { mockCompanies, sectors, stages, locations } from '@/data/mockCompanies';
import { Company } from '@/types';

export default function CompaniesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState<keyof Company>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = searchParams.get('q');
    const sector = searchParams.get('sector');
    const stage = searchParams.get('stage');
    const location = searchParams.get('location');
    const page = searchParams.get('page');

    if (q) setSearchQuery(q);
    if (sector) setSelectedSector(sector);
    if (stage) setSelectedStage(stage);
    if (location) setSelectedLocation(location);
    if (page) setCurrentPage(parseInt(page, 10));
  }, [searchParams]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + F - Focus search
      if (modifier && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Cmd/Ctrl + O - Open file upload
      if (modifier && e.key === 'o') {
        e.preventDefault();
        fileInputRef.current?.click();
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

  const filteredAndSortedCompanies = useMemo(() => {
    let filtered = mockCompanies.filter((company) => {
      const matchesSearch = 
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = !selectedSector || company.sector === selectedSector;
      const matchesStage = !selectedStage || company.stage === selectedStage;
      const matchesLocation = !selectedLocation || company.location === selectedLocation;
      
      return matchesSearch && matchesSector && matchesStage && matchesLocation;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';
      const comparison = aValue.toString().localeCompare(bValue.toString());
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchQuery, selectedSector, selectedStage, selectedLocation, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedCompanies.length / itemsPerPage);
  const paginatedCompanies = filteredAndSortedCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (column: keyof Company) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const updatePageInUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSector('');
    setSelectedStage('');
    setSelectedLocation('');
    setCurrentPage(1);
    updatePageInUrl(1);
  };

  const handleDownloadCompanies = (format: 'csv' | 'json') => {
    const companies = filteredAndSortedCompanies;

    if (format === 'json') {
      const dataStr = JSON.stringify(companies, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `companies_${new Date().getTime()}.json`;

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
      const exportFileDefaultName = `companies_${new Date().getTime()}.csv`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let companies: any[] = [];

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

        // Create a new list with uploaded companies
        const listName = `Uploaded: ${file.name.replace(/\.(json|csv)$/, '')}`;
        const newList = {
          id: Date.now().toString(),
          name: listName,
          companyIds,
          createdAt: new Date().toISOString(),
        };

        // Get existing lists from localStorage
        const existingLists = localStorage.getItem('lists');
        const lists = existingLists ? JSON.parse(existingLists) : [];
        
        // Add the new list
        lists.push(newList);
        localStorage.setItem('lists', JSON.stringify(lists));

        // Show success message
        alert(`Successfully created list "${listName}" with ${companyIds.length} matching companies!`);
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

  return (
    <div className="p-8 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Companies</h1>
        <SearchBar ref={searchInputRef} onSearch={setSearchQuery} placeholder="Search companies..." />
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={selectedSector}
          onChange={(e) => {
            setSelectedSector(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Sectors</option>
          {sectors.map((sector) => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>

        <select
          value={selectedStage}
          onChange={(e) => {
            setSelectedStage(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Stages</option>
          {stages.map((stage) => (
            <option key={stage} value={stage}>{stage}</option>
          ))}
        </select>

        <select
          value={selectedLocation}
          onChange={(e) => {
            setSelectedLocation(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>

        <button
          onClick={clearFilters}
          className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
        >
          Clear Filters
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th 
                onClick={() => handleSort('name')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('sector')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Sector {sortBy === 'sector' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('stage')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Stage {sortBy === 'stage' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('location')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Location {sortBy === 'location' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Funding
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedCompanies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/companies/${company.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                    {company.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {company.sector}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {company.stage}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {company.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {company.fundingRaised}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedCompanies.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No companies found matching your criteria
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredAndSortedCompanies.length)} of{' '}
            {filteredAndSortedCompanies.length} companies
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        }
        actions={[
          {
            label: 'Upload Companies (CSV/JSON)',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            ),
            onClick: () => fileInputRef.current?.click(),
          },
          {
            label: 'Download as CSV',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ),
            onClick: () => handleDownloadCompanies('csv'),
          },
          {
            label: 'Download as JSON',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            ),
            onClick: () => handleDownloadCompanies('json'),
          },
        ]}
      />
    </div>
  );
}
