import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AdvancedFiltering = ({ selectedModules = [], filters = {}, onFiltersChange, onNext, onPrev }) => {
  const [recordCount, setRecordCount] = useState(0);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
    
    // Simulate record count update
    setTimeout(() => {
      const mockCount = Math.floor(Math.random() * 5000) + 100;
      setRecordCount(mockCount);
    }, 500);
  };

  const handleDateRangeChange = (type, value) => {
    const newDateRange = { ...filters?.dateRange, [type]: value };
    handleFilterChange('dateRange', newDateRange);
  };

  const clearFilters = () => {
    const clearedFilters = {
      dateRange: { from: '', to: '' },
      status: '',
      customFields: []
    };
    onFiltersChange(clearedFilters);
    setRecordCount(0);
  };

  const hasActiveFilters = () => {
    return filters?.dateRange?.from || filters?.dateRange?.to || filters?.status;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-synthwave p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">Apply Filters</h3>
            <p className="text-muted-foreground">
              Refine your data export with date ranges, status filters, and custom field selection
            </p>
          </div>
          
          {hasActiveFilters() && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              iconName="X"
              iconPosition="left"
              iconSize={16}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Selected Modules Summary */}
        <div className="bg-muted/30 border border-border rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Selected Modules</h4>
          <div className="flex flex-wrap gap-2">
            {selectedModules?.map((moduleId) => (
              <span
                key={moduleId}
                className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium"
              >
                {moduleId?.charAt(0)?.toUpperCase() + moduleId?.slice(1)}
              </span>
            ))}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Date Range Filters */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} className="text-primary" />
              <h4 className="text-sm font-medium text-foreground">Date Range</h4>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">From Date</label>
                <Input
                  type="date"
                  value={filters?.dateRange?.from || ''}
                  onChange={(e) => handleDateRangeChange('from', e?.target?.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">To Date</label>
                <Input
                  type="date"
                  value={filters?.dateRange?.to || ''}
                  onChange={(e) => handleDateRangeChange('to', e?.target?.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Status Filters */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Icon name="Filter" size={16} className="text-primary" />
              <h4 className="text-sm font-medium text-foreground">Status Filter</h4>
            </div>
            
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Record Status</label>
              <Select
                options={statusOptions}
                value={filters?.status || ''}
                onChange={(value) => handleFilterChange('status', value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Additional Filters by Module */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="Settings" size={16} className="text-primary" />
            <h4 className="text-sm font-medium text-foreground">Module-Specific Filters</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedModules?.includes('cheques') && (
              <div className="border border-border rounded-lg p-4">
                <h5 className="text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
                  <Icon name="CreditCard" size={14} />
                  <span>Cheques Filters</span>
                </h5>
                <div className="space-y-2">
                  <Select
                    options={[
                      { value: '', label: 'All Amounts' },
                      { value: '0-1000', label: '0 - 1,000 TND' },
                      { value: '1000-5000', label: '1,000 - 5,000 TND' },
                      { value: '5000+', label: '5,000+ TND' }
                    ]}
                    placeholder="Amount Range"
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {selectedModules?.includes('pos') && (
              <div className="border border-border rounded-lg p-4">
                <h5 className="text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
                  <Icon name="MapPin" size={14} />
                  <span>POS Filters</span>
                </h5>
                <div className="space-y-2">
                  <Select
                    options={[
                      { value: '', label: 'All Locations' },
                      { value: 'tunis', label: 'Tunis' },
                      { value: 'sfax', label: 'Sfax' },
                      { value: 'sousse', label: 'Sousse' }
                    ]}
                    placeholder="Location"
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {selectedModules?.includes('factures') && (
              <div className="border border-border rounded-lg p-4">
                <h5 className="text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
                  <Icon name="FileText" size={14} />
                  <span>Factures Filters</span>
                </h5>
                <div className="space-y-2">
                  <Select
                    options={[
                      { value: '', label: 'All Clients' },
                      { value: 'enterprise', label: 'Enterprise Clients' },
                      { value: 'individual', label: 'Individual Clients' }
                    ]}
                    placeholder="Client Type"
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Results Preview */}
        {hasActiveFilters() && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-sm font-medium text-foreground">Filter Applied</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-success">
                  {recordCount?.toLocaleString()}
                </span>
                <p className="text-xs text-muted-foreground">Records match criteria</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onPrev}
            iconName="ArrowLeft"
            iconPosition="left"
            iconSize={16}
          >
            Back to Modules
          </Button>
          
          <Button
            variant="default"
            onClick={onNext}
            iconName="ArrowRight"
            iconPosition="right"
            iconSize={16}
          >
            Continue to Export Config
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFiltering;