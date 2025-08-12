import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SocialLogin = ({ isLoading }) => {
  const socialProviders = [
    {
      name: 'Google',
      icon: 'Chrome',
      color: 'text-red-600',
      bgColor: 'hover:bg-red-50',
      action: () => handleSocialLogin('google')
    },
    {
      name: 'Facebook',
      icon: 'Facebook',
      color: 'text-blue-600',
      bgColor: 'hover:bg-blue-50',
      action: () => handleSocialLogin('facebook')
    }
  ];

  const handleSocialLogin = (provider) => {
    console.log(`Initiating ${provider} login...`);
    // Simulate social login process
    setTimeout(() => {
      // Mock successful social login - redirect to dashboard
      window.location.href = '/home-dashboard';
    }, 1500);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {socialProviders?.map((provider) => (
          <Button
            key={provider?.name}
            variant="outline"
            onClick={provider?.action}
            disabled={isLoading}
            className={`transition-micro ${provider?.bgColor}`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Icon 
                name={provider?.icon} 
                size={18} 
                className={provider?.color} 
              />
              <span className="text-sm font-medium">{provider?.name}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SocialLogin;