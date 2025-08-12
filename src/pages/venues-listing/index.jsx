import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import SortDropdown from './components/SortDropdown';
import VenueCard from './components/VenueCard';
import LoadingSkeleton from './components/LoadingSkeleton';
import MapToggle from './components/MapToggle';
import FilterTags from './components/FilterTags';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useNavigation } from '../../components/ui/RoleBasedNavigation';

const VenuesListing = () => {
  const { isAuthenticated, userRole } = useNavigation();
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    location: '',
    sports: [],
    priceRange: [0, 300],
    rating: 0,
    availability: 'all',
    amenities: []
  });
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState('grid'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [venuesPerPage] = useState(12);

  // Mock venues data with proper pricing
  const mockVenues = [
    {
        "id": 1,
        "name": "Downtown Sports Complex",
        "location": "123 Sports Ave, Downtown, NY 10001",
        "coordinates": {
            "lat": 40.7589,
            "lng": -73.9851
        },
        "images": [
  "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?w=600&h=400&fit=crop"
        ],
        "sports": [
            "Basketball",
            "Tennis",
            "Badminton"
        ],
        "rating": 4.8,
        "reviewCount": 156,
        "priceRange": {
            "min": 20,
            "max": 195
        },
        "startingPrice": 20,
        "availability": "Available Now",
        "amenities": [
            "Parking",
            "Locker Rooms",
            "Equipment Rental",
            "AC"
        ],
        "description": "Modern sports complex with state-of-the-art facilities in the heart of downtown.",
        "operatingHours": "6:00 AM - 11:00 PM",
        "contactPhone": "+1 (555) 123-4567",
        "featured": true,
        "distance": 1.2
    },
    {
        "id": 2,
        "name": "City Tennis Club",
        "location": "456 Tennis Rd, Central Park Area, NY 10002",
        "coordinates": {
            "lat": 40.7614,
            "lng": -73.9776
        },
        "images": [
  "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?w=600&h=400&fit=crop"
        ],
        "sports": [
            "Tennis",
            "Squash"
        ],
        "rating": 4.9,
        "reviewCount": 203,
        "priceRange": {
            "min": 20,
            "max": 348
        },
        "startingPrice": 20,
        "availability": "2 courts available",
        "amenities": [
            "Parking",
            "Pro Shop",
            "Locker Rooms",
            "Cafe"
        ],
        "description": "Premium tennis club offering professional-grade courts and coaching services.",
        "operatingHours": "5:00 AM - 10:00 PM",
        "contactPhone": "+1 (555) 234-5678",
        "featured": false,
        "distance": 2.1
    },
    {
        "id": 3,
        "name": "Riverside Football Field",
        "location": "789 River St, Riverside District, NY 10003",
        "coordinates": {
            "lat": 40.7505,
            "lng": -73.9934
        },
        "images": [
  "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=600&h=400&fit=crop"
        ],
        "sports": [
            "Football",
            "Soccer"
        ],
        "rating": 4.7,
        "reviewCount": 89,
        "priceRange": {
            "min": 20,
            "max": 257
        },
        "startingPrice": 20,
        "availability": "Available Today",
        "amenities": [
            "Parking",
            "Changing Rooms",
            "Floodlights",
            "Scoreboard"
        ],
        "description": "Full-size football field with professional lighting for day and night games.",
        "operatingHours": "6:00 AM - 10:00 PM",
        "contactPhone": "+1 (555) 345-6789",
        "featured": true,
        "distance": 3.5
    },
    {
        "id": 4,
        "name": "Sports Venue 1 in India",
        "location": "Area 1, City 1, State 1, India",
        "coordinates": {
            "lat": 20.5937,
            "lng": 78.9629
        },
        "images": [
  "https://images.pexels.com/photos/40553/football-soccer-ball-pitch-40553.jpeg?w=600&h=400&fit=crop"
        ],
        "sports": [
            "Badminton",
            "Cricket",
            "Football"
        ],
        "rating": 4.0,
        "reviewCount": 50,
        "priceRange": {
            "min": 20,
            "max": 420
        },
        "startingPrice": 20,
        "availability": "Available Now",
        "amenities": [
            "Parking",
            "Locker Rooms",
            "Equipment Rental"
        ],
        "description": "Description for Sports Venue 1 with modern facilities and amenities.",
        "operatingHours": "6:00 AM - 10:00 PM",
        "contactPhone": "+91 90000 00000",
        "featured": true,
        "distance": 1.5
    },
    {
        "id": 5,
        "name": "Sports Venue 2 in India",
        "location": "Area 2, City 2, State 2, India",
        "coordinates": {
            "lat": 20.6937,
            "lng": 79.0629
        },
        "images": [
  "https://images.unsplash.com/photo-1505842675703-2d4d4ab41797?w=600&h=400&fit=crop"
        ],
        "sports": [
            "Tennis",
            "Squash"
        ],
        "rating": 4.1,
        "reviewCount": 53,
        "priceRange": {
            "min": 20,
            "max": 301
        },
        "startingPrice": 20,
        "availability": "Limited Slots",
        "amenities": [
            "Parking",
            "AC",
            "Cafe"
        ],
        "description": "Description for Sports Venue 2 with modern facilities and amenities.",
        "operatingHours": "6:00 AM - 10:00 PM",
        "contactPhone": "+91 90000 00001",
        "featured": false,
        "distance": 1.8
    },
    {
        "id": 6,
        "name": "Sports Venue 3 in India",
        "location": "Area 3, City 3, State 3, India",
        "coordinates": {
            "lat": 20.793699999999998,
            "lng": 79.16290000000001
        },
        "images": [
  "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?w=600&h=400&fit=crop"
        ],
        "sports": [
            "Tennis",
            "Squash"
        ],
        "rating": 4.2,
        "reviewCount": 56,
        "priceRange": {
            "min": 20,
            "max": 182
        },
        "startingPrice": 20,
        "availability": "Available Now",
        "amenities": [
            "Parking",
            "Locker Rooms",
            "Equipment Rental"
        ],
        "description": "Description for Sports Venue 3 with modern facilities and amenities.",
        "operatingHours": "6:00 AM - 10:00 PM",
        "contactPhone": "+91 90000 00002",
        "featured": false,
        "distance": 2.1
    },
    {
        "id": 7,
        "name": "Sports Venue 4 in India",
        "location": "Area 4, City 4, State 4, India",
        "coordinates": {
            "lat": 20.8937,
            "lng": 79.2629
        },
        "images": [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop"
        ],
        "sports": [
            "Badminton",
            "Cricket",
            "Football"
        ],
        "rating": 4.3,
        "reviewCount": 59,
        "priceRange": {
            "min": 20,
            "max": 401
        },
        "startingPrice": 20,
        "availability": "Limited Slots",
        "amenities": [
            "Parking",
            "AC",
            "Cafe"
        ],
        "description": "Description for Sports Venue 4 with modern facilities and amenities.",
        "operatingHours": "6:00 AM - 10:00 PM",
        "contactPhone": "+91 90000 00003",
        "featured": true,
        "distance": 2.4
    },
    {
        "id": 8,
        "name": "Sports Venue 5 in India",
        "location": "Area 5, City 5, State 5, India",
        "coordinates": {
            "lat": 20.993699999999997,
            "lng": 79.36290000000001
        },
        "images": [
  "https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?w=600&h=400"
        ],
        "sports": [
            "Tennis",
            "Squash"
        ],
        "rating": 4.4,
        "reviewCount": 62,
        "priceRange": {
            "min": 20,
            "max": 435
        },
        "startingPrice": 20,
        "availability": "Available Now",
        "amenities": [
            "Parking",
            "Locker Rooms",
            "Equipment Rental"
        ],
        "description": "Description for Sports Venue 5 with modern facilities and amenities.",
        "operatingHours": "6:00 AM - 10:00 PM",
        "contactPhone": "+91 90000 00004",
        "featured": false,
        "distance": 2.7
    },
    {
        "id": 9,
        "name": "Sports Venue 6 in India",
        "location": "Area 6, City 6, State 6, India",
        "coordinates": {
            "lat": 21.0937,
            "lng": 79.4629
        },
        "images": [
  "https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&h=400&fit=crop"
        ],
        "sports": [
            "Tennis",
            "Squash"
        ],
        "rating": 4.5,
        "reviewCount": 65,
        "priceRange": {
            "min": 20,
            "max": 331
        },
        "startingPrice": 20,
        "availability": "Limited Slots",
        "amenities": [
            "Parking",
            "AC",
            "Cafe"
        ],
        "description": "Description for Sports Venue 6 with modern facilities and amenities.",
        "operatingHours": "6:00 AM - 10:00 PM",
        "contactPhone": "+91 90000 00005",
        "featured": false,
        "distance": 3.0
    },
    {
        "id": 10,
        "name": "Sports Venue 7 in India",
        "location": "Area 7, City 7, State 7, India",
        "coordinates": {
            "lat": 21.1937,
            "lng": 79.5629
        },
        "images": [
  "https://images.pexels.com/photos/225887/pexels-photo-225887.jpeg?w=600&h=400&fit=crop" 
        ],
        "sports": [
            "Badminton",
            "Cricket",
            "Football"
        ],
        "rating": 4.6,
        "reviewCount": 68,
        "priceRange": {
            "min": 20,
            "max": 286
        },
        "startingPrice": 20,
        "availability": "Available Now",
        "amenities": [
            "Parking",
            "Locker Rooms",
            "Equipment Rental"
        ],
        "description": "Description for Sports Venue 7 with modern facilities and amenities.",
        "operatingHours": "6:00 AM - 10:00 PM",
        "contactPhone": "+91 90000 00006",
        "featured": true,
        "distance": 3.3
    },
    {
        "id": 11,
        "name": "Sports Venue 8 in India",
        "location": "Area 8, City 8, State 8, India",
        "coordinates": {
            "lat": 21.293699999999998,
            "lng": 79.66290000000001
        },
        "images": [
  "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?w=600&h=400&fit=crop"
        ],
        "sports": [
            "Tennis",
            "Squash"
        ],
        "rating": 4.7,
        "reviewCount": 71,
        "priceRange": {
            "min": 20,
            "max": 235
        },
        "startingPrice": 20,
        "availability": "Limited Slots",
        "amenities": [
            "Parking",
            "AC",
            "Cafe"
        ],
        "description": "Description for Sports Venue 8 with modern facilities and amenities.",
        "operatingHours": "6:00 AM - 10:00 PM",
        "contactPhone": "+91 90000 00007",
        "featured": false,
        "distance": 3.6
    },
    {
        "id": 12,
        "name": "Sports Venue 9 in India",
        "location": "Area 9, City 9, State 9, India",
        "coordinates": {
            "lat": 21.3937,
            "lng": 79.7629
        },
        "images": [
  "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?w=600&h=400&fit=crop"
        ],
        "sports": [
            "Tennis",
            "Squash"
        ],
        "rating": 4.8,
        "reviewCount": 74,
        "priceRange": {
            "min": 20,
            "max": 370
        },
        "startingPrice": 20,
        "availability": "Available Now",
        "amenities": [
            "Parking",
            "Locker Rooms",
            "Equipment Rental"
        ],
        "description": "Description for Sports Venue 9 with modern facilities and amenities.",
        "operatingHours": "6:00 AM - 10:00 PM",
        "contactPhone": "+91 90000 00008",
        "featured": false,
        "distance": 3.9
    },
    {
        "id": 13,
        "name": "Sports Venue 10 in India",
        "location": "Area 10, City 10, State 10, India",
        "coordinates": {
            "lat": 21.493699999999997,
            "lng": 79.86290000000001
        },
        "images": [
  "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=600&h=400&fit=crop"
        ],
        "sports": [
            "Badminton",
            "Cricket",
            "Football"
        ],
        "rating": 4.9,
        "reviewCount": 77,
        "priceRange": {
            "min": 20,
            "max": 145
        },
        "startingPrice": 20,
        "availability": "Limited Slots",
        "amenities": [
            "Parking",
            "AC",
            "Cafe"
        ],
        "description": "Description for Sports Venue 10 with modern facilities and amenities.",
        "operatingHours": "6:00 AM - 10:00 PM",
        "contactPhone": "+91 90000 00009",
        "featured": true,
        "distance": 4.2
    },
    {
        "id": 14,
        "name": "Sports Venue 11 in India",
        "location": "Area 11, City 11, State 1, India",
        "coordinates": {
            "lat": 20.5937,
            "lng": 78.9629
        },
        "images": [
  "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?w=600&h=400&fit=crop"
        ],
        "sports": [
            "Tennis",
            "Squash"
        ],
        "rating": 4.0,
        "reviewCount": 80,
        "priceRange": {
            "min": 20,
            "max": 398
        },
        "startingPrice": 20,
        "availability": "Available Now",
        "amenities": [
            "Parking",
            "Locker Rooms",
            "Equipment Rental"
        ],
        "description": "Description for Sports Venue 11 with modern facilities and amenities.",
        "operatingHours": "6:00 AM - 10:00 PM",
        "contactPhone": "+91 90000 00010",
        "featured": false,
        "distance": 4.5
    },
    {
        "id": 15,
        "name": "Sports Venue 12 in India",
        "location": "Area 12, City 12, State 2, India",
        "coordinates": {
            "lat": 20.6937,
            "lng": 79.0629
        },
        "images": [
  "https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?w=600&h=400&"
        ],
        "sports": [
            "Tennis",
            "Squash"
        ],
        "rating": 4.1,
        "reviewCount": 83,
        "priceRange": {
            "min": 20,
            "max": 412
        },
        "startingPrice": 20,
        "availability": "Limited Slots",
        "amenities": [
            "Parking",
            "AC",
            "Cafe"
        ],
        "description": "Description for Sports Venue 12 with modern facilities and amenities.",
        "operatingHours": "6:00 AM - 10:00 PM",
        "contactPhone": "+91 90000 00011",
        "featured": false,
        "distance": 4.8
    },
    {
        "id": 16,
        "name": "Sports Venue 13 in India",
        "location": "Area 13, City 13, State 3, India",
        "coordinates": {
            "lat": 20.793699999999998,
            "lng": 79.16290000000001
        },
        "images": [
  "https://images.pexels.com/photos/225887/pexels-photo-225887.jpeg?w=600&h=400&fit=crop" 
        ],
        "sports": [
            "Badminton",
            "Cricket",
            "Football"
        ],
        "rating": 4.2,
        "reviewCount": 86,
        "priceRange": {
            "min": 20,
            "max": 353
        },
        "startingPrice": 20,
        "availability": "Available Now",
        "amenities": [
            "Parking",
            "Locker Rooms",
            "Equipment Rental"
        ],
        "description": "Description for Sports Venue 13 with modern facilities and amenities.",
        "operatingHours": "6:00 AM - 10:00 PM",
        "contactPhone": "+91 90000 00012",
        "featured": true,
        "distance": 5.1
    }
];



  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        // Simulate API call - no delays
        setVenues(mockVenues);
        setFilteredVenues(mockVenues);
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...venues];

    // Search filter
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(venue =>
        venue?.name?.toLowerCase()?.includes(query) ||
        venue?.location?.toLowerCase()?.includes(query) ||
        venue?.sports?.some(sport => sport?.toLowerCase()?.includes(query))
      );
    }

    // Location filter
    if (activeFilters?.location?.trim()) {
      const location = activeFilters?.location?.toLowerCase();
      filtered = filtered?.filter(venue =>
        venue?.location?.toLowerCase()?.includes(location)
      );
    }

    // Sports filter
    if (activeFilters?.sports?.length > 0) {
      filtered = filtered?.filter(venue =>
        activeFilters?.sports?.some(sport => venue?.sports?.includes(sport))
      );
    }

    // Price range filter
    filtered = filtered?.filter(venue =>
      venue?.priceRange?.min >= activeFilters?.priceRange?.[0] &&
      venue?.priceRange?.max <= activeFilters?.priceRange?.[1]
    );

    // Rating filter
    if (activeFilters?.rating > 0) {
      filtered = filtered?.filter(venue => venue?.rating >= activeFilters?.rating);
    }

    // Amenities filter
    if (activeFilters?.amenities?.length > 0) {
      filtered = filtered?.filter(venue =>
        activeFilters?.amenities?.every(amenity =>
          venue?.amenities?.includes(amenity)
        )
      );
    }

    // Sort venues
    switch (sortBy) {
      case 'price-low':
        filtered?.sort((a, b) => a?.priceRange?.min - b?.priceRange?.min);
        break;
      case 'price-high':
        filtered?.sort((a, b) => b?.priceRange?.min - a?.priceRange?.min);
        break;
      case 'rating':
        filtered?.sort((a, b) => b?.rating - a?.rating);
        break;
      case 'distance':
        filtered?.sort((a, b) => a?.distance - b?.distance);
        break;
      case 'newest':
        filtered?.sort((a, b) => b?.id - a?.id);
        break;
      default: // recommended
        filtered?.sort((a, b) => {
          if (a?.featured && !b?.featured) return -1;
          if (!a?.featured && b?.featured) return 1;
          return b?.rating - a?.rating;
        });
    }

    setFilteredVenues(filtered);
    setCurrentPage(1);
  }, [venues, searchQuery, activeFilters, sortBy]);

