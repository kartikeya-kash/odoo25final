import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import AuthenticationGuard from '../../components/ui/AuthenticationGuard';
import KPICard from './components/KPICard';
import BookingTrendsChart from './components/BookingTrendsChart';
import EarningsSummaryChart from './components/EarningsSummaryChart';
import RecentBookingsTable from './components/RecentBookingsTable';

import BookingCalendar from './components/BookingCalendar';
import PeakHoursHeatmap from './components/PeakHoursHeatmap';
import SportPopularityChart from './components/SportPopularityChart';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useNavigation } from '../../components/ui/RoleBasedNavigation';

const FacilityOwnerDashboard = () => {
  const { userRole } = useNavigation();
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalFacilities: 0,
    totalUsers: 0
  });

  // Site owner KPI data - platform-wide overview
  const ownerKPIs = [
    {
      title: "Platform Revenue",
      value: "$124,573",
      change: "+18.2%",
      changeType: "positive",
      icon: "DollarSign",
      description: "total platform earnings"
    },
    {
      title: "Total Facilities",
      value: "486",
      change: "+23",
      changeType: "positive", 
      icon: "Building2",
      description: "registered facilities"
    },
    {
      title: "Active Users",
      value: "15,847",
      change: "+12.5%",
      changeType: "positive",
      icon: "Users",
      description: "monthly active users"
    },
    {
      title: "Total Bookings",
      value: "12,394",
      change: "+28.3%",
      changeType: "positive",
      icon: "Calendar",
      description: "monthly bookings"
    },
    {
      title: "Platform Growth",
      value: "94.2%",
      change: "+5.1%",
      changeType: "positive",
      icon: "TrendingUp",
      description: "vs last quarter"
    },
    {
      title: "Conversion Rate",
      value: "8.4%",
      change: "+1.2%",
      changeType: "positive",
      icon: "Target",
      description: "visitor to booking"
    }
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Site owner sees platform-wide data
        const mockData = {
          totalRevenue: 124573,
          totalBookings: 12394,
          totalFacilities: 486,
          totalUsers: 15847
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedTimeRange]);

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  if (isLoading) {
    return (
      <AuthenticationGuard requiredRole="owner">
        <div className="min-h-screen bg-background flex flex-col">
          <Header userRole={userRole} isAuthenticated={true} />
          <div className="flex-1 pt-16 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground">Loading platform overview...</p>
            </div>
          </div>
          <Footer />
        </div>
      </AuthenticationGuard>
    );
  }

  return (
    <AuthenticationGuard requiredRole="owner">
      <div className="min-h-screen bg-background flex flex-col">
        <Header userRole={userRole} isAuthenticated={true} />
        <div className="flex-1 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Site Owner Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Platform overview and facility management
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
                  variant="default"
                  iconName="Plus"
                  onClick={() => window.location.href = '/facility-management'}
                >
                  Add Facility
                </Button>
              </div>
            </div>

            {/* Platform KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
              {ownerKPIs?.map((kpi, index) => (
                <KPICard
                  key={index}
                  title={kpi?.title}
                  value={kpi?.value}
                  change={kpi?.change}
                  changeType={kpi?.changeType}
                  icon={kpi?.icon}
                  description={kpi?.description}
                  trend={kpi?.change}
                />
              ))}
            </div>

            {/* Platform Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <BookingTrendsChart timeRange={selectedTimeRange} />
              <EarningsSummaryChart timeRange={selectedTimeRange} />
            </div>

            {/* Secondary Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <SportPopularityChart />
              <PeakHoursHeatmap />
            </div>

            {/* Platform Management Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <RecentBookingsTable />
              </div>
              <div className="lg:col-span-1">
                <BookingCalendar />
              </div>
            </div>

            {/* Site Owner Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Platform Management</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <button
                  onClick={() => window.location.href = '/facility-management'}
                  className="p-4 bg-primary/10 hover:bg-primary/20 rounded-lg text-center transition-colors"
                >
                  <Icon name="Plus" size={24} className="text-primary mx-auto mb-2" />
                  <span className="text-sm font-medium text-foreground block">Add Facility</span>
                </button>
                <button
                  onClick={() => window.location.href = '/user-management'}
                  className="p-4 bg-success/10 hover:bg-success/20 rounded-lg text-center transition-colors"
                >
                  <Icon name="Users" size={24} className="text-success mx-auto mb-2" />
                  <span className="text-sm font-medium text-foreground block">Manage Users</span>
                </button>
                <button className="p-4 bg-warning/10 hover:bg-warning/20 rounded-lg text-center transition-colors">
                  <Icon name="BarChart3" size={24} className="text-warning mx-auto mb-2" />
                  <span className="text-sm font-medium text-foreground block">Analytics</span>
                </button>
                <button className="p-4 bg-info/10 hover:bg-info/20 rounded-lg text-center transition-colors">
                  <Icon name="Settings" size={24} className="text-info mx-auto mb-2" />
                  <span className="text-sm font-medium text-foreground block">Platform Settings</span>
                </button>
                <button className="p-4 bg-purple-100 hover:bg-purple-200 rounded-lg text-center transition-colors">
                  <Icon name="FileText" size={24} className="text-purple-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-foreground block">System Logs</span>
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

export default FacilityOwnerDashboard;