import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import AuthenticationGuard from '../../components/ui/AuthenticationGuard';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfoSection from './components/PersonalInfoSection';
import SportsPreferencesSection from './components/SportsPreferencesSection';
import NotificationSettingsSection from './components/NotificationSettingsSection';
import PaymentMethodsSection from './components/PaymentMethodsSection';
import SecuritySection from './components/SecuritySection';
import PrivacyControlsSection from './components/PrivacyControlsSection';
import { useNavigation } from '../../components/ui/RoleBasedNavigation';

const UserProfile = () => {
  const { userRole, isAuthenticated } = useNavigation();
  const [activeTab, setActiveTab] = useState('personal');
  const [user, setUser] = useState({
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    dateOfBirth: "1992-03-15",
    bio: "Passionate sports enthusiast who loves playing basketball and tennis. Always looking for new courts to explore and fellow players to connect with.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    membershipLevel: "gold",
    joinDate: "March 2023",
    achievements: [
      { name: "Early Adopter", icon: "Star", description: "Joined in the first month" },
      { name: "Court Explorer", icon: "MapPin", description: "Booked 10+ different venues" },
      { name: "Regular Player", icon: "Calendar", description: "50+ bookings completed" }
    ],
    stats: {
      totalBookings: 67,
      favoriteVenues: 12,
      rating: 4.8
    }
  });

  const [sportsPreferences, setSportsPreferences] = useState({
    favoriteSports: ['basketball', 'tennis', 'badminton'],
    skillLevels: {
      basketball: 'Advanced',
      tennis: 'Intermediate',
      badminton: 'Beginner'
    }
  });

  const [notificationSettings, setNotificationSettings] = useState({
    bookingConfirmations: { email: true, sms: true },
    promotions: { email: true, sms: false },
    reminders: { email: true, sms: true },
    newVenues: { email: false, sms: false },
    communityUpdates: { email: true, sms: false }
  });

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'visa',
      lastFour: '4242',
      cardholderName: 'Alex Johnson',
      expiryDate: '12/26',
      isDefault: true
    },
    {
      id: '2',
      type: 'mastercard',
      lastFour: '8888',
      cardholderName: 'Alex Johnson',
      expiryDate: '08/27',
      isDefault: false
    }
  ]);

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    lastPasswordChange: '2025-07-15T10:30:00Z'
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'friends',
    bookingHistory: 'private',
    contactInfo: 'friends',
    analytics: true,
    marketing: false,
    thirdParty: false
  });

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'User' },
    { id: 'sports', label: 'Sports', icon: 'Trophy' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'payments', label: 'Payments', icon: 'CreditCard' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'privacy', label: 'Privacy', icon: 'Lock' }
  ];

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleUserUpdate = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const handlePhotoUpdate = (newPhotoUrl) => {
    setUser(prev => ({ ...prev, avatar: newPhotoUrl }));
  };

  const handleSportsPreferencesUpdate = (updatedPreferences) => {
    setSportsPreferences(updatedPreferences);
  };

  const handleNotificationSettingsUpdate = (updatedSettings) => {
    setNotificationSettings(updatedSettings);
  };

  const handlePaymentMethodsUpdate = (updatedMethods) => {
    setPaymentMethods(updatedMethods);
  };

  const handleSecuritySettingsUpdate = (updatedSettings) => {
    setSecuritySettings(updatedSettings);
  };

  const handlePrivacySettingsUpdate = (updatedSettings) => {
    setPrivacySettings(updatedSettings);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <PersonalInfoSection
            user={user}
            onUpdate={handleUserUpdate}
          />
        );
      case 'sports':
        return (
          <SportsPreferencesSection
            preferences={sportsPreferences}
            onUpdate={handleSportsPreferencesUpdate}
          />
        );
      case 'notifications':
        return (
          <NotificationSettingsSection
            settings={notificationSettings}
            onUpdate={handleNotificationSettingsUpdate}
          />
        );
      case 'payments':
        return (
          <PaymentMethodsSection
            paymentMethods={paymentMethods}
            onUpdate={handlePaymentMethodsUpdate}
          />
        );
      case 'security':
        return (
          <SecuritySection
            securitySettings={securitySettings}
            onUpdate={handleSecuritySettingsUpdate}
          />
        );
      case 'privacy':
        return (
          <PrivacyControlsSection
            privacySettings={privacySettings}
            onUpdate={handlePrivacySettingsUpdate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthenticationGuard>
      <div className="min-h-screen bg-background">
        <Header userRole={userRole} isAuthenticated={isAuthenticated} bookingCount={3} />
        <div className="pt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Profile Header */}
            <ProfileHeader
              user={user}
              onPhotoUpdate={handlePhotoUpdate}
            />

            {/* Mobile Tab Navigation */}
            <div className="lg:hidden mb-6">
              <div className="flex overflow-x-auto pb-2 space-x-1">
                {tabs?.map(tab => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-micro ${
                      activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              {/* Desktop Sidebar Navigation */}
              <div className="hidden lg:block lg:col-span-3">
                <div className="sticky top-24">
                  <nav className="space-y-1">
                    {tabs?.map(tab => (
                      <button
                        key={tab?.id}
                        onClick={() => setActiveTab(tab?.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-micro ${
                          activeTab === tab?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        <span>{tab?.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-9">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticationGuard>
  );
};

export default UserProfile;