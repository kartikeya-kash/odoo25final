import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';

const BookingCard = ({ booking, onModify, onCancel, onReview, onRebook, onCheckIn }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeUntilBooking, setTimeUntilBooking] = useState('');

  useEffect(() => {
    if (booking?.status === 'upcoming') {
      const updateCountdown = () => {
        const now = new Date();
        const bookingDateTime = new Date(`${booking.date} ${booking.time}`);
        const timeDiff = bookingDateTime?.getTime() - now?.getTime();

        if (timeDiff > 0) {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

          if (days > 0) {
            setTimeUntilBooking(`${days}d ${hours}h`);
          } else if (hours > 0) {
            setTimeUntilBooking(`${hours}h ${minutes}m`);
          } else {
            setTimeUntilBooking(`${minutes}m`);
          }
        } else {
          setTimeUntilBooking('Now');
        }
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 60000);
      return () => clearInterval(interval);
    }
  }, [booking?.date, booking?.time, booking?.status]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'upcoming':
        return {
          color: 'bg-primary text-primary-foreground',
          icon: 'Calendar',
          label: 'Upcoming'
        };
      case 'completed':
        return {
          color: 'bg-success text-success-foreground',
          icon: 'CheckCircle',
          label: 'Completed'
        };
      case 'cancelled':
        return {
          color: 'bg-destructive text-destructive-foreground',
          icon: 'XCircle',
          label: 'Cancelled'
        };
      case 'pending':
        return {
          color: 'bg-warning text-warning-foreground',
          icon: 'Clock',
          label: 'Pending'
        };
      default:
        return {
          color: 'bg-muted text-muted-foreground',
          icon: 'Calendar',
          label: status
        };
    }
  };

  const statusConfig = getStatusConfig(booking?.status);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString?.split(':');
    const date = new Date();
    date?.setHours(parseInt(hours), parseInt(minutes));
    return date?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const canModify = booking?.status === 'upcoming' || booking?.status === 'pending';
  const canCancel = booking?.status === 'upcoming' || booking?.status === 'pending';
  const canReview = booking?.status === 'completed' && !booking?.hasReviewed;
  const canRebook = booking?.status === 'completed' || booking?.status === 'cancelled';
  const canCheckIn = booking?.status === 'upcoming' && timeUntilBooking === 'Now';

  return (
    <div className="bg-card border border-border rounded-lg shadow-card hover:shadow-modal transition-state overflow-hidden">
      {/* Main Card Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {booking?.venueName}
              </h3>
              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig?.color}`}>
                <Icon name={statusConfig?.icon} size={12} />
                <span>{statusConfig?.label}</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              {booking?.courtName} • {booking?.sportType}
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} />
                <span>{formatDate(booking?.date)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} />
                <span>{formatTime(booking?.time)} ({booking?.duration})</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2 ml-4">
            <div className="text-right">
              <p className="text-lg font-semibold text-foreground">${booking?.totalAmount}</p>
              {booking?.status === 'upcoming' && timeUntilBooking && (
                <p className="text-xs text-primary font-medium">
                  {timeUntilBooking === 'Now' ? 'Check-in available' : `in ${timeUntilBooking}`}
                </p>
              )}
            </div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-muted transition-micro"
            >
              <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {canCheckIn && (
            <Button
              variant="default"
              size="sm"
              iconName="MapPin"
              iconPosition="left"
              onClick={() => onCheckIn(booking?.id)}
            >
              Check In
            </Button>
          )}
          
          {canModify && (
            <Button
              variant="outline"
              size="sm"
              iconName="Edit"
              iconPosition="left"
              onClick={() => onModify(booking?.id)}
            >
              Modify
            </Button>
          )}
          
          {canCancel && (
            <Button
              variant="destructive"
              size="sm"
              iconName="X"
              iconPosition="left"
              onClick={() => onCancel(booking?.id)}
            >
              Cancel
            </Button>
          )}
          
          {canReview && (
            <Button
              variant="outline"
              size="sm"
              iconName="Star"
              iconPosition="left"
              onClick={() => onReview(booking?.id)}
            >
              Review
            </Button>
          )}
          
          {canRebook && (
            <Button
              variant="ghost"
              size="sm"
              iconName="RotateCcw"
              iconPosition="left"
              onClick={() => onRebook(booking?.id)}
            >
              Book Again
            </Button>
          )}
        </div>
      </div>
      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border bg-muted/30 p-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Booking Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking ID:</span>
                  <span className="text-foreground font-mono">{booking?.bookingReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Players:</span>
                  <span className="text-foreground">{booking?.playerCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Court Fee:</span>
                  <span className="text-foreground">${booking?.courtFee}</span>
                </div>
                {booking?.additionalServices && booking?.additionalServices?.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Add-ons:</span>
                    <span className="text-foreground">${booking?.additionalServicesFee}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Venue Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <Icon name="MapPin" size={14} className="text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">{booking?.venueAddress}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Phone" size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">{booking?.venuePhone}</span>
                </div>
                {booking?.specialInstructions && (
                  <div className="flex items-start space-x-2">
                    <Icon name="Info" size={14} className="text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">{booking?.specialInstructions}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {booking?.cancellationPolicy && (
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="font-medium text-foreground mb-2">Cancellation Policy</h4>
              <p className="text-sm text-muted-foreground">{booking?.cancellationPolicy}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingCard;