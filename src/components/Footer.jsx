import React from 'react';

/**
 * Footer Component
 *
 * Renders the standard application footer. In the MVP scope, it displays
 * static copyright information and ensures visual consistency with the
 * application's theme (light/dark modes). It is designed to be placed
 * at the bottom of the main application layout defined in `src/App.jsx`.
 *
 * This component is currently stateless and accepts no props.
 */
function Footer() {
  // Calculate the current year dynamically to keep the copyright up-to-date.
  const currentYear = new Date().getFullYear();

  return (
    // Semantic footer element with Tailwind classes for styling.
    // - py-6: Adds vertical padding.
    // - text-center: Centers the text content.
    // - text-sm: Sets the font size.
    // - text-gray-500: Sets text color for light mode.
    // - dark:text-gray-400: Sets text color for dark mode, matching App.jsx theme.
    <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
      {/* Paragraph containing the copyright notice. */}
      <p>
        &copy; {currentYear} Fitness Tracker. All rights reserved.
      </p>
    </footer>
  );
}

// Export the Footer component for use in other parts of the application, primarily App.jsx.
export default Footer;