import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemHealth = ({ data = {} }) => {
  const getStatusColor = (status) => {
    const colors = {
      operational: 'text-success',
      warning: 'text-warning',
      error: 'text-destructive',
      excellent: 'text-success',
      good: 'text-secondary',
      stable: 'text-success'
    };
    return colors?.[status] || 'text-muted-foreground';
  };

  const getStatusBgColor = (status) => {
    const bgColors = {
      operational: 'bg-success/10 border-success/20',
      warning: 'bg-warning/10 border-warning/20',
      error: 'bg-destructive/10 border-destructive/20',
      excellent: 'bg-success/10 border-success/20',
      good: 'bg-secondary/10 border-secondary/20',
      stable: 'bg-success/10 border-success/20'
    };
    return bgColors?.[status] || 'bg-muted/10 border-border';
  };

  const healthMetrics = [
    {
      label: 'Server Status',
      value: data?.serverStatus || 'unknown',
      icon: 'Server',
      detail: `Uptime: ${data?.serverUptime || 'N/A'}`
    },
    {
      label: 'Database Performance',
      value: data?.databasePerformance || 'unknown',
      icon: 'Database',
      detail: `Response: ${data?.databaseResponseTime || 'N/A'}`
    },
    {
      label: 'Integration Connectivity',
      value: data?.integrationConnectivity || 'unknown',
      icon: 'Wifi',
      detail: `Errors: ${data?.integrationErrors || 0}`
    }
  ];

  const resourceUsage = [
    {
      label: 'Storage Usage',
      value: data?.storageUsage || 0,
      max: 100,
      unit: '%',
      icon: 'HardDrive',
      color: data?.storageUsage > 80 ? 'warning' : 'success'
    },
    {
      label: 'Memory Usage',
      value: data?.memoryUsage || 0,
      max: 100,
      unit: '%',
      icon: 'Cpu',
      color: data?.memoryUsage > 90 ? 'warning' : 'success'
    },
    {
      label: 'CPU Usage',
      value: data?.cpuUsage || 0,
      max: 100,
      unit: '%',
      icon: 'Activity',
      color: data?.cpuUsage > 85 ? 'warning' : 'success'
    }
  ];

  const getUsageColor = (color) => {
    const colors = {
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-destructive'
    };
    return colors?.[color] || 'bg-primary';
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-synthwave">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={20} className="text-primary" />
            <h3 className="text-lg font-medium text-foreground">System Health</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-success">Monitoring</span>
          </div>
        </div>
      </div>

      {/* Health Status */}
      <div className="p-6 space-y-4">
        {/* Service Status */}
        <div className="space-y-3">
          {healthMetrics?.map((metric, index) => (
            <div
              key={index}
              className={`border rounded-lg p-3 ${getStatusBgColor(metric?.value)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={metric?.icon} 
                    size={16} 
                    className={getStatusColor(metric?.value)} 
                  />
                  <div>
                    <h4 className="text-sm font-medium text-foreground">
                      {metric?.label}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {metric?.detail}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${getStatusColor(metric?.value)}`}>
                    {metric?.value?.charAt(0)?.toUpperCase() + metric?.value?.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resource Usage */}
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="BarChart3" size={16} />
            <span>Resource Usage</span>
          </h4>
          
          <div className="space-y-3">
            {resourceUsage?.map((resource, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name={resource?.icon} size={14} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {resource?.label}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {resource?.value?.toFixed(1)}{resource?.unit}
                  </span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(resource?.color)}`}
                    style={{ width: `${resource?.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Health Score */}
        <div className="border-t border-border pt-4">
          <div className="bg-success/10 border border-success/20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-sm font-medium text-foreground">Overall Health</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-success">
                  {((data?.systemHealth || 0))?.toFixed(1)}%
                </span>
                <p className="text-xs text-muted-foreground">Excellent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;