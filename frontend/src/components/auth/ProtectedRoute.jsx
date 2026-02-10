/**
 * Protected Route Component
 *
 * Wrapper component that restricts access to authenticated users only.
 * Redirects unauthenticated users to the login page.
 *
 * Usage:
 * <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Loading spinner component shown while checking auth state
 */
const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      {/* Animated spinner */}
      <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  </div>
);

/**
 * Protected Route Component
 *
 * Checks authentication status and either renders children or redirects to login.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render when authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading, isSupabaseConfigured } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return <LoadingSpinner />;
  }

  // If Supabase is not configured, render children (development mode)
  // This allows the app to function without auth during development
  if (!isSupabaseConfigured) {
    return children;
  }

  // Redirect to login if not authenticated
  // Preserve the intended destination in state for redirect after login
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // User is authenticated, render protected content
  return children;
};

export default ProtectedRoute;
