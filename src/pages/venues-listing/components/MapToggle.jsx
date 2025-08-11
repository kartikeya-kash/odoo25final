import React from 'react';
import Button from '../../../components/ui/Button';


const MapToggle = ({ showMap, onToggle }) => {
  return (
    <Button
      variant={showMap ? "default" : "outline"}
      onClick={() => onToggle(!showMap)}
      iconName={showMap ? "List" : "Map"}
      size="sm"
      className="min-w-[100px]"
    >
      {showMap ? "List View" : "Map View"}
    </Button>
  );
};

export default MapToggle;