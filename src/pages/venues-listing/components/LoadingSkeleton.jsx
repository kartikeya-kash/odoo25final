import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Skeleton */}
      <div className="bg-card border-b border-border mb-6">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            
            {/* Search Bar Skeleton */}
            <div className="flex flex-col md:flex-row gap-3 mt-6">
              <div className="flex-1 h-12 bg-muted rounded-lg"></div>
              <div className="w-80 flex gap-2">
                <div className="flex-1 h-12 bg-muted rounded-lg"></div>
                <div className="w-12 h-12 bg-muted rounded-lg"></div>
              </div>
            </div>
            
            {/* Sport Chips Skeleton */}
            <div className="flex flex-wrap gap-2 mt-4">
              {[...Array(6)]?.map((_, i) => (
                <div key={i} className="h-8 w-20 bg-muted rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="animate-pulse space-y-6">
              <div className="flex justify-between items-center">
                <div className="h-6 bg-muted rounded w-16"></div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
              
              {/* Filter Sections */}
              {[...Array(5)]?.map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-5 bg-muted rounded w-24"></div>
                  <div className="space-y-2">
                    {[...Array(4)]?.map((_, j) => (
                      <div key={j} className="flex items-center space-x-2">
                        <div className="h-4 w-4 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded w-20"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1">
          {/* Controls Bar Skeleton */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="lg:hidden h-10 w-20 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-24"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-20 bg-muted rounded"></div>
              <div className="h-8 w-32 bg-muted rounded"></div>
            </div>
          </div>

          {/* Venue Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(9)]?.map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="animate-pulse">
                  {/* Image Skeleton */}
                  <div className="h-48 bg-muted"></div>
                  
                  {/* Content Skeleton */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="h-6 bg-muted rounded w-32"></div>
                      <div className="flex items-center space-x-1">
                        <div className="h-4 w-4 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded w-8"></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {[...Array(3)]?.map((_, j) => (
                        <div key={j} className="h-6 w-16 bg-muted rounded"></div>
                      ))}
                    </div>
                    
                    <div className="h-4 bg-muted rounded w-40"></div>
                    <div className="h-4 bg-muted rounded w-20"></div>
                    
                    <div className="flex justify-between items-center">
                      <div className="h-8 bg-muted rounded w-20"></div>
                      <div className="h-8 w-20 bg-muted rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;