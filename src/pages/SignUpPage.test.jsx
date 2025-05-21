import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SignUpPage } from './SignUpPage'; // Assuming SignUpPage.jsx

// Mock child components
vi.mock('@/components/animatedHeader', () => ({
  AnimatedHeader: ({ title }) => <div data-testid="animated-header">{title}</div>,
}));

vi.mock('@/components/sign-up-form', () => ({
  SignUpForm: () => <div data-testid="sign-up-form">Mocked SignUpForm</div>,
}));

describe('SignUpPage component', () => {
  it('renders AnimatedHeader with correct title and SignUpForm', () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    // Check for AnimatedHeader
    const header = screen.getByTestId('animated-header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('Welcome!'); // Corrected expected title

    // Check for SignUpForm
    expect(screen.getByTestId('sign-up-form')).toBeInTheDocument();
    expect(screen.getByText('Mocked SignUpForm')).toBeInTheDocument();
  });
});
