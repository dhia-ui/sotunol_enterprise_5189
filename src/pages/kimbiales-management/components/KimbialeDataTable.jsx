import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const KimbialeDataTable = ({ 
  kimbiales = [], 
  onEdit, 
  onDelete, 
  onView,
  loading = false 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState('issueDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [bankFilter, setBankFilter] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const pageSizeOptions = [
    { value: 25, label: '25 per page' },
    { value: 50, label: '50 per page' },
    { value: 100, label: '100 per page' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'Active', label: 'Active' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Expired', label: 'Expired' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  const bankOptions = useMemo(() => {
    const banks = [...new Set(kimbiales.map(k => k.bank).filter(Boolean))];
    return [
      { value: '', label: 'All Banks' },
      ...banks?.map(bank => ({ value: bank, label: bank }))
    ];
  }, [kimbiales]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = kimbiales?.filter(kimbiale => {
      const matchesSearch = !searchTerm || 
        kimbiale?.kimbialeNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        kimbiale?.partner?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        kimbiale?.bank?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      
      const matchesStatus = !statusFilter || kimbiale?.status === statusFilter;
      const matchesBank = !bankFilter || kimbiale?.bank === bankFilter;

      return matchesSearch && matchesStatus && matchesBank;
    });

    // Sort data
    filtered?.sort((a, b) => {
      let aValue = a?.[sortField];
      let bValue = b?.[sortField];

      if (sortField === 'amount') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortField === 'issueDate' || sortField === 'expiryDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = String(aValue)?.toLowerCase();
        bValue = String(bValue)?.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [kimbiales, searchTerm, statusFilter, bankFilter, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedData?.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedData?.length / pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(paginatedData?.map(item => item?.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev?.filter(itemId => itemId !== id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-success bg-success/10 border-success/20';
      case 'Pending': return 'text-warning bg-warning/10 border-warning/20';
      case 'Expired': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'Cancelled': return 'text-muted-foreground bg-muted/10 border-muted/20';
      default: return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  const getExpiryWarning = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { color: 'text-destructive', icon: 'AlertTriangle', message: 'Expired' };
    } else if (daysUntilExpiry <= 7) {
      return { color: 'text-destructive', icon: 'AlertCircle', message: `${daysUntilExpiry}d` };
    } else if (daysUntilExpiry <= 30) {
      return { color: 'text-warning', icon: 'Clock', message: `${daysUntilExpiry}d` };
    }
    return null;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('fr-TN');
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)]?.map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Table Header with Filters */}
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Kimbiales ({filteredAndSortedData?.length})
          </h3>
          {selectedItems?.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedItems?.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                onClick={() => console.log('Export selected:', selectedItems)}
              >
                Export
              </Button>
              <Button
                variant="destructive"
                size="sm"
                iconName="Trash2"
                onClick={() => console.log('Delete selected:', selectedItems)}
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            type="search"
            placeholder="Search kimbiales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="md:col-span-2"
          />
          
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
          />
          
          <Select
            options={bankOptions}
            value={bankFilter}
            onChange={setBankFilter}
            placeholder="Filter by bank"
          />
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={selectedItems?.length === paginatedData?.length && paginatedData?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('kimbialeNumber')}
                  className="font-medium text-foreground hover:text-foreground"
                >
                  Kimbiale Number
                  {sortField === 'kimbialeNumber' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={14} 
                      className="ml-1" 
                    />
                  )}
                </Button>
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('partner')}
                  className="font-medium text-foreground hover:text-foreground"
                >
                  Partner
                  {sortField === 'partner' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={14} 
                      className="ml-1" 
                    />
                  )}
                </Button>
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('bank')}
                  className="font-medium text-foreground hover:text-foreground"
                >
                  Bank
                  {sortField === 'bank' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={14} 
                      className="ml-1" 
                    />
                  )}
                </Button>
              </th>
              <th className="text-left p-4">RIB</th>
              <th className="text-right p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('amount')}
                  className="font-medium text-foreground hover:text-foreground"
                >
                  Amount
                  {sortField === 'amount' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={14} 
                      className="ml-1" 
                    />
                  )}
                </Button>
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('issueDate')}
                  className="font-medium text-foreground hover:text-foreground"
                >
                  Issue Date
                  {sortField === 'issueDate' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={14} 
                      className="ml-1" 
                    />
                  )}
                </Button>
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('expiryDate')}
                  className="font-medium text-foreground hover:text-foreground"
                >
                  Expiry Date
                  {sortField === 'expiryDate' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={14} 
                      className="ml-1" 
                    />
                  )}
                </Button>
              </th>
              <th className="text-left p-4">Status</th>
              <th className="text-center p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((kimbiale) => {
              const expiryWarning = getExpiryWarning(kimbiale?.expiryDate);
              return (
                <tr key={kimbiale?.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedItems?.includes(kimbiale?.id)}
                      onChange={(e) => handleSelectItem(kimbiale?.id, e?.target?.checked)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-foreground">{kimbiale?.kimbialeNumber}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-foreground">{kimbiale?.partner}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-foreground">{kimbiale?.bank}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-sm text-muted-foreground">
                      {kimbiale?.rib?.replace(/(.{2})(.{3})(.{13})(.{2})/, '$1 $2 ••• $4')}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-medium text-foreground">
                      {formatCurrency(kimbiale?.amount)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-muted-foreground">{formatDate(kimbiale?.issueDate)}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">{formatDate(kimbiale?.expiryDate)}</span>
                      {expiryWarning && (
                        <div className="flex items-center space-x-1">
                          <Icon 
                            name={expiryWarning?.icon} 
                            size={14} 
                            className={expiryWarning?.color} 
                          />
                          <span className={`text-xs ${expiryWarning?.color}`}>
                            {expiryWarning?.message}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full border font-medium ${getStatusColor(kimbiale?.status)}`}>
                      {kimbiale?.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(kimbiale)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Icon name="Eye" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(kimbiale)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(kimbiale)}
                        className="text-muted-foreground hover:text-destructive"
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
      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <Select
            options={pageSizeOptions}
            value={pageSize}
            onChange={(value) => {
              setPageSize(value);
              setCurrentPage(1);
            }}
          />
          <span className="text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * pageSize + 1, filteredAndSortedData?.length)} to{' '}
            {Math.min(currentPage * pageSize, filteredAndSortedData?.length)} of{' '}
            {filteredAndSortedData?.length} results
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            iconName="ChevronLeft"
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {[...Array(Math.min(5, totalPages))]?.map((_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-8 h-8"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            iconName="ChevronRight"
            iconPosition="right"
          >
            Next
          </Button>
        </div>
      </div>
      {/* Empty State */}
      {filteredAndSortedData?.length === 0 && !loading && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Receipt" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No kimbiales found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter || bankFilter
              ? 'Try adjusting your search or filter criteria' :'Get started by creating your first kimbiale'}
          </p>
          {!searchTerm && !statusFilter && !bankFilter && (
            <Button iconName="Plus" iconPosition="left">
              Create Kimbiale
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default KimbialeDataTable;