import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import AppImage from '../../../components/AppImage';
import { useNavigation } from '../../../components/ui/RoleBasedNavigation';

const VenueCard = ({ venue, onClick, isAuthenticated = false }) => {
  const { requireAuth } = useNavigation?.() || {};

  const handleBookNow = () => {
    // Check authentication before proceeding to booking
    if (!isAuthenticated) {
      alert('Please log in to book a venue.');
      window.location.href = '/login';
      return;
    }

    // Navigate to booking flow with venue data
    window.location.href = `/court-booking-flow?venue=${venue?.id}&court=1`;
  };

  const handleViewDetails = () => {
    // Navigate to venue details page
    if (onClick) {
      onClick(venue?.id);
    } else {
      window.location.href = `/venue-details/${venue?.id}`;
    }
  };

  // Enhanced price display with proper fallbacks
  const displayPrice = () => {
    if (venue?.priceRange?.min && venue?.priceRange?.max) {
      if (venue?.priceRange?.min === venue?.priceRange?.max) {
        return `$${venue?.priceRange?.min}`;
      }
      return `$${venue?.priceRange?.min} - $${venue?.priceRange?.max}`;
    } else if (venue?.startingPrice) {
      return `$${venue?.startingPrice}`;
    } else if (venue?.price) {
      return `$${venue?.price}`;
    }
    return '$25'; // Default price if none specified
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-modal transition-state group">
      {/* Venue Image */}
      <div className="relative">
        <AppImage
          src={venue?.images?.[0] || venue?.image || "/api/placeholder/300/200"}
          alt={venue?.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-state"
        />
        
        {/* Featured Badge */}
        {venue?.featured && (
          <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-micro flex items-center justify-center">
          <Button
            variant="default"
            onClick={handleViewDetails}
            className="bg-white text-black hover:bg-white/90"
          >
            View Details
          </Button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Venue Name and Rating */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground line-clamp-1">
            {venue?.name}
          </h3>
          <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
            <Icon name="Star" size={14} className="text-amber-400 fill-current" />
            <span className="text-sm font-medium text-foreground">
              {venue?.rating?.toFixed(1) || '4.5'}
            </span>
            <span className="text-xs text-muted-foreground">
              ({venue?.reviewCount || '23'})
            </span>
          </div>
        </div>

        {/* Sports Offered */}
        <div className="flex flex-wrap gap-1 mb-3">
          {venue?.sports?.slice(0, 3)?.map((sport) => (
            <span
              key={sport}
              className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs font-medium"
            >
              {sport}
            </span>
          ))}
          {venue?.sports?.length > 3 && (
            <span className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs font-medium">
              +{venue?.sports?.length - 3} more
            </span>
          )}
        </div>

        {/* Location and Distance */}
        <div className="flex items-center text-muted-foreground mb-4">
          <Icon name="MapPin" size={14} className="mr-2" />
          <span className="text-sm flex-1">{venue?.location}</span>
          {venue?.distance && (
            <span className="text-sm font-medium">{venue?.distance} km</span>
          )}
        </div>

        {/* Availability Status */}
        {venue?.availability && (
          <div className="flex items-center text-muted-foreground mb-4">
            <Icon name="Clock" size={14} className="mr-2" />
            <span className="text-sm">{venue?.availability}</span>
          </div>
        )}

        {/* Price and Book Button */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-foreground">
              {displayPrice()}
            </span>
            <span className="text-muted-foreground text-sm">/hour</span>
          </div>
          
          <Button
            onClick={handleBookNow}
            size="sm"
            className="px-6"
            disabled={!isAuthenticated}
          >
            {isAuthenticated ? 'Book Now' : 'Login to Book'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;