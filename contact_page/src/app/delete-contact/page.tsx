'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import { fetchApi } from '../utils/api';

export default function DeleteContact() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [contact, setContact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const handleFetchContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchApi(`/contact/${id}`);
      setContact(data);
    } catch (error) {
      setError('Error fetching contact. Please check the ID and try again.');
      setContact(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError('');
    try {
      await fetchApi(`/contact/${id}`, {
        method: 'DELETE',
      });
      router.push('/all-contacts');
    } catch (error) {
      setError('Error deleting contact. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Delete Contact</h1>
        <form onSubmit={handleFetchContact} className="mb-6">
          <div className="flex items-center">
            <input
              type="text"
              value={id}
              onChange={handleIdChange}
              placeholder="Enter Contact ID"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Delete Contact
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {isLoading ? (
          <p>Loading...</p>
        ) : contact ? (
          <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
            <p className="mb-4">Are you sure you want to delete the following contact?</p>
            <div className="mb-2"><strong>Name:</strong> {contact.FirstName} {contact.LastName}</div>
            <div className="mb-2"><strong>Email:</strong> {contact.Email}</div>
            <div className="mb-4"><strong>Phone:</strong> {contact.Phone}</div>
            <div className="flex justify-end space-x-4">
              <button onClick={() => router.push('/all-contacts')} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Delete Contact
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}