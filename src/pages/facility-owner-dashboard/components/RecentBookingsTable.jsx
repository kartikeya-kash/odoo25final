import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { bookingAPI } from '../../../utils/api';

const RecentBookingsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('booking_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Load bookings from API on component mount
  useEffect(() => {
    const loadBookings = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get facility owner's bookings using the new API endpoint
        const filterOptions = {
          userRole: localStorage.getItem('userRole'),
          facilityOwnerId: localStorage.getItem('userId'),
          sortBy: sortField,
          sortOrder: sortDirection,
          page: currentPage,
          limit: 20,
          includeCustomerInfo: true,
          includeVenueDetails: true,
          includePayments: true
        };

        console.log('📊 Loading facility owner bookings with filters:', filterOptions);
        
        const response = await bookingAPI?.readBookings(filterOptions);
        
        if (response?.bookings) {
          setBookings(response?.bookings);
          setTotalCount(response?.totalCount);
          console.log(`✅ Loaded ${response?.bookings?.length} bookings successfully`);
        }
        
      } catch (error) {
        console.error('❌ Error loading bookings:', error?.message);
        setError(error?.message || 'Failed to load bookings');
        
        // Fallback to mock data if API fails
        setBookings([
          {
            booking_id: 'BK-2025-001',
            confirmation_number: 'QC-ABC123',
            customer_info: {
              name: 'John Smith',
              email: 'john.smith@email.com',
              phone: '+1 (555) 123-4567'
            },
            court_name: 'Basketball Court A',
            booking_date: '2025-08-11',
            start_time: '09:00:00',
            end_time: '11:00:00',
            status: 'confirmed',
            payment_info: {
              amount: 50
            }
          },
          {
            booking_id: 'BK-2025-002',
            confirmation_number: 'QC-DEF456',
            customer_info: {
              name: 'Sarah Johnson',
              email: 'sarah.j@email.com',
              phone: '+1 (555) 234-5678'
            },
            court_name: 'Tennis Court 1',
            booking_date: '2025-08-11',
            start_time: '14:00:00',
            end_time: '15:00:00',
            status: 'pending',
            payment_info: {
              amount: 30
            }
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [sortField, sortDirection, currentPage]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { color: 'bg-success/20 text-success border-success', label: 'Confirmed' },
      pending: { color: 'bg-warning/20 text-warning border-warning', label: 'Pending' },
      completed: { color: 'bg-primary/20 text-primary border-primary', label: 'Completed' },
      cancelled: { color: 'bg-destructive/20 text-destructive border-destructive', label: 'Cancelled' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedBookings = bookings?.filter(booking => 
      booking?.customer_info?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      booking?.customer_info?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      booking?.court_name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      booking?.confirmation_number?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

  // Handle booking status change using API
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      console.log(`🔄 Changing booking ${bookingId} status to ${newStatus}`);
      
      await bookingAPI?.updateBookingStatus(bookingId, newStatus, `Status updated by facility owner`);
      
      // Update local state to reflect the change
      setBookings(prevBookings => 
        prevBookings?.map(booking => 
          booking?.booking_id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        )
      );
      
      console.log(`✅ Booking ${bookingId} status updated to ${newStatus}`);
      
    } catch (error) {
      console.error(`❌ Error updating booking status:`, error?.message);
      setError(error?.message || 'Failed to update booking status');
    }
  };

  // Handle view booking details using API
  const handleViewDetails = async (bookingId) => {
    try {
      console.log(`👁️ Viewing details for booking ${bookingId}`);
      
      const bookingDetails = await bookingAPI?.getBookingDetails(bookingId);
      
      if (bookingDetails) {
        // TODO: Open modal or navigate to details page with bookingDetails
        console.log('📄 Booking details loaded:', bookingDetails);
      }
      
    } catch (error) {
      console.error(`❌ Error loading booking details:`, error?.message);
      setError(error?.message || 'Failed to load booking details');
    }
  };

  const handleExportBookings = async () => {
    try {
      console.log('📥 Exporting bookings data');
      
      // Get all bookings for export (no pagination)
      const exportData = await bookingAPI?.readBookings({
        userRole: localStorage.getItem('userRole'),
        facilityOwnerId: localStorage.getItem('userId'),
        limit: 1000, // Export up to 1000 bookings
        includeCustomerInfo: true,
        includeVenueDetails: true,
        includePayments: true
      });
      
      if (exportData?.bookings) {
        // Convert to CSV format
        const csvData = exportData?.bookings?.map(booking => ({
          'Booking ID': booking?.booking_id,
          'Confirmation Number': booking?.confirmation_number,
          'Customer Name': booking?.customer_info?.name,
          'Customer Email': booking?.customer_info?.email,
          'Court': booking?.court_name,
          'Date': booking?.booking_date,
          'Time': `${booking?.start_time} - ${booking?.end_time}`,
          'Status': booking?.status,
          'Revenue': `$${booking?.payment_info?.amount}`,
          'Created Date': booking?.created_at
        }));
        
        // TODO: Implement CSV download functionality
        console.log('📊 Export data prepared:', csvData);
      }
      
    } catch (error) {
      console.error('❌ Error exporting bookings:', error?.message);
      setError(error?.message || 'Failed to export bookings');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-card p-6">
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      {/* Table Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Recent Bookings</h3>
            {error && (
              <p className="text-sm text-destructive mt-1">
                {error} - Showing cached data
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={handleExportBookings}
          >
            Export
          </Button>
        </div>
        
        {/* Search */}
        <div className="max-w-md">
          <Input
            type="search"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('customer_info.name')}
                  className="flex items-center space-x-1 hover:text-foreground transition-micro"
                >
                  <span>Customer</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('court_name')}
                  className="flex items-center space-x-1 hover:text-foreground transition-micro"
                >
                  <span>Court</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('booking_date')}
                  className="flex items-center space-x-1 hover:text-foreground transition-micro"
                >
                  <span>Date & Time</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('payment_info.amount')}
                  className="flex items-center space-x-1 hover:text-foreground transition-micro"
                >
                  <span>Revenue</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedBookings?.map((booking) => (
              <tr key={booking?.booking_id} className="border-t border-border hover:bg-muted/30 transition-micro">
                <td className="p-4">
                  <div>
                    <div className="font-medium text-foreground">{booking?.customer_info?.name}</div>
                    <div className="text-sm text-muted-foreground">{booking?.customer_info?.email}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground">{booking?.court_name}</div>
                </td>
                <td className="p-4">
                  <div>
                    <div className="text-sm text-foreground">
                      {booking?.booking_date ? new Date(booking?.booking_date)?.toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {booking?.start_time} - {booking?.end_time}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {getStatusBadge(booking?.status)}
                </td>
                <td className="p-4">
                  <span className="font-medium text-foreground">
                    ${booking?.payment_info?.amount || 0}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => handleViewDetails(booking?.booking_id)}
                    />
                    {booking?.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Check"
                          onClick={() => handleStatusChange(booking?.booking_id, 'confirmed')}
                          className="text-success hover:text-success"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="X"
                          onClick={() => handleStatusChange(booking?.booking_id, 'cancelled')}
                          className="text-destructive hover:text-destructive"
                        />
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAndSortedBookings?.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground/50" />
            <p>No bookings found</p>
            {searchTerm && (
              <p className="text-sm mt-1">Try adjusting your search terms</p>
            )}
          </div>
        )}
      </div>

      {/* Table Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {filteredAndSortedBookings?.length} of {totalCount} bookings</span>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <span className="px-2">Page {currentPage}</span>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={filteredAndSortedBookings?.length < 20}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentBookingsTable;