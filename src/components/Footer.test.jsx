import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './footer'; // Corrected import path

describe('Footer component', () => {
  it('renders the copyright symbol', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    const copyrightElement = screen.getByText(/©/i);
    expect(copyrightElement).toBeInTheDocument();
  });
});
