import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './LicensePlateDisposition.css';

interface LicensePlateDispositionData {
  platesSurrendered?: 'one' | 'two';
  beingSurrendered?: boolean;
  haveLost?: boolean;
  haveDestroyed?: boolean;
  occupationalLicenseNumber?: string;
  plateRetainedByOwner?: boolean;
}

interface ValidationError {
  fieldPath: string;
  message: string;
}

interface LicensePlateDispositionProps {
  formData?: {
    licensePlateDisposition?: LicensePlateDispositionData;
    _showValidationErrors?: boolean;
  };
  onChange?: (data: LicensePlateDispositionData) => void;
  showValidationErrors?: boolean;
}

const initialDispositionData: LicensePlateDispositionData = {
  platesSurrendered: undefined,
  beingSurrendered: false,
  haveLost: false,
  haveDestroyed: false,
  occupationalLicenseNumber: '',
  plateRetainedByOwner: false
};

const LicensePlateDisposition: React.FC<LicensePlateDispositionProps> = ({ 
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
  
  const [dispositionData, setDispositionData] = useState<LicensePlateDispositionData>(
    propFormData?.licensePlateDisposition || 
    (contextFormData?.licensePlateDisposition as LicensePlateDispositionData) || 
    initialDispositionData
  );
  
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  // Use either prop-based or context-based validation flag
  const shouldShowValidationErrors = showValidationErrors || formData?._showValidationErrors === true;

  // Initialize form data if not present in context
  useEffect(() => {
    if (!contextFormData?.licensePlateDisposition) {
      updateField('licensePlateDisposition', initialDispositionData);
    }
  }, []);

  // Sync component state with context/props form data
  useEffect(() => {
    const currentData = formData?.licensePlateDisposition;
    if (currentData) {
      setDispositionData({
        beingSurrendered: false,
        haveLost: false,
        haveDestroyed: false,
        plateRetainedByOwner: false,
        ...currentData
      });
    }
  }, [formData?.licensePlateDisposition]);
  
  // Validation function
  const validateLicensePlateDisposition = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    // At least one disposition option must be selected
    if (!dispositionData.beingSurrendered && 
        !dispositionData.haveLost && 
        !dispositionData.haveDestroyed && 
        !dispositionData.plateRetainedByOwner) {
      errors.push({
        fieldPath: 'licensePlateDisposition.disposition',
        message: 'Please select a license plate disposition option'
      });
    }
    
    // If "being surrendered" is selected, platesSurrendered is required
    if (dispositionData.beingSurrendered && !dispositionData.platesSurrendered) {
      errors.push({
        fieldPath: 'licensePlateDisposition.platesSurrendered',
        message: 'Please select how many plates are being surrendered'
      });
    }
    
    // If "have been destroyed" is selected, occupational license number is required
    if (dispositionData.haveDestroyed && 
        (!dispositionData.occupationalLicenseNumber || 
         dispositionData.occupationalLicenseNumber.trim() === '')) {
      errors.push({
        fieldPath: 'licensePlateDisposition.occupationalLicenseNumber',
        message: 'Occupational license number is required'
      });
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
    return validationErrors.some(err => err.fieldPath === `licensePlateDisposition.${field}`);
  };
  
  // Run validation when showing validation errors or when data changes
  useEffect(() => {
    if (shouldShowValidationErrors) {
      const errors = validateLicensePlateDisposition();
      setValidationErrors(errors);
      
      // Update global form validation state
      const currentValidationErrors = typeof contextFormData._validationErrors === 'object' && 
        contextFormData._validationErrors !== null
        ? contextFormData._validationErrors
        : {};
        
      updateField('_validationErrors', {
        ...currentValidationErrors,
        licensePlateDisposition: errors.length > 0
      });
    }
  }, [shouldShowValidationErrors, dispositionData]);

  const handleCheckboxChange = (field: keyof LicensePlateDispositionData) => {
    const newData: LicensePlateDispositionData = { 
      ...dispositionData,
      beingSurrendered: false,
      haveLost: false,
      haveDestroyed: false,
      plateRetainedByOwner: false,
      [field]: true
    };

    setDispositionData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField('licensePlateDisposition', newData);
    }
  };

  const handlePlatesSurrenderedChange = (plates: 'one' | 'two') => {
    const newData = { 
      ...dispositionData, 
      platesSurrendered: plates 
    };
    
    setDispositionData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField('licensePlateDisposition', newData);
    }
  };

  const handleOccupationalLicenseChange = (value: string) => {
    const newData = { 
      ...dispositionData, 
      occupationalLicenseNumber: value.toUpperCase() 
    };
    
    setDispositionData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField('licensePlateDisposition', newData);
    }
  };

  return (
    <div className="license-plate-disposition-wrapper">
      <div className="section-header">
        <h3 className="section-title">Certification of License Plate Disposition</h3>
      </div>

      <div className="disposition-content">
        <p className="section-description">The license plates assigned to this vehicle:</p>

        {shouldShowValidationError('disposition') && (
          <div className="validation-message">
            {getErrorMessage('licensePlateDisposition.disposition')}
          </div>
        )}

        <div className={`checkbox-group ${shouldShowValidationError('disposition') ? 'validation-error-container' : ''}`}>
          <div className="checkbox-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={dispositionData.beingSurrendered || false}
                onChange={() => handleCheckboxChange('beingSurrendered')}
              />
              Are being surrendered
            </label>
            
            {dispositionData.beingSurrendered && (
              <div className={`plates-surrendered-group ${shouldShowValidationError('platesSurrendered') ? 'validation-error-container' : ''}`}>
                <span className="plates-surrendered-title">Plates surrendered:</span>
                <div className="radio-options">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="platesSurrendered"
                      checked={dispositionData.platesSurrendered === 'one'}
                      onChange={() => handlePlatesSurrenderedChange('one')}
                    />
                    One
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="platesSurrendered"
                      checked={dispositionData.platesSurrendered === 'two'}
                      onChange={() => handlePlatesSurrenderedChange('two')}
                    />
                    Two
                  </label>
                </div>
                
                {shouldShowValidationError('platesSurrendered') && (
                  <div className="validation-message">
                    {getErrorMessage('licensePlateDisposition.platesSurrendered')}
                  </div>
                )}
              </div>
            )}
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={dispositionData.haveLost || false}
              onChange={() => handleCheckboxChange('haveLost')}
            />
            Have been lost
          </label>

          <div className="checkbox-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={dispositionData.haveDestroyed || false}
                onChange={() => handleCheckboxChange('haveDestroyed')}
              />
              Have been destroyed (Occupational Licensees Only)
            </label>
            
            {dispositionData.haveDestroyed && (
              <div className={`occupational-license-group ${shouldShowValidationError('occupationalLicenseNumber') ? 'validation-error-container' : ''}`}>
                <label>
                  Occupational License Number
                  <input
                    type="text"
                    className={`occupational-license-input ${shouldShowValidationError('occupationalLicenseNumber') ? 'validation-error' : ''}`}
                    value={dispositionData.occupationalLicenseNumber || ''}
                    onChange={(e) => handleOccupationalLicenseChange(e.target.value)}
                  />
                </label>
                
                {shouldShowValidationError('occupationalLicenseNumber') && (
                  <div className="validation-message">
                    {getErrorMessage('licensePlateDisposition.occupationalLicenseNumber')}
                  </div>
                )}
              </div>
            )}
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={dispositionData.plateRetainedByOwner || false}
              onChange={() => handleCheckboxChange('plateRetainedByOwner')}
            />
            Plate with owner - Retained by owner for reassignment
          </label>
        </div>
      </div>
    </div>
  );
};

export default LicensePlateDisposition;