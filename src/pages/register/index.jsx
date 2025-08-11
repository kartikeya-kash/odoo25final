import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import ProgressIndicator from './components/ProgressIndicator';
import RoleSelectionCard from './components/RoleSelectionCard';
import RegistrationForm from './components/RegistrationForm';
import OTPInput from './components/OTPInput';

import Icon from '../../components/AppIcon';

import { useNavigation } from '../../components/ui/RoleBasedNavigation';

const Register = () => {
  const { isAuthenticated, login } = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [registrationData, setRegistrationData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/home-dashboard';
    }
  }, [isAuthenticated]);

  const roles = [
    {
      id: 'sports-enthusiast',
      title: 'Sports Enthusiast',
      description: 'I want to book courts and play sports',
      icon: 'Users',
      features: ['Book courts instantly', 'Find nearby venues', 'Track your activity', 'Join communities']
    },
    {
      id: 'owner',
      title: 'Site Owner',
      description: 'I own the platform and add facilities',
      icon: 'Shield',
      features: ['Add new facilities', 'Platform management', 'User oversight', 'System administration'],
      restricted: true
    }
  ];

  const handleRoleSelection = (roleId) => {
    if (roleId === 'owner') {
      // Restrict site owner registration
      setError('Site Owner registration requires special authorization. Please contact support.');
      return;
    }
    
    setSelectedRole(roleId);
    setError('');
    setCurrentStep(2);
  };

  const handleRegistrationSubmit = async (formData) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Store registration data
      setRegistrationData({ ...formData, role: selectedRole });
      
      // Mock OTP sending - no delays
      console.log('Sending OTP to:', formData?.email);
      setOtpSent(true);
      setCurrentStep(3);
      
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (otp) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Mock OTP verification
      if (otp === '123456' || otp?.length === 6) {
        // Create user account
        const mockResponse = {
          success: true,
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: Date.now(),
            name: registrationData?.firstName + ' ' + registrationData?.lastName,
            email: registrationData?.email,
            role: selectedRole
          }
        };

        if (mockResponse?.success) {
          // Auto-login after successful registration
          login(mockResponse?.token, mockResponse?.user?.role);
          
          // Redirect based on role
          const redirectMap = {
            'admin': '/admin-dashboard',
            'sports-enthusiast': '/home-dashboard'
          };
          
          window.location.href = redirectMap?.[selectedRole] || '/home-dashboard';
        }
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    console.log('Resending OTP to:', registrationData?.email);
    setOtpSent(true);
    setError('');
    alert('OTP resent successfully!');
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your Role</h2>
              <p className="text-muted-foreground">
                Select how you plan to use QuickCourt
              </p>
            </div>
            
            <div className="space-y-4">
              {roles?.map((role) => (
                <RoleSelectionCard
                  key={role?.id}
                  role={role}
                  onClick={() => handleRoleSelection(role?.id)}
                />
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Create Your Account</h2>
              <p className="text-muted-foreground">
                Fill in your details to get started as a{' '}
                <span className="font-medium">
                  {roles?.find(r => r?.id === selectedRole)?.title}
                </span>
              </p>
            </div>
            
            <RegistrationForm
              selectedRole={selectedRole}
              onSubmit={handleRegistrationSubmit}
              onBack={handleStepBack}
              isLoading={isLoading}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Mail" size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Verify Your Email</h2>
              <p className="text-muted-foreground">
                We've sent a verification code to{' '}
                <span className="font-medium text-foreground">{registrationData?.email}</span>
              </p>
            </div>
            
            <OTPInput
              value=""
              onChange={() => {}}
              onVerify={handleOTPVerification}
              onResend={handleResendOTP}
              onBack={handleStepBack}
              isLoading={isLoading}
              email={registrationData?.email}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header userRole="sports-enthusiast" isAuthenticated={false} />
      
      <main className="flex-1 pt-16">
        <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Progress Indicator */}
            <ProgressIndicator currentStep={currentStep} totalSteps={3} />
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}
            
            {/* Step Content */}
            <div className="bg-card border border-border rounded-xl shadow-card p-8">
              {renderStepContent()}
            </div>
            
            {/* Login Prompt */}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <a
                  href="/login"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Sign in here
                </a>
              </p>
            </div>
            
            {/* Demo Info */}
            {currentStep === 1 && (
              <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  <Icon name="Info" size={16} className="inline mr-1" />
                  Site Owner registration is restricted and requires special authorization
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;