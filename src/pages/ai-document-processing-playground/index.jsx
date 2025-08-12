import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import UploadZone from './components/UploadZone';
import ProcessingControls from './components/ProcessingControls';
import DocumentViewer from './components/DocumentViewer';
import ExtractedDataPanel from './components/ExtractedDataPanel';

const AIDocumentProcessingPlayground = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('synthwave');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [ocrEnabled, setOcrEnabled] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.6);
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const [extractedData, setExtractedData] = useState([]);
  const [processingStats, setProcessingStats] = useState({
    totalDocuments: 0,
    processed: 0,
    lowConfidence: 0,
    errors: 0
  });

  // Mock OCR data for demonstration
  const mockOcrResults = {
    cheque: [
      {
        id: 1,
        x: 50, y: 30, width: 200, height: 25,
        text: "PAY TO THE ORDER OF",
        confidence: 0.95,
        category: "Header"
      },
      {
        id: 2,
        x: 300, y: 30, width: 150, height: 25,
        text: "John Smith",
        confidence: 0.88,
        category: "Payee"
      },
      {
        id: 3,
        x: 50, y: 80, width: 100, height: 30,
        text: "$1,250.00",
        confidence: 0.92,
        category: "Amount"
      },
      {
        id: 4,
        x: 50, y: 120, width: 300, height: 25,
        text: "One Thousand Two Hundred Fifty Dollars",
        confidence: 0.85,
        category: "Amount in Words"
      },
      {
        id: 5,
        x: 350, y: 150, width: 100, height: 25,
        text: "12/08/2025",
        confidence: 0.90,
        category: "Date"
      }
    ],
    invoice: [
      {
        id: 1,
        x: 50, y: 20, width: 150, height: 30,
        text: "INVOICE",
        confidence: 0.98,
        category: "Header"
      },
      {
        id: 2,
        x: 300, y: 20, width: 100, height: 25,
        text: "INV-2025-001",
        confidence: 0.94,
        category: "Invoice Number"
      },
      {
        id: 3,
        x: 50, y: 80, width: 200, height: 25,
        text: "Sotunol Enterprise Ltd",
        confidence: 0.91,
        category: "Company"
      },
      {
        id: 4,
        x: 50, y: 200, width: 80, height: 25,
        text: "Total: $2,500.00",
        confidence: 0.87,
        category: "Total Amount"
      }
    ]
  };

  const mockExtractedData = {
    cheque: [
      { id: 1, label: "Payee Name", value: "John Smith", confidence: 0.88, category: "Payee Information" },
      { id: 2, label: "Amount", value: "$1,250.00", confidence: 0.92, category: "Financial" },
      { id: 3, label: "Amount in Words", value: "One Thousand Two Hundred Fifty Dollars", confidence: 0.85, category: "Financial" },
      { id: 4, label: "Date", value: "12/08/2025", confidence: 0.90, category: "Date Information" },
      { id: 5, label: "Bank Name", value: "First National Bank", confidence: 0.76, category: "Bank Information" },
      { id: 6, label: "Account Number", value: "****1234", confidence: 0.82, category: "Bank Information" }
    ],
    invoice: [
      { id: 1, label: "Invoice Number", value: "INV-2025-001", confidence: 0.94, category: "Document Info" },
      { id: 2, label: "Company Name", value: "Sotunol Enterprise Ltd", confidence: 0.91, category: "Company Info" },
      { id: 3, label: "Total Amount", value: "$2,500.00", confidence: 0.87, category: "Financial" },
      { id: 4, label: "Issue Date", value: "12/08/2025", confidence: 0.89, category: "Date Information" },
      { id: 5, label: "Due Date", value: "12/22/2025", confidence: 0.83, category: "Date Information" }
    ]
  };

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'synthwave';
    setCurrentTheme(savedTheme);
  }, []);

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
  };

  const handleFileUpload = (files) => {
    setUploadedFiles(prev => [...prev, ...files]);
    if (files?.length > 0 && !selectedDocument) {
      setSelectedDocument(files?.[0]);
    }
    setProcessingStats(prev => ({
      ...prev,
      totalDocuments: prev?.totalDocuments + files?.length
    }));
  };

  const handleProcessStart = async () => {
    if (!selectedDocument || !ocrEnabled) return;

    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Determine document type and use appropriate mock data
    const documentType = selectedDocument?.name?.toLowerCase()?.includes('cheque') ? 'cheque' : 'invoice';
    const mockBoxes = mockOcrResults?.[documentType] || mockOcrResults?.invoice;
    const mockData = mockExtractedData?.[documentType] || mockExtractedData?.invoice;

    setBoundingBoxes(mockBoxes);
    setExtractedData(mockData);
    
    // Update stats
    setProcessingStats(prev => ({
      ...prev,
      processed: prev?.processed + 1,
      lowConfidence: prev?.lowConfidence + mockData?.filter(d => d?.confidence < 0.6)?.length
    }));

    setIsProcessing(false);
  };

  const handleBoundingBoxClick = (box) => {
    console.log('Bounding box clicked:', box);
  };

  const handleBoundingBoxUpdate = (boxId, updates) => {
    setBoundingBoxes(prev => 
      prev?.map(box => box?.id === boxId ? { ...box, ...updates } : box)
    );
    
    // Update corresponding extracted data
    setExtractedData(prev =>
      prev?.map(data => 
        data?.boundingBox?.id === boxId ? { ...data, value: updates?.text } : data
      )
    );
  };

  const handleDataUpdate = (fieldId, newValue) => {
    setExtractedData(prev =>
      prev?.map(field => field?.id === fieldId ? { ...field, value: newValue } : field)
    );
  };

  const handleValidateAll = () => {
    // Mock validation process
    console.log('Validating all extracted data...');
  };

  const handleExport = ({ module, format }) => {
    console.log(`Exporting to ${module} in ${format} format`);
    
    // Navigate to the selected module with exported data
    const routes = {
      cheques: '/cheques-management',
      kimbiales: '/kimbiales-management',
      factures: '/factures-management'
    };
    
    if (routes?.[module]) {
      navigate(routes?.[module], { 
        state: { 
          importedData: extractedData,
          sourceDocument: selectedDocument?.name 
        }
      });
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/', icon: 'Home', isActive: false },
    { label: 'AI Tools', path: '/ai-tools', icon: 'Brain', isActive: false },
    { label: 'Document Playground', path: '/ai-document-processing-playground', icon: 'Cpu', isActive: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={{ name: 'AI Specialist', email: 'ai@sotunol.com', role: 'Document Analyst' }}
        onThemeChange={handleThemeChange}
        currentTheme={currentTheme}
      />
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'
      } pt-16 pb-20 lg:pb-0`}>
        <div className="p-6">
          <Breadcrumb customItems={breadcrumbItems} />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Icon name="Brain" size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground font-heading">
                    AI Document Processing Playground
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Upload documents and leverage OCR technology with interactive confidence visualization
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="HelpCircle"
                  iconPosition="left"
                  onClick={() => navigate('/help')}
                >
                  Help Guide
                </Button>
                <Button
                  variant="default"
                  iconName="Settings"
                  iconPosition="left"
                  onClick={() => navigate('/settings')}
                >
                  Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[calc(100vh-280px)]">
            {/* Left Panel - Upload & Controls */}
            <div className="xl:col-span-5 space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Icon name="Upload" size={20} className="text-primary" />
                  <span>Document Upload</span>
                </h2>
                
                <UploadZone
                  onFileUpload={handleFileUpload}
                  isProcessing={isProcessing}
                  acceptedFormats={['.png', '.jpg', '.jpeg', '.pdf', '.tiff']}
                />
              </div>

              <ProcessingControls
                onProcessStart={handleProcessStart}
                onExport={handleExport}
                isProcessing={isProcessing}
                confidenceThreshold={confidenceThreshold}
                onConfidenceChange={setConfidenceThreshold}
                ocrEnabled={ocrEnabled}
                onOcrToggle={() => setOcrEnabled(!ocrEnabled)}
              />
            </div>

            {/* Right Panel - Document Viewer */}
            <div className="xl:col-span-7">
              <div className="bg-card border border-border rounded-lg p-6 h-full">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Icon name="Eye" size={20} className="text-secondary" />
                  <span>Document Viewer</span>
                  {selectedDocument && (
                    <span className="text-sm text-muted-foreground">
                      - {selectedDocument?.name}
                    </span>
                  )}
                </h2>

                <div className="h-[calc(100%-60px)]">
                  <DocumentViewer
                    selectedDocument={selectedDocument}
                    boundingBoxes={boundingBoxes}
                    onBoundingBoxClick={handleBoundingBoxClick}
                    onBoundingBoxUpdate={handleBoundingBoxUpdate}
                    confidenceThreshold={confidenceThreshold}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Panel - Extracted Data */}
          <div className="mt-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center space-x-2">
                <Icon name="Database" size={20} className="text-accent" />
                <span>Extracted Data & Manual Corrections</span>
              </h2>

              <div className="h-80">
                <ExtractedDataPanel
                  extractedData={extractedData}
                  onDataUpdate={handleDataUpdate}
                  onValidate={handleValidateAll}
                  confidenceThreshold={confidenceThreshold}
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="FileText" size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{processingStats?.totalDocuments}</div>
                  <div className="text-sm text-muted-foreground">Total Documents</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} className="text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{processingStats?.processed}</div>
                  <div className="text-sm text-muted-foreground">Processed</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{processingStats?.lowConfidence}</div>
                  <div className="text-sm text-muted-foreground">Low Confidence</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <Icon name="XCircle" size={20} className="text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{processingStats?.errors}</div>
                  <div className="text-sm text-muted-foreground">Processing Errors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIDocumentProcessingPlayground;