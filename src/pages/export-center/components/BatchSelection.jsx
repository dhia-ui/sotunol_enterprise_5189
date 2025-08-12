import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const BatchSelection = ({ selectedModules = [], filters = {}, selectedRecords = [], onRecordSelection, onNext, onPrev }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock data generation based on selected modules
  const generateMockData = () => {
    const mockRecords = [];
    
    selectedModules?.forEach(moduleId => {
      const recordCount = Math.floor(Math.random() * 50) + 10;
      
      for (let i = 1; i <= recordCount; i++) {
        mockRecords?.push({
          id: `${moduleId}_${i}`,
          module: moduleId,
          title: getRecordTitle(moduleId, i),
          status: getRandomStatus(),
          date: getRandomDate(),
          size: getRandomSize(),
          details: getRecordDetails(moduleId, i)
        });
      }
    });
    
    return mockRecords;
  };

  const getRecordTitle = (module, index) => {
    const titles = {
      pos: `POS Location ${index?.toString()?.padStart(3, '0')}`,
      cheques: `Cheque ${new Date()?.getFullYear()}-${index?.toString()?.padStart(4, '0')}`,
      kimbiales: `Kimbiale Document KIM-${index?.toString()?.padStart(4, '0')}`,
      factures: `Invoice INV-${new Date()?.getFullYear()}-${index?.toString()?.padStart(3, '0')}`
    };
    return titles?.[module] || `Record ${index}`;
  };

  const getRandomStatus = () => {
    const statuses = ['active', 'pending', 'approved', 'completed', 'cancelled'];
    return statuses?.[Math.floor(Math.random() * statuses?.length)];
  };

  const getRandomDate = () => {
    const start = new Date(2025, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date?.toISOString()?.split('T')?.[0];
  };

  const getRandomSize = () => {
    return `${(Math.random() * 500 + 50)?.toFixed(1)} KB`;
  };

  const getRecordDetails = (module, index) => {
    const details = {
      pos: `Tunisia, ${['Tunis', 'Sfax', 'Sousse']?.[Math.floor(Math.random() * 3)]}`,
      cheques: `${(Math.random() * 10000 + 1000)?.toFixed(2)} TND`,
      kimbiales: `Document Type: ${['Standard', 'Express', 'Premium']?.[Math.floor(Math.random() * 3)]}`,
      factures: `Client: ${['Enterprise Corp', 'Tech Solutions', 'Global Trade']?.[Math.floor(Math.random() * 3)]}`
    };
    return details?.[module] || `Details for record ${index}`;
  };

  const [mockData, setMockData] = useState([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setMockData(generateMockData());
      setLoading(false);
    }, 1000);
  }, [selectedModules, filters]);

  // Filter and search logic
  const filteredData = mockData?.filter(record =>
    record?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    record?.details?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData?.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentData = filteredData?.slice(startIndex, startIndex + recordsPerPage);

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = currentData?.map(record => record?.id);
      const newSelection = [...new Set([...selectedRecords, ...allIds])];
      onRecordSelection(newSelection);
    } else {
      const currentIds = currentData?.map(record => record?.id);
      const newSelection = selectedRecords?.filter(id => !currentIds?.includes(id));
      onRecordSelection(newSelection);
    }
  };

  const handleRecordToggle = (recordId) => {
    const newSelection = selectedRecords?.includes(recordId)
      ? selectedRecords?.filter(id => id !== recordId)
      : [...selectedRecords, recordId];
    
    onRecordSelection(newSelection);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'text-success bg-success/10',
      pending: 'text-warning bg-warning/10',
      approved: 'text-primary bg-primary/10',
      completed: 'text-success bg-success/10',
      cancelled: 'text-destructive bg-destructive/10'
    };
    return colors?.[status] || 'text-muted-foreground bg-muted/10';
  };

  const allCurrentSelected = currentData?.length > 0 && currentData?.every(record => 
    selectedRecords?.includes(record?.id)
  );

  return (
    <div className="bg-card border border-border rounded-lg shadow-synthwave p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-2">Batch Selection</h3>
          <p className="text-muted-foreground">
            Review and select specific records for export. Use filters to narrow down your selection.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              {selectedRecords?.length} of {filteredData?.length} selected
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRecordSelection([])}
              disabled={selectedRecords?.length === 0}
            >
              Clear Selection
            </Button>
          </div>
        </div>

        {/* Records Table */}
        {loading ? (
          <div className="text-center py-8">
            <Icon name="Loader2" size={32} className="text-primary mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading records...</p>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <Checkbox
                        checked={allCurrentSelected}
                        onChange={(e) => handleSelectAll(e?.target?.checked)}
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Record</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Module</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Size</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData?.map((record, index) => (
                    <tr key={record?.id} className={`border-b border-border ${index % 2 === 0 ? 'bg-muted/10' : ''}`}>
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selectedRecords?.includes(record?.id)}
                          onChange={() => handleRecordToggle(record?.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-medium text-foreground">{record?.title}</div>
                          <div className="text-xs text-muted-foreground">{record?.details}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                          {record?.module?.charAt(0)?.toUpperCase() + record?.module?.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record?.status)}`}>
                          {record?.status?.charAt(0)?.toUpperCase() + record?.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{record?.date}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{record?.size}</td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Eye"
                          iconSize={14}
                        >
                          Preview
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + recordsPerPage, filteredData?.length)} of {filteredData?.length} records
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                iconName="ChevronLeft"
                iconSize={16}
              />
              
              <span className="text-sm text-foreground">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                iconName="ChevronRight"
                iconSize={16}
              />
            </div>
          </div>
        )}

        {/* Selection Summary */}
        {selectedRecords?.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {selectedRecords?.length} record{selectedRecords?.length !== 1 ? 's' : ''} selected for export
                </span>
              </div>
              <div className="text-sm text-primary">
                Estimated size: {(selectedRecords?.length * 0.8)?.toFixed(1)} MB
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onPrev}
            iconName="ArrowLeft"
            iconPosition="left"
            iconSize={16}
          >
            Back to Configuration
          </Button>
          
          <Button
            variant="default"
            onClick={onNext}
            disabled={selectedRecords?.length === 0}
            iconName="ArrowRight"
            iconPosition="right"
            iconSize={16}
          >
            Continue to Scheduling
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BatchSelection;