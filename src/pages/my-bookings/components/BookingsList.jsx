import React from 'react';
import BookingCard from './BookingCard';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingsList = ({ 
  bookings, 
  loading, 
  onModify, 
  onCancel, 
  onReview, 
  onRebook, 
  onCheckIn,
  onLoadMore,
  hasMore 
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)]?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4 animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
              <div className="h-8 bg-muted rounded w-20"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-8 bg-muted rounded w-20"></div>
              <div className="h-8 bg-muted rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (bookings?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Calendar" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No bookings found</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          You haven't made any bookings yet. Start exploring venues and book your first court!
        </p>
        <Button
          variant="default"
          iconName="Search"
          iconPosition="left"
          onClick={() => window.location.href = '/venues-listing'}
        >
          Browse Venues
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings?.map((booking) => (
        <BookingCard
          key={booking?.id}
          booking={booking}
          onModify={onModify}
          onCancel={onCancel}
          onReview={onReview}
          onRebook={onRebook}
          onCheckIn={onCheckIn}
        />
      ))}
      {hasMore && (
        <div className="text-center pt-6">
          <Button
            variant="outline"
            onClick={onLoadMore}
            loading={loading}
            iconName="ChevronDown"
            iconPosition="right"
          >
            Load More Bookings
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingsList;