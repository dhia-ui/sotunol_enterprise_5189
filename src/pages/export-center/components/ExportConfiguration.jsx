import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const ExportConfiguration = ({ config = {}, onConfigChange, onNext, onPrev }) => {
  const formatOptions = [
    { value: 'csv', label: 'CSV - Comma Separated Values', icon: 'FileText' },
    { value: 'json', label: 'JSON - JavaScript Object Notation', icon: 'Code' },
    { value: 'excel', label: 'Excel - Microsoft Excel Format', icon: 'FileSpreadsheet' },
    { value: 'pdf', label: 'PDF - Portable Document Format', icon: 'File' }
  ];

  const templateOptions = {
    csv: [
      { value: 'standard', label: 'Standard Template' },
      { value: 'detailed', label: 'Detailed Template' },
      { value: 'summary', label: 'Summary Template' }
    ],
    json: [
      { value: 'standard', label: 'Standard Schema' },
      { value: 'nested', label: 'Nested Structure' },
      { value: 'flat', label: 'Flat Structure' }
    ],
    excel: [
      { value: 'standard', label: 'Single Sheet' },
      { value: 'multi-sheet', label: 'Multiple Sheets' },
      { value: 'pivot', label: 'With Pivot Tables' }
    ],
    pdf: [
      { value: 'standard', label: 'Standard Report' },
      { value: 'detailed', label: 'Detailed Report' },
      { value: 'executive', label: 'Executive Summary' }
    ]
  };

  const batchSizeOptions = [
    { value: 500, label: '500 records per batch' },
    { value: 1000, label: '1,000 records per batch' },
    { value: 2500, label: '2,500 records per batch' },
    { value: 5000, label: '5,000 records per batch' },
    { value: 10000, label: '10,000 records per batch' }
  ];

  const handleConfigChange = (key, value) => {
    onConfigChange({ [key]: value });
  };

  const getFormatInfo = (format) => {
    const info = {
      csv: {
        description: 'Compatible with Excel, Google Sheets, and most data analysis tools',
        advantages: ['Universal compatibility', 'Small file size', 'Easy to process'],
        limitations: ['No formatting', 'Limited data types']
      },
      json: {
        description: 'Structured data format ideal for APIs and programmatic processing',
        advantages: ['Preserves data structure', 'API compatible', 'Human readable'],
        limitations: ['Larger file size', 'Requires technical knowledge']
      },
      excel: {
        description: 'Native Microsoft Excel format with advanced features and formatting',
        advantages: ['Rich formatting', 'Multiple sheets', 'Built-in calculations'],
        limitations: ['Larger file size', 'Requires Excel software']
      },
      pdf: {
        description: 'Printable format perfect for reports and formal documentation',
        advantages: ['Professional appearance', 'Print ready', 'Consistent formatting'],
        limitations: ['Not editable', 'Limited data processing']
      }
    };
    return info?.[format] || {};
  };

  const selectedFormatInfo = getFormatInfo(config?.format);
  const availableTemplates = templateOptions?.[config?.format] || [];

  return (
    <div className="bg-card border border-border rounded-lg shadow-synthwave p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-2">Export Configuration</h3>
          <p className="text-muted-foreground">
            Choose your export format, template, and batch processing options
          </p>
        </div>

        {/* Export Format Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="FileType" size={16} className="text-primary" />
            <h4 className="text-sm font-medium text-foreground">Export Format</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formatOptions?.map((format) => (
              <button
                key={format?.value}
                onClick={() => handleConfigChange('format', format?.value)}
                className={`border-2 rounded-lg p-4 text-left transition-all duration-200 hover:shadow-synthwave ${
                  config?.format === format?.value 
                    ? 'border-primary bg-primary/10' :'border-border hover:border-muted-foreground/20'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Icon name={format?.icon} size={20} className={config?.format === format?.value ? 'text-primary' : 'text-muted-foreground'} />
                  <h5 className="text-sm font-medium text-foreground">
                    {format?.label?.split(' - ')?.[0]}
                  </h5>
                </div>
                <p className="text-xs text-muted-foreground">
                  {format?.label?.split(' - ')?.[1]}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Format Information */}
        {config?.format && (
          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">
              {config?.format?.toUpperCase()} Format Details
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              {selectedFormatInfo?.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-xs font-medium text-success mb-1">Advantages</h5>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {selectedFormatInfo?.advantages?.map((advantage, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Icon name="Check" size={12} className="text-success" />
                      <span>{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="text-xs font-medium text-warning mb-1">Limitations</h5>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {selectedFormatInfo?.limitations?.map((limitation, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Icon name="AlertTriangle" size={12} className="text-warning" />
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Template Selection */}
        {config?.format && availableTemplates?.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Icon name="Layout" size={16} className="text-primary" />
              <h4 className="text-sm font-medium text-foreground">Template Options</h4>
            </div>
            
            <Select
              options={availableTemplates}
              value={config?.template || 'standard'}
              onChange={(value) => handleConfigChange('template', value)}
              className="w-full md:w-1/2"
            />
          </div>
        )}

        {/* Batch Processing */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="Package" size={16} className="text-primary" />
            <h4 className="text-sm font-medium text-foreground">Batch Processing</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Batch Size</label>
              <Select
                options={batchSizeOptions}
                value={config?.batchSize || 1000}
                onChange={(value) => handleConfigChange('batchSize', value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Max File Size (MB)</label>
              <Input
                type="number"
                value={config?.maxFileSize || 50}
                onChange={(e) => handleConfigChange('maxFileSize', parseInt(e?.target?.value))}
                min={10}
                max={500}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-secondary">
              <Icon name="Info" size={14} />
              <span className="text-xs font-medium">Processing Information</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Large exports will be split into multiple files based on your batch size settings. 
              Files exceeding the maximum size will be automatically split.
            </p>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="Settings" size={16} className="text-primary" />
            <h4 className="text-sm font-medium text-foreground">Advanced Options</h4>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={config?.includeMetadata || false}
                onChange={(e) => handleConfigChange('includeMetadata', e?.target?.checked)}
                className="rounded border-muted-foreground"
              />
              <span className="text-sm text-foreground">Include metadata and timestamps</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={config?.compressFiles || false}
                onChange={(e) => handleConfigChange('compressFiles', e?.target?.checked)}
                className="rounded border-muted-foreground"
              />
              <span className="text-sm text-foreground">Compress files (ZIP format)</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={config?.encryptFiles || false}
                onChange={(e) => handleConfigChange('encryptFiles', e?.target?.checked)}
                className="rounded border-muted-foreground"
              />
              <span className="text-sm text-foreground">Password protect files</span>
            </label>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onPrev}
            iconName="ArrowLeft"
            iconPosition="left"
            iconSize={16}
          >
            Back to Filters
          </Button>
          
          <Button
            variant="default"
            onClick={onNext}
            disabled={!config?.format}
            iconName="ArrowRight"
            iconPosition="right"
            iconSize={16}
          >
            Continue to Batch Selection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportConfiguration;