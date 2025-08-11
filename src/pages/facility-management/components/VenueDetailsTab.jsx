import React, { useState } from 'react';
        import Icon from '../../../components/AppIcon';
        import Button from '../../../components/ui/Button';
        import Input from '../../../components/ui/Input';
        import { Checkbox } from '../../../components/ui/Checkbox';

        const VenueDetailsTab = ({ data, sportsTypes, onDataChange, onSportsTypesChange, isPreviewMode }) => {
          const [draggedFiles, setDraggedFiles] = useState([]);
          const [isDragOver, setIsDragOver] = useState(false);

          const commonAmenities = [
            'Parking', 'Restrooms', 'Locker Rooms', 'Showers', 'Water Fountains',
            'Seating Area', 'Lighting', 'Air Conditioning', 'WiFi', 'Sound System',
            'First Aid Kit', 'Equipment Rental', 'Refreshments', 'Pro Shop'
          ];

          const availableSports = [
            { id: 'tennis', name: 'Tennis', skillLevels: ['Beginner', 'Intermediate', 'Advanced', 'Professional'] },
            { id: 'basketball', name: 'Basketball', skillLevels: ['Recreational', 'Competitive', 'Professional'] },
            { id: 'badminton', name: 'Badminton', skillLevels: ['Beginner', 'Intermediate', 'Advanced'] },
            { id: 'volleyball', name: 'Volleyball', skillLevels: ['Recreational', 'Club', 'Tournament'] },
            { id: 'squash', name: 'Squash', skillLevels: ['Beginner', 'Intermediate', 'Advanced'] },
            { id: 'pickleball', name: 'Pickleball', skillLevels: ['Beginner', 'Intermediate', 'Advanced'] }
          ];

          const handleBasicInfoChange = (field, value) => {
            onDataChange?.({ ...data, [field]: value });
          };

          const handleLocationChange = (field, value) => {
            onDataChange?.({
              ...data,
              location: { ...data?.location, [field]: value }
            });
          };

          const handleAmenityToggle = (amenity) => {
            const currentAmenities = data?.amenities || [];
            const updatedAmenities = currentAmenities?.includes(amenity)
              ? currentAmenities?.filter(a => a !== amenity)
              : [...currentAmenities, amenity];
            
            onDataChange?.({ ...data, amenities: updatedAmenities });
          };

          const handleCustomAmenityAdd = (amenity) => {
            if (amenity?.trim() && !data?.customAmenities?.includes(amenity?.trim())) {
              onDataChange?.({
                ...data,
                customAmenities: [...(data?.customAmenities || []), amenity?.trim()]
              });
            }
          };

          const handleSportToggle = (sportId) => {
            const currentSports = sportsTypes || [];
            const sportExists = currentSports?.find(s => s?.id === sportId);
            
            if (sportExists) {
              onSportsTypesChange?.(currentSports?.filter(s => s?.id !== sportId));
            } else {
              const sportInfo = availableSports?.find(s => s?.id === sportId);
              onSportsTypesChange?.([
                ...currentSports,
                {
                  id: sportId,
                  name: sportInfo?.name,
                  skillLevels: [],
                  equipmentAvailable: false
                }
              ]);
            }
          };

          const handleSkillLevelToggle = (sportId, skillLevel) => {
            const updatedSports = (sportsTypes || [])?.map(sport => {
              if (sport?.id === sportId) {
                const currentLevels = sport?.skillLevels || [];
                const updatedLevels = currentLevels?.includes(skillLevel)
                  ? currentLevels?.filter(level => level !== skillLevel)
                  : [...currentLevels, skillLevel];
                
                return { ...sport, skillLevels: updatedLevels };
              }
              return sport;
            });
            
            onSportsTypesChange?.(updatedSports);
          };

          const handleFileUpload = (files) => {
            const newPhotos = Array?.from(files)?.map(file => ({
              id: Date.now() + Math.random(),
              file: file,
              preview: URL.createObjectURL(file),
              name: file?.name
            }));
            
            onDataChange?.({
              ...data,
              photos: [...(data?.photos || []), ...newPhotos]
            });
          };

          const handleDragOver = (e) => {
            e?.preventDefault();
            setIsDragOver(true);
          };

          const handleDragLeave = (e) => {
            e?.preventDefault();
            setIsDragOver(false);
          };

          const handleDrop = (e) => {
            e?.preventDefault();
            setIsDragOver(false);
            const files = e?.dataTransfer?.files;
            if (files?.length > 0) {
              handleFileUpload(files);
            }
          };

          if (isPreviewMode) {
            return (
              <div className="space-y-8">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">{data?.name || 'Venue Name'}</h2>
                  <p className="text-muted-foreground mb-4">{data?.description || 'Venue description will appear here'}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Icon name="Phone" size={16} className="inline mr-2" />
                      {data?.contactPhone || 'Contact phone'}
                    </div>
                    <div>
                      <Icon name="Mail" size={16} className="inline mr-2" />
                      {data?.contactEmail || 'Contact email'}
                    </div>
                    <div>
                      <Icon name="MapPin" size={16} className="inline mr-2" />
                      {data?.location?.address || 'Address will appear here'}
                    </div>
                    <div>
                      <Icon name="Globe" size={16} className="inline mr-2" />
                      {data?.website || 'Website URL'}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div className="space-y-8">
              {/* Basic Information Section */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="Info" size={20} className="mr-2" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Input
                    label="Venue Name"
                    required
                    value={data?.name || ''}
                    onChange={(e) => handleBasicInfoChange('name', e?.target?.value)}
                    placeholder="Enter venue name"
                  />
                  
                  <Input
                    label="Contact Phone"
                    type="tel"
                    value={data?.contactPhone || ''}
                    onChange={(e) => handleBasicInfoChange('contactPhone', e?.target?.value)}
                    placeholder="(555) 123-4567"
                  />
                  
                  <Input
                    label="Contact Email"
                    type="email"
                    value={data?.contactEmail || ''}
                    onChange={(e) => handleBasicInfoChange('contactEmail', e?.target?.value)}
                    placeholder="contact@venue.com"
                  />
                  
                  <Input
                    label="Website"
                    type="url"
                    value={data?.website || ''}
                    onChange={(e) => handleBasicInfoChange('website', e?.target?.value)}
                    placeholder="https://www.venue.com"
                  />
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full h-32 px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    value={data?.description || ''}
                    onChange={(e) => handleBasicInfoChange('description', e?.target?.value)}
                    placeholder="Describe your venue, facilities, and what makes it special..."
                  />
                </div>
              </div>

              {/* Location Section */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="MapPin" size={20} className="mr-2" />
                  Location Details
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <Input
                      label="Street Address"
                      required
                      value={data?.location?.address || ''}
                      onChange={(e) => handleLocationChange('address', e?.target?.value)}
                      placeholder="123 Main Street"
                    />
                  </div>
                  
                  <Input
                    label="City"
                    required
                    value={data?.location?.city || ''}
                    onChange={(e) => handleLocationChange('city', e?.target?.value)}
                    placeholder="City name"
                  />
                  
                  <Input
                    label="State"
                    required
                    value={data?.location?.state || ''}
                    onChange={(e) => handleLocationChange('state', e?.target?.value)}
                    placeholder="State"
                  />
                  
                  <Input
                    label="ZIP Code"
                    value={data?.location?.zipCode || ''}
                    onChange={(e) => handleLocationChange('zipCode', e?.target?.value)}
                    placeholder="12345"
                  />
                  
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      iconName="MapPin"
                      iconPosition="left"
                      onClick={() => console.log('Open map integration')}
                    >
                      Set on Map
                    </Button>
                    <Button
                      variant="ghost"
                      iconName="Navigation"
                      iconPosition="left"
                      onClick={() => console.log('Use current location')}
                    >
                      Use Current Location
                    </Button>
                  </div>
                </div>
              </div>

              {/* Photo Gallery Section */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="Camera" size={20} className="mr-2" />
                  Photo Gallery
                </h3>
                
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
                    ${isDragOver 
                      ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Icon name="Upload" size={40} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium text-foreground mb-2">
                    Drag & drop photos here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse files (JPG, PNG, max 5MB each)
                  </p>
                  <Button
                    variant="outline"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                  >
                    Add Photos
                  </Button>
                  
                  <input
                    id="photo-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e?.target?.files)}
                  />
                </div>

                {/* Photo Preview Grid */}
                {data?.photos?.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {data?.photos?.map((photo) => (
                      <div key={photo?.id} className="relative group">
                        <img
                          src={photo?.preview}
                          alt={photo?.name}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => {
                            const updatedPhotos = data?.photos?.filter(p => p?.id !== photo?.id);
                            onDataChange?.({ ...data, photos: updatedPhotos });
                          }}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Icon name="X" size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Amenities Section */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="Star" size={20} className="mr-2" />
                  Amenities
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {commonAmenities?.map((amenity) => (
                    <Checkbox
                      key={amenity}
                      id={`amenity-${amenity}`}
                      label={amenity}
                      checked={data?.amenities?.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Input
                      placeholder="Add custom amenity"
                      onKeyPress={(e) => {
                        if (e?.key === 'Enter') {
                          handleCustomAmenityAdd(e?.target?.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      iconName="Plus"
                      onClick={(e) => {
                        const input = e?.target?.closest('div')?.querySelector('input');
                        handleCustomAmenityAdd(input?.value);
                        input.value = '';
                      }}
                    >
                      Add
                    </Button>
                  </div>

                  {data?.customAmenities?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {data?.customAmenities?.map((amenity, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {amenity}
                          <button
                            onClick={() => {
                              const updated = data?.customAmenities?.filter(a => a !== amenity);
                              onDataChange?.({ ...data, customAmenities: updated });
                            }}
                            className="ml-2 hover:text-destructive"
                          >
                            <Icon name="X" size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sports Types Section */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="Trophy" size={20} className="mr-2" />
                  Sports Types
                </h3>
                
                <div className="space-y-6">
                  {availableSports?.map((sport) => {
                    const selectedSport = sportsTypes?.find(s => s?.id === sport?.id);
                    const isSelected = !!selectedSport;
                    
                    return (
                      <div key={sport?.id} className="space-y-4">
                        <Checkbox
                          id={`sport-${sport?.id}`}
                          label={sport?.name}
                          checked={isSelected}
                          onChange={() => handleSportToggle(sport?.id)}
                        />
                        
                        {isSelected && (
                          <div className="ml-6 space-y-4 p-4 bg-muted/50 rounded-lg">
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Skill Levels Accepted
                              </label>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {sport?.skillLevels?.map((level) => (
                                  <Checkbox
                                    key={level}
                                    id={`skill-${sport?.id}-${level}`}
                                    label={level}
                                    checked={selectedSport?.skillLevels?.includes(level)}
                                    onChange={() => handleSkillLevelToggle(sport?.id, level)}
                                  />
                                ))}
                              </div>
                            </div>
                            
                            <Checkbox
                              id={`equipment-${sport?.id}`}
                              label="Equipment Available for Rent"
                              checked={selectedSport?.equipmentAvailable}
                              onChange={(e) => {
                                const updatedSports = sportsTypes?.map(s => 
                                  s?.id === sport?.id 
                                    ? { ...s, equipmentAvailable: e?.target?.checked }
                                    : s
                                );
                                onSportsTypesChange?.(updatedSports);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        };

        export default VenueDetailsTab;