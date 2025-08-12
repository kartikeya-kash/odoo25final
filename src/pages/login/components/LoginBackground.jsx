import React from 'react';
import Image from '../../../components/AppImage';

const LoginBackground = () => {
  const backgroundImages = [
    {
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      alt: "Basketball court with players"
    },
    {
      src: "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=2070&q=80",
      alt: "Tennis court aerial view"
    },
    {
      src: "https://images.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg?auto=compress&cs=tinysrgb&w=2070&q=80",
      alt: "Modern sports facility"
    }
  ];  

  const randomImage = backgroundImages?.[Math.floor(Math.random() * backgroundImages?.length)];

  return (
    <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70 z-10"></div>
      <Image
        src={randomImage?.src}
        alt={randomImage?.alt}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-12">
        <div className="max-w-md text-center space-y-6">
          <h3 className="text-3xl font-bold">
            Your Sports Journey Starts Here
          </h3>
          <p className="text-lg opacity-90">
            Connect with local sports facilities, book courts instantly, and join a community of passionate athletes.
          </p>
          
          {/* Feature Highlights */}
          <div className="space-y-4 pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">1</span>
              </div>
              <span className="text-sm">Instant court booking</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">2</span>
              </div>
              <span className="text-sm">Connect with players</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">3</span>
              </div>
              <span className="text-sm">Manage your bookings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginBackground;
