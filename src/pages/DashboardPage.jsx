import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchWorkoutPlan } from '../services/workoutService.js';

/**
 * @typedef {import('../services/workoutService.js').WorkoutPlan} WorkoutPlan
 * @typedef {import('@supabase/supabase-js').PostgrestError} PostgrestError
 */

/**
 * DashboardPage Component
 *
 * Serves as the main landing page for authenticated users. It displays a personalized
 * welcome message and fetches/renders the user's assigned workout plan.
 * Handles loading and error states during data retrieval.
 * Route protection is assumed to be handled by a wrapper component (e.g., RequireAuth).
 */
function DashboardPage() {
  // --- Context ---
  // Retrieve the authenticated user object from the global AuthContext.
  // This component assumes it's only rendered when a user is authenticated.
  const { user } = useAuth();

  // --- State ---
  // State to store the fetched workout plan data.
  /** @type {[WorkoutPlan | null, React.Dispatch<React.SetStateAction<WorkoutPlan | null>>]} */
  const [planData, setPlanData] = useState(null);
  // State to track the loading status of the workout plan fetch. Initialized to true.
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [isLoading, setIsLoading] = useState(true);
  // State to store any error encountered during the fetch operation.
  /** @type {[PostgrestError | Error | null, React.Dispatch<React.SetStateAction<PostgrestError | Error | null>>]} */
  const [error, setError] = useState(null);

  // --- Data Fetching Effect ---
  // useEffect hook to fetch the workout plan when the component mounts or the user ID changes.
  useEffect(() => {
    // Ensure user and user.id are available before attempting to fetch.
    if (!user?.id) {
      // If there's no user ID (e.g., context still loading, unlikely due to RequireAuth),
      // potentially set loading to false if not already handled, or simply return.
      // Setting loading to false here might be redundant if RequireAuth handles initial load.
      // setIsLoading(false);
      console.warn('DashboardPage: Attempted fetch without user ID.');
      return;
    }

    // Define an async function to perform the data fetching logic.
    const loadPlan = async () => {
      setIsLoading(true); // Set loading state to true before fetch
      setError(null); // Clear any previous errors

      try {
        // Call the service function to fetch the workout plan for the current user.
        const { data, error: fetchError } = await fetchWorkoutPlan(user.id);

        if (fetchError) {
          // If an error occurs during the fetch, store the error and log it.
          console.error('DashboardPage: Failed to fetch workout plan:', fetchError);
          setError(fetchError);
          setPlanData(null); // Ensure plan data is cleared on error
        } else {
          // If the fetch is successful, update the planData state.
          // `data` will be the plan object or null if no plan was found (handled by maybeSingle).
          setPlanData(data);
          // Log success or absence of data for debugging
          if (data) {
             console.log('DashboardPage: Workout plan fetched successfully.');
          } else {
             console.log('DashboardPage: Fetch successful, but no workout plan found for user.');
          }
        }
      } catch (catchError) {
        // Catch unexpected errors during the async operation (e.g., network issues not caught by service).
        console.error('DashboardPage: Unexpected error fetching workout plan:', catchError);
        setError(
          catchError instanceof Error
            ? catchError
            : new Error('An unexpected error occurred.'),
        );
        setPlanData(null);
      } finally {
        // Ensure loading state is set to false regardless of success or failure.
        setIsLoading(false);
      }
    };

    // Invoke the data fetching function.
    loadPlan();
  }, [user?.id]); // Dependency array: Re-run effect if user.id changes.

  // --- Rendering Functions ---

  // Renders the loading state UI.
  const renderLoading = () => (
    <div className="flex justify-center items-center p-8">
      <p className="text-center text-gray-500 dark:text-gray-400 animate-pulse">
        Loading your workout plan...
      </p>
    </div>
  );

  // Renders the error state UI.
  const renderError = () => (
    <div
      className="rounded-md border border-red-400 bg-red-50 p-4 dark:border-red-600 dark:bg-red-900/30"
      role="alert"
    >
      <p className="text-sm font-medium text-red-700 dark:text-red-300">
        Error loading workout plan:{' '}
        {error?.message || 'An unknown error occurred. Please try again later.'}
      </p>
    </div>
  );

  // Renders the content when data is loaded successfully.
  const renderPlanContent = () => {
    if (!planData) {
      // Handle the case where the fetch was successful but no plan exists for the user.
      return (
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400">
            No workout plan is currently assigned to you.
          </p>
          {/* Optionally add a link or button to request/create a plan later */}
        </div>
      );
    }

    // Render the assigned workout plan details.
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          Your Plan: {planData.name}
        </h3>
        {planData.description && (
           <p className="text-gray-600 dark:text-gray-400 mb-4">{planData.description}</p>
        )}

        {planData.exercises && planData.exercises.length > 0 ? (
          <ul className="space-y-4">
            {planData.exercises.map((exercise) => (
              <li
                key={exercise.id || exercise.name} // Use unique ID if available, fallback to name
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition hover:shadow-md"
              >
                <p className="font-medium text-gray-900 dark:text-white">
                  {exercise.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sets: {exercise.sets} | Reps: {exercise.reps}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            This plan currently has no exercises assigned.
          </p>
        )}
      </div>
    );
  };

  // --- Main Component Render ---
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Personalized Welcome Message */}
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
        Welcome back, {user?.email || 'User'}!
      </h2>

      {/* Conditional Rendering: Loading, Error, or Plan Content */}
      <div className="mt-4">
        {isLoading
          ? renderLoading()
          : error
            ? renderError()
            : renderPlanContent()}
      </div>

      {/* Placeholder for potential future dashboard elements */}
      {/* <div className="mt-8"> */}
      {/*   <p>Other dashboard widgets could go here...</p> */}
      {/* </div> */}
    </div>
  );
}

export default DashboardPage;