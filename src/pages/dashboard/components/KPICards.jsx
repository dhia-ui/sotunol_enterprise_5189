import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICards = ({ data = {} }) => {
  const kpiItems = [
    {
      title: 'Total Transactions',
      value: data?.totalTransactions?.toLocaleString() || '0',
      trend: data?.transactionsTrend || '+0.0%',
      icon: 'Activity',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      trendDirection: data?.transactionsTrend?.includes('+') ? 'up' : 'down'
    },
    {
      title: 'Active POS Locations',
      value: data?.activePOSLocations?.toString() || '0',
      trend: data?.posLocationsTrend || '+0.0%',
      icon: 'MapPin',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20',
      trendDirection: data?.posLocationsTrend?.includes('+') ? 'up' : 'down'
    },
    {
      title: 'Pending Documents',
      value: data?.pendingDocuments?.toString() || '0',
      trend: data?.pendingDocumentsTrend || '0.0%',
      icon: 'FileText',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      trendDirection: data?.pendingDocumentsTrend?.includes('+') ? 'up' : 'down'
    },
    {
      title: 'System Health',
      value: `${data?.systemHealth?.toFixed(1) || '0.0'}%`,
      trend: data?.systemHealthTrend || '+0.0%',
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      trendDirection: data?.systemHealthTrend?.includes('+') ? 'up' : 'down'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {kpiItems?.map((item, index) => (
        <div
          key={index}
          className={`bg-card border ${item?.borderColor} rounded-lg shadow-synthwave p-6 hover:shadow-synthwave-lg transition-all duration-300 hover-scale`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${item?.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={item?.icon} size={24} className={item?.color} />
            </div>
            
            <div className="flex items-center space-x-1">
              <Icon 
                name={item?.trendDirection === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className={item?.trendDirection === 'up' ? 'text-success' : 'text-destructive'} 
              />
              <span className={`text-sm font-medium ${
                item?.trendDirection === 'up' ? 'text-success' : 'text-destructive'
              }`}>
                {item?.trend}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {item?.value}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              {item?.title}
            </p>
          </div>

          {/* Real-time indicator */}
          <div className="flex items-center mt-4 pt-3 border-t border-border">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;