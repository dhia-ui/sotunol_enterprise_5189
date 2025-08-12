import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ViewControls = ({ 
  onNodeSizeChange, 
  onConnectionVisibilityChange, 
  onColorSchemeChange,
  onFilterChange,
  onAnimationToggle,
  isAnimating = false,
  currentFilters = {}
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [nodeSize, setNodeSize] = useState(1.0);
  const [showConnections, setShowConnections] = useState(true);
  const [colorScheme, setColorScheme] = useState('status');
  
  const colorSchemeOptions = [
    { value: 'status', label: 'By Status', description: 'Green=Active, Red=Issues, Blue=Processing' },
    { value: 'type', label: 'By Type', description: 'Different colors for POS types' },
    { value: 'volume', label: 'By Volume', description: 'Heat map based on transaction volume' },
    { value: 'performance', label: 'By Performance', description: 'Performance-based color coding' }
  ];

  const documentTypeOptions = [
    { value: 'all', label: 'All Documents' },
    { value: 'cheques', label: 'Cheques' },
    { value: 'kimbiales', label: 'Kimbiales' },
    { value: 'factures', label: 'Factures' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'processing', label: 'Processing' },
    { value: 'issues', label: 'Issues' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const handleNodeSizeChange = (value) => {
    setNodeSize(value);
    onNodeSizeChange(value);
  };

  const handleConnectionToggle = (checked) => {
    setShowConnections(checked);
    onConnectionVisibilityChange(checked);
  };

  const handleColorSchemeChange = (value) => {
    setColorScheme(value);
    onColorSchemeChange(value);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...currentFilters, [filterType]: value };
    onFilterChange(newFilters);
  };

  return (
    <div className="fixed left-4 top-20 z-40 w-80 bg-card border border-border rounded-lg shadow-synthwave-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Settings" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">View Controls</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
        </Button>
      </div>
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Display Options */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
              <Icon name="Eye" size={16} className="text-primary" />
              <span>Display Options</span>
            </h4>
            
            {/* Node Size */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Node Size: {nodeSize?.toFixed(1)}x</label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={nodeSize}
                onChange={(e) => handleNodeSizeChange(parseFloat(e?.target?.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Connection Visibility */}
            <Checkbox
              label="Show Connections"
              description="Display relationship lines between nodes"
              checked={showConnections}
              onChange={(e) => handleConnectionToggle(e?.target?.checked)}
            />

            {/* Color Scheme */}
            <Select
              label="Color Scheme"
              options={colorSchemeOptions}
              value={colorScheme}
              onChange={handleColorSchemeChange}
            />
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
              <Icon name="Filter" size={16} className="text-primary" />
              <span>Filters</span>
            </h4>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">From Date</label>
                <input
                  type="date"
                  defaultValue="2025-01-01"
                  onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">To Date</label>
                <input
                  type="date"
                  defaultValue="2025-08-12"
                  onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Document Type Filter */}
            <Select
              label="Document Type"
              options={documentTypeOptions}
              value={currentFilters?.documentType || 'all'}
              onChange={(value) => handleFilterChange('documentType', value)}
            />

            {/* Status Filter */}
            <Select
              label="Status"
              options={statusOptions}
              value={currentFilters?.status || 'all'}
              onChange={(value) => handleFilterChange('status', value)}
            />
          </div>

          {/* Animation Controls */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
              <Icon name="Play" size={16} className="text-primary" />
              <span>Animation</span>
            </h4>

            <div className="flex items-center space-x-2">
              <Button
                variant={isAnimating ? "default" : "outline"}
                size="sm"
                onClick={onAnimationToggle}
                iconName={isAnimating ? "Pause" : "Play"}
                iconPosition="left"
                iconSize={14}
              >
                {isAnimating ? 'Pause' : 'Start'} Rotation
              </Button>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-primary" />
              <span>Legend</span>
            </h4>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-xs text-muted-foreground">Active POS</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                <span className="text-xs text-muted-foreground">Processing Centers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-destructive rounded-full"></div>
                <span className="text-xs text-muted-foreground">Issues/Errors</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-xs text-muted-foreground">Pending</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewControls;