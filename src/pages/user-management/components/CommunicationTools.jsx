import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CommunicationTools = ({ onSendMessage, onSendAnnouncement }) => {
  const [activeTab, setActiveTab] = useState('direct');
  const [messageForm, setMessageForm] = useState({
    recipient: '',
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    targetAudience: 'all',
    category: 'general',
    scheduledDate: '',
    expiryDate: ''
  });

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'normal', label: 'Normal Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const audienceOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'sports-enthusiast', label: 'Sports Enthusiasts' },
    { value: 'facility-owner', label: 'Facility Owners' },
    { value: 'new-users', label: 'New Users (Last 30 days)' },
    { value: 'active-users', label: 'Active Users' },
    { value: 'inactive-users', label: 'Inactive Users' }
  ];

  const categoryOptions = [
    { value: 'general', label: 'General' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'feature', label: 'New Features' },
    { value: 'policy', label: 'Policy Updates' },
    { value: 'promotion', label: 'Promotions' },
    { value: 'emergency', label: 'Emergency' }
  ];

  const recentMessages = [
    {
      id: 1,
      recipient: 'Sarah Johnson',
      subject: 'Account Verification Required',
      timestamp: '2025-08-11T07:30:00Z',
      status: 'sent',
      priority: 'high'
    },
    {
      id: 2,
      recipient: 'Mike Chen',
      subject: 'Booking Cancellation Policy',
      timestamp: '2025-08-11T06:45:00Z',
      status: 'read',
      priority: 'normal'
    },
    {
      id: 3,
      recipient: 'Alex Rodriguez',
      subject: 'Welcome to QuickCourt',
      timestamp: '2025-08-11T05:20:00Z',
      status: 'sent',
      priority: 'low'
    }
  ];

  const recentAnnouncements = [
    {
      id: 1,
      title: 'Platform Maintenance Scheduled',
      category: 'maintenance',
      targetAudience: 'all',
      publishDate: '2025-08-10',
      expiryDate: '2025-08-15',
      status: 'active',
      views: 1250
    },
    {
      id: 2,
      title: 'New Payment Options Available',
      category: 'feature',
      targetAudience: 'sports-enthusiast',
      publishDate: '2025-08-08',
      expiryDate: '2025-08-22',
      status: 'active',
      views: 890
    }
  ];

  const handleMessageSubmit = (e) => {
    e?.preventDefault();
    onSendMessage(messageForm);
    setMessageForm({
      recipient: '',
      subject: '',
      message: '',
      priority: 'normal'
    });
  };

  const handleAnnouncementSubmit = (e) => {
    e?.preventDefault();
    onSendAnnouncement(announcementForm);
    setAnnouncementForm({
      title: '',
      content: '',
      targetAudience: 'all',
      category: 'general',
      scheduledDate: '',
      expiryDate: ''
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      sent: { color: 'text-primary bg-primary/10', label: 'Sent' },
      read: { color: 'text-success bg-success/10', label: 'Read' },
      active: { color: 'text-success bg-success/10', label: 'Active' },
      scheduled: { color: 'text-warning bg-warning/10', label: 'Scheduled' },
      expired: { color: 'text-muted-foreground bg-muted', label: 'Expired' }
    };

    const config = statusConfig?.[status] || statusConfig?.sent;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
        return { icon: 'AlertTriangle', color: 'text-destructive' };
      case 'high':
        return { icon: 'ArrowUp', color: 'text-warning' };
      case 'low':
        return { icon: 'ArrowDown', color: 'text-success' };
      default:
        return { icon: 'Minus', color: 'text-muted-foreground' };
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderDirectMessage = () => (
    <div className="space-y-6">
      <form onSubmit={handleMessageSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Recipient"
            type="text"
            placeholder="Enter username or email"
            value={messageForm?.recipient}
            onChange={(e) => setMessageForm({ ...messageForm, recipient: e?.target?.value })}
            required
          />
          <Select
            label="Priority"
            options={priorityOptions}
            value={messageForm?.priority}
            onChange={(value) => setMessageForm({ ...messageForm, priority: value })}
          />
        </div>
        
        <Input
          label="Subject"
          type="text"
          placeholder="Message subject"
          value={messageForm?.subject}
          onChange={(e) => setMessageForm({ ...messageForm, subject: e?.target?.value })}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Message</label>
          <textarea
            className="w-full h-32 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Type your message here..."
            value={messageForm?.message}
            onChange={(e) => setMessageForm({ ...messageForm, message: e?.target?.value })}
            required
          />
        </div>
        
        <div className="flex items-center justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setMessageForm({ recipient: '', subject: '', message: '', priority: 'normal' })}
          >
            Clear
          </Button>
          <Button
            type="submit"
            variant="default"
            iconName="Send"
            iconPosition="left"
          >
            Send Message
          </Button>
        </div>
      </form>

      {/* Recent Messages */}
      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Messages</h3>
        <div className="space-y-3">
          {recentMessages?.map((message) => {
            const priorityInfo = getPriorityIcon(message?.priority);
            return (
              <div key={message?.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name={priorityInfo?.icon} size={16} className={priorityInfo?.color} />
                  <div>
                    <p className="font-medium text-foreground">{message?.subject}</p>
                    <p className="text-sm text-muted-foreground">To: {message?.recipient}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(message?.status)}
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(message?.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-6">
      <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
        <Input
          label="Announcement Title"
          type="text"
          placeholder="Enter announcement title"
          value={announcementForm?.title}
          onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e?.target?.value })}
          required
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Target Audience"
            options={audienceOptions}
            value={announcementForm?.targetAudience}
            onChange={(value) => setAnnouncementForm({ ...announcementForm, targetAudience: value })}
          />
          <Select
            label="Category"
            options={categoryOptions}
            value={announcementForm?.category}
            onChange={(value) => setAnnouncementForm({ ...announcementForm, category: value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Content</label>
          <textarea
            className="w-full h-40 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Write your announcement content here..."
            value={announcementForm?.content}
            onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e?.target?.value })}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Scheduled Date (Optional)"
            type="datetime-local"
            value={announcementForm?.scheduledDate}
            onChange={(e) => setAnnouncementForm({ ...announcementForm, scheduledDate: e?.target?.value })}
          />
          <Input
            label="Expiry Date (Optional)"
            type="date"
            value={announcementForm?.expiryDate}
            onChange={(e) => setAnnouncementForm({ ...announcementForm, expiryDate: e?.target?.value })}
          />
        </div>
        
        <div className="flex items-center justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setAnnouncementForm({ title: '', content: '', targetAudience: 'all', category: 'general', scheduledDate: '', expiryDate: '' })}
          >
            Clear
          </Button>
          <Button
            type="submit"
            variant="default"
            iconName="Megaphone"
            iconPosition="left"
          >
            Publish Announcement
          </Button>
        </div>
      </form>

      {/* Recent Announcements */}
      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Announcements</h3>
        <div className="space-y-4">
          {recentAnnouncements?.map((announcement) => (
            <div key={announcement?.id} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-foreground">{announcement?.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted-foreground capitalize">
                      {announcement?.category}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {announcement?.targetAudience?.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                {getStatusBadge(announcement?.status)}
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span>Published: {new Date(announcement.publishDate)?.toLocaleDateString()}</span>
                  {announcement?.expiryDate && (
                    <span>Expires: {new Date(announcement.expiryDate)?.toLocaleDateString()}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Eye" size={14} />
                  <span>{announcement?.views} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="border-b border-border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="MessageSquare" size={24} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Communication Tools</h2>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-micro ${
              activeTab === 'direct' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="Mail" size={16} />
            <span>Direct Messages</span>
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-micro ${
              activeTab === 'announcements' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="Megaphone" size={16} />
            <span>Announcements</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'direct' ? renderDirectMessage() : renderAnnouncements()}
      </div>
    </div>
  );
};

export default CommunicationTools;