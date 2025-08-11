import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import HomeDashboard from './pages/home-dashboard';
import AdminDashboard from './pages/admin-dashboard';
import Login from './pages/login';
import FacilityOwnerDashboard from './pages/facility-owner-dashboard';
import FacilityManagement from './pages/facility-management';
import UserManagement from './pages/user-management';
import CourtBookingFlow from './pages/court-booking-flow';
import UserProfile from './pages/user-profile';
import Register from './pages/register';
import MyBookings from './pages/my-bookings';
import VenuesListing from './pages/venues-listing';
import VenueDetails from './pages/venue-details';

/**
 * Routes Configuration
 * 
 * Key routing decisions:
 * - "/" (root) now points to HomeDashboard (public access, no login required)
 * - All other protected routes remain as-is
 * - Authentication guards are handled at component level
 */
const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public Routes - No Authentication Required */}
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/home-dashboard" element={<HomeDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/venues-listing" element={<VenuesListing />} />
        <Route path="/venue-details" element={<VenueDetails />} />
        <Route path="/venue-details/:id" element={<VenueDetails />} />
        
        {/* Protected Routes - Authentication Required (handled by individual components) */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/facility-owner-dashboard" element={<FacilityOwnerDashboard />} />
        <Route path="/facility-management" element={<FacilityManagement />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/court-booking-flow" element={<CourtBookingFlow />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        
        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;