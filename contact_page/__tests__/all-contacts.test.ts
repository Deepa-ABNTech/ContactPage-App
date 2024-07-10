import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '@/app/all-contacts/page';
import { fetchApi } from '@/app/utils/api';

// Mock the API call
jest.mock('@/app/utils/api', () => ({
  fetchApi: jest.fn(),
}));

// Mock the Layout component
jest.mock('@/app/components/Layout', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => children),
}));

describe('Page Component', () => {
  beforeEach(() => {
    (fetchApi as jest.Mock).mockClear();
  });

  it('renders the page with initial elements', async () => {
    (fetchApi as jest.Mock).mockResolvedValue([]);
    render(Page() as React.ReactElement);

    expect(screen.getByPlaceholderText('Search by ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search Contact' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New Contact' })).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});