import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ChequesToolbar = ({ 
  onAddCheque, 
  onSearch, 
  onBulkAction, 
  selectedCount = 0,
  isAdvancedSearchOpen,
  onToggleAdvancedSearch,
  searchFilters,
  onFilterChange
}) => {
  const [quickSearch, setQuickSearch] = useState('');

  const bulkActionOptions = [
    { value: 'export', label: 'Export Selected' },
    { value: 'approve', label: 'Mark as Approved' },
    { value: 'pending', label: 'Mark as Pending' },
    { value: 'reject', label: 'Mark as Rejected' },
    { value: 'trash', label: 'Move to Trash' }
  ];

  const handleQuickSearch = (e) => {
    const value = e?.target?.value;
    setQuickSearch(value);
    onSearch(value);
  };

  const handleBulkActionChange = (action) => {
    if (action && selectedCount > 0) {
      onBulkAction(action);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      {/* Main Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="default"
            onClick={onAddCheque}
            iconName="Plus"
            iconPosition="left"
            className="shrink-0"
          >
            Add Cheque
          </Button>
          
          <Button
            variant="outline"
            onClick={onToggleAdvancedSearch}
            iconName={isAdvancedSearchOpen ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            className="shrink-0"
          >
            Advanced Search
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Quick Search */}
          <div className="relative">
            <Input
              type="search"
              placeholder="Search cheques..."
              value={quickSearch}
              onChange={handleQuickSearch}
              className="w-full sm:w-80 pl-10"
            />
            <Icon 
              name="Search" 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
          </div>

          {/* Bulk Actions */}
          {selectedCount > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {selectedCount} selected
              </span>
              <Select
                placeholder="Bulk Actions"
                options={bulkActionOptions}
                value=""
                onChange={handleBulkActionChange}
                className="w-40"
              />
            </div>
          )}
        </div>
      </div>
      {/* Advanced Search Panel */}
      {isAdvancedSearchOpen && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Cheque Number"
              type="text"
              placeholder="Enter cheque number"
              value={searchFilters?.chequeNumber || ''}
              onChange={(e) => onFilterChange('chequeNumber', e?.target?.value)}
            />
            
            <Input
              label="Partner Name"
              type="text"
              placeholder="Enter partner name"
              value={searchFilters?.partnerName || ''}
              onChange={(e) => onFilterChange('partnerName', e?.target?.value)}
            />
            
            <Input
              label="Date From"
              type="date"
              value={searchFilters?.dateFrom || ''}
              onChange={(e) => onFilterChange('dateFrom', e?.target?.value)}
            />
            
            <Input
              label="Date To"
              type="date"
              value={searchFilters?.dateTo || ''}
              onChange={(e) => onFilterChange('dateTo', e?.target?.value)}
            />
            
            <Input
              label="Min Amount (TND)"
              type="number"
              placeholder="0.00"
              value={searchFilters?.minAmount || ''}
              onChange={(e) => onFilterChange('minAmount', e?.target?.value)}
            />
            
            <Input
              label="Max Amount (TND)"
              type="number"
              placeholder="0.00"
              value={searchFilters?.maxAmount || ''}
              onChange={(e) => onFilterChange('maxAmount', e?.target?.value)}
            />
            
            <Select
              label="Status"
              placeholder="All Statuses"
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
                { value: 'processed', label: 'Processed' }
              ]}
              value={searchFilters?.status || ''}
              onChange={(value) => onFilterChange('status', value)}
            />
            
            <div className="flex items-end space-x-2">
              <Button
                variant="outline"
                onClick={() => onFilterChange('reset')}
                iconName="RotateCcw"
                iconPosition="left"
                className="flex-1"
              >
                Reset
              </Button>
              <Button
                variant="default"
                onClick={() => onSearch(searchFilters)}
                iconName="Search"
                iconPosition="left"
                className="flex-1"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChequesToolbar;