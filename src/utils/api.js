import axios from 'axios';

/**
 * Enhanced API Configuration for QuickCourt Backend Integration
 * 
 * This module provides:
 * - Comprehensive API client setup with retry logic
 * - Authentication token management
 * - Error handling with user-friendly messages
 * - Offline/fallback data support
 * - Backend endpoint integration for all user actions
 * - Request/response logging for debugging
 */

// API Configuration from environment variables
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'https://api.quickcourt.com/v1';
const USE_MOCK_FALLBACK = import.meta.env?.VITE_USE_MOCK_DATA_FALLBACK === 'true' || true;
const ENABLE_RETRY = import.meta.env?.VITE_RETRY_FAILED_REQUESTS === 'true' || true;

/**
 * Create axios instance with enhanced configuration
 * Includes timeout, headers, and retry settings
 */
const apiClient = axios?.create({
  baseURL: API_BASE_URL,
  timeout: parseInt(import.meta.env?.VITE_API_TIMEOUT) || 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Custom retry configuration
  maxRetries: ENABLE_RETRY ? 3 : 0,
  retryDelay: 1000,
});

/**
 * Enhanced Request Interceptor
 * 
 * Functionality:
 * - Automatically attaches authentication tokens
 * - Adds request timing for performance monitoring  
 * - Logs API requests in development mode
 * - Handles request metadata for debugging
 */
