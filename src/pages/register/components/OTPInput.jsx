import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';


const OTPInput = ({ 
  value = '', 
  onChange, 
  onVerify, 
  onResend, 
  onBack, 
  isLoading, 
  email,
  length = 6 
}) => {
  const [otp, setOtp] = useState(new Array(length)?.fill(''));
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (value) {
      const otpArray = value?.split('')?.slice(0, length);
      while (otpArray?.length < length) {
        otpArray?.push('');
      }
      setOtp(otpArray);
    }
  }, [value, length]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (element, index) => {
    if (isNaN(element?.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element?.value;
    setOtp(newOtp);

    // Call parent onChange
    const otpString = newOtp?.join('');
    onChange?.(otpString);

    // Focus next input
    if (element?.value && index < length - 1) {
      inputRefs?.current?.[index + 1]?.focus();
    }

    // Auto-verify when complete
    if (otpString?.length === length && !otpString?.includes('')) {
      handleVerify(otpString);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e?.key === 'Backspace') {
      if (!otp?.[index] && index > 0) {
        // Focus previous input if current is empty
        inputRefs?.current?.[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        onChange?.(newOtp?.join(''));
      }
    } else if (e?.key === 'ArrowLeft' && index > 0) {
      inputRefs?.current?.[index - 1]?.focus();
    } else if (e?.key === 'ArrowRight' && index < length - 1) {
      inputRefs?.current?.[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e?.preventDefault();
    const pastedData = e?.clipboardData?.getData('text/plain');
    const pastedOtp = pastedData?.replace(/\D/g, '')?.split('')?.slice(0, length);
    
    const newOtp = [...otp];
    pastedOtp?.forEach((digit, index) => {
      if (index < length) {
        newOtp[index] = digit;
      }
    });
    
    setOtp(newOtp);
    const otpString = newOtp?.join('');
    onChange?.(otpString);

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp?.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1;
    inputRefs?.current?.[focusIndex]?.focus();

    // Auto-verify if complete
    if (otpString?.length === length && !otpString?.includes('')) {
      handleVerify(otpString);
    }
  };

  const handleVerify = (otpCode = null) => {
    const codeToVerify = otpCode || otp?.join('');
    if (codeToVerify?.length === length) {
      onVerify?.(codeToVerify);
    }
  };

  const handleResend = () => {
    if (canResend) {
      setCountdown(30);
      setCanResend(false);
      setOtp(new Array(length)?.fill(''));
      onChange?.('');
      onResend?.();
    }
  };

  return (
    <div className="space-y-6">
      {/* OTP Input */}
      <div className="flex justify-center space-x-2 sm:space-x-3">
        {otp?.map((digit, index) => (
          <input
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e?.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={isLoading}
            className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-lg font-semibold border-2 rounded-lg transition-all duration-200 focus:outline-none ${
              isLoading
                ? 'bg-muted border-muted text-muted-foreground cursor-not-allowed'
                : digit
                ? 'border-primary bg-primary/5 text-foreground'
                : 'border-border bg-background text-foreground hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20'
            }`}
            autoComplete="one-time-code"
          />
        ))}
      </div>
      {/* Resend Option */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Didn't receive the code?
        </p>
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading}
            className="text-primary hover:text-primary/80 font-medium text-sm transition-colors disabled:opacity-50"
          >
            Resend Code
          </button>
        ) : (
          <p className="text-sm text-muted-foreground">
            Resend available in {countdown}s
          </p>
        )}
      </div>
      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={() => handleVerify()}
          className="flex-1"
          disabled={isLoading || otp?.join('')?.length !== length}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Verifying...
            </>
          ) : (
            'Verify Code'
          )}
        </Button>
      </div>
      {/* Helper Text */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Enter the 6-digit code sent to {email}
        </p>
      </div>
    </div>
  );
};

export default OTPInput;