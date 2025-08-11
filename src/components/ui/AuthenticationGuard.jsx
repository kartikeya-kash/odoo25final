import React, { useEffect, useState } from 'react';
import { useNavigation } from './RoleBasedNavigation';

const AuthenticationGuard = ({ 
  children, 
  requiredRole = null, 
  fallbackComponent = null,
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, userRole, hasPermission, updateActiveRoute } = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Quick authentication check - no delays
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Handle redirection for unauthenticated users
    if (!isLoading && !isAuthenticated) {
      updateActiveRoute(redirectTo);
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo, updateActiveRoute]);

  // Show minimal loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    if (fallbackComponent) {
      return fallbackComponent;
    }
    return null; // Will redirect via useEffect
  }

  // Check role-based permissions
  if (requiredRole && !hasPermission(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this area. Please contact your administrator if you believe this is an error.
          </p>
          <button
            onClick={() => window.history?.back()}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

// Higher-order component for protecting routes
export const withAuthGuard = (Component, options = {}) => {
  return function AuthGuardedComponent(props) {
    return (
      <AuthenticationGuard {...options}>
        <Component {...props} />
      </AuthenticationGuard>
    );
  };
};

// Hook for checking authentication status in components
export const useAuthGuard = () => {
  const { isAuthenticated, userRole, hasPermission } = useNavigation();

  const requireAuth = (callback) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return false;
    }
    if (callback) callback();
    return true;
  };

  const requireRole = (requiredRole, callback) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return false;
    }
    if (!hasPermission(requiredRole)) {
      return false;
    }
    if (callback) callback();
    return true;
  };

  return {
    isAuthenticated,
    userRole,
    hasPermission,
    requireAuth,
    requireRole,
  };
};

export default AuthenticationGuard;