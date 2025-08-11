import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickAccessPanel = () => {
  const quickActions = [
    {
      title: 'User Search',
      description: 'Find and manage platform users',
      icon: 'Search',
      action: () => window.location.href = '/user-management',
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      title: 'Facility Management',
      description: 'Review and approve facilities',
      icon: 'Building2',
      action: () => window.location.href = '/facility-management',
      color: 'bg-green-50 text-green-600 border-green-200'
    },
    {
      title: 'Generate Reports',
      description: 'Create comprehensive reports',
      icon: 'FileText',
      action: () => console.log('Generate reports'),
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: 'Settings',
      action: () => console.log('System settings'),
      color: 'bg-orange-50 text-orange-600 border-orange-200'
    },
    {
      title: 'Content Moderation',
      description: 'Review reported content',
      icon: 'Shield',
      action: () => console.log('Content moderation'),
      color: 'bg-red-50 text-red-600 border-red-200'
    },
    {
      title: 'Analytics Export',
      description: 'Export platform analytics',
      icon: 'Download',
      action: () => console.log('Export analytics'),
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    }
  ];

  const systemTools = [
    {
      title: 'Database Backup',
      description: 'Create system backup',
      icon: 'Database',
      status: 'Last backup: 2 hours ago',
      action: () => console.log('Database backup')
    },
    {
      title: 'Performance Monitor',
      description: 'View system performance',
      icon: 'Activity',
      status: 'All systems operational',
      action: () => console.log('Performance monitor')
    },
    {
      title: 'Email Notifications',
      description: 'Send platform notifications',
      icon: 'Mail',
      status: '12 pending notifications',
      action: () => console.log('Email notifications')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions?.map((action, index) => (
            <button
              key={index}
              onClick={action?.action}
              className={`p-4 rounded-lg border-2 border-dashed transition-all hover:border-solid hover:shadow-card text-left ${action?.color}`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Icon name={action?.icon} size={20} />
                <h4 className="font-medium">{action?.title}</h4>
              </div>
              <p className="text-sm opacity-80">{action?.description}</p>
            </button>
          ))}
        </div>
      </div>
      {/* System Tools */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">System Tools</h3>
        <div className="space-y-3">
          {systemTools?.map((tool, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-micro">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={tool?.icon} size={18} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{tool?.title}</h4>
                  <p className="text-sm text-muted-foreground">{tool?.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tool?.status}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="ArrowRight"
                onClick={tool?.action}
              >
                Access
              </Button>
            </div>
          ))}
        </div>
      </div>
      {/* Emergency Actions */}
      <div className="bg-card border border-destructive/20 rounded-lg p-6 shadow-card">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="AlertTriangle" size={20} className="text-destructive" />
          <h3 className="text-lg font-semibold text-foreground">Emergency Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="destructive"
            iconName="AlertCircle"
            onClick={() => console.log('System maintenance mode')}
          >
            Enable Maintenance Mode
          </Button>
          <Button
            variant="outline"
            iconName="RefreshCw"
            onClick={() => console.log('Clear system cache')}
          >
            Clear System Cache
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickAccessPanel;