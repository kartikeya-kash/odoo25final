import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';

const BookingCalendar = ({ selectedDate, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState(new Set());

  useEffect(() => {
    // Simulate fetching available dates
    const generateAvailableDates = () => {
      const dates = new Set();
      const today = new Date();
      
      // Generate available dates for the next 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date?.setDate(today?.getDate() + i);
        
        // Skip some random dates to simulate unavailability
        if (Math.random() > 0.2) {
          dates?.add(date?.toDateString());
        }
      }
      
      setAvailableDates(dates);
    };

    generateAvailableDates();
  }, [currentMonth]);

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

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateAvailable = (date) => {
    if (!date) return false;
    const today = new Date();
    today?.setHours(0, 0, 0, 0);
    
    return date >= today && availableDates?.has(date?.toDateString());
  };

  const isDateSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date?.toDateString() === selectedDate?.toDateString();
  };

  const handleDateClick = (date) => {
    if (isDateAvailable(date)) {
      onDateChange(date);
    }
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth?.setMonth(currentMonth?.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const today = new Date();
  const isPrevDisabled = currentMonth?.getMonth() === today?.getMonth() && 
                        currentMonth?.getFullYear() === today?.getFullYear();

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            {monthNames?.[currentMonth?.getMonth()]} {currentMonth?.getFullYear()}
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(-1)}
              disabled={isPrevDisabled}
              iconName="ChevronLeft"
            >
              <span className="sr-only">Previous month</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(1)}
              iconName="ChevronRight"
            >
              <span className="sr-only">Next month</span>
            </Button>
          </div>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1">
          {dayNames?.map((dayName) => (
            <div
              key={dayName}
              className="p-2 text-center text-sm font-medium text-muted-foreground"
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days?.map((date, index) => (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={!isDateAvailable(date)}
              className={`
                p-2 text-sm rounded-lg transition-all duration-200 min-h-[40px] flex items-center justify-center
                ${!date 
                  ? 'invisible' 
                  : isDateSelected(date)
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : isDateAvailable(date)
                      ? 'bg-background text-foreground hover:bg-muted border border-border hover:border-primary/50'
                      : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                }
              `}
            >
              {date && date?.getDate()}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span className="text-muted-foreground">Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-background border border-border rounded"></div>
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-muted rounded"></div>
            <span className="text-muted-foreground">Unavailable</span>
          </div>
        </div>

        {/* Quick Date Selection */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm font-medium text-foreground mb-3">Quick Select</p>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 7]?.map((daysFromNow) => {
              const quickDate = new Date();
              quickDate?.setDate(quickDate?.getDate() + daysFromNow);
              
              if (!isDateAvailable(quickDate)) return null;
              
              const label = daysFromNow === 0 ? 'Today' : 
                           daysFromNow === 1 ? 'Tomorrow' : 
                           daysFromNow === 2 ? 'Day After': 'Next Week';
              
              return (
                <Button
                  key={daysFromNow}
                  variant={isDateSelected(quickDate) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleDateClick(quickDate)}
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;