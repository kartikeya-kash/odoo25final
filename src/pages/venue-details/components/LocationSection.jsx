import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationSection = ({ venue }) => {
  const [showDirections, setShowDirections] = useState(false);

  const handleGetDirections = () => {
    const address = encodeURIComponent(venue?.location?.address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleCallVenue = () => {
    if (venue?.contact?.phone) {
      window.location.href = `tel:${venue?.contact?.phone}`;
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-2xl font-bold text-foreground mb-6">Location & Contact</h3>
      
      {/* Address and Distance */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start space-x-3">
          <Icon name="MapPin" size={20} className="text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="text-foreground font-medium">{venue?.location?.address}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {venue?.location?.distance} km from your location
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Icon name="Phone" size={20} className="text-primary" />
          <button
            onClick={handleCallVenue}
            className="text-foreground font-medium hover:text-primary transition-micro"
          >
            {venue?.contact?.phone}
          </button>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-muted rounded-lg h-64 mb-6 relative overflow-hidden">
        {/* Static Map Placeholder - In real app, integrate with Google Maps/Mapbox */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
          <div className="text-center">
            <Icon name="MapPin" size={48} className="text-primary mx-auto mb-3" />
            <h4 className="font-semibold text-foreground mb-2">Interactive Map</h4>
            <p className="text-sm text-muted-foreground">
              Click to view in full screen
            </p>
          </div>
        </div>
        
        {/* Map Overlay Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <button className="bg-white shadow-md rounded-lg p-2 hover:bg-gray-50 transition-micro">
            <Icon name="ZoomIn" size={16} />
          </button>
          <button className="bg-white shadow-md rounded-lg p-2 hover:bg-gray-50 transition-micro">
            <Icon name="ZoomOut" size={16} />
          </button>
        </div>
        
        {/* Venue Marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg animate-bounce">
            <Icon name="MapPin" size={20} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <Button
          variant="outline"
          onClick={handleGetDirections}
          className="flex items-center justify-center space-x-2"
        >
          <Icon name="Navigation" size={16} />
          <span>Get Directions</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={handleCallVenue}
          className="flex items-center justify-center space-x-2"
        >
          <Icon name="Phone" size={16} />
          <span>Call Venue</span>
        </Button>
      </div>

      {/* Transportation Options */}
      <div className="border-t border-border pt-6">
        <h4 className="font-semibold text-foreground mb-4">Getting There</h4>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Icon name="Car" size={16} className="text-muted-foreground" />
            <div className="flex-1">
              <span className="text-sm font-medium text-foreground">By Car</span>
              <p className="text-xs text-muted-foreground">
                Free parking available • 8 min drive from downtown
              </p>
            </div>
            <span className="text-xs text-muted-foreground">8 min</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Icon name="Bus" size={16} className="text-muted-foreground" />
            <div className="flex-1">
              <span className="text-sm font-medium text-foreground">Public Transit</span>
              <p className="text-xs text-muted-foreground">
                Bus routes 12, 45 • Metro Line B nearby
              </p>
            </div>
            <span className="text-xs text-muted-foreground">15 min</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Icon name="Bike" size={16} className="text-muted-foreground" />
            <div className="flex-1">
              <span className="text-sm font-medium text-foreground">Cycling</span>
              <p className="text-xs text-muted-foreground">
                Bike racks available • Dedicated bike lane
              </p>
            </div>
            <span className="text-xs text-muted-foreground">12 min</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Icon name="Navigation" size={16} className="text-muted-foreground" />
            <div className="flex-1">
              <span className="text-sm font-medium text-foreground">Walking</span>
              <p className="text-xs text-muted-foreground">
                Well-lit pathway • Pedestrian friendly
              </p>
            </div>
            <span className="text-xs text-muted-foreground">25 min</span>
          </div>
        </div>
      </div>

      {/* Nearby Landmarks */}
      <div className="border-t border-border pt-6 mt-6">
        <h4 className="font-semibold text-foreground mb-4">Nearby Landmarks</h4>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">Central Mall</span>
            <span className="text-muted-foreground">0.3 km</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">City Park</span>
            <span className="text-muted-foreground">0.5 km</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">Metro Station</span>
            <span className="text-muted-foreground">0.8 km</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">Restaurant District</span>
            <span className="text-muted-foreground">1.2 km</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;