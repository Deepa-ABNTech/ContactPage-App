'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import { fetchApi } from '../utils/api';

export default function SearchContact() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [contact, setContact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const handleSearchContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Ensure ID is a number
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      setError('ID must be a number');
      setIsLoading(false);
      return;
    }

    try {
      const data = await fetchApi(`/contact/${numericId}`);
      setContact(data);
    } catch (error) {
      setError('Error fetching contact. Please check the ID and try again.');
      setContact(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Search Contact</h1>
        <form onSubmit={handleSearchContact} className="mb-6">
          <div className="flex items-center">
            <input
              type="text"
              value={id}
              onChange={handleIdChange}
              placeholder="Enter ID"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Search Contact
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {isLoading ? (
          <p>Loading...</p>
        ) : contact ? (
          <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
              <p>{contact.id}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <p>{contact.FirstName}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <p>{contact.LastName}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p>{contact.Email}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <p>{contact.Phone}</p>
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
