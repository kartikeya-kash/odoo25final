import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PaymentMethodsSection = ({ paymentMethods, onUpdate }) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    isDefault: false
  });
  const [errors, setErrors] = useState({});

  const getCardIcon = (type) => {
    const icons = {
      visa: 'CreditCard',
      mastercard: 'CreditCard',
      amex: 'CreditCard',
      discover: 'CreditCard'
    };
    return icons?.[type] || 'CreditCard';
  };

  const getCardColor = (type) => {
    const colors = {
      visa: 'bg-blue-600',
      mastercard: 'bg-red-600',
      amex: 'bg-green-600',
      discover: 'bg-orange-600'
    };
    return colors?.[type] || 'bg-gray-600';
  };

  const handleInputChange = (field, value) => {
    setNewCard(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateCard = () => {
    const newErrors = {};
    
    if (!newCard?.cardNumber?.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required';
    } else if (newCard?.cardNumber?.replace(/\s/g, '')?.length < 16) {
      newErrors.cardNumber = 'Invalid card number';
    }
    
    if (!newCard?.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }
    
    if (!newCard?.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (newCard?.cvv?.length < 3) {
      newErrors.cvv = 'Invalid CVV';
    }
    
    if (!newCard?.cardholderName?.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleAddCard = () => {
    if (validateCard()) {
      const cardData = {
        id: Date.now()?.toString(),
        ...newCard,
        type: 'visa', // Mock card type detection
        lastFour: newCard?.cardNumber?.slice(-4)
      };
      
      onUpdate([...paymentMethods, cardData]);
      setNewCard({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        isDefault: false
      });
      setIsAddingCard(false);
    }
  };

  const handleRemoveCard = (cardId) => {
    onUpdate(paymentMethods?.filter(card => card?.id !== cardId));
  };

  const handleSetDefault = (cardId) => {
    const updatedMethods = paymentMethods?.map(card => ({
      ...card,
      isDefault: card?.id === cardId
    }));
    onUpdate(updatedMethods);
  };

  const formatCardNumber = (value) => {
    const v = value?.replace(/\s+/g, '')?.replace(/[^0-9]/gi, '');
    const matches = v?.match(/\d{4,16}/g);
    const match = matches && matches?.[0] || '';
    const parts = [];
    for (let i = 0, len = match?.length; i < len; i += 4) {
      parts?.push(match?.substring(i, i + 4));
    }
    if (parts?.length) {
      return parts?.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
          <Icon name="CreditCard" size={20} className="text-primary" />
          <span>Payment Methods</span>
        </h2>
        {!isAddingCard && (
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => setIsAddingCard(true)}
          >
            Add Card
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {/* Existing Cards */}
        {paymentMethods?.map(card => (
          <div key={card?.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-8 rounded flex items-center justify-center ${getCardColor(card?.type)}`}>
                <Icon name={getCardIcon(card?.type)} size={16} color="white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-foreground">
                    •••• •••• •••• {card?.lastFour}
                  </span>
                  {card?.isDefault && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {card?.cardholderName} • Expires {card?.expiryDate}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {!card?.isDefault && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSetDefault(card?.id)}
                >
                  Set Default
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                iconName="Trash2"
                onClick={() => handleRemoveCard(card?.id)}
                className="text-destructive hover:text-destructive"
              >
              </Button>
            </div>
          </div>
        ))}

        {/* Add New Card Form */}
        {isAddingCard && (
          <div className="p-4 border-2 border-dashed border-border rounded-lg">
            <h3 className="text-lg font-medium text-foreground mb-4">Add New Card</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Card Number"
                  type="text"
                  value={newCard?.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e?.target?.value))}
                  error={errors?.cardNumber}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>
              
              <Input
                label="Cardholder Name"
                type="text"
                value={newCard?.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e?.target?.value)}
                error={errors?.cardholderName}
                placeholder="John Doe"
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry Date"
                  type="text"
                  value={newCard?.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e?.target?.value)}
                  error={errors?.expiryDate}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
                
                <Input
                  label="CVV"
                  type="text"
                  value={newCard?.cvv}
                  onChange={(e) => handleInputChange('cvv', e?.target?.value)}
                  error={errors?.cvv}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCard({
                    cardNumber: '',
                    expiryDate: '',
                    cvv: '',
                    cardholderName: '',
                    isDefault: false
                  });
                  setErrors({});
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleAddCard}
              >
                Add Card
              </Button>
            </div>
          </div>
        )}

        {paymentMethods?.length === 0 && !isAddingCard && (
          <div className="text-center py-8">
            <Icon name="CreditCard" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No payment methods added yet</p>
            <Button
              variant="outline"
              iconName="Plus"
              iconPosition="left"
              onClick={() => setIsAddingCard(true)}
            >
              Add Your First Card
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodsSection;