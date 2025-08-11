import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import AppImage from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RelatedVenues = ({ currentVenueId }) => {
  const [relatedVenues, setRelatedVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock related venues data
  const mockRelatedVenues = [
    {
      id: 2,
      name: "Riverside Tennis Club",
      image: "/api/placeholder/300/200",
      sports: ["Tennis", "Pickleball"],
      startingPrice: 35,
      location: "Riverside, NY",
      rating: 4.6,
      reviewCount: 89,
      distance: 5.1,
      venueType: "Outdoor",
      featured: false
    },
    {
      id: 3,
      name: "Metro Basketball Arena",
      image: "/api/placeholder/300/200",
      sports: ["Basketball", "Volleyball"],
      startingPrice: 40,
      location: "Midtown, NY",
      rating: 4.7,
      reviewCount: 203,
      distance: 3.8,
      venueType: "Indoor",
      featured: true
    },
    {
      id: 4,
      name: "Central Park Courts",
      image: "/api/placeholder/300/200",
      sports: ["Tennis", "Pickleball"],
      startingPrice: 20,
      location: "Central Park, NY",
      rating: 4.4,
      reviewCount: 312,
      distance: 1.8,
      venueType: "Outdoor",
      featured: false
    },
    {
      id: 5,
      name: "Urban Fitness Center",
      image: "/api/placeholder/300/200",
      sports: ["Basketball", "Badminton", "Squash"],
      startingPrice: 30,
      location: "Brooklyn, NY",
      rating: 4.5,
      reviewCount: 128,
      distance: 8.2,
      venueType: "Indoor",
      featured: false
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch related venues
    const fetchRelatedVenues = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Filter out current venue and limit to 4 venues
        const filtered = mockRelatedVenues
          ?.filter(venue => venue?.id !== parseInt(currentVenueId))
          ?.slice(0, 4);
        setRelatedVenues(filtered);
      } catch (error) {
        console.error('Error fetching related venues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedVenues();
  }, [currentVenueId]);

  const handleViewDetails = (venueId) => {
    window.location.href = `/venue-details/${venueId}`;
  };

  const handleBookNow = (venueId) => {
    window.location.href = `/court-booking-flow?venueId=${venueId}`;
  };

  if (loading) {
    return (
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-6">Similar Venues</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)]?.map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-muted rounded-xl h-48 mb-4"></div>
              <div className="space-y-2">
                <div className="bg-muted rounded h-4 w-3/4"></div>
                <div className="bg-muted rounded h-4 w-1/2"></div>
                <div className="bg-muted rounded h-4 w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedVenues?.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-foreground">Similar Venues</h3>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/venues-listing'}
        >
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedVenues?.map((venue) => (
          <div
            key={venue?.id}
            className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-modal transition-state group"
          >
            {/* Venue Image */}
            <div className="relative">
              <AppImage
                src={venue?.image}
                alt={venue?.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-state cursor-pointer"
                onClick={() => handleViewDetails(venue?.id)}
              />
              
              {/* Featured Badge */}
              {venue?.featured && (
                <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
                  Featured
                </div>
              )}

              {/* Distance Badge */}
              <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                {venue?.distance} km
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4">
              {/* Venue Name and Rating */}
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-foreground line-clamp-1 flex-1 cursor-pointer hover:text-primary transition-micro"
                    onClick={() => handleViewDetails(venue?.id)}>
                  {venue?.name}
                </h4>
                <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                  <Icon name="Star" size={12} className="text-amber-400 fill-current" />
                  <span className="text-xs font-medium text-foreground">
                    {venue?.rating?.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center text-muted-foreground mb-3">
                <Icon name="MapPin" size={12} className="mr-1" />
                <span className="text-xs">{venue?.location}</span>
              </div>

              {/* Sports Offered */}
              <div className="flex flex-wrap gap-1 mb-3">
                {venue?.sports?.slice(0, 2)?.map((sport) => (
                  <span
                    key={sport}
                    className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs font-medium"
                  >
                    {sport}
                  </span>
                ))}
                {venue?.sports?.length > 2 && (
                  <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs font-medium">
                    +{venue?.sports?.length - 2}
                  </span>
                )}
              </div>

              {/* Venue Type */}
              <div className="flex items-center text-muted-foreground mb-4">
                <Icon name={venue?.venueType === 'Indoor' ? 'Home' : 'Sun'} size={12} className="mr-1" />
                <span className="text-xs">{venue?.venueType}</span>
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-foreground">
                    ${venue?.startingPrice}
                  </span>
                  <span className="text-muted-foreground text-xs">/hr</span>
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(venue?.id)}
                    className="px-3 py-1 text-xs"
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleBookNow(venue?.id)}
                    className="px-3 py-1 text-xs"
                  >
                    Book
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Browse More Section */}
      <div className="mt-8 text-center">
        <p className="text-muted-foreground mb-4">
          Looking for more options? Browse our complete venue directory.
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/venues-listing'}
          className="px-6"
        >
          <Icon name="Search" size={16} className="mr-2" />
          Browse All Venues
        </Button>
      </div>
    </div>
  );
};

export default RelatedVenues;