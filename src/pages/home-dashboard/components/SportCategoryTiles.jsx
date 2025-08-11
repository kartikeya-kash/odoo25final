import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SportCategoryTiles = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const sportCategories = [
    {
      id: 1,
      name: "Basketball",
      icon: "Circle",
      venueCount: 24,
      avgPrice: 35,
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop",
      color: "from-orange-500 to-red-500",
      description: "Indoor and outdoor basketball courts"
    },
    {
      id: 2,
      name: "Tennis",
      icon: "Circle",
      venueCount: 18,
      avgPrice: 45,
      image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?w=300&h=200&fit=crop",
      color: "from-green-500 to-teal-500",
      description: "Professional tennis courts and clubs"
    },
    {
      id: 3,
      name: "Football",
      icon: "Circle",
      venueCount: 12,
      avgPrice: 60,
      image: "https://images.pixabay.com/photo/2016/06/03/13/57/digital-marketing-1433427_1280.jpg?w=300&h=200&fit=crop",
      color: "from-blue-500 to-purple-500",
      description: "Full-size football fields and pitches"
    },
    {
      id: 4,
      name: "Badminton",
      icon: "Circle",
      venueCount: 32,
      avgPrice: 25,
      image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=300&h=200&fit=crop",
      color: "from-yellow-500 to-orange-500",
      description: "Indoor badminton courts with equipment"
    },
    {
      id: 5,
      name: "Volleyball",
      icon: "Circle",
      venueCount: 15,
      avgPrice: 40,
      image: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?w=300&h=200&fit=crop",
      color: "from-pink-500 to-rose-500",
      description: "Beach and indoor volleyball courts"
    },
    {
      id: 6,
      name: "Squash",
      icon: "Circle",
      venueCount: 8,
      avgPrice: 50,
      image: "https://images.pixabay.com/photo/2017/08/07/14/02/people-2604149_1280.jpg?w=300&h=200&fit=crop",
      color: "from-indigo-500 to-blue-500",
      description: "Professional squash courts"
    },
    {
      id: 7,
      name: "Table Tennis",
      icon: "Circle",
      venueCount: 20,
      avgPrice: 20,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
      color: "from-cyan-500 to-blue-500",
      description: "Indoor table tennis facilities"
    },
    {
      id: 8,
      name: "Swimming",
      icon: "Circle",
      venueCount: 10,
      avgPrice: 30,
      image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?w=300&h=200&fit=crop",
      color: "from-blue-400 to-cyan-400",
      description: "Swimming pools and aquatic centers"
    }
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category?.id === selectedCategory ? null : category?.id);
    window.location.href = `/venues-listing?sport=${encodeURIComponent(category?.name)}`;
  };

  const handleViewAllSports = () => {
    window.location.href = '/venues-listing';
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Browse by Sport</h2>
          <p className="text-muted-foreground">Find venues for your favorite activities</p>
        </div>
        <button
          onClick={handleViewAllSports}
          className="text-primary hover:text-primary/80 font-medium text-sm flex items-center space-x-1 transition-micro"
        >
          <span>View All Sports</span>
          <Icon name="ArrowRight" size={16} />
        </button>
      </div>
      {/* Mobile: 2 columns */}
      <div className="grid grid-cols-2 md:hidden gap-4">
        {sportCategories?.slice(0, 6)?.map((category) => (
          <div
            key={category?.id}
            onClick={() => handleCategoryClick(category)}
            className="relative bg-card border border-border rounded-lg overflow-hidden shadow-card hover:shadow-modal transition-micro cursor-pointer group"
          >
            <div className="relative h-32">
              <Image
                src={category?.image}
                alt={category?.name}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${category?.color} opacity-80 group-hover:opacity-70 transition-micro`}></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-3">
                <Icon name={category?.icon} size={24} className="mb-2" />
                <h3 className="font-semibold text-sm text-center">{category?.name}</h3>
                <p className="text-xs opacity-90 text-center mt-1">
                  {category?.venueCount} venues
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Tablet: 3 columns */}
      <div className="hidden md:grid lg:hidden grid-cols-3 gap-4">
        {sportCategories?.slice(0, 6)?.map((category) => (
          <div
            key={category?.id}
            onClick={() => handleCategoryClick(category)}
            className="relative bg-card border border-border rounded-lg overflow-hidden shadow-card hover:shadow-modal transition-micro cursor-pointer group"
          >
            <div className="relative h-40">
              <Image
                src={category?.image}
                alt={category?.name}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${category?.color} opacity-80 group-hover:opacity-70 transition-micro`}></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
                <Icon name={category?.icon} size={28} className="mb-2" />
                <h3 className="font-semibold text-base text-center">{category?.name}</h3>
                <p className="text-sm opacity-90 text-center mt-1">
                  {category?.venueCount} venues
                </p>
                <p className="text-xs opacity-75 text-center mt-1">
                  From ${category?.avgPrice}/hr
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Desktop: 4 columns */}
      <div className="hidden lg:grid grid-cols-4 gap-6">
        {sportCategories?.map((category) => (
          <div
            key={category?.id}
            onClick={() => handleCategoryClick(category)}
            className="relative bg-card border border-border rounded-lg overflow-hidden shadow-card hover:shadow-modal transition-micro cursor-pointer group"
          >
            <div className="relative h-48">
              <Image
                src={category?.image}
                alt={category?.name}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${category?.color} opacity-80 group-hover:opacity-70 transition-micro`}></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
                <Icon name={category?.icon} size={32} className="mb-3" />
                <h3 className="font-semibold text-lg text-center">{category?.name}</h3>
                <p className="text-sm opacity-90 text-center mt-1">
                  {category?.venueCount} venues available
                </p>
                <p className="text-xs opacity-75 text-center mt-1">
                  From ${category?.avgPrice}/hour
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm p-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
              <p className="text-white text-xs text-center">
                {category?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Show More Button for Mobile/Tablet */}
      <div className="lg:hidden mt-6 text-center">
        <button
          onClick={handleViewAllSports}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-micro"
        >
          <span>View All Sports</span>
          <Icon name="ArrowRight" size={16} />
        </button>
      </div>
    </div>
  );
};

export default SportCategoryTiles;