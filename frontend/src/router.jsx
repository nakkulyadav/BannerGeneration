/**
 * Application Router Configuration
 *
 * Defines all routes for the DigiHaat Banner Generator application.
 * Uses React Router v6 with protected routes for authenticated content.
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/auth';
import {
  LoginPage,
  SignupPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from './pages';

// Import HomePage and EditorPage (will be created in subsequent phases)
// For now, we'll use placeholder components
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';

/**
 * Application Router
 *
 * Route Structure:
 * - Public routes: /login, /signup, /forgot-password, /reset-password
 * - Protected routes: / (home), /editor/:projectId
 */
const router = createBrowserRouter([
  // ==========================================================================
  // PUBLIC ROUTES (Authentication)
  // ==========================================================================
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },

  // ==========================================================================
  // PROTECTED ROUTES (Require Authentication)
  // ==========================================================================
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/editor/:projectId',
    element: (
      <ProtectedRoute>
        <EditorPage />
      </ProtectedRoute>
    ),
  },

  // ==========================================================================
  // CATCH-ALL (Redirect unknown routes to home)
  // ==========================================================================
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
