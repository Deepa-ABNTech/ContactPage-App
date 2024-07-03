// new-contact/page.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import { fetchApi } from '../utils/api';

export default function CreateContact() {
  const router = useRouter();
  const [contact, setContact] = useState({
    id: '',
    FirstName: '',
    LastName: '',
    Email: '',
    Phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Convert id to an integer before sending it to the backend
      const contactToSend = {
        ...contact,
        id: contact.id ? parseInt(contact.id, 10) : undefined,
      };

      const newContact = await fetchApi('/contact', {
        method: 'POST',
        body: JSON.stringify(contactToSend),
      });
      console.log('New contact created:', newContact);
      router.push('/all-contacts');
    } catch (error) {
      console.error('Create contact error:', error);
      setError(error instanceof Error ? error.message : 'Error creating contact. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Create New Contact</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">ID</label>
            <input
              type="text"
              id="id"
              name="id"
              value={contact.id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              id="FirstName"
              name="FirstName"
              value={contact.FirstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="LastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              id="LastName"
              name="LastName"
              value={contact.LastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={contact.Email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              id="Phone"
              name="Phone"
              value={contact.Phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Contact'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
