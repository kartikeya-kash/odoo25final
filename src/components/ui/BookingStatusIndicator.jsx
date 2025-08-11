import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import { useNavigation } from './RoleBasedNavigation';

const BookingStatusIndicator = ({ className = '' }) => {
  const { userRole, bookingCount, addNotification } = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Simulate fetching booking data
    const fetchBookings = () => {
      const mockBookings = [
        {
          id: 1,
          venueName: 'Downtown Sports Complex',
          courtName: 'Basketball Court A',
          date: '2025-08-12',
          time: '14:00',
          status: 'confirmed',
          type: 'upcoming'
        },
        {
          id: 2,
          venueName: 'City Tennis Club',
          courtName: 'Tennis Court 2',
          date: '2025-08-13',
          time: '10:00',
          status: 'pending',
          type: 'pending'
        },
        {
          id: 3,
          venueName: 'Riverside Football Field',
          courtName: 'Field 1',
          date: '2025-08-14',
          time: '16:00',
          status: 'confirmed',
          type: 'upcoming'
        }
      ];

      setBookings(mockBookings?.slice(0, bookingCount));
    };

    if (userRole === 'sports-enthusiast' && bookingCount > 0) {
      fetchBookings();
    }
  }, [bookingCount, userRole]);

  useEffect(() => {
    // Simulate real-time booking updates
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance of update
        const updates = [
          'Your booking at Downtown Sports Complex has been confirmed!',
          'New venue available in your area',
          'Reminder: You have a booking tomorrow at 2:00 PM'
        ];
        
        addNotification({
          type: 'booking',
          message: updates?.[Math.floor(Math.random() * updates?.length)],
          timestamp: new Date()?.toISOString()
        });
      }
    }, 45000); // Check every 45 seconds

    return () => clearInterval(interval);
  }, [addNotification]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'pending':
        return { icon: 'Clock', color: 'text-warning' };
      case 'cancelled':
        return { icon: 'XCircle', color: 'text-destructive' };
      default:
        return { icon: 'Calendar', color: 'text-muted-foreground' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleBookingClick = (bookingId) => {
    window.location.href = `/my-bookings?booking=${bookingId}`;
  };

  const handleViewAll = () => {
    window.location.href = '/my-bookings';
  };

  // Only show for sports enthusiasts with bookings
  if (userRole !== 'sports-enthusiast' || bookingCount === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Quick Status Badge */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative flex items-center space-x-2 px-3 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-micro shadow-card"
      >
        <Icon name="Calendar" size={16} className="text-primary" />
        <span className="text-sm font-medium text-foreground">
          {bookingCount} Active
        </span>
        {bookingCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {bookingCount}
          </span>
        )}
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={14} 
          className="text-muted-foreground" 
        />
      </button>
      {/* Expanded Booking List */}
      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-modal py-2 z-50 animate-fade-in">
          <div className="px-4 py-2 border-b border-border">
            <h3 className="font-medium text-popover-foreground">Recent Bookings</h3>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {bookings?.map((booking) => {
              const statusInfo = getStatusIcon(booking?.status);
              return (
                <button
                  key={booking?.id}
                  onClick={() => handleBookingClick(booking?.id)}
                  className="w-full px-4 py-3 hover:bg-muted transition-micro text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-popover-foreground truncate">
                        {booking?.venueName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {booking?.courtName}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(booking?.date)} at {booking?.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <Icon 
                        name={statusInfo?.icon} 
                        size={14} 
                        className={statusInfo?.color} 
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-4 py-2 border-t border-border">
            <button
              onClick={handleViewAll}
              className="w-full text-sm text-primary hover:text-primary/80 transition-micro font-medium"
            >
              View All Bookings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingStatusIndicator;