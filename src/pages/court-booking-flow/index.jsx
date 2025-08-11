import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import AuthenticationGuard from '../../components/ui/AuthenticationGuard';
import BookingProgressIndicator from './components/BookingProgressIndicator';
import BookingCalendar from './components/BookingCalendar';
import TimeSlotSelector from './components/TimeSlotSelector';
import BookingSummary from './components/BookingSummary';
import PaymentForm from './components/PaymentForm';
import BookingConfirmation from './components/BookingConfirmation';
import Icon from '../../components/AppIcon';
import { useNavigation } from '../../components/ui/RoleBasedNavigation';

const CourtBookingFlow = () => {
  const { userRole } = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    venueName: 'Downtown Sports Complex',
    courtName: 'Basketball Court A',
    address: '123 Sports Avenue, Downtown, NY 10001',
    selectedDate: new Date(),
    selectedSlots: [],
    duration: 60,
    userInfo: {}
  });
  const [paymentData, setPaymentData] = useState({});
  const [sessionTimeout, setSessionTimeout] = useState(1800); // 30 minutes

  // Session timeout management - no delays
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTimeout(prev => {
        if (prev <= 1) {
          alert('Session expired. Please start over.');
          window.location.href = '/venues-listing';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load venue data from URL params or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const venueId = urlParams?.get('venue');
    const courtId = urlParams?.get('court');
    
    if (venueId && courtId) {
      // In a real app, fetch venue data based on IDs
      const mockVenueData = {
        venueName: 'Downtown Sports Complex',
        courtName: 'Basketball Court A',
        address: '123 Sports Avenue, Downtown, NY 10001'
      };
      
      setBookingData(prev => ({
        ...prev,
        ...mockVenueData
      }));
    }
  }, []);

  const handleDateChange = (date) => {
    setBookingData(prev => ({
      ...prev,
      selectedDate: date,
      selectedSlots: [] // Reset slots when date changes
    }));
  };

  const handleSlotsChange = (slots) => {
    setBookingData(prev => ({
      ...prev,
      selectedSlots: slots
    }));
  };

  const handleUserInfoChange = (userInfo) => {
    setBookingData(prev => ({
      ...prev,
      userInfo
    }));
  };

  const handlePaymentSubmit = (payment) => {
    setPaymentData(payment);
    setCurrentStep(4);
  };

  const handleStepNavigation = (step) => {
    if (step < currentStep || (step === currentStep + 1 && validateCurrentStep())) {
      setCurrentStep(step);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return bookingData?.selectedDate && bookingData?.selectedSlots?.length > 0;
      case 2:
        return bookingData?.userInfo?.fullName && bookingData?.userInfo?.email && bookingData?.userInfo?.phone;
      case 3:
        return true; // Payment validation is handled in PaymentForm
      default:
        return true;
    }
  };

  const formatTimeRemaining = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds?.toString()?.padStart(2, '0')}`;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Select Date & Time
              </h1>
              <p className="text-muted-foreground">
                Choose your preferred date and time slots for {bookingData?.courtName}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BookingCalendar
                selectedDate={bookingData?.selectedDate}
                onDateChange={handleDateChange}
              />
              
              <TimeSlotSelector
                selectedDate={bookingData?.selectedDate}
                selectedSlots={bookingData?.selectedSlots}
                onSlotsChange={handleSlotsChange}
                onNext={() => handleStepNavigation(2)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Booking Details
              </h1>
              <p className="text-muted-foreground">
                Review your booking and provide your information
              </p>
            </div>
            
            <BookingSummary
              bookingData={bookingData}
              onUserInfoChange={handleUserInfoChange}
              onNext={() => handleStepNavigation(3)}
              onBack={() => handleStepNavigation(1)}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Payment
              </h1>
              <p className="text-muted-foreground">
                Complete your booking with secure payment
              </p>
            </div>
            
            <PaymentForm
              bookingData={bookingData}
              onPaymentSubmit={handlePaymentSubmit}
              onBack={() => handleStepNavigation(2)}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <BookingConfirmation
              bookingData={bookingData}
              paymentData={paymentData}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AuthenticationGuard>
      <div className="min-h-screen bg-background flex flex-col">
        <Header userRole={userRole} isAuthenticated={true} bookingCount={2} />
        
        <div className="flex-1 pt-16">
          <BookingProgressIndicator currentStep={currentStep} />
          
          {/* Session Timer */}
          {currentStep < 4 && sessionTimeout > 0 && (
            <div className="bg-warning/10 border-b border-warning/20 px-4 py-2">
              <div className="max-w-4xl mx-auto flex items-center justify-center space-x-2">
                <Icon name="Clock" size={16} className="text-warning" />
                <span className="text-sm text-warning">
                  Session expires in {formatTimeRemaining(sessionTimeout)}
                </span>
              </div>
            </div>
          )}

          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderStepContent()}
          </main>
        </div>
        
        <Footer />
      </div>
    </AuthenticationGuard>
  );
};

export default CourtBookingFlow;