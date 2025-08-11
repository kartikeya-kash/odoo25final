import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const QuickSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  const mockSuggestions = [
    {
      id: 1,
      type: 'venue',
      name: 'Downtown Sports Complex',
      location: 'Downtown District',
      sport: 'Basketball, Tennis'
    },
    {
      id: 2,
      type: 'venue',
      name: 'City Tennis Club',
      location: 'Central Park Area',
      sport: 'Tennis, Squash'
    },
    {
      id: 3,
      type: 'sport',
      name: 'Basketball',
      venueCount: 24
    },
    {
      id: 4,
      type: 'sport',
      name: 'Tennis',
      venueCount: 18
    },
    {
      id: 5,
      type: 'location',
      name: 'Downtown District',
      venueCount: 12
    },
    {
      id: 6,
      type: 'venue',
      name: 'Elite Fitness Courts',
      location: 'Business District',
      sport: 'Basketball, Volleyball'
    },
    {
      id: 7,
      type: 'sport',
      name: 'Badminton',
      venueCount: 32
    },
    {
      id: 8,
      type: 'location',
      name: 'Riverside District',
      venueCount: 8
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);

    if (value?.length > 0) {
      const filtered = mockSuggestions?.filter(suggestion =>
        suggestion?.name?.toLowerCase()?.includes(value?.toLowerCase()) ||
        (suggestion?.location && suggestion?.location?.toLowerCase()?.includes(value?.toLowerCase())) ||
        (suggestion?.sport && suggestion?.sport?.toLowerCase()?.includes(value?.toLowerCase()))
      );
      setSuggestions(filtered?.slice(0, 6));
      setShowSuggestions(true);
      setSelectedSuggestion(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions?.length === 0) return;

    switch (e?.key) {
      case 'ArrowDown':
        e?.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions?.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e?.preventDefault();
        setSelectedSuggestion(prev => 
          prev > 0 ? prev - 1 : suggestions?.length - 1
        );
        break;
      case 'Enter':
        e?.preventDefault();
        if (selectedSuggestion >= 0) {
          handleSuggestionClick(suggestions?.[selectedSuggestion]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    let searchUrl = '/venues-listing';
    
    switch (suggestion?.type) {
      case 'venue':
        searchUrl = `/venue-details?id=${suggestion?.id}`;
        break;
      case 'sport':
        searchUrl = `/venues-listing?sport=${encodeURIComponent(suggestion?.name)}`;
        break;
      case 'location':
        searchUrl = `/venues-listing?location=${encodeURIComponent(suggestion?.name)}`;
        break;
      default:
        searchUrl = `/venues-listing?search=${encodeURIComponent(suggestion?.name)}`;
    }

    window.location.href = searchUrl;
    setShowSuggestions(false);
    setSearchQuery(suggestion?.name);
  };

  const handleSearch = () => {
    if (searchQuery?.trim()) {
      window.location.href = `/venues-listing?search=${encodeURIComponent(searchQuery?.trim())}`;
    }
  };

  const handleFocus = () => {
    if (searchQuery?.length > 0 && suggestions?.length > 0) {
      setShowSuggestions(true);
    }
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'venue':
        return 'Building2';
      case 'sport':
        return 'Circle';
      case 'location':
        return 'MapPin';
      default:
        return 'Search';
    }
  };

  const getSuggestionLabel = (suggestion) => {
    switch (suggestion?.type) {
      case 'venue':
        return `${suggestion?.name} • ${suggestion?.location}`;
      case 'sport':
        return `${suggestion?.name} • ${suggestion?.venueCount} venues`;
      case 'location':
        return `${suggestion?.name} • ${suggestion?.venueCount} venues`;
      default:
        return suggestion?.name;
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6" ref={searchRef}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <Icon name="Search" size={20} className="text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search venues, sports, or locations..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="pl-12 pr-20 h-12 text-base bg-card border-2 border-border focus:border-primary rounded-xl shadow-card"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Button
            variant="default"
            size="sm"
            onClick={handleSearch}
            disabled={!searchQuery?.trim()}
            className="rounded-lg"
          >
            Search
          </Button>
        </div>
      </div>
      {/* Search Suggestions */}
      {showSuggestions && suggestions?.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-modal z-50 max-h-80 overflow-y-auto"
        >
          <div className="py-2">
            {suggestions?.map((suggestion, index) => (
              <button
                key={suggestion?.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-muted transition-micro ${
                  index === selectedSuggestion ? 'bg-muted' : ''
                }`}
              >
                <Icon 
                  name={getSuggestionIcon(suggestion?.type)} 
                  size={18} 
                  className="text-muted-foreground flex-shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-popover-foreground truncate">
                    {suggestion?.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {suggestion?.type === 'venue' && suggestion?.location && (
                      <>
                        <Icon name="MapPin" size={12} className="inline mr-1" />
                        {suggestion?.location}
                        {suggestion?.sport && ` • ${suggestion?.sport}`}
                      </>
                    )}
                    {suggestion?.type === 'sport' && (
                      <>
                        <Icon name="Building2" size={12} className="inline mr-1" />
                        {suggestion?.venueCount} venues available
                      </>
                    )}
                    {suggestion?.type === 'location' && (
                      <>
                        <Icon name="Building2" size={12} className="inline mr-1" />
                        {suggestion?.venueCount} venues in this area
                      </>
                    )}
                  </p>
                </div>
                <Icon name="ArrowUpRight" size={14} className="text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
          
          {searchQuery?.trim() && (
            <>
              <hr className="border-border" />
              <button
                onClick={handleSearch}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-muted transition-micro"
              >
                <Icon name="Search" size={18} className="text-primary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary">
                    Search for "{searchQuery}"
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Find all venues matching your search
                  </p>
                </div>
                <Icon name="ArrowRight" size={14} className="text-primary flex-shrink-0" />
              </button>
            </>
          )}
        </div>
      )}
      {/* Popular Searches */}
      <div className="mt-4">
        <p className="text-sm text-muted-foreground mb-2">Popular searches:</p>
        <div className="flex flex-wrap gap-2">
          {['Basketball courts', 'Tennis near me', 'Weekend football', 'Badminton clubs']?.map((term, index) => (
            <button
              key={index}
              onClick={() => {
                setSearchQuery(term);
                window.location.href = `/venues-listing?search=${encodeURIComponent(term)}`;
              }}
              className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm hover:bg-muted/80 transition-micro"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickSearchBar;