import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from './navbar'; // Corrected import name
import { AuthContext } from '../contexts/authContext'; // Import AuthContext

// Mock DarkModeToggle as it's a separate component and not the focus of this test
vi.mock('@/components/darkmode-toggle', () => ({
  DarkModeToggle: () => <button data-testid="darkmode-toggle">Toggle Dark Mode</button>
}));

describe('Navbar component', () => {
  // Helper function to render the Navbar with AuthContext and MemoryRouter
  const renderNavbar = (authContextValue = { isLoggedIn: false, handleLogout: vi.fn(), currentUser: null }) => {
    return render(
      <AuthContext.Provider value={authContextValue}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  describe('When user is logged out', () => {
    it('renders the logo, a changing phrase, and login button', () => {
      renderNavbar();
      // Check for logo
      expect(screen.getByAltText(/Menu, please! Logo/i)).toBeInTheDocument();

      // Check for one of the menu phrases (initial or after some time)
      // This test might be a bit broad due to the rotating phrases.
      // We expect at least one of the phrases to be present.
      const phrases = ["Menu, please!", "メニューをお願いします", "메뉴 주세요", "请给我菜单"];
      const phraseElements = phrases.map(phrase => screen.queryByText(phrase));
      expect(phraseElements.some(el => el !== null)).toBe(true);

      // Check for login button
      expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();
      
      // Check for DarkModeToggle mock
      expect(screen.getByTestId('darkmode-toggle')).toBeInTheDocument();
    });
  });

  describe('When user is logged in', () => {
    const mockUser = {
      username: 'testuser',
      profileImage: 'test-image.jpg',
    };
    const authContextLoggedInValue = {
      isLoggedIn: true,
      handleLogout: vi.fn(),
      currentUser: mockUser,
    };

    it('renders the logo, menu trigger, and user info in sheet', () => {
      renderNavbar(authContextLoggedInValue);
      // Check for logo
      expect(screen.getByAltText(/Menu, please! Logo/i)).toBeInTheDocument();

      // Check for menu trigger button (hamburger icon) by its aria-expanded state
      // The ShadCN SheetTrigger button has aria-expanded="false" when closed
      const menuTrigger = screen.getByRole('button', { 'aria-expanded': 'false' });
      expect(menuTrigger).toBeInTheDocument();
    });

    it('opens the sheet and shows navigation links, user info, and logout button', async () => {
      renderNavbar(authContextLoggedInValue);
      
      // Click the menu trigger button by its aria-expanded state
      const menuTrigger = screen.getByRole('button', { 'aria-expanded': 'false' });
      fireEvent.click(menuTrigger);

      // Wait for sheet content to be visible (SheetContent might take time to appear)
      // Check for elements within the SheetContent
      expect(await screen.findByText(`Welcome, ${mockUser.username}!`)).toBeInTheDocument();
      
      // Check for AvatarFallback because AvatarImage might not load in test env
      // The fallback should show the first letter of the username.
      expect(screen.getByText(mockUser.username.charAt(0))).toBeInTheDocument();
      
      expect(screen.getByRole('link', { name: /Translate Menu/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Menu history/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
      
      // Check for DarkModeToggle mock inside the sheet
      expect(screen.getByTestId('darkmode-toggle')).toBeInTheDocument();
    });

    it('calls handleLogout when logout button is clicked', async () => {
      const handleLogoutMock = vi.fn();
      renderNavbar({ ...authContextLoggedInValue, handleLogout: handleLogoutMock });

      const menuTrigger = screen.getByRole('button', { 'aria-expanded': 'false' });
      fireEvent.click(menuTrigger);

      const logoutButton = await screen.findByRole('button', { name: /Logout/i });
      fireEvent.click(logoutButton);

      expect(handleLogoutMock).toHaveBeenCalledTimes(1);
    });
  });
});
