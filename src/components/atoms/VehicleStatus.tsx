import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './VehicleStatus.css';

interface VehicleStatusData {
  didNotOwnAtEntry?: boolean;
  notCaliforniaResident?: boolean;
  vehicleCondition?: 'new' | 'used';
  purchaseLocation?: 'inside' | 'outside';
}

interface ValidationError {
  fieldPath: string;
  message: string;
}

interface FormDataType {
  vehicleStatus?: VehicleStatusData;
  _showValidationErrors?: boolean;
  [key: string]: any;
}

interface VehicleStatusProps {
  formData?: FormDataType;
  onChange?: (data: VehicleStatusData) => void;
  showValidationErrors?: boolean;
}

const VehicleStatus: React.FC<VehicleStatusProps> = ({
  formData: propFormData,
  onChange,
  showValidationErrors = false
}) => {
  const { formData: contextFormData, updateField } = useFormContext();

  const combinedFormData: FormDataType = {
    ...contextFormData,
    ...propFormData
  };

  const [statusData, setStatusData] = useState<VehicleStatusData>({
    didNotOwnAtEntry: false,
    notCaliforniaResident: false,
    vehicleCondition: undefined,
    purchaseLocation: undefined
  });
  
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  

  const shouldShowValidationErrors = showValidationErrors || combinedFormData?._showValidationErrors === true;

  useEffect(() => {
    const mergedData: VehicleStatusData = {
      didNotOwnAtEntry: false,
      notCaliforniaResident: false,
      vehicleCondition: undefined,
      purchaseLocation: undefined,
      ...combinedFormData?.vehicleStatus
    };
    setStatusData(mergedData);
  }, [combinedFormData?.vehicleStatus]);


  const validateVehicleStatus = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    

    if (!statusData.vehicleCondition) {
      errors.push({
        fieldPath: 'vehicleStatus.vehicleCondition',
        message: 'Please select the vehicle condition'
      });
    }
    

    if (!statusData.purchaseLocation) {
      errors.push({
        fieldPath: 'vehicleStatus.purchaseLocation',
        message: 'Please select the purchase location'
      });
    }
    
    return errors;
  };
  

  const getErrorMessage = (fieldPath: string): string | null => {
    const error = validationErrors.find(err => err.fieldPath === fieldPath);
    return error ? error.message : null;
  };
  

  const shouldShowValidationError = (field: string): boolean => {
    if (!shouldShowValidationErrors) return false;
    return validationErrors.some(err => err.fieldPath === `vehicleStatus.${field}`);
  };
  

  useEffect(() => {
    if (shouldShowValidationErrors) {
      const errors = validateVehicleStatus();
      setValidationErrors(errors);
      

      const currentValidationErrors = typeof contextFormData._validationErrors === 'object' && 
        contextFormData._validationErrors !== null
        ? contextFormData._validationErrors
        : {};
        
      updateField('_validationErrors', {
        ...currentValidationErrors,
        vehicleStatus: errors.length > 0
      });
    }
  }, [shouldShowValidationErrors, statusData]);

  const handleCheckboxChange = (field: 'didNotOwnAtEntry' | 'notCaliforniaResident') => {
    const newData = {
      ...statusData,
      [field]: !statusData[field]
    };

    setStatusData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField('vehicleStatus', newData);
    }
  };

  const handleRadioChange = (field: 'vehicleCondition' | 'purchaseLocation', value: any) => {
    const newData = {
      ...statusData,
      [field]: value
    };

    setStatusData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField('vehicleStatus', newData);
    }
  };

  return (
    <div className="vehicleStatusWrapper">
      <div className="headerRow">
        <h3 className="sectionHeading">Vehicle Status Information</h3>
      </div>

      <div className="statusSection">
        <div className="checkboxRow">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={statusData.didNotOwnAtEntry || false}
              onChange={() => handleCheckboxChange('didNotOwnAtEntry')}
              className="checkbox-input"
            />
            <span className="checkbox-text">
              If vehicle was previously registered in CA, then registered or located outside CA and has now returned, enter date vehicle entered CA. If you did not own the vehicle at entry, check box:
            </span>
          </label>
        </div>
      </div>

      <div className="statusSection">
        <div className="checkboxRow">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={statusData.notCaliforniaResident || false}
              onChange={() => handleCheckboxChange('notCaliforniaResident')}
              className="checkbox-input"
            />
            <span className="checkbox-text">
              If you are not a CA resident, check this box:
            </span>
          </label>
        </div>
      </div>

      <div className="radioSection">
        <div className={`radioGroup ${shouldShowValidationError('vehicleCondition') ? 'validation-error-container' : ''}`}>
          <p className="radioHeading">Vehicle Condition:</p>
          <div className="radioOptions">
            <label className="radio-label">
              <input
                type="radio"
                name="vehicleCondition"
                checked={statusData.vehicleCondition === 'new'}
                onChange={() => handleRadioChange('vehicleCondition', 'new')}
              />
              New
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="vehicleCondition"
                checked={statusData.vehicleCondition === 'used'}
                onChange={() => handleRadioChange('vehicleCondition', 'used')}
              />
              Used
            </label>
          </div>
          {shouldShowValidationError('vehicleCondition') && (
            <p className="validation-message">
              {getErrorMessage('vehicleStatus.vehicleCondition')}
            </p>
          )}
        </div>

        <div className={`radioGroup ${shouldShowValidationError('purchaseLocation') ? 'validation-error-container' : ''}`}>
          <p className="radioHeading">Purchase Location:</p>
          <div className="radioOptions">
            <label className="radio-label">
              <input
                type="radio"
                name="purchaseLocation"
                checked={statusData.purchaseLocation === 'inside'}
                onChange={() => handleRadioChange('purchaseLocation', 'inside')}
              />
              Inside CA
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="purchaseLocation"
                checked={statusData.purchaseLocation === 'outside'}
                onChange={() => handleRadioChange('purchaseLocation', 'outside')}
              />
              Outside CA
            </label>
          </div>
          {shouldShowValidationError('purchaseLocation') && (
            <p className="validation-message">
              {getErrorMessage('vehicleStatus.purchaseLocation')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleStatus;