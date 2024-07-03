import React from 'react';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-100 h-screen p-4">
      <Link href="/new-contact" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-start mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          New contact
        </Link>
        <nav className="mt-4">
          <ul className="space-y-2">
            <li>
              <Link href="/all-contacts" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded">
                All contacts
              </Link>
            </li>
            <li>
              <Link href="/search-contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded">
                search contacts
              </Link>
            </li>
            <li>
              <Link href="/update-contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded">
                update contact
              </Link>
            </li>
            <li>
              <Link href="/delete-contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded">
                Delete contact
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}