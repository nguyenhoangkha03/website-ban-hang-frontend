
import { Filters } from '@/types';
import React from 'react';

interface FilterSidebarProps {
  onFilterChange: (filters: Filters) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-bold mb-4">Filters</h3>
      <p>Filter options will be here.</p>
    </div>
  );
};

export default FilterSidebar;
