import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PaymentForm = ({ bookingData, onPaymentSubmit, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [billingAddress, setBillingAddress] = useState({
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States'
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCardInfoChange = (field, value) => {
    let formattedValue = value;
    
    // Format card number
    if (field === 'cardNumber') {
      formattedValue = value?.replace(/\s/g, '')?.replace(/(.{4})/g, '$1 ')?.trim();
      if (formattedValue?.length > 19) formattedValue = formattedValue?.slice(0, 19);
    }
    
    // Format expiry date
    if (field === 'expiryDate') {
      formattedValue = value?.replace(/\D/g, '')?.replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue?.length > 5) formattedValue = formattedValue?.slice(0, 5);
    }
    
    // Format CVV
    if (field === 'cvv') {
      formattedValue = value?.replace(/\D/g, '')?.slice(0, 4);
    }
    
    setCardInfo(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBillingChange = (field, value) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }));
    
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validatePayment = () => {
    const newErrors = {};
    
    if (paymentMethod === 'card') {
      if (!cardInfo?.cardNumber?.replace(/\s/g, '') || cardInfo?.cardNumber?.replace(/\s/g, '')?.length < 16) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }
      
      if (!cardInfo?.expiryDate || cardInfo?.expiryDate?.length < 5) {
        newErrors.expiryDate = 'Please enter a valid expiry date';
      }
      
      if (!cardInfo?.cvv || cardInfo?.cvv?.length < 3) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
      
      if (!cardInfo?.cardholderName?.trim()) {
        newErrors.cardholderName = 'Cardholder name is required';
      }
    }
    
    if (!billingAddress?.address?.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!billingAddress?.city?.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!billingAddress?.zipCode?.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validatePayment()) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSubmit({
        paymentMethod,
        cardInfo: paymentMethod === 'card' ? cardInfo : null,
        billingAddress
      });
    }, 2000);
  };

  const calculateTotal = () => {
    const subtotal = bookingData?.selectedSlots?.reduce((total, slot) => {
      return total + (slot?.price || 35);
    }, 0);
    const tax = subtotal * 0.08;
    const serviceFee = 5.99;
    return subtotal + tax + serviceFee;
  };

  const total = calculateTotal();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Payment Methods */}
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Payment Method</h3>
          
          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-4 border-2 rounded-lg transition-all duration-200 ${
                paymentMethod === 'card' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  paymentMethod === 'card' ? 'border-primary bg-primary' : 'border-border'
                }`}>
                  {paymentMethod === 'card' && (
                    <div className="w-full h-full rounded-full bg-primary"></div>
                  )}
                </div>
                <Icon name="CreditCard" size={20} className="text-foreground" />
                <span className="font-medium text-foreground">Credit/Debit Card</span>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('paypal')}
              className={`w-full p-4 border-2 rounded-lg transition-all duration-200 ${
                paymentMethod === 'paypal' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  paymentMethod === 'paypal' ? 'border-primary bg-primary' : 'border-border'
                }`}>
                  {paymentMethod === 'paypal' && (
                    <div className="w-full h-full rounded-full bg-primary"></div>
                  )}
                </div>
                <Icon name="Wallet" size={20} className="text-foreground" />
                <span className="font-medium text-foreground">PayPal</span>
              </div>
            </button>
          </div>
        </div>

        {/* Card Information */}
        {paymentMethod === 'card' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Card Information</h3>
            
            <div className="space-y-4">
              <Input
                label="Card Number"
                type="text"
                value={cardInfo?.cardNumber}
                onChange={(e) => handleCardInfoChange('cardNumber', e?.target?.value)}
                error={errors?.cardNumber}
                placeholder="1234 5678 9012 3456"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry Date"
                  type="text"
                  value={cardInfo?.expiryDate}
                  onChange={(e) => handleCardInfoChange('expiryDate', e?.target?.value)}
                  error={errors?.expiryDate}
                  placeholder="MM/YY"
                  required
                />

                <Input
                  label="CVV"
                  type="text"
                  value={cardInfo?.cvv}
                  onChange={(e) => handleCardInfoChange('cvv', e?.target?.value)}
                  error={errors?.cvv}
                  placeholder="123"
                  required
                />
              </div>

              <Input
                label="Cardholder Name"
                type="text"
                value={cardInfo?.cardholderName}
                onChange={(e) => handleCardInfoChange('cardholderName', e?.target?.value)}
                error={errors?.cardholderName}
                placeholder="John Smith"
                required
              />
            </div>
          </div>
        )}

        {/* Billing Address */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Billing Address</h3>
          
          <div className="space-y-4">
            <Input
              label="Address"
              type="text"
              value={billingAddress?.address}
              onChange={(e) => handleBillingChange('address', e?.target?.value)}
              error={errors?.address}
              placeholder="123 Main Street"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                type="text"
                value={billingAddress?.city}
                onChange={(e) => handleBillingChange('city', e?.target?.value)}
                error={errors?.city}
                placeholder="New York"
                required
              />

              <Input
                label="State"
                type="text"
                value={billingAddress?.state}
                onChange={(e) => handleBillingChange('state', e?.target?.value)}
                placeholder="NY"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="ZIP Code"
                type="text"
                value={billingAddress?.zipCode}
                onChange={(e) => handleBillingChange('zipCode', e?.target?.value)}
                error={errors?.zipCode}
                placeholder="10001"
                required
              />

              <Input
                label="Country"
                type="text"
                value={billingAddress?.country}
                onChange={(e) => handleBillingChange('country', e?.target?.value)}
                placeholder="United States"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Order Summary */}
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 sticky top-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Order Summary</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Icon name="MapPin" size={20} className="text-primary mt-1" />
              <div>
                <p className="font-medium text-foreground">{bookingData?.venueName}</p>
                <p className="text-sm text-muted-foreground">{bookingData?.courtName}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Icon name="Calendar" size={20} className="text-primary" />
              <div>
                <p className="font-medium text-foreground">
                  {new Date(bookingData.selectedDate)?.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {bookingData?.selectedSlots?.map(slot => slot?.time || slot)?.join(', ')}
                </p>
              </div>
            </div>

            <hr className="border-border" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${(total - total * 0.08 - 5.99)?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service fee</span>
                <span className="text-foreground">$5.99</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">${(total * 0.08)?.toFixed(2)}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">${total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="mt-6 p-4 bg-success/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">Secure Payment</span>
            </div>
            <p className="text-xs text-success/80 mt-1">
              Your payment information is encrypted and secure
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-6">
            <Button
              variant="default"
              onClick={handleSubmit}
              loading={isProcessing}
              iconName="Lock"
              iconPosition="left"
              fullWidth
            >
              {isProcessing ? 'Processing Payment...' : `Pay $${total?.toFixed(2)}`}
            </Button>
            <Button
              variant="outline"
              onClick={onBack}
              iconName="ArrowLeft"
              iconPosition="left"
              fullWidth
            >
              Back to Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;