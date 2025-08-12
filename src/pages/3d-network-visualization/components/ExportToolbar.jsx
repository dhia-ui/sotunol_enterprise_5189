import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ExportToolbar = ({ onScreenshot, onDataExport, onViewPreset }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('png');

  const exportFormatOptions = [
    { value: 'png', label: 'PNG Image', description: 'High-quality screenshot' },
    { value: 'csv', label: 'CSV Data', description: 'Node and connection data' },
    { value: 'json', label: 'JSON Data', description: 'Complete network structure' },
    { value: 'pdf', label: 'PDF Report', description: 'Formatted analysis report' }
  ];

  const viewPresetOptions = [
    { value: 'overview', label: 'Network Overview', description: 'Full network view' },
    { value: 'performance', label: 'Performance Analysis', description: 'Focus on metrics' },
    { value: 'connections', label: 'Connection Map', description: 'Highlight relationships' },
    { value: 'issues', label: 'Issue Detection', description: 'Show problem areas' }
  ];

  const handleScreenshot = async () => {
    setIsExporting(true);
    try {
      if (window.takeNetworkScreenshot) {
        window.takeNetworkScreenshot();
      }
      onScreenshot();
    } catch (error) {
      console.error('Screenshot failed:', error);
    } finally {
      setTimeout(() => setIsExporting(false), 1000);
    }
  };

  const handleDataExport = async () => {
    setIsExporting(true);
    try {
      // Mock export functionality
      const mockData = {
        timestamp: new Date()?.toISOString(),
        format: exportFormat,
        nodes: 8,
        connections: 8,
        filters_applied: 'All active nodes',
        export_size: '2.4 MB'
      };

      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onDataExport(mockData);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewPreset = (preset) => {
    onViewPreset(preset);
  };

  return (
    <div className="fixed top-20 right-4 z-40 bg-card border border-border rounded-lg shadow-synthwave-lg p-4">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <Icon name="Download" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Export & Tools</h3>
        </div>

        {/* Screenshot */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Quick Actions</label>
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleScreenshot}
              disabled={isExporting}
              loading={isExporting && exportFormat === 'png'}
              iconName="Camera"
              iconPosition="left"
              iconSize={14}
              fullWidth
            >
              Screenshot (PNG)
            </Button>
          </div>
        </div>

        {/* Data Export */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Data Export</label>
          <Select
            options={exportFormatOptions}
            value={exportFormat}
            onChange={setExportFormat}
            placeholder="Select format"
          />
          <Button
            variant="default"
            size="sm"
            onClick={handleDataExport}
            disabled={isExporting}
            loading={isExporting && exportFormat !== 'png'}
            iconName="Download"
            iconPosition="left"
            iconSize={14}
            fullWidth
          >
            Export Data
          </Button>
        </div>

        {/* View Presets */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">View Presets</label>
          <div className="grid grid-cols-1 gap-1">
            {viewPresetOptions?.map((preset) => (
              <Button
                key={preset?.value}
                variant="ghost"
                size="sm"
                onClick={() => handleViewPreset(preset?.value)}
                className="justify-start text-left"
              >
                <div>
                  <div className="text-sm font-medium">{preset?.label}</div>
                  <div className="text-xs text-muted-foreground">{preset?.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Export History */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Recent Exports</label>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            <div className="flex items-center justify-between text-xs p-2 bg-muted/30 rounded">
              <div>
                <div className="font-medium">network-viz-2025-08-12.png</div>
                <div className="text-muted-foreground">2 minutes ago</div>
              </div>
              <Icon name="Download" size={12} className="text-primary" />
            </div>
            <div className="flex items-center justify-between text-xs p-2 bg-muted/30 rounded">
              <div>
                <div className="font-medium">network-data-export.csv</div>
                <div className="text-muted-foreground">15 minutes ago</div>
              </div>
              <Icon name="Download" size={12} className="text-primary" />
            </div>
            <div className="flex items-center justify-between text-xs p-2 bg-muted/30 rounded">
              <div>
                <div className="font-medium">performance-report.pdf</div>
                <div className="text-muted-foreground">1 hour ago</div>
              </div>
              <Icon name="Download" size={12} className="text-primary" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            Last updated: {new Date()?.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportToolbar;