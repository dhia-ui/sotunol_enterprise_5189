import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TunisiaMap = ({ 
  locations, 
  selectedLocation, 
  onLocationSelect, 
  onLocationEdit, 
  onLocationDelete, 
  onMapClick,
  showClusters = true 
}) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Tunisia bounds for coordinate validation
  const TUNISIA_BOUNDS = {
    north: 38.0,
    south: 30.0,
    east: 12.0,
    west: 7.0
  };

  const isWithinTunisiaBounds = (lat, lng) => {
    return lat >= TUNISIA_BOUNDS?.south && 
           lat <= TUNISIA_BOUNDS?.north && 
           lng >= TUNISIA_BOUNDS?.west && 
           lng <= TUNISIA_BOUNDS?.east;
  };

  const getMarkerColor = (status) => {
    switch (status) {
      case 'active':
        return '#10B981'; // success color
      case 'inactive':
        return '#F59E0B'; // warning color
      case 'maintenance':
        return '#EF4444'; // destructive color
      default:
        return '#8B5CF6'; // primary color
    }
  };

  const handleMarkerClick = (location, event) => {
    event?.stopPropagation();
    setSelectedMarker(location);
    setShowPopup(true);
    onLocationSelect(location);
  };

  const handleMapClick = (event) => {
    const rect = mapRef?.current?.getBoundingClientRect();
    const x = event?.clientX - rect?.left;
    const y = event?.clientY - rect?.top;
    
    // Convert pixel coordinates to approximate lat/lng (simplified)
    const lat = 34.0 + (0.5 - y / rect?.height) * 8; // Rough Tunisia center
    const lng = 9.5 + (x / rect?.width - 0.5) * 5;
    
    if (isWithinTunisiaBounds(lat, lng)) {
      onMapClick({ lat, lng });
    }
    
    setShowPopup(false);
    setSelectedMarker(null);
  };

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setSelectedMarker(selectedLocation);
      setShowPopup(true);
    }
  }, [selectedLocation]);

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    return phone?.startsWith('+216') ? phone : `+216 ${phone}`;
  };

  return (
    <div className="relative h-full bg-card rounded-lg border border-border overflow-hidden">
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground font-heading">
              Tunisia POS Locations
            </h3>
            <p className="text-sm text-muted-foreground">
              {locations?.length} locations • Click map to add new location
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPopup(false)}
              iconName="RotateCcw"
              iconSize={16}
              className="text-muted-foreground hover:text-foreground"
            >
              Reset View
            </Button>
          </div>
        </div>
      </div>
      {/* Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-full pt-20 cursor-crosshair"
        onClick={handleMapClick}
      >
        {!mapLoaded ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading Tunisia map...</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* Tunisia Map using Google Maps iframe */}
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title="Tunisia Map"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=34.0,9.5&z=7&output=embed"
              className="border-0"
            />
            
            {/* Custom Markers Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {locations?.map((location, index) => {
                // Convert coordinates to pixel positions (simplified)
                const x = ((location?.coordinates?.lng - 7.0) / 5.0) * 100;
                const y = ((38.0 - location?.coordinates?.lat) / 8.0) * 100;
                
                return (
                  <div
                    key={location?.id}
                    className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{
                      left: `${Math.max(5, Math.min(95, x))}%`,
                      top: `${Math.max(5, Math.min(95, y))}%`
                    }}
                    onClick={(e) => handleMarkerClick(location, e)}
                  >
                    <div 
                      className={`w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-200 hover:scale-110 ${
                        selectedMarker?.id === location?.id ? 'scale-125 ring-2 ring-primary' : ''
                      }`}
                      style={{ backgroundColor: getMarkerColor(location?.status) }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon name="MapPin" size={12} className="text-white" />
                      </div>
                    </div>
                    {/* Location Label */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-card/90 backdrop-blur-sm text-xs font-medium text-foreground rounded shadow-lg whitespace-nowrap">
                      {location?.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {/* Location Details Popup */}
      {showPopup && selectedMarker && (
        <div className="absolute bottom-4 left-4 right-4 z-20 bg-card border border-border rounded-lg shadow-synthwave-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-semibold text-foreground text-lg mb-1">
                {selectedMarker?.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                ID: {selectedMarker?.id}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                selectedMarker?.status === 'active' ?'text-success bg-success/10 border border-success/20'
                  : selectedMarker?.status === 'inactive' ?'text-warning bg-warning/10 border border-warning/20' :'text-destructive bg-destructive/10 border border-destructive/20'
              }`}>
                {selectedMarker?.status?.charAt(0)?.toUpperCase() + selectedMarker?.status?.slice(1)}
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setShowPopup(false)}
                iconName="X"
                iconSize={14}
                className="text-muted-foreground hover:text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2 text-sm">
              <Icon name="MapPin" size={14} className="text-primary flex-shrink-0" />
              <span className="text-muted-foreground">
                {selectedMarker?.address}, {selectedMarker?.city}, {selectedMarker?.governorate}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Icon name="Phone" size={14} className="text-primary flex-shrink-0" />
              <span className="text-muted-foreground">
                {formatPhoneNumber(selectedMarker?.phone)}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <Icon name="Navigation" size={14} className="text-primary flex-shrink-0" />
              <span className="text-muted-foreground">
                {selectedMarker?.coordinates?.lat?.toFixed(4)}, {selectedMarker?.coordinates?.lng?.toFixed(4)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Added: {new Date(selectedMarker.createdAt)?.toLocaleDateString()}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="xs"
                onClick={() => onLocationEdit(selectedMarker)}
                iconName="Edit"
                iconPosition="left"
                iconSize={14}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="xs"
                onClick={() => onLocationDelete(selectedMarker)}
                iconName="Trash2"
                iconPosition="left"
                iconSize={14}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Map Legend */}
      <div className="absolute top-24 right-4 z-10 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3">
        <h5 className="text-sm font-medium text-foreground mb-2">Status Legend</h5>
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="text-muted-foreground">Active</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span className="text-muted-foreground">Inactive</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-destructive"></div>
            <span className="text-muted-foreground">Maintenance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TunisiaMap;