import React from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateContact from "@/app/all-contacts/new-contact/page";
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe('CreateContact component', () => {
  test('validates email address input field in New Contact pop-up', async () => {
    const CreateContactComponent= await CreateContact()
    render(CreateContactComponent);
   
    // Click on "Create New Contact" button to open the pop-up
    fireEvent.click(screen.getByText('Create New Contact'));
   
    // Wait for the pop-up to appear and the email input to become available
    const emailInput = await screen.findByLabelText('Email');
   
    // Debugging: Log the found email input element
    console.log('Email Input:', emailInput);
   
    // Enter an invalid email address
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
   
    // Assert that the validation message appears
    expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
   
    // Clear the input field
    fireEvent.change(emailInput, { target: { value: '' } });
   
    // Enter a valid email address
    fireEvent.change(emailInput, { target: { value: 'valid.email@example.com' } });
   
    // Assert that the validation message disappears
    await waitFor(() => {
      expect(screen.queryByText(/Please enter a valid email address/i)).not.toBeInTheDocument();
    });
  });
});
