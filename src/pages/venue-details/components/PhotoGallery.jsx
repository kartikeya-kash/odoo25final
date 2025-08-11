import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import AppImage from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PhotoGallery = ({ 
  images = [], 
  venueName, 
  selectedIndex = 0, 
  onImageSelect, 
  showAllPhotos, 
  onShowAllPhotos 
}) => {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleSwipe = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && selectedIndex < images?.length - 1) {
      onImageSelect?.(selectedIndex + 1);
    }
    if (isRightSwipe && selectedIndex > 0) {
      onImageSelect?.(selectedIndex - 1);
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e?.targetTouches?.[0]?.clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e?.targetTouches?.[0]?.clientX);
  };

  const handleTouchEnd = () => {
    handleSwipe();
  };

  const nextImage = () => {
    if (selectedIndex < images?.length - 1) {
      onImageSelect?.(selectedIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedIndex > 0) {
      onImageSelect?.(selectedIndex - 1);
    }
  };

  if (!images?.length) {
    return (
      <div className="h-96 bg-muted flex items-center justify-center">
        <div className="text-center">
          <Icon name="Image" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Gallery */}
      <div className="lg:hidden relative h-80 bg-black">
        <div
          className="relative h-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AppImage
            src={images?.[selectedIndex]}
            alt={`${venueName} - Image ${selectedIndex + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            disabled={selectedIndex === 0}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
          
          <button
            onClick={nextImage}
            disabled={selectedIndex === images?.length - 1}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Icon name="ChevronRight" size={20} />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {images?.length}
          </div>

          {/* View All Photos Button */}
          <div className="absolute bottom-4 left-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onShowAllPhotos?.(true)}
              className="bg-white/90 text-black hover:bg-white"
            >
              <Icon name="Grid3X3" size={16} className="mr-2" />
              View All Photos
            </Button>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {images?.slice(0, 5)?.map((_, index) => (
            <button
              key={index}
              onClick={() => onImageSelect?.(index)}
              className={`w-2 h-2 rounded-full transition-micro ${
                index === selectedIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
          {images?.length > 5 && (
            <span className="text-white text-xs ml-1">+{images?.length - 5}</span>
          )}
        </div>
      </div>

      {/* Desktop Gallery */}
      <div className="hidden lg:grid grid-cols-4 gap-2 h-96">
        {/* Main Image */}
        <div className="col-span-2 row-span-2 relative group cursor-pointer">
          <AppImage
            src={images?.[0]}
            alt={`${venueName} - Main`}
            className="w-full h-full object-cover rounded-l-lg hover:opacity-90 transition-micro"
            onClick={() => onShowAllPhotos?.(true)}
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-micro rounded-l-lg flex items-center justify-center">
            <div className="bg-white/90 text-black px-4 py-2 rounded-lg font-medium">
              View Photos
            </div>
          </div>
        </div>

        {/* Thumbnail Grid */}
        {images?.slice(1, 5)?.map((image, index) => (
          <div key={index} className="relative group cursor-pointer">
            <AppImage
              src={image}
              alt={`${venueName} - ${index + 2}`}
              className="w-full h-full object-cover hover:opacity-90 transition-micro"
              onClick={() => onShowAllPhotos?.(true)}
            />
            {index === 3 && images?.length > 5 && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white font-semibold rounded-r-lg">
                +{images?.length - 5} More
              </div>
            )}
          </div>
        ))}

        {/* View All Photos Button */}
        <div className="absolute bottom-4 right-4">
          <Button
            variant="secondary"
            onClick={() => onShowAllPhotos?.(true)}
            className="bg-white/90 text-black hover:bg-white"
          >
            <Icon name="Grid3X3" size={16} className="mr-2" />
            Show All {images?.length} Photos
          </Button>
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      {showAllPhotos && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="relative h-full">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-black/70 text-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{venueName}</h3>
                  <p className="text-sm text-white/80">
                    {selectedIndex + 1} of {images?.length} photos
                  </p>
                </div>
                <button
                  onClick={() => onShowAllPhotos?.(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-micro"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>
            </div>

            {/* Main Image Display */}
            <div className="flex items-center justify-center h-full px-16 pt-20 pb-24">
              <AppImage
                src={images?.[selectedIndex]}
                alt={`${venueName} - ${selectedIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Navigation */}
            <button
              onClick={prevImage}
              disabled={selectedIndex === 0}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/70 transition-micro"
            >
              <Icon name="ChevronLeft" size={24} />
            </button>
            
            <button
              onClick={nextImage}
              disabled={selectedIndex === images?.length - 1}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/70 transition-micro"
            >
              <Icon name="ChevronRight" size={24} />
            </button>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4">
              <div className="flex space-x-2 overflow-x-auto">
                {images?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => onImageSelect?.(index)}
                    className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-micro ${
                      index === selectedIndex ? 'border-white' : 'border-transparent'
                    }`}
                  >
                    <AppImage
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGallery;