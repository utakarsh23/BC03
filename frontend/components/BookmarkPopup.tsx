'use client';

import { useState } from 'react';
import { CompanyList } from '@/types';

interface BookmarkPopupProps {
  isOpen: boolean;
  onClose: () => void;
  lists: CompanyList[];
  companyId: string;
  onAddToList: (listId: string) => void;
  onCreateList: () => void;
}

export default function BookmarkPopup({
  isOpen,
  onClose,
  lists,
  companyId,
  onAddToList,
  onCreateList,
}: BookmarkPopupProps) {
  if (!isOpen) return null;

  const isCompanyInList = (listId: string) => {
    const list = lists.find((l) => l.id === listId);
    return list?.companyIds.includes(companyId) || false;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 w-96 max-h-96 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
            Save to list
          </h3>
        </div>

        <div className="overflow-y-auto max-h-64">
          {lists.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No lists yet</p>
              <button
                onClick={() => {
                  onCreateList();
                  onClose();
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Create your first list
              </button>
            </div>
          ) : (
            lists.map((list) => {
              const isInList = isCompanyInList(list.id);
              return (
                <button
                  key={list.id}
                  onClick={() => onAddToList(list.id)}
                  className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                      <span className="text-xl">📋</span>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white">{list.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {list.companyIds.length} {list.companyIds.length === 1 ? 'company' : 'companies'}
                      </p>
                    </div>
                  </div>
                  {isInList && (
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })
          )}
        </div>

        {lists.length > 0 && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                onCreateList();
                onClose();
              }}
              className="w-full py-2 flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create new list
            </button>
          </div>
        )}
      </div>
    </>
  );
}
