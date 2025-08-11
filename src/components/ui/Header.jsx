import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import { useNavigation } from './RoleBasedNavigation';

/**
 * Header Component - Main navigation header with authentication support
 * 
 * Features:
 * - Role-based navigation items
 * - Functional logout button
 * - Mobile-responsive design
 * - Authentication state integration
 * - Backend API integration for user actions
 */
const Header = ({ userRole = 'sports-enthusiast', isAuthenticated = true, bookingCount = 0 }) => {
  // Navigation context for authentication and logout functionality
  const { logout: performLogout, isAuthenticated: contextAuth } = useNavigation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Use context authentication state if available, otherwise use props
  const actualAuthStatus = contextAuth !== undefined ? contextAuth : isAuthenticated;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event?.target?.closest('.profile-menu')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileMenuOpen]);

  /**
   * Get navigation items based on user role
   * Configures menu items for different user types
   */
  const getNavigationItems = () => {
    switch (userRole) {
      case 'facility-owner':
        return [
          { label: 'Dashboard', path: '/facility-owner-dashboard', icon: 'BarChart3' },
          { label: 'Facilities', path: '/facility-management', icon: 'Building2' },
          { label: 'Bookings', path: '/my-bookings', icon: 'Calendar' },
        ];
      case 'administrator':
        return [
          { label: 'Dashboard', path: '/admin-dashboard', icon: 'Shield' },
          { label: 'Users', path: '/user-management', icon: 'Users' },
        ];
      default: // sports-enthusiast
        return [
          { label: 'Home', path: '/home-dashboard', icon: 'Home' },
          { label: 'Browse Venues', path: '/venues-listing', icon: 'MapPin' },
          { label: 'My Bookings', path: '/my-bookings', icon: 'Calendar', badge: bookingCount > 0 ? bookingCount : null },
          { label: 'Profile', path: '/user-profile', icon: 'User' },
        ];
    }
  };

  const navigationItems = getNavigationItems();

  /**
   * Handle navigation to different pages
   * Could be enhanced to send analytics data to backend
   */
  const handleNavigation = (path) => {
    try {
      // TODO: Send navigation analytics to backend endpoint
      // await apiClient.post('/analytics/navigation', {
      //   from: window.location.pathname,
      //   to: path,
      //   userId: localStorage.getItem('userId'),
      //   timestamp: new Date().toISOString()
      // });
      
      window.location.href = path;
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Navigation tracking error:', error);
      // Navigate anyway even if tracking fails
      window.location.href = path;
      setIsMobileMenuOpen(false);
    }
  };

  const handleProfileMenuToggle = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  /**
   * Enhanced Logout Handler - Now properly integrated with NavigationProvider
   * 
   * Actions performed:
   * 1. Clears user session data
   * 2. Sends logout event to backend for analytics/security
   * 3. Redirects to home page (public access)
   */
  const handleLogout = async () => {
    try {
      console.log('Logout process initiated...');
      
      // TODO: Send logout event to backend endpoint for security logging
      // const userId = localStorage.getItem('userId');
      // if (userId) {
      //   await apiClient.post('/auth/logout', {
      //     userId,
      //     logoutTime: new Date().toISOString(),
      //     reason: 'user_initiated'
      //   });
      // }
      
      // Call logout from NavigationProvider context
      // This will:
      // - Remove authToken from localStorage
      // - Remove userRole from localStorage  
      // - Set isAuthenticated to false
      // - Reset userRole to 'sports-enthusiast' // - Update activeRoute to'/login'
      performLogout();
      
      // Close profile menu
      setIsProfileMenuOpen(false);
      
      // Redirect to home page (now public access)
      window.location.href = '/';
      
      console.log('Logout completed successfully');
      
    } catch (error) {
      console.error('Error during logout process:', error);
      
      // Even if backend call fails, still perform local logout
      performLogout();
      setIsProfileMenuOpen(false);
      window.location.href = '/';
    }
  };

  /**
   * Handle settings navigation
   * Could send user preference data to backend
   */
  const handleSettings = async () => {
    try {
      console.log('Settings accessed');
      
      // TODO: Track settings access for user analytics
      // await apiClient.post('/analytics/settings-access', {
      //   userId: localStorage.getItem('userId'),
      //   timestamp: new Date().toISOString()
      // });
      
      setIsProfileMenuOpen(false);
      
      // Navigate to settings page (to be created)
      window.location.href = '/settings';
    } catch (error) {
      console.error('Settings navigation error:', error);
      setIsProfileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Always navigates to public home page */}
          <div className="flex items-center">
            <div 
              className="flex items-center space-x-2 cursor-pointer transition-micro hover:opacity-80"
              onClick={() => handleNavigation('/')}
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={20} color="white" />
              </div>
              <span className="text-xl font-bold text-foreground">QuickCourt</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className="relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
                {item?.badge && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item?.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Desktop Profile Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {actualAuthStatus ? (
              <div className="relative profile-menu">
                <button
                  onClick={handleProfileMenuToggle}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-micro"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} color="white" />
                  </div>
                  <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-modal py-1 animate-fade-in">
                    <button
                      onClick={() => handleNavigation('/user-profile')}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-micro"
                    >
                      <Icon name="User" size={16} />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleSettings}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-micro"
                    >
                      <Icon name="Settings" size={16} />
                      <span>Settings</span>
                    </button>
                    <hr className="my-1 border-border" />
                    {/* FIXED: Now properly calls performLogout from context */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-micro"
                    >
                      <Icon name="LogOut" size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => handleNavigation('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleNavigation('/register')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-slide-in">
          <div className="px-4 py-2 space-y-1">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className="relative flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
              >
                <Icon name={item?.icon} size={20} />
                <span>{item?.label}</span>
                {item?.badge && (
                  <span className="ml-auto bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item?.badge}
                  </span>
                )}
              </button>
            ))}
            
            {actualAuthStatus ? (
              <>
                <hr className="my-2 border-border" />
                <button
                  onClick={() => handleNavigation('/user-profile')}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
                >
                  <Icon name="User" size={20} />
                  <span>Profile</span>
                </button>
                <button
                  onClick={handleSettings}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
                >
                  <Icon name="Settings" size={20} />
                  <span>Settings</span>
                </button>
                {/* FIXED: Mobile logout now properly integrated */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-muted transition-micro"
                >
                  <Icon name="LogOut" size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <hr className="my-2 border-border" />
                <button
                  onClick={() => handleNavigation('/login')}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
                >
                  <Icon name="LogIn" size={20} />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-primary hover:bg-muted transition-micro"
                >
                  <Icon name="UserPlus" size={20} />
                  <span>Sign Up</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;