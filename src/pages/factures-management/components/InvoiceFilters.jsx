import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const InvoiceFilters = ({ 
  filters = {}, 
  onFilterChange = () => {}, 
  onClearFilters = () => {},
  totalCount = 0,
  filteredCount = 0
}) => {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'approved', label: 'Approved' },
    { value: 'locked', label: 'Locked' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const amountRangeOptions = [
    { value: '', label: 'Any Amount' },
    { value: '0-1000', label: '0 - 1,000 TND' },
    { value: '1000-5000', label: '1,000 - 5,000 TND' },
    { value: '5000-10000', label: '5,000 - 10,000 TND' },
    { value: '10000+', label: '10,000+ TND' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'Any Date' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value && value !== '');

  return (
    <div className="bg-card border border-border rounded-lg shadow-synthwave p-6 space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="text-lg font-medium text-foreground">Filter Invoices</h3>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredCount} of {totalCount} invoices
          </div>
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              iconSize={14}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Input
            label="Search"
            placeholder="Search by invoice number, client name, or email..."
            value={filters?.search || ''}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status || ''}
          onChange={(value) => handleFilterChange('status', value)}
          placeholder="Filter by status"
        />

        {/* Amount Range */}
        <Select
          label="Amount Range"
          options={amountRangeOptions}
          value={filters?.amountRange || ''}
          onChange={(value) => handleFilterChange('amountRange', value)}
          placeholder="Filter by amount"
        />
      </div>
      {/* Date Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={filters?.dateRange || ''}
          onChange={(value) => handleFilterChange('dateRange', value)}
          placeholder="Filter by date"
        />

        <Input
          label="From Date"
          type="date"
          value={filters?.fromDate || ''}
          onChange={(e) => handleFilterChange('fromDate', e?.target?.value)}
        />

        <Input
          label="To Date"
          type="date"
          value={filters?.toDate || ''}
          onChange={(e) => handleFilterChange('toDate', e?.target?.value)}
        />
      </div>
      {/* Advanced Filters */}
      <div className="border-t border-border pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Client Name"
            placeholder="Filter by specific client"
            value={filters?.clientName || ''}
            onChange={(e) => handleFilterChange('clientName', e?.target?.value)}
          />

          <Input
            label="Minimum Amount (TND)"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={filters?.minAmount || ''}
            onChange={(e) => handleFilterChange('minAmount', e?.target?.value)}
          />

          <Input
            label="Maximum Amount (TND)"
            type="number"
            min="0"
            step="0.01"
            placeholder="999999.99"
            value={filters?.maxAmount || ''}
            onChange={(e) => handleFilterChange('maxAmount', e?.target?.value)}
          />
        </div>
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="border-t border-border pt-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="Tag" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Active Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters)?.map(([key, value]) => {
              if (!value || value === '') return null;
              
              let displayValue = value;
              if (key === 'status') {
                displayValue = statusOptions?.find(opt => opt?.value === value)?.label || value;
              } else if (key === 'amountRange') {
                displayValue = amountRangeOptions?.find(opt => opt?.value === value)?.label || value;
              } else if (key === 'dateRange') {
                displayValue = dateRangeOptions?.find(opt => opt?.value === value)?.label || value;
              }

              return (
                <div
                  key={key}
                  className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm border border-primary/20"
                >
                  <span className="capitalize">{key?.replace(/([A-Z])/g, ' $1')?.trim()}: {displayValue}</span>
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceFilters;