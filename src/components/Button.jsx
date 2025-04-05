import React from 'react';

/**
 * @typedef {'button' | 'submit' | 'reset'} ButtonType
 * @typedef {'primary' | 'secondary' | 'danger'} ButtonVariant
 * @typedef {'sm' | 'md' | 'lg'} ButtonSize
 */

/**
 * @typedef {object} ButtonProps
 * @property {React.ReactNode} children - (Required) The content displayed inside the button (text, icons, etc.).
 * @property {() => void} [onClick] - (Optional) Function to call when the button is clicked.
 * @property {ButtonType} [type='button'] - (Optional) The HTML button type ('button', 'submit', 'reset'). Defaults to 'button'.
 * @property {boolean} [disabled=false] - (Optional) If true, the button is disabled and visually distinct. Defaults to false.
 * @property {ButtonVariant} [variant='primary'] - (Optional) The visual style variant ('primary', 'secondary', 'danger'). Defaults to 'primary'.
 * @property {ButtonSize} [size='md'] - (Optional) The size of the button ('sm', 'md', 'lg'). Defaults to 'md'.
 * @property {string} [className] - (Optional) Additional Tailwind classes to merge with the button's base styles.
 * @property {React.ButtonHTMLAttributes<HTMLButtonElement>} [rest] - Any other standard HTML button attributes.
 */

/**
 * Button Component
 *
 * A reusable button component with consistent styling and behavior across the application.
 * Supports different visual variants, sizes, and disabled states.
 *
 * @param {ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>} props - Component props.
 * @returns {React.ReactElement} A styled button element.
 */
function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest // Capture any remaining standard button attributes
}) {
  // --- Base Styles ---
  // Common styles applied to all button variants and sizes. Includes layout,
  // border, font, rounding, shadow, focus outline, and transition properties.
  const baseStyles =
    'inline-flex items-center justify-center border border-transparent font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150';

  // --- Size Styles ---
  // Maps the 'size' prop to corresponding Tailwind padding and text size classes.
  let sizeStyles = '';
  switch (size) {
    case 'sm':
      sizeStyles = 'px-3 py-1.5 text-sm leading-4';
      break;
    case 'lg':
      sizeStyles = 'px-5 py-2 text-base';
      break;
    case 'md': // Default size
    default:
      sizeStyles = 'px-4 py-2 text-sm';
      break;
  }

  // --- Variant Styles ---
  // Maps the 'variant' prop to corresponding Tailwind background, text color,
  // hover state, and focus ring color classes.
  let variantStyles = '';
  switch (variant) {
    case 'secondary':
      variantStyles =
        'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500';
      break;
    case 'danger':
      variantStyles =
        'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500';
      break;
    case 'primary': // Default variant
    default:
      variantStyles =
        'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500';
      break;
  }

  // --- Disabled Styles ---
  // Applies specific styles when the button is disabled. Reduces opacity and
  // changes the cursor. Tailwind's `disabled:` variant typically handles
  // preventing hover/focus styles, but explicit class ensures visual cue.
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  // --- Combine Classes ---
  // Concatenate all style strings, ensuring spaces between class groups.
  // Includes base, size, variant, conditional disabled styles, and any custom
  // classes passed via the `className` prop.
  const combinedClassName = [
    baseStyles,
    sizeStyles,
    variantStyles,
    disabledStyles,
    className, // User-provided classes come last to allow overrides if necessary
  ]
    .filter(Boolean) // Remove any empty strings (e.g., if disabledStyles is '')
    .join(' ');

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combinedClassName}
      {...rest} // Apply any other passed HTML button attributes
    >
      {children}
    </button>
  );
}

export default Button;