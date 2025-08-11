import React, { useState } from 'react';
        import Icon from '../../../components/AppIcon';
        import Button from '../../../components/ui/Button';
        import Input from '../../../components/ui/Input';
        import { Checkbox } from '../../../components/ui/Checkbox';

        const PricingManagementTab = ({ courts, pricing, onPricingChange, isPreviewMode }) => {
          const [activeSection, setActiveSection] = useState('time-based');
          const [showAddRateModal, setShowAddRateModal] = useState(false);
          const [editingRate, setEditingRate] = useState(null);
          const [rateForm, setRateForm] = useState({
            name: '',
            courtIds: [],
            timeSlots: [],
            rate: '',
            type: 'peak', // peak, off-peak, special
            daysOfWeek: [],
            validFrom: '',
            validTo: ''
          });

          const daysOfWeek = [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
          ];

          const timeSlots = [
            '6:00 AM - 8:00 AM',
            '8:00 AM - 10:00 AM',
            '10:00 AM - 12:00 PM',
            '12:00 PM - 2:00 PM',
            '2:00 PM - 4:00 PM',
            '4:00 PM - 6:00 PM',
            '6:00 PM - 8:00 PM',
            '8:00 PM - 10:00 PM',
            '10:00 PM - 12:00 AM'
          ];

          const handleAddTimeSlot = () => {
            setRateForm({
              name: '',
              courtIds: [],
              timeSlots: [],
              rate: '',
              type: 'peak',
              daysOfWeek: [],
              validFrom: '',
              validTo: ''
            });
            setEditingRate(null);
            setShowAddRateModal(true);
          };

          const handleEditRate = (rate) => {
            setRateForm(rate);
            setEditingRate(rate?.id);
            setShowAddRateModal(true);
          };

          const handleSaveRate = () => {
            const rateData = {
              ...rateForm,
              id: editingRate || Date.now()?.toString()
            };

            let updatedTimeSlots;
            if (editingRate) {
              updatedTimeSlots = (pricing?.timeSlots || [])?.map(slot => 
                slot?.id === editingRate ? rateData : slot
              );
            } else {
              updatedTimeSlots = [...(pricing?.timeSlots || []), rateData];
            }

            onPricingChange?.({ ...pricing, timeSlots: updatedTimeSlots });
            setShowAddRateModal(false);
            setEditingRate(null);
          };

          const handleDeleteRate = (rateId) => {
            let updatedTimeSlots = (pricing?.timeSlots || [])?.filter(slot => slot?.id !== rateId);
            onPricingChange?.({ ...pricing, timeSlots: updatedTimeSlots });
          };

          const handleCourtToggle = (courtId) => {
            const currentCourts = rateForm?.courtIds || [];
            const updatedCourts = currentCourts?.includes(courtId)
              ? currentCourts?.filter(id => id !== courtId)
              : [...currentCourts, courtId];
            
            setRateForm({ ...rateForm, courtIds: updatedCourts });
          };

          const handleDayToggle = (day) => {
            const currentDays = rateForm?.daysOfWeek || [];
            const updatedDays = currentDays?.includes(day)
              ? currentDays?.filter(d => d !== day)
              : [...currentDays, day];
            
            setRateForm({ ...rateForm, daysOfWeek: updatedDays });
          };

          const handleTimeSlotToggle = (slot) => {
            const currentSlots = rateForm?.timeSlots || [];
            const updatedSlots = currentSlots?.includes(slot)
              ? currentSlots?.filter(s => s !== slot)
              : [...currentSlots, slot];
            
            setRateForm({ ...rateForm, timeSlots: updatedSlots });
          };

          const handleBulkPricing = () => {
            console.log('Opening bulk pricing tool...');
          };

          if (isPreviewMode) {
            return (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Pricing Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pricing?.timeSlots?.map((slot) => (
                    <div key={slot?.id} className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">{slot?.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs
                          ${slot?.type === 'peak' ?'bg-warning/10 text-warning' 
                            : slot?.type === 'off-peak' ?'bg-success/10 text-success' :'bg-primary/10 text-primary'
                          }`}>
                          {slot?.type}
                        </span>
                      </div>
                      <div className="text-lg font-semibold text-foreground mb-2">
                        ${slot?.rate}/hour
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {slot?.daysOfWeek?.join(', ')}
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
                  <h3 className="text-lg font-semibold text-foreground">Pricing Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure time-based rates, seasonal adjustments, and bulk pricing
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    iconName="Calculator"
                    iconPosition="left"
                    onClick={handleBulkPricing}
                  >
                    Bulk Pricing
                  </Button>
                  <Button
                    variant="default"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={handleAddTimeSlot}
                  >
                    Add Time Slot
                  </Button>
                </div>
              </div>
              {/* Section Tabs */}
              <div className="flex items-center space-x-4 border-b border-border">
                {[
                  { id: 'time-based', label: 'Time-based Rates', icon: 'Clock' },
                  { id: 'seasonal', label: 'Seasonal Rates', icon: 'Calendar' },
                  { id: 'discounts', label: 'Bulk Discounts', icon: 'Percent' }
                ]?.map(section => (
                  <button
                    key={section?.id}
                    onClick={() => setActiveSection(section?.id)}
                    className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-micro
                      ${activeSection === section?.id 
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    <Icon name={section?.icon} size={16} />
                    <span>{section?.label}</span>
                  </button>
                ))}
              </div>
              {/* Time-based Rates */}
              {activeSection === 'time-based' && (
                <div className="space-y-6">
                  {pricing?.timeSlots?.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {pricing?.timeSlots?.map((slot) => (
                        <div key={slot?.id} className="bg-card border border-border rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-medium text-foreground">{slot?.name}</h4>
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium
                                ${slot?.type === 'peak' ?'bg-warning/10 text-warning' 
                                  : slot?.type === 'off-peak' ?'bg-success/10 text-success' :'bg-primary/10 text-primary'
                                }`}>
                                {slot?.type?.replace('-', ' ')}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-foreground">
                                ${slot?.rate}
                              </div>
                              <div className="text-sm text-muted-foreground">per hour</div>
                            </div>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div>
                              <div className="text-sm font-medium text-foreground mb-1">Time Slots</div>
                              <div className="flex flex-wrap gap-1">
                                {slot?.timeSlots?.map((time, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                                  >
                                    {time}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <div className="text-sm font-medium text-foreground mb-1">Days</div>
                              <div className="flex flex-wrap gap-1">
                                {slot?.daysOfWeek?.map((day, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                                  >
                                    {day?.substring(0, 3)}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <div className="text-sm font-medium text-foreground mb-1">
                                Courts ({slot?.courtIds?.length})
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {slot?.courtIds?.length === courts?.length 
                                  ? 'All courts'
                                  : `${slot?.courtIds?.length} selected`
                                }
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              iconName="Edit"
                              iconPosition="left"
                              onClick={() => handleEditRate(slot)}
                              className="flex-1"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              iconName="Copy"
                              iconPosition="left"
                              onClick={() => {
                                const duplicate = { ...slot, id: Date.now()?.toString(), name: `${slot?.name} Copy` };
                                const updatedSlots = [...(pricing?.timeSlots || []), duplicate];
                                onPricingChange?.({ ...pricing, timeSlots: updatedSlots });
                              }}
                              className="flex-1"
                            >
                              Duplicate
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              iconName="Trash2"
                              onClick={() => handleDeleteRate(slot?.id)}
                              className="text-destructive hover:text-destructive"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Icon name="Clock" size={64} className="mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No Time-based Rates</h3>
                      <p className="text-muted-foreground mb-4">
                        Set up peak and off-peak pricing for different time slots
                      </p>
                      <Button
                        variant="default"
                        iconName="Plus"
                        iconPosition="left"
                        onClick={handleAddTimeSlot}
                      >
                        Add Time Slot Rate
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {/* Seasonal Rates */}
              {activeSection === 'seasonal' && (
                <div className="text-center py-12">
                  <Icon name="Calendar" size={64} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Seasonal Rates</h3>
                  <p className="text-muted-foreground mb-4">
                    Configure seasonal pricing adjustments (Coming Soon)
                  </p>
                </div>
              )}
              {/* Bulk Discounts */}
              {activeSection === 'discounts' && (
                <div className="text-center py-12">
                  <Icon name="Percent" size={64} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Bulk Discounts</h3>
                  <p className="text-muted-foreground mb-4">
                    Set up volume discounts for multiple bookings (Coming Soon)
                  </p>
                </div>
              )}
              {/* Add/Edit Rate Modal */}
              {showAddRateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-border">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">
                          {editingRate ? 'Edit Rate' : 'Add Time Slot Rate'}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          iconName="X"
                          onClick={() => setShowAddRateModal(false)}
                        />
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <Input
                          label="Rate Name"
                          required
                          value={rateForm?.name}
                          onChange={(e) => setRateForm({ ...rateForm, name: e?.target?.value })}
                          placeholder="Peak Hours, Weekend Special, etc."
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Rate Type <span className="text-destructive">*</span>
                            </label>
                            <select
                              value={rateForm?.type}
                              onChange={(e) => setRateForm({ ...rateForm, type: e?.target?.value })}
                              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                            >
                              <option value="peak">Peak Hours</option>
                              <option value="off-peak">Off-Peak Hours</option>
                              <option value="special">Special Rate</option>
                            </select>
                          </div>

                          <Input
                            label="Rate ($/hour)"
                            type="number"
                            step="0.01"
                            required
                            value={rateForm?.rate}
                            onChange={(e) => setRateForm({ ...rateForm, rate: e?.target?.value })}
                            placeholder="25.00"
                          />
                        </div>
                      </div>

                      {/* Court Selection */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Select Courts</h4>
                        
                        <div className="space-y-2">
                          <Checkbox
                            id="all-courts"
                            label="Apply to all courts"
                            checked={rateForm?.courtIds?.length === courts?.length}
                            onChange={(e) => {
                              if (e?.target?.checked) {
                                setRateForm({ ...rateForm, courtIds: courts?.map(c => c?.id) });
                              } else {
                                setRateForm({ ...rateForm, courtIds: [] });
                              }
                            }}
                          />
                          
                          {courts?.map((court) => (
                            <Checkbox
                              key={court?.id}
                              id={`court-${court?.id}`}
                              label={court?.name}
                              checked={rateForm?.courtIds?.includes(court?.id)}
                              onChange={() => handleCourtToggle(court?.id)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Days of Week */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Days of Week</h4>
                        
                        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                          {daysOfWeek?.map((day) => (
                            <button
                              key={day}
                              onClick={() => handleDayToggle(day)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
                                ${rateForm?.daysOfWeek?.includes(day)
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                            >
                              {day?.substring(0, 3)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Time Slots */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Time Slots</h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {timeSlots?.map((slot) => (
                            <button
                              key={slot}
                              onClick={() => handleTimeSlotToggle(slot)}
                              className={`px-3 py-2 rounded-lg text-sm text-left transition-colors
                                ${rateForm?.timeSlots?.includes(slot)
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Validity Period */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Validity Period (Optional)</h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Valid From"
                            type="date"
                            value={rateForm?.validFrom}
                            onChange={(e) => setRateForm({ ...rateForm, validFrom: e?.target?.value })}
                          />
                          <Input
                            label="Valid To"
                            type="date"
                            value={rateForm?.validTo}
                            onChange={(e) => setRateForm({ ...rateForm, validTo: e?.target?.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border-t border-border flex items-center justify-end space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowAddRateModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        onClick={handleSaveRate}
                        disabled={
                          !rateForm?.name || 
                          !rateForm?.rate || 
                          rateForm?.courtIds?.length === 0 ||
                          rateForm?.daysOfWeek?.length === 0 ||
                          rateForm?.timeSlots?.length === 0
                        }
                      >
                        {editingRate ? 'Update Rate' : 'Add Rate'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        };

        export default PricingManagementTab;