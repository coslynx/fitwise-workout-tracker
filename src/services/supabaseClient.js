import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client Initialization Module
 *
 * This module initializes and exports a singleton instance of the Supabase client.
 * It reads the necessary credentials (Project URL and Public Anon Key) securely
 * from environment variables managed by Vite.
 *
 * It includes strict runtime validation to ensure that the required environment
 * variables are present and correctly configured before attempting to create
 * the client instance. If validation fails, it throws an error to prevent
 * the application from running with an invalid configuration.
 */

// Retrieve Supabase URL and Anon Key from Vite environment variables.
// Vite exposes variables prefixed with 'VITE_' to the client-side code
// via the `import.meta.env` object.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- Configuration Validation ---
// Perform strict checks to ensure both URL and Key are provided and are non-empty strings.
// This is crucial for preventing runtime errors later in the application if the
// configuration is missing or invalid.

if (!supabaseUrl || typeof supabaseUrl !== 'string' || supabaseUrl.trim() === '') {
  // Throw a descriptive error if the Supabase URL is missing or invalid.
  throw new Error(
    'Fatal Configuration Error: VITE_SUPABASE_URL is missing or invalid. ' +
      'Please ensure VITE_SUPABASE_URL is defined as a non-empty string in your .env file.',
  );
}

if (
  !supabaseAnonKey ||
  typeof supabaseAnonKey !== 'string' ||
  supabaseAnonKey.trim() === ''
) {
  // Throw a descriptive error if the Supabase Anon Key is missing or invalid.
  throw new Error(
    'Fatal Configuration Error: VITE_SUPABASE_ANON_KEY is missing or invalid. ' +
      'Please ensure VITE_SUPABASE_ANON_KEY is defined as a non-empty string in your .env file.',
  );
}

// --- Client Instantiation and Export ---
// If validation passes, create the Supabase client instance using the retrieved credentials.
// Export the initialized client as a named constant `supabase`. This ensures that
// any module importing `supabase` from this file receives the same, shared instance (singleton pattern).
export const supabase = createClient(supabaseUrl, supabaseAnonKey);