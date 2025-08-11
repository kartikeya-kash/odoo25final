import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterTags = ({ 
  activeFilters, 
  searchTerm, 
  locationFilter, 
  onRemoveFilter, 
  onClearAll 
}) => {
  const getActiveTags = () => {
    const tags = [];

    // Search term tag
    if (searchTerm) {
      tags?.push({
        type: 'search',
        value: searchTerm,
        label: `Search: "${searchTerm}"`
      });
    }

    // Location filter tag
    if (locationFilter) {
      tags?.push({
        type: 'location',
        value: locationFilter,
        label: `Location: ${locationFilter}`
      });
    }

    // Sport types tags
    activeFilters?.sportTypes?.forEach(sport => {
      tags?.push({
        type: 'sportTypes',
        value: sport,
        label: sport
      });
    });

    // Venue types tags
    activeFilters?.venueTypes?.forEach(venue => {
      tags?.push({
        type: 'venueTypes',
        value: venue,
        label: venue
      });
    });

    // Price range tag
    if (activeFilters?.priceRange?.[0] > 0 || activeFilters?.priceRange?.[1] < 200) {
      tags?.push({
        type: 'price',
        value: 'price',
        label: `$${activeFilters?.priceRange?.[0]} - $${activeFilters?.priceRange?.[1]}`
      });
    }

    // Rating tag
    if (activeFilters?.rating > 0) {
      tags?.push({
        type: 'rating',
        value: 'rating',
        label: `${activeFilters?.rating}+ stars`
      });
    }

    // Distance tag
    if (activeFilters?.distance < 25) {
      tags?.push({
        type: 'distance',
        value: 'distance',
        label: `Within ${activeFilters?.distance} km`
      });
    }

    return tags;
  };

  const activeTags = getActiveTags();

  if (activeTags?.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-muted/30 rounded-lg">
      <span className="text-sm font-medium text-foreground">Active filters:</span>
      
      {activeTags?.map((tag, index) => (
        <button
          key={`${tag?.type}-${tag?.value}-${index}`}
          onClick={() => onRemoveFilter(tag?.type, tag?.value)}
          className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/80 transition-micro"
        >
          <span>{tag?.label}</span>
          <Icon name="X" size={14} />
        </button>
      ))}

      {activeTags?.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-muted-foreground hover:text-foreground ml-2"
        >
          Clear All
        </Button>
      )}
    </div>
  );
};

export default FilterTags;