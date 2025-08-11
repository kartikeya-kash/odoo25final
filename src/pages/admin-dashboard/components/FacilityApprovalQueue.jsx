import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const FacilityApprovalQueue = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const pendingFacilities = [
    {
      id: 1,
      name: "Elite Sports Complex",
      owner: "John Martinez",
      location: "Downtown District",
      sports: ["Basketball", "Tennis", "Volleyball"],
      submittedDate: "2025-08-09",
      images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400", "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400"],
      status: "pending",
      priority: "high"
    },
    {
      id: 2,
      name: "Community Recreation Center",
      owner: "Sarah Johnson",
      location: "Westside Area",
      sports: ["Football", "Cricket"],
      submittedDate: "2025-08-08",
      images: ["https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400"],
      status: "pending",
      priority: "medium"
    },
    {
      id: 3,
      name: "Urban Fitness Hub",
      owner: "Mike Chen",
      location: "Central Business District",
      sports: ["Badminton", "Table Tennis"],
      submittedDate: "2025-08-07",
      images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"],
      status: "pending",
      priority: "low"
    }
  ];

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev?.includes(id) 
        ? prev?.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems?.length === pendingFacilities?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(pendingFacilities?.map(f => f?.id));
    }
  };

  const handleApprove = (id) => {
    console.log('Approving facility:', id);
    // Handle approval logic
  };

  const handleReject = (id) => {
    console.log('Rejecting facility:', id);
    // Handle rejection logic
  };

  const handleBatchApprove = () => {
    console.log('Batch approving facilities:', selectedItems);
    setSelectedItems([]);
  };

  const handleBatchReject = () => {
    console.log('Batch rejecting facilities:', selectedItems);
    setSelectedItems([]);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Facility Approval Queue</h3>
            <p className="text-sm text-muted-foreground">{pendingFacilities?.length} facilities pending review</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="CheckSquare"
              onClick={handleSelectAll}
            >
              {selectedItems?.length === pendingFacilities?.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </div>

        {selectedItems?.length > 0 && (
          <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg mb-4">
            <span className="text-sm font-medium text-foreground">
              {selectedItems?.length} selected
            </span>
            <div className="flex items-center space-x-2 ml-auto">
              <Button
                variant="success"
                size="sm"
                iconName="Check"
                onClick={handleBatchApprove}
              >
                Approve Selected
              </Button>
              <Button
                variant="destructive"
                size="sm"
                iconName="X"
                onClick={handleBatchReject}
              >
                Reject Selected
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {pendingFacilities?.map((facility) => (
          <div key={facility?.id} className="p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-micro">
            <div className="flex items-start space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems?.includes(facility?.id)}
                  onChange={() => handleSelectItem(facility?.id)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                />
              </div>

              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={facility?.images?.[0]}
                  alt={facility?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-foreground truncate">{facility?.name}</h4>
                    <p className="text-sm text-muted-foreground">by {facility?.owner}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(facility?.priority)}`}>
                    {facility?.priority}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={14} />
                    <span>{facility?.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={14} />
                    <span>{new Date(facility.submittedDate)?.toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  {facility?.sports?.slice(0, 3)?.map((sport, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                      {sport}
                    </span>
                  ))}
                  {facility?.sports?.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                      +{facility?.sports?.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Eye"
                    onClick={() => window.location.href = `/facility-management?preview=${facility?.id}`}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    iconName="Check"
                    onClick={() => handleApprove(facility?.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    iconName="X"
                    onClick={() => handleReject(facility?.id)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          fullWidth
          iconName="ExternalLink"
          onClick={() => window.location.href = '/facility-management?tab=pending'}
        >
          View All Pending Facilities
        </Button>
      </div>
    </div>
  );
};

export default FacilityApprovalQueue;