import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import AuthenticationGuard from '../../components/ui/AuthenticationGuard';
import UserTable from './components/UserTable';
import UserSearchFilters from './components/UserSearchFilters';
import UserActivityAnalytics from './components/UserActivityAnalytics';
import ModerationPanel from './components/ModerationPanel';
import CommunicationTools from './components/CommunicationTools';

import Button from '../../components/ui/Button';
import { useNavigation } from '../../components/ui/RoleBasedNavigation';

const UserManagement = () => {
  const { userRole } = useNavigation();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    role: 'all',
    status: 'all',
    registrationDate: 'all',
    activityLevel: 'all'
  });

  // Mock users data
  const mockUsers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'sports-enthusiast',
      status: 'active',
      registrationDate: '2024-01-15',
      lastLogin: '2025-01-08',
      totalBookings: 12,
      totalSpent: 480,
      avatar: null,
      location: 'New York, NY',
      phoneNumber: '+1 (555) 123-4567'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      role: 'admin',
      status: 'active',
      registrationDate: '2023-11-20',
      lastLogin: '2025-01-07',
      totalBookings: 45,
      totalSpent: 1250,
      avatar: null,
      location: 'Los Angeles, CA',
      phoneNumber: '+1 (555) 234-5678'
    },
    {
      id: 3,
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@example.com',
      role: 'sports-enthusiast',
      status: 'inactive',
      registrationDate: '2024-03-10',
      lastLogin: '2024-12-15',
      totalBookings: 8,
      totalSpent: 320,
      avatar: null,
      location: 'Chicago, IL',
      phoneNumber: '+1 (555) 345-6789'
    },
    {
      id: 4,
      name: 'Emily Chen',
      email: 'emily.chen@example.com',
      role: 'admin',
      status: 'active',
      registrationDate: '2023-08-05',
      lastLogin: '2025-01-08',
      totalBookings: 67,
      totalSpent: 2100,
      avatar: null,
      location: 'San Francisco, CA',
      phoneNumber: '+1 (555) 456-7890'
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      role: 'sports-enthusiast',
      status: 'suspended',
      registrationDate: '2024-05-22',
      lastLogin: '2024-12-20',
      totalBookings: 3,
      totalSpent: 150,
      avatar: null,
      location: 'Miami, FL',
      phoneNumber: '+1 (555) 567-8901'
    }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...users];

    // Search filter
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(user =>
        user?.name?.toLowerCase()?.includes(query) ||
        user?.email?.toLowerCase()?.includes(query) ||
        user?.location?.toLowerCase()?.includes(query)
      );
    }

    // Role filter
    if (activeFilters?.role !== 'all') {
      filtered = filtered?.filter(user => user?.role === activeFilters?.role);
    }

    // Status filter
    if (activeFilters?.status !== 'all') {
      filtered = filtered?.filter(user => user?.status === activeFilters?.status);
    }

    // Registration date filter
    if (activeFilters?.registrationDate !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (activeFilters?.registrationDate) {
        case 'last-7-days':
          filterDate?.setDate(now?.getDate() - 7);
          break;
        case 'last-30-days':
          filterDate?.setDate(now?.getDate() - 30);
          break;
        case 'last-90-days':
          filterDate?.setDate(now?.getDate() - 90);
          break;
        case 'last-year':
          filterDate?.setFullYear(now?.getFullYear() - 1);
          break;
      }
      
      filtered = filtered?.filter(user => new Date(user?.registrationDate) >= filterDate);
    }

    // Activity level filter
    if (activeFilters?.activityLevel !== 'all') {
      switch (activeFilters?.activityLevel) {
        case 'high':
          filtered = filtered?.filter(user => user?.totalBookings >= 20);
          break;
        case 'medium':
          filtered = filtered?.filter(user => user?.totalBookings >= 5 && user?.totalBookings < 20);
          break;
        case 'low':
          filtered = filtered?.filter(user => user?.totalBookings < 5);
          break;
      }
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, activeFilters]);

  const handleUserSelection = (userId, isSelected) => {
    if (isSelected) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev?.filter(id => id !== userId));
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on users:`, selectedUsers);
    // Implement bulk actions here
    setSelectedUsers([]);
  };

  const handleUserAction = (action, userId) => {
    console.log(`Performing ${action} on user:`, userId);
    // Implement individual user actions here
  };

  const handleClearFilters = () => {
    setActiveFilters({
      role: 'all',
      status: 'all',
      registrationDate: 'all',
      activityLevel: 'all'
    });
    setSearchQuery('');
  };

  return (
    <AuthenticationGuard requiredRole="owner">
      <div className="min-h-screen bg-background flex flex-col">
        <Header userRole={userRole} isAuthenticated={true} />
        <main className="flex-1 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">User Management</h1>
                <p className="text-muted-foreground mt-1">
                  Manage platform users and their activities
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                {selectedUsers?.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {selectedUsers?.length} selected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Mail"
                      onClick={() => handleBulkAction('message')}
                    >
                      Message
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Ban"
                      onClick={() => handleBulkAction('suspend')}
                    >
                      Suspend
                    </Button>
                  </div>
                )}
                
                <Button
                  variant="default"
                  iconName="UserPlus"
                  onClick={() => window.location.href = '/register'}
                >
                  Add User
                </Button>
              </div>
            </div>

            {/* User Analytics */}
            <UserActivityAnalytics users={filteredUsers} />

            {/* Search and Filters */}
            <UserSearchFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilters={activeFilters}
              onFiltersChange={setActiveFilters}
              onClearFilters={handleClearFilters}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* User Table */}
              <div className="lg:col-span-3">
                <UserTable
                  users={filteredUsers}
                  loading={loading}
                  selectedUsers={selectedUsers}
                  onUserSelection={handleUserSelection}
                  onUserSelect={handleUserSelection}
                  onUserAction={handleUserAction}
                  onBulkAction={handleBulkAction}
                />
              </div>

              {/* Side Panel */}
              <div className="lg:col-span-1 space-y-6">
                {/* Moderation Panel */}
                <ModerationPanel 
                  onBulkAction={handleBulkAction} 
                  onModerationAction={handleUserAction}
                />
                
                {/* Communication Tools */}
                <CommunicationTools 
                  selectedUsers={selectedUsers}
                  onSendMessage={(message, users) => console.log('Sending message:', message, 'to users:', users)}
                  onSendAnnouncement={(announcement) => console.log('Sending announcement:', announcement)}
                />
                
                {/* Quick Stats */}
                <div className="bg-card border border-border rounded-lg p-6 shadow-card">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Users</span>
                      <span className="font-medium text-foreground">{users?.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Users</span>
                      <span className="font-medium text-foreground">
                        {users?.filter(u => u?.status === 'active')?.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Facility Admins</span>
                      <span className="font-medium text-foreground">
                        {users?.filter(u => u?.role === 'admin')?.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Sports Enthusiasts</span>
                      <span className="font-medium text-foreground">
                        {users?.filter(u => u?.role === 'sports-enthusiast')?.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </AuthenticationGuard>
  );
};

export default UserManagement;