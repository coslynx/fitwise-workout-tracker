import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AuthPage from '../pages/AuthPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import ProgressPage from '../pages/ProgressPage.jsx';
import { useAuth } from '../context/AuthContext.jsx'; // Assuming AuthContext exports useAuth

/**
 * RequireAuth Component
 *
 * A wrapper component used to protect routes that require user authentication.
 * It checks the authentication status using the `useAuth` hook.
 * - If the user is authenticated, it renders the child components.
 * - If the user is not authenticated, it redirects them to the login page (`/auth`),
 *   preserving the location they were trying to access.
 * - If the authentication status is loading, it displays a loading indicator.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The child components to render if authenticated.
 * @returns {React.ReactElement | null} The child components, a redirect, or a loading indicator.
 */
function RequireAuth({ children }) {
  const { user, loading } = useAuth(); // Use 'user' existence as the primary auth check
  const location = useLocation();

  if (loading) {
    // Display a simple loading indicator while checking auth status
    // Consistent styling with App.jsx background/text colors
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Loading authentication status...
        </p>
      </div>
    );
  }

  if (!user) {
    // User is not authenticated, redirect them to the /auth page.
    // Pass the current location in state `from` so after login,
    // the user can be redirected back to the page they originally tried to access.
    // `replace` prevents adding the login route to the history stack.
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // User is authenticated, render the child components passed to RequireAuth.
  return children;
}

/**
 * AppRouter Component
 *
 * Defines the main client-side routes for the application using React Router.
 * It maps URL paths to specific page components and utilizes the `RequireAuth`
 * component to protect routes that necessitate user authentication.
 *
 * Includes routes for authentication, the main dashboard, progress tracking,
 * and a fallback route for handling undefined paths (404 Not Found).
 */
function AppRouter() {
  return (
    <Routes>
      {/* Public Route: Accessible regardless of authentication status */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected Routes: Require authentication */}
      {/* Dashboard route (root path) */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      {/* Progress tracking route */}
      <Route
        path="/progress"
        element={
          <RequireAuth>
            <ProgressPage />
          </RequireAuth>
        }
      />

      {/* Fallback Route: Catches any undefined paths */}
      <Route
        path="*"
        element={
          <div className="text-center p-8">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              404 - Page Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sorry, the page you are looking for does not exist.
            </p>
          </div>
        }
      />
    </Routes>
  );
}

export default AppRouter;