import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const BookingCalendarView = ({ bookings, onBookingClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getBookingsForDate = (date) => {
    if (!date) return [];
    const dateString = date?.toISOString()?.split('T')?.[0];
    return bookings?.filter(booking => booking?.date === dateString);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate?.setMonth(currentDate?.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const formatMonthYear = (date) => {
    return date?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date?.toDateString() === today?.toDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-primary';
      case 'completed':
        return 'bg-success';
      case 'cancelled':
        return 'bg-destructive';
      case 'pending':
        return 'bg-warning';
      default:
        return 'bg-muted';
    }
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">
            {formatMonthYear(currentDate)}
          </h3>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              iconName="ChevronLeft"
              onClick={() => navigateMonth(-1)}
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="ChevronRight"
              onClick={() => navigateMonth(1)}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'month' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('month')}
          >
            Month
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('week')}
          >
            Week
          </Button>
        </div>
      </div>
      {/* Calendar Grid */}
      <div className="p-4">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays?.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days?.map((date, index) => {
            const dayBookings = getBookingsForDate(date);
            const hasBookings = dayBookings?.length > 0;
            
            return (
              <div
                key={index}
                className={`min-h-[80px] p-1 border border-border rounded-lg transition-micro ${
                  date ? 'hover:bg-muted cursor-pointer' : ''
                } ${isToday(date) ? 'bg-primary/10 border-primary' : 'bg-background'}`}
                onClick={() => date && hasBookings && onBookingClick(dayBookings?.[0])}
              >
                {date && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      isToday(date) ? 'text-primary' : 'text-foreground'
                    }`}>
                      {date?.getDate()}
                    </div>
                    
                    {hasBookings && (
                      <div className="space-y-1">
                        {dayBookings?.slice(0, 2)?.map((booking, bookingIndex) => (
                          <div
                            key={bookingIndex}
                            className={`text-xs px-1 py-0.5 rounded text-white truncate ${getStatusColor(booking?.status)}`}
                            title={`${booking?.venueName} - ${booking?.time}`}
                          >
                            {booking?.time} {booking?.sportType}
                          </div>
                        ))}
                        {dayBookings?.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayBookings?.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 p-4 border-t border-border bg-muted/30">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span className="text-xs text-muted-foreground">Upcoming</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success rounded"></div>
          <span className="text-xs text-muted-foreground">Completed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-warning rounded"></div>
          <span className="text-xs text-muted-foreground">Pending</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-destructive rounded"></div>
          <span className="text-xs text-muted-foreground">Cancelled</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendarView;