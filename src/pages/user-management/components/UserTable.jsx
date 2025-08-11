import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Image from '../../../components/AppImage';

const UserTable = ({ users, onUserSelect, onBulkAction, selectedUsers, onUserAction }) => {
  const [sortField, setSortField] = useState('registrationDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedUser, setExpandedUser] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onUserSelect(users?.map(user => user?.id));
    } else {
      onUserSelect([]);
    }
  };

  const handleUserSelect = (userId, checked) => {
    if (checked) {
      onUserSelect([...selectedUsers, userId]);
    } else {
      onUserSelect(selectedUsers?.filter(id => id !== userId));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'text-success bg-success/10', label: 'Active' },
      inactive: { color: 'text-muted-foreground bg-muted', label: 'Inactive' },
      suspended: { color: 'text-warning bg-warning/10', label: 'Suspended' },
      banned: { color: 'text-destructive bg-destructive/10', label: 'Banned' }
    };

    const config = statusConfig?.[status] || statusConfig?.inactive;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const getUserTypeIcon = (type) => {
    switch (type) {
      case 'facility-owner':
        return 'Building2';
      case 'administrator':
        return 'Shield';
      default:
        return 'User';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const sortedUsers = [...users]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'registrationDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const isAllSelected = selectedUsers?.length === users?.length && users?.length > 0;
  const isPartiallySelected = selectedUsers?.length > 0 && selectedUsers?.length < users?.length;

  return (
    <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedUsers?.length > 0 && (
        <div className="bg-primary/5 border-b border-border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {selectedUsers?.length} user{selectedUsers?.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Mail"
                iconPosition="left"
                onClick={() => onBulkAction('message', selectedUsers)}
              >
                Send Message
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="UserX"
                iconPosition="left"
                onClick={() => onBulkAction('suspend', selectedUsers)}
              >
                Suspend
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                onClick={() => onBulkAction('export', selectedUsers)}
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 p-4">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isPartiallySelected}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="text-left p-4 font-medium text-foreground">User</th>
              <th 
                className="text-left p-4 font-medium text-foreground cursor-pointer hover:text-primary transition-micro"
                onClick={() => handleSort('userType')}
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  <Icon name="ArrowUpDown" size={14} />
                </div>
              </th>
              <th 
                className="text-left p-4 font-medium text-foreground cursor-pointer hover:text-primary transition-micro"
                onClick={() => handleSort('registrationDate')}
              >
                <div className="flex items-center space-x-1">
                  <span>Registered</span>
                  <Icon name="ArrowUpDown" size={14} />
                </div>
              </th>
              <th 
                className="text-left p-4 font-medium text-foreground cursor-pointer hover:text-primary transition-micro"
                onClick={() => handleSort('bookingCount')}
              >
                <div className="flex items-center space-x-1">
                  <span>Bookings</span>
                  <Icon name="ArrowUpDown" size={14} />
                </div>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Status</th>
              <th className="text-right p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers?.map((user) => (
              <React.Fragment key={user?.id}>
                <tr className="border-b border-border hover:bg-muted/30 transition-micro">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedUsers?.includes(user?.id)}
                      onChange={(e) => handleUserSelect(user?.id, e?.target?.checked)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={user?.avatar}
                        alt={user?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-foreground">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Icon name={getUserTypeIcon(user?.userType)} size={16} className="text-muted-foreground" />
                      <span className="text-sm text-foreground capitalize">
                        {user?.userType?.replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {formatDate(user?.registrationDate)}
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-foreground">
                      {user?.bookingCount}
                    </span>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(user?.status)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName={expandedUser === user?.id ? "ChevronUp" : "ChevronDown"}
                        onClick={() => setExpandedUser(expandedUser === user?.id ? null : user?.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="MoreHorizontal"
                        onClick={() => onUserAction('menu', user)}
                      />
                    </div>
                  </td>
                </tr>
                {expandedUser === user?.id && (
                  <tr className="bg-muted/20">
                    <td colSpan="7" className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Contact Information</h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Phone: {user?.phone}</p>
                            <p>Location: {user?.location}</p>
                            <p>Last Login: {formatDate(user?.lastLogin)}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Activity Summary</h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Total Bookings: {user?.bookingCount}</p>
                            <p>Completed: {user?.completedBookings}</p>
                            <p>Cancelled: {user?.cancelledBookings}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Quick Actions</h4>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              iconName="Mail"
                              iconPosition="left"
                              onClick={() => onUserAction('message', user)}
                            >
                              Message
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              iconName="Eye"
                              iconPosition="left"
                              onClick={() => onUserAction('view', user)}
                            >
                              View Profile
                            </Button>
                            {user?.status === 'active' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                iconName="UserX"
                                iconPosition="left"
                                onClick={() => onUserAction('suspend', user)}
                              >
                                Suspend
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                iconName="UserCheck"
                                iconPosition="left"
                                onClick={() => onUserAction('activate', user)}
                              >
                                Activate
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden">
        {sortedUsers?.map((user) => (
          <div key={user?.id} className="border-b border-border p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={selectedUsers?.includes(user?.id)}
                onChange={(e) => handleUserSelect(user?.id, e?.target?.checked)}
                className="mt-1"
              />
              <Image
                src={user?.avatar}
                alt={user?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Icon name={getUserTypeIcon(user?.userType)} size={14} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground capitalize">
                        {user?.userType?.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(user?.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MoreHorizontal"
                      onClick={() => onUserAction('menu', user)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                  <span>Registered: {formatDate(user?.registrationDate)}</span>
                  <span>{user?.bookingCount} bookings</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {users?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
};

export default UserTable;