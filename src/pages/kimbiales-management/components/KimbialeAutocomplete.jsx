import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const KimbialeAutocomplete = ({ 
  type = 'partner', 
  value = '', 
  onChange, 
  placeholder = '',
  label = '',
  error = '',
  required = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const partnerOptions = [
    { id: 1, name: 'Société Générale Tunisie', code: 'SGT001', type: 'Corporate' },
    { id: 2, name: 'Tunisie Telecom', code: 'TT002', type: 'Telecom' },
    { id: 3, name: 'Banque de Tunisie', code: 'BT003', type: 'Banking' },
    { id: 4, name: 'Groupe Poulina', code: 'GP004', type: 'Industrial' },
    { id: 5, name: 'SOTUMAG', code: 'STM005', type: 'Retail' },
    { id: 6, name: 'Délice Danone', code: 'DD006', type: 'Food' },
    { id: 7, name: 'Carthago Cement', code: 'CC007', type: 'Construction' },
    { id: 8, name: 'Tunisair', code: 'TA008', type: 'Aviation' },
    { id: 9, name: 'STEG', code: 'STEG009', type: 'Utilities' },
    { id: 10, name: 'Monoprix Tunisie', code: 'MT010', type: 'Retail' }
  ];

  const bankOptions = [
    { id: 1, name: 'Banque Centrale de Tunisie', code: '01', swift: 'BCTNTNTX' },
    { id: 2, name: 'Banque de Tunisie', code: '02', swift: 'BTUNTNTX' },
    { id: 3, name: 'Banque Internationale Arabe de Tunisie', code: '03', swift: 'BIATNTNT' },
    { id: 4, name: 'Société Tunisienne de Banque', code: '04', swift: 'STBKTNTT' },
    { id: 5, name: 'Banque Nationale Agricole', code: '05', swift: 'BNATTNTX' },
    { id: 6, name: 'Amen Bank', code: '07', swift: 'ABTNTNTT' },
    { id: 7, name: 'Arab Tunisian Bank', code: '08', swift: 'ATBKTNTT' },
    { id: 8, name: 'Banque de l\'Habitat', code: '10', swift: 'BHTNTNTT' },
    { id: 9, name: 'Banque Zitouna', code: '11', swift: 'BZITTNTT' },
    { id: 10, name: 'Attijari Bank', code: '12', swift: 'BCMATNTT' },
    { id: 11, name: 'Banque Tuniso-Koweitienne', code: '14', swift: 'BTKWTNTT' },
    { id: 12, name: 'Union Bancaire pour le Commerce et l\'Industrie', code: '16', swift: 'UBCITNTT' }
  ];

  const options = type === 'partner' ? partnerOptions : bankOptions;

  useEffect(() => {
    if (value) {
      const filtered = options?.filter(option =>
        option?.name?.toLowerCase()?.includes(value?.toLowerCase()) ||
        option?.code?.toLowerCase()?.includes(value?.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options?.slice(0, 8)); // Show top 8 by default
    }
    setHighlightedIndex(-1);
  }, [value, type]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef?.current && !inputRef?.current?.contains(event?.target) &&
          listRef?.current && !listRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e?.target?.value;
    onChange(newValue);
    setIsOpen(true);
  };

  const handleOptionSelect = (option) => {
    onChange(option?.name);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e?.key === 'ArrowDown' || e?.key === 'Enter') {
        setIsOpen(true);
        return;
      }
    }

    switch (e?.key) {
      case 'ArrowDown':
        e?.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions?.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e?.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions?.length - 1
        );
        break;
      case 'Enter':
        e?.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions?.[highlightedIndex]) {
          handleOptionSelect(filteredOptions?.[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div className="relative">
      <div ref={inputRef}>
        <Input
          label={label}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          error={error}
          required={required}
          className="pr-10"
        />
        <div className="absolute right-3 top-9 flex items-center pointer-events-none">
          <Icon 
            name={isOpen ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            className="text-muted-foreground" 
          />
        </div>
      </div>
      {isOpen && filteredOptions?.length > 0 && (
        <div 
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-synthwave-lg max-h-64 overflow-y-auto"
        >
          {filteredOptions?.map((option, index) => (
            <button
              key={option?.id}
              onClick={() => handleOptionSelect(option)}
              className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors duration-150 ${
                index === highlightedIndex ? 'bg-muted' : ''
              } ${index === 0 ? 'rounded-t-lg' : ''} ${
                index === filteredOptions?.length - 1 ? 'rounded-b-lg' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">{option?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Code: {option?.code}
                    {type === 'partner' && option?.type && ` • ${option?.type}`}
                    {type === 'bank' && option?.swift && ` • ${option?.swift}`}
                  </div>
                </div>
                {type === 'bank' && (
                  <div className="flex items-center space-x-2">
                    <Icon name="Building" size={16} className="text-primary" />
                  </div>
                )}
                {type === 'partner' && (
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={16} className="text-secondary" />
                  </div>
                )}
              </div>
            </button>
          ))}
          
          {value && !filteredOptions?.some(opt => opt?.name?.toLowerCase() === value?.toLowerCase()) && (
            <div className="px-4 py-3 border-t border-border">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Keep the custom value
                }}
                className="w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                <div className="flex items-center space-x-2">
                  <Icon name="Plus" size={14} />
                  <span>Use "{value}" as new {type}</span>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KimbialeAutocomplete;