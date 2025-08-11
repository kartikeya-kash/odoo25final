import React, { useState } from 'react';
        import Icon from '../../../components/AppIcon';
        import Button from '../../../components/ui/Button';
        import Input from '../../../components/ui/Input';
        import { Checkbox } from '../../../components/ui/Checkbox';

        const CourtsManagementTab = ({ courts, sportsTypes, onCourtsChange, isPreviewMode }) => {
          const [showAddCourtModal, setShowAddCourtModal] = useState(false);
          const [editingCourt, setEditingCourt] = useState(null);
          const [courtForm, setCourtForm] = useState({
            name: '',
            sportType: '',
            dimensions: { length: '', width: '', height: '' },
            surfaceType: '',
            features: [],
            pricing: { baseRate: '', peakRate: '' },
            status: 'active'
          });

          const surfaceTypes = {
            tennis: ['Hard Court', 'Clay', 'Grass', 'Synthetic'],
            basketball: ['Hardwood', 'Synthetic', 'Concrete', 'Rubber'],
            badminton: ['Synthetic', 'Wood', 'PVC'],
            volleyball: ['Sand', 'Hardwood', 'Synthetic'],
            squash: ['Hardwood', 'Synthetic'],
            pickleball: ['Concrete', 'Synthetic', 'Hard Court']
          };

          const courtFeatures = [
            'Indoor', 'Outdoor', 'Climate Controlled', 'Lighting',
            'Bleachers', 'Sound System', 'Score Board', 'Net System',
            'Ball Machine', 'Video Recording', 'Live Streaming'
          ];

          const handleAddCourt = () => {
            setCourtForm({
              name: '',
              sportType: sportsTypes?.[0]?.id || '',
              dimensions: { length: '', width: '', height: '' },
              surfaceType: '',
              features: [],
              pricing: { baseRate: '', peakRate: '' },
              status: 'active'
            });
            setEditingCourt(null);
            setShowAddCourtModal(true);
          };

          const handleEditCourt = (court) => {
            setCourtForm(court);
            setEditingCourt(court?.id);
            setShowAddCourtModal(true);
          };

          const handleSaveCourt = () => {
            const courtData = {
              ...courtForm,
              id: editingCourt || Date.now()?.toString()
            };

            let updatedCourts;
            if (editingCourt) {
              updatedCourts = courts?.map(court => 
                court?.id === editingCourt ? courtData : court
              );
            } else {
              updatedCourts = [...(courts || []), courtData];
            }

            onCourtsChange?.(updatedCourts);
            setShowAddCourtModal(false);
            setEditingCourt(null);
          };

          const handleDeleteCourt = (courtId) => {
            let updatedCourts = courts?.filter(court => court?.id !== courtId);
            onCourtsChange?.(updatedCourts);
          };

          const handleToggleCourtStatus = (courtId) => {
            let updatedCourts = courts?.map(court => {
              if (court?.id === courtId) {
                return {
                  ...court,
                  status: court?.status === 'active' ? 'inactive' : 'active'
                };
              }
              return court;
            });
            onCourtsChange?.(updatedCourts);
          };

          const handleFeatureToggle = (feature) => {
            const currentFeatures = courtForm?.features || [];
            const updatedFeatures = currentFeatures?.includes(feature)
              ? currentFeatures?.filter(f => f !== feature)
              : [...currentFeatures, feature];
            
            setCourtForm({ ...courtForm, features: updatedFeatures });
          };

          if (isPreviewMode) {
            return (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Courts Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courts?.map((court) => (
                    <div key={court?.id} className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">{court?.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs
                          ${court?.status === 'active' ?'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                          }`}>
                          {court?.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {sportsTypes?.find(s => s?.id === court?.sportType)?.name}
                      </p>
                      <div className="text-sm">
                        <div>Surface: {court?.surfaceType}</div>
                        <div>Base Rate: ${court?.pricing?.baseRate}/hour</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Courts Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your courts, configure details, and set pricing
                  </p>
                </div>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={handleAddCourt}
                >
                  Add Court
                </Button>
              </div>

              {/* Courts Grid */}
              {courts?.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {courts?.map((court) => (
                    <div key={court?.id} className="bg-card border border-border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-medium text-foreground">{court?.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {sportsTypes?.find(s => s?.id === court?.sportType)?.name}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleCourtStatus(court?.id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
                              ${court?.status === 'active' ?'bg-success/10 text-success hover:bg-success/20' :'bg-muted text-muted-foreground hover:bg-muted/80'
                              }`}
                          >
                            {court?.status}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm">
                          <Icon name="Layers" size={16} className="mr-2 text-muted-foreground" />
                          <span>{court?.surfaceType}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Icon name="Ruler" size={16} className="mr-2 text-muted-foreground" />
                          <span>
                            {court?.dimensions?.length}"L × {court?.dimensions?.width}"W
                            {court?.dimensions?.height && ` × ${court?.dimensions?.height}"H`}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Icon name="DollarSign" size={16} className="mr-2 text-muted-foreground" />
                          <span>
                            Base: ${court?.pricing?.baseRate}/hr
                            {court?.pricing?.peakRate && ` • Peak: ${court?.pricing?.peakRate}/hr`}
                          </span>
                        </div>
                      </div>

                      {court?.features?.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {court?.features?.slice(0, 3)?.map((feature) => (
                              <span
                                key={feature}
                                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                            {court?.features?.length > 3 && (
                              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                                +{court?.features?.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="Edit"
                          iconPosition="left"
                          onClick={() => handleEditCourt(court)}
                          className="flex-1"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="Calendar"
                          iconPosition="left"
                          onClick={() => console.log('View bookings for', court?.name)}
                          className="flex-1"
                        >
                          Bookings
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          iconName="Trash2"
                          onClick={() => handleDeleteCourt(court?.id)}
                          className="text-destructive hover:text-destructive"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon name="Building2" size={64} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Courts Added</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by adding your first court to manage bookings and pricing
                  </p>
                  <Button
                    variant="default"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={handleAddCourt}
                  >
                    Add Your First Court
                  </Button>
                </div>
              )}

              {/* Add/Edit Court Modal */}
              {showAddCourtModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-border">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">
                          {editingCourt ? 'Edit Court' : 'Add New Court'}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          iconName="X"
                          onClick={() => setShowAddCourtModal(false)}
                        />
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Basic Information</h4>
                        
                        <Input
                          label="Court Name"
                          required
                          value={courtForm?.name}
                          onChange={(e) => setCourtForm({ ...courtForm, name: e?.target?.value })}
                          placeholder="Court 1, Main Court, etc."
                        />

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Sport Type <span className="text-destructive">*</span>
                          </label>
                          <select
                            value={courtForm?.sportType}
                            onChange={(e) => setCourtForm({ 
                              ...courtForm, 
                              sportType: e?.target?.value,
                              surfaceType: '' // Reset surface type when sport changes
                            })}
                            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                          >
                            <option value="">Select sport type</option>
                            {sportsTypes?.map((sport) => (
                              <option key={sport?.id} value={sport?.id}>
                                {sport?.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {courtForm?.sportType && (
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Surface Type <span className="text-destructive">*</span>
                            </label>
                            <select
                              value={courtForm?.surfaceType}
                              onChange={(e) => setCourtForm({ ...courtForm, surfaceType: e?.target?.value })}
                              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                            >
                              <option value="">Select surface type</option>
                              {surfaceTypes?.[courtForm?.sportType]?.map((surface) => (
                                <option key={surface} value={surface}>
                                  {surface}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Dimensions */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Dimensions</h4>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <Input
                            label="Length (ft)"
                            type="number"
                            value={courtForm?.dimensions?.length}
                            onChange={(e) => setCourtForm({
                              ...courtForm,
                              dimensions: { ...courtForm?.dimensions, length: e?.target?.value }
                            })}
                            placeholder="60"
                          />
                          <Input
                            label="Width (ft)"
                            type="number"
                            value={courtForm?.dimensions?.width}
                            onChange={(e) => setCourtForm({
                              ...courtForm,
                              dimensions: { ...courtForm?.dimensions, width: e?.target?.value }
                            })}
                            placeholder="30"
                          />
                          <Input
                            label="Height (ft)"
                            type="number"
                            value={courtForm?.dimensions?.height}
                            onChange={(e) => setCourtForm({
                              ...courtForm,
                              dimensions: { ...courtForm?.dimensions, height: e?.target?.value }
                            })}
                            placeholder="20"
                          />
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Features</h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {courtFeatures?.map((feature) => (
                            <Checkbox
                              key={feature}
                              id={`court-feature-${feature}`}
                              label={feature}
                              checked={courtForm?.features?.includes(feature)}
                              onChange={() => handleFeatureToggle(feature)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Base Pricing</h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Base Rate ($/hour)"
                            type="number"
                            step="0.01"
                            value={courtForm?.pricing?.baseRate}
                            onChange={(e) => setCourtForm({
                              ...courtForm,
                              pricing: { ...courtForm?.pricing, baseRate: e?.target?.value }
                            })}
                            placeholder="25.00"
                          />
                          <Input
                            label="Peak Rate ($/hour)"
                            type="number"
                            step="0.01"
                            value={courtForm?.pricing?.peakRate}
                            onChange={(e) => setCourtForm({
                              ...courtForm,
                              pricing: { ...courtForm?.pricing, peakRate: e?.target?.value }
                            })}
                            placeholder="35.00"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border-t border-border flex items-center justify-end space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowAddCourtModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        onClick={handleSaveCourt}
                        disabled={!courtForm?.name || !courtForm?.sportType || !courtForm?.surfaceType}
                      >
                        {editingCourt ? 'Update Court' : 'Add Court'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        };

        export default CourtsManagementTab;