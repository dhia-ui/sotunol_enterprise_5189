import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import ModuleSelection from './components/ModuleSelection';
import AdvancedFiltering from './components/AdvancedFiltering';
import ExportConfiguration from './components/ExportConfiguration';
import BatchSelection from './components/BatchSelection';
import SchedulingOptions from './components/SchedulingOptions';
import ExportHistory from './components/ExportHistory';

const ExportCenter = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState('modules');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Mock current user
  const currentUser = {
    id: 1,
    name: 'Data Analyst',
    email: 'analyst@sotunol.com',
    role: 'data-manager',
    avatar: null
  };

  // Export workflow state
  const [exportConfig, setExportConfig] = useState({
    selectedModules: [],
    filters: {
      dateRange: { from: '', to: '' },
      status: '',
      customFields: []
    },
    format: 'csv',
    template: 'standard',
    batchSize: 1000,
    selectedRecords: [],
    scheduling: {
      immediate: true,
      scheduled: false,
      recurring: false,
      schedule: '',
      emailNotification: true,
      recipients: []
    }
  });

  // Mock data for modules and records
  const [moduleData, setModuleData] = useState({
    pos: { count: 127, lastUpdated: '2 minutes ago', description: 'POS locations and transactions' },
    cheques: { count: 4521, lastUpdated: '5 minutes ago', description: 'Cheque processing records' },
    kimbiales: { count: 2847, lastUpdated: '8 minutes ago', description: 'Kimbiales document records' },
    factures: { count: 3234, lastUpdated: '12 minutes ago', description: 'Invoice and billing records' }
  });

  // Export history mock data
  const [exportHistory, setExportHistory] = useState([
    {
      id: 1,
      name: 'Monthly_Cheques_Report_Aug2025.csv',
      modules: ['cheques'],
      format: 'csv',
      size: '2.3 MB',
      records: 1247,
      status: 'completed',
      createdAt: '2025-08-12T10:30:00Z',
      downloadUrl: '#',
      expiresAt: '2025-08-19T10:30:00Z'
    },
    {
      id: 2,
      name: 'POS_Locations_Backup_Aug2025.json',
      modules: ['pos'],
      format: 'json',
      size: '876 KB',
      records: 127,
      status: 'completed',
      createdAt: '2025-08-11T15:45:00Z',
      downloadUrl: '#',
      expiresAt: '2025-08-18T15:45:00Z'
    },
    {
      id: 3,
      name: 'Financial_Summary_Q3_2025.xlsx',
      modules: ['factures', 'cheques'],
      format: 'excel',
      size: '4.7 MB',
      records: 2891,
      status: 'processing',
      createdAt: '2025-08-12T14:15:00Z',
      progress: 75
    },
    {
      id: 4,
      name: 'All_Documents_Archive.pdf',
      modules: ['pos', 'cheques', 'kimbiales', 'factures'],
      format: 'pdf',
      size: '12.4 MB',
      records: 8734,
      status: 'failed',
      createdAt: '2025-08-10T09:20:00Z',
      error: 'Memory limit exceeded'
    }
  ]);

  const steps = [
    { id: 'modules', label: 'Select Modules', icon: 'Database', completed: exportConfig?.selectedModules?.length > 0 },
    { id: 'filters', label: 'Apply Filters', icon: 'Filter', completed: false },
    { id: 'config', label: 'Export Config', icon: 'Settings', completed: false },
    { id: 'batch', label: 'Batch Selection', icon: 'List', completed: false },
    { id: 'schedule', label: 'Schedule Export', icon: 'Calendar', completed: false }
  ];

  // Simulate export process
  const handleStartExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    const totalSteps = 100;
    for (let i = 0; i <= totalSteps; i += 5) {
      setExportProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Add new export to history
    const newExport = {
      id: exportHistory?.length + 1,
      name: `Export_${new Date()?.toISOString()?.split('T')?.[0]}.${exportConfig?.format}`,
      modules: exportConfig?.selectedModules,
      format: exportConfig?.format,
      size: '1.8 MB',
      records: 1547,
      status: 'completed',
      createdAt: new Date()?.toISOString(),
      downloadUrl: '#',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)?.toISOString()
    };

    setExportHistory(prev => [newExport, ...prev]);
    setIsExporting(false);
    setCurrentStep('modules');
    setExportConfig(prev => ({ ...prev, selectedModules: [], selectedRecords: [] }));
  };

  const handleUpdateConfig = (key, value) => {
    setExportConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNextStep = () => {
    const stepOrder = ['modules', 'filters', 'config', 'batch', 'schedule'];
    const currentIndex = stepOrder?.indexOf(currentStep);
    if (currentIndex < stepOrder?.length - 1) {
      setCurrentStep(stepOrder?.[currentIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    const stepOrder = ['modules', 'filters', 'config', 'batch', 'schedule'];
    const currentIndex = stepOrder?.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder?.[currentIndex - 1]);
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'Home', isActive: false },
    { label: 'Tools', path: '/tools', icon: 'Settings', isActive: false },
    { label: 'Export Center', path: '/export-center', icon: 'Download', isActive: true }
  ];

  const viewOptions = [
    { value: 'wizard', label: 'Step-by-Step Wizard' },
    { value: 'history', label: 'Export History' }
  ];

  const [currentView, setCurrentView] = useState('wizard');

  return (
    <div className="min-h-screen bg-background">
      <Header user={currentUser} />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'
      } pt-16 pb-20 lg:pb-8`}>
        <div className="p-6 space-y-6">
          {/* Breadcrumb */}
          <Breadcrumb customItems={breadcrumbItems} />

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground font-heading">
                Export Center
              </h1>
              <p className="text-muted-foreground mt-2">
                Centralized data export capabilities across all Sotunol Enterprise modules with advanced filtering and scheduling
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Select
                options={viewOptions}
                value={currentView}
                onChange={setCurrentView}
                className="w-48"
              />
              
              {currentView === 'wizard' && (
                <Button
                  variant="default"
                  onClick={() => navigate('/dashboard')}
                  iconName="ArrowLeft"
                  iconPosition="left"
                  iconSize={16}
                >
                  Back to Dashboard
                </Button>
              )}
            </div>
          </div>

          {/* Content */}
          {currentView === 'wizard' && (
            <>
              {/* Progress Steps */}
              <div className="bg-card border border-border rounded-lg shadow-synthwave p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-foreground">Export Wizard</h3>
                  <span className="text-sm text-muted-foreground">
                    Step {steps?.findIndex(s => s?.id === currentStep) + 1} of {steps?.length}
                  </span>
                </div>

                <div className="flex items-center space-x-4 overflow-x-auto">
                  {steps?.map((step, index) => (
                    <div key={step?.id} className="flex items-center space-x-4 whitespace-nowrap">
                      <button
                        onClick={() => setCurrentStep(step?.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                          currentStep === step?.id 
                            ? 'bg-primary text-primary-foreground' 
                            : step?.completed 
                              ? 'bg-success/10 text-success border border-success/20' :'bg-muted/30 text-muted-foreground'
                        }`}
                      >
                        <Icon 
                          name={step?.completed ? 'CheckCircle' : step?.icon} 
                          size={16} 
                        />
                        <span className="text-sm font-medium">{step?.label}</span>
                      </button>
                      
                      {index < steps?.length - 1 && (
                        <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className="min-h-[500px]">
                {currentStep === 'modules' && (
                  <ModuleSelection
                    moduleData={moduleData}
                    selectedModules={exportConfig?.selectedModules}
                    onModuleSelection={(modules) => handleUpdateConfig('selectedModules', modules)}
                    onNext={handleNextStep}
                  />
                )}

                {currentStep === 'filters' && (
                  <AdvancedFiltering
                    selectedModules={exportConfig?.selectedModules}
                    filters={exportConfig?.filters}
                    onFiltersChange={(filters) => handleUpdateConfig('filters', filters)}
                    onNext={handleNextStep}
                    onPrev={handlePrevStep}
                  />
                )}

                {currentStep === 'config' && (
                  <ExportConfiguration
                    config={exportConfig}
                    onConfigChange={(config) => setExportConfig(prev => ({ ...prev, ...config }))}
                    onNext={handleNextStep}
                    onPrev={handlePrevStep}
                  />
                )}

                {currentStep === 'batch' && (
                  <BatchSelection
                    selectedModules={exportConfig?.selectedModules}
                    filters={exportConfig?.filters}
                    selectedRecords={exportConfig?.selectedRecords}
                    onRecordSelection={(records) => handleUpdateConfig('selectedRecords', records)}
                    onNext={handleNextStep}
                    onPrev={handlePrevStep}
                  />
                )}

                {currentStep === 'schedule' && (
                  <SchedulingOptions
                    scheduling={exportConfig?.scheduling}
                    onSchedulingChange={(scheduling) => handleUpdateConfig('scheduling', scheduling)}
                    onExport={handleStartExport}
                    onPrev={handlePrevStep}
                    isExporting={isExporting}
                  />
                )}
              </div>
            </>
          )}

          {currentView === 'history' && (
            <ExportHistory
              history={exportHistory}
              onReExport={(exportItem) => {
                setCurrentView('wizard');
                setCurrentStep('modules');
                setExportConfig(prev => ({
                  ...prev,
                  selectedModules: exportItem?.modules
                }));
              }}
            />
          )}
        </div>
      </main>

      {/* Export Progress Modal */}
      {isExporting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg shadow-synthwave-lg p-6 w-full max-w-md">
            <div className="text-center space-y-4">
              <Icon name="Download" size={32} className="text-primary mx-auto" />
              <h3 className="text-lg font-medium text-foreground">Exporting Data</h3>
              <p className="text-muted-foreground">
                Processing {exportConfig?.selectedModules?.join(', ')} data...
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-foreground">{exportProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportCenter;