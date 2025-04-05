import { supabase } from './supabaseClient.js';

/**
 * @typedef {import('@supabase/supabase-js').AuthError} AuthError
 * @typedef {import('@supabase/supabase-js').User} User
 * @typedef {import('@supabase/supabase-js').Session} Session
 */

/**
 * Authentication Service Module
 *
 * Provides an abstraction layer for interacting with the Supabase authentication backend.
 * This service centralizes authentication logic (sign up, sign in, sign out),
 * making it reusable and simplifying interactions from other parts of the application,
 * primarily the AuthContext.
 * It relies on the pre-initialized Supabase client instance from './supabaseClient.js'.
 */

/**
 * Validates if the provided email and password are non-empty strings.
 *
 * @param {string | undefined | null} email - The email to validate.
 * @param {string | undefined | null} password - The password to validate.
 * @returns {boolean} - True if both email and password are valid non-empty strings, false otherwise.
 */
const validateCredentials = (email, password) => {
  return (
    email &&
    typeof email === 'string' &&
    email.trim() !== '' &&
    password &&
    typeof password === 'string' &&
    password.trim() !== ''
  );
};

/**
 * Registers a new user with Supabase using email and password.
 * Performs basic validation on credentials before attempting the Supabase call.
 *
 * @param {object} credentials - User credentials.
 * @param {string} credentials.email - The user's email address.
 * @param {string} credentials.password - The user's chosen password (must meet Supabase requirements).
 * @returns {Promise<{ data: { user: User | null; session: Session | null; } | null; error: AuthError | Error | null; }>} - Promise resolving to the Supabase sign-up response or a validation/runtime error. The structure mirrors Supabase's { data, error }, returning null for data on validation/runtime errors.
 */
export const signUp = async ({ email, password }) => {
  // Basic input validation
  if (!validateCredentials(email, password)) {
    console.error('Sign Up Error: Invalid email or password provided.');
    return {
      data: null,
      error: new Error(
        'Email and password are required and must be non-empty strings.',
      ),
    };
  }

  try {
    // Attempt to sign up the user with Supabase Auth
    const response = await supabase.auth.signUp({
      email,
      password,
    });
    // Log potential Supabase-specific errors during development/debugging
    if (response.error) {
      console.error('Supabase Sign Up Error:', response.error.message);
    }
    // Return the response object directly from Supabase ({ data, error })
    return response;
  } catch (error) {
    // Catch unexpected runtime errors during the Supabase client call
    console.error('Unexpected Sign Up Runtime Error:', error);
    return {
      data: null,
      error: new Error('An unexpected error occurred during sign up.'),
    };
  }
};

/**
 * Logs in an existing user with Supabase using email and password.
 * Performs basic validation on credentials before attempting the Supabase call.
 *
 * @param {object} credentials - User credentials.
 * @param {string} credentials.email - The user's email address.
 * @param {string} credentials.password - The user's password.
 * @returns {Promise<{ data: { user: User | null; session: Session | null; } | null; error: AuthError | Error | null; }>} - Promise resolving to the Supabase sign-in response or a validation/runtime error. The structure mirrors Supabase's { data, error }, returning null for data on validation/runtime errors.
 */
export const signInWithPassword = async ({ email, password }) => {
  // Basic input validation
  if (!validateCredentials(email, password)) {
    console.error('Sign In Error: Invalid email or password provided.');
    return {
      data: null,
      error: new Error(
        'Email and password are required and must be non-empty strings.',
      ),
    };
  }

  try {
    // Attempt to sign in the user with Supabase Auth
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    // Log potential Supabase-specific errors during development/debugging
    if (response.error) {
      console.error('Supabase Sign In Error:', response.error.message);
    }
    // Return the response object directly from Supabase ({ data, error })
    return response;
  } catch (error) {
    // Catch unexpected runtime errors during the Supabase client call
    console.error('Unexpected Sign In Runtime Error:', error);
    return {
      data: null,
      error: new Error('An unexpected error occurred during sign in.'),
    };
  }
};

/**
 * Logs out the currently authenticated user from Supabase.
 * Invalidates the current session.
 *
 * @returns {Promise<{ error: AuthError | Error | null; }>} - Promise resolving to the Supabase sign-out response (null error on success) or a runtime error.
 */
export const signOut = async () => {
  try {
    // Attempt to sign out the current user
    const response = await supabase.auth.signOut();
    // Log potential Supabase-specific errors during development/debugging
    if (response.error) {
      console.error('Supabase Sign Out Error:', response.error.message);
    }
    // Return the response object directly from Supabase ({ error })
    return response;
  } catch (error) {
    // Catch unexpected runtime errors during the Supabase client call
    console.error('Unexpected Sign Out Runtime Error:', error);
    return {
      error: new Error('An unexpected error occurred during sign out.'),
    };
  }
};

// Optional: Exporting an object containing all functions can be an alternative pattern
// export const authService = {
//   signUp,
//   signInWithPassword,
//   signOut,
// };