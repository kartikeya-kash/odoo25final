import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BookingWidget = ({ venue, onBookNow }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSport, setSelectedSport] = useState(venue?.sports?.[0]);
  const [showAvailability, setShowAvailability] = useState(false);

  // Mock availability data
  const mockAvailability = {
    '09:00': { available: true, price: venue?.pricing?.[selectedSport?.toLowerCase()]?.offPeak || 30 },
    '10:00': { available: true, price: venue?.pricing?.[selectedSport?.toLowerCase()]?.offPeak || 30 },
    '11:00': { available: false, price: null },
    '12:00': { available: true, price: venue?.pricing?.[selectedSport?.toLowerCase()]?.peak || 45 },
    '13:00': { available: true, price: venue?.pricing?.[selectedSport?.toLowerCase()]?.peak || 45 },
    '14:00': { available: false, price: null },
    '15:00': { available: true, price: venue?.pricing?.[selectedSport?.toLowerCase()]?.offPeak || 30 },
    '16:00': { available: true, price: venue?.pricing?.[selectedSport?.toLowerCase()]?.offPeak || 30 },
    '17:00': { available: true, price: venue?.pricing?.[selectedSport?.toLowerCase()]?.offPeak || 30 },
    '18:00': { available: true, price: venue?.pricing?.[selectedSport?.toLowerCase()]?.peak || 45 },
    '19:00': { available: false, price: null },
    '20:00': { available: true, price: venue?.pricing?.[selectedSport?.toLowerCase()]?.peak || 45 },
    '21:00': { available: true, price: venue?.pricing?.[selectedSport?.toLowerCase()]?.peak || 45 },
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDateRange = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date?.setDate(today?.getDate() + i);
      dates?.push(date);
    }
    
    return dates;
  };

  const getLowestPrice = () => {
    const prices = venue?.sports?.map(sport => 
      venue?.pricing?.[sport?.toLowerCase()]?.offPeak || 0
    ) || [];
    return Math?.min(...prices);
  };

  const getNextAvailableSlot = () => {
    const availableSlots = Object.entries(mockAvailability)?.filter(([time, slot]) => slot?.available);
    return availableSlots?.[0]?.[0] || 'No slots';
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-6">
      {/* Pricing Header */}
      <div className="text-center pb-4 border-b border-border">
        <div className="text-3xl font-bold text-foreground">
          From ${getLowestPrice()}
          <span className="text-base font-normal text-muted-foreground">/hour</span>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Next available: {venue?.availability?.nextAvailable || getNextAvailableSlot()}
        </div>
      </div>

      {/* Sport Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Select Sport
        </label>
        <select
          value={selectedSport}
          onChange={(e) => setSelectedSport(e?.target?.value)}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {venue?.sports?.map((sport) => (
            <option key={sport} value={sport}>
              {sport}
            </option>
          ))}
        </select>
      </div>

      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Select Date
        </label>
        <div className="grid grid-cols-3 gap-2">
          {getDateRange()?.map((date, index) => (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`p-2 text-sm rounded-lg border transition-micro ${
                selectedDate?.toDateString() === date?.toDateString()
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:bg-muted'
              }`}
            >
              <div className="font-medium">
                {index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : date?.getDate()}
              </div>
              <div className="text-xs opacity-75">
                {date?.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Availability Preview */}
      <div>
        <button
          onClick={() => setShowAvailability(!showAvailability)}
          className="flex items-center justify-between w-full text-sm font-medium text-foreground mb-3"
        >
          <span>View Availability</span>
          <Icon 
            name={showAvailability ? 'ChevronUp' : 'ChevronDown'} 
            size={16} 
          />
        </button>
        
        {showAvailability && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {Object.entries(mockAvailability)?.map(([time, slot]) => (
              <div
                key={time}
                className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                  slot?.available 
                    ? 'bg-green-50 border border-green-200 text-green-800' :'bg-gray-50 border border-gray-200 text-gray-500'
                }`}
              >
                <span>{time}</span>
                <div className="flex items-center space-x-2">
                  {slot?.available ? (
                    <>
                      <span className="font-medium">${slot?.price}</span>
                      <Icon name="CheckCircle" size={14} className="text-green-600" />
                    </>
                  ) : (
                    <>
                      <span>Unavailable</span>
                      <Icon name="XCircle" size={14} className="text-gray-400" />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Busy Hours Notice */}
      {venue?.availability?.busyHours?.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Icon name="Clock" size={16} className="text-orange-600 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-orange-800 mb-1">Peak Hours</div>
              <div className="text-orange-700">
                {venue?.availability?.busyHours?.join(', ')} - Higher demand
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Now Button */}
      <Button
        onClick={onBookNow}
        className="w-full py-3 text-lg font-semibold"
        size="lg"
      >
        Book Now
      </Button>

      {/* Quick Info */}
      <div className="space-y-2 pt-4 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircle" size={14} className="text-green-600" />
          <span>Free cancellation up to 2 hours before</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={14} className="text-blue-600" />
          <span>Secure payment processing</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="MessageSquare" size={14} className="text-purple-600" />
          <span>24/7 customer support</span>
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;