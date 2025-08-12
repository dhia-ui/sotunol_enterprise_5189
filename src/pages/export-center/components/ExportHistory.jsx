import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ExportHistory = ({ history = [], onReExport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'processing', label: 'Processing' },
    { value: 'failed', label: 'Failed' },
    { value: 'scheduled', label: 'Scheduled' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Sort by Date' },
    { value: 'name', label: 'Sort by Name' },
    { value: 'size', label: 'Sort by Size' },
    { value: 'status', label: 'Sort by Status' }
  ];

  const getStatusInfo = (status) => {
    const statusMap = {
      completed: {
        color: 'text-success',
        bgColor: 'bg-success/10',
        borderColor: 'border-success/20',
        icon: 'CheckCircle'
      },
      processing: {
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/20',
        icon: 'Loader2'
      },
      failed: {
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
        borderColor: 'border-destructive/20',
        icon: 'XCircle'
      },
      scheduled: {
        color: 'text-secondary',
        bgColor: 'bg-secondary/10',
        borderColor: 'border-secondary/20',
        icon: 'Calendar'
      }
    };
    return statusMap?.[status] || statusMap?.completed;
  };

  const getFormatIcon = (format) => {
    const iconMap = {
      csv: 'FileText',
      json: 'Code',
      excel: 'FileSpreadsheet',
      pdf: 'File'
    };
    return iconMap?.[format] || 'File';
  };

  const filteredHistory = history
    ?.filter(item => 
      item?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) &&
      (statusFilter === '' || item?.status === statusFilter)
    )
    ?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a?.name?.localeCompare(b?.name);
        case 'size':
          return parseFloat(b?.size) - parseFloat(a?.size);
        case 'status':
          return a?.status?.localeCompare(b?.status);
        case 'date':
        default:
          return new Date(b?.createdAt) - new Date(a?.createdAt);
      }
    });

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleString();
  };

  const handleDownload = (item) => {
    // In a real application, this would trigger the actual download
    console.log('Downloading:', item?.name);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete "${item?.name}"?`)) {
      console.log('Deleting:', item?.name);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg shadow-synthwave p-6">
        <h3 className="text-lg font-medium text-foreground mb-2">Export History</h3>
        <p className="text-muted-foreground">
          Track and manage your previous exports, downloads, and scheduled reports
        </p>
      </div>
      {/* Controls */}
      <div className="bg-card border border-border rounded-lg shadow-synthwave p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search exports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-40"
            />
            
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              className="w-44"
            />
          </div>
        </div>
      </div>
      {/* Export Items */}
      <div className="space-y-4">
        {filteredHistory?.length > 0 ? (
          filteredHistory?.map((item) => {
            const statusInfo = getStatusInfo(item?.status);
            
            return (
              <div
                key={item?.id}
                className={`bg-card border ${statusInfo?.borderColor} rounded-lg shadow-synthwave p-6 hover:shadow-synthwave-lg transition-all duration-200`}
              >
                <div className="flex items-start justify-between space-x-4">
                  {/* Export Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon name={getFormatIcon(item?.format)} size={20} className="text-primary" />
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {item?.name}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo?.color} ${statusInfo?.bgColor}`}>
                        <Icon name={statusInfo?.icon} size={12} className={`inline mr-1 ${item?.status === 'processing' ? 'animate-spin' : ''}`} />
                        {item?.status?.charAt(0)?.toUpperCase() + item?.status?.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-muted-foreground">
                      <div>
                        <span className="block text-foreground font-medium">Modules:</span>
                        {item?.modules?.map(module => module?.charAt(0)?.toUpperCase() + module?.slice(1))?.join(', ')}
                      </div>
                      
                      <div>
                        <span className="block text-foreground font-medium">Size:</span>
                        {item?.size}
                      </div>
                      
                      <div>
                        <span className="block text-foreground font-medium">Records:</span>
                        {item?.records?.toLocaleString()}
                      </div>
                      
                      <div>
                        <span className="block text-foreground font-medium">Created:</span>
                        {formatDate(item?.createdAt)}
                      </div>
                    </div>

                    {/* Progress bar for processing items */}
                    {item?.status === 'processing' && item?.progress && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Processing...</span>
                          <span className="text-foreground">{item?.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-warning h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item?.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Error message for failed items */}
                    {item?.status === 'failed' && item?.error && (
                      <div className="mt-3 bg-destructive/10 border border-destructive/20 rounded p-2">
                        <span className="text-xs text-destructive font-medium">Error: {item?.error}</span>
                      </div>
                    )}

                    {/* Expiry info for completed items */}
                    {item?.status === 'completed' && item?.expiresAt && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        <Icon name="Clock" size={12} className="inline mr-1" />
                        Expires: {formatDate(item?.expiresAt)}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {item?.status === 'completed' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleDownload(item)}
                        iconName="Download"
                        iconPosition="left"
                        iconSize={14}
                      >
                        Download
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReExport(item)}
                      iconName="RotateCcw"
                      iconPosition="left"
                      iconSize={14}
                    >
                      Re-export
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item)}
                      iconName="Trash2"
                      iconSize={14}
                      className="text-destructive hover:text-destructive"
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-card border border-border rounded-lg shadow-synthwave p-12 text-center">
            <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Export History</h3>
            <p className="text-muted-foreground mb-4">
              You haven't created any exports yet. Use the Step-by-Step Wizard to create your first export.
            </p>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
              onClick={() => window.location.href = '?view=wizard'}
            >
              Create First Export
            </Button>
          </div>
        )}
      </div>
      {/* Summary Statistics */}
      {filteredHistory?.length > 0 && (
        <div className="bg-card border border-border rounded-lg shadow-synthwave p-6">
          <h4 className="text-sm font-medium text-foreground mb-4">Export Statistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {history?.filter(item => item?.status === 'completed')?.length}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                {history?.filter(item => item?.status === 'processing')?.length}
              </div>
              <div className="text-xs text-muted-foreground">Processing</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">
                {history?.filter(item => item?.status === 'failed')?.length}
              </div>
              <div className="text-xs text-muted-foreground">Failed</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {history?.reduce((sum, item) => sum + (item?.records || 0), 0)?.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total Records</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportHistory;