import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  locationFilter, 
  onLocationChange 
}) => {
  const [isLocationDetecting, setIsLocationDetecting] = useState(false);

  const sportChips = [
    'Tennis', 'Basketball', 'Badminton', 'Soccer', 'Cricket', 'Volleyball'
  ];

  const handleLocationDetect = async () => {
    setIsLocationDetecting(true);
    try {
      if (navigator?.geolocation) {
        navigator?.geolocation?.getCurrentPosition(
          (position) => {
            // In real app, reverse geocode coordinates to location name
            onLocationChange('Current Location');
            setIsLocationDetecting(false);
          },
          (error) => {
            console.error('Location error:', error);
            setIsLocationDetecting(false);
          }
        );
      } else {
        console.error('Geolocation not supported');
        setIsLocationDetecting(false);
      }
    } catch (error) {
      console.error('Error detecting location:', error);
      setIsLocationDetecting(false);
    }
  };

  const handleSportChipClick = (sport) => {
    if (searchTerm?.toLowerCase()?.includes(sport?.toLowerCase())) {
      // Remove sport from search if already present
      onSearchChange(searchTerm?.replace(new RegExp(sport, 'gi'), '')?.trim());
    } else {
      // Add sport to search
      const newSearch = searchTerm ? `${searchTerm} ${sport}` : sport;
      onSearchChange(newSearch);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Search Inputs */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icon name="Search" size={20} className="text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search venues, sports, or facilities..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        <div className="flex gap-2 md:w-80">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Icon name="MapPin" size={20} className="text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="Location or address"
              value={locationFilter}
              onChange={(e) => onLocationChange(e?.target?.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleLocationDetect}
            loading={isLocationDetecting}
            className="h-12 w-12 flex-shrink-0"
            title="Detect current location"
          >
            <Icon name="Crosshair" size={20} />
          </Button>
        </div>
      </div>

      {/* Sport Quick Filters */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Quick Sport Filters
        </label>
        <div className="flex flex-wrap gap-2">
          {sportChips?.map((sport) => {
            const isActive = searchTerm?.toLowerCase()?.includes(sport?.toLowerCase());
            return (
              <button
                key={sport}
                onClick={() => handleSportChipClick(sport)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-micro ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {sport}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;