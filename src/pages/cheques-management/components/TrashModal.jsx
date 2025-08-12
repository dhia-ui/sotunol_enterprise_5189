import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const TrashModal = ({ isOpen, onClose, trashedCheques = [], onRestore, onPermanentDelete }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev?.includes(id) 
        ? prev?.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems?.length === trashedCheques?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(trashedCheques?.map(item => item?.id));
    }
  };

  const handleBulkRestore = async () => {
    if (selectedItems?.length === 0) return;
    
    setIsLoading(true);
    try {
      await onRestore(selectedItems);
      setSelectedItems([]);
    } catch (error) {
      console.error('Error restoring items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems?.length === 0) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${selectedItems?.length} cheque(s)? This action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    setIsLoading(true);
    try {
      await onPermanentDelete(selectedItems);
      setSelectedItems([]);
    } catch (error) {
      console.error('Error deleting items:', error);
    } finally {
      setIsLoading(false);
    }
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

  const isAllSelected = trashedCheques?.length > 0 && selectedItems?.length === trashedCheques?.length;
  const isIndeterminate = selectedItems?.length > 0 && selectedItems?.length < trashedCheques?.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-synthwave-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <Icon name="Trash2" size={20} className="text-destructive" />
              <span>Trash Management</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              {trashedCheques?.length} deleted cheque(s) • Items are kept for 30 days
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Bulk Actions */}
        {trashedCheques?.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-muted/30 border-b border-border">
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                {selectedItems?.length > 0 
                  ? `${selectedItems?.length} selected`
                  : 'Select all'
                }
              </span>
            </div>
            
            {selectedItems?.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkRestore}
                  loading={isLoading}
                  iconName="RotateCcw"
                  iconPosition="left"
                >
                  Restore Selected
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  loading={isLoading}
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Delete Forever
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-96">
          {trashedCheques?.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Trash2" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Trash is empty</h3>
              <p className="text-muted-foreground">
                Deleted cheques will appear here and can be restored within 30 days.
              </p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {trashedCheques?.map((cheque) => (
                <div
                  key={cheque?.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 ${
                    selectedItems?.includes(cheque?.id)
                      ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                  }`}
                >
                  <Checkbox
                    checked={selectedItems?.includes(cheque?.id)}
                    onChange={() => handleSelectItem(cheque?.id)}
                  />
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="font-mono text-sm font-medium text-foreground">
                        {cheque?.chequeNumber}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Cheque Number
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-foreground">
                        {cheque?.partnerName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Partner
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-foreground">
                        {formatAmount(cheque?.amount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Amount
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-foreground">
                        {formatDate(cheque?.deletedAt)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Deleted Date
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRestore([cheque?.id])}
                      className="text-success hover:text-success hover:bg-success/10"
                      iconName="RotateCcw"
                      iconPosition="left"
                    >
                      Restore
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const confirmed = window.confirm(
                          `Are you sure you want to permanently delete cheque #${cheque?.chequeNumber}? This action cannot be undone.`
                        );
                        if (confirmed) {
                          onPermanentDelete([cheque?.id]);
                        }
                      }}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      iconName="Trash2"
                      iconPosition="left"
                    >
                      Delete Forever
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">
            <Icon name="Info" size={14} className="inline mr-1" />
            Items in trash are automatically deleted after 30 days
          </div>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrashModal;