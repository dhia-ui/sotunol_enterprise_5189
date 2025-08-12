import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const InvoiceForm = ({ 
  invoice = null, 
  onSave = () => {}, 
  onCancel = () => {}, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    issueDate: new Date()?.toISOString()?.split('T')?.[0],
    dueDate: '',
    taxRate: 19,
    notes: '',
    lineItems: [
      { id: 1, product: '', quantity: 1, price: 0, discount: 0 }
    ]
  });

  const [calculations, setCalculations] = useState({
    subtotal: 0,
    taxAmount: 0,
    grandTotal: 0
  });

  const clientOptions = [
    { value: 'acme-corp', label: 'ACME Corporation' },
    { value: 'tech-solutions', label: 'Tech Solutions Ltd' },
    { value: 'global-trade', label: 'Global Trade Partners' },
    { value: 'innovation-hub', label: 'Innovation Hub SA' },
    { value: 'digital-ventures', label: 'Digital Ventures Inc' }
  ];

  const productOptions = [
    { value: 'consulting', label: 'Consulting Services' },
    { value: 'software-license', label: 'Software License' },
    { value: 'maintenance', label: 'Maintenance Contract' },
    { value: 'training', label: 'Training Program' },
    { value: 'support', label: 'Technical Support' }
  ];

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoiceNumber: invoice?.invoiceNumber || '',
        clientName: invoice?.clientName || '',
        clientEmail: invoice?.clientEmail || '',
        clientAddress: invoice?.clientAddress || '',
        issueDate: invoice?.issueDate || new Date()?.toISOString()?.split('T')?.[0],
        dueDate: invoice?.dueDate || '',
        taxRate: invoice?.taxRate || 19,
        notes: invoice?.notes || '',
        lineItems: invoice?.lineItems || [
          { id: 1, product: '', quantity: 1, price: 0, discount: 0 }
        ]
      });
    }
  }, [invoice]);

  useEffect(() => {
    calculateTotals();
  }, [formData?.lineItems, formData?.taxRate]);

  const calculateTotals = () => {
    const subtotal = formData?.lineItems?.reduce((sum, item) => {
      const lineTotal = item?.quantity * item?.price * (1 - item?.discount / 100);
      return sum + lineTotal;
    }, 0);

    const taxAmount = subtotal * (formData?.taxRate / 100);
    const grandTotal = subtotal + taxAmount;

    setCalculations({
      subtotal: subtotal,
      taxAmount: taxAmount,
      grandTotal: grandTotal
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLineItemChange = (index, field, value) => {
    const updatedItems = [...formData?.lineItems];
    updatedItems[index] = {
      ...updatedItems?.[index],
      [field]: field === 'quantity' || field === 'price' || field === 'discount' 
        ? parseFloat(value) || 0 
        : value
    };
    
    setFormData(prev => ({
      ...prev,
      lineItems: updatedItems
    }));
  };

  const addLineItem = () => {
    const newId = Math.max(...formData?.lineItems?.map(item => item?.id)) + 1;
    setFormData(prev => ({
      ...prev,
      lineItems: [
        ...prev?.lineItems,
        { id: newId, product: '', quantity: 1, price: 0, discount: 0 }
      ]
    }));
  };

  const removeLineItem = (index) => {
    if (formData?.lineItems?.length > 1) {
      setFormData(prev => ({
        ...prev,
        lineItems: prev?.lineItems?.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const invoiceData = {
      ...formData,
      ...calculations,
      status: invoice?.status || 'draft',
      createdAt: invoice?.createdAt || new Date()?.toISOString(),
      updatedAt: new Date()?.toISOString()
    };
    onSave(invoiceData);
  };

  const getLineTotal = (item) => {
    return item?.quantity * item?.price * (1 - item?.discount / 100);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-synthwave">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground font-heading">
              {invoice ? 'Edit Invoice' : 'Create New Invoice'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {invoice ? `Editing invoice ${invoice?.invoiceNumber}` : 'Fill in the details to create a new invoice'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Client Information */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="User" size={20} className="text-primary" />
            <h3 className="text-lg font-medium text-foreground">Client Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Client Name"
              placeholder="Select or enter client name"
              options={clientOptions}
              value={formData?.clientName}
              onChange={(value) => handleInputChange('clientName', value)}
              searchable
              required
            />
            
            <Input
              label="Client Email"
              type="email"
              placeholder="client@company.com"
              value={formData?.clientEmail}
              onChange={(e) => handleInputChange('clientEmail', e?.target?.value)}
              required
            />
          </div>

          <Input
            label="Client Address"
            placeholder="Enter complete client address"
            value={formData?.clientAddress}
            onChange={(e) => handleInputChange('clientAddress', e?.target?.value)}
            required
          />
        </div>

        {/* Invoice Details */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="FileText" size={20} className="text-primary" />
            <h3 className="text-lg font-medium text-foreground">Invoice Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Invoice Number"
              placeholder="INV-2025-001"
              value={formData?.invoiceNumber}
              onChange={(e) => handleInputChange('invoiceNumber', e?.target?.value)}
              required
            />
            
            <Input
              label="Issue Date"
              type="date"
              value={formData?.issueDate}
              onChange={(e) => handleInputChange('issueDate', e?.target?.value)}
              required
            />
            
            <Input
              label="Due Date"
              type="date"
              value={formData?.dueDate}
              onChange={(e) => handleInputChange('dueDate', e?.target?.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Tax Rate (%)"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData?.taxRate}
              onChange={(e) => handleInputChange('taxRate', parseFloat(e?.target?.value) || 0)}
              required
            />
            
            <Input
              label="Notes"
              placeholder="Additional notes or terms"
              value={formData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
            />
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Package" size={20} className="text-primary" />
              <h3 className="text-lg font-medium text-foreground">Line Items</h3>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLineItem}
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
            >
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {formData?.lineItems?.map((item, index) => (
              <div key={item?.id} className="bg-muted/30 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Item {index + 1}</span>
                  {formData?.lineItems?.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLineItem(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="md:col-span-2">
                    <Select
                      label="Product/Service"
                      placeholder="Select product"
                      options={productOptions}
                      value={item?.product}
                      onChange={(value) => handleLineItemChange(index, 'product', value)}
                      searchable
                      required
                    />
                  </div>
                  
                  <Input
                    label="Quantity"
                    type="number"
                    min="1"
                    step="1"
                    value={item?.quantity}
                    onChange={(e) => handleLineItemChange(index, 'quantity', e?.target?.value)}
                    required
                  />
                  
                  <Input
                    label="Unit Price (TND)"
                    type="number"
                    min="0"
                    step="0.01"
                    value={item?.price}
                    onChange={(e) => handleLineItemChange(index, 'price', e?.target?.value)}
                    required
                  />
                  
                  <Input
                    label="Discount (%)"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={item?.discount}
                    onChange={(e) => handleLineItemChange(index, 'discount', e?.target?.value)}
                  />
                </div>

                <div className="flex justify-end">
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground">Line Total: </span>
                    <span className="text-lg font-semibold text-foreground">
                      {getLineTotal(item)?.toFixed(2)} TND
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculations Summary */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Invoice Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium text-foreground">{calculations?.subtotal?.toFixed(2)} TND</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tax ({formData?.taxRate}%):</span>
              <span className="font-medium text-foreground">{calculations?.taxAmount?.toFixed(2)} TND</span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-foreground">Grand Total:</span>
                <span className="text-xl font-bold text-primary">{calculations?.grandTotal?.toFixed(2)} TND</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
            iconSize={16}
          >
            {invoice ? 'Update Invoice' : 'Create Invoice'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;