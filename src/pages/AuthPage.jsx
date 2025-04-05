import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { InputField } from '../components/InputField.jsx'; // Assuming InputField is default or named export
import { Button } from '../components/Button.jsx'; // Assuming Button is default or named export

/**
 * AuthPage Component
 *
 * Serves as the primary user interface for both user authentication (Login)
 * and registration (Sign Up). It manages local form state, interacts with the
 * global AuthContext to perform authentication actions, displays feedback
 * (loading states, errors), and handles redirection upon successful authentication.
 */
function AuthPage() {
  // --- State Hooks ---
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null); // For client-side validation errors

  // --- Context and Routing Hooks ---
  const { login, signup, loading, error: authError, user } = useAuth(); // Get state/actions from AuthContext
  const navigate = useNavigate();
  const location = useLocation();

  // --- Redirection Effect ---
  // Redirects the user if they are already authenticated when visiting this page,
  // or after a successful login/signup.
  useEffect(() => {
    if (user) {
      // Determine where to redirect the user.
      // Priority: Location state 'from' (page user tried to access before auth).
      // Fallback: Dashboard root '/'.
      const fromPathname = location.state?.from?.pathname;
      const redirectTo = fromPathname && fromPathname !== '/auth' ? fromPathname : '/';
      console.log(`AuthPage: User authenticated, redirecting to ${redirectTo}`);
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, location]); // Re-run if user state, navigate, or location changes

  // --- Form Submission Handler ---
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault(); // Prevent standard form submission
      setLocalError(null); // Clear previous local errors

      // Basic client-side validation
      if (!email || email.trim() === '') {
        setLocalError('Email address is required.');
        return;
      }
      if (!password || password.trim() === '') {
        setLocalError('Password is required.');
        return;
      }
      // More specific email validation could be added here if needed

      try {
        // Call the appropriate action from AuthContext based on the current mode
        if (mode === 'login') {
          console.log('AuthPage: Attempting login...');
          await login({ email, password });
          // AuthContext handles setting loading/error state.
          // Redirection is handled by the useEffect hook observing the 'user' state change.
        } else {
          console.log('AuthPage: Attempting sign up...');
          const result = await signup({ email, password });
          // Handle potential immediate errors from signup (e.g., validation)
          if (!result.error && result.data?.user) {
             // Although redirection is handled by useEffect, you might want immediate feedback
             console.log('Sign up possibly successful, awaiting confirmation or auto-login.');
             // Consider showing a confirmation message if email verification is needed.
          } else if (!result.error && !result.data?.user && !result.data?.session) {
            // This case might occur if email confirmation is required.
             console.log('Sign up successful, please check your email for confirmation.');
             // Optionally display a message to the user here.
          }
          // Redirection on successful auto-login after signup is handled by useEffect.
        }
      } catch (err) {
        // Catch unexpected errors during the async call (though AuthContext aims to catch these)
        console.error(`AuthPage: Unexpected error during ${mode}:`, err);
        setLocalError(
          `An unexpected error occurred. Please try again. Details: ${err instanceof Error ? err.message : 'Unknown error'}`,
        );
      }
    },
    [mode, email, password, login, signup], // Include dependencies
  );

  // --- Mode Toggling Handler ---
  const toggleMode = useCallback(() => {
    setMode((prevMode) => (prevMode === 'login' ? 'signup' : 'login'));
    // Reset form state and errors when switching modes for better UX
    setEmail('');
    setPassword('');
    setLocalError(null);
    // Note: AuthContext error is not cleared here, allowing users to see previous auth attempt errors
    // If clearing AuthContext error is desired, it would need an explicit action in the context.
  }, []); // No dependencies needed as it only uses setter functions

  // Determine button text based on mode and loading state
  const getButtonText = () => {
    if (loading) {
      return mode === 'login' ? 'Logging in...' : 'Signing up...';
    }
    return mode === 'login' ? 'Login' : 'Sign Up';
  };

  // --- Render Logic ---
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-12 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {/* Display Combined Error Messages */}
          {(authError || localError) && (
            <div
              className="rounded-md border border-red-400 bg-red-50 p-4 dark:border-red-600 dark:bg-red-900/30"
              role="alert"
            >
              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                {localError || authError?.message || 'An error occurred.'}
              </p>
            </div>
          )}

          {/* Email Input */}
          <InputField
            id="email"
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            disabled={loading}
            className="mb-4" // Example spacing
          />

          {/* Password Input */}
          <InputField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            disabled={loading}
            className="mb-6" // Example spacing
          />

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full" // Example: Make button full width
              aria-live="polite" // Announce loading state changes
            >
              {getButtonText()}
            </Button>
          </div>
        </form>

        {/* Mode Toggle Text/Link */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {mode === 'login'
            ? "Don't have an account?"
            : 'Already have an account?'}
          <span // Using span with button role for accessibility if not using Link
            onClick={!loading ? toggleMode : undefined} // Prevent toggle while loading
            onKeyDown={
              !loading
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') toggleMode();
                  }
                : undefined
            }
            role="button"
            tabIndex={0} // Make it focusable
            className={`ml-1 font-medium ${
              loading
                ? 'cursor-not-allowed text-indigo-300 dark:text-indigo-700'
                : 'cursor-pointer text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
            aria-disabled={loading}
          >
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;