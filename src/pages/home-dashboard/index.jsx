import React, { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import WelcomeBanner from './components/WelcomeBanner';
import QuickSearchBar from './components/QuickSearchBar';
import QuickBookSection from './components/QuickBookSection';
import RecentActivitySection from './components/RecentActivitySection';
import SportCategoryTiles from './components/SportCategoryTiles';
import { useNavigation } from '../../components/ui/RoleBasedNavigation';
import { apiUtils } from '../../utils/api';

/**
 * Home Dashboard - Public landing page (no authentication required)
 * 
 * Key Features:
 * - Public access - no login required
 * - Dynamic content based on authentication status
 * - Backend API integration for user data when logged in
 * - Graceful fallback for anonymous users
 * - Enhanced error handling and loading states
 * - Footer included on all pages
 */
const HomeDashboard = () => {
  // Get authentication context
  const { isAuthenticated, userRole } = useNavigation();

  const [userName, setUserName] = useState('Guest');
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    bookingCount: 0,
    recentActivity: false,
    favoriteVenues: []
  });

  useEffect(() => {
    /**
     * Load user data from backend API if authenticated
     * Otherwise, show public/guest experience
     */
    const loadUserData = async () => {
      try {
        setIsLoading(true);

        if (isAuthenticated) {
          console.log('Loading personalized dashboard for authenticated user...');

          // TODO: Replace with actual API endpoints when backend is ready
          // Example backend API calls:

          // 1. Get user profile data
          // const userResponse = await apiClient.get('/api/user/profile');
          // const userData = userResponse.data;

          // 2. Get user booking statistics  
          // const bookingStatsResponse = await apiClient.get('/api/user/booking-stats');
          // const bookingStats = bookingStatsResponse.data;

          // 3. Get user's recent activity
          // const activityResponse = await apiClient.get('/api/user/recent-activity');
          // const recentActivity = activityResponse.data;

          // Mock user data - replace with actual API response
          const userData = {
            name: 'Alex Rodriguez',
            firstName: 'Alex',
            email: 'alex.rodriguez@example.com',
            userRole: userRole || 'sports-enthusiast'
          };

          const bookingStats = {
            totalBookings: 12,
            pendingBookings: 2,
            completedBookings: 10,
            canceledBookings: 0,
            favoriteVenues: ['Elite Sports Complex', 'Metro Basketball Arena']
          };

          const activityData = {
            hasRecentActivity: bookingStats?.totalBookings > 0,
            lastBookingDate: '2024-01-08',
            mostBookedSport: 'Tennis'
          };

          // Update state with fetched data
          setUserName(userData?.firstName || 'User');
          setUserStats({
            bookingCount: bookingStats?.pendingBookings || 0,
            recentActivity: activityData?.hasRecentActivity || false,
            favoriteVenues: bookingStats?.favoriteVenues || []
          });

          console.log('User dashboard data loaded successfully');

        } else {
          console.log('Loading public dashboard for guest user...');

          // Public/Guest experience - no API calls needed
          setUserName('Guest');
          setUserStats({
            bookingCount: 0,
            recentActivity: false,
            favoriteVenues: []
          });
        }

      } catch (error) {
        console.error('Error loading dashboard data:', error);

        // Handle API errors gracefully
        const errorMessage = apiUtils?.handleApiError(error);
        console.warn('Dashboard API Error:', errorMessage);

        // Fallback to basic user experience
        setUserName(isAuthenticated ? 'User' : 'Guest');
        setUserStats({
          bookingCount: 0,
          recentActivity: false,
          favoriteVenues: []
        });

      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [isAuthenticated, userRole]);

  // Loading state - no delays
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          userRole={userRole || 'sports-enthusiast'}
          isAuthenticated={isAuthenticated}
          bookingCount={userStats?.bookingCount || 0} />

        <div className="flex-1 pt-16 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">
              {isAuthenticated ? 'Loading your dashboard...' : 'Loading QuickCourt...'}
            </p>
          </div>
        </div>
        <Footer />
      </div>);

  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with authentication-aware props */}
      <Header
        userRole={userRole || 'sports-enthusiast'}
        isAuthenticated={isAuthenticated}
        bookingCount={userStats?.bookingCount || 0} />

      
      {/* Main Content */}
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Banner - adapts based on authentication status */}
          <WelcomeBanner
            userName={userName}
            isAuthenticated={isAuthenticated}
            userStats={userStats} />

          
          {/* Quick Search - always available */}
          <QuickSearchBar />
          
          {/* Quick Book Section - enhanced for authenticated users */}
          <QuickBookSection
            isAuthenticated={isAuthenticated}
            favoriteVenues={userStats?.favoriteVenues} />

          
          {/* Recent Activity - only show for authenticated users with activity */}
          {isAuthenticated && userStats?.recentActivity &&
          <RecentActivitySection userStats={userStats} />
          }
          
          {/* Sport Categories - always available */}
          <SportCategoryTiles />
          
          {/* Footer CTA Section - different messaging based on auth status */}
                    <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-8 text-center text-white mt-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {isAuthenticated ? 'Ready to Play?' : 'Join QuickCourt Today!'}
            </h2>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              {isAuthenticated ?
              'Find your perfect court and book instantly. Your sports journey continues here!' : 'Join thousands of sports enthusiasts who trust QuickCourt for their venue bookings. Sign up to unlock personalized recommendations!'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => window.location.href = '/venues-listing'}
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-micro">

                Browse All Venues
              </button>
              {isAuthenticated ?
              <button
                onClick={() => window.location.href = '/user-profile'}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-micro">

                  Manage Profile
                </button> :

              <button
                onClick={() => window.location.href = '/register'}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-micro">

                  Sign Up Free
                </button>
              }
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>);

};

export default HomeDashboard;