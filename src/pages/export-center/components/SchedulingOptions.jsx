import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SchedulingOptions = ({ scheduling = {}, onSchedulingChange, onExport, onPrev, isExporting = false }) => {
  const scheduleOptions = [
    { value: 'immediate', label: 'Export Immediately', icon: 'Play' },
    { value: 'scheduled', label: 'Schedule for Later', icon: 'Calendar' },
    { value: 'recurring', label: 'Recurring Export', icon: 'RotateCcw' }
  ];

  const recurringOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const handleSchedulingChange = (key, value) => {
    let newScheduling = { ...scheduling, [key]: value };
    
    // Reset other scheduling options when changing type
    if (key === 'immediate' && value) {
      newScheduling = { ...newScheduling, scheduled: false, recurring: false };
    } else if (key === 'scheduled' && value) {
      newScheduling = { ...newScheduling, immediate: false, recurring: false };
    } else if (key === 'recurring' && value) {
      newScheduling = { ...newScheduling, immediate: false, scheduled: false };
    }
    
    onSchedulingChange(newScheduling);
  };

  const addEmailRecipient = () => {
    const email = prompt('Enter email address:');
    if (email && email?.includes('@')) {
      const newRecipients = [...(scheduling?.recipients || []), email];
      handleSchedulingChange('recipients', newRecipients);
    }
  };

  const removeEmailRecipient = (email) => {
    const newRecipients = scheduling?.recipients?.filter(r => r !== email);
    handleSchedulingChange('recipients', newRecipients);
  };

  const canStartExport = () => {
    if (scheduling?.immediate) return true;
    if (scheduling?.scheduled && scheduling?.scheduledDate && scheduling?.scheduledTime) return true;
    if (scheduling?.recurring && scheduling?.recurringFrequency && scheduling?.recurringStartDate) return true;
    return false;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-synthwave p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-2">Schedule Export</h3>
          <p className="text-muted-foreground">
            Choose when to run your export and configure delivery options
          </p>
        </div>

        {/* Scheduling Type Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-primary" />
            <h4 className="text-sm font-medium text-foreground">Export Timing</h4>
          </div>
          
          <div className="space-y-3">
            {scheduleOptions?.map((option) => (
              <label key={option?.value} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="schedulingType"
                  checked={scheduling?.[option?.value] || false}
                  onChange={(e) => handleSchedulingChange(option?.value, e?.target?.checked)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon name={option?.icon} size={16} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">{option?.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    {option?.value === 'immediate' && 'Start the export process right away'}
                    {option?.value === 'scheduled' && 'Schedule the export to run at a specific date and time'}
                    {option?.value === 'recurring' && 'Set up automatic recurring exports on a schedule'}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Scheduled Export Options */}
        {scheduling?.scheduled && (
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 space-y-4">
            <h5 className="text-sm font-medium text-foreground flex items-center space-x-2">
              <Icon name="Calendar" size={14} />
              <span>Schedule Details</span>
            </h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Date</label>
                <Input
                  type="date"
                  value={scheduling?.scheduledDate || ''}
                  onChange={(e) => handleSchedulingChange('scheduledDate', e?.target?.value)}
                  min={new Date()?.toISOString()?.split('T')?.[0]}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Time</label>
                <Input
                  type="time"
                  value={scheduling?.scheduledTime || ''}
                  onChange={(e) => handleSchedulingChange('scheduledTime', e?.target?.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Recurring Export Options */}
        {scheduling?.recurring && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 space-y-4">
            <h5 className="text-sm font-medium text-foreground flex items-center space-x-2">
              <Icon name="RotateCcw" size={14} />
              <span>Recurring Schedule</span>
            </h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Frequency</label>
                <Select
                  options={recurringOptions}
                  value={scheduling?.recurringFrequency || ''}
                  onChange={(value) => handleSchedulingChange('recurringFrequency', value)}
                  placeholder="Select frequency"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Start Date</label>
                <Input
                  type="date"
                  value={scheduling?.recurringStartDate || ''}
                  onChange={(e) => handleSchedulingChange('recurringStartDate', e?.target?.value)}
                  min={new Date()?.toISOString()?.split('T')?.[0]}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="bg-warning/20 border border-warning/30 rounded p-3">
              <div className="flex items-center space-x-2 text-warning mb-1">
                <Icon name="AlertTriangle" size={14} />
                <span className="text-xs font-medium">Recurring Export Notice</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Recurring exports will be automatically generated and emailed to recipients. 
                You can manage or cancel recurring exports from the Export History section.
              </p>
            </div>
          </div>
        )}

        {/* Email Delivery Configuration */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="Mail" size={16} className="text-primary" />
            <h4 className="text-sm font-medium text-foreground">Email Delivery</h4>
          </div>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={scheduling?.emailNotification || false}
              onChange={(e) => handleSchedulingChange('emailNotification', e?.target?.checked)}
              className="rounded border-muted-foreground"
            />
            <span className="text-sm text-foreground">Send export notification email</span>
          </label>

          {scheduling?.emailNotification && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">Email Recipients</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addEmailRecipient}
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={14}
                >
                  Add Recipient
                </Button>
              </div>
              
              {scheduling?.recipients?.length > 0 ? (
                <div className="space-y-2">
                  {scheduling?.recipients?.map((email, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Icon name="Mail" size={14} className="text-muted-foreground" />
                        <span className="text-sm text-foreground">{email}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEmailRecipient(email)}
                        iconName="X"
                        iconSize={14}
                        className="text-destructive hover:text-destructive"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 border border-dashed border-muted-foreground/30 rounded-lg">
                  <Icon name="Mail" size={24} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No email recipients added</p>
                  <p className="text-xs text-muted-foreground">Click "Add Recipient" to add email addresses</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Export Summary */}
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <h5 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="FileText" size={14} />
            <span>Export Summary</span>
          </h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timing:</span>
                <span className="text-foreground">
                  {scheduling?.immediate && 'Immediate'}
                  {scheduling?.scheduled && 'Scheduled'}
                  {scheduling?.recurring && 'Recurring'}
                </span>
              </div>
              {scheduling?.scheduled && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="text-foreground">
                    {scheduling?.scheduledDate} {scheduling?.scheduledTime}
                  </span>
                </div>
              )}
              {scheduling?.recurring && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frequency:</span>
                  <span className="text-foreground">{scheduling?.recurringFrequency}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email Notifications:</span>
                <span className="text-foreground">
                  {scheduling?.emailNotification ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              {scheduling?.emailNotification && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recipients:</span>
                  <span className="text-foreground">{scheduling?.recipients?.length || 0}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={isExporting}
            iconName="ArrowLeft"
            iconPosition="left"
            iconSize={16}
          >
            Back to Batch Selection
          </Button>
          
          <Button
            variant="default"
            onClick={onExport}
            disabled={!canStartExport() || isExporting}
            iconName={isExporting ? "Loader2" : "Download"}
            iconPosition="left"
            iconSize={16}
            className={isExporting ? "animate-spin-icon" : ""}
          >
            {isExporting ? 'Processing...' : 'Start Export'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SchedulingOptions;