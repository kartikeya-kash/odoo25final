import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EarningsSummaryChart = () => {
  const data = [
    { day: 'Mon', earnings: 420, bookings: 12 },
    { day: 'Tue', earnings: 380, bookings: 10 },
    { day: 'Wed', earnings: 520, bookings: 15 },
    { day: 'Thu', earnings: 460, bookings: 13 },
    { day: 'Fri', earnings: 680, bookings: 18 },
    { day: 'Sat', earnings: 850, bookings: 22 },
    { day: 'Sun', earnings: 720, bookings: 19 }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Weekly Earnings</h3>
        <div className="text-sm text-muted-foreground">
          Last 7 days
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="day" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-popover-foreground)'
              }}
              formatter={(value, name) => [
                name === 'earnings' ? `$${value}` : value,
                name === 'earnings' ? 'Earnings' : 'Bookings'
              ]}
            />
            <Bar 
              dataKey="earnings" 
              fill="var(--color-primary)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EarningsSummaryChart;