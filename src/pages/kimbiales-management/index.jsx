import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import KimbialeDataTable from './components/KimbialeDataTable';
import KimbialeFormModal from './components/KimbialeFormModal';
import KimbialeExpiryNotifications from './components/KimbialeExpiryNotifications';

const KimbialeMangement = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('synthwave');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedKimbiale, setSelectedKimbiale] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [loading, setLoading] = useState(true);
  const [kimbiales, setKimbiales] = useState([]);

  // Mock data for kimbiales
  const mockKimbiales = [
    {
      id: 1,
      kimbialeNumber: 'KMB001234',
      partner: 'Société Générale Tunisie',
      bank: 'Banque de Tunisie',
      rib: '02005123456789012345',
      amount: 15000.00,
      issueDate: '2025-01-15',
      expiryDate: '2025-08-15',
      status: 'Active',
      notes: 'Commercial agreement payment'
    },
    {
      id: 2,
      kimbialeNumber: 'KMB001235',
      partner: 'Tunisie Telecom',
      bank: 'Amen Bank',
      rib: '07003987654321098765',
      amount: 25000.00,
      issueDate: '2025-02-01',
      expiryDate: '2025-08-20',
      status: 'Active',
      notes: 'Infrastructure project payment'
    },
    {
      id: 3,
      kimbialeNumber: 'KMB001236',
      partner: 'Groupe Poulina',
      bank: 'Arab Tunisian Bank',
      rib: '08001456789012345678',
      amount: 8500.00,
      issueDate: '2025-01-20',
      expiryDate: '2025-08-25',
      status: 'Pending',
      notes: 'Supply chain financing'
    },
    {
      id: 4,
      kimbialeNumber: 'KMB001237',
      partner: 'SOTUMAG',
      bank: 'Banque Internationale Arabe de Tunisie',
      rib: '03002789012345678901',
      amount: 12000.00,
      issueDate: '2025-01-10',
      expiryDate: '2025-07-10',
      status: 'Active',
      notes: 'Retail partnership agreement'
    },
    {
      id: 5,
      kimbialeNumber: 'KMB001238',
      partner: 'Délice Danone',
      bank: 'Société Tunisienne de Banque',
      rib: '04004567890123456789',
      amount: 18500.00,
      issueDate: '2024-12-15',
      expiryDate: '2025-06-15',
      status: 'Active',
      notes: 'Food processing contract'
    },
    {
      id: 6,
      kimbialeNumber: 'KMB001239',
      partner: 'Carthago Cement',
      bank: 'Banque Nationale Agricole',
      rib: '05005678901234567890',
      amount: 35000.00,
      issueDate: '2024-11-20',
      expiryDate: '2025-05-20',
      status: 'Expired',
      notes: 'Construction materials supply'
    },
    {
      id: 7,
      kimbialeNumber: 'KMB001240',
      partner: 'Tunisair',
      bank: 'Attijari Bank',
      rib: '12006789012345678901',
      amount: 22000.00,
      issueDate: '2025-02-10',
      expiryDate: '2025-09-10',
      status: 'Active',
      notes: 'Aviation services contract'
    },
    {
      id: 8,
      kimbialeNumber: 'KMB001241',
      partner: 'STEG',
      bank: 'Union Bancaire pour le Commerce et l\'Industrie',
      rib: '16007890123456789012',
      amount: 45000.00,
      issueDate: '2025-01-25',
      expiryDate: '2025-07-25',
      status: 'Active',
      notes: 'Utility infrastructure project'
    },
    {
      id: 9,
      kimbialeNumber: 'KMB001242',
      partner: 'Monoprix Tunisie',
      bank: 'Banque Zitouna',
      rib: '11008901234567890123',
      amount: 9500.00,
      issueDate: '2024-12-01',
      expiryDate: '2025-06-01',
      status: 'Cancelled',
      notes: 'Retail partnership - cancelled due to contract changes'
    },
    {
      id: 10,
      kimbialeNumber: 'KMB001243',
      partner: 'Banque de Tunisie',
      bank: 'Banque de l\'Habitat',
      rib: '10009012345678901234',
      amount: 28000.00,
      issueDate: '2025-02-05',
      expiryDate: '2025-08-05',
      status: 'Active',
      notes: 'Financial services agreement'
    }
  ];

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setKimbiales(mockKimbiales);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleCreateKimbiale = () => {
    setSelectedKimbiale(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };

  const handleEditKimbiale = (kimbiale) => {
    setSelectedKimbiale(kimbiale);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleViewKimbiale = (kimbiale) => {
    // Navigate to detailed view or show modal
    console.log('View kimbiale:', kimbiale);
  };

  const handleDeleteKimbiale = (kimbiale) => {
    if (window.confirm(`Are you sure you want to delete kimbiale ${kimbiale?.kimbialeNumber}?`)) {
      setKimbiales(prev => prev?.filter(k => k?.id !== kimbiale?.id));
    }
  };

  const handleSaveKimbiale = async (kimbialeData) => {
    if (formMode === 'create') {
      setKimbiales(prev => [...prev, kimbialeData]);
    } else {
      setKimbiales(prev => prev?.map(k => 
        k?.id === kimbialeData?.id ? kimbialeData : k
      ));
    }
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/', icon: 'Home', isActive: false },
    { label: 'Financial', path: '#', icon: 'DollarSign', isActive: false },
    { label: 'Kimbiales Management', path: '/kimbiales-management', icon: 'Receipt', isActive: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
      />
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'
      } pt-16 lg:pb-0 pb-16`}>
        <div className="p-6 space-y-6">
          {/* Breadcrumb */}
          <Breadcrumb customItems={breadcrumbItems} />

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Icon name="Receipt" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Kimbiales Management</h1>
                <p className="text-muted-foreground">
                  Manage promissory notes with bank validation and expiry tracking
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                onClick={() => console.log('Export all kimbiales')}
              >
                Export
              </Button>
              <Button
                iconName="Plus"
                iconPosition="left"
                onClick={handleCreateKimbiale}
              >
                Create Kimbiale
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Kimbiales</p>
                  <p className="text-2xl font-bold text-foreground">{kimbiales?.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Receipt" size={24} className="text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-success">
                    {kimbiales?.filter(k => k?.status === 'Active')?.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={24} className="text-success" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold text-foreground">
                    {new Intl.NumberFormat('fr-TN', {
                      style: 'currency',
                      currency: 'TND',
                      minimumFractionDigits: 0
                    })?.format(kimbiales?.reduce((sum, k) => sum + k?.amount, 0))}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Icon name="DollarSign" size={24} className="text-secondary" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                  <p className="text-2xl font-bold text-warning">
                    {kimbiales?.filter(k => {
                      const daysUntilExpiry = Math.ceil((new Date(k.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
                    })?.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={24} className="text-warning" />
                </div>
              </div>
            </div>
          </div>

          {/* Expiry Notifications */}
          <KimbialeExpiryNotifications kimbiales={kimbiales} />

          {/* Data Table */}
          <KimbialeDataTable
            kimbiales={kimbiales}
            onEdit={handleEditKimbiale}
            onDelete={handleDeleteKimbiale}
            onView={handleViewKimbiale}
            loading={loading}
          />
        </div>
      </main>
      {/* Form Modal */}
      <KimbialeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveKimbiale}
        kimbiale={selectedKimbiale}
        mode={formMode}
      />
    </div>
  );
};

export default KimbialeMangement;