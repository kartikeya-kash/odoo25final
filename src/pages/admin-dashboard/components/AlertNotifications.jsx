import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertNotifications = () => {
  const [alerts, setAlerts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate real-time alerts
    const mockAlerts = [
      {
        id: 1,
        type: 'critical',
        title: 'High Server Load',
        message: 'Booking service experiencing 85% load. Consider scaling resources.',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        actionRequired: true,
        autoResolve: false
      },
      {
        id: 2,
        type: 'warning',
        title: 'Payment Gateway Timeout',
        message: 'Increased timeout rates detected on payment processing.',
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        actionRequired: false,
        autoResolve: true
      },
      {
        id: 3,
        type: 'info',
        title: 'Scheduled Maintenance',
        message: 'Database maintenance scheduled for tonight at 2:00 AM.',
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        actionRequired: false,
        autoResolve: false
      }
    ];

    setAlerts(mockAlerts);

    // Check for critical alerts
    const hasCritical = mockAlerts?.some(alert => alert?.type === 'critical');
    if (hasCritical) {
      setIsVisible(true);
    }

    // Simulate new alerts
    const interval = setInterval(() => {
      if (Math.random() > 0.9) { // 10% chance of new alert
        const newAlert = {
          id: Date.now(),
          type: Math.random() > 0.7 ? 'warning' : 'info',
          title: 'System Update',
          message: 'New system update available for deployment.',
          timestamp: new Date(),
          actionRequired: false,
          autoResolve: false
        };
        setAlerts(prev => [newAlert, ...prev?.slice(0, 4)]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return 'AlertCircle';
      case 'warning': return 'AlertTriangle';
      case 'info': return 'Info';
      default: return 'Bell';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'bg-destructive/10 border-destructive/20 text-destructive';
      case 'warning': return 'bg-warning/10 border-warning/20 text-warning';
      case 'info': return 'bg-primary/10 border-primary/20 text-primary';
      default: return 'bg-muted border-border text-muted-foreground';
    }
  };

  const handleDismissAlert = (id) => {
    setAlerts(prev => prev?.filter(alert => alert?.id !== id));
  };

  const handleResolveAlert = (id) => {
    console.log('Resolving alert:', id);
    handleDismissAlert(id);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const criticalAlerts = alerts?.filter(alert => alert?.type === 'critical');

  if (!isVisible && criticalAlerts?.length === 0) {
    return null;
  }

  return (
    <>
      {/* Critical Alert Banner */}
      {criticalAlerts?.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="AlertCircle" size={20} className="text-destructive" />
              <div>
                <h4 className="font-medium text-destructive">Critical System Alert</h4>
                <p className="text-sm text-destructive/80">
                  {criticalAlerts?.length} critical issue{criticalAlerts?.length > 1 ? 's' : ''} requiring immediate attention
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              iconName="ExternalLink"
              onClick={() => setIsVisible(true)}
            >
              View Details
            </Button>
          </div>
        </div>
      )}
      {/* Alert Notifications Panel */}
      {isVisible && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-modal max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="Bell" size={20} className="text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">System Alerts</h3>
                  {alerts?.length > 0 && (
                    <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                      {alerts?.length}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={() => setIsVisible(false)}
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {alerts?.length === 0 ? (
                <div className="p-8 text-center">
                  <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
                  <h4 className="font-medium text-foreground mb-2">All Clear!</h4>
                  <p className="text-muted-foreground">No active system alerts at this time.</p>
                </div>
              ) : (
                alerts?.map((alert) => (
                  <div key={alert?.id} className={`p-4 border-b border-border last:border-b-0 ${getAlertColor(alert?.type)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <Icon name={getAlertIcon(alert?.type)} size={20} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">{alert?.title}</h4>
                            <span className="text-xs opacity-75">
                              {formatTimeAgo(alert?.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm opacity-90 mb-2">{alert?.message}</p>
                          
                          <div className="flex items-center space-x-2">
                            {alert?.actionRequired && (
                              <Button
                                variant="outline"
                                size="sm"
                                iconName="Tool"
                                onClick={() => handleResolveAlert(alert?.id)}
                              >
                                Resolve
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              iconName="X"
                              onClick={() => handleDismissAlert(alert?.id)}
                            >
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RefreshCw"
                  onClick={() => window.location?.reload()}
                >
                  Refresh Alerts
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertNotifications;