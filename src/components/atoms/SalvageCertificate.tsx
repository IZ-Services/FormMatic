import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './SalvageCertificate.css';

interface SalvageCertificateData {
  vehicleLicenseNumber?: string;
  makeOfVehicle?: string;
  year?: string;
  vehicleIdentificationNumber?: string;
  stateOfLastRegistration?: string;
  dateRegistrationExpires?: string;
  claimNumber?: string;
  dateWreckedOrDestroyed?: string;
  dateStolen?: string;
  dateRecovered?: string;
  costOrValue?: string;
  isOriginal?: boolean;
  isDuplicate?: boolean;
}

interface ValidationError {
  fieldPath: string;
  message: string;
}

interface SalvageCertificateProps {
  formData?: {
    salvageCertificate?: SalvageCertificateData;
    _showValidationErrors?: boolean;
  };
  onChange?: (data: SalvageCertificateData) => void;
  showValidationErrors?: boolean;
}

const initialSalvageData: SalvageCertificateData = {
  vehicleLicenseNumber: '',
  makeOfVehicle: '',
  year: '',
  vehicleIdentificationNumber: '',
  stateOfLastRegistration: '',
  dateRegistrationExpires: '',
  claimNumber: '',
  dateWreckedOrDestroyed: '',
  dateStolen: '',
  dateRecovered: '',
  costOrValue: '',
  isOriginal: false,
  isDuplicate: false
};

