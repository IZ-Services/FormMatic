import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './CommercialVehicleInfo.css';

interface CommercialVehicleData {
  numberOfAxles: string;
  unladenWeight: string;
  isEstimatedWeight: boolean | null;
  bodyModelType: string; 
}

interface ValidationError {
  field: string;
  message: string;
}

interface CommercialVehicleInfoProps {
  formData?: {
    commercialVehicleInfo?: CommercialVehicleData;
    _showValidationErrors?: boolean;
    [key: string]: any;
  };
  onChange?: (data: any) => void;
  showValidationErrors?: boolean;
}

const CommercialVehicleInfo: React.FC<CommercialVehicleInfoProps> = ({ 
  formData: propFormData, 
  onChange,
  showValidationErrors = false 
}) => {
  const { formData: contextFormData, updateField } = useFormContext();
  
  const formData = {
    ...contextFormData,
    ...propFormData
  };
  
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  const [vehicleData, setVehicleData] = useState<CommercialVehicleData>({
    numberOfAxles: formData?.commercialVehicleInfo?.numberOfAxles || '',
    unladenWeight: formData?.commercialVehicleInfo?.unladenWeight || '',
    isEstimatedWeight: formData?.commercialVehicleInfo?.isEstimatedWeight === true ? true : 
                       formData?.commercialVehicleInfo?.isEstimatedWeight === false ? false : null,
    bodyModelType: formData?.commercialVehicleInfo?.bodyModelType || '' 
  });
  
  // Validation function
  const validateCommercialVehicleInfo = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    // Validate number of axles
    if (!vehicleData.numberOfAxles) {
      errors.push({
        field: 'numberOfAxles',
        message: 'Number of axles is required'
      });
    } else {
      const axlesNum = parseInt(vehicleData.numberOfAxles, 10);
      if (isNaN(axlesNum) || axlesNum <= 0 || axlesNum > 10) {
        errors.push({
          field: 'numberOfAxles',
          message: 'Number of axles must be between 1 and 10'
        });
      }
    }
    
    // Validate unladen weight
    if (!vehicleData.unladenWeight) {
      errors.push({
        field: 'unladenWeight',
        message: 'Unladen weight is required'
      });
    } else {
      const weightNum = parseInt(vehicleData.unladenWeight, 10);
      if (isNaN(weightNum) || weightNum <= 0) {
        errors.push({
          field: 'unladenWeight',
          message: 'Unladen weight must be a positive number'
        });
      }
    }
    
    // Validate estimated weight checkbox
    if (vehicleData.isEstimatedWeight === null) {
      errors.push({
        field: 'isEstimatedWeight',
        message: 'Please select whether the weight is actual or estimated'
      });
    }
    
    // Validate body model type (optional, but add some basic validation if needed)
    if (vehicleData.bodyModelType && vehicleData.bodyModelType.length > 50) {
      errors.push({
        field: 'bodyModelType',
        message: 'Body model type cannot exceed 50 characters'
      });
    }
    
    return errors;
  };
  
  // Helper to get error message for a field
  const getErrorMessage = (field: string): string | null => {
    const error = validationErrors.find(err => err.field === field);
    return error ? error.message : null;
  };
  
  // Sync with props when they change
  useEffect(() => {
    if (propFormData?.commercialVehicleInfo) {
      setVehicleData(prev => ({
        ...prev,
        ...propFormData.commercialVehicleInfo
      }));
    }
  }, [propFormData]);
  
// Run validation when showing validation errors or when data changes
useEffect(() => {
  if (showValidationErrors) {
    const errors = validateCommercialVehicleInfo();
    setValidationErrors(errors);
  }
}, [showValidationErrors, vehicleData]);

// Update parent component about validation status
useEffect(() => {
  if (showValidationErrors) {
    updateField('_validationErrors', (prev: any) => ({
      ...prev,
      commercialVehicleInfo: validationErrors.length > 0
    }));
  }
}, [validationErrors, showValidationErrors]);
  
  const handleInputChange = (field: keyof CommercialVehicleData, value: string | boolean) => {
    const newData = { ...vehicleData, [field]: value };
    setVehicleData(newData);
    
    if (onChange) {
      onChange({ commercialVehicleInfo: newData });
    } else {
      updateField('commercialVehicleInfo', newData);
    }
    
    // Run validation if showing validation errors
    if (showValidationErrors) {
      const errors = validateCommercialVehicleInfo();
      setValidationErrors(errors);
    }
  };
 
  const handleAxlesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    handleInputChange('numberOfAxles', value);
  };
 
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    handleInputChange('unladenWeight', value);
  };

  const handleWeightTypeChange = (isEstimated: boolean) => {
    handleInputChange('isEstimatedWeight', isEstimated);
  };

  const handleBodyModelTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('bodyModelType', e.target.value);
  };

  return (
    <div className="commercial-vehicle-wrapper">
      <div className="commercial-heading">
        <h3>FOR COMMERCIAL VEHICLES ONLY</h3>
      </div>
      
      <div className="commercial-fields-container">
        <div className="commercial-field-group">
          <label htmlFor="axles-input">Number of axles:</label>
          <input
            id="axles-input"
            type="text"
            className={`form-control ${showValidationErrors && getErrorMessage('numberOfAxles') ? 'validation-error' : ''}`}
            value={vehicleData.numberOfAxles}
            onChange={handleAxlesChange}
            placeholder="Enter number"
            maxLength={2}
          />
          {showValidationErrors && getErrorMessage('numberOfAxles') && (
            <p className="validation-message">{getErrorMessage('numberOfAxles')}</p>
          )}
        </div>
        
        <div className="commercial-field-group">
          <label htmlFor="weight-input">Unladen weight:</label>
          <input
            id="weight-input"
            type="text"
            className={`form-control ${showValidationErrors && getErrorMessage('unladenWeight') ? 'validation-error' : ''}`}
            value={vehicleData.unladenWeight}
            onChange={handleWeightChange}
            placeholder="Enter weight"
          />
          {showValidationErrors && getErrorMessage('unladenWeight') && (
            <p className="validation-message">{getErrorMessage('unladenWeight')}</p>
          )}
        </div>
        
        <div className="commercial-field-group" style={{ maxWidth: '180px' }}>
          <label htmlFor="body-model-type">Body Model Type:</label>
          <input
            id="body-model-type"
            type="text"
            className={`form-control ${showValidationErrors && getErrorMessage('bodyModelType') ? 'validation-error' : ''}`}
            value={vehicleData.bodyModelType}
            onChange={handleBodyModelTypeChange}
            placeholder="Body type"
          />
          {showValidationErrors && getErrorMessage('bodyModelType') && (
            <p className="validation-message">{getErrorMessage('bodyModelType')}</p>
          )}
        </div>
        
        <div className="weight-type-container">
          <div className="weight-type-option">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={vehicleData.isEstimatedWeight === false}
                onChange={() => handleWeightTypeChange(false)}
                className="checkbox-input"
              />
              <span className="checkbox-text">Actual</span>
            </label>
          </div>
          
          <div className="weight-type-option">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={vehicleData.isEstimatedWeight === true}
                onChange={() => handleWeightTypeChange(true)}
                className="checkbox-input"
              />
              <span className="checkbox-text">Estimated (Vehicles over 10,001 lbs. only)</span>
            </label>
          </div>
          {showValidationErrors && getErrorMessage('isEstimatedWeight') && (
            <p className="validation-message">{getErrorMessage('isEstimatedWeight')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommercialVehicleInfo;