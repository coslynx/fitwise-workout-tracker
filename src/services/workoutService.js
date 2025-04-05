import { supabase } from './supabaseClient.js';

/**
 * @typedef {import('@supabase/supabase-js').PostgrestError} PostgrestError
 */

/**
 * @typedef {object} WorkoutPlanExercise
 * @property {string} name - Name of the exercise.
 * @property {number} sets - Number of sets to perform.
 * @property {string} reps - Repetition scheme (e.g., "8-12", "5").
 */

/**
 * @typedef {object} WorkoutPlan
 * @property {string} id - Unique identifier for the workout plan.
 * @property {string} name - Name of the workout plan.
 * @property {string | null} description - Optional description of the plan.
 * @property {WorkoutPlanExercise[]} exercises - Array of exercises included in the plan.
 */

/**
 * @typedef {object} LogData
 * @property {string} workout_name - Name of the workout performed.
 * @property {string} exercise_name - Name of the specific exercise logged.
 * @property {number} sets_completed - Number of sets completed for the exercise.
 * @property {string} reps_achieved - Repetitions achieved (e.g., "10, 9, 8").
 * @property {number | null} [weight_used] - Weight used for the exercise (optional).
 * @property {string} workout_date - Date the workout was performed (ISO 8601 format recommended: YYYY-MM-DD).
 */

/**
 * @typedef {object} ProgressLog
 * @property {string} id - Unique identifier for the progress log entry.
 * @property {string} user_id - Identifier of the user who created the log.
 * @property {string} created_at - Timestamp when the log entry was created.
 * @property {string} workout_name - Name of the workout performed.
 * @property {string} exercise_name - Name of the specific exercise logged.
 * @property {number} sets_completed - Number of sets completed.
 * @property {string} reps_achieved - Repetitions achieved.
 * @property {number | null} weight_used - Weight used (if applicable).
 * @property {string} workout_date - Date the workout was performed.
 */

/**
 * Workout Service Module
 *
 * Provides an abstraction layer for interacting with the Supabase database
 * concerning workout plans and user progress logs. This service centralizes
 * database operations, making them reusable and simplifying interactions
 * from page components or potentially other contexts.
 * It relies on the pre-initialized Supabase client instance from './supabaseClient.js'.
 */

/**
 * Validates if the provided user ID is a non-empty string.
 *
 * @param {string | undefined | null} userId - The user ID to validate.
 * @returns {boolean} True if the userId is a valid non-empty string, false otherwise.
 */
const validateUserId = (userId) => {
  return userId && typeof userId === 'string' && userId.trim() !== '';
};

/**
 * Validates if the provided LogData object is valid.
 * Checks for required fields and their basic types.
 *
 * @param {LogData | undefined | null} logData - The log data object to validate.
 * @returns {boolean} True if logData is a valid object with required fields, false otherwise.
 */
const validateLogData = (logData) => {
  if (!logData || typeof logData !== 'object') {
    return false;
  }
  const {
    workout_name,
    exercise_name,
    sets_completed,
    reps_achieved,
    workout_date,
    weight_used,
  } = logData;

  return (
    workout_name && typeof workout_name === 'string' && workout_name.trim() !== '' &&
    exercise_name && typeof exercise_name === 'string' && exercise_name.trim() !== '' &&
    typeof sets_completed === 'number' && sets_completed >= 0 &&
    reps_achieved && typeof reps_achieved === 'string' && reps_achieved.trim() !== '' &&
    workout_date && typeof workout_date === 'string' && workout_date.trim() !== '' &&
    (weight_used === undefined || weight_used === null || typeof weight_used === 'number')
  );
};


/**
 * Fetches the currently assigned workout plan for a specific user.
 * For MVP, this might fetch a default plan or the first plan associated with the user.
 * Assumes RLS is configured on the 'workout_plans' table to restrict access based on user_id.
 *
 * @param {string} userId - The unique identifier of the user whose plan is being fetched.
 * @returns {Promise<{ data: WorkoutPlan | null; error: PostgrestError | Error | null; }>} - Promise resolving to the workout plan data or an error. Returns `{ data: null, error: null }` if no plan is found but no error occurred.
 * @security Data access relies on Supabase Row Level Security (RLS) policies being configured for the `workout_plans` table to allow reads based on the authenticated user's `user_id`.
 */
