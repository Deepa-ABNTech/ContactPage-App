'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import { fetchApi } from '../utils/api';

export default function UpdateContact() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [propertyValue, setPropertyValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const encodedPropertyName = encodeURIComponent(propertyName);
      const encodedPropertyValue = encodeURIComponent(propertyValue);
      console.log('Sending update request:', id, encodedPropertyName, encodedPropertyValue);
      const updatedContact = await fetchApi(`/contact/${id}?property_name=${encodedPropertyName}&property_value=${encodedPropertyValue}`, {
        method: 'PUT',
        credentials: 'include',
      });
      console.log('Updated contact:', updatedContact);
      setSuccess('Contact updated successfully!');
      setTimeout(() => {
        router.push('/all-contacts');
      }, 2000);
    } catch (error) {
      console.error('Update error:', error);
      setError(error instanceof Error ? error.message : 'Error updating contact. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Update Contact</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleUpdate} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">Contact ID</label>
            <input
              type="text"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="propertyName" className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
            <input
              type="text"
              id="propertyName"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="propertyValue" className="block text-sm font-medium text-gray-700 mb-1">Property Value</label>
            <input
              type="text"
              id="propertyValue"
              value={propertyValue}
              onChange={(e) => setPropertyValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Contact'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}