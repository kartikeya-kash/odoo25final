import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'day', 'week', 'month'

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  const courts = [
    { id: 1, name: 'Basketball Court A', sport: 'Basketball' },
    { id: 2, name: 'Tennis Court 1', sport: 'Tennis' },
    { id: 3, name: 'Football Field', sport: 'Football' },
    { id: 4, name: 'Badminton Court 1', sport: 'Badminton' }
  ];

  const bookings = [
    {
      id: 1,
      courtId: 1,
      date: '2025-08-11',
      startTime: '09:00',
      endTime: '11:00',
      status: 'confirmed',
      user: 'John Smith',
      revenue: 50
    },
    {
      id: 2,
      courtId: 2,
      date: '2025-08-11',
      startTime: '14:00',
      endTime: '15:00',
      status: 'pending',
      user: 'Sarah Johnson',
      revenue: 30
    },
    {
      id: 3,
      courtId: 1,
      date: '2025-08-11',
      startTime: '16:00',
      endTime: '18:00',
      status: 'confirmed',
      user: 'Mike Davis',
      revenue: 60
    },
    {
      id: 4,
      courtId: 3,
      date: '2025-08-11',
      startTime: '19:00',
      endTime: '21:00',
      status: 'maintenance',
      user: 'Maintenance Block',
      revenue: 0
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/20 border-success text-success';
      case 'pending':
        return 'bg-warning/20 border-warning text-warning';
      case 'maintenance':
        return 'bg-secondary/20 border-secondary text-secondary';
      case 'cancelled':
        return 'bg-destructive/20 border-destructive text-destructive';
      default:
        return 'bg-muted border-border text-muted-foreground';
    }
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate?.setDate(newDate?.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate?.setDate(newDate?.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate?.setMonth(newDate?.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getBookingForSlot = (courtId, time) => {
    return bookings?.find(booking => 
      booking?.courtId === courtId && 
      booking?.startTime <= time && 
      booking?.endTime > time &&
      booking?.date === currentDate?.toISOString()?.split('T')?.[0]
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      {/* Calendar Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Booking Calendar</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronLeft"
              onClick={() => navigateDate('prev')}
            />
            <span className="text-sm font-medium text-foreground px-4">
              {formatDate(currentDate)}
            </span>
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronRight"
              onClick={() => navigateDate('next')}
            />
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center space-x-2">
          {['day', 'week', 'month']?.map(mode => (
            <Button
              key={mode}
              variant={viewMode === mode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode(mode)}
            >
              {mode?.charAt(0)?.toUpperCase() + mode?.slice(1)}
            </Button>
          ))}
        </div>
      </div>
      {/* Calendar Grid */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Time Header */}
            <div className="flex border-b border-border pb-2 mb-4">
              <div className="w-32 text-sm font-medium text-muted-foreground">
                Court / Time
              </div>
              {timeSlots?.slice(0, 12)?.map(time => (
                <div key={time} className="flex-1 text-center text-xs text-muted-foreground min-w-16">
                  {time}
                </div>
              ))}
            </div>

            {/* Court Rows */}
            {courts?.map(court => (
              <div key={court?.id} className="flex items-center mb-3">
                <div className="w-32 pr-4">
                  <div className="text-sm font-medium text-foreground">
                    {court?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {court?.sport}
                  </div>
                </div>
                
                {timeSlots?.slice(0, 12)?.map(time => {
                  const booking = getBookingForSlot(court?.id, time);
                  return (
                    <div key={time} className="flex-1 min-w-16 px-1">
                      {booking ? (
                        <div 
                          className={`p-2 rounded text-xs border ${getStatusColor(booking?.status)} 
                            cursor-pointer hover:opacity-80 transition-micro`}
                          title={`${booking?.user} - ${booking?.status} - $${booking?.revenue}`}
                        >
                          <div className="font-medium truncate">
                            {booking?.user}
                          </div>
                          <div className="opacity-75">
                            ${booking?.revenue}
                          </div>
                        </div>
                      ) : (
                        <div className="h-12 border border-dashed border-border rounded hover:bg-muted/50 
                          cursor-pointer transition-micro flex items-center justify-center">
                          <Icon name="Plus" size={14} className="text-muted-foreground opacity-50" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success/20 border border-success rounded"></div>
            <span className="text-xs text-muted-foreground">Confirmed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning/20 border border-warning rounded"></div>
            <span className="text-xs text-muted-foreground">Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary/20 border border-secondary rounded"></div>
            <span className="text-xs text-muted-foreground">Maintenance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border border-dashed border-border rounded"></div>
            <span className="text-xs text-muted-foreground">Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;