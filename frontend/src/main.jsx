/**
 * DigiHaat Banner Generator - Entry Point
 *
 * This file initializes the React application with:
 * - Authentication provider for user management
 * - Router provider for page navigation
 * - Global styles
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import router from './router';
import './styles/index.css';

/**
 * Application Root
 *
 * Structure:
 * - StrictMode: Enables additional development checks
 * - AuthProvider: Manages authentication state globally
 * - RouterProvider: Handles all page routing
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