export const fetchWorkoutPlan = async (userId) => {
  // Input validation
  if (!validateUserId(userId)) {
    console.error('Fetch Workout Plan Error: Invalid userId provided.');
    return {
      data: null,
      error: new Error('User ID is required and must be a non-empty string.'),
    };
  }

  try {
    // Attempt to fetch the workout plan for the user.
    // maybeSingle() returns null data if no row matches, without it being an error.
    // MVP Adaptation: If user-specific plans aren't ready, adjust query:
    // e.g., fetch a default plan: .eq('id', 'YOUR_DEFAULT_PLAN_ID').single();
    // e.g., fetch the first plan available: .select('*').limit(1).single();
    const { data, error } = await supabase
      .from('workout_plans')
      .select('id, name, description, exercises') // Select specific columns
      .eq('user_id', userId) // Filter by user ID
      .maybeSingle(); // Expect 0 or 1 result

    // Log potential Supabase-specific errors
    if (error) {
      console.error('Supabase Fetch Workout Plan Error:', error.message);
    }

    // Return the Supabase response object ({ data, error })
    // `data` will be the plan object or null if not found.
    return { data, error };
  } catch (error) {
    // Catch unexpected runtime errors during the Supabase client call
    console.error('Unexpected Fetch Workout Plan Runtime Error:', error);
    return {
      data: null,
      error: new Error('An unexpected error occurred while fetching the workout plan.'),
    };
  }
};

/**
 * Saves a new workout progress log entry to the database for the specified user.
 * Assumes RLS is configured on 'progress_logs' table to allow inserts for the matching user_id.
 *
 * @param {string} userId - The unique identifier of the user logging progress.
 * @param {LogData} logData - An object containing the details of the workout session/exercise to log.
 * @returns {Promise<{ data: ProgressLog[] | null; error: PostgrestError | Error | null; }>} - Promise resolving to an array containing the newly inserted log entry(s) or an error. Supabase insert returns an array.
 * @security Data insertion relies on Supabase RLS policies for the `progress_logs` table allowing inserts where the `user_id` column matches the authenticated user's ID.
 */
export const logWorkoutProgress = async (userId, logData) => {
  // Input validation
  if (!validateUserId(userId)) {
    console.error('Log Workout Progress Error: Invalid userId provided.');
    return {
      data: null,
      error: new Error('User ID is required and must be a non-empty string.'),
    };
  }
  if (!validateLogData(logData)) {
     console.error('Log Workout Progress Error: Invalid logData provided.', logData);
     return {
       data: null,
       error: new Error('Valid log data with required fields (workout_name, exercise_name, sets_completed, reps_achieved, workout_date) must be provided.'),
     };
   }

  try {
    // Attempt to insert the new progress log entry
    const { data, error } = await supabase
      .from('progress_logs')
      .insert([{ user_id: userId, ...logData }])
      .select(); // Return the inserted record(s)

    // Log potential Supabase-specific errors
    if (error) {
      console.error('Supabase Log Workout Progress Error:', error.message);
    }

    // Return the Supabase response object ({ data, error })
    // `data` will be an array containing the inserted log(s) or null on error.
    return { data, error };
  } catch (error) {
    // Catch unexpected runtime errors
    console.error('Unexpected Log Workout Progress Runtime Error:', error);
    return {
      data: null,
      error: new Error('An unexpected error occurred while logging workout progress.'),
    };
  }
};

/**
 * Retrieves a list of historical workout progress log entries for the specified user.
 * Assumes RLS is configured on the 'progress_logs' table to restrict access based on user_id.
 * Orders results by workout date (descending), then creation date (descending).
 *
 * @param {string} userId - The unique identifier of the user whose history is being fetched.
 * @returns {Promise<{ data: ProgressLog[] | null; error: PostgrestError | Error | null; }>} - Promise resolving to an array of progress log entries or an error. Returns `{ data: [], error: null }` if no logs are found but no error occurred.
 * @security Data access relies on Supabase RLS policies for the `progress_logs` table allowing reads based on the authenticated user's `user_id`.
 * @performance For applications with large amounts of history data, pagination using `.range(from, to)` should be implemented in future versions to improve performance.
 */
export const fetchProgressHistory = async (userId) => {
  // Input validation
  if (!validateUserId(userId)) {
    console.error('Fetch Progress History Error: Invalid userId provided.');
    return {
      data: null,
      error: new Error('User ID is required and must be a non-empty string.'),
    };
  }

  try {
    // Attempt to fetch all progress logs for the user
    const { data, error } = await supabase
      .from('progress_logs')
      .select('*') // Select all columns
      .eq('user_id', userId) // Filter by user ID
      .order('workout_date', { ascending: false }) // Primary sort: newest workout first
      .order('created_at', { ascending: false }); // Secondary sort: newest log first for same day

    // Log potential Supabase-specific errors
    if (error) {
      console.error('Supabase Fetch Progress History Error:', error.message);
    }

    // Return the Supabase response object ({ data, error })
    // `data` will be an array of logs (potentially empty) or null on error.
    // Supabase returns an empty array [] if the query is successful but finds no rows,
    // so we don't need to treat empty data as null explicitly unless an error occurred.
    return { data: data ?? [], error }; // Ensure data is always an array if no error
  } catch (error) {
    // Catch unexpected runtime errors
    console.error('Unexpected Fetch Progress History Runtime Error:', error);
    return {
      data: null, // Return null for data on unexpected errors
      error: new Error('An unexpected error occurred while fetching progress history.'),
    };
  }
};