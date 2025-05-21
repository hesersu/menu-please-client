import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SignUpForm } from './sign-up-form'; // Assuming sign-up-form.jsx
import axios from 'axios';
import { toast as sonnerToast } from 'sonner';

// Mock axios
vi.mock('axios');

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderSignUpForm = () => {
  return render(
    <MemoryRouter>
      <SignUpForm />
    </MemoryRouter>
  );
};

describe('SignUpForm component', () => {
  const VITE_API_URL = 'http://localhost:5005'; // Define for use in tests

  beforeEach(() => {
    // Mock import.meta.env for each test
    vi.stubEnv('VITE_API_URL', VITE_API_URL);

    // Reset mocks before each test
    mockNavigate.mockClear();
    axios.post.mockReset(); // Use mockReset to clear calls and reset implementation
    sonnerToast.error.mockClear();
    sonnerToast.success.mockClear();
  });

  it('renders all form fields and submit button', () => {
    renderSignUpForm();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument(); // Exact match for "Password"
    // No "Confirm Password" field in the actual component
    expect(screen.getByRole('button', { name: /Sign-up/i })).toBeInTheDocument(); // Button text is "Sign-up"
  });

  it('successfully signs up a user and navigates to login', async () => {
    axios.post.mockResolvedValue({ data: { message: 'User created successfully' } });

    renderSignUpForm();

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'newuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    // No "Confirm Password" field
    fireEvent.click(screen.getByRole('button', { name: /Sign-up/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(`${VITE_API_URL}/auth/signup`, {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      });
    });

    // No success toast is shown in the actual component
    // await waitFor(() => {
    //   expect(sonnerToast.success).toHaveBeenCalledWith('User created successfully!');
    // });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('shows error toast on failed sign-up (e.g., email exists)', async () => {
    const errorMessage = 'Email already exists';
    axios.post.mockRejectedValue({ response: { data: { errorMessage: errorMessage } } });

    renderSignUpForm();

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'existinguser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'exists@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    // No "Confirm Password" field
    fireEvent.click(screen.getByRole('button', { name: /Sign-up/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(sonnerToast.error).toHaveBeenCalledWith(errorMessage);
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // Password mismatch test is removed as there's no confirm password field.

  // Helper for required field tests
  const testRequiredField = async (fieldToLeaveEmptyLabel) => {
    renderSignUpForm();
    
    const fields = {
      username: { label: /Username/i, value: 'testuser' },
      email: { label: /Email/i, value: 'test@example.com' },
      password: { label: /^Password$/i, value: 'password123' },
    };

    // Fill all fields except the one we want to test for required validation
    for (const key in fields) {
      if (fields[key].label.toString() !== fieldToLeaveEmptyLabel.toString()) {
        fireEvent.change(screen.getByLabelText(fields[key].label), { target: { value: fields[key].value } });
      }
    }
    
    // Attempt to submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign-up/i }));
    
    const inputField = screen.getByLabelText(fieldToLeaveEmptyLabel);
    // For HTML5 'required' validation, the browser typically prevents form submission.
    // We expect that the input field is invalid and axios.post (our API call) was not made.
    expect(inputField.checkValidity()).toBe(false); 
    expect(axios.post).not.toHaveBeenCalled();
  };

  it('username input is marked as invalid if submitted empty', async () => {
    await testRequiredField(/Username/i);
  });
  it('email input is marked as invalid if submitted empty', async () => {
    await testRequiredField(/Email/i);
  });
  it('password input is marked as invalid if submitted empty', async () => {
    await testRequiredField(/^Password$/i);
  });
});
