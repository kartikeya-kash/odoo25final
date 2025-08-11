import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const UserActivityAnalytics = () => {
  const [activeTab, setActiveTab] = useState('engagement');

  const engagementData = [
    { month: 'Jan', activeUsers: 1250, newUsers: 180, bookings: 890 },
    { month: 'Feb', activeUsers: 1380, newUsers: 220, bookings: 1020 },
    { month: 'Mar', activeUsers: 1520, newUsers: 280, bookings: 1180 },
    { month: 'Apr', activeUsers: 1680, newUsers: 320, bookings: 1350 },
    { month: 'May', activeUsers: 1850, newUsers: 380, bookings: 1520 },
    { month: 'Jun', activeUsers: 2020, newUsers: 420, bookings: 1680 },
    { month: 'Jul', activeUsers: 2180, newUsers: 450, bookings: 1820 },
    { month: 'Aug', activeUsers: 2350, newUsers: 480, bookings: 1950 }
  ];

  const userTypeData = [
    { name: 'Sports Enthusiasts', value: 2180, color: '#2563EB' },
    { name: 'Facility Owners', value: 145, color: '#F59E0B' },
    { name: 'Administrators', value: 25, color: '#10B981' }
  ];

  const popularVenuesData = [
    { venue: 'Downtown Sports Complex', bookings: 450, users: 280 },
    { venue: 'City Tennis Club', bookings: 380, users: 220 },
    { venue: 'Riverside Football Field', bookings: 320, users: 190 },
    { venue: 'Metro Basketball Courts', bookings: 290, users: 170 },
    { venue: 'Lakeside Recreation Center', bookings: 250, users: 150 }
  ];

  const usageStatsData = [
    { time: '6 AM', users: 45 },
    { time: '9 AM', users: 120 },
    { time: '12 PM', users: 180 },
    { time: '3 PM', users: 220 },
    { time: '6 PM', users: 380 },
    { time: '9 PM', users: 290 },
    { time: '12 AM', users: 80 }
  ];

  const tabs = [
    { id: 'engagement', label: 'User Engagement', icon: 'TrendingUp' },
    { id: 'demographics', label: 'Demographics', icon: 'Users' },
    { id: 'venues', label: 'Popular Venues', icon: 'MapPin' },
    { id: 'usage', label: 'Usage Patterns', icon: 'Clock' }
  ];

  const renderEngagementChart = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Users" size={20} className="text-primary" />
            <span className="text-sm font-medium text-primary">Active Users</span>
          </div>
          <p className="text-2xl font-bold text-foreground">2,350</p>
          <p className="text-sm text-muted-foreground">+8.2% from last month</p>
        </div>
        <div className="bg-success/5 border border-success/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="UserPlus" size={20} className="text-success" />
            <span className="text-sm font-medium text-success">New Users</span>
          </div>
          <p className="text-2xl font-bold text-foreground">480</p>
          <p className="text-sm text-muted-foreground">+6.7% from last month</p>
        </div>
        <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Calendar" size={20} className="text-accent" />
            <span className="text-sm font-medium text-accent">Total Bookings</span>
          </div>
          <p className="text-2xl font-bold text-foreground">1,950</p>
          <p className="text-sm text-muted-foreground">+7.1% from last month</p>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">User Growth Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="activeUsers" stroke="#2563EB" strokeWidth={2} name="Active Users" />
              <Line type="monotone" dataKey="newUsers" stroke="#10B981" strokeWidth={2} name="New Users" />
              <Line type="monotone" dataKey="bookings" stroke="#F59E0B" strokeWidth={2} name="Bookings" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderDemographicsChart = () => (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">User Type Distribution</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userTypeData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {userTypeData?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item?.color }}
                  />
                  <span className="text-sm font-medium text-foreground">{item?.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{item?.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {((item?.value / userTypeData?.reduce((sum, d) => sum + d?.value, 0)) * 100)?.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderVenuesChart = () => (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Most Popular Venues</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={popularVenuesData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis type="number" stroke="#64748B" />
            <YAxis dataKey="venue" type="category" width={150} stroke="#64748B" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E2E8F0',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="bookings" fill="#2563EB" name="Bookings" />
            <Bar dataKey="users" fill="#10B981" name="Unique Users" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderUsageChart = () => (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Platform Usage by Time</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={usageStatsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="time" stroke="#64748B" />
            <YAxis stroke="#64748B" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E2E8F0',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="users" fill="#F59E0B" name="Active Users" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'engagement':
        return renderEngagementChart();
      case 'demographics':
        return renderDemographicsChart();
      case 'venues':
        return renderVenuesChart();
      case 'usage':
        return renderUsageChart();
      default:
        return renderEngagementChart();
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="border-b border-border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="BarChart3" size={24} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">User Activity Analytics</h2>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-micro ${
                activeTab === tab?.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span className="hidden sm:inline">{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default UserActivityAnalytics;