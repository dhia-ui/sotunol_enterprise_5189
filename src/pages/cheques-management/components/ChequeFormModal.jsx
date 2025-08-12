import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ChequeFormModal = ({ isOpen, onClose, onSave, cheque = null, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    chequeNumber: '',
    partnerName: '',
    partnerCode: '',
    amount: '',
    issueDate: '',
    dueDate: '',
    bankName: '',
    accountNumber: '',
    status: 'pending',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'processed', label: 'Processed' }
  ];

  const bankOptions = [
    { value: 'biat', label: 'Banque Internationale Arabe de Tunisie' },
    { value: 'bna', label: 'Banque Nationale Agricole' },
    { value: 'stb', label: 'Société Tunisienne de Banque' },
    { value: 'ubci', label: 'Union Bancaire pour le Commerce et l\'Industrie' },
    { value: 'attijari', label: 'Attijari Bank' },
    { value: 'amen', label: 'Amen Bank' }
  ];

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && cheque) {
        setFormData({
          chequeNumber: cheque?.chequeNumber || '',
          partnerName: cheque?.partnerName || '',
          partnerCode: cheque?.partnerCode || '',
          amount: cheque?.amount?.toString() || '',
          issueDate: cheque?.issueDate ? new Date(cheque.issueDate)?.toISOString()?.split('T')?.[0] : '',
          dueDate: cheque?.dueDate ? new Date(cheque.dueDate)?.toISOString()?.split('T')?.[0] : '',
          bankName: cheque?.bankName || '',
          accountNumber: cheque?.accountNumber || '',
          status: cheque?.status || 'pending',
          notes: cheque?.notes || ''
        });
      } else {
        // Reset form for add mode
        setFormData({
          chequeNumber: '',
          partnerName: '',
          partnerCode: '',
          amount: '',
          issueDate: '',
          dueDate: '',
          bankName: '',
          accountNumber: '',
          status: 'pending',
          notes: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, cheque]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.chequeNumber?.trim()) {
      newErrors.chequeNumber = 'Cheque number is required';
    } else if (!/^[0-9]{6,12}$/?.test(formData?.chequeNumber)) {
      newErrors.chequeNumber = 'Cheque number must be 6-12 digits';
    }

    if (!formData?.partnerName?.trim()) {
      newErrors.partnerName = 'Partner name is required';
    }

    if (!formData?.partnerCode?.trim()) {
      newErrors.partnerCode = 'Partner code is required';
    }

    if (!formData?.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData?.issueDate) {
      newErrors.issueDate = 'Issue date is required';
    }

    if (!formData?.bankName) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!formData?.accountNumber?.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^[0-9]{10,20}$/?.test(formData?.accountNumber)) {
      newErrors.accountNumber = 'Account number must be 10-20 digits';
    }

    // Validate due date is after issue date
    if (formData?.issueDate && formData?.dueDate) {
      const issueDate = new Date(formData.issueDate);
      const dueDate = new Date(formData.dueDate);
      if (dueDate <= issueDate) {
        newErrors.dueDate = 'Due date must be after issue date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const chequeData = {
        ...formData,
        amount: parseFloat(formData?.amount),
        id: mode === 'edit' ? cheque?.id : Date.now(),
        createdAt: mode === 'edit' ? cheque?.createdAt : new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      };

      await onSave(chequeData);
      onClose();
    } catch (error) {
      console.error('Error saving cheque:', error);
      setErrors({ submit: 'Failed to save cheque. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-synthwave-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {mode === 'edit' ? 'Edit Cheque' : 'Add New Cheque'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === 'edit' 
                ? `Modify cheque #${cheque?.chequeNumber}` 
                : 'Enter cheque details below'
              }
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-foreground border-b border-border pb-2">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Cheque Number"
                type="text"
                placeholder="Enter cheque number"
                value={formData?.chequeNumber}
                onChange={(e) => handleInputChange('chequeNumber', e?.target?.value)}
                error={errors?.chequeNumber}
                required
              />
              
              <Select
                label="Status"
                options={statusOptions}
                value={formData?.status}
                onChange={(value) => handleInputChange('status', value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Partner Name"
                type="text"
                placeholder="Enter partner name"
                value={formData?.partnerName}
                onChange={(e) => handleInputChange('partnerName', e?.target?.value)}
                error={errors?.partnerName}
                required
              />
              
              <Input
                label="Partner Code"
                type="text"
                placeholder="Enter partner code"
                value={formData?.partnerCode}
                onChange={(e) => handleInputChange('partnerCode', e?.target?.value)}
                error={errors?.partnerCode}
                required
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-foreground border-b border-border pb-2">
              Financial Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Amount (TND)"
                type="number"
                step="0.001"
                min="0"
                placeholder="0.000"
                value={formData?.amount}
                onChange={(e) => handleInputChange('amount', e?.target?.value)}
                error={errors?.amount}
                required
              />
              
              <Select
                label="Bank Name"
                options={bankOptions}
                value={formData?.bankName}
                onChange={(value) => handleInputChange('bankName', value)}
                error={errors?.bankName}
                searchable
                required
              />
            </div>

            <Input
              label="Account Number"
              type="text"
              placeholder="Enter account number"
              value={formData?.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e?.target?.value)}
              error={errors?.accountNumber}
              required
            />
          </div>

          {/* Date Information */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-foreground border-b border-border pb-2">
              Date Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Issue Date"
                type="date"
                value={formData?.issueDate}
                onChange={(e) => handleInputChange('issueDate', e?.target?.value)}
                error={errors?.issueDate}
                required
              />
              
              <Input
                label="Due Date"
                type="date"
                value={formData?.dueDate}
                onChange={(e) => handleInputChange('dueDate', e?.target?.value)}
                error={errors?.dueDate}
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-foreground border-b border-border pb-2">
              Additional Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notes
              </label>
              <textarea
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={3}
                placeholder="Enter any additional notes..."
                value={formData?.notes}
                onChange={(e) => handleInputChange('notes', e?.target?.value)}
              />
            </div>
          </div>

          {/* Error Message */}
          {errors?.submit && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive">{errors?.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={isLoading}
              iconName="Save"
              iconPosition="left"
              className="flex-1"
            >
              {mode === 'edit' ? 'Update Cheque' : 'Add Cheque'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChequeFormModal;