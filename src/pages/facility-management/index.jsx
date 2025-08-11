import React, { useState, useEffect } from 'react';
        import Header from '../../components/ui/Header';
        import Icon from '../../components/AppIcon';
        import Button from '../../components/ui/Button';

        // Import components
        import VenueDetailsTab from './components/VenueDetailsTab';
        import CourtsManagementTab from './components/CourtsManagementTab';
        import PricingManagementTab from './components/PricingManagementTab';
        import OperatingHoursTab from './components/OperatingHoursTab';

        const FacilityManagement = () => {
          const [activeTab, setActiveTab] = useState('venue-details');
          const [isLoading, setIsLoading] = useState(true);
          const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
          const [autoSaveStatus, setAutoSaveStatus] = useState('');
          const [isPreviewMode, setIsPreviewMode] = useState(false);

          // Facility data state
          const [facilityData, setFacilityData] = useState({
            venueDetails: {
              name: '',
              description: '',
              contactPhone: '',
              contactEmail: '',
              website: '',
              location: {
                address: '',
                city: '',
                state: '',
                zipCode: '',
                coordinates: { lat: null, lng: null }
              },
              photos: [],
              amenities: [],
              customAmenities: []
            },
            sportsTypes: [],
            courts: [],
            pricing: {
              timeSlots: [],
              seasonalRates: [],
              bulkDiscounts: []
            },
            operatingHours: {
              weeklySchedule: {},
              holidays: [],
              maintenanceBlocks: []
            }
          });

          useEffect(() => {
            // Simulate data loading
            const timer = setTimeout(() => {
              setIsLoading(false);
            }, 1000);

            return () => clearTimeout(timer);
          }, []);

          // Auto-save functionality
          useEffect(() => {
            if (hasUnsavedChanges) {
              setAutoSaveStatus('Saving...');
              const autoSaveTimer = setTimeout(() => {
                // Simulate auto-save
                setAutoSaveStatus('Saved');
                setHasUnsavedChanges(false);
                setTimeout(() => setAutoSaveStatus(''), 2000);
              }, 1000);

              return () => clearTimeout(autoSaveTimer);
            }
          }, [hasUnsavedChanges]);

          const tabs = [
            { id: 'venue-details', label: 'Venue Details', icon: 'Building2' },
            { id: 'courts-management', label: 'Courts Management', icon: 'Layout' },
            { id: 'pricing-management', label: 'Pricing', icon: 'DollarSign' },
            { id: 'operating-hours', label: 'Operating Hours', icon: 'Clock' }
          ];

          const handleDataChange = (section, data) => {
            setFacilityData(prev => ({
              ...prev,
              [section]: { ...prev?.[section], ...data }
            }));
            setHasUnsavedChanges(true);
          };

          const handleSave = () => {
            setAutoSaveStatus('Saving...');
            // Simulate save operation
            setTimeout(() => {
              setAutoSaveStatus('Saved successfully');
              setHasUnsavedChanges(false);
              setTimeout(() => setAutoSaveStatus(''), 3000);
            }, 1000);
          };

          const handlePreview = () => {
            setIsPreviewMode(!isPreviewMode);
          };

          const handlePublish = () => {
            console.log('Publishing facility changes...');
            // Handle publish logic
          };

          if (isLoading) {
            return (
              <div className="min-h-screen bg-background">
                <Header userRole="facility-owner" isAuthenticated={true} />
                <div className="pt-16">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-center h-64">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-muted-foreground">Loading facility management...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div className="min-h-screen bg-background">
              <Header userRole="facility-owner" isAuthenticated={true} />
              <div className="pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {/* Page Header */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-foreground">Facility Management</h1>
                        <p className="text-muted-foreground mt-1">
                          Manage your facility information, courts, pricing, and operational settings
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {/* Auto-save status */}
                        {autoSaveStatus && (
                          <div className="flex items-center space-x-2 px-3 py-1 bg-muted rounded-lg">
                            {autoSaveStatus === 'Saving...' && (
                              <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {autoSaveStatus?.includes('Saved') && (
                              <Icon name="Check" size={14} className="text-success" />
                            )}
                            <span className="text-sm text-muted-foreground">{autoSaveStatus}</span>
                          </div>
                        )}
                        
                        <Button
                          variant="outline"
                          iconName="Eye"
                          iconPosition="left"
                          onClick={handlePreview}
                        >
                          {isPreviewMode ? 'Edit Mode' : 'Preview'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          iconName="Save"
                          iconPosition="left"
                          onClick={handleSave}
                          disabled={!hasUnsavedChanges}
                        >
                          Save Changes
                        </Button>
                        
                        <Button
                          variant="default"
                          iconName="Globe"
                          iconPosition="left"
                          onClick={handlePublish}
                        >
                          Publish
                        </Button>
                      </div>
                    </div>

                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <button 
                        onClick={() => window.location.href = '/facility-owner-dashboard'}
                        className="hover:text-foreground transition-micro"
                      >
                        Dashboard
                      </button>
                      <Icon name="ChevronRight" size={14} />
                      <span className="text-foreground">Facility Management</span>
                    </nav>
                  </div>

                  {/* Tab Navigation */}
                  <div className="mb-8">
                    <div className="border-b border-border">
                      <nav className="flex space-x-8 overflow-x-auto">
                        {tabs?.map(tab => (
                          <button
                            key={tab?.id}
                            onClick={() => setActiveTab(tab?.id)}
                            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-micro whitespace-nowrap
                              ${activeTab === tab?.id 
                                ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                              }`}
                          >
                            <Icon name={tab?.icon} size={16} />
                            <span>{tab?.label}</span>
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="space-y-8">
                    {activeTab === 'venue-details' && (
                      <VenueDetailsTab
                        data={facilityData?.venueDetails}
                        sportsTypes={facilityData?.sportsTypes}
                        onDataChange={(data) => handleDataChange('venueDetails', data)}
                        onSportsTypesChange={(data) => handleDataChange('sportsTypes', data)}
                        isPreviewMode={isPreviewMode}
                      />
                    )}

                    {activeTab === 'courts-management' && (
                      <CourtsManagementTab
                        courts={facilityData?.courts}
                        sportsTypes={facilityData?.sportsTypes}
                        onCourtsChange={(data) => handleDataChange('courts', data)}
                        isPreviewMode={isPreviewMode}
                      />
                    )}

                    {activeTab === 'pricing-management' && (
                      <PricingManagementTab
                        courts={facilityData?.courts}
                        pricing={facilityData?.pricing}
                        onPricingChange={(data) => handleDataChange('pricing', data)}
                        isPreviewMode={isPreviewMode}
                      />
                    )}

                    {activeTab === 'operating-hours' && (
                      <OperatingHoursTab
                        operatingHours={facilityData?.operatingHours}
                        onOperatingHoursChange={(data) => handleDataChange('operatingHours', data)}
                        isPreviewMode={isPreviewMode}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        };

        export default FacilityManagement;