import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);

  const quickActions = [
    {
      title: 'Add New Court',
      description: 'Create a new court or facility',
      icon: 'Plus',
      color: 'bg-primary',
      action: () => window.location.href = '/facility-management?action=add-court'
    },
    {
      title: 'Block Maintenance',
      description: 'Schedule maintenance time',
      icon: 'Wrench',
      color: 'bg-warning',
      action: () => setIsMaintenanceModalOpen(true)
    },
    {
      title: 'Update Availability',
      description: 'Modify court schedules',
      icon: 'Calendar',
      color: 'bg-success',
      action: () => window.location.href = '/facility-management?tab=availability'
    },
    {
      title: 'View Analytics',
      description: 'Detailed performance reports',
      icon: 'BarChart3',
      color: 'bg-accent',
      action: () => window.location.href = '/facility-owner-dashboard?tab=analytics'
    }
  ];

  const handleMaintenanceBlock = () => {
    console.log('Blocking maintenance time');
    setIsMaintenanceModalOpen(false);
    // Handle maintenance blocking logic
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
          <Button
            variant="outline"
            size="sm"
            iconName="Settings"
            onClick={() => window.location.href = '/facility-management'}
          >
            Manage All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions?.map((action, index) => (
            <button
              key={index}
              onClick={action?.action}
              className="flex items-center space-x-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-micro text-left group"
            >
              <div className={`p-3 rounded-lg ${action?.color} group-hover:scale-105 transition-transform`}>
                <Icon name={action?.icon} size={20} color="white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground group-hover:text-primary transition-micro">
                  {action?.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {action?.description}
                </p>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-primary transition-micro" />
            </button>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="font-medium text-foreground mb-4">Recent Activity</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-muted-foreground">
                Basketball Court A booking confirmed - $50
              </span>
              <span className="text-xs text-muted-foreground ml-auto">2 min ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-muted-foreground">
                New booking request for Tennis Court 1
              </span>
              <span className="text-xs text-muted-foreground ml-auto">5 min ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">
                Payment received from John Smith - $60
              </span>
              <span className="text-xs text-muted-foreground ml-auto">12 min ago</span>
            </div>
          </div>
        </div>
      </div>
      {/* Maintenance Modal */}
      {isMaintenanceModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Block Maintenance Time</h3>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setIsMaintenanceModalOpen(false)}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Court
                </label>
                <select className="w-full p-2 border border-border rounded-lg bg-input text-foreground">
                  <option>Basketball Court A</option>
                  <option>Tennis Court 1</option>
                  <option>Football Field</option>
                  <option>Badminton Court 1</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Start Time
                  </label>
                  <input 
                    type="time" 
                    className="w-full p-2 border border-border rounded-lg bg-input text-foreground"
                    defaultValue="09:00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    End Time
                  </label>
                  <input 
                    type="time" 
                    className="w-full p-2 border border-border rounded-lg bg-input text-foreground"
                    defaultValue="17:00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reason
                </label>
                <textarea 
                  className="w-full p-2 border border-border rounded-lg bg-input text-foreground"
                  rows="3"
                  placeholder="Describe the maintenance work..."
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsMaintenanceModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleMaintenanceBlock}
              >
                Block Time
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActions;