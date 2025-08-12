import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ViewControls from './components/ViewControls';
import NetworkCanvas from './components/NetworkCanvas';
import NodeDetailsPopup from './components/NodeDetailsPopup';
import ExportToolbar from './components/ExportToolbar';
import NetworkStats from './components/NetworkStats';

const NetworkVisualization3D = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('synthwave');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // 3D Visualization State
  const [nodeSize, setNodeSize] = useState(1.0);
  const [showConnections, setShowConnections] = useState(true);
  const [colorScheme, setColorScheme] = useState('status');
  const [filters, setFilters] = useState({
    dateFrom: '2025-01-01',
    dateTo: '2025-08-12',
    documentType: 'all',
    status: 'all'
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodePopupPosition, setNodePopupPosition] = useState({ x: 0, y: 0 });

  // Mock network data
  const networkData = {
    nodes: [
      { id: 'pos_1', type: 'pos', status: 'active', name: 'Tunis Central POS', location: 'Tunis', transactions: 1250, performance: 95.2, position: [0, 0, 0] },
      { id: 'pos_2', type: 'pos', status: 'active', name: 'Sfax Branch POS', location: 'Sfax', transactions: 890, performance: 92.1, position: [5, 2, -3] },
      { id: 'pos_3', type: 'pos', status: 'issues', name: 'Sousse POS', location: 'Sousse', transactions: 340, performance: 67.8, position: [-3, 1, 4] },
      { id: 'pos_4', type: 'processing', status: 'active', name: 'Central Processing', location: 'Tunis', transactions: 2500, performance: 98.5, position: [2, -2, 1] },
      { id: 'pos_5', type: 'pos', status: 'processing', name: 'Bizerte POS', location: 'Bizerte', transactions: 567, performance: 88.3, position: [-4, 3, -2] },
      { id: 'pos_6', type: 'pos', status: 'active', name: 'Gabes POS', location: 'Gabes', transactions: 723, performance: 91.7, position: [3, -1, 5] },
      { id: 'pos_7', type: 'processing', status: 'active', name: 'Backup Center', location: 'Sfax', transactions: 1800, performance: 96.4, position: [-1, 4, -1] },
      { id: 'pos_8', type: 'pos', status: 'inactive', name: 'Kairouan POS', location: 'Kairouan', transactions: 0, performance: 0, position: [4, 1, -4] }
    ],
    connections: [
      { source: 'pos_1', target: 'pos_4', strength: 0.9, type: 'cheques' },
      { source: 'pos_2', target: 'pos_4', strength: 0.7, type: 'factures' },
      { source: 'pos_3', target: 'pos_7', strength: 0.4, type: 'kimbiales' },
      { source: 'pos_5', target: 'pos_4', strength: 0.6, type: 'cheques' },
      { source: 'pos_6', target: 'pos_7', strength: 0.8, type: 'factures' },
      { source: 'pos_4', target: 'pos_7', strength: 1.0, type: 'all' },
      { source: 'pos_1', target: 'pos_2', strength: 0.5, type: 'cheques' },
      { source: 'pos_2', target: 'pos_6', strength: 0.3, type: 'kimbiales' }
    ]
  };

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'synthwave';
    setCurrentTheme(savedTheme);
  }, []);

  // Handle theme change
  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle node selection
  const handleNodeSelect = (node, position) => {
    setSelectedNode(node);
    setNodePopupPosition(position);
  };

  // Handle screenshot
  const handleScreenshot = () => {
    // Screenshot functionality is handled in NetworkCanvas
    console.log('Screenshot taken');
  };

  // Handle data export
  const handleDataExport = (exportData) => {
    console.log('Data exported:', exportData);
    // Show success notification
  };

  // Handle view preset
  const handleViewPreset = (preset) => {
    switch (preset) {
      case 'overview': setColorScheme('status');
        setShowConnections(true);
        setNodeSize(1.0);
        break;
      case 'performance':
        setColorScheme('performance');
        setShowConnections(false);
        setNodeSize(1.5);
        break;
      case 'connections': setColorScheme('type');
        setShowConnections(true);
        setNodeSize(0.8);
        break;
      case 'issues': setColorScheme('status');
        setFilters(prev => ({ ...prev, status: 'issues' }));
        setShowConnections(true);
        setNodeSize(1.2);
        break;
      default:
        break;
    }
  };

  // Handle animation toggle
  const handleAnimationToggle = () => {
    setIsAnimating(!isAnimating);
  };

  // Navigation breadcrumb
  const breadcrumbItems = [
    { label: 'Dashboard', path: '/', icon: 'Home', isActive: false },
    { label: 'Analytics', path: '#', icon: 'BarChart3', isActive: false },
    { label: '3D Network Visualization', path: '/3d-network-visualization', icon: 'Network', isActive: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        user={{ name: 'Network Analyst', email: 'analyst@sotunol.com', role: 'Senior Analyst' }}
        onThemeChange={handleThemeChange}
        currentTheme={currentTheme}
      />
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      {/* Main Content */}
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'
      } pt-16`}>
        
        {/* Page Header */}
        <div className="bg-card border-b border-border">
          <div className="px-6 py-4">
            <Breadcrumb customItems={breadcrumbItems} showHome={false} />
            
            <div className="flex items-center justify-between mt-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground font-heading">
                  3D Network Visualization
                </h1>
                <p className="text-muted-foreground mt-1">
                  Interactive Three.js-powered network analytics and relationship mapping
                </p>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/pos-management')}
                  iconName="MapPin"
                  iconPosition="left"
                  iconSize={14}
                >
                  POS Management
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFullscreen}
                  iconName={isFullscreen ? "Minimize2" : "Maximize2"}
                  iconPosition="left"
                  iconSize={14}
                >
                  {isFullscreen ? 'Exit' : 'Fullscreen'}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => window.location?.reload()}
                  iconName="RefreshCw"
                  iconPosition="left"
                  iconSize={14}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Visualization Container */}
        <div className="relative h-screen">
          {/* View Controls */}
          <ViewControls
            onNodeSizeChange={setNodeSize}
            onConnectionVisibilityChange={setShowConnections}
            onColorSchemeChange={setColorScheme}
            onFilterChange={setFilters}
            onAnimationToggle={handleAnimationToggle}
            isAnimating={isAnimating}
            currentFilters={filters}
          />

          {/* Export Toolbar */}
          <ExportToolbar
            onScreenshot={handleScreenshot}
            onDataExport={handleDataExport}
            onViewPreset={handleViewPreset}
          />

          {/* 3D Network Canvas */}
          <NetworkCanvas
            nodeSize={nodeSize}
            showConnections={showConnections}
            colorScheme={colorScheme}
            filters={filters}
            isAnimating={isAnimating}
            onNodeSelect={handleNodeSelect}
            onScreenshot={handleScreenshot}
          />

          {/* Network Statistics */}
          <NetworkStats
            networkData={networkData}
            selectedFilters={filters}
          />

          {/* Node Details Popup */}
          {selectedNode && (
            <NodeDetailsPopup
              node={selectedNode}
              position={nodePopupPosition}
              onClose={() => setSelectedNode(null)}
            />
          )}

          {/* Quick Navigation */}
          <div className="fixed top-32 right-4 z-30 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-2">
            <div className="flex flex-col space-y-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/pos-management')}
                className="text-muted-foreground hover:text-foreground"
                title="POS Management"
              >
                <Icon name="MapPin" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/ai-document-processing-playground')}
                className="text-muted-foreground hover:text-foreground"
                title="AI Playground"
              >
                <Icon name="Brain" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/cheques-management')}
                className="text-muted-foreground hover:text-foreground"
                title="Cheques"
              >
                <Icon name="CreditCard" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/factures-management')}
                className="text-muted-foreground hover:text-foreground"
                title="Factures"
              >
                <Icon name="FileText" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NetworkVisualization3D;