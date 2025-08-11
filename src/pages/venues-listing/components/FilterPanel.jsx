import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const FilterPanel = ({ activeFilters, onFiltersChange, onClearAll }) => {
  const [openSections, setOpenSections] = useState({
    sportTypes: true,
    price: true,
    venueTypes: true,
    rating: true,
    distance: true
  });

  const sportTypeOptions = [
    'Tennis', 'Basketball', 'Badminton', 'Soccer', 'Cricket', 'Volleyball', 
    'Squash', 'Pickleball', 'Swimming', 'Gym'
  ];

  const venueTypeOptions = ['Indoor', 'Outdoor', 'Covered'];

  const ratingOptions = [
    { value: 4.5, label: '4.5+ Stars' },
    { value: 4.0, label: '4.0+ Stars' },
    { value: 3.5, label: '3.5+ Stars' },
    { value: 3.0, label: '3.0+ Stars' },
    { value: 0, label: 'Any Rating' }
  ];

  const distanceOptions = [
    { value: 5, label: 'Within 5 km' },
    { value: 10, label: 'Within 10 km' },
    { value: 25, label: 'Within 25 km' },
    { value: 50, label: 'Within 50 km' }
  ];

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const handleSportTypeChange = (sport, checked) => {
    const newSportTypes = checked
      ? [...activeFilters?.sportTypes, sport]
      : activeFilters?.sportTypes?.filter(s => s !== sport);
    
    onFiltersChange({
      ...activeFilters,
      sportTypes: newSportTypes
    });
  };

  const handleVenueTypeChange = (venueType, checked) => {
    const newVenueTypes = checked
      ? [...activeFilters?.venueTypes, venueType]
      : activeFilters?.venueTypes?.filter(v => v !== venueType);
    
    onFiltersChange({
      ...activeFilters,
      venueTypes: newVenueTypes
    });
  };

  const handlePriceRangeChange = (index, value) => {
    const newPriceRange = [...activeFilters?.priceRange];
    newPriceRange[index] = parseInt(value) || 0;
    
    // Ensure min doesn't exceed max
    if (index === 0 && newPriceRange?.[0] > newPriceRange?.[1]) {
      newPriceRange[1] = newPriceRange?.[0];
    }
    if (index === 1 && newPriceRange?.[1] < newPriceRange?.[0]) {
      newPriceRange[0] = newPriceRange?.[1];
    }
    
    onFiltersChange({
      ...activeFilters,
      priceRange: newPriceRange
    });
  };

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="border-b border-border pb-6 mb-6 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full mb-4 text-left"
      >
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <Icon 
          name={openSections?.[sectionKey] ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-muted-foreground"
        />
      </button>
      {openSections?.[sectionKey] && <div>{children}</div>}
    </div>
  );

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-muted-foreground hover:text-foreground"
        >
          Clear All
        </Button>
      </div>

      {/* Sport Types */}
      <FilterSection title="Sport Types" sectionKey="sportTypes">
        <div className="space-y-3">
          {sportTypeOptions?.map((sport) => (
            <label key={sport} className="flex items-center space-x-3 cursor-pointer">
              <Checkbox
                checked={activeFilters?.sportTypes?.includes(sport)}
                onChange={(e) => handleSportTypeChange(sport, e?.target?.checked)}
                className="rounded"
              />
              <span className="text-sm text-foreground">{sport}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" sectionKey="price">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-1">Min ($)</label>
              <input
                type="number"
                min="0"
                max="500"
                value={activeFilters?.priceRange?.[0] || 0}
                onChange={(e) => handlePriceRangeChange(0, e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-md text-sm"
              />
            </div>
            <div className="text-muted-foreground">-</div>
            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-1">Max ($)</label>
              <input
                type="number"
                min="0"
                max="500"
                value={activeFilters?.priceRange?.[1] || 200}
                onChange={(e) => handlePriceRangeChange(1, e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-md text-sm"
              />
            </div>
          </div>
          
          {/* Price Range Slider Visualization */}
          <div className="relative">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>$500</span>
            </div>
            <div className="mt-2 h-2 bg-muted rounded-full relative">
              <div 
                className="absolute h-2 bg-primary rounded-full"
                style={{
                  left: `${(activeFilters?.priceRange?.[0] / 500) * 100}%`,
                  width: `${((activeFilters?.priceRange?.[1] - activeFilters?.priceRange?.[0]) / 500) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Venue Types */}
      <FilterSection title="Venue Types" sectionKey="venueTypes">
        <div className="space-y-3">
          {venueTypeOptions?.map((venueType) => (
            <label key={venueType} className="flex items-center space-x-3 cursor-pointer">
              <Checkbox
                checked={activeFilters?.venueTypes?.includes(venueType)}
                onChange={(e) => handleVenueTypeChange(venueType, e?.target?.checked)}
                className="rounded"
              />
              <span className="text-sm text-foreground">{venueType}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection title="Minimum Rating" sectionKey="rating">
        <Select
          value={activeFilters?.rating}
          onChange={(value) => onFiltersChange({ ...activeFilters, rating: parseFloat(value) })}
          options={ratingOptions}
          placeholder="Any Rating"
        />
      </FilterSection>

      {/* Distance Filter */}
      <FilterSection title="Distance" sectionKey="distance">
        <Select
          value={activeFilters?.distance}
          onChange={(value) => onFiltersChange({ ...activeFilters, distance: parseInt(value) })}
          options={distanceOptions}
          placeholder="Any Distance"
        />
      </FilterSection>
    </div>
  );
};

export default FilterPanel;