apiClient?.interceptors?.request?.use(
  (config) => {
    // Attach authentication token from localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Auth token attached to request');
    }
    
    // Add user ID for backend tracking
    const userId = localStorage.getItem('userId');
    if (userId) {
      config.headers['X-User-ID'] = userId;
    }
    
    // Add request timestamp for performance monitoring
    config.metadata = { startTime: new Date() };
    
    // Development logging
    if (import.meta.env?.VITE_ENABLE_API_LOGGING === 'true') {
      console.log('📡 API Request:', {
        method: config?.method?.toUpperCase(),
        url: `${config?.baseURL}${config?.url}`,
        params: config?.params,
        timestamp: new Date()?.toISOString()
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request setup error:', error);
    return Promise.reject(error);
  }
);

/**
 * Enhanced Response Interceptor with Retry Logic
 * 
 * Features:
 * - Automatic retry for network failures
 * - Authentication error handling (redirects to login)
 * - Performance logging with request duration
 * - User-friendly error messages
 * - Offline detection and fallback
 */
apiClient?.interceptors?.response?.use(
  (response) => {
    // Calculate and log request duration
    if (import.meta.env?.VITE_ENABLE_API_LOGGING === 'true') {
      const duration = new Date() - response?.config?.metadata?.startTime;
      console.log('✅ API Success:', {
        method: response?.config?.method?.toUpperCase(),
        url: response?.config?.url,
        status: response?.status,
        duration: `${duration}ms`,
        timestamp: new Date()?.toISOString()
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error?.config;
    
    // Enhanced error logging with full context
    if (import.meta.env?.VITE_ENABLE_API_LOGGING === 'true') {
      console.error('❌ API Error Details:', {
        url: error?.config?.url,
        method: error?.config?.method?.toUpperCase(),
        baseURL: error?.config?.baseURL,
        status: error?.response?.status,
        message: error?.message,
        code: error?.code,
        timeout: error?.config?.timeout,
        timestamp: new Date()?.toISOString()
      });
    }

    /**
     * Automatic Retry Logic for Network Errors
     * 
     * Retries requests that failed due to:
     * - Network timeouts (ECONNABORTED)
     * - Connection refused (ECONNREFUSED) 
     * - General network errors
     */
    if (ENABLE_RETRY && 
        (error?.code === 'ECONNABORTED' || 
         error?.code === 'NETWORK_ERROR'|| error?.message?.includes('Network Error') ||
         error?.code === 'ECONNREFUSED') && 
        !originalRequest?._retry && 
        originalRequest?.maxRetries > 0) {
      
      originalRequest._retry = true;
      originalRequest.maxRetries--;
      
      console.warn(`🔄 Retrying request... (${3 - originalRequest?.maxRetries}/3)`);
      
      // Wait before retry with exponential backoff
      const retryDelay = originalRequest?.retryDelay * (3 - originalRequest?.maxRetries);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      
      return apiClient(originalRequest);
    }

    /**
     * Authentication Error Handling
     * 
     * Actions on 401 Unauthorized:
     * - Clear stored auth tokens
     * - Redirect to login page
     * - Prevent infinite redirect loops
     */
    if (error?.response?.status === 401) {
      console.warn('🔒 Authentication failed, clearing session and redirecting to login');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      
      // Only redirect if not already on login page
      if (window.location?.pathname !== '/login') {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location?.pathname);
      }
    }
    
    // Handle rate limiting
    if (error?.response?.status === 429) {
      console.warn('⚠️ Rate limit exceeded, please wait before retrying');
    }
    
    return Promise.reject(error);
  }
);

/**
 * Mock Data for Development and Offline Fallback
 * 
 * Provides realistic data structure matching backend API responses
 * Used when backend is unavailable or in development mode
 */
const mockVenuesData = {
  venues: [
    {
      id: 1,
      name: "Elite Sports Complex",
      image_url: "/api/placeholder/300/200",
      available_sports: ["Tennis", "Basketball", "Badminton"],
      starting_price: 25,
      location: { 
        full_address: "Downtown, New York",
        latitude: 40.7589,
        longitude: -73.9851
      },
      average_rating: 4.8,
      review_count: 156,
      distance_km: 2.3,
      venue_type: "Indoor",
      is_featured: true,
      amenities: ["Parking", "Changing Rooms", "Equipment Rental"],
      current_availability: "Available",
      operating_hours: {
        monday: "6:00 AM - 10:00 PM",
        tuesday: "6:00 AM - 10:00 PM",
        wednesday: "6:00 AM - 10:00 PM",
        thursday: "6:00 AM - 10:00 PM",
        friday: "6:00 AM - 11:00 PM",
        saturday: "7:00 AM - 11:00 PM",
        sunday: "7:00 AM - 9:00 PM"
      }
    },
    {
      id: 2,
      name: "Riverside Tennis Club",
      image_url: "/api/placeholder/300/200",
      available_sports: ["Tennis"],
      starting_price: 35,
      location: { 
        full_address: "Riverside, NY",
        latitude: 40.7505,
        longitude: -73.9934
      },
      average_rating: 4.6,
      review_count: 89,
      distance_km: 5.1,
      venue_type: "Outdoor",
      is_featured: false,
      amenities: ["Parking", "Pro Shop"],
      current_availability: "Available",
      operating_hours: {
        monday: "7:00 AM - 9:00 PM",
        tuesday: "7:00 AM - 9:00 PM",
        wednesday: "7:00 AM - 9:00 PM",
        thursday: "7:00 AM - 9:00 PM",
        friday: "7:00 AM - 10:00 PM",
        saturday: "8:00 AM - 10:00 PM",
        sunday: "8:00 AM - 8:00 PM"
      }
    },
    {
      id: 3,
      name: "Metro Basketball Arena",
      image_url: "/api/placeholder/300/200",
      available_sports: ["Basketball", "Volleyball"],
      starting_price: 40,
      location: { 
        full_address: "Midtown, NY",
        latitude: 40.7549,
        longitude: -73.9840
      },
      average_rating: 4.7,
      review_count: 203,
      distance_km: 3.8,
      venue_type: "Indoor",
      is_featured: true,
      amenities: ["Parking", "Locker Rooms", "Concessions"],
      current_availability: "Available",
      operating_hours: {
        monday: "6:00 AM - 11:00 PM",
        tuesday: "6:00 AM - 11:00 PM",
        wednesday: "6:00 AM - 11:00 PM",
        thursday: "6:00 AM - 11:00 PM",
        friday: "6:00 AM - 12:00 AM",
        saturday: "7:00 AM - 12:00 AM",
        sunday: "7:00 AM - 10:00 PM"
      }
    },
    {
      id: 4,
      name: "City Sports Center",
      image_url: "/api/placeholder/300/200",
      available_sports: ["Tennis", "Squash", "Badminton"],
      starting_price: 30,
      location: { 
        full_address: "Upper East Side, NY",
        latitude: 40.7736,
        longitude: -73.9566
      },
      average_rating: 4.5,
      review_count: 124,
      distance_km: 4.2,
      venue_type: "Indoor",
      is_featured: false,
      amenities: ["Parking", "Changing Rooms", "Café"],
      current_availability: "Available",
      operating_hours: {
        monday: "6:00 AM - 10:00 PM",
        tuesday: "6:00 AM - 10:00 PM",
        wednesday: "6:00 AM - 10:00 PM",
        thursday: "6:00 AM - 10:00 PM",
        friday: "6:00 AM - 11:00 PM",
        saturday: "7:00 AM - 11:00 PM",
        sunday: "7:00 AM - 9:00 PM"
      }
    }
  ],
  total_count: 4,
  current_page: 1,
  total_pages: 1,
  has_next_page: false
};

/**
 * Enhanced Venues API Service
 * 
 * Provides comprehensive venue management functionality with:
 * - Search and filtering capabilities
 * - Geolocation-based results
 * - Booking management
 * - Error handling and offline fallback
 * - Analytics tracking integration
 */
export const venuesAPI = {
  /**
   * Fetch Venues with Advanced Filtering
   * 
   * Backend Endpoint: GET /api/venues
   * 
   * Query Parameters:
   * - search: Text search in venue names and sports
   * - location: Location filter (city, address, coordinates)
   * - sport_types: Comma-separated list of sports
   * - price_min/max: Price range filtering
   * - venue_types: Indoor/Outdoor filtering
   * - min_rating: Minimum rating filter
   * - max_distance: Distance from user location
   * - sort_by: Sorting options (relevance, price, rating, distance)
   * - page/limit: Pagination parameters
   */
  async fetchVenues(params = {}) {
    try {
      // Prepare comprehensive query parameters for backend API
      const queryParams = {
        search: params?.search || '',
        location: params?.location || '',
        sport_types: params?.sportTypes?.join(',') || '',
        price_min: params?.priceRange?.[0] || 0,
        price_max: params?.priceRange?.[1] || 1000,
        venue_types: params?.venueTypes?.join(',') || '',
        min_rating: params?.rating || 0,
        max_distance: params?.distance || 50,
        sort_by: params?.sortBy || 'relevance',
        page: params?.page || 1,
        limit: params?.limit || 12,
        // Add user context for personalized results
        user_lat: params?.userLocation?.latitude || null,
        user_lng: params?.userLocation?.longitude || null,
        user_preferences: params?.userPreferences?.join(',') || ''
      };

      console.log('🔍 Fetching venues from backend:', `${API_BASE_URL}/venues`);

      // Check network connectivity first
      if (!navigator?.onLine) {
        console.warn('📡 Device is offline, using cached data');
        throw new Error('OFFLINE');
      }

      // Make API request with comprehensive error handling
      const response = await apiClient?.get('/venues', { 
        params: queryParams,
        timeout: 15000, // 15 second timeout for venue search
        metadata: { 
          operation: 'fetch_venues',
          filters: params 
        }
      });
      
      // Validate backend response structure
      if (!response?.data) {
        throw new Error('Invalid response format from backend API');
      }
      
      console.log('✅ Venues loaded successfully from backend', {
        count: response?.data?.venues?.length,
        total: response?.data?.total_count
      });
      
      // TODO: Send search analytics to backend
      // await this.trackSearchEvent(params, response?.data?.venues?.length);
      
      // Return normalized response data
      return {
        venues: response?.data?.venues || [],
        totalCount: response?.data?.total_count || 0,
        currentPage: response?.data?.current_page || 1,
        totalPages: response?.data?.total_pages || 0,
        hasNextPage: response?.data?.has_next_page || false,
        searchMetadata: {
          query: params?.search,
          filters: params,
          responseTime: new Date() - response?.config?.metadata?.startTime
        }
      };
      
    } catch (error) {
      console.error('❌ Error fetching venues:', {
        message: error?.message,
        code: error?.code,
        status: error?.response?.status,
        params: params
      });
      
      // Handle different error scenarios with appropriate fallbacks
      
      // Offline Mode
      if (error?.message === 'OFFLINE' || !navigator?.onLine) {
        console.warn('📱 Using offline/cached venue data');
        return this.getOfflineFallbackData(params);
      }
      
      // Timeout Errors
      if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
        console.warn('⏰ API timeout, attempting fallback data');
        if (USE_MOCK_FALLBACK) {
          return this.getOfflineFallbackData(params);
        }
        throw new Error('Request timeout. Please check your internet connection and try again.');
      }
      
      // Network Connectivity Issues
      if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error') || 
          error?.code === 'ECONNREFUSED') {
        
        console.warn('🌐 Network connectivity issue, using fallback data');
        
        if (USE_MOCK_FALLBACK) {
          return this.getOfflineFallbackData(params);
        }
        
        throw new Error('Unable to connect to server. Please check your internet connection and try again.');
      }
      
      // Server-side Errors (5xx)
      if (error?.response?.status >= 500) {
        if (USE_MOCK_FALLBACK) {
          console.warn('🔧 Backend server error, using fallback data');
          return this.getOfflineFallbackData(params);
        }
        throw new Error('Our servers are temporarily unavailable. Please try again in a few moments.');
      }
      
      // Resource Not Found
      if (error?.response?.status === 404) {
        throw new Error('Venue search service is currently unavailable. Please contact support if this persists.');
      }
      
      // Rate Limiting
      if (error?.response?.status === 429) {
        throw new Error('Too many search requests. Please wait a moment and try again.');
      }
      
      // Generic Error Fallback
      throw new Error(error?.response?.data?.message || error?.message || 'Failed to fetch venues. Please try again.');
    }
  },

  /**
   * Get Offline/Cached Venue Data with Client-side Filtering
   * 
   * When backend is unavailable, this method provides:
   * - Local data filtering based on search parameters
   * - Client-side sorting and pagination
   * - Maintains consistent API response structure
   */
  getOfflineFallbackData(params = {}) {
    console.info('📱 Processing offline venue data with client-side filtering');
    
    let filteredVenues = [...mockVenuesData?.venues];
    
    // Apply search text filter
    if (params?.search) {
      const searchTerm = params?.search?.toLowerCase();
      filteredVenues = filteredVenues?.filter(venue => 
        venue?.name?.toLowerCase()?.includes(searchTerm) ||
        venue?.available_sports?.some(sport => 
          sport?.toLowerCase()?.includes(searchTerm)
        ) ||
        venue?.location?.full_address?.toLowerCase()?.includes(searchTerm)
      );
    }
    
    // Apply sport type filter
    if (params?.sportTypes?.length > 0) {
      filteredVenues = filteredVenues?.filter(venue =>
        params?.sportTypes?.some(sport => 
          venue?.available_sports?.includes(sport)
        )
      );
    }
    
    // Apply venue type filter (Indoor/Outdoor)
    if (params?.venueTypes?.length > 0) {
      filteredVenues = filteredVenues?.filter(venue =>
        params?.venueTypes?.includes(venue?.venue_type)
      );
    }
    
    // Apply minimum rating filter
    if (params?.rating > 0) {
      filteredVenues = filteredVenues?.filter(venue =>
        venue?.average_rating >= params?.rating
      );
    }
    
    // Apply price range filter
    if (params?.priceRange) {
      const [minPrice, maxPrice] = params?.priceRange;
      filteredVenues = filteredVenues?.filter(venue =>
        venue?.starting_price >= minPrice && venue?.starting_price <= maxPrice
      );
    }
    
    return {
      venues: filteredVenues,
      totalCount: filteredVenues?.length,
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      isOfflineData: true, // Flag to indicate offline/cached data
      offlineMessage: 'Showing cached results - some data may not be current'
    };
  },

  /**
   * Fetch Detailed Venue Information
   * 
   * Backend Endpoint: GET /api/venues/{id}
   * 
   * Returns comprehensive venue details including:
   * - Basic information and amenities
   * - Operating hours and availability
   * - Reviews and ratings
   * - Photo gallery
   * - Pricing details
   * - Location and directions
   */
  async fetchVenueDetails(venueId) {
    try {
      console.log(`🏢 Fetching detailed information for venue ID: ${venueId}`);
      
      const response = await apiClient?.get(`/venues/${venueId}`, {
        metadata: { 
          operation: 'fetch_venue_details',
          venueId: venueId 
        }
      });
      
      if (!response?.data) {
        throw new Error('Invalid venue details response from backend');
      }
      
      console.log(`✅ Venue details loaded for: ${response?.data?.name}`);
      
      // TODO: Track venue view for analytics
      // await this.trackVenueView(venueId, response?.data);
      
      return response?.data || {};
      
    } catch (error) {
      console.error(`❌ Error fetching venue details for ID ${venueId}:`, error);
      
      // Fallback to mock data if available
      if (USE_MOCK_FALLBACK || import.meta.env?.NODE_ENV === 'development') {
        const mockVenue = mockVenuesData?.venues?.find(v => v?.id == venueId);
        if (mockVenue) {
          console.info(`📱 Using cached data for venue ${venueId}: ${mockVenue?.name}`);
          return {
            ...mockVenue,
            isOfflineData: true,
            offlineMessage: 'Showing cached venue information'
          };
        }
      }
      
      throw new Error(error?.response?.data?.message || `Failed to fetch details for venue ${venueId}`);
    }
  },

  /**
   * Fetch Available Sports Categories
   * 
   * Backend Endpoint: GET /api/venues/sports-categories
   * 
   * Returns list of all available sports across all venues
   * Used for filtering and search suggestions
   */
  async fetchSportCategories() {
    try {
      console.log('🏃 Fetching available sports categories from backend');
      
      const response = await apiClient?.get('/venues/sports-categories');
      
      const categories = response?.data?.categories || [];
      console.log('✅ Sports categories loaded:', categories);
      
      return categories;
      
    } catch (error) {
      console.error('❌ Error fetching sport categories:', error);
      
      // Fallback to common sports categories
      if (USE_MOCK_FALLBACK || import.meta.env?.NODE_ENV === 'development') {
        const fallbackCategories = [
          'Tennis', 'Basketball', 'Badminton', 'Volleyball', 
          'Squash', 'Soccer', 'Baseball', 'Swimming', 
          'Table Tennis', 'Racquetball'
        ];
        console.info('📱 Using fallback sports categories:', fallbackCategories);
        return fallbackCategories;
      }
      
      throw new Error('Failed to fetch available sports categories');
    }
  },

  /**
   * Fetch Popular Locations/Areas
   * 
   * Backend Endpoint: GET /api/venues/popular-locations
   * 
   * Returns list of popular areas/neighborhoods with venue counts
   * Used for location-based filtering and suggestions
   */
  async fetchPopularLocations() {
    try {
      console.log('📍 Fetching popular venue locations from backend');
      
      const response = await apiClient?.get('/venues/popular-locations');
      
      const locations = response?.data?.locations || [];
      console.log('✅ Popular locations loaded:', locations);
      
      return locations;
      
    } catch (error) {
      console.error('❌ Error fetching popular locations:', error);
      
      // Fallback to common NYC locations
      if (USE_MOCK_FALLBACK || import.meta.env?.NODE_ENV === 'development') {
        const fallbackLocations = [
          { name: 'Downtown Manhattan', count: 15 },
          { name: 'Midtown', count: 12 },
          { name: 'Upper East Side', count: 8 },
          { name: 'Brooklyn Heights', count: 10 },
          { name: 'Queens', count: 7 },
          { name: 'Long Island City', count: 5 }
        ];
        console.info('📱 Using fallback location data:', fallbackLocations);
        return fallbackLocations;
      }
      
      throw new Error('Failed to fetch popular location data');
    }
  },

  /**
   * Create Venue Booking Request
   * 
   * Backend Endpoint: POST /api/bookings
   * 
   * Submits booking request with:
   * - Venue and time slot selection
   * - Customer information
   * - Payment details
   * - Special requirements
   */
  async createBooking(bookingData) {
    try {
      console.log('📅 Creating booking request:', {
        venue: bookingData?.venueId,
        date: bookingData?.date,
        timeSlot: bookingData?.timeSlot
      });
      
      // Prepare comprehensive booking payload for backend
      const bookingPayload = {
        venue_id: bookingData?.venueId,
        booking_date: bookingData?.date,
        time_slot: {
          start_time: bookingData?.timeSlot?.start,
          end_time: bookingData?.timeSlot?.end,
          duration_hours: bookingData?.duration || 1
        },
        sport_type: bookingData?.sportType,
        customer_info: {
          name: bookingData?.userInfo?.name,
          email: bookingData?.userInfo?.email,
          phone: bookingData?.userInfo?.phone,
          user_id: localStorage.getItem('userId') || null
        },
        payment_info: {
          method: bookingData?.paymentInfo?.method || 'card',
          amount: bookingData?.paymentInfo?.amount,
          currency: bookingData?.paymentInfo?.currency || 'USD',
          payment_intent_id: bookingData?.paymentInfo?.paymentIntentId || null
        },
        special_requests: bookingData?.specialRequests || '',
        booking_source: 'web_app',
        user_agent: navigator?.userAgent || '',
        booking_timestamp: new Date()?.toISOString()
      };

      const response = await apiClient?.post('/bookings', bookingPayload, {
        metadata: { 
          operation: 'create_booking',
          venueId: bookingData?.venueId 
        }
      });
      
      if (!response?.data) {
        throw new Error('Invalid booking response from backend');
      }
      
      console.log('✅ Booking created successfully:', {
        bookingId: response?.data?.booking_id,
        status: response?.data?.status
      });
      
      // TODO: Send booking confirmation analytics
      // await this.trackBookingCreated(response?.data);
      
      return response?.data;
      
    } catch (error) {
      console.error('❌ Error creating booking:', error);
      
      // Handle specific booking errors
      if (error?.response?.status === 409) {
        throw new Error('This time slot is no longer available. Please select a different time.');
      }
      
      if (error?.response?.status === 402) {
        throw new Error('Payment processing failed. Please check your payment information and try again.');
      }
      
      if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
        throw new Error('Network error during booking. Please check your connection and try again.');
      }
      
      throw new Error(error?.response?.data?.message || 'Failed to create booking. Please try again.');
    }
  },

  /**
   * Track Search Event for Analytics
   * 
   * Backend Endpoint: POST /api/analytics/search
   * 
   * Sends search behavior data for:
   * - Popular search terms
   * - Filter usage patterns
   * - Search result effectiveness
   */
  async trackSearchEvent(searchParams, resultCount) {
    try {
      const analyticsPayload = {
        search_query: searchParams?.search || '',
        filters: {
          sports: searchParams?.sportTypes || [],
          venue_types: searchParams?.venueTypes || [],
          price_range: searchParams?.priceRange || null,
          rating: searchParams?.rating || null,
          distance: searchParams?.distance || null
        },
        result_count: resultCount || 0,
        user_id: localStorage.getItem('userId') || null,
        session_id: localStorage.getItem('sessionId') || null,
        timestamp: new Date()?.toISOString(),
        user_agent: navigator?.userAgent || '',
        page_url: window?.location?.href || ''
      };

      // Fire-and-forget analytics (don't block user experience)
      apiClient?.post('/analytics/search', analyticsPayload)?.then(() => console.log('📊 Search analytics sent'))?.catch(error => console.warn('📊 Analytics tracking failed:', error?.message));
        
    } catch (error) {
      // Silently handle analytics errors - don't impact user experience console.warn('📊 Search analytics error:', error?.message);
    }
  }
};

/**
 * Enhanced User Registration API Service
 * 
 * Backend Endpoint: POST /userregister
 * 
 * Registers new users with role-based access
 * Supports customer, facility-owner, and admin roles
 */
export const userRegistrationAPI = {
  /**
   * Register New User with Role-Based Access
   * 
   * Endpoint: POST /userregister
   * 
   * Request Body:
   * - email: User's email address* - password: User's password (will be hashed)
   * - fullName: User's full name* - phoneNumber: User's phone number
   * - role: User role (customer, facility-owner, admin)
   * - businessInfo: Additional business information for facility owners
   */
  async registerUser(userData) {
    try {
      console.log('🔐 Registering new user:', {
        email: userData?.email,
        role: userData?.role
      });
      
      // Prepare registration payload
      const registrationPayload = {
        email: userData?.email,
        password: userData?.password,
        full_name: userData?.fullName,
        phone_number: userData?.phoneNumber || null,
        role: userData?.role || 'customer',
        business_info: userData?.businessInfo || null,
        registration_source: 'web_app',
        user_agent: navigator?.userAgent || '',
        registration_timestamp: new Date()?.toISOString()
      };

      const response = await apiClient?.post('/userregister', registrationPayload, {
        metadata: { 
          operation: 'user_registration',
          role: userData?.role 
        }
      });
      
      if (!response?.data) {
        throw new Error('Invalid registration response from backend');
      }
      
      console.log('✅ User registered successfully:', {
        userId: response?.data?.user_id,
        email: response?.data?.email,
        role: response?.data?.role
      });
      
      // Store auth tokens after successful registration
      if (response?.data?.access_token) {
        localStorage.setItem('authToken', response?.data?.access_token);
        localStorage.setItem('userId', response?.data?.user_id);
        localStorage.setItem('userRole', response?.data?.role);
        localStorage.setItem('userEmail', response?.data?.email);
      }
      
      return response?.data;
      
    } catch (error) {
      console.error('❌ Error registering user:', error);
      
      // Handle specific registration errors
      if (error?.response?.status === 409) {
        throw new Error('Email address already exists. Please use a different email or try logging in.');
      }
      
      if (error?.response?.status === 400) {
        throw new Error(error?.response?.data?.message || 'Invalid registration data. Please check your information.');
      }
      
      if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
        throw new Error('Network error during registration. Please check your connection and try again.');
      }
      
      throw new Error(error?.response?.data?.message || 'Failed to register user. Please try again.');
    }
  },

  /**
   * Verify Email OTP for Registration
   * 
   * Endpoint: POST /userregister/verify-otp
   */
  async verifyRegistrationOTP(email, otp) {
    try {
      console.log('📧 Verifying registration OTP for:', email);
      
      const response = await apiClient?.post('/userregister/verify-otp', {
        email: email,
        otp: otp,
        verification_timestamp: new Date()?.toISOString()
      });
      
      console.log('✅ OTP verified successfully');
      return response?.data;
      
    } catch (error) {
      console.error('❌ Error verifying OTP:', error);
      
      if (error?.response?.status === 400) {
        throw new Error('Invalid or expired OTP. Please try again.');
      }
      
      throw new Error(error?.response?.data?.message || 'Failed to verify OTP. Please try again.');
    }
  }
};

