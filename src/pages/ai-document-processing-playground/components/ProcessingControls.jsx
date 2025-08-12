import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';

const ProcessingControls = ({ 
  onProcessStart, 
  onExport, 
  isProcessing, 
  confidenceThreshold, 
  onConfidenceChange,
  ocrEnabled,
  onOcrToggle 
}) => {
  const [exportFormat, setExportFormat] = useState('json');
  const [exportModule, setExportModule] = useState('');

  const exportModuleOptions = [
    { value: '', label: 'Select Module', disabled: true },
    { value: 'cheques', label: 'Cheques Management' },
    { value: 'kimbiales', label: 'Kimbiales Management' },
    { value: 'factures', label: 'Factures Management' }
  ];

  const exportFormatOptions = [
    { value: 'json', label: 'JSON Format' },
    { value: 'csv', label: 'CSV Format' },
    { value: 'xml', label: 'XML Format' }
  ];

  const handleExport = () => {
    if (exportModule) {
      onExport({ module: exportModule, format: exportFormat });
    }
  };

  return (
    <div className="space-y-6">
      {/* OCR Controls */}
      <div className="p-4 bg-card border border-border rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Settings" size={20} className="text-primary" />
          <span>OCR Settings</span>
        </h3>

        <div className="space-y-4">
          {/* OCR Toggle */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Eye" size={20} className="text-muted-foreground" />
              <div>
                <div className="font-medium text-foreground">Mock OCR Processing</div>
                <div className="text-sm text-muted-foreground">
                  Enable simulated OCR for demonstration
                </div>
              </div>
            </div>
            <button
              onClick={onOcrToggle}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                ocrEnabled ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  ocrEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Confidence Threshold */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Confidence Threshold: {(confidenceThreshold * 100)?.toFixed(0)}%
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={confidenceThreshold}
                onChange={(e) => onConfidenceChange(parseFloat(e?.target?.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Only show detections above this confidence level
            </div>
          </div>

          {/* Processing Button */}
          <Button
            onClick={onProcessStart}
            disabled={isProcessing}
            loading={isProcessing}
            variant="default"
            fullWidth
            iconName="Play"
            iconPosition="left"
          >
            {isProcessing ? 'Processing...' : 'Start OCR Processing'}
          </Button>
        </div>
      </div>
      {/* Batch Operations */}
      <div className="p-4 bg-card border border-border rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Layers" size={20} className="text-secondary" />
          <span>Batch Operations</span>
        </h3>

        <div className="space-y-3">
          <Button
            variant="outline"
            fullWidth
            iconName="RotateCcw"
            iconPosition="left"
            disabled={isProcessing}
          >
            Reprocess All
          </Button>

          <Button
            variant="outline"
            fullWidth
            iconName="Download"
            iconPosition="left"
            disabled={isProcessing}
          >
            Download Results
          </Button>

          <Button
            variant="ghost"
            fullWidth
            iconName="Trash2"
            iconPosition="left"
            className="text-destructive hover:text-destructive"
            disabled={isProcessing}
          >
            Clear All Results
          </Button>
        </div>
      </div>
      {/* Export Controls */}
      <div className="p-4 bg-card border border-border rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Share" size={20} className="text-accent" />
          <span>Export to Module</span>
        </h3>

        <div className="space-y-4">
          <Select
            label="Target Module"
            options={exportModuleOptions}
            value={exportModule}
            onChange={setExportModule}
            placeholder="Choose destination module"
          />

          <Select
            label="Export Format"
            options={exportFormatOptions}
            value={exportFormat}
            onChange={setExportFormat}
          />

          <Button
            onClick={handleExport}
            disabled={!exportModule || isProcessing}
            variant="default"
            fullWidth
            iconName="Send"
            iconPosition="left"
          >
            Export Data
          </Button>
        </div>
      </div>
      {/* Processing Statistics */}
      <div className="p-4 bg-card border border-border rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="BarChart3" size={20} className="text-warning" />
          <span>Processing Stats</span>
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-xs text-muted-foreground">Documents</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-success">0</div>
            <div className="text-xs text-muted-foreground">Processed</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-warning">0</div>
            <div className="text-xs text-muted-foreground">Low Confidence</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-destructive">0</div>
            <div className="text-xs text-muted-foreground">Errors</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingControls;