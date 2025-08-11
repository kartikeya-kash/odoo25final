import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { bookingAPI } from '../../../utils/api';

const BookingConfirmation = ({ bookingData, onConfirm, onModify, setIsAddingToCalendar, paymentData, isAddingToCalendar }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const handleConfirmBooking = async () => {
    setBookingError('');
    setIsProcessing(true);

    try {
      console.log('📅 Processing booking confirmation');

      // Prepare comprehensive booking data for the new API endpoint
      const newBookingData = {
        // Venue and Court Information
        venueId: bookingData?.venue?.id,
        courtId: bookingData?.court?.id,
        sport: bookingData?.sport || bookingData?.venue?.defaultSport,

        // Booking Time Details
        date: bookingData?.date,
        timeSlot: {
          start: bookingData?.timeSlot?.start,
          end: bookingData?.timeSlot?.end
        },
        duration: bookingData?.duration || 1,

        // Customer Information
        customerInfo: {
          name: bookingData?.customerInfo?.name,
          email: bookingData?.customerInfo?.email,
          phone: bookingData?.customerInfo?.phone,
          specialRequests: bookingData?.customerInfo?.specialRequests || ''
        },

        // Payment Information
        paymentInfo: {
          method: bookingData?.paymentInfo?.method || 'card',
          amount: bookingData?.totalAmount || bookingData?.venue?.hourlyRate,
          currency: 'USD',
          paymentIntentId: bookingData?.paymentInfo?.paymentIntentId || null
        },

        // Additional metadata
        facilityOwnerId: bookingData?.venue?.ownerId || null
      };

      // Call the new /newbooking endpoint
      const bookingResponse = await bookingAPI?.createNewBooking?.(newBookingData);

      if (bookingResponse?.booking_id) {
        console.log('✅ Booking created successfully:', {
          bookingId: bookingResponse?.booking_id,
          confirmationNumber: bookingResponse?.confirmation_number,
          status: bookingResponse?.status
        });

        setBookingSuccess({
          bookingId: bookingResponse?.booking_id,
          confirmationNumber: bookingResponse?.confirmation_number,
          status: bookingResponse?.status,
          paymentStatus: bookingResponse?.payment_info?.payment_status
        });

        // Call parent confirmation callback
        onConfirm?.(bookingResponse);

        // Auto-redirect to bookings page after successful booking
        setTimeout(() => {
          window.location.href = '/my-bookings';
        }, 3000);

      }

    } catch (error) {
      console.error('❌ Booking confirmation failed:', error?.message);
      setBookingError(error?.message || 'Failed to confirm booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const bookingReference = `QC${Date.now()?.toString()?.slice(-6)}`;

  const formatDate = (date) => {
    if (!date) return 'Date not available';
    try {
      return new Date(date)?.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  const handleAddToCalendar = () => {
    setIsAddingToCalendar?.(true);

    // Simulate calendar integration
    setTimeout(() => {
      setIsAddingToCalendar?.(false);
      // In a real app, this would integrate with calendar APIs
      alert('Event added to calendar successfully!');
    }, 1500);
  };

  const handleDownloadReceipt = () => {
    // Simulate receipt download
    const receiptData = {
      bookingReference,
      venue: bookingData?.venueName,
      court: bookingData?.courtName,
      date: formatDate(bookingData?.selectedDate),
      time: bookingData?.selectedSlots?.map((slot) => slot?.time || slot)?.join(', ') || 'Time not available',
      total: (bookingData?.selectedSlots?.reduce((total, slot) => total + (slot?.price || 35), 0) * 1.08 + 5.99)?.toFixed(2)
    };

    console.log('Downloading receipt:', receiptData);
    alert('Receipt downloaded successfully!');
  };

  const handleShareBooking = () => {
    const shareText = `I just booked ${bookingData?.courtName} at ${bookingData?.venueName} for ${formatDate(bookingData?.selectedDate)}. Join me for a game!`;

    if (navigator?.share) {
      navigator.share({
        title: 'Court Booking Confirmation',
        text: shareText,
        url: window.location?.origin
      });
    } else {
      // Fallback for browsers without Web Share API
      navigator?.clipboard?.writeText(shareText);
      alert('Booking details copied to clipboard!');
    }
  };

  const total = bookingData?.selectedSlots?.reduce((total, slot) => {
    return total + (slot?.price || 35);
  }, 0) * 1.08 + 5.99;

  if (bookingSuccess) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <div className="text-center">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Check" size={32} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-4">
            Your booking has been successfully created
          </p>
          
          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-foreground">Booking ID:</span>
                <p className="text-muted-foreground">{bookingSuccess?.bookingId}</p>
              </div>
              <div>
                <span className="font-medium text-foreground">Confirmation:</span>
                <p className="text-muted-foreground">{bookingSuccess?.confirmationNumber}</p>
              </div>
              <div>
                <span className="font-medium text-foreground">Status:</span>
                <p className="text-success capitalize">{bookingSuccess?.status}</p>
              </div>
              <div>
                <span className="font-medium text-foreground">Payment:</span>
                <p className="text-muted-foreground capitalize">{bookingSuccess?.paymentStatus}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button
              variant="default"
              iconName="Calendar"
              iconPosition="left"
              onClick={() => window.location.href = '/my-bookings'}>
              View My Bookings
            </Button>
            <p className="text-xs text-muted-foreground">
              Redirecting to your bookings in 3 seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
          <Icon name="CheckCircle" size={40} className="text-success" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Your court has been successfully reserved
          </p>
        </div>
      </div>

      {/* Booking Reference */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
        <p className="text-sm font-medium text-primary mb-2">Booking Reference</p>
        <p className="text-2xl font-bold text-primary">{bookingReference}</p>
        <p className="text-xs text-primary/80 mt-2">
          Save this reference number for your records
        </p>
      </div>

      {/* Booking Details */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Booking Details</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Icon name="MapPin" size={20} className="text-primary mt-1" />
            <div>
              <p className="font-medium text-foreground">{bookingData?.venueName || 'Venue name not available'}</p>
              <p className="text-sm text-muted-foreground">{bookingData?.courtName || 'Court name not available'}</p>
              <p className="text-sm text-muted-foreground">{bookingData?.address || 'Address not available'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Icon name="Calendar" size={20} className="text-primary" />
            <div>
              <p className="font-medium text-foreground">{formatDate(bookingData?.selectedDate)}</p>
              <p className="text-sm text-muted-foreground">
                {bookingData?.selectedSlots?.map((slot) => slot?.time || slot)?.join(', ') || 'Time slots not available'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Icon name="Clock" size={20} className="text-primary" />
            <div>
              <p className="font-medium text-foreground">Duration: {bookingData?.duration || 'Not specified'} minutes</p>
              <p className="text-sm text-muted-foreground">
                Please arrive 10 minutes early
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Icon name="DollarSign" size={20} className="text-primary" />
            <div>
              <p className="font-medium text-foreground">Total Paid: ${total?.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                Payment via {paymentData?.paymentMethod === 'card' ? 'Credit Card' : 'PayPal'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Venue Contact</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Icon name="Phone" size={18} className="text-primary" />
            <span className="text-foreground">+1 (555) 987-6543</span>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="Mail" size={18} className="text-primary" />
            <span className="text-foreground">info@downtownsports.com</span>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="Globe" size={18} className="text-primary" />
            <span className="text-foreground">www.downtownsports.com</span>
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={20} className="text-warning mt-1" />
          <div>
            <h4 className="font-medium text-warning mb-2">Important Information</h4>
            <ul className="text-sm text-warning/80 space-y-1">
              <li>• Please bring a valid ID for verification</li>
              <li>• Cancellations must be made at least 24 hours in advance</li>
              <li>• Court equipment is available for rent at the venue</li>
              <li>• Follow venue rules and safety guidelines</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          variant="default"
          onClick={handleAddToCalendar}
          loading={isAddingToCalendar}
          iconName="Calendar"
          iconPosition="left"
          fullWidth>
          Add to Calendar
        </Button>
        
        <Button
          variant="outline"
          onClick={handleDownloadReceipt}
          iconName="Download"
          iconPosition="left"
          fullWidth>
          Download Receipt
        </Button>
        
        <Button
          variant="outline"
          onClick={handleShareBooking}
          iconName="Share"
          iconPosition="left"
          fullWidth>
          Share Booking
        </Button>
        
        <Button
          variant="outline"
          onClick={() => window.location.href = '/my-bookings'}
          iconName="Calendar"
          iconPosition="left"
          fullWidth>
          View My Bookings
        </Button>
      </div>

      {/* Next Steps */}
      <div className="text-center space-y-4">
        <h4 className="font-medium text-foreground">What's Next?</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <Icon name="Bell" size={24} className="text-primary mx-auto" />
            <p className="text-muted-foreground">
              You'll receive a reminder 24 hours before your booking
            </p>
          </div>
          <div className="space-y-2">
            <Icon name="MapPin" size={24} className="text-primary mx-auto" />
            <p className="text-muted-foreground">
              Get directions and parking information from the venue
            </p>
          </div>
          <div className="space-y-2">
            <Icon name="Star" size={24} className="text-primary mx-auto" />
            <p className="text-muted-foreground">
              Rate your experience after your visit
            </p>
          </div>
        </div>
      </div>

      {/* Return to Home */}
      <div className="text-center pt-4">
        <Button
          variant="ghost"
          onClick={() => window.location.href = '/home-dashboard'}
          iconName="Home"
          iconPosition="left">
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;