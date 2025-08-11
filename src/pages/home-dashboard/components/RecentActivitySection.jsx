import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentActivitySection = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingBookings = [
    {
      id: 1,
      venueName: "Downtown Sports Complex",
      courtName: "Basketball Court A",
      date: "2025-08-12",
      time: "14:00 - 16:00",
      status: "confirmed",
      price: 50,
      sport: "Basketball",
      canModify: true,
      canCancel: true
    },
    {
      id: 2,
      venueName: "City Tennis Club",
      courtName: "Tennis Court 2",
      date: "2025-08-13",
      time: "10:00 - 11:30",
      status: "pending",
      price: 45,
      sport: "Tennis",
      canModify: false,
      canCancel: true
    },
    {
      id: 3,
      venueName: "Elite Fitness Courts",
      courtName: "Volleyball Court 1",
      date: "2025-08-15",
      time: "18:00 - 20:00",
      status: "confirmed",
      price: 60,
      sport: "Volleyball",
      canModify: true,
      canCancel: true
    }
  ];

  const recentSearches = [
    {
      id: 1,
      query: "Tennis courts near downtown",
      timestamp: "2025-08-11 07:30",
      resultsCount: 12,
      sport: "Tennis"
    },
    {
      id: 2,
      query: "Basketball courts weekend",
      timestamp: "2025-08-10 15:45",
      resultsCount: 8,
      sport: "Basketball"
    },
    {
      id: 3,
      query: "Badminton courts under $30",
      timestamp: "2025-08-09 20:15",
      resultsCount: 15,
      sport: "Badminton"
    }
  ];

  const bookingHistory = [
    {
      id: 1,
      venueName: "Riverside Football Field",
      courtName: "Field 1",
      date: "2025-08-08",
      time: "16:00 - 18:00",
      status: "completed",
      price: 90,
      sport: "Football",
      rating: 5
    },
    {
      id: 2,
      venueName: "Community Sports Hub",
      courtName: "Badminton Court 3",
      date: "2025-08-05",
      time: "19:00 - 20:30",
      status: "completed",
      price: 30,
      sport: "Badminton",
      rating: 4
    },
    {
      id: 3,
      venueName: "Premium Racquet Club",
      courtName: "Squash Court 1",
      date: "2025-08-03",
      time: "12:00 - 13:00",
      status: "cancelled",
      price: 50,
      sport: "Squash",
      rating: null
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'pending':
        return { icon: 'Clock', color: 'text-warning' };
      case 'completed':
        return { icon: 'CheckCircle2', color: 'text-success' };
      case 'cancelled':
        return { icon: 'XCircle', color: 'text-destructive' };
      default:
        return { icon: 'Calendar', color: 'text-muted-foreground' };
    }
  };

  const getSportIcon = (sport) => {
    const sportIcons = {
      'Basketball': 'Circle',
      'Tennis': 'Circle',
      'Football': 'Circle',
      'Volleyball': 'Circle',
      'Badminton': 'Circle',
      'Squash': 'Circle'
    };
    return sportIcons?.[sport] || 'Circle';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow?.setDate(tomorrow?.getDate() + 1);

    if (date?.toDateString() === today?.toDateString()) {
      return 'Today';
    } else if (date?.toDateString() === tomorrow?.toDateString()) {
      return 'Tomorrow';
    } else {
      return date?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date?.getFullYear() !== today?.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  const handleBookingAction = (bookingId, action) => {
    if (action === 'modify') {
      window.location.href = `/court-booking-flow?booking=${bookingId}&action=modify`;
    } else if (action === 'cancel') {
      // Handle cancellation
      console.log(`Cancel booking ${bookingId}`);
    } else if (action === 'view') {
      window.location.href = `/my-bookings?booking=${bookingId}`;
    }
  };

  const handleSearchAgain = (query) => {
    window.location.href = `/venues-listing?search=${encodeURIComponent(query)}`;
  };

  const handleRateBooking = (bookingId) => {
    window.location.href = `/my-bookings?booking=${bookingId}&action=rate`;
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars?.push(
        <Icon
          key={i}
          name="Star"
          size={12}
          className={i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
        />
      );
    }
    return <div className="flex items-center space-x-1">{stars}</div>;
  };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: upcomingBookings?.length },
    { id: 'searches', label: 'Recent Searches', count: recentSearches?.length },
    { id: 'history', label: 'History', count: bookingHistory?.length }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">My Recent Activity</h2>
          <p className="text-muted-foreground">Track your bookings and activity</p>
        </div>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/my-bookings'}
          iconName="ExternalLink"
          iconPosition="right"
        >
          View All
        </Button>
      </div>
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-micro ${
              activeTab === tab?.id
                ? 'bg-card text-foreground shadow-card'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>{tab?.label}</span>
            <span className="bg-muted-foreground/20 text-xs px-2 py-1 rounded-full">
              {tab?.count}
            </span>
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'upcoming' && (
          <>
            {upcomingBookings?.length > 0 ? (
              upcomingBookings?.map((booking) => {
                const statusInfo = getStatusIcon(booking?.status);
                return (
                  <div
                    key={booking?.id}
                    className="bg-card border border-border rounded-lg p-4 hover:shadow-card transition-micro"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon 
                            name={getSportIcon(booking?.sport)} 
                            size={16} 
                            className="text-primary" 
                          />
                          <h3 className="font-semibold text-foreground">{booking?.venueName}</h3>
                          <Icon 
                            name={statusInfo?.icon} 
                            size={16} 
                            className={statusInfo?.color} 
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{booking?.courtName}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Icon name="Calendar" size={14} className="mr-1" />
                            {formatDate(booking?.date)}
                          </span>
                          <span className="flex items-center">
                            <Icon name="Clock" size={14} className="mr-1" />
                            {booking?.time}
                          </span>
                          <span className="flex items-center font-semibold text-foreground">
                            <Icon name="DollarSign" size={14} className="mr-1" />
                            {booking?.price}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBookingAction(booking?.id, 'view')}
                        >
                          View
                        </Button>
                        {booking?.canModify && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBookingAction(booking?.id, 'modify')}
                          >
                            Modify
                          </Button>
                        )}
                        {booking?.canCancel && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBookingAction(booking?.id, 'cancel')}
                            className="text-destructive hover:text-destructive"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No upcoming bookings</p>
                <Button
                  variant="default"
                  onClick={() => window.location.href = '/venues-listing'}
                >
                  Book a Venue
                </Button>
              </div>
            )}
          </>
        )}

        {activeTab === 'searches' && (
          <>
            {recentSearches?.map((search) => (
              <div
                key={search?.id}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-card transition-micro"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Search" size={16} className="text-primary" />
                      <h3 className="font-medium text-foreground">{search?.query}</h3>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Icon name="Clock" size={14} className="mr-1" />
                        {formatTime(search?.timestamp)}
                      </span>
                      <span className="flex items-center">
                        <Icon name="MapPin" size={14} className="mr-1" />
                        {search?.resultsCount} venues found
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearchAgain(search?.query)}
                    iconName="RotateCcw"
                    iconPosition="left"
                  >
                    Search Again
                  </Button>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'history' && (
          <>
            {bookingHistory?.map((booking) => {
              const statusInfo = getStatusIcon(booking?.status);
              return (
                <div
                  key={booking?.id}
                  className="bg-card border border-border rounded-lg p-4 hover:shadow-card transition-micro"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon 
                          name={getSportIcon(booking?.sport)} 
                          size={16} 
                          className="text-primary" 
                        />
                        <h3 className="font-semibold text-foreground">{booking?.venueName}</h3>
                        <Icon 
                          name={statusInfo?.icon} 
                          size={16} 
                          className={statusInfo?.color} 
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{booking?.courtName}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center">
                          <Icon name="Calendar" size={14} className="mr-1" />
                          {formatDate(booking?.date)}
                        </span>
                        <span className="flex items-center">
                          <Icon name="Clock" size={14} className="mr-1" />
                          {booking?.time}
                        </span>
                        <span className="flex items-center font-semibold text-foreground">
                          <Icon name="DollarSign" size={14} className="mr-1" />
                          {booking?.price}
                        </span>
                      </div>
                      {booking?.rating && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Your rating:</span>
                          {renderStars(booking?.rating)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {booking?.status === 'completed' && !booking?.rating && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRateBooking(booking?.id)}
                          iconName="Star"
                          iconPosition="left"
                        >
                          Rate
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.location.href = `/venue-details?id=${booking?.id}`}
                      >
                        Book Again
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default RecentActivitySection;