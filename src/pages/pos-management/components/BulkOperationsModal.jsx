import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkOperationsModal = ({ 
  isOpen, 
  onClose, 
  selectedLocations, 
  onBulkOperation 
}) => {
  const [operation, setOperation] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const operationOptions = [
    { value: 'status', label: 'Change Status' },
    { value: 'export', label: 'Export Data' },
    { value: 'delete', label: 'Delete Locations' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!operation) return;
    
    if (operation === 'delete' && !confirmDelete) {
      return;
    }

    setIsLoading(true);
    
    try {
      const operationData = {
        type: operation,
        locations: selectedLocations,
        ...(operation === 'status' && { newStatus }),
      };
      
      await onBulkOperation(operationData);
      onClose();
    } catch (error) {
      console.error('Bulk operation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setOperation('');
    setNewStatus('');
    setConfirmDelete(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-synthwave-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground font-heading">
              Bulk Operations
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedLocations?.length} location{selectedLocations?.length !== 1 ? 's' : ''} selected
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Selected Locations Preview */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Selected Locations:</h3>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {selectedLocations?.slice(0, 5)?.map((location) => (
                <div key={location?.id} className="flex items-center space-x-2 text-sm">
                  <Icon name="MapPin" size={14} className="text-primary flex-shrink-0" />
                  <span className="text-muted-foreground truncate">
                    {location?.name} - {location?.city}
                  </span>
                </div>
              ))}
              {selectedLocations?.length > 5 && (
                <div className="text-xs text-muted-foreground">
                  ... and {selectedLocations?.length - 5} more
                </div>
              )}
            </div>
          </div>

          {/* Operation Selection */}
          <div className="space-y-4">
            <Select
              label="Select Operation"
              options={operationOptions}
              value={operation}
              onChange={setOperation}
              placeholder="Choose an operation"
              required
            />

            {/* Status Change Options */}
            {operation === 'status' && (
              <Select
                label="New Status"
                options={statusOptions}
                value={newStatus}
                onChange={setNewStatus}
                placeholder="Select new status"
                required
              />
            )}

            {/* Delete Confirmation */}
            {operation === 'delete' && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-destructive">
                        Permanent Deletion Warning
                      </h4>
                      <p className="text-xs text-destructive/80 mt-1">
                        This action cannot be undone. All selected locations will be permanently deleted.
                      </p>
                    </div>
                    <Checkbox
                      label="I understand that this action is permanent and cannot be undone"
                      checked={confirmDelete}
                      onChange={(e) => setConfirmDelete(e?.target?.checked)}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Export Options */}
            {operation === 'export' && (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="Download" size={16} className="text-primary" />
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Export Data</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Location data will be exported as CSV file
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={operation === 'delete' ? 'destructive' : 'default'}
              loading={isLoading}
              disabled={!operation || (operation === 'status' && !newStatus) || (operation === 'delete' && !confirmDelete)}
              iconName={
                operation === 'delete' ? 'Trash2' : 
                operation === 'export'? 'Download' : 'Check'
              }
              iconPosition="left"
              iconSize={16}
            >
              {operation === 'delete' ? 'Delete Locations' : 
               operation === 'export' ? 'Export Data' : 
               operation === 'status'? 'Update Status' : 'Execute'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkOperationsModal;