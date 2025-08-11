import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { useAuthGuard } from '../../../components/ui/AuthenticationGuard';

const QuickBookSection = ({ isAuthenticated, favoriteVenues }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { requireAuth } = useAuthGuard();

  const popularVenues = [
    {
      id: 1,
      name: "Downtown Sports Complex",
      sports: ["Basketball", "Tennis", "Badminton"],
      startingPrice: 25,
      location: "Downtown District",
      rating: 4.8,
      reviewCount: 156,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      availability: "Available Now",
      featured: true
    },
    {
      id: 2,
      name: "City Tennis Club",
      sports: ["Tennis", "Squash"],
      startingPrice: 35,
      location: "Central Park Area",
      rating: 4.9,
      reviewCount: 203,
      image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?w=400&h=300&fit=crop",
      availability: "2 courts available",
      featured: false
    },
    {
      id: 3,
      name: "Riverside Football Field",
      sports: ["Football", "Soccer"],
      startingPrice: 45,
      location: "Riverside District",
      rating: 4.7,
      reviewCount: 89,
      image: "https://images.pixabay.com/photo/2016/06/03/13/57/digital-marketing-1433427_1280.jpg?w=400&h=300&fit=crop",
      availability: "Available Today",
      featured: true
    },
    {
      id: 4,
      name: "Elite Fitness Courts",
      sports: ["Basketball", "Volleyball"],
      startingPrice: 30,
      location: "Business District",
      rating: 4.6,
      reviewCount: 124,
      image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop",
      availability: "Available Now",
      featured: false
    },
    {
      id: 5,
      name: "Community Sports Hub",
      sports: ["Badminton", "Table Tennis"],
      startingPrice: 20,
      location: "Suburban Area",
      rating: 4.5,
      reviewCount: 67,
      image: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?w=400&h=300&fit=crop",
      availability: "3 courts available",
      featured: false
    },
    {
      id: 6,
      name: "Premium Racquet Club",
      sports: ["Tennis", "Squash", "Badminton"],
      startingPrice: 50,
      location: "Uptown District",
      rating: 4.9,
      reviewCount: 178,
      image: "https://images.pixabay.com/photo/2017/08/07/14/02/people-2604149_1280.jpg?w=400&h=300&fit=crop",
      availability: "Available Now",
      featured: true
    }
  ];

  const itemsPerPage = 3;
  const totalPages = Math.ceil(popularVenues?.length / itemsPerPage);
  const currentVenues = popularVenues?.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleVenueClick = (venueId) => {
    window.location.href = `/venue-details?id=${venueId}`;
  };

  const handleQuickBook = (venueId, e) => {
    e?.stopPropagation();
    
    // Check authentication before allowing booking
    if (!requireAuth(() => {
      window.location.href = `/court-booking-flow?venue=${venueId}`;
    })) {
      // User will be redirected to login
      return;
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={14} className="text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="Star" size={14} className="text-yellow-400 fill-current opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={14} className="text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Quick Book</h2>
          <p className="text-muted-foreground">
            {isAuthenticated && favoriteVenues?.length > 0 
              ? 'Your favorite venues and popular options' :'Popular venues near you'
            }
            {!isAuthenticated && (
              <span className="ml-2 text-sm text-warning">
                • Login required to book
              </span>
            )}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/venues-listing'}
          iconName="ArrowRight"
          iconPosition="right"
        >
          View All
        </Button>
      </div>

      {/* Mobile: Horizontal Scroll */}
      <div className="md:hidden">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {popularVenues?.map((venue) => (
            <div
              key={venue?.id}
              onClick={() => handleVenueClick(venue?.id)}
              className="flex-shrink-0 w-72 bg-card border border-border rounded-lg shadow-card hover:shadow-modal transition-micro cursor-pointer"
            >
              <div className="relative">
                <Image
                  src={venue?.image}
                  alt={venue?.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {venue?.featured && (
                  <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
                    Featured
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-medium">
                  {venue?.availability}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2 truncate">{venue?.name}</h3>
                <div className="flex flex-wrap gap-1 mb-2">
                  {venue?.sports?.slice(0, 2)?.map((sport, index) => (
                    <span
                      key={index}
                      className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs"
                    >
                      {sport}
                    </span>
                  ))}
                  {venue?.sports?.length > 2 && (
                    <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                      +{venue?.sports?.length - 2}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    {renderStars(venue?.rating)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {venue?.rating} ({venue?.reviewCount})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Icon name="MapPin" size={14} className="mr-1" />
                      {venue?.location}
                    </p>
                    <p className="font-semibold text-foreground">
                      From ${venue?.startingPrice}/hour
                    </p>
                  </div>
                  <Button
                    variant={isAuthenticated ? "default" : "outline"}
                    size="sm"
                    onClick={(e) => handleQuickBook(venue?.id, e)}
                  >
                    {isAuthenticated ? 'Book' : 'Login to Book'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid with Pagination */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {currentVenues?.map((venue) => (
            <div
              key={venue?.id}
              onClick={() => handleVenueClick(venue?.id)}
              className="bg-card border border-border rounded-lg shadow-card hover:shadow-modal transition-micro cursor-pointer"
            >
              <div className="relative">
                <Image
                  src={venue?.image}
                  alt={venue?.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {venue?.featured && (
                  <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
                    Featured
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-medium">
                  {venue?.availability}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2">{venue?.name}</h3>
                <div className="flex flex-wrap gap-1 mb-3">
                  {venue?.sports?.map((sport, index) => (
                    <span
                      key={index}
                      className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs"
                    >
                      {sport}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center">
                    {renderStars(venue?.rating)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {venue?.rating} ({venue?.reviewCount})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center mb-1">
                      <Icon name="MapPin" size={14} className="mr-1" />
                      {venue?.location}
                    </p>
                    <p className="font-semibold text-foreground">
                      From ${venue?.startingPrice}/hour
                    </p>
                  </div>
                  <Button
                    variant={isAuthenticated ? "default" : "outline"}
                    size="sm"
                    onClick={(e) => handleQuickBook(venue?.id, e)}
                  >
                    {isAuthenticated ? 'Book Now' : 'Login to Book'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              iconName="ChevronLeft"
            >
              Previous
            </Button>
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-micro ${
                    index === currentPage
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              iconName="ChevronRight"
              iconPosition="right"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickBookSection;