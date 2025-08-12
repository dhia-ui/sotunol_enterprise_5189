import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ModuleSelection = ({ moduleData, selectedModules = [], onModuleSelection, onNext }) => {
  const modules = [
    {
      id: 'pos',
      name: 'POS Management',
      icon: 'MapPin',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      description: 'Point-of-sale locations, transactions, and geographic data'
    },
    {
      id: 'cheques',
      name: 'Cheques Management',
      icon: 'CreditCard',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20',
      description: 'Cheque processing records, validations, and status tracking'
    },
    {
      id: 'kimbiales',
      name: 'Kimbiales Management',
      icon: 'Receipt',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      description: 'Specialized kimbiales documents and processing workflows'
    },
    {
      id: 'factures',
      name: 'Factures Management',
      icon: 'FileText',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      description: 'Invoice processing, billing records, and approval workflows'
    }
  ];

  const handleModuleToggle = (moduleId) => {
    const newSelection = selectedModules?.includes(moduleId)
      ? selectedModules?.filter(id => id !== moduleId)
      : [...selectedModules, moduleId];
    
    onModuleSelection(newSelection);
  };

  const handleSelectAll = () => {
    const allModuleIds = modules?.map(m => m?.id);
    onModuleSelection(selectedModules?.length === modules?.length ? [] : allModuleIds);
  };

  const totalRecords = selectedModules?.reduce((sum, moduleId) => 
    sum + (moduleData?.[moduleId]?.count || 0), 0
  );

  return (
    <div className="bg-card border border-border rounded-lg shadow-synthwave p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">Select Data Sources</h3>
            <p className="text-muted-foreground">
              Choose which modules to include in your export. You can select multiple sources.
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            iconName={selectedModules?.length === modules?.length ? "Square" : "CheckSquare"}
            iconPosition="left"
            iconSize={16}
          >
            {selectedModules?.length === modules?.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules?.map((module) => {
            const isSelected = selectedModules?.includes(module?.id);
            const data = moduleData?.[module?.id];
            
            return (
              <div
                key={module?.id}
                onClick={() => handleModuleToggle(module?.id)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-synthwave ${
                  isSelected 
                    ? `${module?.borderColor} ${module?.bgColor}` 
                    : 'border-border hover:border-muted-foreground/20'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Selection Checkbox */}
                  <div className="mt-1">
                    <div className={`w-5 h-5 border-2 rounded transition-all duration-200 ${
                      isSelected 
                        ? 'bg-primary border-primary' :'border-muted-foreground'
                    }`}>
                      {isSelected && (
                        <Icon name="Check" size={12} className="text-primary-foreground ml-0.5 mt-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Module Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${module?.bgColor}`}>
                        <Icon name={module?.icon} size={18} className={module?.color} />
                      </div>
                      <h4 className="text-sm font-medium text-foreground">
                        {module?.name}
                      </h4>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3">
                      {module?.description}
                    </p>

                    {data && (
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Records:</span>
                          <span className="text-xs font-medium text-foreground">
                            {data?.count?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Updated:</span>
                          <span className="text-xs text-success">
                            {data?.lastUpdated}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selection Summary */}
        {selectedModules?.length > 0 && (
          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Database" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {selectedModules?.length} module{selectedModules?.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-primary">
                  {totalRecords?.toLocaleString()}
                </span>
                <p className="text-xs text-muted-foreground">Total records</p>
              </div>
            </div>
          </div>
        )}

        {/* Next Button */}
        <div className="flex justify-end pt-4 border-t border-border">
          <Button
            variant="default"
            onClick={onNext}
            disabled={selectedModules?.length === 0}
            iconName="ArrowRight"
            iconPosition="right"
            iconSize={16}
          >
            Continue to Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModuleSelection;