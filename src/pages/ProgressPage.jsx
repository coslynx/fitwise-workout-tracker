import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  fetchProgressHistory,
  logWorkoutProgress,
} from '../services/workoutService.js';
import { InputField } from '../components/InputField.jsx'; // Assuming InputField handles standard input types
import { Button } from '../components/Button.jsx';
import { format } from 'date-fns';

/**
 * @typedef {import('../services/workoutService.js').ProgressLog} ProgressLog
 * @typedef {import('../services/workoutService.js').LogData} LogData
 * @typedef {import('@supabase/supabase-js').PostgrestError} PostgrestError
 */

/**
 * @typedef {object} FormDataState
 * @property {string} workout_name
 * @property {string} exercise_name
 * @property {string} sets_completed // Store as string from input, parse on submit
 * @property {string} reps_achieved
 * @property {string} workout_date // YYYY-MM-DD format
 * @property {string} weight_used // Store as string from input, parse on submit (optional)
 */

/**
 * ProgressPage Component
 *
 * Protected page where authenticated users can view their workout history
 * and log new workout session details. Handles data fetching, form submission,
 * loading states, and error display.
 * Assumes route protection is handled externally (e.g., via RequireAuth).
 */
function ProgressPage() {
  // --- Context ---
  const { user } = useAuth();

  // --- State ---
  /** @type {[ProgressLog[] | null, React.Dispatch<React.SetStateAction<ProgressLog[] | null>>]} */
  const [historyData, setHistoryData] = useState(null);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [historyLoading, setHistoryLoading] = useState(true);
  /** @type {[PostgrestError | Error | null, React.Dispatch<React.SetStateAction<PostgrestError | Error | null>>]} */
  const [historyError, setHistoryError] = useState(null);

  // Use a simplified default date (today)
  const todayISO = new Date().toISOString().split('T')[0];
  /** @type {[FormDataState, React.Dispatch<React.SetStateAction<FormDataState>>]} */
  const [formData, setFormData] = useState({
    workout_name: '',
    exercise_name: '',
    sets_completed: '',
    reps_achieved: '',
    workout_date: todayISO,
    weight_used: '',
  });
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [logLoading, setLogLoading] = useState(false);
  /** @type {[PostgrestError | Error | null, React.Dispatch<React.SetStateAction<PostgrestError | Error | null>>]} */
  const [logError, setLogError] = useState(null);
  /** @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]} */
  const [localValidationError, setLocalValidationError] = useState(null);

  // --- Data Fetching Logic (Wrapped in useCallback) ---
  const loadHistory = useCallback(async () => {
    if (!user?.id) {
      console.warn('ProgressPage: Attempted history fetch without user ID.');
      // Set loading false if no user ID is present after initial auth check is likely done
      setHistoryLoading(false);
      return;
    }

    setHistoryLoading(true);
    setHistoryError(null); // Clear previous errors

    try {
      console.log(`ProgressPage: Fetching history for user ${user.id}...`);
      const { data, error: fetchError } = await fetchProgressHistory(user.id);

      if (fetchError) {
        console.error(
          'ProgressPage: Failed to fetch workout history:',
          fetchError,
        );
        setHistoryError(fetchError);
        setHistoryData(null);
      } else {
        // Data is expected to be an array (possibly empty) if no error
        setHistoryData(data);
        console.log(
          `ProgressPage: Workout history fetched successfully. Found ${data?.length || 0} logs.`,
        );
      }
    } catch (catchError) {
      console.error(
        'ProgressPage: Unexpected error fetching workout history:',
        catchError,
      );
      setHistoryError(
        catchError instanceof Error
          ? catchError
          : new Error('An unexpected error occurred fetching history.'),
      );
      setHistoryData(null);
    } finally {
      setHistoryLoading(false);
    }
  }, [user?.id]); // Dependency: user ID

  // --- Initial Data Fetching Effect ---
  useEffect(() => {
    loadHistory();
  }, [loadHistory]); // Run loadHistory when the component mounts or loadHistory function changes (due to user.id)

  // --- Form Change Handler ---
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear local validation error when user types
    if (localValidationError) {
      setLocalValidationError(null);
    }
    // Clear log submission error when user types
    if (logError) {
      setLogError(null);
    }
  };

  // --- Form Submission Handler ---
  const handleLogSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setLocalValidationError(null); // Clear previous validation errors
      setLogError(null); // Clear previous submission errors

      // --- Client-side Validation ---
      const {
        workout_name,
        exercise_name,
        sets_completed,
        reps_achieved,
        workout_date,
        weight_used,
      } = formData;

      if (
        !workout_name.trim() ||
        !exercise_name.trim() ||
        !sets_completed.trim() || // Check string before parsing
        !reps_achieved.trim() ||
        !workout_date.trim()
      ) {
        setLocalValidationError(
          'Workout Name, Exercise Name, Sets, Reps, and Date are required.',
        );
        return;
      }

      // Validate and parse numeric fields
      const setsParsed = parseInt(sets_completed, 10);
      if (isNaN(setsParsed) || setsParsed < 0) {
         setLocalValidationError('Sets completed must be a non-negative number.');
         return;
      }

      let weightParsed = null;
      if (weight_used.trim() !== '') {
         weightParsed = parseFloat(weight_used); // Use parseFloat for potential decimal weights
         if (isNaN(weightParsed) || weightParsed < 0) {
           setLocalValidationError('Weight used must be a non-negative number if provided.');
           return;
         }
      }

      if (!user?.id) {
        setLocalValidationError('Cannot log progress: User not identified.');
        console.error('ProgressPage: Submit failed, user ID missing.');
        return;
      }

      setLogLoading(true);

      /** @type {LogData} */
      const logDataPayload = {
        workout_name: workout_name.trim(),
        exercise_name: exercise_name.trim(),
        sets_completed: setsParsed,
        reps_achieved: reps_achieved.trim(),
        workout_date: workout_date, // Already in YYYY-MM-DD format
        weight_used: weightParsed, // Use parsed number or null
      };

      console.log('ProgressPage: Submitting new log...', logDataPayload);

      try {
        const { data, error: submitError } = await logWorkoutProgress(
          user.id,
          logDataPayload,
        );

        if (submitError) {
          console.error('ProgressPage: Failed to log workout:', submitError);
          setLogError(submitError);
        } else {
          console.log('ProgressPage: Workout logged successfully:', data);
          // Reset form to initial state (including date)
          setFormData({
            workout_name: '',
            exercise_name: '',
            sets_completed: '',
            reps_achieved: '',
            workout_date: todayISO,
            weight_used: '',
          });
          // Refetch history to show the new log
          await loadHistory(); // Await ensures loading state updates correctly if needed
        }
      } catch (catchError) {
        console.error(
          'ProgressPage: Unexpected error logging workout:',
          catchError,
        );
        setLogError(
          catchError instanceof Error
            ? catchError
            : new Error('An unexpected error occurred during submission.'),
        );
      } finally {
        setLogLoading(false);
      }
    },
    [formData, user?.id, loadHistory, todayISO], // Include loadHistory and todayISO
  );

  // --- Rendering Functions ---

  const renderHistoryLoading = () => (
    <div className="flex justify-center items-center p-8">
      <p className="text-center text-gray-500 dark:text-gray-400 animate-pulse">
        Loading workout history...
      </p>
    </div>
  );

  const renderHistoryError = () => (
    <div
      className="rounded-md border border-red-400 bg-red-50 p-4 dark:border-red-600 dark:bg-red-900/30"
      role="alert"
    >
      <p className="text-sm font-medium text-red-700 dark:text-red-300">
        Error loading history:{' '}
        {historyError?.message ||
          'An unknown error occurred. Please try refreshing.'}
      </p>
    </div>
  );

  const renderHistoryContent = () => {
    if (!historyData || historyData.length === 0) {
      return (
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400">
            No workout logs found. Log your first workout below!
          </p>
        </div>
      );
    }

    // History data exists, render the list
    return (
      <ul className="space-y-4">
        {historyData.map((log) => (
          <li
            key={log.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold text-lg text-gray-900 dark:text-white">
                {log.workout_name} - {log.exercise_name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {format(new Date(log.workout_date), 'PPP')} {/* More readable format */}
              </p>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Sets:</span> {log.sets_completed} |{' '}
              <span className="font-medium">Reps:</span> {log.reps_achieved}
              {log.weight_used !== null && log.weight_used !== undefined && (
                 <span> | <span className="font-medium">Weight:</span> {log.weight_used}</span>
               )}
            </p>
            {/* Optionally display log.notes if that field exists and is populated */}
            {/* {log.notes && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">Notes: {log.notes}</p>} */}
          </li>
        ))}
      </ul>
    );
  };

  // --- Main Component Render ---
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        Workout Progress
      </h2>

      {/* History Section */}
      <section aria-labelledby="history-heading">
        <h3
          id="history-heading"
          className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2"
        >
          Workout History
        </h3>
        <div className="mt-4">
          {historyLoading
            ? renderHistoryLoading()
            : historyError
              ? renderHistoryError()
              : renderHistoryContent()}
        </div>
      </section>

      {/* Logging Form Section */}
      <section
        aria-labelledby="log-form-heading"
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
      >
        <h3
          id="log-form-heading"
          className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6"
        >
          Log New Workout Exercise
        </h3>

        <form onSubmit={handleLogSubmit} className="space-y-6">
          {/* Combined Log Submission & Validation Error Display */}
          {(logError || localValidationError) && (
            <div
              className="rounded-md border border-red-400 bg-red-50 p-4 dark:border-red-600 dark:bg-red-900/30"
              role="alert"
            >
              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                {localValidationError ||
                  logError?.message ||
                  'An error occurred.'}
              </p>
            </div>
          )}

          {/* Workout Name */}
          <InputField
            id="workout_name"
            name="workout_name" // Name attribute is crucial for handleFormChange
            label="Workout Name"
            type="text"
            value={formData.workout_name}
            onChange={handleFormChange}
            placeholder="e.g., Upper Body Day"
            required
            disabled={logLoading}
          />

          {/* Exercise Name */}
           <InputField
             id="exercise_name"
             name="exercise_name"
             label="Exercise Name"
             type="text"
             value={formData.exercise_name}
             onChange={handleFormChange}
             placeholder="e.g., Bench Press"
             required
             disabled={logLoading}
           />

           <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
             {/* Sets Completed */}
             <InputField
               id="sets_completed"
               name="sets_completed"
               label="Sets Completed"
               type="number"
               value={formData.sets_completed}
               onChange={handleFormChange}
               placeholder="e.g., 3"
               required
               min="0" // HTML5 validation attribute
               disabled={logLoading}
             />

             {/* Reps Achieved */}
             <InputField
               id="reps_achieved"
               name="reps_achieved"
               label="Reps Achieved"
               type="text" // Keep as text to allow formats like "10, 9, 8"
               value={formData.reps_achieved}
               onChange={handleFormChange}
               placeholder="e.g., 10, 9, 8 or 12"
               required
               disabled={logLoading}
             />

             {/* Weight Used (Optional) */}
              <InputField
                id="weight_used"
                name="weight_used"
                label="Weight Used (Optional)"
                type="number"
                value={formData.weight_used}
                onChange={handleFormChange}
                placeholder="e.g., 135"
                min="0"
                step="any" // Allow decimal weights
                disabled={logLoading}
              />
           </div>


          {/* Workout Date */}
          <InputField
            id="workout_date"
            name="workout_date"
            label="Workout Date"
            type="date"
            value={formData.workout_date}
            onChange={handleFormChange}
            required
            disabled={logLoading}
          />

          {/* Notes - Using standard textarea for simplicity */}
          {/*
          <InputField
            id="notes"
            name="notes"
            label="Notes (Optional)"
            type="textarea" // Assuming InputField handles this or use <textarea>
            value={formData.notes}
            onChange={handleFormChange}
            placeholder="Any observations..."
            rows={3} // Example for textarea height
            disabled={logLoading}
          />
           */}

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              disabled={logLoading}
              className="w-full sm:w-auto" // Adjust width as needed
              aria-live="polite"
            >
              {logLoading ? 'Logging...' : 'Log Workout Exercise'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ProgressPage;