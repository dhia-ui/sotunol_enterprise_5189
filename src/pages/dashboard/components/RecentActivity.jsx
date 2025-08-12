import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentActivity = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    const iconMap = {
      transaction: 'Activity',
      system: 'Settings',
      alert: 'AlertTriangle',
      approval: 'CheckCircle',
      maintenance: 'Tool'
    };
    return iconMap?.[type] || 'Bell';
  };

  const getActivityColor = (status) => {
    const colorMap = {
      success: 'text-success',
      warning: 'text-warning',
      info: 'text-secondary',
      error: 'text-destructive'
    };
    return colorMap?.[status] || 'text-primary';
  };

  const getActivityBgColor = (status) => {
    const bgMap = {
      success: 'bg-success/10 border-success/20',
      warning: 'bg-warning/10 border-warning/20',
      info: 'bg-secondary/10 border-secondary/20',
      error: 'bg-destructive/10 border-destructive/20'
    };
    return bgMap?.[status] || 'bg-primary/10 border-primary/20';
  };

  const handleQuickAction = (activity) => {
    // In a real application, this would navigate to the relevant module
    console.log('Quick action for:', activity);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-synthwave">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={20} className="text-primary" />
            <h3 className="text-lg font-medium text-foreground">Recent Activity</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="ExternalLink"
            iconPosition="right"
            iconSize={16}
          >
            View All
          </Button>
        </div>
      </div>

      {/* Activity List */}
      <div className="p-6">
        {activities?.length > 0 ? (
          <div className="space-y-4">
            {activities?.map((activity) => (
              <div
                key={activity?.id}
                className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-synthwave ${getActivityBgColor(activity?.status)}`}
              >
                <div className="flex items-start space-x-4">
                  {/* Activity Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getActivityBgColor(activity?.status)}`}>
                    <Icon 
                      name={getActivityIcon(activity?.type)} 
                      size={20} 
                      className={getActivityColor(activity?.status)} 
                    />
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {activity?.title}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {activity?.time}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {activity?.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                        {activity?.module}
                      </span>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuickAction(activity)}
                        iconName="ArrowRight"
                        iconPosition="right"
                        iconSize={14}
                        className="text-xs"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recent activity to display</p>
          </div>
        )}
      </div>

      {/* Live Update Indicator */}
      <div className="px-6 pb-4">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span>Live updates enabled</span>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;