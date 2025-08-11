import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const SportsPreferencesSection = ({ preferences, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSports, setSelectedSports] = useState(preferences?.favoriteSports);
  const [skillLevels, setSkillLevels] = useState(preferences?.skillLevels);

  const availableSports = [
    { id: 'basketball', name: 'Basketball', icon: 'Circle' },
    { id: 'tennis', name: 'Tennis', icon: 'Circle' },
    { id: 'football', name: 'Football', icon: 'Circle' },
    { id: 'badminton', name: 'Badminton', icon: 'Circle' },
    { id: 'volleyball', name: 'Volleyball', icon: 'Circle' },
    { id: 'cricket', name: 'Cricket', icon: 'Circle' },
    { id: 'swimming', name: 'Swimming', icon: 'Circle' },
    { id: 'squash', name: 'Squash', icon: 'Circle' }
  ];

  const skillOptions = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];

  const handleSportToggle = (sportId) => {
    setSelectedSports(prev => 
      prev?.includes(sportId) 
        ? prev?.filter(id => id !== sportId)
        : [...prev, sportId]
    );
  };

  const handleSkillLevelChange = (sport, level) => {
    setSkillLevels(prev => ({
      ...prev,
      [sport]: level
    }));
  };

  const handleSave = () => {
    onUpdate({
      favoriteSports: selectedSports,
      skillLevels: skillLevels
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setSelectedSports(preferences?.favoriteSports);
    setSkillLevels(preferences?.skillLevels);
    setIsEditing(false);
  };

  const getSkillBadgeColor = (level) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-blue-100 text-blue-800',
      'Advanced': 'bg-purple-100 text-purple-800',
      'Professional': 'bg-red-100 text-red-800'
    };
    return colors?.[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Trophy" size={20} className="text-primary" />
          <span>Sports Preferences</span>
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
      {!isEditing ? (
        <div className="space-y-6">
          {/* Favorite Sports */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Favorite Sports</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSports?.map(sportId => {
                const sport = availableSports?.find(s => s?.id === sportId);
                return sport ? (
                  <span
                    key={sportId}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    <Icon name={sport?.icon} size={14} />
                    <span>{sport?.name}</span>
                  </span>
                ) : null;
              })}
            </div>
          </div>

          {/* Skill Levels */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Skill Levels</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(skillLevels)?.map(([sport, level]) => {
                const sportInfo = availableSports?.find(s => s?.id === sport);
                return sportInfo ? (
                  <div key={sport} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">{sportInfo?.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillBadgeColor(level)}`}>
                      {level}
                    </span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Edit Favorite Sports */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Select Favorite Sports</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availableSports?.map(sport => (
                <Checkbox
                  key={sport?.id}
                  label={sport?.name}
                  checked={selectedSports?.includes(sport?.id)}
                  onChange={(e) => handleSportToggle(sport?.id)}
                />
              ))}
            </div>
          </div>

          {/* Edit Skill Levels */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Set Skill Levels</h3>
            <div className="space-y-4">
              {selectedSports?.map(sportId => {
                const sport = availableSports?.find(s => s?.id === sportId);
                return sport ? (
                  <div key={sportId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">{sport?.name}</span>
                    <select
                      value={skillLevels?.[sportId] || 'Beginner'}
                      onChange={(e) => handleSkillLevelChange(sportId, e?.target?.value)}
                      className="px-3 py-1 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {skillOptions?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}
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

export default SportsPreferencesSection;