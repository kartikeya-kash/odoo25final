import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const WelcomeBanner = ({ userName = 'Alex' }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const bannerSlides = [
    {
      id: 1,
      title: "Book Your Perfect Court Today",
      subtitle: "Discover premium sports facilities in your area",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
      ctaText: "Find Venues",
      ctaAction: () => window.location.href = '/venues-listing',
      bgGradient: "from-blue-600 to-purple-600"
    },
    {
      id: 2,
      title: "Join the Sports Community",
      subtitle: "Connect with players and book group sessions",
      image: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?w=800&h=400&fit=crop",
      ctaText: "Explore Now",
      ctaAction: () => window.location.href = '/venues-listing',
      bgGradient: "from-green-600 to-teal-600"
    },
    {
      id: 3,
      title: "Special Weekend Offers",
      subtitle: "Save up to 30% on weekend bookings",
      image: "https://images.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg?w=800&h=400&fit=crop",
      ctaText: "View Deals",
      ctaAction: () => window.location.href = '/venues-listing?filter=deals',
      bgGradient: "from-orange-600 to-red-600"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides?.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, bannerSlides?.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides?.length) % bannerSlides?.length);
    setIsAutoPlaying(false);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides?.length);
    setIsAutoPlaying(false);
  };

  const currentBanner = bannerSlides?.[currentSlide];

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden shadow-card mb-6">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={currentBanner?.image}
          alt={currentBanner?.title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${currentBanner?.bgGradient} opacity-80`}></div>
      </div>
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-12 text-white">
        <div className="max-w-2xl">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
            Welcome back, {userName}!
          </h1>
          <h2 className="text-lg md:text-2xl lg:text-3xl font-semibold mb-2 md:mb-3">
            {currentBanner?.title}
          </h2>
          <p className="text-sm md:text-lg lg:text-xl opacity-90 mb-4 md:mb-6">
            {currentBanner?.subtitle}
          </p>
          <Button
            variant="default"
            size="lg"
            onClick={currentBanner?.ctaAction}
            className="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
            iconName="ArrowRight"
            iconPosition="right"
          >
            {currentBanner?.ctaText}
          </Button>
        </div>
      </div>
      {/* Navigation Arrows */}
      <button
        onClick={handlePrevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-micro backdrop-blur-sm"
      >
        <Icon name="ChevronLeft" size={20} color="white" />
      </button>
      <button
        onClick={handleNextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-micro backdrop-blur-sm"
      >
        <Icon name="ChevronRight" size={20} color="white" />
      </button>
      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {bannerSlides?.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-2 h-2 rounded-full transition-micro ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
      {/* Auto-play indicator */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-micro backdrop-blur-sm"
        >
          <Icon 
            name={isAutoPlaying ? "Pause" : "Play"} 
            size={14} 
            color="white" 
          />
        </button>
      </div>
    </div>
  );
};

export default WelcomeBanner;