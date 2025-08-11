import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationSettingsSection = ({ settings, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState(settings);

  const notificationTypes = [
    {
      id: 'bookingConfirmations',
      title: 'Booking Confirmations',
      description: 'Get notified when your bookings are confirmed or cancelled',
      icon: 'Calendar'
    },
    {
      id: 'promotions',
      title: 'Promotions & Offers',
      description: 'Receive updates about special deals and discounts',
      icon: 'Tag'
    },
    {
      id: 'reminders',
      title: 'Booking Reminders',
      description: 'Get reminded about upcoming bookings',
      icon: 'Clock'
    },
    {
      id: 'newVenues',
      title: 'New Venues',
      description: 'Be the first to know about new venues in your area',
      icon: 'MapPin'
    },
    {
      id: 'communityUpdates',
      title: 'Community Updates',
      description: 'Stay updated with community events and activities',
      icon: 'Users'
    }
  ];

  const handleToggle = (type, channel, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [type]: {
        ...prev?.[type],
        [channel]: value
      }
    }));
  };

  const handleSave = () => {
    onUpdate(notificationSettings);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNotificationSettings(settings);
    setIsEditing(false);
  };

  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        checked ? 'bg-primary' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
          <Icon name="Bell" size={20} className="text-primary" />
          <span>Notification Settings</span>
        </h2>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            iconPosition="left"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
      </div>
      <div className="space-y-6">
        {/* Header Row */}
        <div className="hidden sm:grid sm:grid-cols-12 gap-4 pb-2 border-b border-border">
          <div className="col-span-6">
            <span className="text-sm font-medium text-muted-foreground">Notification Type</span>
          </div>
          <div className="col-span-3 text-center">
            <span className="text-sm font-medium text-muted-foreground">Email</span>
          </div>
          <div className="col-span-3 text-center">
            <span className="text-sm font-medium text-muted-foreground">SMS</span>
          </div>
        </div>

        {/* Notification Settings */}
        {notificationTypes?.map(type => (
          <div key={type?.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-4 bg-muted/50 rounded-lg">
            <div className="sm:col-span-6">
              <div className="flex items-start space-x-3">
                <Icon name={type?.icon} size={20} className="text-primary mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-foreground">{type?.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{type?.description}</p>
                </div>
              </div>
            </div>
            
            <div className="sm:col-span-3 flex justify-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground sm:hidden">Email:</span>
                <ToggleSwitch
                  checked={notificationSettings?.[type?.id]?.email || false}
                  onChange={(value) => handleToggle(type?.id, 'email', value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div className="sm:col-span-3 flex justify-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground sm:hidden">SMS:</span>
                <ToggleSwitch
                  checked={notificationSettings?.[type?.id]?.sms || false}
                  onChange={(value) => handleToggle(type?.id, 'sms', value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {isEditing && (
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationSettingsSection;