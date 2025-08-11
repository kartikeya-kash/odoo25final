import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SecuritySection = ({ securitySettings, onUpdate }) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showLoginHistory, setShowLoginHistory] = useState(false);

  const loginHistory = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'New York, NY',
      timestamp: '2025-08-11 07:30:00',
      status: 'success'
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'New York, NY',
      timestamp: '2025-08-10 18:45:00',
      status: 'success'
    },
    {
      id: 3,
      device: 'Chrome on Android',
      location: 'Brooklyn, NY',
      timestamp: '2025-08-09 12:15:00',
      status: 'success'
    },
    {
      id: 4,
      device: 'Firefox on Windows',
      location: 'Unknown Location',
      timestamp: '2025-08-08 22:30:00',
      status: 'failed'
    }
  ];

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordForm?.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm?.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm?.newPassword?.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!passwordForm?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordForm?.newPassword !== passwordForm?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handlePasswordSubmit = () => {
    if (validatePassword()) {
      // Mock password change
      onUpdate({
        ...securitySettings,
        lastPasswordChange: new Date()?.toISOString()
      });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsChangingPassword(false);
    }
  };

  const handleTwoFactorToggle = () => {
    onUpdate({
      ...securitySettings,
      twoFactorEnabled: !securitySettings?.twoFactorEnabled
    });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        checked ? 'bg-primary' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Shield" size={20} className="text-primary" />
          <span>Security Settings</span>
        </h2>
      </div>
      <div className="space-y-6">
        {/* Password Section */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-foreground">Password</h3>
              <p className="text-xs text-muted-foreground">
                Last changed: {new Date(securitySettings.lastPasswordChange)?.toLocaleDateString()}
              </p>
            </div>
            {!isChangingPassword && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChangingPassword(true)}
              >
                Change Password
              </Button>
            )}
          </div>

          {isChangingPassword && (
            <div className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={passwordForm?.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
                error={errors?.currentPassword}
                required
              />
              
              <Input
                label="New Password"
                type="password"
                value={passwordForm?.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
                error={errors?.newPassword}
                description="Must be at least 8 characters long"
                required
              />
              
              <Input
                label="Confirm New Password"
                type="password"
                value={passwordForm?.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
                error={errors?.confirmPassword}
                required
              />
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setErrors({});
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handlePasswordSubmit}
                >
                  Update Password
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Two-Factor Authentication */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-foreground">Two-Factor Authentication</h3>
              <p className="text-xs text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <ToggleSwitch
              checked={securitySettings?.twoFactorEnabled}
              onChange={handleTwoFactorToggle}
            />
          </div>
          
          {securitySettings?.twoFactorEnabled && (
            <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-sm text-success">Two-factor authentication is enabled</span>
              </div>
            </div>
          )}
        </div>

        {/* Login History */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-foreground">Login History</h3>
              <p className="text-xs text-muted-foreground">
                Review recent login activity on your account
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLoginHistory(!showLoginHistory)}
            >
              {showLoginHistory ? 'Hide' : 'View'} History
            </Button>
          </div>

          {showLoginHistory && (
            <div className="space-y-3">
              {loginHistory?.map(login => (
                <div key={login?.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      login?.status === 'success' ? 'bg-success' : 'bg-destructive'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{login?.device}</p>
                      <p className="text-xs text-muted-foreground">{login?.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{formatTimestamp(login?.timestamp)}</p>
                    <p className={`text-xs font-medium ${
                      login?.status === 'success' ? 'text-success' : 'text-destructive'
                    }`}>
                      {login?.status === 'success' ? 'Successful' : 'Failed'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Deletion */}
        <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-destructive">Delete Account</h3>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => console.log('Delete account clicked')}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;