/**
 * Enhanced Booking Management API Service
 * 
 * Backend Endpoints: POST /newbooking, GET /readbookings
 * 
 * Manages court bookings with comprehensive functionality
 */
export const bookingAPI = {
  /**
   * Create New Booking
   * 
   * Backend Endpoint: POST /newbooking
   * 
   * Creates a new court booking with payment processing
   * Supports various sports and time slot configurations
   */
  async createNewBooking(bookingData) {
    try {
      console.log('📅 Creating new booking:', {
        venueId: bookingData?.venueId,
        courtId: bookingData?.courtId,
        date: bookingData?.date,
        timeSlot: bookingData?.timeSlot,
        sport: bookingData?.sport
      });
      
      // Prepare comprehensive booking payload
      const newBookingPayload = {
        // Venue and Court Information
        venue_id: bookingData?.venueId,
        court_id: bookingData?.courtId,
        sport_type: bookingData?.sport,
        
        // Booking Time Details
        booking_date: bookingData?.date,
        start_time: bookingData?.timeSlot?.start,
        end_time: bookingData?.timeSlot?.end,
        duration_hours: bookingData?.duration || 1,
        
        // Customer Information
        customer_info: {
          user_id: localStorage.getItem('userId') || null,
          name: bookingData?.customerInfo?.name,
          email: bookingData?.customerInfo?.email,
          phone: bookingData?.customerInfo?.phone,
          special_requests: bookingData?.customerInfo?.specialRequests || ''
        },
        
        // Payment Information
        payment_info: {
          method: bookingData?.paymentInfo?.method || 'card',
          amount: bookingData?.paymentInfo?.amount,
          currency: bookingData?.paymentInfo?.currency || 'USD',
          stripe_payment_intent_id: bookingData?.paymentInfo?.paymentIntentId || null,
          payment_status: 'pending'
        },
        
        // Booking Metadata
        booking_source: 'web_app',
        booking_metadata: {
          user_agent: navigator?.userAgent || '',
          referrer: document?.referrer || '',
          booking_timestamp: new Date()?.toISOString(),
          facility_owner_id: bookingData?.facilityOwnerId || null
        }
      };

      const response = await apiClient?.post('/newbooking', newBookingPayload, {
        timeout: 30000, // 30 second timeout for booking creation
        metadata: { 
          operation: 'create_new_booking',
          venueId: bookingData?.venueId,
          customerId: localStorage.getItem('userId')
        }
      });
      
      if (!response?.data) {
        throw new Error('Invalid booking response from backend');
      }
      
      console.log('✅ Booking created successfully:', {
        bookingId: response?.data?.booking_id,
        status: response?.data?.status,
        confirmationNumber: response?.data?.confirmation_number
      });
      
      return response?.data;
      
    } catch (error) {
      console.error('❌ Error creating booking:', error);
      
      // Handle specific booking creation errors
      if (error?.response?.status === 409) {
        throw new Error('This time slot is no longer available. Please select a different time.');
      }
      
      if (error?.response?.status === 402) {
        throw new Error('Payment processing failed. Please check your payment information and try again.');
      }
      
      if (error?.response?.status === 400) {
        throw new Error(error?.response?.data?.message || 'Invalid booking data. Please check your information.');
      }
      
      if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
        throw new Error('Network error during booking. Please check your connection and try again.');
      }
      
      throw new Error(error?.response?.data?.message || 'Failed to create booking. Please try again.');
    }
  },

  /**
   * Read Bookings with Comprehensive Filtering
   * 
   * Backend Endpoint: GET /readbookings
   * 
   * Retrieves bookings with advanced filtering options
   * Supports role-based access control
   */
  async readBookings(filterOptions = {}) {
    try {
      console.log('📋 Reading bookings with filters:', filterOptions);
      
      // Prepare query parameters for backend API
      const queryParams = {
        // User and Role Filters
        user_id: filterOptions?.userId || localStorage.getItem('userId'),
        user_role: filterOptions?.userRole || localStorage.getItem('userRole'),
        facility_owner_id: filterOptions?.facilityOwnerId || null,
        
        // Date Range Filters
        start_date: filterOptions?.startDate || null,
        end_date: filterOptions?.endDate || null,
        booking_date: filterOptions?.specificDate || null,
        
        // Status and Type Filters
        booking_status: filterOptions?.status || null, // confirmed, pending, completed, cancelled
        sport_types: filterOptions?.sportTypes?.join(',') || '',
        venue_ids: filterOptions?.venueIds?.join(',') || '',
        
        // Pagination and Sorting
        page: filterOptions?.page || 1,
        limit: filterOptions?.limit || 20,
        sort_by: filterOptions?.sortBy || 'booking_date',
        sort_order: filterOptions?.sortOrder || 'desc',
        
        // Search Parameters
        search_query: filterOptions?.searchQuery || '',
        customer_name: filterOptions?.customerName || '',
        
        // Additional Filters
        include_payments: filterOptions?.includePayments || true,
        include_customer_info: filterOptions?.includeCustomerInfo || true,
        include_venue_details: filterOptions?.includeVenueDetails || true
      };

      const response = await apiClient?.get('/readbookings', { 
        params: queryParams,
        timeout: 15000, // 15 second timeout for reading bookings
        metadata: { 
          operation: 'read_bookings',
          filters: filterOptions 
        }
      });
      
      if (!response?.data) {
        throw new Error('Invalid bookings response from backend');
      }
      
      console.log('✅ Bookings loaded successfully:', {
        count: response?.data?.bookings?.length,
        totalCount: response?.data?.total_count,
        currentPage: response?.data?.current_page
      });
      
      return {
        bookings: response?.data?.bookings || [],
        totalCount: response?.data?.total_count || 0,
        currentPage: response?.data?.current_page || 1,
        totalPages: response?.data?.total_pages || 0,
        hasNextPage: response?.data?.has_next_page || false,
        hasPreviousPage: response?.data?.has_previous_page || false,
        filterMetadata: {
          appliedFilters: filterOptions,
          responseTime: new Date() - response?.config?.metadata?.startTime
        }
      };
      
    } catch (error) {
      console.error('❌ Error reading bookings:', error);
      
      // Handle different error scenarios with appropriate fallbacks
      
      // Network Connectivity Issues
      if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
        console.warn('🌐 Network connectivity issue reading bookings');
        
        if (USE_MOCK_FALLBACK) {
          return this.getMockBookingsData(filterOptions);
        }
        
        throw new Error('Unable to connect to server. Please check your internet connection and try again.');
      }
      
      // Server-side Errors (5xx)
      if (error?.response?.status >= 500) {
        if (USE_MOCK_FALLBACK) {
          console.warn('🔧 Backend server error, using fallback booking data');
          return this.getMockBookingsData(filterOptions);
        }
        throw new Error('Our servers are temporarily unavailable. Please try again in a few moments.');
      }
      
      // Authentication Errors
      if (error?.response?.status === 401) {
        throw new Error('Your session has expired. Please log in again to view bookings.');
      }
      
      // Forbidden Access
      if (error?.response?.status === 403) {
        throw new Error('You do not have permission to view these bookings.');
      }
      
      // Generic Error Fallback
      throw new Error(error?.response?.data?.message || error?.message || 'Failed to load bookings. Please try again.');
    }
  },

  /**
   * Get Mock Bookings Data for Development/Offline
   * 
   * Provides realistic booking data when backend is unavailable
   */
  getMockBookingsData(filterOptions = {}) {
    console.info('📱 Using mock bookings data');
    
    const mockBookings = [
      {
        booking_id: 'BK-2025-001',
        confirmation_number: 'QC-ABC123',
        venue_id: 1,
        venue_name: 'Elite Sports Complex',
        court_id: 'COURT-A1',
        court_name: 'Basketball Court A',
        sport_type: 'Basketball',
        booking_date: '2025-08-11',
        start_time: '09:00:00',
        end_time: '11:00:00',
        duration_hours: 2,
        status: 'confirmed',
        customer_info: {
          user_id: 'USER-001',
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+1 (555) 123-4567'
        },
        payment_info: {
          amount: 60.00,
          currency: 'USD',
          method: 'card',
          payment_status: 'completed'
        },
        created_at: '2025-08-10T15:30:00Z',
        updated_at: '2025-08-10T15:30:00Z'
      },
      {
        booking_id: 'BK-2025-002',
        confirmation_number: 'QC-DEF456',
        venue_id: 2,
        venue_name: 'Riverside Tennis Club',
        court_id: 'COURT-T1',
        court_name: 'Tennis Court 1',
        sport_type: 'Tennis',
        booking_date: '2025-08-11',
        start_time: '14:00:00',
        end_time: '15:00:00',
        duration_hours: 1,
        status: 'pending',
        customer_info: {
          user_id: 'USER-002',
          name: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          phone: '+1 (555) 234-5678'
        },
        payment_info: {
          amount: 35.00,
          currency: 'USD',
          method: 'card',
          payment_status: 'pending'
        },
        created_at: '2025-08-10T16:45:00Z',
        updated_at: '2025-08-10T16:45:00Z'
      }
    ];
    
    return {
      bookings: mockBookings,
      totalCount: mockBookings?.length,
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      isOfflineData: true,
      offlineMessage: 'Showing cached booking data - some information may not be current'
    };
  },

  /**
   * Update Booking Status
   * 
   * Backend Endpoint: PUT /readbookings/:bookingId/status
   * 
   * Updates booking status (confirm, cancel, complete)
   */
  async updateBookingStatus(bookingId, newStatus, reason = '') {
    try {
      console.log(`🔄 Updating booking ${bookingId} to status: ${newStatus}`);
      
      const response = await apiClient?.put(`/readbookings/${bookingId}/status`, {
        status: newStatus,
        reason: reason,
        updated_by: localStorage.getItem('userId'),
        update_timestamp: new Date()?.toISOString()
      });
      
      console.log(`✅ Booking ${bookingId} status updated to ${newStatus}`);
      return response?.data;
      
    } catch (error) {
      console.error(`❌ Error updating booking ${bookingId} status:`, error);
      throw new Error(error?.response?.data?.message || 'Failed to update booking status');
    }
  },

  /**
   * Get Booking Details by ID
   * 
   * Backend Endpoint: GET /readbookings/:bookingId
   */
  async getBookingDetails(bookingId) {
    try {
      console.log(`🔍 Fetching details for booking: ${bookingId}`);
      
      const response = await apiClient?.get(`/readbookings/${bookingId}`);
      
      console.log(`✅ Booking details loaded for: ${bookingId}`);
      return response?.data;
      
    } catch (error) {
      console.error(`❌ Error fetching booking details for ${bookingId}:`, error);
      throw new Error(error?.response?.data?.message || 'Failed to fetch booking details');
    }
  }
};

