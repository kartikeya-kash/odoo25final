import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <div className="text-center space-y-6">
      {/* Logo */}
      <div 
        className="flex items-center justify-center space-x-3 cursor-pointer transition-micro hover:opacity-80"
        onClick={handleLogoClick}
      >
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-card">
          <Icon name="Zap" size={28} color="white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">QuickCourt</h1>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Welcome Back</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Sign in to your account to continue booking your favorite sports venues and connecting with fellow enthusiasts.
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;