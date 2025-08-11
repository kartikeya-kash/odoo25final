import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const UserSearchFilters = ({ onFiltersChange, totalUsers = 0 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userType, setUserType] = useState('');
  const [accountStatus, setAccountStatus] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [registrationDateFrom, setRegistrationDateFrom] = useState('');
  const [registrationDateTo, setRegistrationDateTo] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const userTypeOptions = [
    { value: '', label: 'All User Types' },
    { value: 'sports-enthusiast', label: 'Sports Enthusiasts' },
    { value: 'facility-owner', label: 'Facility Owners' },
    { value: 'administrator', label: 'Administrators' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'banned', label: 'Banned' }
  ];

  const activityOptions = [
    { value: '', label: 'All Activity Levels' },
    { value: 'high', label: 'High Activity (10+ bookings)' },
    { value: 'medium', label: 'Medium Activity (3-9 bookings)' },
    { value: 'low', label: 'Low Activity (1-2 bookings)' },
    { value: 'none', label: 'No Activity' }
  ];

  useEffect(() => {
    const filters = {
      searchTerm,
      userType,
      accountStatus,
      activityLevel,
      registrationDateFrom,
      registrationDateTo
    };
    onFiltersChange(filters);
  }, [searchTerm, userType, accountStatus, activityLevel, registrationDateFrom, registrationDateTo, onFiltersChange]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setUserType('');
    setAccountStatus('');
    setActivityLevel('');
    setRegistrationDateFrom('');
    setRegistrationDateTo('');
  };

  const hasActiveFilters = searchTerm || userType || accountStatus || activityLevel || registrationDateFrom || registrationDateTo;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Search" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Search & Filter Users</h2>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
            {totalUsers} users found
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Less Filters' : 'More Filters'}
        </Button>
      </div>
      {/* Search Bar - Always Visible */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search by name, email, or phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Quick Filters - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Select
          label="User Type"
          options={userTypeOptions}
          value={userType}
          onChange={setUserType}
        />
        <Select
          label="Account Status"
          options={statusOptions}
          value={accountStatus}
          onChange={setAccountStatus}
        />
        <Select
          label="Activity Level"
          options={activityOptions}
          value={activityLevel}
          onChange={setActivityLevel}
        />
      </div>
      {/* Advanced Filters - Expandable */}
      {isExpanded && (
        <div className="border-t border-border pt-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              type="date"
              label="Registration Date From"
              value={registrationDateFrom}
              onChange={(e) => setRegistrationDateFrom(e?.target?.value)}
            />
            <Input
              type="date"
              label="Registration Date To"
              value={registrationDateTo}
              onChange={(e) => setRegistrationDateTo(e?.target?.value)}
            />
          </div>
        </div>
      )}
      {/* Filter Actions */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">
            Active filters applied
          </span>
          <Button
            variant="outline"
            size="sm"
            iconName="X"
            iconPosition="left"
            onClick={handleClearFilters}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserSearchFilters;