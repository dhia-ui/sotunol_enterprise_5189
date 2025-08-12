import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const KimbialeBankValidator = ({ rib, onValidationChange }) => {
  const [validationResult, setValidationResult] = useState({
    isValid: false,
    bankCode: '',
    branchCode: '',
    accountNumber: '',
    checkDigits: '',
    bankName: '',
    errors: []
  });

  const tunisianBanks = [
    { code: '01', name: 'Banque Centrale de Tunisie' },
    { code: '02', name: 'Banque de Tunisie' },
    { code: '03', name: 'Banque Internationale Arabe de Tunisie' },
    { code: '04', name: 'Société Tunisienne de Banque' },
    { code: '05', name: 'Banque Nationale Agricole' },
    { code: '07', name: 'Amen Bank' },
    { code: '08', name: 'Arab Tunisian Bank' },
    { code: '10', name: 'Banque de l\'Habitat' },
    { code: '11', name: 'Banque Zitouna' },
    { code: '12', name: 'Attijari Bank' },
    { code: '14', name: 'Banque Tuniso-Koweitienne' },
    { code: '16', name: 'Union Bancaire pour le Commerce et l\'Industrie' },
    { code: '17', name: 'Banque Tunisienne de Solidarité' },
    { code: '20', name: 'Citibank' },
    { code: '23', name: 'Qatar National Bank Alahli' }
  ];

  useEffect(() => {
    if (rib) {
      validateRIB(rib);
    }
  }, [rib]);

  const validateRIB = (ribValue) => {
    const errors = [];
    let isValid = true;

    // Remove spaces and convert to uppercase
    const cleanRib = ribValue?.replace(/\s/g, '')?.toUpperCase();

    // Check length (20 digits for Tunisia RIB)
    if (cleanRib?.length !== 20) {
      errors?.push('RIB must be exactly 20 digits');
      isValid = false;
    }

    // Check if all characters are digits
    if (!/^\d{20}$/?.test(cleanRib)) {
      errors?.push('RIB must contain only digits');
      isValid = false;
    }

    let bankCode = '';
    let branchCode = '';
    let accountNumber = '';
    let checkDigits = '';
    let bankName = '';

    if (cleanRib?.length === 20) {
      bankCode = cleanRib?.substring(0, 2);
      branchCode = cleanRib?.substring(2, 5);
      accountNumber = cleanRib?.substring(5, 18);
      checkDigits = cleanRib?.substring(18, 20);

      // Validate bank code
      const bank = tunisianBanks?.find(b => b?.code === bankCode);
      if (!bank) {
        errors?.push(`Invalid bank code: ${bankCode}`);
        isValid = false;
      } else {
        bankName = bank?.name;
      }

      // Validate check digits using modulo 97
      if (isValid) {
        const accountPart = cleanRib?.substring(0, 18);
        const calculatedCheck = 97 - (parseInt(accountPart) % 97);
        const providedCheck = parseInt(checkDigits);

        if (calculatedCheck !== providedCheck) {
          errors?.push('Invalid check digits - RIB verification failed');
          isValid = false;
        }
      }
    }

    const result = {
      isValid,
      bankCode,
      branchCode,
      accountNumber,
      checkDigits,
      bankName,
      errors
    };

    setValidationResult(result);
    onValidationChange?.(result);
  };

  const formatRIB = (value) => {
    const clean = value?.replace(/\s/g, '');
    return clean?.replace(/(.{2})(.{3})(.{13})(.{2})/, '$1 $2 $3 $4');
  };

  if (!rib) return null;

  return (
    <div className="mt-2 p-3 bg-muted/30 rounded-lg border border-border">
      <div className="flex items-center space-x-2 mb-2">
        <Icon 
          name={validationResult?.isValid ? "CheckCircle" : "AlertCircle"} 
          size={16} 
          className={validationResult?.isValid ? "text-success" : "text-destructive"} 
        />
        <span className="text-sm font-medium">
          RIB Validation {validationResult?.isValid ? "Passed" : "Failed"}
        </span>
      </div>
      {rib?.length >= 8 && (
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground">Formatted RIB:</span>
              <div className="font-mono text-foreground">{formatRIB(rib)}</div>
            </div>
            {validationResult?.bankName && (
              <div>
                <span className="text-muted-foreground">Bank:</span>
                <div className="text-foreground">{validationResult?.bankName}</div>
              </div>
            )}
          </div>

          {validationResult?.bankCode && (
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Bank Code:</span>
                <div className="font-mono">{validationResult?.bankCode}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Branch:</span>
                <div className="font-mono">{validationResult?.branchCode}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Account:</span>
                <div className="font-mono">{validationResult?.accountNumber?.substring(0, 6)}...</div>
              </div>
              <div>
                <span className="text-muted-foreground">Check:</span>
                <div className="font-mono">{validationResult?.checkDigits}</div>
              </div>
            </div>
          )}
        </div>
      )}
      {validationResult?.errors?.length > 0 && (
        <div className="mt-2 space-y-1">
          {validationResult?.errors?.map((error, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs text-destructive">
              <Icon name="AlertTriangle" size={12} />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KimbialeBankValidator;