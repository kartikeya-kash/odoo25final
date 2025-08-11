import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import AuthenticationGuard from '../../components/ui/AuthenticationGuard';
import PlatformMetricsCard from './components/PlatformMetricsCard';
import AnalyticsChart from './components/AnalyticsChart';

import RecentActivityFeed from './components/RecentActivityFeed';

import AlertNotifications from './components/AlertNotifications';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useNavigation } from '../../components/ui/RoleBasedNavigation';

const AdminDashboard = () => {
  const { userRole } = useNavigation();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [isExporting, setIsExporting] = useState(false);

  // Facility admin dashboard - manages only their own facilities
  const facilityMetrics = [
    {
      title: "My Facilities",
      value: "3",
      change: "+1",
      changeType: "positive",
      icon: "Building2",
      description: "facilities managed"
    },
    {
      title: "Total Bookings",
      value: "234",
      change: "+12.5%",
      changeType: "positive",
      icon: "Calendar",
      description: "vs last month"
    },
    {
      title: "Revenue",
      value: "$5,892",
      change: "+18.3%",
      changeType: "positive",
      icon: "DollarSign",
      description: "vs last month"
    },
    {
      title: "Customer Rating",
      value: "4.8",
      change: "+0.2",
      changeType: "positive",
      icon: "Star",
      description: "average rating"
    },
    {
      title: "Utilization Rate",
      value: "78%",
      change: "+5.1%",
      changeType: "positive",
      icon: "Activity",
      description: "court utilization"
    },
    {
      title: "Pending Issues",
      value: "2",
      change: "-3",
      changeType: "positive",
      icon: "AlertCircle",
      description: "maintenance issues"
    }
  ];

  // Analytics data for facility admin
  const bookingTrendsData = [
    { name: 'Jan', value: 45 },
    { name: 'Feb', value: 52 },
    { name: 'Mar', value: 48 },
    { name: 'Apr', value: 67 },
    { name: 'May', value: 73 },
    { name: 'Jun', value: 68 },
    { name: 'Jul', value: 84 },
    { name: 'Aug', value: 91 }
  ];

  const courtUtilizationData = [
    { name: 'Mon', value: 65 },
    { name: 'Tue', value: 78 },
    { name: 'Wed', value: 82 },
    { name: 'Thu', value: 89 },
    { name: 'Fri', value: 95 },
    { name: 'Sat', value: 98 },
    { name: 'Sun', value: 87 }
  ];

  const sportTypeDistributionData = [
    { name: 'Basketball', value: 45 },
    { name: 'Tennis', value: 32 },
    { name: 'Badminton', value: 23 }
  ];

  const handleExportData = async () => {
    setIsExporting(true);
    // No delays - immediate export
    console.log('Exporting facility data...');
    setIsExporting(false);
  };

  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  useEffect(() => {
    document.title = 'Admin Dashboard - QuickCourt';
  }, []);

  return (
    <AuthenticationGuard requiredRole="admin">
      <div className="min-h-screen bg-background flex flex-col">
        <Header userRole={userRole} isAuthenticated={true} />
        <AlertNotifications />
        <div className="flex-1 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Facility Admin Dashboard</h1>
                  <p className="text-muted-foreground mt-1">
                    Manage your sports facilities and bookings
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-foreground">Time Range:</label>
                    <select
                      value={selectedTimeRange}
                      onChange={(e) => setSelectedTimeRange(e?.target?.value)}
                      className="px-3 py-2 border border-border rounded-lg bg-card text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {timeRangeOptions?.map((option) => (
                        <option key={option?.value} value={option?.value}>
                          {option?.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <Button
                    variant="outline"
                    iconName="Download"
                    loading={isExporting}
                    onClick={handleExportData}
                  >
                    Export Data
                  </Button>
                </div>
              </div>
            </div>

            {/* Facility Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
              {facilityMetrics?.map((metric, index) => (
                <PlatformMetricsCard
                  key={index}
                  title={metric?.title}
                  value={metric?.value}
                  change={metric?.change}
                  changeType={metric?.changeType}
                  icon={metric?.icon}
                  description={metric?.description}
                />
              ))}
            </div>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <AnalyticsChart
                type="line"
                data={bookingTrendsData}
                title="Booking Trends - My Facilities"
                height={300}
              />
              <AnalyticsChart
                type="bar"
                data={courtUtilizationData}
                title="Weekly Court Utilization"
                height={300}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-1">
                <AnalyticsChart
                  type="pie"
                  data={sportTypeDistributionData}
                  title="Sport Type Distribution"
                  height={300}
                />
              </div>
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-6 shadow-card h-full">
                  <h3 className="text-lg font-semibold text-foreground mb-4">My Facilities Map</h3>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Icon name="Map" size={48} className="text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Interactive map of your facilities</p>
                      <p className="text-sm text-muted-foreground">Showing booking activity by location</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* My Facilities Only */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-6 shadow-card">
                  <h3 className="text-lg font-semibold text-foreground mb-4">My Facility Bookings</h3>
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">Recent bookings for facilities you manage</p>
                    {/* Add facility bookings component here */}
                  </div>
                </div>
              </div>
              
              {/* Recent Activity for Admin's facilities only */}
              <div className="lg:col-span-1">
                <RecentActivityFeed />
              </div>
            </div>

            {/* Quick Access Panel for Facility Admin */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => window.location.href = '/facility-management'}
                  className="p-4 bg-primary/10 hover:bg-primary/20 rounded-lg text-center transition-colors"
                >
                  <Icon name="Building2" size={24} className="text-primary mx-auto mb-2" />
                  <span className="text-sm font-medium text-foreground block">Manage Facilities</span>
                </button>
                <button
                  onClick={() => window.location.href = '/my-bookings'}
                  className="p-4 bg-success/10 hover:bg-success/20 rounded-lg text-center transition-colors"
                >
                  <Icon name="Calendar" size={24} className="text-success mx-auto mb-2" />
                  <span className="text-sm font-medium text-foreground block">View Bookings</span>
                </button>
                <button className="p-4 bg-warning/10 hover:bg-warning/20 rounded-lg text-center transition-colors">
                  <Icon name="BarChart3" size={24} className="text-warning mx-auto mb-2" />
                  <span className="text-sm font-medium text-foreground block">Analytics</span>
                </button>
                <button className="p-4 bg-info/10 hover:bg-info/20 rounded-lg text-center transition-colors">
                  <Icon name="Settings" size={24} className="text-info mx-auto mb-2" />
                  <span className="text-sm font-medium text-foreground block">Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </AuthenticationGuard>
  );
};

export default AdminDashboard;