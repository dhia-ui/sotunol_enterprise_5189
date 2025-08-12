import React from 'react';
import Icon from '../../../components/AppIcon';

const InvoiceStats = ({ invoices = [] }) => {
  const calculateStats = () => {
    const stats = {
      total: invoices?.length,
      draft: 0,
      approved: 0,
      locked: 0,
      rejected: 0,
      totalRevenue: 0,
      avgInvoiceValue: 0,
      overdueCount: 0
    };

    const today = new Date();
    
    invoices?.forEach(invoice => {
      // Count by status
      stats[invoice.status] = (stats?.[invoice?.status] || 0) + 1;
      
      // Calculate revenue (only from approved and locked invoices)
      if (invoice?.status === 'approved' || invoice?.status === 'locked') {
        stats.totalRevenue += parseFloat(invoice?.grandTotal || 0);
      }
      
      // Count overdue invoices
      const dueDate = new Date(invoice.dueDate);
      if (dueDate < today && invoice?.status !== 'locked') {
        stats.overdueCount++;
      }
    });

    // Calculate average invoice value
    const revenueInvoices = stats?.approved + stats?.locked;
    stats.avgInvoiceValue = revenueInvoices > 0 ? stats?.totalRevenue / revenueInvoices : 0;

    return stats;
  };

  const stats = calculateStats();

  const statCards = [
    {
      title: 'Total Invoices',
      value: stats?.total,
      icon: 'FileText',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      change: null
    },
    {
      title: 'Total Revenue',
      value: `${stats?.totalRevenue?.toFixed(2)} TND`,
      icon: 'DollarSign',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      change: null
    },
    {
      title: 'Average Value',
      value: `${stats?.avgInvoiceValue?.toFixed(2)} TND`,
      icon: 'TrendingUp',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20',
      change: null
    },
    {
      title: 'Overdue',
      value: stats?.overdueCount,
      icon: 'AlertTriangle',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      change: null
    }
  ];

  const statusCards = [
    {
      title: 'Draft',
      value: stats?.draft,
      icon: 'Edit',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      percentage: stats?.total > 0 ? ((stats?.draft / stats?.total) * 100)?.toFixed(1) : 0
    },
    {
      title: 'Approved',
      value: stats?.approved,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      percentage: stats?.total > 0 ? ((stats?.approved / stats?.total) * 100)?.toFixed(1) : 0
    },
    {
      title: 'Locked',
      value: stats?.locked,
      icon: 'Lock',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      percentage: stats?.total > 0 ? ((stats?.locked / stats?.total) * 100)?.toFixed(1) : 0
    },
    {
      title: 'Rejected',
      value: stats?.rejected,
      icon: 'XCircle',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/20',
      percentage: stats?.total > 0 ? ((stats?.rejected / stats?.total) * 100)?.toFixed(1) : 0
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards?.map((stat, index) => (
          <div
            key={index}
            className={`bg-card border ${stat?.borderColor} rounded-lg shadow-synthwave p-6 ${stat?.bgColor}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat?.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat?.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat?.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon name={stat?.icon} size={24} className={stat?.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Status Breakdown */}
      <div className="bg-card border border-border rounded-lg shadow-synthwave p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="PieChart" size={20} className="text-primary" />
          <h3 className="text-lg font-medium text-foreground">Status Breakdown</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusCards?.map((status, index) => (
            <div
              key={index}
              className={`border ${status?.borderColor} rounded-lg p-4 ${status?.bgColor}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Icon name={status?.icon} size={16} className={status?.color} />
                  <span className="text-sm font-medium text-foreground">
                    {status?.title}
                  </span>
                </div>
                <span className="text-lg font-bold text-foreground">
                  {status?.value}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {status?.percentage}% of total
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      status?.color?.includes('warning') ? 'bg-warning' :
                      status?.color?.includes('success') ? 'bg-success' :
                      status?.color?.includes('primary') ? 'bg-primary' :
                      'bg-destructive'
                    }`}
                    style={{ width: `${status?.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Insights */}
      <div className="bg-card border border-border rounded-lg shadow-synthwave p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Lightbulb" size={20} className="text-primary" />
          <h3 className="text-lg font-medium text-foreground">Quick Insights</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon name="Clock" size={16} className="text-warning" />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {stats?.overdueCount} Overdue Invoices
                </div>
                <div className="text-xs text-muted-foreground">
                  Require immediate attention
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon name="Edit" size={16} className="text-warning" />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {stats?.draft} Draft Invoices
                </div>
                <div className="text-xs text-muted-foreground">
                  Ready for review and approval
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {((stats?.approved + stats?.locked) / stats?.total * 100)?.toFixed(1)}% Completion Rate
                </div>
                <div className="text-xs text-muted-foreground">
                  Approved and locked invoices
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon name="TrendingUp" size={16} className="text-secondary" />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {stats?.avgInvoiceValue?.toFixed(0)} TND Average
                </div>
                <div className="text-xs text-muted-foreground">
                  Per approved invoice
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceStats;