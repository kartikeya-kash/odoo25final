import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PrivacyControlsSection = ({ privacySettings, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState(privacySettings);

  const privacyOptions = [
    {
      id: 'profileVisibility',
      title: 'Profile Visibility',
      description: 'Control who can see your profile information',
      options: [
        { value: 'public', label: 'Public - Anyone can see' },
        { value: 'friends', label: 'Friends Only' },
        { value: 'private', label: 'Private - Only me' }
      ]
    },
    {
      id: 'bookingHistory',
      title: 'Booking History',
      description: 'Control visibility of your booking activity',
      options: [
        { value: 'public', label: 'Public' },
        { value: 'friends', label: 'Friends Only' },
        { value: 'private', label: 'Private' }
      ]
    },
    {
      id: 'contactInfo',
      title: 'Contact Information',
      description: 'Who can see your email and phone number',
      options: [
        { value: 'public', label: 'Public' },
        { value: 'friends', label: 'Friends Only' },
        { value: 'private', label: 'Private' }
      ]
    }
  ];

  const dataOptions = [
    {
      id: 'analytics',
      title: 'Usage Analytics',
      description: 'Help improve our service by sharing anonymous usage data',
      type: 'toggle'
    },
    {
      id: 'marketing',
      title: 'Marketing Communications',
      description: 'Receive personalized offers and recommendations',
      type: 'toggle'
    },
    {
      id: 'thirdParty',
      title: 'Third-party Data Sharing',
      description: 'Allow sharing data with trusted partners for better service',
      type: 'toggle'
    }
  ];

  const handlePrivacyChange = (optionId, value) => {
    setSettings(prev => ({
      ...prev,
      [optionId]: value
    }));
  };

  const handleToggleChange = (optionId, value) => {
    setSettings(prev => ({
      ...prev,
      [optionId]: value
    }));
  };

  const handleSave = () => {
    onUpdate(settings);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setSettings(privacySettings);
    setIsEditing(false);
  };

  const getVisibilityIcon = (value) => {
    const icons = {
      public: 'Globe',
      friends: 'Users',
      private: 'Lock'
    };
    return icons?.[value] || 'Globe';
  };

  const getVisibilityColor = (value) => {
    const colors = {
      public: 'text-blue-600',
      friends: 'text-green-600',
      private: 'text-red-600'
    };
    return colors?.[value] || 'text-gray-600';
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
          <Icon name="Lock" size={20} className="text-primary" />
          <span>Privacy Controls</span>
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
      <div className="space-y-8">
        {/* Privacy Settings */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Privacy Settings</h3>
          <div className="space-y-6">
            {privacyOptions?.map(option => (
              <div key={option?.id} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{option?.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{option?.description}</p>
                  </div>
                  {!isEditing && (
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={getVisibilityIcon(settings?.[option?.id])} 
                        size={16} 
                        className={getVisibilityColor(settings?.[option?.id])} 
                      />
                      <span className="text-sm font-medium text-foreground capitalize">
                        {settings?.[option?.id]}
                      </span>
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <div className="space-y-2">
                    {option?.options?.map(choice => (
                      <label key={choice?.value} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name={option?.id}
                          value={choice?.value}
                          checked={settings?.[option?.id] === choice?.value}
                          onChange={(e) => handlePrivacyChange(option?.id, e?.target?.value)}
                          className="w-4 h-4 text-primary border-border focus:ring-primary"
                        />
                        <div className="flex items-center space-x-2">
                          <Icon 
                            name={getVisibilityIcon(choice?.value)} 
                            size={14} 
                            className={getVisibilityColor(choice?.value)} 
                          />
                          <span className="text-sm text-foreground">{choice?.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Data Sharing Preferences */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Data Sharing Preferences</h3>
          <div className="space-y-4">
            {dataOptions?.map(option => (
              <div key={option?.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-foreground">{option?.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{option?.description}</p>
                </div>
                <ToggleSwitch
                  checked={settings?.[option?.id] || false}
                  onChange={(value) => handleToggleChange(option?.id, value)}
                  disabled={!isEditing}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Data Management */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Data Management</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
              onClick={() => console.log('Download data')}
              className="justify-start"
            >
              Download My Data
            </Button>
            <Button
              variant="outline"
              iconName="Trash2"
              iconPosition="left"
              onClick={() => console.log('Delete data')}
              className="justify-start text-destructive hover:text-destructive"
            >
              Delete My Data
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            You can request a copy of your data or request deletion at any time. 
            Data deletion is permanent and cannot be undone.
          </p>
        </div>
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

export default PrivacyControlsSection;