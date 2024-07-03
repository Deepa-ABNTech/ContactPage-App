'use client';

import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { fetchApi } from '../utils/api';

export default function Page() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchContacts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetchApi('/contact');
      setContacts(response);
    } catch (error) {
      console.error('Fetch contacts error:', error);
      setError('Error fetching contacts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">All Contacts</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4">
            <div className="flex flex-wrap -mx-4">
              <div className="w-1/5 px-4 py-2">
                <span className="font-semibold">Id</span>
              </div>
              <div className="w-1/5 px-4 py-2">
                <span className="font-semibold">First Name</span>
              </div>
              <div className="w-1/5 px-4 py-2">
                <span className="font-semibold">Last Name</span>
              </div>
              <div className="w-1/5 px-4 py-2">
                <span className="font-semibold">Email</span>
              </div>
              <div className="w-1/5 px-4 py-2">
                <span className="font-semibold">Phone Number</span>
              </div>
            </div>
            {contacts.map((contact: any) => (
              <div key={contact.id} className="flex flex-wrap -mx-4 border-t">
                <div className="w-1/5 px-4 py-2">{contact.id}</div>
                <div className="w-1/5 px-4 py-2">{contact.FirstName}</div>
                <div className="w-1/5 px-4 py-2">{contact.LastName}</div>
                <div className="w-1/5 px-4 py-2">{contact.Email}</div>
                <div className="w-1/5 px-4 py-2">{contact.Phone}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
