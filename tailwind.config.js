/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  // Content array: Specify the paths to all template files (HTML, JSX, TSX)
  // that contain Tailwind class names. This is crucial for PurgeCSS
  // to remove unused styles in production builds, optimizing performance.
  // Ensure these paths cover all components and pages within the 'src' directory
  // and the root HTML file.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Covers all JS/TS/JSX/TSX files in src
  ],

  // Theme object: Allows customization of Tailwind's default theme.
  // For the MVP, we will extend the default theme minimally or not at all
  // to maintain simplicity and speed up development. Keep 'extend' empty
  // unless specific brand colors, fonts, or spacing are absolutely required
  // *for the MVP scope*.
  theme: {
    extend: {
      // No theme extensions needed for the MVP scope.
    },
  },

  // Plugins array: Allows adding official or third-party Tailwind plugins.
  // For the MVP, avoid adding plugins unless essential for core functionality.
  // Keep empty for now.
  plugins: [
    // No plugins needed for the MVP scope.
  ],
};