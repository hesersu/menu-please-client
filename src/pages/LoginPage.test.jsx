import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage'; // Corrected import

// Mock child components
vi.mock('@/components/animatedHeader', () => ({
  AnimatedHeader: ({ title }) => <div data-testid="animated-header">{title}</div>,
}));

vi.mock('@/components/login-form', () => ({
  LoginForm: () => <div data-testid="login-form">Mocked LoginForm</div>,
}));

describe('LoginPage component', () => {
  it('renders AnimatedHeader with correct title and LoginForm', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Check for AnimatedHeader
    const header = screen.getByTestId('animated-header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('Welcome!');

    // Check for LoginForm
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByText('Mocked LoginForm')).toBeInTheDocument();
  });
});
