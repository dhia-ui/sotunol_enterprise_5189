import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ExtractedDataPanel = ({ 
  extractedData = [], 
  onDataUpdate, 
  onValidate, 
  confidenceThreshold = 0.6 
}) => {
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [filter, setFilter] = useState('all');

  const handleEdit = (field) => {
    setEditingField(field?.id);
    setEditValue(field?.value);
  };

  const handleSave = () => {
    if (editingField) {
      onDataUpdate(editingField, editValue);
      setEditingField(null);
      setEditValue('');
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'text-success';
    if (confidence >= 0.6) return 'text-warning';
    return 'text-destructive';
  };

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 0.9) return 'CheckCircle';
    if (confidence >= 0.6) return 'AlertTriangle';
    return 'XCircle';
  };

  const filteredData = extractedData?.filter(item => {
    if (filter === 'high') return item?.confidence >= 0.9;
    if (filter === 'medium') return item?.confidence >= 0.6 && item?.confidence < 0.9;
    if (filter === 'low') return item?.confidence < 0.6;
    return item?.confidence >= confidenceThreshold;
  });

  const groupedData = filteredData?.reduce((acc, item) => {
    const category = item?.category || 'General';
    if (!acc?.[category]) acc[category] = [];
    acc?.[category]?.push(item);
    return acc;
  }, {});

  if (extractedData?.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-border">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Icon name="Database" size={32} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">No Data Extracted</h3>
            <p className="text-sm text-muted-foreground">
              Process a document to see extracted data
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Database" size={20} className="text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Extracted Data</h3>
              <p className="text-xs text-muted-foreground">
                {filteredData?.length} fields extracted
              </p>
            </div>
          </div>

          <Button
            onClick={onValidate}
            variant="outline"
            size="sm"
            iconName="CheckSquare"
            iconPosition="left"
          >
            Validate All
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Filter:</span>
          {[
            { key: 'all', label: 'All', count: extractedData?.length },
            { key: 'high', label: 'High', count: extractedData?.filter(i => i?.confidence >= 0.9)?.length },
            { key: 'medium', label: 'Medium', count: extractedData?.filter(i => i?.confidence >= 0.6 && i?.confidence < 0.9)?.length },
            { key: 'low', label: 'Low', count: extractedData?.filter(i => i?.confidence < 0.6)?.length }
          ]?.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 text-xs rounded-full transition-colors duration-150 ${
                filter === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>
      {/* Data List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(groupedData)?.map(([category, items]) => (
          <div key={category} className="space-y-3">
            <h4 className="font-medium text-foreground text-sm flex items-center space-x-2">
              <Icon name="Folder" size={16} className="text-secondary" />
              <span>{category}</span>
              <span className="text-xs text-muted-foreground">({items?.length})</span>
            </h4>

            <div className="space-y-2">
              {items?.map((field) => (
                <div
                  key={field?.id}
                  className="p-3 bg-background border border-border rounded-lg hover:shadow-sm transition-shadow duration-150"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon
                        name={getConfidenceIcon(field?.confidence)}
                        size={16}
                        className={getConfidenceColor(field?.confidence)}
                      />
                      <span className="font-medium text-foreground text-sm">
                        {field?.label}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${getConfidenceColor(field?.confidence)}`}>
                        {Math.round(field?.confidence * 100)}%
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(field)}
                        className="w-6 h-6"
                      >
                        <Icon name="Edit2" size={12} />
                      </Button>
                    </div>
                  </div>

                  {editingField === field?.id ? (
                    <div className="space-y-2">
                      <Input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e?.target?.value)}
                        className="text-sm"
                        placeholder="Edit extracted value..."
                      />
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={handleSave}
                          variant="default"
                          size="xs"
                          iconName="Check"
                          iconPosition="left"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="ghost"
                          size="xs"
                          iconName="X"
                          iconPosition="left"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-sm text-foreground font-mono bg-muted/30 p-2 rounded">
                        {field?.value || 'No value detected'}
                      </div>
                      {field?.boundingBox && (
                        <div className="text-xs text-muted-foreground">
                          Position: ({field?.boundingBox?.x}, {field?.boundingBox?.y}) 
                          {field?.boundingBox?.width}×{field?.boundingBox?.height}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Summary Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-success">
              {extractedData?.filter(i => i?.confidence >= 0.9)?.length}
            </div>
            <div className="text-xs text-muted-foreground">High Confidence</div>
          </div>
          <div>
            <div className="text-lg font-bold text-warning">
              {extractedData?.filter(i => i?.confidence >= 0.6 && i?.confidence < 0.9)?.length}
            </div>
            <div className="text-xs text-muted-foreground">Medium Confidence</div>
          </div>
          <div>
            <div className="text-lg font-bold text-destructive">
              {extractedData?.filter(i => i?.confidence < 0.6)?.length}
            </div>
            <div className="text-xs text-muted-foreground">Low Confidence</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractedDataPanel;