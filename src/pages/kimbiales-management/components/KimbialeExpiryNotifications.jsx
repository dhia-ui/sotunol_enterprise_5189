import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const KimbialeExpiryNotifications = ({ kimbiales = [] }) => {
  const [notifications, setNotifications] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    checkExpiryNotifications();
  }, [kimbiales]);

  const checkExpiryNotifications = () => {
    const today = new Date();
    const warningThresholds = {
      critical: 7, // 7 days
      warning: 30, // 30 days
      info: 90 // 90 days
    };

    const expiryNotifications = kimbiales?.filter(kimbiale => kimbiale?.expiryDate && kimbiale?.status !== 'Expired')?.map(kimbiale => {
        const expiryDate = new Date(kimbiale.expiryDate);
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        let severity = 'info';
        let message = '';
        let icon = 'Info';
        let color = 'text-info';

        if (daysUntilExpiry < 0) {
          severity = 'expired';
          message = `Expired ${Math.abs(daysUntilExpiry)} days ago`;
          icon = 'AlertTriangle';
          color = 'text-destructive';
        } else if (daysUntilExpiry <= warningThresholds?.critical) {
          severity = 'critical';
          message = `Expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`;
          icon = 'AlertTriangle';
          color = 'text-destructive';
        } else if (daysUntilExpiry <= warningThresholds?.warning) {
          severity = 'warning';
          message = `Expires in ${daysUntilExpiry} days`;
          icon = 'AlertCircle';
          color = 'text-warning';
        } else if (daysUntilExpiry <= warningThresholds?.info) {
          severity = 'info';
          message = `Expires in ${daysUntilExpiry} days`;
          icon = 'Clock';
          color = 'text-info';
        }

        return {
          id: kimbiale?.id,
          kimbialeNumber: kimbiale?.kimbialeNumber,
          partner: kimbiale?.partner,
          amount: kimbiale?.amount,
          expiryDate: kimbiale?.expiryDate,
          daysUntilExpiry,
          severity,
          message,
          icon,
          color
        };
      })?.filter(notification => notification?.daysUntilExpiry <= 90)?.sort((a, b) => a?.daysUntilExpiry - b?.daysUntilExpiry);

    setNotifications(expiryNotifications);
  };

  const getSeverityStats = () => {
    const stats = {
      expired: notifications?.filter(n => n?.severity === 'expired')?.length,
      critical: notifications?.filter(n => n?.severity === 'critical')?.length,
      warning: notifications?.filter(n => n?.severity === 'warning')?.length,
      info: notifications?.filter(n => n?.severity === 'info')?.length
    };
    return stats;
  };

  const handleMarkAsHandled = (notificationId) => {
    // In a real app, this would update the backend
    setNotifications(prev => prev?.filter(n => n?.id !== notificationId));
  };

  const handleSendReminder = (notification) => {
    // Mock email reminder functionality
    console.log(`Sending reminder for Kimbiale ${notification?.kimbialeNumber}`);
    // Show success message or handle API call
  };

  if (notifications?.length === 0) {
    return (
      <div className="bg-success/10 border border-success/20 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircle" size={20} className="text-success" />
          <div>
            <h3 className="font-medium text-success">All Clear</h3>
            <p className="text-sm text-success/80">No kimbiales require immediate attention</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = getSeverityStats();

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={20} className="text-warning" />
            <h3 className="font-semibold text-foreground">Expiry Notifications</h3>
            <span className="px-2 py-1 bg-warning/20 text-warning text-xs rounded-full font-medium">
              {notifications?.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {stats?.expired > 0 && (
            <div className="flex items-center space-x-2 p-2 bg-destructive/10 rounded-lg">
              <Icon name="AlertTriangle" size={16} className="text-destructive" />
              <div>
                <div className="text-sm font-medium text-destructive">{stats?.expired}</div>
                <div className="text-xs text-destructive/80">Expired</div>
              </div>
            </div>
          )}
          {stats?.critical > 0 && (
            <div className="flex items-center space-x-2 p-2 bg-destructive/10 rounded-lg">
              <Icon name="AlertCircle" size={16} className="text-destructive" />
              <div>
                <div className="text-sm font-medium text-destructive">{stats?.critical}</div>
                <div className="text-xs text-destructive/80">Critical</div>
              </div>
            </div>
          )}
          {stats?.warning > 0 && (
            <div className="flex items-center space-x-2 p-2 bg-warning/10 rounded-lg">
              <Icon name="Clock" size={16} className="text-warning" />
              <div>
                <div className="text-sm font-medium text-warning">{stats?.warning}</div>
                <div className="text-xs text-warning/80">Warning</div>
              </div>
            </div>
          )}
          {stats?.info > 0 && (
            <div className="flex items-center space-x-2 p-2 bg-info/10 rounded-lg">
              <Icon name="Info" size={16} className="text-info" />
              <div>
                <div className="text-sm font-medium text-info">{stats?.info}</div>
                <div className="text-xs text-info/80">Upcoming</div>
              </div>
            </div>
          )}
        </div>

        {/* Notification List */}
        {isExpanded && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notifications?.map((notification) => (
              <div
                key={notification?.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  notification?.severity === 'expired' || notification?.severity === 'critical'
                    ? 'bg-destructive/5 border-destructive/20'
                    : notification?.severity === 'warning' ?'bg-warning/5 border-warning/20' :'bg-info/5 border-info/20'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={notification?.icon} 
                    size={16} 
                    className={notification?.color} 
                  />
                  <div>
                    <div className="font-medium text-foreground">
                      {notification?.kimbialeNumber}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {notification?.partner} • {new Intl.NumberFormat('fr-TN', {
                        style: 'currency',
                        currency: 'TND'
                      })?.format(notification?.amount)}
                    </div>
                    <div className={`text-xs ${notification?.color}`}>
                      {notification?.message}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSendReminder(notification)}
                    iconName="Mail"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Remind
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsHandled(notification?.id)}
                    iconName="Check"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Mark Handled
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KimbialeExpiryNotifications;