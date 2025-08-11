import React, { useState } from 'react';
        import Icon from '../../../components/AppIcon';
        import Button from '../../../components/ui/Button';
        import Input from '../../../components/ui/Input';
        import { Checkbox } from '../../../components/ui/Checkbox';

        const OperatingHoursTab = ({ operatingHours, onOperatingHoursChange, isPreviewMode }) => {
          const [activeSection, setActiveSection] = useState('weekly');
          const [showAddHolidayModal, setShowAddHolidayModal] = useState(false);
          const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
          const [holidayForm, setHolidayForm] = useState({
            name: '',
            date: '',
            type: 'closed', // closed, modified
            modifiedHours: { open: '', close: '' }
          });
          const [maintenanceForm, setMaintenanceForm] = useState({
            title: '',
            court: '',
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            recurring: false,
            reason: ''
          });

          const daysOfWeek = [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
          ];

          const defaultWeeklySchedule = {
            Monday: { open: '06:00', close: '22:00', closed: false },
            Tuesday: { open: '06:00', close: '22:00', closed: false },
            Wednesday: { open: '06:00', close: '22:00', closed: false },
            Thursday: { open: '06:00', close: '22:00', closed: false },
            Friday: { open: '06:00', close: '22:00', closed: false },
            Saturday: { open: '08:00', close: '20:00', closed: false },
            Sunday: { open: '08:00', close: '20:00', closed: false }
          };

          const weeklySchedule = operatingHours?.weeklySchedule || defaultWeeklySchedule;

          const handleScheduleChange = (day, field, value) => {
            const updatedSchedule = {
              ...weeklySchedule,
              [day]: {
                ...weeklySchedule?.[day],
                [field]: value
              }
            };
            
            onOperatingHoursChange?.({
              ...operatingHours,
              weeklySchedule: updatedSchedule
            });
          };

          const handleCopyToAll = (day) => {
            const daySchedule = weeklySchedule?.[day];
            const updatedSchedule = {};
            
            daysOfWeek?.forEach(d => {
              updatedSchedule[d] = { ...daySchedule };
            });
            
            onOperatingHoursChange?.({
              ...operatingHours,
              weeklySchedule: updatedSchedule
            });
          };

          const handleAddHoliday = () => {
            const holidayData = {
              ...holidayForm,
              id: Date.now()?.toString()
            };

            const updatedHolidays = [...(operatingHours?.holidays || []), holidayData];
            onOperatingHoursChange?.({
              ...operatingHours,
              holidays: updatedHolidays
            });
            
            setShowAddHolidayModal(false);
            setHolidayForm({
              name: '',
              date: '',
              type: 'closed',
              modifiedHours: { open: '', close: '' }
            });
          };

          const handleDeleteHoliday = (holidayId) => {
            const updatedHolidays = operatingHours?.holidays?.filter(h => h?.id !== holidayId);
            onOperatingHoursChange?.({
              ...operatingHours,
              holidays: updatedHolidays
            });
          };

          const handleAddMaintenance = () => {
            const maintenanceData = {
              ...maintenanceForm,
              id: Date.now()?.toString()
            };

            const updatedMaintenance = [...(operatingHours?.maintenanceBlocks || []), maintenanceData];
            onOperatingHoursChange?.({
              ...operatingHours,
              maintenanceBlocks: updatedMaintenance
            });
            
            setShowMaintenanceModal(false);
            setMaintenanceForm({
              title: '',
              court: '',
              startDate: '',
              endDate: '',
              startTime: '',
              endTime: '',
              recurring: false,
              reason: ''
            });
          };

          const handleDeleteMaintenance = (maintenanceId) => {
            const updatedMaintenance = operatingHours?.maintenanceBlocks?.filter(m => m?.id !== maintenanceId);
            onOperatingHoursChange?.({
              ...operatingHours,
              maintenanceBlocks: updatedMaintenance
            });
          };

          const formatTime = (time) => {
            if (!time) return '';
            const [hours, minutes] = time?.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${minutes} ${ampm}`;
          };

          if (isPreviewMode) {
            return (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Operating Hours</h3>
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="space-y-4">
                    {daysOfWeek?.map((day) => {
                      const daySchedule = weeklySchedule?.[day];
                      return (
                        <div key={day} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                          <span className="font-medium text-foreground">{day}</span>
                          <span className="text-muted-foreground">
                            {daySchedule?.closed 
                              ? 'Closed' 
                              : `${formatTime(daySchedule?.open)} - ${formatTime(daySchedule?.close)}`
                            }
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Operating Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure weekly schedules, holidays, and maintenance blocks
                  </p>
                </div>
              </div>

              {/* Section Tabs */}
              <div className="flex items-center space-x-4 border-b border-border">
                {[
                  { id: 'weekly', label: 'Weekly Schedule', icon: 'Calendar' },
                  { id: 'holidays', label: 'Holidays', icon: 'CalendarDays' },
                  { id: 'maintenance', label: 'Maintenance', icon: 'Wrench' }
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

              {/* Weekly Schedule */}
              {activeSection === 'weekly' && (
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="space-y-6">
                      {daysOfWeek?.map((day) => {
                        const daySchedule = weeklySchedule?.[day];
                        
                        return (
                          <div key={day} className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <h4 className="text-base font-medium text-foreground w-24">{day}</h4>
                                
                                <Checkbox
                                  id={`closed-${day}`}
                                  label="Closed"
                                  checked={daySchedule?.closed}
                                  onChange={(e) => handleScheduleChange(day, 'closed', e?.target?.checked)}
                                />
                              </div>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                iconName="Copy"
                                onClick={() => handleCopyToAll(day)}
                              >
                                Copy to All Days
                              </Button>
                            </div>

                            {!daySchedule?.closed && (
                              <div className="flex items-center space-x-4 ml-28">
                                <Input
                                  type="time"
                                  value={daySchedule?.open}
                                  onChange={(e) => handleScheduleChange(day, 'open', e?.target?.value)}
                                  className="w-32"
                                />
                                <span className="text-muted-foreground">to</span>
                                <Input
                                  type="time"
                                  value={daySchedule?.close}
                                  onChange={(e) => handleScheduleChange(day, 'close', e?.target?.value)}
                                  className="w-32"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      iconName="RotateCcw"
                      onClick={() => {
                        onOperatingHoursChange?.({
                          ...operatingHours,
                          weeklySchedule: defaultWeeklySchedule
                        });
                      }}
                    >
                      Reset to Default
                    </Button>
                    
                    <Button
                      variant="outline"
                      iconName="Copy"
                      onClick={() => {
                        const businessHours = {
                          Monday: { open: '09:00', close: '17:00', closed: false },
                          Tuesday: { open: '09:00', close: '17:00', closed: false },
                          Wednesday: { open: '09:00', close: '17:00', closed: false },
                          Thursday: { open: '09:00', close: '17:00', closed: false },
                          Friday: { open: '09:00', close: '17:00', closed: false },
                          Saturday: { open: '10:00', close: '16:00', closed: false },
                          Sunday: { open: '10:00', close: '16:00', closed: true }
                        };
                        
                        onOperatingHoursChange?.({
                          ...operatingHours,
                          weeklySchedule: businessHours
                        });
                      }}
                    >
                      Apply Business Hours
                    </Button>
                  </div>
                </div>
              )}

              {/* Holidays */}
              {activeSection === 'holidays' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">Holiday Exceptions</h4>
                    <Button
                      variant="default"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={() => setShowAddHolidayModal(true)}
                    >
                      Add Holiday
                    </Button>
                  </div>

                  {operatingHours?.holidays?.length > 0 ? (
                    <div className="space-y-4">
                      {operatingHours?.holidays?.map((holiday) => (
                        <div key={holiday?.id} className="bg-card border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-foreground">{holiday?.name}</h5>
                              <p className="text-sm text-muted-foreground">
                                {new Date(holiday?.date)?.toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {holiday?.type === 'closed' ?'Facility Closed' 
                                  : `Modified Hours: ${formatTime(holiday?.modifiedHours?.open)} - ${formatTime(holiday?.modifiedHours?.close)}`
                                }
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              iconName="Trash2"
                              onClick={() => handleDeleteHoliday(holiday?.id)}
                              className="text-destructive hover:text-destructive"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Icon name="CalendarDays" size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No holidays configured</p>
                    </div>
                  )}
                </div>
              )}

              {/* Maintenance */}
              {activeSection === 'maintenance' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">Maintenance Blocks</h4>
                    <Button
                      variant="default"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={() => setShowMaintenanceModal(true)}
                    >
                      Schedule Maintenance
                    </Button>
                  </div>

                  {operatingHours?.maintenanceBlocks?.length > 0 ? (
                    <div className="space-y-4">
                      {operatingHours?.maintenanceBlocks?.map((maintenance) => (
                        <div key={maintenance?.id} className="bg-card border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-foreground">{maintenance?.title}</h5>
                              <p className="text-sm text-muted-foreground mb-1">
                                {new Date(maintenance?.startDate)?.toLocaleDateString()} - {new Date(maintenance?.endDate)?.toLocaleDateString()}
                              </p>
                              <p className="text-sm text-muted-foreground mb-1">
                                {formatTime(maintenance?.startTime)} - {formatTime(maintenance?.endTime)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Court: {maintenance?.court || 'All courts'}
                              </p>
                              {maintenance?.reason && (
                                <p className="text-sm text-muted-foreground">
                                  Reason: {maintenance?.reason}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              iconName="Trash2"
                              onClick={() => handleDeleteMaintenance(maintenance?.id)}
                              className="text-destructive hover:text-destructive"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Icon name="Wrench" size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No maintenance blocks scheduled</p>
                    </div>
                  )}
                </div>
              )}

              {/* Add Holiday Modal */}
              {showAddHolidayModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-card border border-border rounded-lg w-full max-w-lg">
                    <div className="p-6 border-b border-border">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">Add Holiday</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          iconName="X"
                          onClick={() => setShowAddHolidayModal(false)}
                        />
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <Input
                        label="Holiday Name"
                        required
                        value={holidayForm?.name}
                        onChange={(e) => setHolidayForm({ ...holidayForm, name: e?.target?.value })}
                        placeholder="Christmas Day, New Year, etc."
                      />

                      <Input
                        label="Date"
                        type="date"
                        required
                        value={holidayForm?.date}
                        onChange={(e) => setHolidayForm({ ...holidayForm, date: e?.target?.value })}
                      />

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Holiday Type
                        </label>
                        <select
                          value={holidayForm?.type}
                          onChange={(e) => setHolidayForm({ ...holidayForm, type: e?.target?.value })}
                          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                        >
                          <option value="closed">Facility Closed</option>
                          <option value="modified">Modified Hours</option>
                        </select>
                      </div>

                      {holidayForm?.type === 'modified' && (
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Open Time"
                            type="time"
                            value={holidayForm?.modifiedHours?.open}
                            onChange={(e) => setHolidayForm({
                              ...holidayForm,
                              modifiedHours: { ...holidayForm?.modifiedHours, open: e?.target?.value }
                            })}
                          />
                          <Input
                            label="Close Time"
                            type="time"
                            value={holidayForm?.modifiedHours?.close}
                            onChange={(e) => setHolidayForm({
                              ...holidayForm,
                              modifiedHours: { ...holidayForm?.modifiedHours, close: e?.target?.value }
                            })}
                          />
                        </div>
                      )}
                    </div>

                    <div className="p-6 border-t border-border flex items-center justify-end space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowAddHolidayModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        onClick={handleAddHoliday}
                        disabled={!holidayForm?.name || !holidayForm?.date}
                      >
                        Add Holiday
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Schedule Maintenance Modal */}
              {showMaintenanceModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-card border border-border rounded-lg w-full max-w-lg">
                    <div className="p-6 border-b border-border">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">Schedule Maintenance</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          iconName="X"
                          onClick={() => setShowMaintenanceModal(false)}
                        />
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <Input
                        label="Maintenance Title"
                        required
                        value={maintenanceForm?.title}
                        onChange={(e) => setMaintenanceForm({ ...maintenanceForm, title: e?.target?.value })}
                        placeholder="Floor cleaning, Equipment repair, etc."
                      />

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Court (Optional)
                        </label>
                        <select
                          value={maintenanceForm?.court}
                          onChange={(e) => setMaintenanceForm({ ...maintenanceForm, court: e?.target?.value })}
                          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                        >
                          <option value="">All courts</option>
                          {/* Will need courts list here */}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Start Date"
                          type="date"
                          required
                          value={maintenanceForm?.startDate}
                          onChange={(e) => setMaintenanceForm({ ...maintenanceForm, startDate: e?.target?.value })}
                        />
                        <Input
                          label="End Date"
                          type="date"
                          required
                          value={maintenanceForm?.endDate}
                          onChange={(e) => setMaintenanceForm({ ...maintenanceForm, endDate: e?.target?.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Start Time"
                          type="time"
                          value={maintenanceForm?.startTime}
                          onChange={(e) => setMaintenanceForm({ ...maintenanceForm, startTime: e?.target?.value })}
                        />
                        <Input
                          label="End Time"
                          type="time"
                          value={maintenanceForm?.endTime}
                          onChange={(e) => setMaintenanceForm({ ...maintenanceForm, endTime: e?.target?.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Reason (Optional)
                        </label>
                        <textarea
                          className="w-full h-20 px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground resize-none"
                          value={maintenanceForm?.reason}
                          onChange={(e) => setMaintenanceForm({ ...maintenanceForm, reason: e?.target?.value })}
                          placeholder="Description of maintenance work..."
                        />
                      </div>
                    </div>

                    <div className="p-6 border-t border-border flex items-center justify-end space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowMaintenanceModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        onClick={handleAddMaintenance}
                        disabled={!maintenanceForm?.title || !maintenanceForm?.startDate || !maintenanceForm?.endDate}
                      >
                        Schedule Maintenance
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        };

        export default OperatingHoursTab;