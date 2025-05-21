import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginForm } from './login-form'; // Changed import
import { AuthContext } from '../contexts/authContext';
import axios from 'axios';
import { toast as sonnerToast } from 'sonner'; // Import sonner

// Mock axios
vi.mock('axios');

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(), // Add if success toasts are used
  },
}));

// Mock AuthContext
const mockAuthenticateUser = vi.fn();
const mockNavigate = vi.fn();

// Mock react-router-dom's useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: actual.Link, // Ensure Link is not doubly mocked if MemoryRouter needs it
  };
});

const renderLoginForm = (authContextValue) => {
  return render(
    <AuthContext.Provider value={authContextValue}>
      <MemoryRouter>
        <LoginForm /> 
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('LoginForm component', () => {
  const VITE_API_URL = 'http://localhost:5005'; // Define for use in tests

  beforeEach(() => {
    // Mock import.meta.env for each test
    vi.stubEnv('VITE_API_URL', VITE_API_URL);

    // Reset mocks before each test
    mockAuthenticateUser.mockClear();
    mockNavigate.mockClear();
    axios.post.mockClear();
    // vi.clearAllMocks(); // This was too broad, clear specific mocks if needed or rely on vi.resetAllMocks() in vitest.config
    sonnerToast.error.mockClear(); 
    sonnerToast.success.mockClear();
  });

  it('renders email and password fields, login button, and sign-up link', () => {
    renderLoginForm({ authenticateUser: mockAuthenticateUser });

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    // The button text includes an icon, so we use a matcher.
    expect(screen.getByRole('button', { name: /Log-in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Sign up/i })).toBeInTheDocument();
  });

  it('calls authenticateUser and navigates on successful form submission', async () => {
    axios.post.mockResolvedValue({ data: { authToken: 'fake-token' } });
    
    renderLoginForm({ authenticateUser: mockAuthenticateUser });

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Log-in/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(`${VITE_API_URL}/auth/login`, {
        email: 'test@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(mockAuthenticateUser).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows error message via toast on failed login', async () => {
    const errorMessage = 'Invalid credentials';
    axios.post.mockRejectedValue({
      response: { data: { errorMessage: errorMessage } },
    });

    renderLoginForm({ authenticateUser: mockAuthenticateUser });

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Log-in/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(`${VITE_API_URL}/auth/login`, {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      });
    });
    
    // Check if sonner's toast.error was called
    await waitFor(() => {
      expect(sonnerToast.error).toHaveBeenCalledWith(errorMessage);
    });

    // Also check if the internal errorMessage state is set, if it's used to display error in component
    // (In this LoginForm, it seems it sets `errorMessage` state, but doesn't display it directly, relies on toast)
    // expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument(); // This might not be present if only toast is used

    expect(mockAuthenticateUser).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // HTML5 'required' attribute handles empty field validation by preventing submission.
  // Testing this behavior with @testing-library can be tricky as it doesn't fully simulate browser form submission prevention.
  // We can check if the input field is marked as invalid.
  it('email input is marked as invalid if submitted empty (HTML5 validation)', async () => {
    renderLoginForm({ authenticateUser: mockAuthenticateUser });

    const emailInput = screen.getByLabelText(/Email/i);
    const loginButton = screen.getByRole('button', { name: /Log-in/i });

    // Password is not empty, email is
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    
    // Attempt to submit
    fireEvent.click(loginButton);

    await waitFor(() => {
        // For HTML5 validation, the form submission might be blocked by the browser.
        // We check if the input field is considered invalid by the browser's validation API.
        // JSDOM has some limitations here. A more robust test might involve `checkValidity()`.
        // For now, we'll assert that axios.post was not called, implying submission was blocked or handled.
        expect(emailInput.checkValidity()).toBe(false); // Check HTML5 constraint validation
    });
    
    expect(axios.post).not.toHaveBeenCalled();
    expect(mockAuthenticateUser).not.toHaveBeenCalled();
  });

  it('password input is marked as invalid if submitted empty (HTML5 validation)', async () => {
    renderLoginForm({ authenticateUser: mockAuthenticateUser });

    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Log-in/i });

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
        expect(passwordInput.checkValidity()).toBe(false);
    });

    expect(axios.post).not.toHaveBeenCalled();
    expect(mockAuthenticateUser).not.toHaveBeenCalled();
  });
});
