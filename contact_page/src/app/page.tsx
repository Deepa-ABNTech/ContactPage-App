// app/page.tsx
import Layout from './components/Layout'; // Adjust the path as necessary
import { fetchApi } from './utils/api';

export default async function HomePage() {
  const contacts = await fetchApi('/contact');

  return (
    <Layout>
      <div></div>
    </Layout>
  );
}
