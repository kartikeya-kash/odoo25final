import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';




const ModerationPanel = ({ onModerationAction }) => {
  const [activeTab, setActiveTab] = useState('flagged');
  const [selectedItems, setSelectedItems] = useState([]);

  const flaggedContent = [
    {
      id: 1,
      type: 'review',
      content: `This place is terrible! The staff was rude and the facilities were dirty. I wouldn't recommend this to anyone. Complete waste of money and time.`,reporter: 'Sarah Johnson',reportedUser: 'Mike Chen',venue: 'Downtown Sports Complex',reason: 'Inappropriate language',timestamp: '2025-08-11T06:30:00Z',status: 'pending'
    },
    {
      id: 2,
      type: 'message',content: `Hey, want to meet up after the game? I know a great place nearby where we can grab some drinks and continue our conversation.`,reporter: 'Alex Rodriguez',reportedUser: 'Jordan Smith',venue: null,reason: 'Harassment',timestamp: '2025-08-11T05:45:00Z',status: 'pending'
    },
    {
      id: 3,
      type: 'profile',content: 'Profile contains inappropriate images and offensive bio content',reporter: 'System Auto-Detection',reportedUser: 'Chris Wilson',venue: null,reason: 'Inappropriate content',timestamp: '2025-08-11T04:20:00Z',status: 'pending'
    }
  ];

  const userComplaints = [
    {
      id: 1,
      complainant: 'Emma Davis',
      against: 'Tom Anderson',
      subject: 'No-show for booked court',
      description: `User booked a tennis court for 2 hours but never showed up. This caused inconvenience as I had to wait and couldn't book another slot. This is the third time this has happened with this user.`,venue: 'City Tennis Club',bookingId: 'BK-2025-001234',timestamp: '2025-08-11T07:15:00Z',status: 'open',priority: 'medium'
    },
    {
      id: 2,
      complainant: 'David Park',against: 'Lisa Thompson',subject: 'Facility damage',
      description: `The user left the basketball court in poor condition with trash scattered around and equipment not returned to proper places. This shows lack of respect for shared facilities.`,
      venue: 'Metro Basketball Courts',bookingId: 'BK-2025-001189',timestamp: '2025-08-11T06:45:00Z',status: 'investigating',priority: 'high'
    }
  ];

  const banAppeals = [
    {
      id: 1,
      user: 'Robert Kim',
      originalReason: 'Multiple no-shows',
      appealReason: `I was dealing with a family emergency during that period and couldn't cancel my bookings in time. I understand this caused inconvenience and I'm willing to pay any cancellation fees. I've been a loyal user for 2 years and this won't happen again.`,
      banDate: '2025-08-05',
      appealDate: '2025-08-10',
      status: 'pending',
      supportingDocs: ['medical_certificate.pdf', 'family_emergency_proof.pdf']
    },
    {
      id: 2,
      user: 'Maria Garcia',
      originalReason: 'Inappropriate behavior',
      appealReason: `The complaint was based on a misunderstanding. I was trying to help organize a group game and my messages were misinterpreted. I have character references from other users who can vouch for my behavior.`,
      banDate: '2025-08-07',
      appealDate: '2025-08-11',
      status: 'pending',
      supportingDocs: ['character_references.pdf']
    }
  ];

  const tabs = [
    { id: 'flagged', label: 'Flagged Content', icon: 'Flag', count: flaggedContent?.length },
    { id: 'complaints', label: 'User Complaints', icon: 'AlertTriangle', count: userComplaints?.length },
    { id: 'appeals', label: 'Ban Appeals', icon: 'Scale', count: banAppeals?.length }
  ];

  const handleItemSelect = (itemId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems?.filter(id => id !== itemId));
    }
  };

  const handleBulkAction = (action) => {
    onModerationAction(action, selectedItems);
    setSelectedItems([]);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'text-warning bg-warning/10', label: 'Pending' },
      investigating: { color: 'text-primary bg-primary/10', label: 'Investigating' },
      resolved: { color: 'text-success bg-success/10', label: 'Resolved' },
      dismissed: { color: 'text-muted-foreground bg-muted', label: 'Dismissed' },
      open: { color: 'text-destructive bg-destructive/10', label: 'Open' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { color: 'text-destructive bg-destructive/10', label: 'High' },
      medium: { color: 'text-warning bg-warning/10', label: 'Medium' },
      low: { color: 'text-success bg-success/10', label: 'Low' }
    };

    const config = priorityConfig?.[priority] || priorityConfig?.medium;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderFlaggedContent = () => (
    <div className="space-y-4">
      {flaggedContent?.map((item) => (
        <div key={item?.id} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedItems?.includes(item?.id)}
                onChange={(e) => handleItemSelect(item?.id, e?.target?.checked)}
                className="rounded border-border"
              />
              <div className="flex items-center space-x-2">
                <Icon name={item?.type === 'review' ? 'Star' : item?.type === 'message' ? 'MessageSquare' : 'User'} size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground capitalize">{item?.type}</span>
              </div>
              {getStatusBadge(item?.status)}
            </div>
            <span className="text-xs text-muted-foreground">{formatTimestamp(item?.timestamp)}</span>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 mb-4">
            <p className="text-sm text-foreground">{item?.content}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Reported by</p>
              <p className="text-sm font-medium text-foreground">{item?.reporter}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Reported user</p>
              <p className="text-sm font-medium text-foreground">{item?.reportedUser}</p>
            </div>
            {item?.venue && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Venue</p>
                <p className="text-sm font-medium text-foreground">{item?.venue}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Reason</p>
              <p className="text-sm font-medium text-foreground">{item?.reason}</p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Eye"
              iconPosition="left"
              onClick={() => onModerationAction('view', item)}
            >
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="MessageSquare"
              iconPosition="left"
              onClick={() => onModerationAction('contact', item)}
            >
              Contact User
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Check"
              iconPosition="left"
              onClick={() => onModerationAction('approve', item)}
            >
              Dismiss
            </Button>
            <Button
              variant="destructive"
              size="sm"
              iconName="X"
              iconPosition="left"
              onClick={() => onModerationAction('remove', item)}
            >
              Remove Content
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderComplaints = () => (
    <div className="space-y-4">
      {userComplaints?.map((complaint) => (
        <div key={complaint?.id} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedItems?.includes(complaint?.id)}
                onChange={(e) => handleItemSelect(complaint?.id, e?.target?.checked)}
                className="rounded border-border"
              />
              <div>
                <h3 className="font-medium text-foreground">{complaint?.subject}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusBadge(complaint?.status)}
                  {getPriorityBadge(complaint?.priority)}
                </div>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{formatTimestamp(complaint?.timestamp)}</span>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 mb-4">
            <p className="text-sm text-foreground">{complaint?.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Complainant</p>
              <p className="text-sm font-medium text-foreground">{complaint?.complainant}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Against</p>
              <p className="text-sm font-medium text-foreground">{complaint?.against}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Venue</p>
              <p className="text-sm font-medium text-foreground">{complaint?.venue}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Booking ID: {complaint?.bookingId}</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Eye"
                iconPosition="left"
                onClick={() => onModerationAction('investigate', complaint)}
              >
                Investigate
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="MessageSquare"
                iconPosition="left"
                onClick={() => onModerationAction('mediate', complaint)}
              >
                Mediate
              </Button>
              <Button
                variant="success"
                size="sm"
                iconName="Check"
                iconPosition="left"
                onClick={() => onModerationAction('resolve', complaint)}
              >
                Resolve
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAppeals = () => (
    <div className="space-y-4">
      {banAppeals?.map((appeal) => (
        <div key={appeal?.id} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedItems?.includes(appeal?.id)}
                onChange={(e) => handleItemSelect(appeal?.id, e?.target?.checked)}
                className="rounded border-border"
              />
              <div>
                <h3 className="font-medium text-foreground">{appeal?.user}</h3>
                <p className="text-sm text-muted-foreground">Original ban: {appeal?.originalReason}</p>
                {getStatusBadge(appeal?.status)}
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>Banned: {new Date(appeal.banDate)?.toLocaleDateString()}</p>
              <p>Appeal: {new Date(appeal.appealDate)?.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-foreground mb-2">Appeal Reason:</p>
            <p className="text-sm text-foreground">{appeal?.appealReason}</p>
          </div>

          {appeal?.supportingDocs?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground mb-2">Supporting Documents:</p>
              <div className="flex flex-wrap gap-2">
                {appeal?.supportingDocs?.map((doc, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-muted rounded-lg px-3 py-2">
                    <Icon name="FileText" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">{doc}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Download"
                      onClick={() => onModerationAction('download', doc)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Eye"
              iconPosition="left"
              onClick={() => onModerationAction('review', appeal)}
            >
              Review Case
            </Button>
            <Button
              variant="success"
              size="sm"
              iconName="Check"
              iconPosition="left"
              onClick={() => onModerationAction('approve_appeal', appeal)}
            >
              Approve Appeal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              iconName="X"
              iconPosition="left"
              onClick={() => onModerationAction('deny_appeal', appeal)}
            >
              Deny Appeal
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'flagged':
        return renderFlaggedContent();
      case 'complaints':
        return renderComplaints();
      case 'appeals':
        return renderAppeals();
      default:
        return renderFlaggedContent();
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="Shield" size={24} className="text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Moderation Panel</h2>
          </div>
          
          {selectedItems?.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedItems?.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                iconName="Check"
                iconPosition="left"
                onClick={() => handleBulkAction('bulk_approve')}
              >
                Bulk Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                iconName="X"
                iconPosition="left"
                onClick={() => handleBulkAction('bulk_remove')}
              >
                Bulk Remove
              </Button>
            </div>
          )}
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-micro ${
                activeTab === tab?.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
              {tab?.count > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {tab?.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default ModerationPanel;