import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Custom Hook: useRequireAuth
 *
 * Enforces authentication for protected routes within the application.
 * It leverages the global authentication state provided by `AuthContext`.
 *
 * Behavior:
 * - Retrieves the current authentication status (`user`, `loading`) from `useAuth`.
 * - Uses `useEffect` to monitor changes in authentication status and location.
 * - If the authentication status is still loading, it takes no action, waiting for the check to complete.
 * - If the status check is complete (`loading` is false) and the `user` is not present (falsy),
 *   it triggers a programmatic navigation (redirect) to the '/auth' page.
 * - The redirect preserves the original `location` the user attempted to access in the route's state (`state: { from: location }`),
 *   allowing potential redirection back after successful login.
 * - The redirect uses `{ replace: true }` to replace the current entry in the history stack,
 *   preventing the user from navigating back to the protected route via the browser's back button
 *   before authenticating.
 *
 * This hook primarily produces a side effect (navigation) and does not return any value.
 * It is intended to be called from within components that wrap protected route elements,
 * typically defined in `AppRouter.jsx`.
 *
 * @dependencies
 * - `react`: Uses `useEffect`.
 * - `react-router-dom`: Uses `useNavigate`, `useLocation`.
 * - `../context/AuthContext.jsx`: Uses `useAuth` to access auth state.
 */
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Wait until the initial authentication check is complete.
    // If loading is true, we don't yet know the definitive auth status.
    if (loading) {
      return;
    }

    // If the authentication check is complete (loading is false)
    // and there is no authenticated user, redirect to the login page.
    if (!user) {
      // Redirect to the authentication page.
      // - Pass the current location in state (`from`) so the AuthPage
      //   can redirect back after successful login.
      // - `replace: true` prevents the protected route from being added
      //   to the browser's history stack before authentication.
      navigate('/auth', { state: { from: location }, replace: true });
    }

    // If loading is false and user exists, the effect completes without action,
    // allowing the protected component to render.
  }, [user, loading, navigate, location]); // Dependencies ensure effect re-runs if auth state or location changes.

  // This hook does not need to return anything as its primary function
  // is the side effect of navigation.
}