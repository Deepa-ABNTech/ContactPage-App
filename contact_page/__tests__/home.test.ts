import React from "react";
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from "@/app/page";

jest.mock('@/app/utils/api', () => ({
    fetchApi: jest.fn(() => Promise.resolve([]))
  }));

describe('home page',()=>{
    it('should render properly', async () =>{
        const HomePageComponent = await HomePage();
    render(HomePageComponent);
    const header = screen.getByRole('heading');
    const headerText = 'Home';
    expect(header).toHaveTextContent(headerText);
    });
});