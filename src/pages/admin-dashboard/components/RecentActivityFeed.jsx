import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentActivityFeed = () => {
  const [filter, setFilter] = useState('all');

  const activities = [
    {
      id: 1,
      type: 'user_registration',
      title: 'New User Registration',
      description: 'Alex Thompson joined the platform',
      timestamp: '2025-08-11T07:45:00Z',
      priority: 'low',
      actionRequired: false,
      metadata: {
        userId: 'user_123',
        userEmail: 'alex.thompson@email.com'
      }
    },
    {
      id: 2,
      type: 'facility_application',
      title: 'Facility Application Submitted',
      description: 'Elite Sports Complex submitted for approval',
      timestamp: '2025-08-11T07:30:00Z',
      priority: 'high',
      actionRequired: true,
      metadata: {
        facilityId: 'facility_456',
        ownerName: 'John Martinez'
      }
    },
    {
      id: 3,
      type: 'reported_issue',
      title: 'Content Reported',
      description: 'User reported inappropriate review content',
      timestamp: '2025-08-11T07:15:00Z',
      priority: 'medium',
      actionRequired: true,
      metadata: {
        reportId: 'report_789',
        contentType: 'review'
      }
    },
    {
      id: 4,
      type: 'system_alert',
      title: 'System Performance Alert',
      description: 'High server load detected on booking service',
      timestamp: '2025-08-11T07:00:00Z',
      priority: 'high',
      actionRequired: true,
      metadata: {
        service: 'booking',
        loadPercentage: 85
      }
    },
    {
      id: 5,
      type: 'user_registration',
      title: 'New User Registration',
      description: 'Maria Garcia joined the platform',
      timestamp: '2025-08-11T06:45:00Z',
      priority: 'low',
      actionRequired: false,
      metadata: {
        userId: 'user_124',
        userEmail: 'maria.garcia@email.com'
      }
    },
    {
      id: 6,
      type: 'facility_application',
      title: 'Facility Application Approved',
      description: 'Community Recreation Center has been approved',
      timestamp: '2025-08-11T06:30:00Z',
      priority: 'low',
      actionRequired: false,
      metadata: {
        facilityId: 'facility_457',
        approvedBy: 'admin_001'
      }
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registration': return 'UserPlus';
      case 'facility_application': return 'Building2';
      case 'reported_issue': return 'AlertTriangle';
      case 'system_alert': return 'AlertCircle';
      default: return 'Activity';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-destructive bg-destructive/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleActivityAction = (activity) => {
    switch (activity?.type) {
      case 'facility_application':
        window.location.href = `/facility-management?preview=${activity?.metadata?.facilityId}`;
        break;
      case 'reported_issue':
        window.location.href = `/admin-dashboard?tab=moderation&report=${activity?.metadata?.reportId}`;
        break;
      case 'system_alert': console.log('Viewing system alert:', activity?.id);
        break;
      case 'user_registration':
        window.location.href = `/user-management?user=${activity?.metadata?.userId}`;
        break;
      default:
        console.log('Activity action:', activity?.id);
    }
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities?.filter(activity => 
        filter === 'action_required' ? activity?.actionRequired : activity?.type === filter
      );

  const filterOptions = [
    { value: 'all', label: 'All Activities', count: activities?.length },
    { value: 'action_required', label: 'Action Required', count: activities?.filter(a => a?.actionRequired)?.length },
    { value: 'user_registration', label: 'User Registrations', count: activities?.filter(a => a?.type === 'user_registration')?.length },
    { value: 'facility_application', label: 'Facility Applications', count: activities?.filter(a => a?.type === 'facility_application')?.length },
    { value: 'reported_issue', label: 'Reported Issues', count: activities?.filter(a => a?.type === 'reported_issue')?.length },
    { value: 'system_alert', label: 'System Alerts', count: activities?.filter(a => a?.type === 'system_alert')?.length }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">Platform activity and alerts</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            onClick={() => window.location?.reload()}
          >
            Refresh
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setFilter(option?.value)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-micro ${
                filter === option?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {option?.label} ({option?.count})
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {filteredActivities?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No activities found for the selected filter</p>
          </div>
        ) : (
          filteredActivities?.map((activity) => (
            <div key={activity?.id} className="p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-micro">
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getPriorityColor(activity?.priority)}`}>
                  <Icon name={getActivityIcon(activity?.type)} size={16} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-foreground text-sm">{activity?.title}</h4>
                    <div className="flex items-center space-x-2">
                      {activity?.actionRequired && (
                        <span className="w-2 h-2 bg-destructive rounded-full"></span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {getTimeAgo(activity?.timestamp)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{activity?.description}</p>

                  {activity?.actionRequired && (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="ArrowRight"
                      onClick={() => handleActivityAction(activity)}
                    >
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          fullWidth
          iconName="ExternalLink"
          onClick={() => window.location.href = '/admin-dashboard?tab=activity'}
        >
          View All Activity
        </Button>
      </div>
    </div>
  );
};

export default RecentActivityFeed;