import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TimeSlotSelector = ({ selectedDate, selectedSlots, onSlotsChange, onNext }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [duration, setDuration] = useState(60);
  const [totalPrice, setTotalPrice] = useState(0);

  const timeSlots = [
    { time: '06:00', available: true, price: 25 },
    { time: '07:00', available: true, price: 25 },
    { time: '08:00', available: false, price: 30 },
    { time: '09:00', available: true, price: 30 },
    { time: '10:00', available: true, price: 30 },
    { time: '11:00', available: true, price: 30 },
    { time: '12:00', available: false, price: 35 },
    { time: '13:00', available: true, price: 35 },
    { time: '14:00', available: true, price: 35 },
    { time: '15:00', available: true, price: 35 },
    { time: '16:00', available: false, price: 40 },
    { time: '17:00', available: true, price: 40 },
    { time: '18:00', available: true, price: 40 },
    { time: '19:00', available: true, price: 45 },
    { time: '20:00', available: true, price: 45 },
    { time: '21:00', available: true, price: 40 },
    { time: '22:00', available: true, price: 35 }
  ];

  useEffect(() => {
    setAvailableSlots(timeSlots);
  }, [selectedDate]);

  useEffect(() => {
    const price = selectedSlots?.reduce((total, slot) => {
      const slotData = availableSlots?.find(s => s?.time === slot);
      return total + (slotData ? slotData?.price : 0);
    }, 0);
    setTotalPrice(price * (duration / 60));
  }, [selectedSlots, duration, availableSlots]);

  const handleSlotToggle = (time) => {
    const slot = availableSlots?.find(s => s?.time === time);
    if (!slot || !slot?.available) return;

    const newSlots = selectedSlots?.includes(time)
      ? selectedSlots?.filter(s => s !== time)
      : [...selectedSlots, time]?.sort();
    
    onSlotsChange(newSlots);
  };

  const durationOptions = [
    { value: 60, label: '1 Hour' },
    { value: 90, label: '1.5 Hours' },
    { value: 120, label: '2 Hours' },
    { value: 180, label: '3 Hours' }
  ];

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Date Display */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={20} className="text-primary" />
          <span className="font-medium text-foreground">
            {formatDate(selectedDate)}
          </span>
        </div>
      </div>
      {/* Duration Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Select Duration</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {durationOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setDuration(option?.value)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                duration === option?.value
                  ? 'border-primary bg-primary/10 text-primary' :'border-border bg-background text-foreground hover:border-primary/50'
              }`}
            >
              <span className="font-medium">{option?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Time Slots Grid */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Available Time Slots</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {availableSlots?.map((slot) => (
            <button
              key={slot?.time}
              onClick={() => handleSlotToggle(slot?.time)}
              disabled={!slot?.available}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                !slot?.available
                  ? 'border-border bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                  : selectedSlots?.includes(slot?.time)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5'
              }`}
            >
              <div className="text-sm font-medium">{slot?.time}</div>
              <div className="text-xs opacity-80">${slot?.price}/hr</div>
            </button>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-success rounded border"></div>
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-primary rounded border"></div>
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-muted rounded border"></div>
          <span className="text-muted-foreground">Booked</span>
        </div>
      </div>
      {/* Price Summary */}
      {selectedSlots?.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {selectedSlots?.length} slot{selectedSlots?.length > 1 ? 's' : ''} × {duration} minutes
              </p>
              <p className="font-semibold text-foreground">
                Total: ${totalPrice?.toFixed(2)}
              </p>
            </div>
            <Button
              variant="default"
              onClick={onNext}
              iconName="ArrowRight"
              iconPosition="right"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;