import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import { useNavigation } from './RoleBasedNavigation';

const DashboardQuickActions = ({ className = '' }) => {
  const { userRole, hasPermission } = useNavigation();
  const [isExpanded, setIsExpanded] = useState(false);

  const getQuickActions = () => {
    switch (userRole) {
      case 'facility-owner':
        return {
          primary: [
            {
              label: 'Add Facility',
              icon: 'Plus',
              action: () => window.location.href = '/facility-management?action=add',
              variant: 'default'
            },
            {
              label: 'View Bookings',
              icon: 'Calendar',
              action: () => window.location.href = '/my-bookings',
              variant: 'outline'
            },
            {
              label: 'Analytics',
              icon: 'BarChart3',
              action: () => window.location.href = '/facility-owner-dashboard?tab=analytics',
              variant: 'outline'
            }
          ],
          secondary: [
            {
              label: 'Manage Pricing',
              icon: 'DollarSign',
              action: () => window.location.href = '/facility-management?tab=pricing'
            },
            {
              label: 'Update Availability',
              icon: 'Clock',
              action: () => window.location.href = '/facility-management?tab=availability'
            },
            {
              label: 'View Reviews',
              icon: 'Star',
              action: () => window.location.href = '/facility-management?tab=reviews'
            },
            {
              label: 'Export Data',
              icon: 'Download',
              action: () => console.log('Export data')
            }
          ]
        };

      case 'administrator':
        return {
          primary: [
            {
              label: 'User Management',
              icon: 'Users',
              action: () => window.location.href = '/user-management',
              variant: 'default'
            },
            {
              label: 'System Reports',
              icon: 'FileText',
              action: () => window.location.href = '/admin-dashboard?tab=reports',
              variant: 'outline'
            },
            {
              label: 'Platform Settings',
              icon: 'Settings',
              action: () => window.location.href = '/admin-dashboard?tab=settings',
              variant: 'outline'
            }
          ],
          secondary: [
            {
              label: 'Moderate Content',
              icon: 'Shield',
              action: () => window.location.href = '/admin-dashboard?tab=moderation'
            },
            {
              label: 'System Logs',
              icon: 'Terminal',
              action: () => window.location.href = '/admin-dashboard?tab=logs'
            },
            {
              label: 'Backup Data',
              icon: 'Database',
              action: () => console.log('Backup data')
            },
            {
              label: 'Send Notifications',
              icon: 'Bell',
              action: () => window.location.href = '/admin-dashboard?tab=notifications'
            }
          ]
        };

      default: // sports-enthusiast
        return {
          primary: [
            {
              label: 'Book Now',
              icon: 'Calendar',
              action: () => window.location.href = '/venues-listing',
              variant: 'default'
            },
            {
              label: 'Find Venues',
              icon: 'MapPin',
              action: () => window.location.href = '/venues-listing',
              variant: 'outline'
            },
            {
              label: 'My Bookings',
              icon: 'Clock',
              action: () => window.location.href = '/my-bookings',
              variant: 'outline'
            }
          ],
          secondary: [
            {
              label: 'Favorites',
              icon: 'Heart',
              action: () => window.location.href = '/user-profile?tab=favorites'
            },
            {
              label: 'Payment Methods',
              icon: 'CreditCard',
              action: () => window.location.href = '/user-profile?tab=payments'
            },
            {
              label: 'Booking History',
              icon: 'History',
              action: () => window.location.href = '/my-bookings?filter=history'
            },
            {
              label: 'Invite Friends',
              icon: 'UserPlus',
              action: () => console.log('Invite friends')
            }
          ]
        };
    }
  };

  const actions = getQuickActions();

  const handleActionClick = (actionFn) => {
    if (typeof actionFn === 'function') {
      actionFn();
    }
    setIsExpanded(false);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Primary Actions - Always Visible */}
      <div className="hidden md:flex items-center space-x-2">
        {actions?.primary?.map((action, index) => (
          <Button
            key={index}
            variant={action?.variant || 'outline'}
            size="sm"
            iconName={action?.icon}
            iconPosition="left"
            onClick={() => handleActionClick(action?.action)}
            className="transition-micro"
          >
            {action?.label}
          </Button>
        ))}
      </div>
      {/* Mobile Primary Action */}
      <div className="md:hidden">
        <Button
          variant="default"
          size="sm"
          iconName={actions?.primary?.[0]?.icon}
          iconPosition="left"
          onClick={() => handleActionClick(actions?.primary?.[0]?.action)}
        >
          {actions?.primary?.[0]?.label}
        </Button>
      </div>
      {/* More Actions Dropdown */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          iconName="MoreHorizontal"
          onClick={() => setIsExpanded(!isExpanded)}
          className="transition-micro"
        >
          <span className="sr-only">More actions</span>
        </Button>

        {isExpanded && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-modal py-1 z-50 animate-fade-in">
            {/* Mobile: Show remaining primary actions */}
            <div className="md:hidden">
              {actions?.primary?.slice(1)?.map((action, index) => (
                <button
                  key={`mobile-${index}`}
                  onClick={() => handleActionClick(action?.action)}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-micro"
                >
                  <Icon name={action?.icon} size={16} />
                  <span>{action?.label}</span>
                </button>
              ))}
              {actions?.primary?.length > 1 && <hr className="my-1 border-border" />}
            </div>

            {/* Secondary Actions */}
            {actions?.secondary?.map((action, index) => (
              <button
                key={index}
                onClick={() => handleActionClick(action?.action)}
                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-micro"
              >
                <Icon name={action?.icon} size={16} />
                <span>{action?.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Click outside to close */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default DashboardQuickActions;