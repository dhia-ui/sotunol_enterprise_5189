import React from 'react';
import Icon from '../../../components/AppIcon';

const NetworkStats = ({ networkData, selectedFilters }) => {
  // Calculate statistics from network data
  const stats = {
    totalNodes: networkData?.nodes?.length || 0,
    activeNodes: networkData?.nodes?.filter(n => n?.status === 'active')?.length || 0,
    totalConnections: networkData?.connections?.length || 0,
    avgPerformance: networkData?.nodes?.reduce((acc, n) => acc + n?.performance, 0) / (networkData?.nodes?.length || 1) || 0,
    totalTransactions: networkData?.nodes?.reduce((acc, n) => acc + n?.transactions, 0) || 0,
    issueNodes: networkData?.nodes?.filter(n => n?.status === 'issues')?.length || 0
  };

  const statCards = [
    {
      label: 'Total Nodes',
      value: stats?.totalNodes,
      icon: 'Circle',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+2 this week'
    },
    {
      label: 'Active Nodes',
      value: stats?.activeNodes,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: `${((stats?.activeNodes / stats?.totalNodes) * 100)?.toFixed(1)}% uptime`
    },
    {
      label: 'Connections',
      value: stats?.totalConnections,
      icon: 'Network',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      change: 'Strong network'
    },
    {
      label: 'Avg Performance',
      value: `${stats?.avgPerformance?.toFixed(1)}%`,
      icon: 'TrendingUp',
      color: stats?.avgPerformance >= 90 ? 'text-success' : stats?.avgPerformance >= 70 ? 'text-warning' : 'text-destructive',
      bgColor: stats?.avgPerformance >= 90 ? 'bg-success/10' : stats?.avgPerformance >= 70 ? 'bg-warning/10' : 'bg-destructive/10',
      change: stats?.avgPerformance >= 90 ? 'Excellent' : stats?.avgPerformance >= 70 ? 'Good' : 'Needs attention'
    },
    {
      label: 'Total Transactions',
      value: stats?.totalTransactions?.toLocaleString(),
      icon: 'Activity',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      change: '+12.5% vs last month'
    },
    {
      label: 'Issues Detected',
      value: stats?.issueNodes,
      icon: 'AlertTriangle',
      color: stats?.issueNodes > 0 ? 'text-destructive' : 'text-success',
      bgColor: stats?.issueNodes > 0 ? 'bg-destructive/10' : 'bg-success/10',
      change: stats?.issueNodes > 0 ? 'Requires attention' : 'All systems OK'
    }
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 lg:left-96 z-30 bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-synthwave-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Network Statistics</h3>
        </div>
        <div className="text-xs text-muted-foreground">
          Real-time • Updated {new Date()?.toLocaleTimeString()}
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards?.map((stat, index) => (
          <div
            key={index}
            className="relative p-3 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 group"
          >
            {/* Background Pattern */}
            <div className={`absolute inset-0 ${stat?.bgColor} rounded-lg opacity-50`}></div>
            
            {/* Content */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <Icon 
                  name={stat?.icon} 
                  size={16} 
                  className={`${stat?.color} group-hover:scale-110 transition-transform duration-200`} 
                />
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-foreground">{stat?.value}</div>
                <div className="text-xs font-medium text-muted-foreground">{stat?.label}</div>
                <div className="text-xs text-muted-foreground opacity-75">{stat?.change}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Applied Filters */}
      {selectedFilters && Object.keys(selectedFilters)?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Filter" size={14} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Active Filters</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters)?.map(([key, value]) => {
              if (value && value !== 'all') {
                return (
                  <span
                    key={key}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
                  >
                    {key}: {value}
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
      {/* Network Health Indicator */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Wifi" size={16} className="text-success" />
            <span className="text-sm font-medium text-foreground">Network Health</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-4 bg-success rounded-sm"></div>
              <div className="w-2 h-4 bg-success rounded-sm"></div>
              <div className="w-2 h-4 bg-success rounded-sm"></div>
              <div className="w-2 h-4 bg-success rounded-sm"></div>
              <div className="w-2 h-4 bg-muted rounded-sm"></div>
            </div>
            <span className="text-sm font-medium text-success">Excellent</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkStats;