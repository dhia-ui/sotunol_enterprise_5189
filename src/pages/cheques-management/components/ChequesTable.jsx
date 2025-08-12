import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ChequesTable = ({ 
  cheques = [], 
  selectedCheques = [], 
  onSelectCheque, 
  onSelectAll, 
  onSort, 
  sortConfig,
  onEdit,
  onView,
  onGenerateQR,
  onDelete,
  currentPage,
  itemsPerPage
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-warning text-warning-foreground', icon: 'Clock' },
      approved: { color: 'bg-success text-success-foreground', icon: 'CheckCircle' },
      rejected: { color: 'bg-destructive text-destructive-foreground', icon: 'XCircle' },
      processed: { color: 'bg-primary text-primary-foreground', icon: 'Check' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 3
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleSort = (column) => {
    const direction = sortConfig?.column === column && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
    onSort({ column, direction });
  };

  const getSortIcon = (column) => {
    if (sortConfig?.column !== column) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const isAllSelected = cheques?.length > 0 && selectedCheques?.length === cheques?.length;
  const isIndeterminate = selectedCheques?.length > 0 && selectedCheques?.length < cheques?.length;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="w-12 p-4">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={onSelectAll}
                />
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('chequeNumber')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Cheque Number</span>
                  <Icon name={getSortIcon('chequeNumber')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('partnerName')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Partner</span>
                  <Icon name={getSortIcon('partnerName')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Amount</span>
                  <Icon name={getSortIcon('amount')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('issueDate')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Issue Date</span>
                  <Icon name={getSortIcon('issueDate')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Status</span>
                  <Icon name={getSortIcon('status')} size={14} />
                </button>
              </th>
              <th className="text-center p-4 w-32">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {cheques?.map((cheque, index) => (
              <tr
                key={cheque?.id}
                className={`border-b border-border hover:bg-muted/20 transition-colors ${
                  selectedCheques?.includes(cheque?.id) ? 'bg-primary/5' : ''
                }`}
                onMouseEnter={() => setHoveredRow(cheque?.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="p-4">
                  <Checkbox
                    checked={selectedCheques?.includes(cheque?.id)}
                    onChange={() => onSelectCheque(cheque?.id)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-medium text-foreground">
                      {cheque?.chequeNumber}
                    </span>
                    {cheque?.hasQR && (
                      <Icon name="QrCode" size={14} className="text-primary" />
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-medium text-foreground">{cheque?.partnerName}</div>
                    <div className="text-sm text-muted-foreground">{cheque?.partnerCode}</div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-medium text-foreground">
                    {formatAmount(cheque?.amount)}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">
                    {formatDate(cheque?.issueDate)}
                  </span>
                </td>
                <td className="p-4">
                  {getStatusBadge(cheque?.status)}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(cheque)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(cheque)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onGenerateQR(cheque)}
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                    >
                      <Icon name="QrCode" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(cheque)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-4 p-4">
        {cheques?.map((cheque) => (
          <div
            key={cheque?.id}
            className={`border border-border rounded-lg p-4 transition-all duration-200 ${
              selectedCheques?.includes(cheque?.id) 
                ? 'border-primary bg-primary/5' :'hover:border-primary/50'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedCheques?.includes(cheque?.id)}
                  onChange={() => onSelectCheque(cheque?.id)}
                />
                <div>
                  <div className="font-mono text-sm font-medium text-foreground">
                    {cheque?.chequeNumber}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(cheque?.issueDate)}
                  </div>
                </div>
              </div>
              {getStatusBadge(cheque?.status)}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Partner:</span>
                <span className="text-sm font-medium text-foreground">{cheque?.partnerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="text-sm font-medium text-foreground">
                  {formatAmount(cheque?.amount)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(cheque)}
                iconName="Eye"
                iconPosition="left"
              >
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(cheque)}
                iconName="Edit"
                iconPosition="left"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onGenerateQR(cheque)}
                iconName="QrCode"
                iconPosition="left"
              >
                QR
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {cheques?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No cheques found</h3>
          <p className="text-muted-foreground mb-4">
            No cheques match your current search criteria.
          </p>
          <Button variant="outline" onClick={() => window.location?.reload()}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChequesTable;