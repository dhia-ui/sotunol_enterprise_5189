import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import KPICards from './components/KPICards';
import InteractiveCharts from './components/InteractiveCharts';
import RecentActivity from './components/RecentActivity';
import QuickActions from './components/QuickActions';
import SystemHealth from './components/SystemHealth';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock current user
  const currentUser = {
    id: 1,
    name: 'Operations Manager',
    email: 'manager@sotunol.com',
    role: 'system-admin',
    avatar: null
  };

  // Simulated real-time data
  const [dashboardData, setDashboardData] = useState({
    kpiData: {
      totalTransactions: 15847,
      transactionsTrend: '+12.5%',
      activePOSLocations: 127,
      posLocationsTrend: '+3.2%',
      pendingDocuments: 342,
      pendingDocumentsTrend: '-5.8%',
      systemHealth: 98.7,
      systemHealthTrend: '+0.3%'
    },
    chartData: {
      transactionVolume: [
        { month: 'Jan', volume: 12500, revenue: 875000 },
        { month: 'Feb', volume: 14200, revenue: 994000 },
        { month: 'Mar', volume: 13800, revenue: 966000 },
        { month: 'Apr', volume: 15100, revenue: 1057000 },
        { month: 'May', volume: 14900, revenue: 1043000 },
        { month: 'Jun', volume: 16200, revenue: 1134000 },
        { month: 'Jul', volume: 15847, revenue: 1109290 }
      ],
      posPerformance: [
        { location: 'Tunis Central', transactions: 2847, efficiency: 94.2 },
        { location: 'Sfax Downtown', transactions: 2234, efficiency: 91.8 },
        { location: 'Sousse Marina', transactions: 1956, efficiency: 89.3 },
        { location: 'Monastir Airport', transactions: 1723, efficiency: 96.7 },
        { location: 'Bizerte Port', transactions: 1445, efficiency: 87.9 }
      ],
      documentProcessing: [
        { type: 'Cheques', processed: 4521, pending: 134, efficiency: 97.1 },
        { type: 'Kimbiales', processed: 2847, pending: 89, efficiency: 96.9 },
        { type: 'Factures', processed: 3234, pending: 119, efficiency: 96.5 }
      ]
    },
    recentActivity: [
      {
        id: 1,
        type: 'transaction',
        title: 'New cheque processed',
        description: 'CHQ-2025-4521 validated successfully',
        time: '2 minutes ago',
        status: 'success',
        module: 'Cheques Management'
      },
      {
        id: 2,
        type: 'system',
        title: 'POS location activated',
        description: 'Tunis La Marsa branch is now online',
        time: '15 minutes ago',
        status: 'info',
        module: 'POS Management'
      },
      {
        id: 3,
        type: 'alert',
        title: 'High processing volume',
        description: 'Document queue approaching threshold',
        time: '1 hour ago',
        status: 'warning',
        module: 'AI Processing'
      },
      {
        id: 4,
        type: 'approval',
        title: 'Invoice approved',
        description: 'INV-2025-1547 approved by Sarah Johnson',
        time: '2 hours ago',
        status: 'success',
        module: 'Factures Management'
      },
      {
        id: 5,
        type: 'maintenance',
        title: 'System backup completed',
        description: 'Daily backup finished successfully',
        time: '3 hours ago',
        status: 'success',
        module: 'System'
      }
    ],
    systemHealth: {
      serverStatus: 'operational',
      serverUptime: '99.97%',
      databasePerformance: 'excellent',
      databaseResponseTime: '12ms',
      integrationConnectivity: 'stable',
      integrationErrors: 0,
      storageUsage: 67.8,
      memoryUsage: 42.3,
      cpuUsage: 28.7
    }
  });

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDashboardData(prev => ({
        ...prev,
        kpiData: {
          ...prev?.kpiData,
          totalTransactions: prev?.kpiData?.totalTransactions + Math.floor(Math.random() * 5),
          pendingDocuments: Math.max(0, prev?.kpiData?.pendingDocuments + Math.floor(Math.random() * 3) - 1)
        }
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setDashboardData(prev => ({
      ...prev,
      kpiData: {
        ...prev?.kpiData,
        totalTransactions: prev?.kpiData?.totalTransactions + Math.floor(Math.random() * 20),
        systemHealth: Math.min(100, prev?.kpiData?.systemHealth + (Math.random() - 0.5) * 2)
      }
    }));
    
    setRefreshing(false);
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'Home', isActive: true }
  ];

  if (isLoading) {
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
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="bg-card border border-border rounded-lg shadow-synthwave-lg p-8 flex flex-col items-center space-y-4">
                <div className="animate-spin">
                  <Icon name="Loader2" size={32} className="text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-foreground mb-2">Loading Dashboard</h3>
                  <p className="text-muted-foreground">Gathering real-time analytics and system metrics...</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive analytics and real-time insights across all Sotunol Enterprise modules
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                iconName={refreshing ? "Loader2" : "RefreshCw"}
                iconPosition="left"
                iconSize={16}
                className={refreshing ? "animate-spin-icon" : ""}
              >
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              
              <Button
                variant="default"
                onClick={() => navigate('/export-center')}
                iconName="Download"
                iconPosition="left"
                iconSize={16}
              >
                Export Data
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <KPICards data={dashboardData?.kpiData} />

          {/* Charts Section */}
          <InteractiveCharts data={dashboardData?.chartData} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Recent Activity - Takes 2 columns on XL screens */}
            <div className="xl:col-span-2">
              <RecentActivity activities={dashboardData?.recentActivity} />
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              <QuickActions />
              <SystemHealth data={dashboardData?.systemHealth} />
            </div>
          </div>
        </div>
      </main>

      {/* Refreshing Overlay */}
      {refreshing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg shadow-synthwave-lg p-6 flex items-center space-x-4">
            <div className="animate-spin">
              <Icon name="Loader2" size={24} className="text-primary" />
            </div>
            <span className="text-foreground font-medium">Refreshing dashboard data...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;