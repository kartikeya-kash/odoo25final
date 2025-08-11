import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';


const ProfileHeader = ({ user, onPhotoUpdate }) => {
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);

  const handlePhotoUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onPhotoUpdate(e?.target?.result);
        setIsEditingPhoto(false);
      };
      reader?.readAsDataURL(file);
    }
  };

  const getMembershipBadge = (level) => {
    const badges = {
      bronze: { color: 'bg-amber-600', text: 'Bronze Member' },
      silver: { color: 'bg-slate-400', text: 'Silver Member' },
      gold: { color: 'bg-yellow-500', text: 'Gold Member' },
      platinum: { color: 'bg-purple-600', text: 'Platinum Member' }
    };
    return badges?.[level] || badges?.bronze;
  };

  const membershipBadge = getMembershipBadge(user?.membershipLevel);

  return (
    <div className="bg-gradient-to-r from-primary to-blue-700 text-white p-6 rounded-lg mb-6">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Profile Photo */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src={user?.avatar}
              alt={user?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={() => setIsEditingPhoto(true)}
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-micro"
          >
            <Icon name="Camera" size={16} />
          </button>
          
          {isEditingPhoto && (
            <div className="absolute top-0 left-0 w-24 h-24 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <label className="cursor-pointer">
                <Icon name="Upload" size={20} color="white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold mb-2">{user?.name}</h1>
          <p className="text-blue-100 mb-3">{user?.email}</p>
          
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${membershipBadge?.color}`}>
              {membershipBadge?.text}
            </span>
            <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium">
              Member since {user?.joinDate}
            </span>
          </div>

          {/* Achievement Badges */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            {user?.achievements?.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs"
                title={achievement?.description}
              >
                <Icon name={achievement?.icon} size={14} />
                <span>{achievement?.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 text-center sm:text-left">
          <div>
            <div className="text-2xl font-bold">{user?.stats?.totalBookings}</div>
            <div className="text-xs text-blue-100">Bookings</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{user?.stats?.favoriteVenues}</div>
            <div className="text-xs text-blue-100">Favorites</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{user?.stats?.rating}</div>
            <div className="text-xs text-blue-100">Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;