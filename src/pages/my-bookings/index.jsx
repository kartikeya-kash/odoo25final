import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import AuthenticationGuard from '../../components/ui/AuthenticationGuard';
import BookingFilters from './components/BookingFilters';
import BookingsList from './components/BookingsList';
import BookingStats from './components/BookingStats';
import BookingCalendarView from './components/BookingCalendarView';
import Button from '../../components/ui/Button';
import { useNavigation } from '../../components/ui/RoleBasedNavigation';

const MyBookings = () => {
  const { userRole } = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // list, calendar
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');
  const [activeDateFilter, setActiveDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    totalSpent: 0
  });

  // Mock bookings data
  const mockBookings = [
    {
      id: 1,
      bookingReference: 'QC-2025-001',
      venueName: 'Downtown Sports Complex',
      courtName: 'Basketball Court A',
      sportType: 'Basketball',
      date: '2025-08-15',
      time: '14:00',
      duration: '2 hours',
      status: 'upcoming',
      totalAmount: 80,
      courtFee: 60,
      additionalServicesFee: 20,
      playerCount: 8,
      venueAddress: '123 Sports Ave, Downtown, NY 10001',
      venuePhone: '+1 (555) 123-4567',
      specialInstructions: 'Please arrive 15 minutes early for equipment setup',
      cancellationPolicy: 'Free cancellation up to 24 hours before booking time',
      additionalServices: ['Equipment Rental', 'Referee'],
      hasReviewed: false
    },
    {
      id: 2,
      bookingReference: 'QC-2025-002',
      venueName: 'City Tennis Club',
      courtName: 'Tennis Court 2',
      sportType: 'Tennis',
      date: '2025-08-13',
      time: '10:00',
      duration: '1.5 hours',
      status: 'pending',
      totalAmount: 45,
      courtFee: 45,
      additionalServicesFee: 0,
      playerCount: 2,
      venueAddress: '456 Tennis Rd, Midtown, NY 10002',
      venuePhone: '+1 (555) 234-5678',
      specialInstructions: null,
      cancellationPolicy: 'Cancellation allowed up to 2 hours before booking',
      additionalServices: [],
      hasReviewed: false
    },
    {
      id: 3,
      bookingReference: 'QC-2025-003',
      venueName: 'Riverside Football Field',
      courtName: 'Field 1',
      sportType: 'Football',
      date: '2025-08-10',
      time: '16:00',
      duration: '2 hours',
      status: 'completed',
      totalAmount: 120,
      courtFee: 100,
      additionalServicesFee: 20,
      playerCount: 22,
      venueAddress: '789 River St, Riverside, NY 10003',
      venuePhone: '+1 (555) 345-6789',
      specialInstructions: 'Changing rooms available on-site',
      cancellationPolicy: 'No refund for cancellations within 24 hours',
      additionalServices: ['Changing Room Access'],
      hasReviewed: false
    },
    {
      id: 4,
      bookingReference: 'QC-2025-004',
      venueName: 'Elite Badminton Center',
      courtName: 'Court 3',
      sportType: 'Badminton',
      date: '2025-08-08',
      time: '18:30',
      duration: '1 hour',
      status: 'completed',
      totalAmount: 35,
      courtFee: 35,
      additionalServicesFee: 0,
      playerCount: 4,
      venueAddress: '321 Shuttle Lane, Uptown, NY 10004',
      venuePhone: '+1 (555) 456-7890',
      specialInstructions: null,
      cancellationPolicy: 'Full refund for cancellations 12+ hours in advance',
      additionalServices: [],
      hasReviewed: true
    },
    {
      id: 5,
      bookingReference: 'QC-2025-005',
      venueName: 'Metro Volleyball Arena',
      courtName: 'Indoor Court B',
      sportType: 'Volleyball',
      date: '2025-08-05',
      time: '20:00',
      duration: '1.5 hours',
      status: 'cancelled',
      totalAmount: 75,
      courtFee: 60,
      additionalServicesFee: 15,
      playerCount: 12,
      venueAddress: '654 Spike Blvd, Metro, NY 10005',
      venuePhone: '+1 (555) 567-8901',
      specialInstructions: 'Net height adjusted for recreational play',
      cancellationPolicy: '50% refund for cancellations within 24 hours',
      additionalServices: ['Net Setup'],
      hasReviewed: false
    }
  ];

  useEffect(() => {
    // Fetch bookings - no delays
    const fetchBookings = async () => {
      setLoading(true);
      try {
        setBookings(mockBookings);
        
        // Calculate stats
        const totalBookings = mockBookings?.length;
        const upcomingBookings = mockBookings?.filter(b => b?.status === 'upcoming')?.length;
        const completedBookings = mockBookings?.filter(b => b?.status === 'completed')?.length;
        const totalSpent = mockBookings?.filter(b => b?.status === 'completed')?.reduce((sum, b) => sum + b?.totalAmount, 0);
        
        setStats({
          totalBookings,
          upcomingBookings,
          completedBookings,
          totalSpent
        });
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...bookings];

    // Status filter
    if (activeStatusFilter !== 'all') {
      filtered = filtered?.filter(booking => booking?.status === activeStatusFilter);
    }

    // Date filter
    if (activeDateFilter !== 'all') {
      const now = new Date();
      const currentWeekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      switch (activeDateFilter) {
        case 'this-week':
          filtered = filtered?.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate >= currentWeekStart;
          });
          break;
        case 'this-month':
          filtered = filtered?.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate >= currentMonthStart;
          });
          break;
        case 'past-bookings':
          filtered = filtered?.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate < new Date();
          });
          break;
        case 'next-30-days':
          const next30Days = new Date();
          next30Days?.setDate(next30Days?.getDate() + 30);
          filtered = filtered?.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate <= next30Days && bookingDate >= new Date();
          });
          break;
      }
    }

    // Search filter
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(booking =>
        booking?.venueName?.toLowerCase()?.includes(query) ||
        booking?.bookingReference?.toLowerCase()?.includes(query) ||
        booking?.sportType?.toLowerCase()?.includes(query)
      );
    }

    // Sort by date (newest first)
    filtered?.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredBookings(filtered);
  }, [bookings, activeStatusFilter, activeDateFilter, searchQuery]);

  const handleModifyBooking = (bookingId) => {
    console.log('Modify booking:', bookingId);
    window.location.href = `/court-booking-flow?modify=${bookingId}`;
  };

  const handleCancelBooking = (bookingId) => {
    console.log('Cancel booking:', bookingId);
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setBookings(prev => 
        prev?.map(booking => 
          booking?.id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
    }
  };

  const handleReviewBooking = (bookingId) => {
    console.log('Review booking:', bookingId);
    window.location.href = `/venue-details?review=${bookingId}`;
  };

  const handleRebookBooking = (bookingId) => {
    console.log('Rebook booking:', bookingId);
    const booking = bookings?.find(b => b?.id === bookingId);
    if (booking) {
      window.location.href = `/venue-details?venue=${booking?.venueName?.replace(/\s+/g, '-')?.toLowerCase()}`;
    }
  };

  const handleCheckIn = (bookingId) => {
    console.log('Check in for booking:', bookingId);
    alert('Check-in successful! Enjoy your game!');
  };

  const handleClearFilters = () => {
    setActiveStatusFilter('all');
    setActiveDateFilter('all');
    setSearchQuery('');
  };

  const handleBookingClick = (booking) => {
    console.log('Booking clicked:', booking);
  };

  return (
    <AuthenticationGuard>
      <div className="min-h-screen bg-background flex flex-col">
        <Header userRole={userRole} isAuthenticated={true} bookingCount={stats?.upcomingBookings} />
        <main className="flex-1 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">My Bookings</h1>
                <p className="text-muted-foreground">
                  Manage your court reservations and booking history
                </p>
              </div>
              
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  iconName="List"
                  iconPosition="left"
                  onClick={() => setViewMode('list')}
                >
                  List View
                </Button>
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'outline'}
                  size="sm"
                  iconName="Calendar"
                  iconPosition="left"
                  onClick={() => setViewMode('calendar')}
                >
                  Calendar
                </Button>
              </div>
            </div>

            {/* Booking Stats */}
            <BookingStats stats={stats} />

            {/* Filters */}
            <BookingFilters
              activeStatusFilter={activeStatusFilter}
              onStatusFilterChange={setActiveStatusFilter}
              activeDateFilter={activeDateFilter}
              onDateFilterChange={setActiveDateFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClearFilters={handleClearFilters}
            />

            {/* Content */}
            {viewMode === 'list' ? (
              <BookingsList
                bookings={filteredBookings}
                loading={loading}
                onModify={handleModifyBooking}
                onCancel={handleCancelBooking}
                onReview={handleReviewBooking}
                onRebook={handleRebookBooking}
                onCheckIn={handleCheckIn}
                onLoadMore={() => console.log('Load more')}
                hasMore={false}
              />
            ) : (
              <BookingCalendarView
                bookings={filteredBookings}
                onBookingClick={handleBookingClick}
              />
            )}
          </div>
        </main>
        <Footer />
      </div>
    </AuthenticationGuard>
  );
};

export default MyBookings;