import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Process New Cheque',
      description: 'Upload and validate new cheque document',
      icon: 'CreditCard',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      action: () => navigate('/cheques-management')
    },
    {
      title: 'Create Invoice',
      description: 'Generate new invoice for client',
      icon: 'FileText',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20',
      action: () => navigate('/factures-management')
    },
    {
      title: 'Add POS Location',
      description: 'Register new point-of-sale location',
      icon: 'MapPin',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      action: () => navigate('/pos-management')
    },
    {
      title: 'AI Document Analysis',
      description: 'Advanced document processing with AI',
      icon: 'Brain',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      action: () => navigate('/ai-document-processing-playground')
    },
    {
      title: 'Export Data',
      description: 'Bulk export and reporting center',
      icon: 'Download',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
      action: () => navigate('/export-center')
    },
    {
      title: 'Network Visualization',
      description: '3D network analytics and insights',
      icon: 'Network',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20',
      action: () => navigate('/3d-network-visualization')
    }
  ];

  const frequentlyUsed = [
    { label: 'Cheque Validation', path: '/cheques-management', icon: 'CheckCircle', count: '24 today' },
    { label: 'Invoice Approval', path: '/factures-management', icon: 'FileCheck', count: '12 pending' },
    { label: 'POS Monitoring', path: '/pos-management', icon: 'MapPin', count: '127 active' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-synthwave">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={20} className="text-primary" />
          <h3 className="text-lg font-medium text-foreground">Quick Actions</h3>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {quickActions?.map((action, index) => (
            <button
              key={index}
              onClick={action?.action}
              className={`w-full p-4 border rounded-lg text-left transition-all duration-200 hover:shadow-synthwave hover-scale ${action?.borderColor} ${action?.bgColor}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action?.bgColor}`}>
                  <Icon name={action?.icon} size={18} className={action?.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {action?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {action?.description}
                  </p>
                </div>
                <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="Star" size={16} className="text-warning" />
            <span>Frequently Used</span>
          </h4>
          
          <div className="space-y-2">
            {frequentlyUsed?.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item?.path)}
                className="w-full flex items-center justify-between p-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-2">
                  <Icon name={item?.icon} size={14} />
                  <span>{item?.label}</span>
                </div>
                <span className="text-xs text-accent">{item?.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;