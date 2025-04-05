import React, { useContext, useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Using the exported hook
import Button from './Button.jsx';

/**
 * Header Component
 *
 * Renders the main application header, providing consistent branding, navigation,
 * and user authentication status/controls across all pages. It adapts its content
 * based on the user's authentication state retrieved from AuthContext.
 *
 * Features:
 * - Displays the application title linking to the dashboard.
 * - Shows primary navigation links (Dashboard, Progress) for authenticated users.
 * - Provides a Logout button for authenticated users.
 * - Shows a Login/Sign Up link for unauthenticated users.
 * - Disables the Logout button during the logout process.
 * - Uses Tailwind CSS for styling, consistent with the application theme.
 */
function Header() {
  // Retrieve authentication state and actions from the global AuthContext.
  // - user: Current authenticated user object (null if not logged in).
  // - logout: Async function to perform the sign-out operation.
  // - loading: Boolean indicating if an auth operation (like logout) is in progress.
  const { user, logout, loading } = useAuth();

  /**
   * Handles the logout action when the logout button is clicked.
   * Calls the `logout` function from AuthContext and handles potential errors locally
   * (though AuthContext is expected to manage the primary error state).
   */
  const handleLogout = useCallback(async () => {
    // Log initiation for debugging purposes.
    console.log('Header: Logout action initiated.');
    try {
      // Call the logout function provided by AuthContext.
      await logout();
      // Successful logout state changes (user becoming null) are handled by the
      // AuthContext's onAuthStateChange listener, triggering a re-render automatically.
      // No explicit navigation is typically needed here.
    } catch (error) {
      // Log any unexpected errors during the logout process that might not be
      // caught or handled sufficiently by AuthContext.
      console.error('Header: Error occurred during logout button click:', error);
      // Error state (e.g., displaying a message) is managed by AuthContext.
    }
  }, [logout]); // Dependency: `logout` function from context.

  /**
   * Defines the Tailwind CSS classes for navigation links (NavLink).
   * Applies different styles based on whether the link is active (matches the current URL).
   * @param {{isActive: boolean}} props - Props provided by NavLink.
   * @returns {string} The combined Tailwind classes for the NavLink.
   */
  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-md px-2 py-1 ${ // Added focus ring and padding
      isActive
        ? 'text-indigo-700 dark:text-indigo-400' // Active link styles
        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white' // Default link styles
    }`;

  return (
    // Semantic header element with styling consistent with App.jsx theme.
    // - bg-white/dark:bg-gray-800: Background colors for light/dark modes.
    // - shadow-md: Adds a subtle shadow for depth.
    // - sticky top-0 z-10: Makes the header stick to the top during scroll.
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
      {/* Navigation container with consistent padding and flex layout */}
      <nav className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Application Branding/Title */}
        {/* Links to the dashboard (root path) */}
        <Link
          to="/"
          className="text-xl font-bold text-indigo-600 dark:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded" // Added focus styles
          aria-label="Fitness Tracker Home"
        >
          Fitness Tracker
        </Link>

        {/* Navigation Links and Authentication Controls */}
        <ul className="flex items-center space-x-3 md:space-x-5"> {/* Adjusted spacing */}
          {user ? (
            // --- Render when user IS authenticated ---
            <>
              <li>
                <NavLink to="/" className={navLinkClasses} end> {/* `end` prop ensures exact match for root */}
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/progress" className={navLinkClasses}>
                  Progress
                </NavLink>
              </li>
              <li>
                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  disabled={loading} // Disable button during logout operation
                  variant="secondary" // Visually distinct from primary actions
                  size="sm" // Smaller size suitable for header
                  aria-label="Logout"
                  aria-live="polite" // Announce changes like 'Logging out...'
                >
                  {loading ? 'Logging out...' : 'Logout'}
                </Button>
              </li>
            </>
          ) : (
            // --- Render when user is NOT authenticated ---
            <>
              <li>
                {/* Link to Authentication Page */}
                <Link
                  to="/auth"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-md px-2 py-1" // Added focus styles and padding
                >
                  Login / Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

// Export the Header component for use in the main application layout (App.jsx).
export default Header;