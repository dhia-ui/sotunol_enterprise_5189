import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import KimbialeAutocomplete from './KimbialeAutocomplete';
import KimbialeBankValidator from './KimbialeBankValidator';

const KimbialeFormModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  kimbiale = null, 
  mode = 'create' 
}) => {
  const [formData, setFormData] = useState({
    kimbialeNumber: '',
    partner: '',
    bank: '',
    rib: '',
    amount: '',
    issueDate: '',
    expiryDate: '',
    status: 'Active',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ribValidation, setRibValidation] = useState(null);

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Expired', label: 'Expired' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && kimbiale) {
        setFormData({
          kimbialeNumber: kimbiale?.kimbialeNumber || '',
          partner: kimbiale?.partner || '',
          bank: kimbiale?.bank || '',
          rib: kimbiale?.rib || '',
          amount: kimbiale?.amount?.toString() || '',
          issueDate: kimbiale?.issueDate || '',
          expiryDate: kimbiale?.expiryDate || '',
          status: kimbiale?.status || 'Active',
          notes: kimbiale?.notes || ''
        });
      } else {
        // Generate new kimbiale number for create mode
        const newNumber = `KMB${Date.now()?.toString()?.slice(-6)}`;
        setFormData({
          kimbialeNumber: newNumber,
          partner: '',
          bank: '',
          rib: '',
          amount: '',
          issueDate: new Date()?.toISOString()?.split('T')?.[0],
          expiryDate: '',
          status: 'Active',
          notes: ''
        });
      }
      setErrors({});
      setRibValidation(null);
    }
  }, [isOpen, mode, kimbiale]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.kimbialeNumber?.trim()) {
      newErrors.kimbialeNumber = 'Kimbiale number is required';
    }

    if (!formData?.partner?.trim()) {
      newErrors.partner = 'Partner is required';
    }

    if (!formData?.bank?.trim()) {
      newErrors.bank = 'Bank is required';
    }

    if (!formData?.rib?.trim()) {
      newErrors.rib = 'RIB is required';
    } else if (ribValidation && !ribValidation?.isValid) {
      newErrors.rib = 'Invalid RIB format or check digits';
    }

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (!formData?.issueDate) {
      newErrors.issueDate = 'Issue date is required';
    }

    if (!formData?.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (new Date(formData.expiryDate) <= new Date(formData.issueDate)) {
      newErrors.expiryDate = 'Expiry date must be after issue date';
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

  const handleRibValidation = (validation) => {
    setRibValidation(validation);
    if (validation && validation?.isValid && validation?.bankName) {
      // Auto-fill bank name if RIB is valid
      setFormData(prev => ({
        ...prev,
        bank: validation?.bankName
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const kimbialeData = {
        ...formData,
        amount: parseFloat(formData?.amount),
        id: mode === 'edit' ? kimbiale?.id : Date.now()
      };

      await onSave(kimbialeData);
      onClose();
    } catch (error) {
      console.error('Error saving kimbiale:', error);
      setErrors({ submit: 'Failed to save kimbiale. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-card border border-border rounded-lg shadow-synthwave-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Icon name="Receipt" size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {mode === 'create' ? 'Create New Kimbiale' : 'Edit Kimbiale'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === 'create' ? 'Add a new promissory note' : 'Update kimbiale details'}
              </p>
            </div>
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
            <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Kimbiale Number"
                type="text"
                value={formData?.kimbialeNumber}
                onChange={(e) => handleInputChange('kimbialeNumber', e?.target?.value)}
                error={errors?.kimbialeNumber}
                required
                placeholder="KMB123456"
              />

              <Select
                label="Status"
                options={statusOptions}
                value={formData?.status}
                onChange={(value) => handleInputChange('status', value)}
                required
              />
            </div>

            <KimbialeAutocomplete
              type="partner"
              label="Partner"
              value={formData?.partner}
              onChange={(value) => handleInputChange('partner', value)}
              placeholder="Search or enter partner name"
              error={errors?.partner}
              required
            />
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">
              Financial Details
            </h3>
            
            <Input
              label="Amount (TND)"
              type="number"
              step="0.01"
              min="0"
              value={formData?.amount}
              onChange={(e) => handleInputChange('amount', e?.target?.value)}
              error={errors?.amount}
              required
              placeholder="0.00"
            />

            <KimbialeAutocomplete
              type="bank"
              label="Bank"
              value={formData?.bank}
              onChange={(value) => handleInputChange('bank', value)}
              placeholder="Search or enter bank name"
              error={errors?.bank}
              required
            />

            <div>
              <Input
                label="RIB (Relevé d'Identité Bancaire)"
                type="text"
                value={formData?.rib}
                onChange={(e) => handleInputChange('rib', e?.target?.value?.replace(/\s/g, ''))}
                error={errors?.rib}
                required
                placeholder="20 digits RIB number"
                maxLength={20}
              />
              <KimbialeBankValidator 
                rib={formData?.rib} 
                onValidationChange={handleRibValidation}
              />
            </div>
          </div>

          {/* Date Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">
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
                label="Expiry Date"
                type="date"
                value={formData?.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e?.target?.value)}
                error={errors?.expiryDate}
                required
                min={formData?.issueDate}
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">
              Additional Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notes
              </label>
              <textarea
                value={formData?.notes}
                onChange={(e) => handleInputChange('notes', e?.target?.value)}
                placeholder="Additional notes or comments..."
                rows={3}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Error Message */}
          {errors?.submit && (
            <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <Icon name="AlertCircle" size={16} className="text-destructive" />
              <span className="text-sm text-destructive">{errors?.submit}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              iconName="Save"
              iconPosition="left"
            >
              {mode === 'create' ? 'Create Kimbiale' : 'Update Kimbiale'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KimbialeFormModal;