import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import POSLocationCard from './POSLocationCard';

const POSLocationsList = ({ 
  locations, 
  selectedLocation, 
  onLocationSelect, 
  onLocationEdit, 
  onLocationDelete, 
  onViewOnMap,
  onAddNew 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [governorateFilter, setGovernorateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  const governorateOptions = [
    { value: 'all', label: 'All Governorates' },
    { value: 'Tunis', label: 'Tunis' },
    { value: 'Ariana', label: 'Ariana' },
    { value: 'Ben Arous', label: 'Ben Arous' },
    { value: 'Manouba', label: 'Manouba' },
    { value: 'Nabeul', label: 'Nabeul' },
    { value: 'Zaghouan', label: 'Zaghouan' },
    { value: 'Bizerte', label: 'Bizerte' },
    { value: 'Béja', label: 'Béja' },
    { value: 'Jendouba', label: 'Jendouba' },
    { value: 'Kef', label: 'Kef' },
    { value: 'Siliana', label: 'Siliana' },
    { value: 'Kairouan', label: 'Kairouan' },
    { value: 'Kasserine', label: 'Kasserine' },
    { value: 'Sidi Bouzid', label: 'Sidi Bouzid' },
    { value: 'Sousse', label: 'Sousse' },
    { value: 'Monastir', label: 'Monastir' },
    { value: 'Mahdia', label: 'Mahdia' },
    { value: 'Sfax', label: 'Sfax' },
    { value: 'Gafsa', label: 'Gafsa' },
    { value: 'Tozeur', label: 'Tozeur' },
    { value: 'Kebili', label: 'Kebili' },
    { value: 'Gabès', label: 'Gabès' },
    { value: 'Medenine', label: 'Medenine' },
    { value: 'Tataouine', label: 'Tataouine' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'created_desc', label: 'Newest First' },
    { value: 'created_asc', label: 'Oldest First' },
    { value: 'status', label: 'Status' },
    { value: 'governorate', label: 'Governorate' }
  ];

  const filteredAndSortedLocations = useMemo(() => {
    let filtered = locations?.filter(location => {
      const matchesSearch = location?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           location?.address?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           location?.city?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           location?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || location?.status === statusFilter;
      const matchesGovernorate = governorateFilter === 'all' || location?.governorate === governorateFilter;
      
      return matchesSearch && matchesStatus && matchesGovernorate;
    });

    // Sort the filtered results
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a?.name?.localeCompare(b?.name);
        case 'name_desc':
          return b?.name?.localeCompare(a?.name);
        case 'created_desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'created_asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'status':
          return a?.status?.localeCompare(b?.status);
        case 'governorate':
          return a?.governorate?.localeCompare(b?.governorate);
        default:
          return 0;
      }
    });

    return filtered;
  }, [locations, searchTerm, statusFilter, governorateFilter, sortBy]);

  const getStatusCounts = () => {
    return {
      total: locations?.length,
      active: locations?.filter(l => l?.status === 'active')?.length,
      inactive: locations?.filter(l => l?.status === 'inactive')?.length,
      maintenance: locations?.filter(l => l?.status === 'maintenance')?.length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground font-heading">
              POS Locations
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredAndSortedLocations?.length} of {locations?.length} locations
            </p>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={onAddNew}
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
            className="shadow-synthwave"
          >
            Add New
          </Button>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <div>
                <div className="text-lg font-semibold text-success">{statusCounts?.active}</div>
                <div className="text-xs text-success/80">Active</div>
              </div>
            </div>
          </div>
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-warning" />
              <div>
                <div className="text-lg font-semibold text-warning">{statusCounts?.inactive}</div>
                <div className="text-xs text-warning/80">Inactive</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <Input
          type="search"
          placeholder="Search locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="mb-3"
        />

        {/* Filters */}
        <div className="space-y-2">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
          />
          <Select
            options={governorateOptions}
            value={governorateFilter}
            onChange={setGovernorateFilter}
            placeholder="Filter by governorate"
            searchable
          />
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
          />
        </div>
      </div>
      {/* Locations List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredAndSortedLocations?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Icon name="MapPin" size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No locations found
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || governorateFilter !== 'all' ?'Try adjusting your search or filters' :'Get started by adding your first POS location'
              }
            </p>
            {(!searchTerm && statusFilter === 'all' && governorateFilter === 'all') && (
              <Button
                variant="outline"
                onClick={onAddNew}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
              >
                Add First Location
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedLocations?.map((location) => (
              <POSLocationCard
                key={location?.id}
                location={location}
                isSelected={selectedLocation?.id === location?.id}
                onSelect={onLocationSelect}
                onEdit={onLocationEdit}
                onDelete={onLocationDelete}
                onViewOnMap={onViewOnMap}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default POSLocationsList;