const handleFilterChange = (filterName, value) => {
  setActiveFilters(prev => {
    // Check if the filter is an array-based filter like 'sports' or 'amenities'
    if (Array.isArray(prev[filterName])) {
      // Create a new array to avoid direct state mutation
      const currentValues = prev[filterName];
      
      // Check if the value is already in the array
      if (currentValues.includes(value)) {
        // If it exists, remove it
        return {
          ...prev,
          [filterName]: currentValues.filter(item => item !== value)
        };
      } else {
        // If it doesn't exist, add it
        return {
          ...prev,
          [filterName]: [...currentValues, value]
        };
      }
    } else {
      // For all other single-value filters, simply update the value
      return {
        ...prev,
        [filterName]: value
      };
    }
  });
};

  const handleClearFilters = () => {
    setActiveFilters({
      location: '',
      sports: [],
      priceRange: [0, 200],
      rating: 0,
      availability: 'all',
      amenities: []
    });
    setSearchQuery('');
  };

  const handleVenueClick = (venueId) => {
    window.location.href = `/venue-details?id=${venueId}`;
  };

  // Pagination
  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
  const currentVenues = filteredVenues?.slice(indexOfFirstVenue, indexOfLastVenue);
  const totalPages = Math.ceil(filteredVenues?.length / venuesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header userRole={userRole} isAuthenticated={isAuthenticated} />
        <div className="flex-1 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <LoadingSkeleton />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Find Sports Venues</h1>
            <p className="text-muted-foreground">
              Discover and book the perfect venue for your sports activities
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onLocationChange={(location) => handleFilterChange('location', location)}
            />
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
              <MapToggle 
                showMap={viewMode === 'map'} 
                onToggle={(isMapView) => setViewMode(isMapView ? 'map' : 'grid')} 
              />
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{filteredVenues?.length} venues found</span>
              {searchQuery && (
                <span>• "{searchQuery}"</span>
              )}
            </div>
          </div>

          {/* Active Filters */}
          <FilterTags
            searchTerm={searchQuery}
            locationFilter={activeFilters?.location}
            activeFilters={activeFilters}
            onRemoveFilter={(filterName, value) => {
              if (filterName === 'search') {
                setSearchQuery('');
              } else if (filterName === 'location') {
                handleFilterChange('location', '');
              } else {
                handleFilterChange(filterName, value);
              }
            }}
            onFilterRemove={handleFilterChange}
            onClearAll={handleClearFilters}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Panel */}
            <div className="lg:col-span-1">
              <FilterPanel
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onFiltersChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                onClearAll={handleClearFilters}
              />
            </div>

            {/* Venues Grid/Map */}
            <div className="lg:col-span-3">
              {viewMode === 'grid' ? (
                <>
                  {currentVenues?.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {currentVenues?.map((venue) => (
                          <VenueCard
                            key={venue?.id}
                            venue={venue}
                            onClick={() => handleVenueClick(venue?.id)}
                            isAuthenticated={isAuthenticated}
                          />
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center mt-8 space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            iconName="ChevronLeft"
                          >
                            Previous
                          </Button>
                          
                          <div className="flex space-x-1">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                              const pageNumber = index + 1;
                              return (
                                <button
                                  key={pageNumber}
                                  onClick={() => handlePageChange(pageNumber)}
                                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                                    pageNumber === currentPage
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                  }`}
                                >
                                  {pageNumber}
                                </button>
                              );
                            })}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            iconName="ChevronRight"
                            iconPosition="right"
                          >
                            Next
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No venues found</h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your filters or search terms
                      </p>
                      <Button variant="outline" onClick={handleClearFilters}>
                        Clear All Filters
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-card border border-border rounded-lg p-6 shadow-card h-96">
                  <div className="h-full bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Icon name="Map" size={48} className="text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Interactive map view</p>
                      <p className="text-sm text-muted-foreground">Showing {filteredVenues?.length} venues</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VenuesListing;