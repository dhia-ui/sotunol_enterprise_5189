import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ChequesToolbar from './components/ChequesToolbar';
import ChequesTable from './components/ChequesTable';
import ChequesPagination from './components/ChequesPagination';
import QRCodeModal from './components/QRCodeModal';
import ChequeFormModal from './components/ChequeFormModal';
import TrashModal from './components/TrashModal';
import Button from '../../components/ui/Button';


const ChequesManagement = () => {
  // State management
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('synthwave');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [selectedCheques, setSelectedCheques] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState({ column: 'issueDate', direction: 'desc' });
  const [searchFilters, setSearchFilters] = useState({
    chequeNumber: '',
    partnerName: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    status: ''
  });
  
  // Modal states
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedChequeForQR, setSelectedChequeForQR] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [selectedChequeForEdit, setSelectedChequeForEdit] = useState(null);
  const [trashModalOpen, setTrashModalOpen] = useState(false);

  // Mock data
  const [allCheques, setAllCheques] = useState([
    {
      id: 1,
      chequeNumber: "CHQ001234567",
      partnerName: "Société Tunisienne de Distribution",
      partnerCode: "STD001",
      amount: 15750.500,
      issueDate: "2025-08-10",
      dueDate: "2025-09-10",
      bankName: "biat",
      accountNumber: "12345678901234567890",
      status: "pending",
      notes: "Monthly supplier payment",
      hasQR: true,
      createdAt: "2025-08-10T09:00:00Z",
      updatedAt: "2025-08-10T09:00:00Z"
    },
    {
      id: 2,
      chequeNumber: "CHQ001234568",
      partnerName: "Entreprise Moderne de Construction",
      partnerCode: "EMC002",
      amount: 28900.750,
      issueDate: "2025-08-09",
      dueDate: "2025-09-09",
      bankName: "stb",
      accountNumber: "09876543210987654321",
      status: "approved",
      notes: "Construction materials payment",
      hasQR: false,
      createdAt: "2025-08-09T14:30:00Z",
      updatedAt: "2025-08-11T10:15:00Z"
    },
    {
      id: 3,
      chequeNumber: "CHQ001234569",
      partnerName: "Services Informatiques Avancés",
      partnerCode: "SIA003",
      amount: 8450.250,
      issueDate: "2025-08-08",
      dueDate: "2025-09-08",
      bankName: "ubci",
      accountNumber: "11223344556677889900",
      status: "processed",
      notes: "IT services monthly fee",
      hasQR: true,
      createdAt: "2025-08-08T11:45:00Z",
      updatedAt: "2025-08-12T08:20:00Z"
    },
    {
      id: 4,
      chequeNumber: "CHQ001234570",
      partnerName: "Fournisseur Équipements Industriels",
      partnerCode: "FEI004",
      amount: 45200.000,
      issueDate: "2025-08-07",
      dueDate: "2025-09-07",
      bankName: "bna",
      accountNumber: "55667788990011223344",
      status: "rejected",
      notes: "Equipment purchase - requires approval",
      hasQR: false,
      createdAt: "2025-08-07T16:20:00Z",
      updatedAt: "2025-08-11T13:45:00Z"
    },
    {
      id: 5,
      chequeNumber: "CHQ001234571",
      partnerName: "Transport et Logistique Tunisie",
      partnerCode: "TLT005",
      amount: 12300.125,
      issueDate: "2025-08-06",
      dueDate: "2025-09-06",
      bankName: "attijari",
      accountNumber: "99887766554433221100",
      status: "pending",
      notes: "Transportation services Q3",
      hasQR: true,
      createdAt: "2025-08-06T13:10:00Z",
      updatedAt: "2025-08-06T13:10:00Z"
    }
  ]);

  const [trashedCheques, setTrashedCheques] = useState([
    {
      id: 101,
      chequeNumber: "CHQ001234500",
      partnerName: "Ancien Partenaire Commercial",
      partnerCode: "APC001",
      amount: 5500.000,
      issueDate: "2025-07-15",
      dueDate: "2025-08-15",
      bankName: "biat",
      accountNumber: "12345678901234567890",
      status: "cancelled",
      notes: "Cancelled due to contract termination",
      deletedAt: "2025-08-01T10:30:00Z",
      createdAt: "2025-07-15T09:00:00Z",
      updatedAt: "2025-08-01T10:30:00Z"
    }
  ]);

  // Filter and sort cheques
  const filteredAndSortedCheques = useMemo(() => {
    let filtered = allCheques?.filter(cheque => {
      const matchesNumber = !searchFilters?.chequeNumber || 
        cheque?.chequeNumber?.toLowerCase()?.includes(searchFilters?.chequeNumber?.toLowerCase());
      
      const matchesPartner = !searchFilters?.partnerName || 
        cheque?.partnerName?.toLowerCase()?.includes(searchFilters?.partnerName?.toLowerCase());
      
      const matchesStatus = !searchFilters?.status || cheque?.status === searchFilters?.status;
      
      const matchesDateFrom = !searchFilters?.dateFrom || 
        new Date(cheque.issueDate) >= new Date(searchFilters.dateFrom);
      
      const matchesDateTo = !searchFilters?.dateTo || 
        new Date(cheque.issueDate) <= new Date(searchFilters.dateTo);
      
      const matchesMinAmount = !searchFilters?.minAmount || 
        cheque?.amount >= parseFloat(searchFilters?.minAmount);
      
      const matchesMaxAmount = !searchFilters?.maxAmount || 
        cheque?.amount <= parseFloat(searchFilters?.maxAmount);

      return matchesNumber && matchesPartner && matchesStatus && 
             matchesDateFrom && matchesDateTo && matchesMinAmount && matchesMaxAmount;
    });

    // Sort filtered results
    filtered?.sort((a, b) => {
      const { column, direction } = sortConfig;
      let aValue = a?.[column];
      let bValue = b?.[column];

      if (column === 'amount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (column === 'issueDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [allCheques, searchFilters, sortConfig]);

  // Paginate results
  const paginatedCheques = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedCheques?.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedCheques, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedCheques?.length / itemsPerPage);

  // Event handlers
  const handleSearch = (searchTerm) => {
    if (typeof searchTerm === 'string') {
      // Quick search
      setSearchFilters(prev => ({
        ...prev,
        chequeNumber: searchTerm,
        partnerName: searchTerm
      }));
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (field, value) => {
    if (field === 'reset') {
      setSearchFilters({
        chequeNumber: '',
        partnerName: '',
        dateFrom: '',
        dateTo: '',
        minAmount: '',
        maxAmount: '',
        status: ''
      });
    } else {
      setSearchFilters(prev => ({
        ...prev,
        [field]: value
      }));
    }
    setCurrentPage(1);
  };

  const handleSelectCheque = (id) => {
    setSelectedCheques(prev => 
      prev?.includes(id) 
        ? prev?.filter(chequeId => chequeId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCheques?.length === paginatedCheques?.length) {
      setSelectedCheques([]);
    } else {
      setSelectedCheques(paginatedCheques?.map(cheque => cheque?.id));
    }
  };

  const handleSort = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} on cheques:`, selectedCheques);
    
    switch (action) {
      case 'export':
        // Mock export functionality
        alert(`Exporting ${selectedCheques?.length} cheques...`);
        break;
      case 'approve':
        setAllCheques(prev => prev?.map(cheque => 
          selectedCheques?.includes(cheque?.id) 
            ? { ...cheque, status: 'approved', updatedAt: new Date()?.toISOString() }
            : cheque
        ));
        break;
      case 'pending':
        setAllCheques(prev => prev?.map(cheque => 
          selectedCheques?.includes(cheque?.id) 
            ? { ...cheque, status: 'pending', updatedAt: new Date()?.toISOString() }
            : cheque
        ));
        break;
      case 'reject':
        setAllCheques(prev => prev?.map(cheque => 
          selectedCheques?.includes(cheque?.id) 
            ? { ...cheque, status: 'rejected', updatedAt: new Date()?.toISOString() }
            : cheque
        ));
        break;
      case 'trash':
        const chequesToTrash = allCheques?.filter(cheque => selectedCheques?.includes(cheque?.id));
        setTrashedCheques(prev => [...prev, ...chequesToTrash?.map(cheque => ({
          ...cheque,
          deletedAt: new Date()?.toISOString()
        }))]);
        setAllCheques(prev => prev?.filter(cheque => !selectedCheques?.includes(cheque?.id)));
        break;
    }
    
    setSelectedCheques([]);
  };

  const handleAddCheque = () => {
    setFormMode('add');
    setSelectedChequeForEdit(null);
    setFormModalOpen(true);
  };

  const handleEditCheque = (cheque) => {
    setFormMode('edit');
    setSelectedChequeForEdit(cheque);
    setFormModalOpen(true);
  };

  const handleViewCheque = (cheque) => {
    console.log('Viewing cheque:', cheque);
    // Could open a detailed view modal
    alert(`Viewing details for cheque #${cheque?.chequeNumber}`);
  };

  const handleGenerateQR = (cheque) => {
    setSelectedChequeForQR(cheque);
    setQrModalOpen(true);
  };

  const handleDeleteCheque = (cheque) => {
    const confirmed = window.confirm(
      `Are you sure you want to move cheque #${cheque?.chequeNumber} to trash?`
    );
    
    if (confirmed) {
      setTrashedCheques(prev => [...prev, {
        ...cheque,
        deletedAt: new Date()?.toISOString()
      }]);
      setAllCheques(prev => prev?.filter(c => c?.id !== cheque?.id));
    }
  };

  const handleSaveCheque = async (chequeData) => {
    if (formMode === 'edit') {
      setAllCheques(prev => prev?.map(cheque => 
        cheque?.id === chequeData?.id ? chequeData : cheque
      ));
    } else {
      setAllCheques(prev => [...prev, chequeData]);
    }
  };

  const handleRestoreCheques = async (ids) => {
    const chequesToRestore = trashedCheques?.filter(cheque => ids?.includes(cheque?.id));
    setAllCheques(prev => [...prev, ...chequesToRestore?.map(cheque => {
      const { deletedAt, ...restoredCheque } = cheque;
      return {
        ...restoredCheque,
        updatedAt: new Date()?.toISOString()
      };
    })]);
    setTrashedCheques(prev => prev?.filter(cheque => !ids?.includes(cheque?.id)));
  };

  const handlePermanentDelete = async (ids) => {
    setTrashedCheques(prev => prev?.filter(cheque => !ids?.includes(cheque?.id)));
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/', icon: 'Home', isActive: false },
    { label: 'Financial', path: '#', icon: 'DollarSign', isActive: false },
    { label: 'Cheques Management', path: '/cheques-management', icon: 'CreditCard', isActive: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
      />
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'
      } pt-16 pb-20 lg:pb-8`}>
        <div className="container mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <Breadcrumb customItems={breadcrumbItems} />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground font-heading">
                  Cheques Management
                </h1>
                <p className="text-muted-foreground mt-2">
                  Comprehensive cheque processing with advanced search, bulk operations, and QR code generation
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setTrashModalOpen(true)}
                  iconName="Trash2"
                  iconPosition="left"
                  className="shrink-0"
                >
                  Trash ({trashedCheques?.length})
                </Button>
                
                <div className="bg-card border border-border rounded-lg px-4 py-2">
                  <div className="text-sm text-muted-foreground">Total Cheques</div>
                  <div className="text-2xl font-bold text-foreground">
                    {filteredAndSortedCheques?.length?.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <ChequesToolbar
            onAddCheque={handleAddCheque}
            onSearch={handleSearch}
            onBulkAction={handleBulkAction}
            selectedCount={selectedCheques?.length}
            isAdvancedSearchOpen={isAdvancedSearchOpen}
            onToggleAdvancedSearch={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
            searchFilters={searchFilters}
            onFilterChange={handleFilterChange}
          />

          {/* Table */}
          <ChequesTable
            cheques={paginatedCheques}
            selectedCheques={selectedCheques}
            onSelectCheque={handleSelectCheque}
            onSelectAll={handleSelectAll}
            onSort={handleSort}
            sortConfig={sortConfig}
            onEdit={handleEditCheque}
            onView={handleViewCheque}
            onGenerateQR={handleGenerateQR}
            onDelete={handleDeleteCheque}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />

          {/* Pagination */}
          <div className="mt-6">
            <ChequesPagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredAndSortedCheques?.length}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(newItemsPerPage) => {
                setItemsPerPage(newItemsPerPage);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </main>
      {/* Modals */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => {
          setQrModalOpen(false);
          setSelectedChequeForQR(null);
        }}
        cheque={selectedChequeForQR}
      />
      <ChequeFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setSelectedChequeForEdit(null);
        }}
        onSave={handleSaveCheque}
        cheque={selectedChequeForEdit}
        mode={formMode}
      />
      <TrashModal
        isOpen={trashModalOpen}
        onClose={() => setTrashModalOpen(false)}
        trashedCheques={trashedCheques}
        onRestore={handleRestoreCheques}
        onPermanentDelete={handlePermanentDelete}
      />
    </div>
  );
};

export default ChequesManagement;