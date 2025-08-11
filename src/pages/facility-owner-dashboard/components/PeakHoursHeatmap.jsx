import React from 'react';

const PeakHoursHeatmap = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['6', '8', '10', '12', '14', '16', '18', '20', '22'];
  
  const heatmapData = [
    [2, 1, 1, 3, 4, 5, 4, 3, 2], // Mon
    [1, 1, 2, 3, 4, 4, 3, 2, 1], // Tue
    [2, 2, 3, 4, 5, 5, 4, 3, 2], // Wed
    [1, 2, 2, 4, 4, 5, 4, 3, 2], // Thu
    [3, 2, 3, 4, 5, 6, 5, 4, 3], // Fri
    [4, 3, 4, 5, 6, 7, 6, 5, 4], // Sat
    [3, 3, 4, 5, 6, 6, 5, 4, 3]  // Sun
  ];

  const getIntensityColor = (value) => {
    const intensities = {
      0: 'bg-muted',
      1: 'bg-primary/20',
      2: 'bg-primary/30',
      3: 'bg-primary/50',
      4: 'bg-primary/70',
      5: 'bg-primary/80',
      6: 'bg-primary/90',
      7: 'bg-primary'
    };
    return intensities?.[value] || 'bg-muted';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Peak Hours Analysis</h3>
        <div className="text-sm text-muted-foreground">
          Booking intensity by hour
        </div>
      </div>
      <div className="space-y-4">
        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Low activity</span>
          <div className="flex items-center space-x-1">
            {[0, 1, 2, 3, 4, 5, 6, 7]?.map(level => (
              <div 
                key={level}
                className={`w-3 h-3 rounded-sm ${getIntensityColor(level)}`}
              />
            ))}
          </div>
          <span>High activity</span>
        </div>

        {/* Heatmap Grid */}
        <div className="space-y-2">
          {/* Hour labels */}
          <div className="flex items-center">
            <div className="w-12"></div>
            {hours?.map(hour => (
              <div key={hour} className="flex-1 text-center text-xs text-muted-foreground">
                {hour}:00
              </div>
            ))}
          </div>

          {/* Days and data */}
          {days?.map((day, dayIndex) => (
            <div key={day} className="flex items-center">
              <div className="w-12 text-xs text-muted-foreground font-medium">
                {day}
              </div>
              {heatmapData?.[dayIndex]?.map((value, hourIndex) => (
                <div 
                  key={`${day}-${hourIndex}`}
                  className={`flex-1 h-8 mx-0.5 rounded-sm ${getIntensityColor(value)} 
                    hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer
                    flex items-center justify-center`}
                  title={`${day} ${hours?.[hourIndex]}:00 - ${value} bookings`}
                >
                  <span className="text-xs font-medium text-white opacity-0 hover:opacity-100">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeakHoursHeatmap;