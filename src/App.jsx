import React from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import AppRouter from './routes/AppRouter.jsx';

/**
 * App Component
 *
 * The root component of the application that defines the overall page structure
 * and layout. It renders common elements like the Header and Footer, and provides
 * a main content area where the AppRouter renders the current page based on the URL.
 *
 * This component is wrapped by necessary context providers (BrowserRouter, AuthProvider)
 * in `src/main.jsx`, making routing and authentication context available to its children.
 */
function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Application Header: Displays branding, navigation, and auth controls */}
      <Header />

      {/* Main Content Area: Wraps the dynamic page content rendered by AppRouter */}
      <main className="container mx-auto flex-grow px-4 py-8 sm:px-6 lg:px-8">
        {/* AppRouter: Handles route matching and renders the appropriate page component */}
        <AppRouter />
      </main>

      {/* Application Footer: Displays copyright information and potentially other links */}
      <Footer />
    </div>
  );
}

export default App;