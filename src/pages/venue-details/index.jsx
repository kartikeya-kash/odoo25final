import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import PhotoGallery from './components/PhotoGallery';
import VenueInfo from './components/VenueInfo';
import BookingWidget from './components/BookingWidget';
import ReviewsSection from './components/ReviewsSection';
import LocationSection from './components/LocationSection';
import RelatedVenues from './components/RelatedVenues';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useNavigation } from '../../components/ui/RoleBasedNavigation';
import { useAuthGuard } from '../../components/ui/AuthenticationGuard';

const VenueDetails = () => {
  const { isAuthenticated, userRole } = useNavigation();
  const { requireAuth } = useAuthGuard();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showBookingWidget, setShowBookingWidget] = useState(false);

  // Mock venue data
  const mockVenue = {
    id: 1,
    name: "Downtown Sports Complex",
    description: "Premier sports facility in the heart of downtown featuring state-of-the-art courts and modern amenities. Perfect for recreational players and competitive athletes alike.",
    location: {
      address: "123 Sports Avenue, Downtown, NY 10001",
      coordinates: { lat: 40.7589, lng: -73.9851 },
      neighborhood: "Downtown District",
      transportation: ["Subway: Lines 4,5,6 at 14th St", "Bus: M14, M20", "Parking available on-site"]
    },
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop",
      "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?w=800&h=600&fit=crop",
      "https://images.pixabay.com/photo/2017/08/07/14/02/people-2604149_1280.jpg?w=800&h=600&fit=crop"
    ],
    sports: ["Basketball", "Tennis", "Badminton", "Volleyball"],
    courts: [
      { name: "Basketball Court A", capacity: 10, hourlyRate: 60 },
      { name: "Basketball Court B", capacity: 10, hourlyRate: 60 },
      { name: "Tennis Court 1", capacity: 4, hourlyRate: 45 },
      { name: "Tennis Court 2", capacity: 4, hourlyRate: 45 },
      { name: "Badminton Court 1", capacity: 4, hourlyRate: 35 },
      { name: "Badminton Court 2", capacity: 4, hourlyRate: 35 }
    ],
    pricing: {
      peakHours: { start: "17:00", end: "21:00", multiplier: 1.5 },
      weekendMultiplier: 1.2,
      minimumBooking: 1,
      maximumBooking: 4
    },
    amenities: [
      "Free Parking",
      "Locker Rooms",
      "Equipment Rental",
      "Air Conditioning",
      "Shower Facilities",
      "Vending Machines",
      "WiFi",
      "First Aid Kit"
    ],
    operatingHours: {
      monday: "6:00 AM - 11:00 PM",
      tuesday: "6:00 AM - 11:00 PM", 
      wednesday: "6:00 AM - 11:00 PM",
      thursday: "6:00 AM - 11:00 PM",
      friday: "6:00 AM - 11:00 PM",
      saturday: "7:00 AM - 10:00 PM",
      sunday: "7:00 AM - 10:00 PM"
    },
    contact: {
      phone: "+1 (555) 123-4567",
      email: "info@downtownsports.com",
      website: "www.downtownsports.com"
    },
    rating: 4.8,
    reviewCount: 156,
    featured: true,
    policies: {
      cancellation: "Free cancellation up to 24 hours before booking time",
      lateArrival: "15-minute grace period, then court may be released",
      equipment: "Equipment rental available on-site",
      ageRestriction: "All ages welcome, minors must be accompanied by adult"
    }
  };

  useEffect(() => {
    const fetchVenueDetails = async () => {
      setLoading(true);
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const venueId = urlParams?.get('id');
        
        // In a real app, fetch venue details based on ID
        if (venueId) {
          setVenue(mockVenue);
          setSelectedImages([mockVenue?.images?.[0]]);
        }
      } catch (error) {
        console.error('Error fetching venue details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueDetails();
  }, []);

  const handleBookNow = () => {
    // Require authentication for booking
    if (!requireAuth(() => {
      window.location.href = `/court-booking-flow?venue=${venue?.id}`;
    })) {
      // User will be redirected to login
      return;
    }
  };

  const handleQuickCall = () => {
    window.open(`tel:${venue?.contact?.phone}`, '_self');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: venue?.name,
        text: venue?.description,
        url: window.location?.href,
      });
    } else {
      // Fallback to copy URL
      navigator.clipboard?.writeText(window.location?.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleImageSelect = (image) => {
    setSelectedImages([image]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header userRole={userRole} isAuthenticated={isAuthenticated} />
        <div className="flex-1 pt-16 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading venue details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header userRole={userRole} isAuthenticated={isAuthenticated} />
        <div className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Venue Not Found</h2>
            <p className="text-muted-foreground mb-6">The venue you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => window.location.href = '/venues-listing'}>
              Browse Venues
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header userRole={userRole} isAuthenticated={isAuthenticated} />
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <div className="relative">
          <PhotoGallery
            images={venue?.images}
            venueName={venue?.name}
            onImageSelect={handleImageSelect}
            showAllPhotos={false}
            onShowAllPhotos={() => {}}
          />
          
          {/* Floating Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              iconName="Share"
              onClick={handleShare}
              className="bg-white/90 hover:bg-white text-foreground"
            >
              Share
            </Button>
            <Button
              variant="secondary"
              size="sm"
              iconName="Heart"
              className="bg-white/90 hover:bg-white text-foreground"
            >
              Save
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <VenueInfo venue={venue} />
              <ReviewsSection venueId={venue?.id} rating={venue?.rating} reviewCount={venue?.reviewCount} />
              <LocationSection location={venue?.location} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Booking Widget */}
                <div className="bg-card border border-border rounded-lg p-6 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Book This Venue</h3>
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={16} className="text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-foreground">{venue?.rating}</span>
                      <span className="text-sm text-muted-foreground">({venue?.reviewCount})</span>
                    </div>
                  </div>

                  {isAuthenticated ? (
                    <BookingWidget
                      venue={venue}
                      onBookNow={handleBookNow}
                      onBooking={handleBookNow}
                    />
                  ) : (
                    <div className="text-center py-6">
                      <Icon name="Lock" size={32} className="text-muted-foreground mx-auto mb-3" />
                      <h4 className="font-medium text-foreground mb-2">Login Required</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Please login to view pricing and make bookings
                      </p>
                      <Button 
                        onClick={() => window.location.href = '/login'}
                        className="w-full mb-3"
                      >
                        Login to Book
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => window.location.href = '/register'}
                        className="w-full"
                      >
                        Create Account
                      </Button>
                    </div>
                  )}
                </div>

                {/* Quick Contact */}
                <div className="bg-card border border-border rounded-lg p-6 shadow-card">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Contact Venue</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Icon name="Phone" size={18} className="text-primary" />
                      <span className="text-sm text-foreground">{venue?.contact?.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Mail" size={18} className="text-primary" />
                      <span className="text-sm text-foreground">{venue?.contact?.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Globe" size={18} className="text-primary" />
                      <span className="text-sm text-foreground">{venue?.contact?.website}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={handleQuickCall}
                    iconName="Phone"
                    className="w-full mt-4"
                  >
                    Call Now
                  </Button>
                </div>

                {/* Operating Hours */}
                <div className="bg-card border border-border rounded-lg p-6 shadow-card">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Operating Hours</h3>
                  <div className="space-y-2">
                    {Object.entries(venue?.operatingHours)?.map(([day, hours]) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="capitalize text-muted-foreground">{day}</span>
                        <span className="text-foreground">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Venues */}
          <div className="mt-12">
            <RelatedVenues
              currentVenueId={venue?.id}
              sports={venue?.sports}
              location={venue?.location?.neighborhood}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VenueDetails;