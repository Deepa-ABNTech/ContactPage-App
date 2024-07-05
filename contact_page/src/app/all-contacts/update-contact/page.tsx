'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import { fetchApi } from '../utils/api';

export default function UpdateContact() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [contact, setContact] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchContact = async () => {
  if (!id) return; // Exit if no ID is available

  setIsLoading(true);
  setError('');
  try {
    const response = await fetchApi(`/api/contact/${id}`);
    setContact(response);
    setFirstName(response.FirstName);
    setLastName(response.LastName);
    setEmail(response.Email);
    setPhone(response.Phone);
  } catch (error) {
    console.error('Error fetching contact:', error);
    setError('Error fetching contact details. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

    if (id) {
      fetchContact();
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const updatedContact = await fetchApi(`/contact/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          Phone: phone,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSuccess('Contact updated successfully!');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      setError('Error updating contact. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Update Contact</h1>
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleUpdate} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
