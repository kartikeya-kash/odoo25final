import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const VenueInfo = ({ venue }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const formatHours = (hours) => {
    return Object.entries(hours || {})?.map(([day, time]) => ({
      day: day?.charAt(0)?.toUpperCase() + day?.slice(1),
      time
    }));
  };

  const formatPricing = (pricing) => {
    return Object.entries(pricing || {})?.map(([sport, rates]) => ({
      sport: sport?.charAt(0)?.toUpperCase() + sport?.slice(1),
      peak: rates?.peak,
      offPeak: rates?.offPeak
    }));
  };

  return (
    <div className="space-y-8">
      {/* Description */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">About This Venue</h2>
        <p className="text-muted-foreground leading-relaxed">
          {venue?.description}
        </p>
      </div>

      {/* Sports Offered */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Sports Available</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {venue?.sports?.map((sport) => (
            <div
              key={sport}
              className="flex items-center space-x-3 p-3 bg-muted rounded-lg"
            >
              <Icon name="Activity" size={20} className="text-primary" />
              <span className="font-medium text-foreground">{sport}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Amenities</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {venue?.amenities?.map((amenity) => (
            <div
              key={amenity?.name}
              className="flex items-center space-x-3 p-3 bg-muted rounded-lg"
            >
              <Icon name={amenity?.icon} size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {amenity?.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Collapsible Sections for Mobile */}
      <div className="space-y-4">
        {/* Operating Hours */}
        <div className="bg-card rounded-xl border border-border">
          <button
            onClick={() => toggleSection('hours')}
            className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-micro"
          >
            <h3 className="text-xl font-semibold text-foreground">Operating Hours</h3>
            <Icon 
              name={expandedSection === 'hours' ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
              className="text-muted-foreground" 
            />
          </button>
          
          {expandedSection === 'hours' && (
            <div className="px-6 pb-6 border-t border-border">
              <div className="grid gap-3 mt-4">
                {formatHours(venue?.operatingHours)?.map(({ day, time }) => (
                  <div key={day} className="flex justify-between items-center">
                    <span className="font-medium text-foreground">{day}</span>
                    <span className="text-muted-foreground">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="bg-card rounded-xl border border-border">
          <button
            onClick={() => toggleSection('pricing')}
            className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-micro"
          >
            <h3 className="text-xl font-semibold text-foreground">Pricing</h3>
            <Icon 
              name={expandedSection === 'pricing' ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
              className="text-muted-foreground" 
            />
          </button>
          
          {expandedSection === 'pricing' && (
            <div className="px-6 pb-6 border-t border-border">
              <div className="space-y-4 mt-4">
                {formatPricing(venue?.pricing)?.map(({ sport, peak, offPeak }) => (
                  <div key={sport} className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">{sport}</h4>
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-muted-foreground">Peak Hours:</span>
                        <span className="font-medium text-foreground ml-2">${peak}/hour</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Off-Peak:</span>
                        <span className="font-medium text-foreground ml-2">${offPeak}/hour</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-xs text-muted-foreground mt-3 p-3 bg-background rounded-lg">
                  <Icon name="Info" size={14} className="inline mr-1" />
                  Peak hours are typically 6-9 PM weekdays and 10 AM - 6 PM weekends
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-card rounded-xl border border-border">
          <button
            onClick={() => toggleSection('contact')}
            className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-micro"
          >
            <h3 className="text-xl font-semibold text-foreground">Contact Information</h3>
            <Icon 
              name={expandedSection === 'contact' ? 'ChevronUp' : 'ChevronDown'} 
              size={20} 
              className="text-muted-foreground" 
            />
          </button>
          
          {expandedSection === 'contact' && (
            <div className="px-6 pb-6 border-t border-border">
              <div className="space-y-4 mt-4">
                <div className="flex items-center space-x-3">
                  <Icon name="Phone" size={18} className="text-muted-foreground" />
                  <a 
                    href={`tel:${venue?.contact?.phone}`}
                    className="text-primary hover:underline"
                  >
                    {venue?.contact?.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Mail" size={18} className="text-muted-foreground" />
                  <a 
                    href={`mailto:${venue?.contact?.email}`}
                    className="text-primary hover:underline"
                  >
                    {venue?.contact?.email}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Globe" size={18} className="text-muted-foreground" />
                  <a 
                    href={`https://${venue?.contact?.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {venue?.contact?.website}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueInfo;