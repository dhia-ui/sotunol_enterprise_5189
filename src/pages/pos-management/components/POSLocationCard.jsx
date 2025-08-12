import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const POSLocationCard = ({ 
  location, 
  isSelected = false, 
  onSelect, 
  onEdit, 
  onDelete, 
  onViewOnMap 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10 border-success/20';
      case 'inactive':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'maintenance':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    return phone?.startsWith('+216') ? phone : `+216 ${phone}`;
  };

  return (
    <div 
      className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-synthwave ${
        isSelected 
          ? 'border-primary bg-primary/5 shadow-synthwave' 
          : 'border-border bg-card hover:border-primary/50'
      }`}
      onClick={() => onSelect(location)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg mb-1">
            {location?.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            ID: {location?.id}
          </p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(location?.status)}`}>
          {location?.status?.charAt(0)?.toUpperCase() + location?.status?.slice(1)}
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm">
          <Icon name="MapPin" size={16} className="text-primary flex-shrink-0" />
          <span className="text-muted-foreground truncate">
            {location?.address}, {location?.city}, {location?.governorate}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <Icon name="Phone" size={16} className="text-primary flex-shrink-0" />
          <span className="text-muted-foreground">
            {formatPhoneNumber(location?.phone)}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <Icon name="Mail" size={16} className="text-primary flex-shrink-0" />
          <span className="text-muted-foreground truncate">
            {location?.email || 'N/A'}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <Icon name="Navigation" size={16} className="text-primary flex-shrink-0" />
          <span className="text-muted-foreground">
            {location?.coordinates?.lat?.toFixed(4)}, {location?.coordinates?.lng?.toFixed(4)}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Calendar" size={12} />
          <span>Added: {new Date(location.createdAt)?.toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => {
              e?.stopPropagation();
              onViewOnMap(location);
            }}
            iconName="Map"
            iconSize={14}
            className="text-muted-foreground hover:text-primary"
          >
            Map
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => {
              e?.stopPropagation();
              onEdit(location);
            }}
            iconName="Edit"
            iconSize={14}
            className="text-muted-foreground hover:text-primary"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => {
              e?.stopPropagation();
              onDelete(location);
            }}
            iconName="Trash2"
            iconSize={14}
            className="text-muted-foreground hover:text-destructive"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default POSLocationCard;