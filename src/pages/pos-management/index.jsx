import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import POSLocationsList from './components/POSLocationsList';
import TunisiaMap from './components/TunisiaMap';
import POSLocationModal from './components/POSLocationModal';
import BulkOperationsModal from './components/BulkOperationsModal';

const POSManagement = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('synthwave');
  const [viewMode, setViewMode] = useState('split'); // 'split', 'list', 'map'
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationModalMode, setLocationModalMode] = useState('add');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock POS locations data
  const [locations, setLocations] = useState([
    {
      id: "POS-001",
      name: "Tunis Central Branch",
      address: "Avenue Habib Bourguiba 123",
      city: "Tunis",
      governorate: "Tunis",
      postalCode: "1000",
      phone: "+216 71234567",
      email: "tunis.central@sotunol.com",
      status: "active",
      coordinates: {
        lat: 36.8065,
        lng: 10.1815
      },
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-08-10T14:20:00Z"
    },
    {
      id: "POS-002",
      name: "Sfax Commercial Center",
      address: "Rue de la République 45",
      city: "Sfax",
      governorate: "Sfax",
      postalCode: "3000",
      phone: "+216 74567890",
      email: "sfax.commercial@sotunol.com",
      status: "active",
      coordinates: {
        lat: 34.7406,
        lng: 10.7603
      },
      createdAt: "2024-02-20T09:15:00Z",
      updatedAt: "2024-08-11T16:45:00Z"
    },
    {
      id: "POS-003",
      name: "Sousse Marina Branch",
      address: "Port El Kantaoui Boulevard 78",
      city: "Sousse",
      governorate: "Sousse",
      postalCode: "4000",
      phone: "+216 73345678",
      email: "sousse.marina@sotunol.com",
      status: "inactive",
      coordinates: {
        lat: 35.8256,
        lng: 10.6411
      },
      createdAt: "2024-03-10T11:00:00Z",
      updatedAt: "2024-08-05T13:30:00Z"
    },
    {
      id: "POS-004",
      name: "Bizerte Port Terminal",
      address: "Avenue Taieb Mhiri 92",
      city: "Bizerte",
      governorate: "Bizerte",
      postalCode: "7000",
      phone: "+216 72456789",
      email: "bizerte.port@sotunol.com",
      status: "maintenance",
      coordinates: {
        lat: 37.2744,
        lng: 9.8739
      },
      createdAt: "2024-04-05T08:45:00Z",
      updatedAt: "2024-08-12T10:15:00Z"
    },
    {
      id: "POS-005",
      name: "Kairouan Heritage Center",
      address: "Medina Quarter, Rue Sidi Sahbi 15",
      city: "Kairouan",
      governorate: "Kairouan",
      postalCode: "3100",
      phone: "+216 77234567",
      email: "kairouan.heritage@sotunol.com",
      status: "active",
      coordinates: {
        lat: 35.6781,
        lng: 10.0963
      },
      createdAt: "2024-05-12T14:20:00Z",
      updatedAt: "2024-08-08T12:00:00Z"
    },
    {
      id: "POS-006",
      name: "Gabès Oasis Branch",
      address: "Avenue Farhat Hached 67",
      city: "Gabès",
      governorate: "Gabès",
      postalCode: "6000",
      phone: "+216 75678901",
      email: "gabes.oasis@sotunol.com",
      status: "active",
      coordinates: {
        lat: 33.8815,
        lng: 10.0982
      },
      createdAt: "2024-06-18T16:30:00Z",
      updatedAt: "2024-08-09T09:45:00Z"
    }
  ]);

  const user = {
    name: 'Ahmed Ben Salem',
    email: 'ahmed.bensalem@sotunol.com',
    role: 'POS Operations Manager'
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleLocationEdit = (location) => {
    setSelectedLocation(location);
    setLocationModalMode('edit');
    setIsLocationModalOpen(true);
  };

  const handleLocationDelete = (location) => {
    if (window.confirm(`Are you sure you want to delete "${location?.name}"?`)) {
      setLocations(prev => prev?.filter(l => l?.id !== location?.id));
      if (selectedLocation?.id === location?.id) {
        setSelectedLocation(null);
      }
    }
  };

  const handleAddNew = () => {
    setSelectedLocation(null);
    setLocationModalMode('add');
    setIsLocationModalOpen(true);
  };

  const handleLocationSave = (locationData) => {
    if (locationModalMode === 'edit' && selectedLocation) {
      setLocations(prev => prev?.map(l => 
        l?.id === selectedLocation?.id 
          ? { ...l, ...locationData, updatedAt: new Date()?.toISOString() }
          : l
      ));
    } else {
      const newLocation = {
        ...locationData,
        id: `POS-${String(locations?.length + 1)?.padStart(3, '0')}`,
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      };
      setLocations(prev => [...prev, newLocation]);
    }
  };

  const handleMapClick = (coordinates) => {
    setSelectedLocation({
      coordinates,
      name: '',
      address: '',
      city: '',
      governorate: '',
      status: 'active'
    });
    setLocationModalMode('add');
    setIsLocationModalOpen(true);
  };

  const handleViewOnMap = (location) => {
    setSelectedLocation(location);
    if (viewMode === 'list') {
      setViewMode('split');
    }
  };

  const handleBulkOperation = async (operationData) => {
    const { type, locations: selectedLocs, newStatus } = operationData;
    
    switch (type) {
      case 'status':
        setLocations(prev => prev?.map(location => 
          selectedLocs?.some(sel => sel?.id === location?.id)
            ? { ...location, status: newStatus, updatedAt: new Date()?.toISOString() }
            : location
        ));
        break;
      case 'delete':
        setLocations(prev => prev?.filter(location => 
          !selectedLocs?.some(sel => sel?.id === location?.id)
        ));
        break;
      case 'export':
        // Mock export functionality
        const csvData = selectedLocs?.map(loc => ({
          ID: loc?.id,
          Name: loc?.name,
          Address: loc?.address,
          City: loc?.city,
          Governorate: loc?.governorate,
          Phone: loc?.phone,
          Status: loc?.status,
          Latitude: loc?.coordinates?.lat,
          Longitude: loc?.coordinates?.lng
        }));
        console.log('Exporting data:', csvData);
        break;
    }
    
    setSelectedLocations([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        
        <main className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Loading POS Management</h2>
                <p className="text-muted-foreground">Initializing Tunisia map and location data...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <main className={`pt-16 pb-20 lg:pb-0 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'}`}>
        <div className="p-6">
          {/* Breadcrumb */}
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground font-heading mb-2">
                POS Management
              </h1>
              <p className="text-muted-foreground">
                Manage point-of-sale locations across Tunisia with interactive mapping and comprehensive CRUD operations
              </p>
            </div>
            
            {/* View Controls */}
            <div className="flex items-center space-x-2 mt-4 lg:mt-0">
              <div className="flex items-center bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  iconName="List"
                  iconSize={16}
                  className="px-3"
                >
                  List
                </Button>
                <Button
                  variant={viewMode === 'split' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('split')}
                  iconName="Columns"
                  iconSize={16}
                  className="px-3"
                >
                  Split
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  iconName="Map"
                  iconSize={16}
                  className="px-3"
                >
                  Map
                </Button>
              </div>
              
              {selectedLocations?.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBulkModalOpen(true)}
                  iconName="Settings"
                  iconPosition="left"
                  iconSize={16}
                >
                  Bulk Actions ({selectedLocations?.length})
                </Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="MapPin" size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{locations?.length}</div>
                  <div className="text-sm text-muted-foreground">Total Locations</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} className="text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {locations?.filter(l => l?.status === 'active')?.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="AlertCircle" size={20} className="text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {locations?.filter(l => l?.status === 'inactive')?.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Inactive</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <Icon name="Wrench" size={20} className="text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {locations?.filter(l => l?.status === 'maintenance')?.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Maintenance</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="h-[calc(100vh-400px)] min-h-[600px]">
            {viewMode === 'list' && (
              <div className="h-full">
                <POSLocationsList
                  locations={locations}
                  selectedLocation={selectedLocation}
                  onLocationSelect={handleLocationSelect}
                  onLocationEdit={handleLocationEdit}
                  onLocationDelete={handleLocationDelete}
                  onViewOnMap={handleViewOnMap}
                  onAddNew={handleAddNew}
                />
              </div>
            )}
            
            {viewMode === 'map' && (
              <div className="h-full">
                <TunisiaMap
                  locations={locations}
                  selectedLocation={selectedLocation}
                  onLocationSelect={handleLocationSelect}
                  onLocationEdit={handleLocationEdit}
                  onLocationDelete={handleLocationDelete}
                  onMapClick={handleMapClick}
                />
              </div>
            )}
            
            {viewMode === 'split' && (
              <div className="h-full flex flex-col lg:flex-row gap-4">
                <div className="lg:w-2/5 h-full">
                  <POSLocationsList
                    locations={locations}
                    selectedLocation={selectedLocation}
                    onLocationSelect={handleLocationSelect}
                    onLocationEdit={handleLocationEdit}
                    onLocationDelete={handleLocationDelete}
                    onViewOnMap={handleViewOnMap}
                    onAddNew={handleAddNew}
                  />
                </div>
                <div className="lg:w-3/5 h-full">
                  <TunisiaMap
                    locations={locations}
                    selectedLocation={selectedLocation}
                    onLocationSelect={handleLocationSelect}
                    onLocationEdit={handleLocationEdit}
                    onLocationDelete={handleLocationDelete}
                    onMapClick={handleMapClick}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* Modals */}
      <POSLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSave={handleLocationSave}
        location={selectedLocation}
        mode={locationModalMode}
      />
      <BulkOperationsModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        selectedLocations={selectedLocations}
        onBulkOperation={handleBulkOperation}
      />
    </div>
  );
};

export default POSManagement;