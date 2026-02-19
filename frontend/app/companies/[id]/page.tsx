'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import BookmarkPopup from '@/components/BookmarkPopup';
import NotesModal from '@/components/NotesModal';
import { mockCompanies } from '@/data/mockCompanies';
import { EnrichmentData, CompanyList, Note } from '@/types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export default function CompanyProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const company = mockCompanies.find((c) => c.id === params.id);
  const [notes, setNotes] = useState<Note[]>([]);
  const [lists, setLists] = useState<CompanyList[]>([]);
  const [enrichmentData, setEnrichmentData] = useState<EnrichmentData | null>(null);
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichError, setEnrichError] = useState('');
  const [showBookmarkPopup, setShowBookmarkPopup] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);

  useEffect(() => {
    if (company) {
      const savedNotes = localStorage.getItem(`notes-${company.id}`);
      if (savedNotes) setNotes(JSON.parse(savedNotes));

      const savedLists = localStorage.getItem('lists');
      if (savedLists) setLists(JSON.parse(savedLists));

      const savedEnrichment = localStorage.getItem(`enrichment-${company.id}`);
      if (savedEnrichment) setEnrichmentData(JSON.parse(savedEnrichment));
    }
  }, [company]);

  const handleAddNote = (text: string) => {
    if (!company) return;
    const newNote: Note = {
      id: Date.now().toString(),
      text,
      createdAt: new Date().toISOString(),
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem(`notes-${company.id}`, JSON.stringify(updatedNotes));
  };

  const handleDeleteNote = (id: string) => {
    if (!company) return;
    const updatedNotes = notes.filter((n) => n.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem(`notes-${company.id}`, JSON.stringify(updatedNotes));
  };

  const handleAddToList = (listId: string) => {
    if (!company) return;

    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        if (list.companyIds.includes(company.id)) {
          // Remove from list
          return { ...list, companyIds: list.companyIds.filter((id) => id !== company.id) };
        } else {
          // Add to list
          return { ...list, companyIds: [...list.companyIds, company.id] };
        }
      }
      return list;
    });

    setLists(updatedLists);
    localStorage.setItem('lists', JSON.stringify(updatedLists));
  };

  const handleEnrich = async () => {
    if (!company) return;

    setIsEnriching(true);
    setEnrichError('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/enrich`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website: company.website }),
      });

      if (!response.ok) {
        throw new Error(`Enrichment failed: ${response.statusText}`);
      }

      const data = await response.json();
      setEnrichmentData(data);
      localStorage.setItem(`enrichment-${company.id}`, JSON.stringify(data));
    } catch (error) {
      setEnrichError(error instanceof Error ? error.message : 'Enrichment failed');
    } finally {
      setIsEnriching(false);
    }
  };

  const isCompanyBookmarked = lists.some((list) => list.companyIds.includes(company?.id || ''));

  if (!company) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Company Not Found</h1>
          <Link href="/companies" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
            Back to Companies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Link href="/companies" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4 inline-block">
        ← Back to Companies
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 relative">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{company.name}</h1>
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              {company.website}
            </a>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleEnrich}
              disabled={isEnriching}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isEnriching ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Enriching...</span>
                </>
              ) : (
                'Enrich'
              )}
            </button>
            <button
              onClick={() => setShowBookmarkPopup(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Save to list"
            >
              <svg
                className={`w-7 h-7 ${isCompanyBookmarked ? 'fill-current text-blue-600 dark:text-blue-400' : 'stroke-current text-gray-700 dark:text-gray-300'}`}
                fill={isCompanyBookmarked ? 'currentColor' : 'none'}
                stroke={isCompanyBookmarked ? 'none' : 'currentColor'}
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sector</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{company.sector}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Stage</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{company.stage}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{company.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Funding Raised</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{company.fundingRaised}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Employee Count</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{company.employeeCount}</p>
          </div>
        </div>

        {company.description && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Description</p>
            <p className="text-gray-900 dark:text-white">{company.description}</p>
          </div>
        )}

        {/* Pencil icon for notes at bottom right */}
        <button
          onClick={() => setShowNotesModal(true)}
          className="absolute bottom-4 right-4 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="View notes"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          {notes.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notes.length}
            </span>
          )}
        </button>
      </div>

      {enrichError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-700 dark:text-red-400">{enrichError}</p>
        </div>
      )}

      {enrichmentData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Enrichment Data</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last enriched: {new Date(enrichmentData.enrichedAt).toLocaleString()}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Summary</h3>
            <p className="text-gray-900 dark:text-white">{enrichmentData.summary}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">What They Do</h3>
            <ul className="list-disc list-inside space-y-1">
              {enrichmentData.whatTheyDo.map((item, i) => (
                <li key={i} className="text-gray-900 dark:text-white">{item}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {enrichmentData.keywords.map((keyword, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Signals</h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <ul className="space-y-2">
                {enrichmentData.signals.map((signal, i) => (
                  <li key={i} className="text-gray-900 dark:text-white">• {signal}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sources</h3>
            <ul className="space-y-2">
              {enrichmentData.sources.map((source, i) => (
                <li key={i} className="text-sm">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    {source.url}
                  </a>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">
                    ({new Date(source.timestamp).toLocaleString()})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Bookmark Popup */}
      <BookmarkPopup
        isOpen={showBookmarkPopup}
        onClose={() => setShowBookmarkPopup(false)}
        lists={lists}
        companyId={company.id}
        onAddToList={handleAddToList}
        onCreateList={() => router.push('/lists')}
      />

      {/* Notes Modal */}
      <NotesModal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        notes={notes}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
        companyName={company.name}
      />
    </div>
  );
}
