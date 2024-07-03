import React from 'react';
import Layout from './components/Layout';
import { fetchApi } from './utils/api';

export default async function Page() {
  const contacts = await fetchApi('/contact');

  return (
    <Layout>
      <h1></h1>
    </Layout>
  );
}