const SalvageCertificate: React.FC<SalvageCertificateProps> = ({ 
  formData: propFormData,
  onChange,
  showValidationErrors = false
}) => {
  const { formData: contextFormData, updateField } = useFormContext();
  
  // Combined form data from both context and props
  const formData = {
    ...contextFormData,
    ...propFormData
  };
  
  const [salvageData, setSalvageData] = useState<SalvageCertificateData>(
    propFormData?.salvageCertificate || 
    (contextFormData?.salvageCertificate as SalvageCertificateData) || 
    initialSalvageData
  );

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  // Use either prop-based or context-based validation flag
  const shouldShowValidationErrors = showValidationErrors || formData?._showValidationErrors === true;

  // Initialize form data if not present in context
  useEffect(() => {
    if (!contextFormData?.salvageCertificate) {
      updateField('salvageCertificate', initialSalvageData);
    }
  }, []);

  // Sync component state with context/props form data
  useEffect(() => {
    const currentData = formData?.salvageCertificate;
    if (currentData) {
      setSalvageData(currentData as SalvageCertificateData);
    }
  }, [formData?.salvageCertificate]);

  // Validation function
  const validateSalvageCertificate = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    // Certificate type validation
    if (!salvageData.isOriginal && !salvageData.isDuplicate) {
      errors.push({
        fieldPath: 'salvageCertificate.certificateType',
        message: 'Please select a certificate type (Original or Duplicate)'
      });
    }
    
    // State of last registration validation
    if (!salvageData.stateOfLastRegistration || salvageData.stateOfLastRegistration.trim() === '') {
      errors.push({
        fieldPath: 'salvageCertificate.stateOfLastRegistration',
        message: 'State of last registration is required'
      });
    }
    
    // Date registration expires validation
    if (!salvageData.dateRegistrationExpires || salvageData.dateRegistrationExpires.trim() === '') {
      errors.push({
        fieldPath: 'salvageCertificate.dateRegistrationExpires',
        message: 'Date registration expires is required'
      });
    } else {
      // Check if date is valid (MM/DD/YYYY format)
      const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
      if (!datePattern.test(salvageData.dateRegistrationExpires)) {
        errors.push({
          fieldPath: 'salvageCertificate.dateRegistrationExpires',
          message: 'Date must be in MM/DD/YYYY format'
        });
      }
    }
    
    // Cost/value validation
    if (!salvageData.costOrValue || salvageData.costOrValue.trim() === '') {
      errors.push({
        fieldPath: 'salvageCertificate.costOrValue',
        message: 'Cost or value is required'
      });
    } else if (!/^\d+(\.\d{1,2})?$/.test(salvageData.costOrValue)) {
      errors.push({
        fieldPath: 'salvageCertificate.costOrValue',
        message: 'Please enter a valid dollar amount'
      });
    }
    
    // Claim number validation
    if (!salvageData.claimNumber || salvageData.claimNumber.trim() === '') {
      errors.push({
        fieldPath: 'salvageCertificate.claimNumber',
        message: 'Claim number is required'
      });
    }
    
    // Date wrecked validation
    if (!salvageData.dateWreckedOrDestroyed || salvageData.dateWreckedOrDestroyed.trim() === '') {
      errors.push({
        fieldPath: 'salvageCertificate.dateWreckedOrDestroyed',
        message: 'Date wrecked is required'
      });
    } else {
      // Check if date is valid (MM/DD/YYYY format)
      const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
      if (!datePattern.test(salvageData.dateWreckedOrDestroyed)) {
        errors.push({
          fieldPath: 'salvageCertificate.dateWreckedOrDestroyed',
          message: 'Date must be in MM/DD/YYYY format'
        });
      } else {
        // Check if date is not in the future
        const [month, day, year] = salvageData.dateWreckedOrDestroyed.split('/').map(Number);
        const inputDate = new Date(year, month - 1, day);
        const today = new Date();
        
        if (inputDate > today) {
          errors.push({
            fieldPath: 'salvageCertificate.dateWreckedOrDestroyed',
            message: 'Date wrecked cannot be in the future'
          });
        }
      }
    }
    
    // If date stolen is provided, validate format
    if (salvageData.dateStolen && salvageData.dateStolen.trim() !== '') {
      const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
      if (!datePattern.test(salvageData.dateStolen)) {
        errors.push({
          fieldPath: 'salvageCertificate.dateStolen',
          message: 'Date must be in MM/DD/YYYY format'
        });
      } else {
        // Check if date is not in the future
        const [month, day, year] = salvageData.dateStolen.split('/').map(Number);
        const inputDate = new Date(year, month - 1, day);
        const today = new Date();
        
        if (inputDate > today) {
          errors.push({
            fieldPath: 'salvageCertificate.dateStolen',
            message: 'Date stolen cannot be in the future'
          });
        }
      }
    }
    
    // If date recovered is provided, validate format
    if (salvageData.dateRecovered && salvageData.dateRecovered.trim() !== '') {
      const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
      if (!datePattern.test(salvageData.dateRecovered)) {
        errors.push({
          fieldPath: 'salvageCertificate.dateRecovered',
          message: 'Date must be in MM/DD/YYYY format'
        });
      } else {
        // Check if date is not in the future
        const [month, day, year] = salvageData.dateRecovered.split('/').map(Number);
        const inputDate = new Date(year, month - 1, day);
        const today = new Date();
        
        if (inputDate > today) {
          errors.push({
            fieldPath: 'salvageCertificate.dateRecovered',
            message: 'Date recovered cannot be in the future'
          });
        }
        
        // If date stolen is provided, make sure date recovered is not before date stolen
        if (salvageData.dateStolen && salvageData.dateStolen.trim() !== '') {
          const [stolenMonth, stolenDay, stolenYear] = salvageData.dateStolen.split('/').map(Number);
          const stolenDate = new Date(stolenYear, stolenMonth - 1, stolenDay);
          
          if (inputDate < stolenDate) {
            errors.push({
              fieldPath: 'salvageCertificate.dateRecovered',
              message: 'Date recovered cannot be before date stolen'
            });
          }
        }
      }
    }
    
    return errors;
  };
  
  // Helper to get error message for a field
  const getErrorMessage = (fieldPath: string): string | null => {
    const error = validationErrors.find(err => err.fieldPath === fieldPath);
    return error ? error.message : null;
  };
  
  // Check if a specific field should show validation error
  const shouldShowValidationError = (field: string): boolean => {
    if (!shouldShowValidationErrors) return false;
    return validationErrors.some(err => err.fieldPath === `salvageCertificate.${field}`);
  };
  
  // Run validation when showing validation errors or when data changes
  useEffect(() => {
    if (shouldShowValidationErrors) {
      const errors = validateSalvageCertificate();
      setValidationErrors(errors);
      
      // Update global form validation state
      const currentValidationErrors = typeof contextFormData._validationErrors === 'object' && 
        contextFormData._validationErrors !== null
        ? contextFormData._validationErrors
        : {};
        
      updateField('_validationErrors', {
        ...currentValidationErrors,
        salvageCertificate: errors.length > 0
      });
    }
  }, [shouldShowValidationErrors, salvageData]);

  const handleInputChange = (field: keyof SalvageCertificateData, value: string) => {
    const newData = { 
      ...salvageData, 
      [field]: field.toLowerCase().includes('date') 
        ? formatDate(value) 
        : value 
    };
    
    setSalvageData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField('salvageCertificate', newData);
    }
  };

  const handleCheckboxChange = (field: 'isOriginal' | 'isDuplicate') => {    
    const newData = { 
      ...salvageData,
      isOriginal: field === 'isOriginal' ? !salvageData.isOriginal : false,
      isDuplicate: field === 'isDuplicate' ? !salvageData.isDuplicate : false
    };
    
    setSalvageData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField('salvageCertificate', newData);
    }
  };

  const formatDate = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    let formatted = digitsOnly;
    if (formatted.length > 2) {
      formatted = `${formatted.slice(0, 2)}/${formatted.slice(2)}`;
    }
    if (formatted.length > 5) {
      formatted = `${formatted.slice(0, 5)}/${formatted.slice(5)}`;
    }
    return formatted.slice(0, 10);
  };

  return (
    <div className="salvage-certificate-wrapper">
      <div className="section-header">
        <div className={`certificate-type-checkboxes ${shouldShowValidationError('certificateType') ? 'validation-error-container' : ''}`}>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={salvageData.isOriginal || false}
              onChange={() => handleCheckboxChange('isOriginal')}
            />
            Original
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={salvageData.isDuplicate || false}
              onChange={() => handleCheckboxChange('isDuplicate')}
            />
            Duplicate
          </label>
          
          {shouldShowValidationError('certificateType') && (
            <div className="validation-message">
              {getErrorMessage('salvageCertificate.certificateType')}
            </div>
          )}
        </div>
      </div>
      <h3 className="section-title">Salvage Certificate</h3>

      <div className="form-grid">
        <div className="input-roww">
          <div className="input-groupp">
            <label className="input-label">State of last registration</label>
            <input
              type="text"
              className={`form-input ${shouldShowValidationError('stateOfLastRegistration') ? 'validation-error' : ''}`}
              placeholder="Enter state"
              value={salvageData.stateOfLastRegistration || ''}
              onChange={(e) => handleInputChange('stateOfLastRegistration', e.target.value)}
              maxLength={20}
            />
            {shouldShowValidationError('stateOfLastRegistration') && (
              <div className="validation-message">
                {getErrorMessage('salvageCertificate.stateOfLastRegistration')}
              </div>
            )}
          </div>
          <div className="input-groupp">
            <label className="input-label">Date registration expires</label>
            <input
              type="text"
              className={`form-input ${shouldShowValidationError('dateRegistrationExpires') ? 'validation-error' : ''}`}
              placeholder="MM/DD/YYYY"
              value={salvageData.dateRegistrationExpires || ''}
              onChange={(e) => handleInputChange('dateRegistrationExpires', e.target.value)}
              maxLength={10}
            />
            {shouldShowValidationError('dateRegistrationExpires') && (
              <div className="validation-message">
                {getErrorMessage('salvageCertificate.dateRegistrationExpires')}
              </div>
            )}
          </div>
        </div>
        <div className="input-roww">
          <div className="input-groupp">
            <label className="input-label">Cost/value</label>
            <input
              type="text"
              className={`form-input ${shouldShowValidationError('costOrValue') ? 'validation-error' : ''}`}
              placeholder="Enter cost or value"
              value={salvageData.costOrValue || ''}
              onChange={(e) => handleInputChange('costOrValue', e.target.value)}
              maxLength={20}
            />
            {shouldShowValidationError('costOrValue') && (
              <div className="validation-message">
                {getErrorMessage('salvageCertificate.costOrValue')}
              </div>
            )}
          </div>
          <div className="input-groupp">
            <label className="input-label">Claim number</label>
            <input
              type="text"
              className={`form-input ${shouldShowValidationError('claimNumber') ? 'validation-error' : ''}`}
              placeholder="Enter claim number"
              value={salvageData.claimNumber || ''}
              onChange={(e) => handleInputChange('claimNumber', e.target.value)}
              maxLength={20}
            />
            {shouldShowValidationError('claimNumber') && (
              <div className="validation-message">
                {getErrorMessage('salvageCertificate.claimNumber')}
              </div>
            )}
          </div>
        </div>
        <div className="input-roww">
          <div className="input-groupp">
            <label className="input-label">Date wrecked</label>
            <input
              type="text"
              className={`form-input ${shouldShowValidationError('dateWreckedOrDestroyed') ? 'validation-error' : ''}`}
              placeholder="MM/DD/YYYY"
              value={salvageData.dateWreckedOrDestroyed || ''}
              onChange={(e) => handleInputChange('dateWreckedOrDestroyed', e.target.value)}
              maxLength={10}
            />
            {shouldShowValidationError('dateWreckedOrDestroyed') && (
              <div className="validation-message">
                {getErrorMessage('salvageCertificate.dateWreckedOrDestroyed')}
              </div>
            )}
          </div>
          <div className="input-groupp">
            <label className="input-label">Date stolen</label>
            <input
              type="text"
              className={`form-input ${shouldShowValidationError('dateStolen') ? 'validation-error' : ''}`}
              placeholder="MM/DD/YYYY"
              value={salvageData.dateStolen || ''}
              onChange={(e) => handleInputChange('dateStolen', e.target.value)}
              maxLength={10}
            />
            {shouldShowValidationError('dateStolen') && (
              <div className="validation-message">
                {getErrorMessage('salvageCertificate.dateStolen')}
              </div>
            )}
          </div>
          <div className="input-groupp">
            <label className="input-label">Date recovered</label>
            <input
              type="text"
              className={`form-input ${shouldShowValidationError('dateRecovered') ? 'validation-error' : ''}`}
              placeholder="MM/DD/YYYY"
              value={salvageData.dateRecovered || ''}
              onChange={(e) => handleInputChange('dateRecovered', e.target.value)}
              maxLength={10}
            />
            {shouldShowValidationError('dateRecovered') && (
              <div className="validation-message">
                {getErrorMessage('salvageCertificate.dateRecovered')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalvageCertificate;