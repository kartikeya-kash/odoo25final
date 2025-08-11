import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BookingFilters = ({ 
  activeStatusFilter, 
  onStatusFilterChange, 
  activeDateFilter, 
  onDateFilterChange,
  searchQuery,
  onSearchChange,
  onClearFilters 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Bookings' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'pending', label: 'Pending Confirmation' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'past-bookings', label: 'Past Bookings' },
    { value: 'next-30-days', label: 'Next 30 Days' }
  ];

  const statusChips = [
    { key: 'upcoming', label: 'Upcoming', count: 3, color: 'bg-primary text-primary-foreground' },
    { key: 'completed', label: 'Completed', count: 12, color: 'bg-success text-success-foreground' },
    { key: 'cancelled', label: 'Cancelled', count: 2, color: 'bg-destructive text-destructive-foreground' },
    { key: 'pending', label: 'Pending', count: 1, color: 'bg-warning text-warning-foreground' }
  ];

  const handleChipClick = (status) => {
    onStatusFilterChange(status === activeStatusFilter ? 'all' : status);
  };

  const hasActiveFilters = activeStatusFilter !== 'all' || activeDateFilter !== 'all' || searchQuery?.trim() !== '';

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6 shadow-card">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="Search" size={20} className="text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search by venue name or booking reference..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e?.target?.value)}
          className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-micro"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <Icon name="X" size={16} className="text-muted-foreground hover:text-foreground transition-micro" />
          </button>
        )}
      </div>
      {/* Status Filter Chips - Mobile First */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {statusChips?.map((chip) => (
            <button
              key={chip?.key}
              onClick={() => handleChipClick(chip?.key)}
              className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-micro ${
                activeStatusFilter === chip?.key
                  ? chip?.color
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <span>{chip?.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeStatusFilter === chip?.key
                  ? 'bg-white/20' :'bg-background'
              }`}>
                {chip?.count}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-micro"
        >
          <Icon name="Filter" size={16} />
          <span>Advanced Filters</span>
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
        </button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>
      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Booking Status"
              options={statusOptions}
              value={activeStatusFilter}
              onChange={onStatusFilterChange}
              className="w-full"
            />
            <Select
              label="Date Range"
              options={dateRangeOptions}
              value={activeDateFilter}
              onChange={onDateFilterChange}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingFilters;