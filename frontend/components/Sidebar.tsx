'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const links = [
    { href: '/companies', label: 'Companies', icon: '🏢' },
    { href: '/lists', label: 'Lists', icon: '📋' },
  ];

  const shouldShowExpanded = isExpanded || isHovering;

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
          shouldShowExpanded ? 'w-64' : 'w-0'
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className={`${shouldShowExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 h-full flex flex-col`}>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white whitespace-nowrap">VC Discovery</h1>
          </div>
          <nav className="px-3 flex-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors whitespace-nowrap ${
                  pathname.startsWith(link.href)
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-6 space-y-3">
            <ThemeToggle />
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
              aria-label="Toggle sidebar"
            >
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Toggle Menu</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
