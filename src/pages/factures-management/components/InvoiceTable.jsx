import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const InvoiceTable = ({ 
  invoices = [], 
  onEdit = () => {}, 
  onDelete = () => {}, 
  onApprove = () => {}, 
  onReject = () => {}, 
  onGeneratePDF = () => {},
  currentUser = null
}) => {
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const statusColors = {
    draft: 'bg-warning/10 text-warning border-warning/20',
    approved: 'bg-success/10 text-success border-success/20',
    locked: 'bg-primary/10 text-primary border-primary/20',
    rejected: 'bg-destructive/10 text-destructive border-destructive/20'
  };

  const statusIcons = {
    draft: 'Edit',
    approved: 'CheckCircle',
    locked: 'Lock',
    rejected: 'XCircle'
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedInvoices(invoices?.map(invoice => invoice?.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (invoiceId, checked) => {
    if (checked) {
      setSelectedInvoices(prev => [...prev, invoiceId]);
    } else {
      setSelectedInvoices(prev => prev?.filter(id => id !== invoiceId));
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedInvoices = [...invoices]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'grandTotal') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const canApprove = (invoice) => {
    return currentUser?.role === 'manager' && invoice?.status === 'draft';
  };

  const canEdit = (invoice) => {
    return invoice?.status === 'draft';
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-GB');
  };

  const formatCurrency = (amount) => {
    return `${parseFloat(amount || 0)?.toFixed(2)} TND`;
  };

  const getApprovalStage = (invoice) => {
    const stages = ['draft', 'approved', 'locked'];
    const currentIndex = stages?.indexOf(invoice?.status);
    return { current: currentIndex + 1, total: stages?.length };
  };

  if (invoices?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-synthwave p-12 text-center">
        <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Invoices Found</h3>
        <p className="text-muted-foreground mb-6">
          Get started by creating your first invoice
        </p>
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          iconSize={16}
        >
          Create Invoice
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-synthwave overflow-hidden">
      {/* Table Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedInvoices?.length === invoices?.length}
                onChange={(e) => handleSelectAll(e?.target?.checked)}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-sm text-muted-foreground">
                {selectedInvoices?.length > 0 
                  ? `${selectedInvoices?.length} selected`
                  : `${invoices?.length} invoices`
                }
              </span>
            </div>
          </div>

          {selectedInvoices?.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                iconSize={14}
              >
                Export Selected
              </Button>
              <Button
                variant="destructive"
                size="sm"
                iconName="Trash2"
                iconPosition="left"
                iconSize={14}
              >
                Delete Selected
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/20">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={selectedInvoices?.length === invoices?.length}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('invoiceNumber')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Invoice #</span>
                  <Icon 
                    name={sortField === 'invoiceNumber' && sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('clientName')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Client</span>
                  <Icon 
                    name={sortField === 'clientName' && sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('grandTotal')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Amount</span>
                  <Icon 
                    name={sortField === 'grandTotal' && sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-foreground">Status</span>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-foreground">Approval</span>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Created</span>
                  <Icon 
                    name={sortField === 'createdAt' && sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-right p-4">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedInvoices?.map((invoice) => {
              const approvalStage = getApprovalStage(invoice);
              return (
                <tr key={invoice?.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedInvoices?.includes(invoice?.id)}
                      onChange={(e) => handleSelectInvoice(invoice?.id, e?.target?.checked)}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-foreground">{invoice?.invoiceNumber}</div>
                    <div className="text-sm text-muted-foreground">Due: {formatDate(invoice?.dueDate)}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-foreground">{invoice?.clientName}</div>
                    <div className="text-sm text-muted-foreground">{invoice?.clientEmail}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-foreground">{formatCurrency(invoice?.grandTotal)}</div>
                    <div className="text-sm text-muted-foreground">{invoice?.lineItems?.length || 0} items</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${statusColors?.[invoice?.status]}`}>
                      <Icon name={statusIcons?.[invoice?.status]} size={12} />
                      <span className="capitalize">{invoice?.status}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3]?.map((stage) => (
                          <div
                            key={stage}
                            className={`w-2 h-2 rounded-full ${
                              stage <= approvalStage?.current
                                ? 'bg-primary' :'bg-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {approvalStage?.current}/{approvalStage?.total}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-foreground">{formatDate(invoice?.createdAt)}</div>
                    <div className="text-xs text-muted-foreground">
                      {invoice?.updatedAt !== invoice?.createdAt && `Updated: ${formatDate(invoice?.updatedAt)}`}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onGeneratePDF(invoice)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Icon name="FileText" size={16} />
                      </Button>
                      
                      {canEdit(invoice) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(invoice)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Icon name="Edit" size={16} />
                        </Button>
                      )}
                      
                      {canApprove(invoice) && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onApprove(invoice)}
                            className="text-success hover:text-success hover:bg-success/10"
                          >
                            <Icon name="Check" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onReject(invoice)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Icon name="X" size={16} />
                          </Button>
                        </>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(invoice)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTable;