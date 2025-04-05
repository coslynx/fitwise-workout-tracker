import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; // Ensure this path is correct
import App from './App.jsx'; // Ensure this path is correct
import './styles/index.css'; // Ensure this path is correct

// Find the root element in the HTML where the React app will be mounted.
const rootElement = document.getElementById('root');

// Check if the root element exists before attempting to render the app.
// This prevents runtime errors if the index.html file is missing the element
// or if the script runs before the DOM is fully ready (though 'type=module' helps).
if (!rootElement) {
  console.error(
    "Fatal Error: The root element with ID 'root' was not found in the DOM. React application cannot be mounted.",
  );
  // Optionally, throw an error to halt execution completely if preferred.
  // throw new Error("Root element #root not found.");
} else {
  // Create a React root using the concurrent mode API (React 18+).
  const root = ReactDOM.createRoot(rootElement);

  // Render the application within the root.
  // StrictMode activates additional checks and warnings for potential problems
  // in the application, running only in development mode.
  // BrowserRouter provides the routing context necessary for React Router.
  // AuthProvider provides the authentication context to the entire app.
  // App is the main application component containing layout and routes.
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>,
  );
}