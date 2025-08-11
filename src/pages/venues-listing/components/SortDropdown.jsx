import React from 'react';
import Select from '../../../components/ui/Select';

const SortDropdown = ({ sortBy, onSortChange }) => {
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'distance', label: 'Nearest First' }
  ];

  return (
    <div className="w-48">
      <Select
        value={sortBy}
        onChange={onSortChange}
        options={sortOptions}
        placeholder="Sort by"
        className="text-sm"
      />
    </div>
  );
};

export default SortDropdown;