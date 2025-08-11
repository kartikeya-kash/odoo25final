import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import SocialLogin from './components/SocialLogin';
import SignUpPrompt from './components/SignUpPrompt';
import LoginBackground from './components/LoginBackground';
import { useNavigation } from '../../components/ui/RoleBasedNavigation';

const Login = () => {
  const { isAuthenticated, login } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/home-dashboard';
    }
  }, [isAuthenticated]);

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Mock login logic - replace with actual authentication
      const { email, password, rememberMe } = credentials;
      
      // Simulate API call - no delays
      const mockResponse = {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 1,
          name: 'John Smith',
          email: email,
          role: email === 'owner@quickcourt.com' ? 'owner' : 
                email === 'admin@quickcourt.com' ? 'admin' : 'sports-enthusiast'
        }
      };

      if (mockResponse?.success) {
        // Store token and user role
        login(mockResponse?.token, mockResponse?.user?.role);
        
        // Fixed redirect logic - redirect based on role
        const redirectMap = {
          'owner': '/facility-owner-dashboard',
          'admin': '/admin-dashboard',
          'sports-enthusiast': '/home-dashboard'
        };
        
        const redirectPath = redirectMap?.[mockResponse?.user?.role] || '/home-dashboard';
        
        // Use setTimeout to ensure state updates before redirect
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 100);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log('Social login with:', provider);
    // Implement social login logic
    setError('Social login is not yet implemented.');
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // Implement forgot password logic
    alert('Password reset functionality will be implemented soon.');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header userRole="sports-enthusiast" isAuthenticated={false} />
      
      <main className="flex-1 pt-16">
        <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
          <LoginBackground />
          
          <div className="relative z-10 flex items-center justify-center min-h-full px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-md w-full">
              <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-modal p-8">
                <LoginHeader />
                
                {error && (
                  <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive font-medium">{error}</p>
                  </div>
                )}
                
                <LoginForm
                  onSubmit={handleLogin}
                  onForgotPassword={handleForgotPassword}
                  isLoading={isLoading}
                  error={error}
                />
                
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  
                  <SocialLogin 
                    onSocialLogin={handleSocialLogin}
                    isLoading={isLoading}
                  />
                </div>
                
                <SignUpPrompt isLoading={isLoading} />
                
                {/* Demo Accounts */}
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">Demo accounts:</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Site Owner:</span>
                      <span className="text-foreground">owner@quickcourt.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Facility Admin:</span>
                      <span className="text-foreground">admin@quickcourt.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User:</span>
                      <span className="text-foreground">user@quickcourt.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Password:</span>
                      <span className="text-foreground">password123</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;