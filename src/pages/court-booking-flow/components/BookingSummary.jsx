import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const BookingSummary = ({ bookingData, onUserInfoChange, onNext, onBack }) => {
  const [userInfo, setUserInfo] = useState({
    fullName: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    specialRequests: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
    onUserInfoChange({ ...userInfo, [field]: value });
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!userInfo?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!userInfo?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(userInfo?.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!userInfo?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateSubtotal = () => {
    return bookingData?.selectedSlots?.reduce((total, slot) => {
      return total + (slot?.price || 35);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.08;
  const serviceFee = 5.99;
  const total = subtotal + tax + serviceFee;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Booking Summary */}
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Booking Summary</h3>
          
          {/* Venue Info */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Icon name="MapPin" size={20} className="text-primary mt-1" />
              <div>
                <p className="font-medium text-foreground">{bookingData?.venueName}</p>
                <p className="text-sm text-muted-foreground">{bookingData?.courtName}</p>
                <p className="text-sm text-muted-foreground">{bookingData?.address}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Icon name="Calendar" size={20} className="text-primary" />
              <div>
                <p className="font-medium text-foreground">{formatDate(bookingData?.selectedDate)}</p>
                <p className="text-sm text-muted-foreground">
                  {bookingData?.selectedSlots?.length} time slot{bookingData?.selectedSlots?.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Icon name="Clock" size={20} className="text-primary" />
              <div>
                <p className="font-medium text-foreground">
                  {bookingData?.selectedSlots?.map(slot => slot?.time || slot)?.join(', ')}
                </p>
                <p className="text-sm text-muted-foreground">
                  Duration: {bookingData?.duration} minutes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Price Breakdown</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Court rental</span>
              <span className="text-foreground">${subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service fee</span>
              <span className="text-foreground">${serviceFee?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (8%)</span>
              <span className="text-foreground">${tax?.toFixed(2)}</span>
            </div>
            <hr className="border-border" />
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">${total?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      {/* User Information Form */}
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Your Information</h3>
          
          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={userInfo?.fullName}
              onChange={(e) => handleInputChange('fullName', e?.target?.value)}
              error={errors?.fullName}
              required
              placeholder="Enter your full name"
            />

            <Input
              label="Email Address"
              type="email"
              value={userInfo?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              error={errors?.email}
              required
              placeholder="Enter your email"
            />

            <Input
              label="Phone Number"
              type="tel"
              value={userInfo?.phone}
              onChange={(e) => handleInputChange('phone', e?.target?.value)}
              error={errors?.phone}
              required
              placeholder="Enter your phone number"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Special Requests (Optional)
              </label>
              <textarea
                value={userInfo?.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e?.target?.value)}
                placeholder="Any special requirements or requests..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">
                By proceeding, you agree to our Terms of Service and Cancellation Policy.
              </p>
              <ul className="space-y-1 text-xs">
                <li>• Cancellations must be made at least 24 hours in advance</li>
                <li>• No-shows will be charged the full amount</li>
                <li>• Refunds are processed within 3-5 business days</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            iconName="ArrowLeft"
            iconPosition="left"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            variant="default"
            onClick={handleNext}
            iconName="ArrowRight"
            iconPosition="right"
            className="flex-1"
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;