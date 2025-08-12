import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const POSLocationModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  location = null, 
  mode = 'add' // 'add' or 'edit'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    governorate: '',
    postalCode: '',
    phone: '',
    email: '',
    status: 'active',
    coordinates: {
      lat: 34.0,
      lng: 9.5
    }
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const governorateOptions = [
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

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  useEffect(() => {
    if (location && mode === 'edit') {
      setFormData({
        name: location?.name || '',
        address: location?.address || '',
        city: location?.city || '',
        governorate: location?.governorate || '',
        postalCode: location?.postalCode || '',
        phone: location?.phone || '',
        email: location?.email || '',
        status: location?.status || 'active',
        coordinates: {
          lat: location?.coordinates?.lat || 34.0,
          lng: location?.coordinates?.lng || 9.5
        }
      });
    } else {
      setFormData({
        name: '',
        address: '',
        city: '',
        governorate: '',
        postalCode: '',
        phone: '',
        email: '',
        status: 'active',
        coordinates: {
          lat: 34.0,
          lng: 9.5
        }
      });
    }
    setErrors({});
  }, [location, mode, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData?.name?.trim()) {
      newErrors.name = 'Location name is required';
    }
    
    if (!formData?.address?.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData?.city?.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData?.governorate) {
      newErrors.governorate = 'Governorate is required';
    }

    // Postal code validation (Tunisia format: 4 digits)
    if (formData?.postalCode && !/^\d{4}$/?.test(formData?.postalCode)) {
      newErrors.postalCode = 'Postal code must be 4 digits';
    }

    // Phone validation (Tunisia format: +216 followed by 8 digits)
    if (formData?.phone) {
      const phoneRegex = /^(\+216\s?)?[0-9]{8}$/;
      if (!phoneRegex?.test(formData?.phone?.replace(/\s/g, ''))) {
        newErrors.phone = 'Phone must be in format +216 XXXXXXXX or 8 digits';
      }
    }

    // Email validation
    if (formData?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Coordinates validation (Tunisia bounds)
    const lat = parseFloat(formData?.coordinates?.lat);
    const lng = parseFloat(formData?.coordinates?.lng);
    
    if (isNaN(lat) || lat < 30.0 || lat > 38.0) {
      newErrors.latitude = 'Latitude must be between 30.0 and 38.0 (Tunisia bounds)';
    }
    
    if (isNaN(lng) || lng < 7.0 || lng > 12.0) {
      newErrors.longitude = 'Longitude must be between 7.0 and 12.0 (Tunisia bounds)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field?.includes('.')) {
      const [parent, child] = field?.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev?.[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Format phone number
      let formattedPhone = formData?.phone;
      if (formattedPhone && !formattedPhone?.startsWith('+216')) {
        formattedPhone = `+216 ${formattedPhone}`;
      }

      const locationData = {
        ...formData,
        phone: formattedPhone,
        coordinates: {
          lat: parseFloat(formData?.coordinates?.lat),
          lng: parseFloat(formData?.coordinates?.lng)
        }
      };

      await onSave(locationData);
      onClose();
    } catch (error) {
      console.error('Error saving location:', error);
      setErrors({ submit: 'Failed to save location. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-card border border-border rounded-lg shadow-synthwave-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground font-heading">
              {mode === 'edit' ? 'Edit POS Location' : 'Add New POS Location'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === 'edit' ?'Update the location details below' :'Enter the details for the new POS location'
              }
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Location Name"
                type="text"
                placeholder="Enter location name"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                error={errors?.name}
                required
              />
              
              <Select
                label="Status"
                options={statusOptions}
                value={formData?.status}
                onChange={(value) => handleInputChange('status', value)}
                error={errors?.status}
                required
              />
            </div>

            <Input
              label="Address"
              type="text"
              placeholder="Enter full address"
              value={formData?.address}
              onChange={(e) => handleInputChange('address', e?.target?.value)}
              error={errors?.address}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                type="text"
                placeholder="Enter city"
                value={formData?.city}
                onChange={(e) => handleInputChange('city', e?.target?.value)}
                error={errors?.city}
                required
              />
              
              <Select
                label="Governorate"
                options={governorateOptions}
                value={formData?.governorate}
                onChange={(value) => handleInputChange('governorate', value)}
                error={errors?.governorate}
                searchable
                required
              />
              
              <Input
                label="Postal Code"
                type="text"
                placeholder="1000"
                value={formData?.postalCode}
                onChange={(e) => handleInputChange('postalCode', e?.target?.value)}
                error={errors?.postalCode}
                description="4-digit postal code"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+216 12345678"
                value={formData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                error={errors?.phone}
                description="Tunisia format: +216 XXXXXXXX"
              />
              
              <Input
                label="Email Address"
                type="email"
                placeholder="location@example.com"
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                error={errors?.email}
              />
            </div>
          </div>

          {/* Coordinates */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Geographic Coordinates</h3>
            <p className="text-sm text-muted-foreground">
              Coordinates must be within Tunisia bounds (30°N-38°N, 7°E-12°E)
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Latitude"
                type="number"
                step="0.0001"
                placeholder="34.0000"
                value={formData?.coordinates?.lat}
                onChange={(e) => handleInputChange('coordinates.lat', e?.target?.value)}
                error={errors?.latitude}
                description="Between 30.0 and 38.0"
                required
              />
              
              <Input
                label="Longitude"
                type="number"
                step="0.0001"
                placeholder="9.5000"
                value={formData?.coordinates?.lng}
                onChange={(e) => handleInputChange('coordinates.lng', e?.target?.value)}
                error={errors?.longitude}
                description="Between 7.0 and 12.0"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {errors?.submit && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-destructive" />
                <span className="text-sm text-destructive">{errors?.submit}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={isLoading}
              iconName="Save"
              iconPosition="left"
              iconSize={16}
            >
              {mode === 'edit' ? 'Update Location' : 'Add Location'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default POSLocationModal;