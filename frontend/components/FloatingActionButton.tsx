'use client';

import { useState, useRef } from 'react';

interface FABAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface FloatingActionButtonProps {
  mainIcon: React.ReactNode;
  actions: FABAction[];
  primaryColor?: string;
}

export default function FloatingActionButton({
  mainIcon,
  actions,
  primaryColor = 'bg-blue-600 hover:bg-blue-700',
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-40">
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Action Items */}
      <div className="flex flex-col-reverse items-end gap-3 mb-3">
        {isOpen && actions.map((action, index) => (
          <button
            key={index}
            onClick={() => {
              action.onClick();
              setIsOpen(false);
            }}
            className="group flex items-center gap-3 transition-all duration-200 transform hover:scale-105"
          >
            <span className="bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
              {action.label}
            </span>
            <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              {action.icon}
            </div>
          </button>
        ))}
      </div>

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 ${primaryColor} rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 transform ${
          isOpen ? 'rotate-45' : 'rotate-0'
        } hover:shadow-xl`}
        aria-label="Toggle actions"
      >
        {mainIcon}
      </button>
    </div>
  );
}
