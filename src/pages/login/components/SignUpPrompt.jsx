import React from 'react';
import Button from '../../../components/ui/Button';

const SignUpPrompt = ({ isLoading }) => {
  const handleSignUpClick = () => {
    window.location.href = '/register';
  };

  return (
    <div className="text-center space-y-4 pt-6 border-t border-border">
      <p className="text-muted-foreground">
        New to QuickCourt?
      </p>
      <Button
        variant="outline"
        onClick={handleSignUpClick}
        disabled={isLoading}
        fullWidth
        iconName="UserPlus"
        iconPosition="left"
      >
        Create Account
      </Button>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
        Join thousands of sports enthusiasts who trust QuickCourt for their venue booking needs.
      </p>
    </div>
  );
};

export default SignUpPrompt;