/**
 * Enhanced API Utility Functions
 * 
 * Provides helper functions for:
 * - Error message standardization
 * - Data formatting and validation
 * - Connection monitoring
 * - Performance tracking
 */
export const apiUtils = {
  /**
   * Handle API Errors with User-friendly Messages
   * 
   * Converts technical errors into actionable user messages
   * Maintains consistent error experience across the application
   */
  handleApiError(error) {
    // Check offline status first
    if (!navigator?.onLine) {
      return {
        message: 'You appear to be offline. Showing cached results when available.',
        type: 'offline',
        retryable: true
      };
    }
    
    // Network connectivity issues
    if (error?.message?.includes('Network Error') || 
        error?.code === 'NETWORK_ERROR' ||
        error?.code === 'ECONNREFUSED') {
      return {
        message: 'Unable to connect to our servers. Please check your internet connection and try again.',
        type: 'network',
        retryable: true
      };
    }
    
    // Request timeout
    if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
      return {
        message: 'Request is taking too long. Please try again or check your connection.',
        type: 'timeout',
        retryable: true
      };
    }
    
    // Server errors (5xx)
    if (error?.response?.status >= 500) {
      return {
        message: 'Our servers are temporarily experiencing issues. Please try again in a few moments.',
        type: 'server_error',
        retryable: true
      };
    }
    
    // Resource not found (404)
    if (error?.response?.status === 404) {
      return {
        message: 'The requested resource was not found. Please contact support if this persists.',
        type: 'not_found',
        retryable: false
      };
    }
    
    // Rate limiting (429)
    if (error?.response?.status === 429) {
      return {
        message: 'Too many requests. Please wait a moment before trying again.',
        type: 'rate_limit',
        retryable: true
      };
    }
    
    // Authentication errors (401)
    if (error?.response?.status === 401) {
      return {
        message: 'Your session has expired. Please log in again.',
        type: 'auth_error',
        retryable: false
      };
    }
    
    // Validation errors (400)
    if (error?.response?.status === 400) {
      return {
        message: error?.response?.data?.message || 'Invalid request. Please check your input and try again.',
        type: 'validation_error',
        retryable: false
      };
    }
    
    // Generic fallback
    return {
      message: error?.response?.data?.message || error?.message || 'An unexpected error occurred. Please try again.',
      type: 'unknown',
      retryable: true
    };
  },

  /**
   * Format Raw Venue Data for Frontend Consumption
   * 
   * Standardizes backend response data into consistent frontend format
   * Handles missing fields with sensible defaults
   */
  formatVenueData(rawData) {
    return {
      id: rawData?.id,
      name: rawData?.name || 'Unknown Venue',
      image: rawData?.image_url || '/api/placeholder/300/200',
      sports: rawData?.available_sports || [],
      startingPrice: rawData?.starting_price || 0,
      location: rawData?.location?.full_address || 'Location not specified',
      coordinates: {
        latitude: rawData?.location?.latitude || null,
        longitude: rawData?.location?.longitude || null
      },
      rating: rawData?.average_rating || 0,
      reviewCount: rawData?.review_count || 0,
      distance: rawData?.distance_km || 0,
      venueType: rawData?.venue_type || 'Unknown',
      featured: rawData?.is_featured || false,
      amenities: rawData?.amenities || [],
      availability: rawData?.current_availability || 'Unknown',
      operatingHours: rawData?.operating_hours || {},
      // Additional formatting for enhanced UI display
      priceDisplay: `$${rawData?.starting_price || 0}/hr`,
      ratingDisplay: `${(rawData?.average_rating || 0)?.toFixed(1)} ⭐`,
      distanceDisplay: rawData?.distance_km ? `${rawData?.distance_km?.toFixed(1)} km away` : 'Distance unknown'
    };
  },

  /**
   * Check API Health and Connectivity
   * 
   * Backend Endpoint: GET /api/health
   * 
   * Provides system health information for:
   * - Connection quality monitoring
   * - Performance diagnostics
   * - Fallback mode decisions
   */
  async checkApiHealth() {
    try {
      const startTime = new Date();
      const response = await apiClient?.get('/health', { 
        timeout: 5000,
        metadata: { operation: 'health_check' }
      });
      const latency = new Date() - startTime;
      
      const healthData = {
        isHealthy: response?.status === 200,
        latency: latency,
        serverTime: response?.data?.timestamp || null,
        version: response?.data?.version || null,
        status: response?.data?.status || 'unknown'
      };
      
      console.log('💚 API health check successful:', healthData);
      return healthData;
      
    } catch (error) {
      console.warn('❤️‍🩹 API health check failed:', error?.message);
      return { 
        isHealthy: false, 
        error: error?.message,
        latency: null,
        fallbackMode: true
      };
    }
  },

  /**
   * Get Network Connection Information
   * 
   * Provides detailed connection status for:
   * - Adaptive content loading
   * - Quality adjustments
   * - User experience optimization
   */
  getConnectionInfo() {
    const connection = navigator?.connection || navigator?.mozConnection || navigator?.webkitConnection || {};
    
    return {
      online: navigator?.onLine || false,
      connectionType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      saveData: connection?.saveData || false,
      connectionQuality: this.getConnectionQuality(connection),
      timestamp: new Date()?.toISOString()
    };
  },

  /**
   * Assess Connection Quality for UX Optimizations
   */
  getConnectionQuality(connection) {
    const effectiveType = connection?.effectiveType;
    const downlink = connection?.downlink || 0;
    
    if (effectiveType === '4g' && downlink > 10) {
      return 'excellent';
    } else if (effectiveType === '4g' || (effectiveType === '3g' && downlink > 5)) {
      return 'good';
    } else if (effectiveType === '3g') {
      return 'fair';
    } else {
      return 'poor';
    }
  }
};

// Export default API client for custom requests
export default apiClient;