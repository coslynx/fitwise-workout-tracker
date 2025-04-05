import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { supabase } from '../services/supabaseClient.js';
import {
  signUp as authServiceSignUp,
  signInWithPassword as authServiceSignIn,
  signOut as authServiceSignOut,
} from '../services/authService.js';

/**
 * @typedef {import('@supabase/supabase-js').Session} Session
 * @typedef {import('@supabase/supabase-js').User} User
 * @typedef {import('@supabase/supabase-js').AuthError} AuthError
 */

/**
 * @typedef {object} AuthContextValue
 * @property {Session | null} session - The current Supabase session object, or null if not authenticated.
 * @property {User | null} user - The current Supabase user object, derived from the session, or null if not authenticated.
 * @property {(credentials: {email: string, password: string}) => Promise<{ data: { user: User | null; session: Session | null; } | null; error: AuthError | Error | null; }>} login - Function to log in a user.
 * @property {(credentials: {email: string, password: string}) => Promise<{ data: { user: User | null; session: Session | null; } | null; error: AuthError | Error | null; }>} signup - Function to sign up a new user.
 * @property {() => Promise<{ error: AuthError | Error | null; }>} logout - Function to log out the current user.
 * @property {boolean} loading - Indicates if an authentication operation or initial state check is in progress.
 * @property {AuthError | Error | null} error - Stores the last error encountered during an authentication operation.
 */

/**
 * Authentication Context
 *
 * Provides global access to authentication state (session, user, loading status, errors)
 * and actions (login, signup, logout) throughout the application.
 * @type {React.Context<AuthContextValue | null>}
 */
const AuthContext = createContext(null);

/**
 * Authentication Provider Component
 *
 * Manages the authentication state using Supabase and provides the AuthContext
 * value to its children. It handles session persistence and real-time updates
 * via Supabase's `onAuthStateChange` listener.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The child components to wrap with the provider.
 * @returns {React.ReactElement} The AuthProvider component.
 */
export function AuthProvider({ children }) {
  /** @type {[Session | null, React.Dispatch<React.SetStateAction<Session | null>>]} */
  const [session, setSession] = useState(null);
  /** @type {[User | null, React.Dispatch<React.SetStateAction<User | null>>]} */
  const [user, setUser] = useState(null);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [loading, setLoading] = useState(true); // Start as true for initial check
  /** @type {[AuthError | Error | null, React.Dispatch<React.SetStateAction<AuthError | Error | null>>]} */
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component

    // Function to get the current session and update state
    const getInitialSession = async () => {
      try {
        // setLoading(true); // Already true initially
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (!isMounted) return; // Don't update if component unmounted

        if (sessionError) {
          console.error('Error getting initial session:', sessionError);
          setError(sessionError);
        } else {
          setSession(sessionData?.session ?? null);
          setUser(sessionData?.session?.user ?? null);
        }
      } catch (catchError) {
        if (!isMounted) return;
        console.error('Unexpected error getting initial session:', catchError);
        setError(
          catchError instanceof Error
            ? catchError
            : new Error('Failed to get initial session'),
        );
      } finally {
        if (isMounted) {
          setLoading(false); // End initial loading state
        }
      }
    };

    // Get initial session immediately on mount
    getInitialSession();

    // Subscribe to Supabase auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return; // Don't update if component unmounted

      // Update state based on the new session from the listener
      setSession(newSession ?? null);
      setUser(newSession?.user ?? null);
      setError(null); // Clear previous errors on auth state change
      // Keep loading false after initial check, unless an action sets it true
      if (loading) {
        setLoading(false);
      }
    });

    // Cleanup function: Unsubscribe from the listener when the component unmounts
    return () => {
      isMounted = false;
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Logs in a user with email and password.
   * @param {{email: string, password: string}} credentials - User login credentials.
   * @returns {Promise<{ data: { user: User | null; session: Session | null; } | null; error: AuthError | Error | null; }>} Result from authService.
   */
  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authServiceSignIn({ email, password });
      if (result.error) {
        setError(result.error);
      }
      // Session/user state update is handled by onAuthStateChange listener
      return result;
    } catch (catchError) {
      console.error('Context Login Error:', catchError);
      const loginError =
        catchError instanceof Error
          ? catchError
          : new Error('An unexpected error occurred during login.');
      setError(loginError);
      return { data: null, error: loginError };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Signs up a new user with email and password.
   * @param {{email: string, password: string}} credentials - User signup credentials.
   * @returns {Promise<{ data: { user: User | null; session: Session | null; } | null; error: AuthError | Error | null; }>} Result from authService.
   */
  const signup = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authServiceSignUp({ email, password });
      if (result.error) {
        setError(result.error);
      }
      // Session/user state update (if immediate login occurs) is handled by onAuthStateChange
      // Often requires email confirmation, so user/session might not appear immediately.
      return result;
    } catch (catchError) {
      console.error('Context Signup Error:', catchError);
      const signupError =
        catchError instanceof Error
          ? catchError
          : new Error('An unexpected error occurred during sign up.');
      setError(signupError);
      return { data: null, error: signupError };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logs out the currently authenticated user.
   * @returns {Promise<{ error: AuthError | Error | null; }>} Result from authService.
   */
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await authServiceSignOut();
      if (result.error) {
        setError(result.error);
      }
      // Session/user state update (to null) is handled by onAuthStateChange listener
      return result;
    } catch (catchError) {
      console.error('Context Logout Error:', catchError);
      const logoutError =
        catchError instanceof Error
          ? catchError
          : new Error('An unexpected error occurred during logout.');
      setError(logoutError);
      return { error: logoutError };
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoize the context value to prevent unnecessary re-renders of consumers
  // The value includes the state and the memoized action functions.
  /** @type {AuthContextValue} */
  const value = useMemo(
    () => ({
      session,
      user,
      login,
      signup,
      logout,
      loading,
      error,
    }),
    [session, user, login, signup, logout, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom Hook for Consuming Auth Context
 *
 * Provides a convenient way to access the AuthContext value.
 * Throws an error if used outside of an AuthProvider context.
 *
 * @returns {AuthContextValue} The authentication context value.
 * @throws {Error} If used outside of an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};