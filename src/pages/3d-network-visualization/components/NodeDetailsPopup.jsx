import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NodeDetailsPopup = ({ node, onClose, position = { x: 0, y: 0 } }) => {
  if (!node) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'CheckCircle';
      case 'processing': return 'Clock';
      case 'issues': return 'AlertTriangle';
      case 'inactive': return 'XCircle';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'processing': return 'text-secondary';
      case 'issues': return 'text-destructive';
      case 'inactive': return 'text-muted-foreground';
      default: return 'text-primary';
    }
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return 'text-success';
    if (performance >= 70) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div 
      className="fixed z-50 w-80 bg-card border border-border rounded-lg shadow-synthwave-xl"
      style={{ 
        left: Math.min(position?.x, window.innerWidth - 320), 
        top: Math.min(position?.y, window.innerHeight - 400) 
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon 
            name={node?.type === 'pos' ? 'MapPin' : 'Server'} 
            size={20} 
            className="text-primary" 
          />
          <h3 className="font-semibold text-foreground">{node?.name}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground">Type</label>
            <div className="flex items-center space-x-1 mt-1">
              <Icon 
                name={node?.type === 'pos' ? 'Store' : 'Database'} 
                size={14} 
                className="text-primary" 
              />
              <span className="text-sm font-medium text-foreground capitalize">
                {node?.type === 'pos' ? 'Point of Sale' : 'Processing Center'}
              </span>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Location</label>
            <div className="flex items-center space-x-1 mt-1">
              <Icon name="MapPin" size={14} className="text-secondary" />
              <span className="text-sm font-medium text-foreground">{node?.location}</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-xs text-muted-foreground">Status</label>
          <div className="flex items-center space-x-2 mt-1">
            <Icon 
              name={getStatusIcon(node?.status)} 
              size={16} 
              className={getStatusColor(node?.status)} 
            />
            <span className={`text-sm font-medium capitalize ${getStatusColor(node?.status)}`}>
              {node?.status}
            </span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Performance Metrics</h4>
          
          {/* Transactions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Activity" size={14} className="text-primary" />
              <span className="text-sm text-muted-foreground">Transactions</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {node?.transactions?.toLocaleString()}
            </span>
          </div>

          {/* Performance Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={14} className="text-primary" />
                <span className="text-sm text-muted-foreground">Performance</span>
              </div>
              <span className={`text-sm font-medium ${getPerformanceColor(node?.performance)}`}>
                {node?.performance}%
              </span>
            </div>
            
            {/* Performance Bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  node?.performance >= 90 ? 'bg-success' :
                  node?.performance >= 70 ? 'bg-warning' : 'bg-destructive'
                }`}
                style={{ width: `${node?.performance}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Connection Info */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Network Connections</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-muted/30 rounded">
              <div className="font-medium text-success">Active</div>
              <div className="text-muted-foreground">3</div>
            </div>
            <div className="text-center p-2 bg-muted/30 rounded">
              <div className="font-medium text-warning">Pending</div>
              <div className="text-muted-foreground">1</div>
            </div>
            <div className="text-center p-2 bg-muted/30 rounded">
              <div className="font-medium text-destructive">Failed</div>
              <div className="text-muted-foreground">0</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Recent Activity</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-muted-foreground">Processed 45 cheques</span>
              <span className="text-muted-foreground ml-auto">2 min ago</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span className="text-muted-foreground">Updated facture #F-2025-0812</span>
              <span className="text-muted-foreground ml-auto">5 min ago</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-muted-foreground">Connection timeout resolved</span>
              <span className="text-muted-foreground ml-auto">12 min ago</span>
            </div>
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="flex items-center justify-between p-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          iconName="ExternalLink"
          iconPosition="left"
          iconSize={14}
        >
          View Details
        </Button>
        <Button
          variant="default"
          size="sm"
          iconName="Settings"
          iconPosition="left"
          iconSize={14}
        >
          Configure
        </Button>
      </div>
    </div>
  );
};

export default NodeDetailsPopup;