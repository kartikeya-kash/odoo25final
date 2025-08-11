import React from 'react';
import Icon from '../../../components/AppIcon';

const BookingProgressIndicator = ({ currentStep, totalSteps = 4 }) => {
  const steps = [
    { id: 1, label: 'Select Time', icon: 'Calendar' },
    { id: 2, label: 'Booking Details', icon: 'FileText' },
    { id: 3, label: 'Payment', icon: 'CreditCard' },
    { id: 4, label: 'Confirmation', icon: 'CheckCircle' }
  ];

  return (
    <div className="w-full bg-card border-b border-border p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {steps?.map((step, index) => (
            <React.Fragment key={step?.id}>
              <div className="flex flex-col items-center space-y-2">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${currentStep > step?.id 
                    ? 'bg-success border-success text-success-foreground' 
                    : currentStep === step?.id 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : 'bg-background border-border text-muted-foreground'
                  }
                `}>
                  {currentStep > step?.id ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    <Icon name={step?.icon} size={16} />
                  )}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${
                  currentStep >= step?.id ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step?.label}
                </span>
              </div>
              
              {index < steps?.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                  currentStep > step?.id ? 'bg-success' : 'bg-border'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingProgressIndicator;