import React, { useId, forwardRef } from 'react';

/**
 * @typedef {object} InputFieldProps
 * @property {string} [id] - (Optional) HTML ID for the input. If not provided, a unique ID will be generated automatically.
 * @property {string} label - (Required) The text content for the `<label>` element associated with the input field.
 * @property {string} name - (Required) The `name` attribute for the `<input>` element, crucial for form submission identification and state management.
 * @property {'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'url' | string} [type='text'] - (Optional) The `type` attribute for the `<input>` element (e.g., 'text', 'email', 'password', 'number'). Defaults to 'text'.
 * @property {string | number} value - (Required) The controlled value of the input field, managed by the parent component's state.
 * @property {(event: React.ChangeEvent<HTMLInputElement>) => void} onChange - (Required) Callback function triggered when the input value changes. Used to update the parent component's state.
 * @property {string} [placeholder] - (Optional) The `placeholder` attribute for the `<input>` element, providing a hint to the user.
 * @property {boolean} [disabled=false] - (Optional) If true, the input field is disabled, preventing user interaction and applying distinct styling. Defaults to false.
 * @property {boolean} [required=false] - (Optional) The `required` attribute for the `<input>` element, indicating that the field must be filled out for form submission. Defaults to false.
 * @property {string | null | undefined} [error] - (Optional) An error message string. If provided (and non-empty), displays the message below the input and applies error-specific styling to the input border and text.
 * @property {string} [className] - (Optional) Additional CSS classes to apply to the main container `div` wrapping the label, input, and error message.
 * @property {string} [inputClassName] - (Optional) Additional CSS classes to apply directly to the `<input>` element, merged with default/error/disabled styles, allowing for style overrides or extensions.
 */

/**
 * InputField Component
 *
 * A reusable and accessible controlled input field component with an integrated label,
 * consistent application styling (including dark mode), validation error display,
 * and support for various input types and standard HTML attributes.
 * It uses `React.forwardRef` to allow parent components access to the underlying input element.
 *
 * @param {InputFieldProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id' | 'name' | 'type' | 'value' | 'onChange' | 'placeholder' | 'disabled' | 'required'>} props - Component props.
 * @param {React.ForwardedRef<HTMLInputElement>} ref - The forwarded ref to the underlying input element.
 * @returns {React.ReactElement} A styled input field component with label and optional error message.
 */
const InputField = forwardRef(
  (
    {
      id: propId,
      label,
      name,
      type = 'text',
      value,
      onChange,
      placeholder,
      disabled = false,
      required = false,
      error,
      className = '',
      inputClassName = '',
      ...rest // Capture any other standard HTML input attributes
    },
    ref,
  ) => {
    // Generate a unique ID if one isn't provided via props, used for label association and ARIA attributes.
    const generatedId = useId();
    const inputId = propId || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;

    // --- Determine Input Styling ---
    // Base styles applicable to all input states
    const baseInputStyles = 'block w-full rounded-md border shadow-sm sm:text-sm';

    // Default styles (applied when not disabled and no error)
    const defaultInputStyles =
      'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-indigo-500 focus:ring-indigo-500';

    // Error styles (applied when error prop is present and not disabled)
    const errorInputStyles = error
      ? 'border-red-500 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
      : '';

    // Disabled styles (override default/error styles when disabled)
    const disabledInputStyles = disabled
      ? 'disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:border-gray-700 dark:disabled:bg-gray-800 dark:disabled:text-gray-400'
      : '';

    // Combine styles: start with base, add error or default, add custom inputClassName, finally add disabled styles (which override others)
    const combinedInputClassName = [
      baseInputStyles,
      error && !disabled ? errorInputStyles : defaultInputStyles, // Apply error or default styles based on error and disabled state
      inputClassName, // Allow user overrides/extensions
      disabledInputStyles, // Disabled styles have highest precedence
    ]
      .filter(Boolean) // Remove empty strings
      .join(' ');

    return (
      // Container div for the entire input field structure
      <div className={`mb-4 ${className}`}>
        {/* Label associated with the input field */}
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>

        {/* The actual input element */}
        <input
          ref={ref} // Forward the ref to the input element
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={combinedInputClassName}
          aria-invalid={!!error} // Indicate invalid state if error is present
          aria-describedby={errorId} // Link to the error message if it exists
          {...rest} // Apply any other standard input attributes passed down
        />

        {/* Conditional rendering of the error message */}
        {error && (
          <p
            id={errorId}
            className="mt-1 text-sm text-red-600"
            aria-live="polite" // Announce error messages to screen readers
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

// Setting displayName for better debugging experience with React DevTools
InputField.displayName = 'InputField';

export default InputField;
// Exporting as named export as well, consistent with some provided files pattern
// This allows consumers like AuthPage/ProgressPage to use: import { InputField } ...
export { InputField };