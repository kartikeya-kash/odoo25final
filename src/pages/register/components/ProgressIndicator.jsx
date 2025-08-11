import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, title: 'Role Selection', icon: 'UserCheck' },
    { number: 2, title: 'Account Details', icon: 'FileText' },
    { number: 3, title: 'Verification', icon: 'Shield' }
  ];

  return (
    <div className="w-full mb-8">
      {/* Mobile Progress Bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-muted-foreground">
            {steps?.[currentStep - 1]?.title}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
      {/* Desktop Step Indicator */}
      <div className="hidden md:flex items-center justify-center space-x-8">
        {steps?.map((step, index) => {
          const isActive = currentStep === step?.number;
          const isCompleted = currentStep > step?.number;
          const isUpcoming = currentStep < step?.number;

          return (
            <div key={step?.number} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                    isCompleted
                      ? 'bg-success border-success text-white'
                      : isActive
                      ? 'bg-primary border-primary text-white' :'bg-background border-muted-foreground text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    <Icon name={step?.icon} size={16} />
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isActive
                      ? 'text-primary'
                      : isCompleted
                      ? 'text-success' :'text-muted-foreground'
                  }`}
                >
                  {step?.title}
                </span>
              </div>
              {/* Connector Line */}
              {index < steps?.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-4 transition-all duration-200 ${
                    currentStep > step?.number ? 'bg-success' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;