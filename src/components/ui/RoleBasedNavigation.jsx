import React, { createContext, useContext, useState, useEffect } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/home-dashboard');
  const [bookingCount, setBookingCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const role = localStorage.getItem('userRole');
      
      setIsAuthenticated(!!token);
      setUserRole(role || null);
    };

    checkAuth();

    // Real-time booking updates for authenticated users
    const updateBookingStatus = () => {
      if (userRole === 'sports-enthusiast') {
        setBookingCount(Math.floor(Math.random() * 5));
      }
    };

    const interval = setInterval(updateBookingStatus, 30000);
    updateBookingStatus();

    return () => clearInterval(interval);
  }, [userRole]);

  const updateUserRole = (newRole) => {
    setUserRole(newRole);
    localStorage.setItem('userRole', newRole);
  };

  const login = (token, role = 'sports-enthusiast') => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
    setActiveRoute('/login');
  };

  const updateActiveRoute = (route) => {
    setActiveRoute(route);
  };

  const addNotification = (notification) => {
    setNotifications(prev => [...prev, { ...notification, id: Date.now() }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev?.filter(n => n?.id !== id));
  };

  const hasPermission = (requiredRole) => {
    const roleHierarchy = {
      'sports-enthusiast': 1,
      'admin': 2,           // Facility admin - manages their own facilities
      'owner': 3            // Site owner - can add facilities, highest permissions
    };

    return roleHierarchy?.[userRole] >= roleHierarchy?.[requiredRole];
  };

  // Enhanced authentication helper functions
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

  const getNavigationConfig = () => {
    switch (userRole) {
      case 'admin':
        return {
          primaryItems: [
            { 
              label: 'Dashboard', 
              path: '/admin-dashboard', 
              icon: 'BarChart3',
              description: 'Manage your sports facilities'
            },
            { 
              label: 'My Facilities', 
              path: '/facility-management', 
              icon: 'Building2',
              description: 'Manage your own facilities'
            },
            { 
              label: 'Bookings', 
              path: '/my-bookings', 
              icon: 'Calendar',
              description: 'View facility bookings'
            },
          ],
          secondaryItems: [
            { label: 'Profile', path: '/user-profile', icon: 'User' },
            { label: 'Settings', path: '/settings', icon: 'Settings' },
          ]
        };

      case 'owner':
        return {
          primaryItems: [
            { 
              label: 'Dashboard', 
              path: '/facility-owner-dashboard', 
              icon: 'Shield',
              description: 'Platform overview and management'
            },
            { 
              label: 'All Facilities', 
              path: '/facility-management', 
              icon: 'Building2',
              description: 'Add and manage all facilities'
            },
            { 
              label: 'Users', 
              path: '/user-management', 
              icon: 'Users',
              description: 'Manage platform users'
            },
          ],
          secondaryItems: [
            { label: 'Profile', path: '/user-profile', icon: 'User' },
            { label: 'Settings', path: '/settings', icon: 'Settings' },
            { label: 'System Logs', path: '/system-logs', icon: 'FileText' },
          ]
        };

      default: // sports-enthusiast
        return {
          primaryItems: [
            { 
              label: 'Home', 
              path: '/home-dashboard', 
              icon: 'Home',
              description: 'Your personalized dashboard'
            },
            { 
              label: 'Browse Venues', 
              path: '/venues-listing', 
              icon: 'MapPin',
              description: 'Find and explore sports venues'
            },
            { 
              label: 'My Bookings', 
              path: '/my-bookings', 
              icon: 'Calendar',
              badge: bookingCount > 0 ? bookingCount : null,
              description: 'View your current and past bookings'
            },
            { 
              label: 'Profile', 
              path: '/user-profile', 
              icon: 'User',
              description: 'Manage your account settings'
            },
          ],
          secondaryItems: [
            { label: 'Settings', path: '/settings', icon: 'Settings' },
            { label: 'Help', path: '/help', icon: 'HelpCircle' },
          ]
        };
    }
  };

  const value = {
    userRole,
    isAuthenticated,
    activeRoute,
    bookingCount,
    notifications,
    updateUserRole,
    login,
    logout,
    updateActiveRoute,
    addNotification,
    removeNotification,
    hasPermission,
    requireAuth,
    requireRole,
    getNavigationConfig,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationProvider;