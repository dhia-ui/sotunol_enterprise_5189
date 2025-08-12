import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import InvoiceForm from './components/InvoiceForm';
import InvoiceTable from './components/InvoiceTable';
import InvoiceFilters from './components/InvoiceFilters';
import InvoiceStats from './components/InvoiceStats';

const FacturesManagement = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'stats'
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateRange: '',
    fromDate: '',
    toDate: '',
    clientName: '',
    minAmount: '',
    maxAmount: '',
    amountRange: ''
  });

  // Mock current user
  const currentUser = {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@sotunol.com',
    role: 'manager',
    avatar: null
  };

  // Mock invoices data
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoiceNumber: 'INV-2025-001',
      clientName: 'ACME Corporation',
      clientEmail: 'billing@acme-corp.com',
      clientAddress: 'Avenue Habib Bourguiba, Tunis 1001, Tunisia',
      issueDate: '2025-01-15',
      dueDate: '2025-02-14',
      status: 'approved',
      taxRate: 19,
      notes: 'Monthly consulting services',
      lineItems: [
        { id: 1, product: 'consulting', quantity: 40, price: 150, discount: 0 },
        { id: 2, product: 'software-license', quantity: 1, price: 2000, discount: 10 }
      ],
      subtotal: 7800,
      taxAmount: 1482,
      grandTotal: 9282,
      createdAt: '2025-01-15T09:00:00Z',
      updatedAt: '2025-01-16T14:30:00Z'
    },
    {
      id: 2,
      invoiceNumber: 'INV-2025-002',
      clientName: 'Tech Solutions Ltd',
      clientEmail: 'accounts@techsolutions.tn',
      clientAddress: 'Rue de la Liberté, Sfax 3000, Tunisia',
      issueDate: '2025-01-20',
      dueDate: '2025-02-19',
      status: 'draft',
      taxRate: 19,
      notes: 'Software development project - Phase 1',
      lineItems: [
        { id: 1, product: 'software-license', quantity: 5, price: 500, discount: 5 },
        { id: 2, product: 'support', quantity: 12, price: 100, discount: 0 }
      ],
      subtotal: 3575,
      taxAmount: 679.25,
      grandTotal: 4254.25,
      createdAt: '2025-01-20T11:15:00Z',
      updatedAt: '2025-01-20T11:15:00Z'
    },
    {
      id: 3,
      invoiceNumber: 'INV-2025-003',
      clientName: 'Global Trade Partners',
      clientEmail: 'finance@globaltradetn.com',
      clientAddress: 'Zone Industrielle, Sousse 4000, Tunisia',
      issueDate: '2025-01-25',
      dueDate: '2025-01-25',
      status: 'locked',
      taxRate: 19,
      notes: 'Training program delivery',
      lineItems: [
        { id: 1, product: 'training', quantity: 20, price: 200, discount: 15 },
        { id: 2, product: 'maintenance', quantity: 6, price: 300, discount: 0 }
      ],
      subtotal: 5200,
      taxAmount: 988,
      grandTotal: 6188,
      createdAt: '2025-01-25T08:45:00Z',
      updatedAt: '2025-01-26T16:20:00Z'
    },
    {
      id: 4,
      invoiceNumber: 'INV-2025-004',
      clientName: 'Innovation Hub SA',
      clientEmail: 'billing@innovationhub.tn',
      clientAddress: 'Technopole El Ghazala, Ariana 2083, Tunisia',
      issueDate: '2025-02-01',
      dueDate: '2025-03-03',
      status: 'rejected',
      taxRate: 19,
      notes: 'Rejected due to pricing discrepancy',
      lineItems: [
        { id: 1, product: 'consulting', quantity: 25, price: 180, discount: 0 }
      ],
      subtotal: 4500,
      taxAmount: 855,
      grandTotal: 5355,
      createdAt: '2025-02-01T13:30:00Z',
      updatedAt: '2025-02-02T09:15:00Z'
    },
    {
      id: 5,
      invoiceNumber: 'INV-2025-005',
      clientName: 'Digital Ventures Inc',
      clientEmail: 'payments@digitalventures.tn',
      clientAddress: 'Centre Urbain Nord, Tunis 1082, Tunisia',
      issueDate: '2025-02-05',
      dueDate: '2025-03-07',
      status: 'draft',
      taxRate: 19,
      notes: 'Digital transformation consulting',
      lineItems: [
        { id: 1, product: 'consulting', quantity: 60, price: 175, discount: 5 },
        { id: 2, product: 'training', quantity: 10, price: 250, discount: 0 }
      ],
      subtotal: 12425,
      taxAmount: 2360.75,
      grandTotal: 14785.75,
      createdAt: '2025-02-05T10:20:00Z',
      updatedAt: '2025-02-05T10:20:00Z'
    }
  ]);

  const [filteredInvoices, setFilteredInvoices] = useState(invoices);

  // Filter invoices based on current filters
  useEffect(() => {
    let filtered = [...invoices];

    // Search filter
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(invoice =>
        invoice?.invoiceNumber?.toLowerCase()?.includes(searchTerm) ||
        invoice?.clientName?.toLowerCase()?.includes(searchTerm) ||
        invoice?.clientEmail?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Status filter
    if (filters?.status) {
      filtered = filtered?.filter(invoice => invoice?.status === filters?.status);
    }

    // Date range filter
    if (filters?.fromDate) {
      filtered = filtered?.filter(invoice => 
        new Date(invoice.issueDate) >= new Date(filters.fromDate)
      );
    }

    if (filters?.toDate) {
      filtered = filtered?.filter(invoice => 
        new Date(invoice.issueDate) <= new Date(filters.toDate)
      );
    }

    // Client name filter
    if (filters?.clientName) {
      filtered = filtered?.filter(invoice =>
        invoice?.clientName?.toLowerCase()?.includes(filters?.clientName?.toLowerCase())
      );
    }

    // Amount filters
    if (filters?.minAmount) {
      filtered = filtered?.filter(invoice => 
        parseFloat(invoice?.grandTotal) >= parseFloat(filters?.minAmount)
      );
    }

    if (filters?.maxAmount) {
      filtered = filtered?.filter(invoice => 
        parseFloat(invoice?.grandTotal) <= parseFloat(filters?.maxAmount)
      );
    }

    // Amount range filter
    if (filters?.amountRange) {
      const [min, max] = filters?.amountRange?.split('-')?.map(v => 
        v?.includes('+') ? Infinity : parseFloat(v)
      );
      filtered = filtered?.filter(invoice => {
        const amount = parseFloat(invoice?.grandTotal);
        return amount >= min && (max === Infinity || amount <= max);
      });
    }

    setFilteredInvoices(filtered);
  }, [filters, invoices]);

  const handleCreateInvoice = () => {
    setSelectedInvoice(null);
    setCurrentView('create');
  };

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView('edit');
  };

  const handleSaveInvoice = async (invoiceData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (selectedInvoice) {
        // Update existing invoice
        setInvoices(prev => prev?.map(inv => 
          inv?.id === selectedInvoice?.id 
            ? { ...invoiceData, id: selectedInvoice?.id }
            : inv
        ));
      } else {
        // Create new invoice
        const newInvoice = {
          ...invoiceData,
          id: Math.max(...invoices?.map(inv => inv?.id)) + 1
        };
        setInvoices(prev => [newInvoice, ...prev]);
      }
      
      setCurrentView('list');
      setSelectedInvoice(null);
    } catch (error) {
      console.error('Error saving invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInvoice = async (invoice) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoice?.invoiceNumber}?`)) {
      setIsLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setInvoices(prev => prev?.filter(inv => inv?.id !== invoice?.id));
      } catch (error) {
        console.error('Error deleting invoice:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleApproveInvoice = async (invoice) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInvoices(prev => prev?.map(inv => 
        inv?.id === invoice?.id 
          ? { ...inv, status: 'approved', updatedAt: new Date()?.toISOString() }
          : inv
      ));
    } catch (error) {
      console.error('Error approving invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectInvoice = async (invoice) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInvoices(prev => prev?.map(inv => 
        inv?.id === invoice?.id 
          ? { 
              ...inv, 
              status: 'rejected', 
              notes: `${inv?.notes}\n\nRejection Reason: ${reason}`,
              updatedAt: new Date()?.toISOString() 
            }
          : inv
      ));
    } catch (error) {
      console.error('Error rejecting invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePDF = (invoice) => {
    // Simulate PDF generation
    console.log('Generating PDF for invoice:', invoice?.invoiceNumber);
    // In a real app, this would trigger PDF generation and download
    alert(`PDF generated for invoice ${invoice?.invoiceNumber}`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      dateRange: '',
      fromDate: '',
      toDate: '',
      clientName: '',
      minAmount: '',
      maxAmount: '',
      amountRange: ''
    });
  };

  const viewOptions = [
    { value: 'list', label: 'List View' },
    { value: 'stats', label: 'Statistics' }
  ];

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/', icon: 'Home', isActive: false },
    { label: 'Financial', path: '/financial', icon: 'DollarSign', isActive: false },
    { label: 'Factures Management', path: '/factures-management', icon: 'FileText', isActive: true }
  ];

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
                Factures Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Create, manage, and track invoices with automated calculations and approval workflows
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {(currentView === 'list' || currentView === 'stats') && (
                <>
                  <Select
                    options={viewOptions}
                    value={currentView}
                    onChange={setCurrentView}
                    className="w-40"
                  />
                  
                  <Button
                    variant="default"
                    onClick={handleCreateInvoice}
                    iconName="Plus"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Create Invoice
                  </Button>
                </>
              )}

              {(currentView === 'create' || currentView === 'edit') && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentView('list')}
                  iconName="ArrowLeft"
                  iconPosition="left"
                  iconSize={16}
                >
                  Back to List
                </Button>
              )}
            </div>
          </div>

          {/* Content */}
          {currentView === 'stats' && (
            <InvoiceStats invoices={invoices} />
          )}

          {currentView === 'list' && (
            <div className="space-y-6">
              <InvoiceFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                totalCount={invoices?.length}
                filteredCount={filteredInvoices?.length}
              />

              <InvoiceTable
                invoices={filteredInvoices}
                onEdit={handleEditInvoice}
                onDelete={handleDeleteInvoice}
                onApprove={handleApproveInvoice}
                onReject={handleRejectInvoice}
                onGeneratePDF={handleGeneratePDF}
                currentUser={currentUser}
              />
            </div>
          )}

          {(currentView === 'create' || currentView === 'edit') && (
            <InvoiceForm
              invoice={selectedInvoice}
              onSave={handleSaveInvoice}
              onCancel={() => setCurrentView('list')}
              isLoading={isLoading}
            />
          )}
        </div>
      </main>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg shadow-synthwave-lg p-6 flex items-center space-x-4">
            <div className="animate-spin">
              <Icon name="Loader2" size={24} className="text-primary" />
            </div>
            <span className="text-foreground font-medium">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacturesManagement;