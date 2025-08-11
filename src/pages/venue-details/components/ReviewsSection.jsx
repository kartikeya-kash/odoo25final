import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import AppImage from '../../../components/AppImage';

const ReviewsSection = ({ venueId, rating, reviewCount }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState('all');
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Mock reviews data
  const mockReviews = [
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        avatar: "/api/placeholder/40/40",
        memberSince: "2022"
      },
      rating: 5,
      date: "2025-01-05",
      text: "Excellent facilities and very well maintained courts. The staff was friendly and helpful. Booking was super easy through their system. Will definitely come back!",
      photos: ["/api/placeholder/200/150", "/api/placeholder/200/150"],
      sport: "Tennis",
      helpful: 12,
      wasHelpful: false
    },
    {
      id: 2,
      user: {
        name: "Mike Chen",
        avatar: "/api/placeholder/40/40",
        memberSince: "2023"
      },
      rating: 4,
      date: "2025-01-03",
      text: "Great venue overall. The courts are in good condition and the amenities are clean. Only complaint is that parking can be a bit tight during peak hours.",
      photos: [],
      sport: "Basketball",
      helpful: 8,
      wasHelpful: true
    },
    {
      id: 3,
      user: {
        name: "Emma Rodriguez",
        avatar: "/api/placeholder/40/40",
        memberSince: "2021"
      },
      rating: 5,
      date: "2024-12-28",
      text: "Love this place! The badminton courts are excellent and the lighting is perfect. Staff is always accommodating and the locker rooms are spotless.",
      photos: ["/api/placeholder/200/150"],
      sport: "Badminton",
      helpful: 15,
      wasHelpful: false
    },
    {
      id: 4,
      user: {
        name: "James Wilson",
        avatar: "/api/placeholder/40/40", 
        memberSince: "2020"
      },
      rating: 3,
      date: "2024-12-20",
      text: "Decent facility but could use some updates. The courts are okay but the equipment rental selection is limited. Staff is helpful though.",
      photos: [],
      sport: "Tennis",
      helpful: 5,
      wasHelpful: false
    },
    {
      id: 5,
      user: {
        name: "Lisa Park",
        avatar: "/api/placeholder/40/40",
        memberSince: "2023"
      },
      rating: 5,
      date: "2024-12-15",
      text: "Amazing facility with top-notch courts and equipment. The pro shop has everything you need. Highly recommend for serious players!",
      photos: ["/api/placeholder/200/150", "/api/placeholder/200/150", "/api/placeholder/200/150"],
      sport: "Squash",
      helpful: 20,
      wasHelpful: true
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadReviews = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setReviews(mockReviews);
      setLoading(false);
    };

    loadReviews();
  }, [venueId]);

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews?.forEach(review => {
      distribution[review?.rating] += 1;
    });
    return distribution;
  };

  const filteredAndSortedReviews = () => {
    let filtered = reviews;

    // Filter by rating
    if (filterRating !== 'all') {
      filtered = filtered?.filter(review => review?.rating === parseInt(filterRating));
    }

    // Sort reviews
    filtered = filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b?.date) - new Date(a?.date);
        case 'oldest':
          return new Date(a?.date) - new Date(b?.date);
        case 'highest':
          return b?.rating - a?.rating;
        case 'lowest':
          return a?.rating - b?.rating;
        case 'helpful':
          return b?.helpful - a?.helpful;
        default:
          return 0;
      }
    });

    return showAllReviews ? filtered : filtered?.slice(0, 3);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleHelpful = (reviewId) => {
    setReviews(prev => prev?.map(review => 
      review?.id === reviewId 
        ? { 
            ...review, 
            helpful: review?.wasHelpful ? review?.helpful - 1 : review?.helpful + 1,
            wasHelpful: !review?.wasHelpful 
          }
        : review
    ));
  };

  const renderStars = (rating) => {
    return [...Array(5)]?.map((_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        className={`${
          index < rating ? 'text-amber-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const distribution = getRatingDistribution();
  const displayedReviews = filteredAndSortedReviews();

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(3)]?.map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-1/6 mt-1"></div>
                  </div>
                </div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-4">
          Reviews ({reviewCount})
        </h3>

        {/* Rating Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Overall Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <span className="text-4xl font-bold text-foreground">{rating}</span>
              <div>
                <div className="flex space-x-1 mb-1">
                  {renderStars(Math?.round(rating))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Based on {reviewCount} reviews
                </div>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1]?.map((stars) => (
              <div key={stars} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-foreground w-8">
                  {stars}
                </span>
                <Icon name="Star" size={12} className="text-amber-400 fill-current" />
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-amber-400 h-2 rounded-full transition-all"
                    style={{
                      width: `${((distribution?.[stars] || 0) / reviewCount) * 100}%`
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8">
                  {distribution?.[stars] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="px-3 py-1.5 text-sm border border-border rounded-lg bg-background"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
            
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e?.target?.value)}
              className="px-3 py-1.5 text-sm border border-border rounded-lg bg-background"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = `/court-booking-flow?venueId=${venueId}#review`}
          >
            <Icon name="Edit3" size={14} className="mr-2" />
            Write a Review
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="MessageSquare" size={48} className="mx-auto mb-3 opacity-50" />
            <p>No reviews match your current filters.</p>
          </div>
        ) : (
          displayedReviews?.map((review) => (
            <div key={review?.id} className="border-b border-border last:border-b-0 pb-6 last:pb-0">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <AppImage
                    src={review?.user?.avatar}
                    alt={review?.user?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-foreground">
                        {review?.user?.name}
                      </h4>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                        Member since {review?.user?.memberSince}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        {renderStars(review?.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review?.date)}
                      </span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {review?.sport}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="ml-13 space-y-3">
                <p className="text-foreground leading-relaxed">
                  {review?.text}
                </p>

                {/* Review Photos */}
                {review?.photos?.length > 0 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {review?.photos?.map((photo, index) => (
                      <AppImage
                        key={index}
                        src={photo}
                        alt={`Review photo ${index + 1}`}
                        className="w-24 h-24 rounded-lg object-cover flex-shrink-0 cursor-pointer hover:opacity-90 transition-micro"
                      />
                    ))}
                  </div>
                )}

                {/* Review Actions */}
                <div className="flex items-center space-x-4 text-sm">
                  <button
                    onClick={() => handleHelpful(review?.id)}
                    className={`flex items-center space-x-1 transition-micro ${
                      review?.wasHelpful
                        ? 'text-primary' :'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon 
                      name="ThumbsUp" 
                      size={14} 
                      className={review?.wasHelpful ? 'fill-current' : ''} 
                    />
                    <span>Helpful ({review?.helpful})</span>
                  </button>
                  
                  <button className="text-muted-foreground hover:text-foreground transition-micro">
                    <Icon name="Flag" size={14} className="mr-1" />
                    Report
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Show More Button */}
      {reviews?.length > 3 && !showAllReviews && (
        <div className="text-center mt-6 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => setShowAllReviews(true)}
          >
            Show All {reviews?.length} Reviews
          </Button>
        </div>
      )}

      {showAllReviews && reviews?.length > 3 && (
        <div className="text-center mt-6 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => setShowAllReviews(false)}
          >
            Show Less
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;