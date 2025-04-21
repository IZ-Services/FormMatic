'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './DisabledPersonLicensePlate.css';

interface DisabledPersonLicensePlatesType {
  licensePlateNumber?: string;
  vehicleIdentificationNumber?: string;
  vehicleMake?: string;
  vehicleYear?: string;
  weightFeeExemption?: boolean;
}

interface ValidationError {
  field: string;
  message: string;
}

interface DisabledPersonLicensePlatesProps {
  formData?: {
    disabledPersonLicensePlates?: DisabledPersonLicensePlatesType;
  };
  onChange?: (data: DisabledPersonLicensePlatesType) => void;
  readOnly?: boolean;
  showValidationErrors?: boolean;
}

const initialDisabledPersonLicensePlates: DisabledPersonLicensePlatesType = {
  licensePlateNumber: '',
  vehicleIdentificationNumber: '',
  vehicleMake: '',
  vehicleYear: '',
  weightFeeExemption: undefined 
};

const DisabledPersonLicensePlates: React.FC<DisabledPersonLicensePlatesProps> = ({
  formData: propFormData,
  onChange,
  readOnly = false,
  showValidationErrors = false
}) => {
  const { formData: contextFormData, updateField } = useFormContext();
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  

  const prevValidationState = useRef<boolean | undefined>(undefined);
  const isInitialMount = useRef(true);
  

  const currentFormData = {
    ...contextFormData,
    ...propFormData
  };
  
  const currentLicensePlates = currentFormData.disabledPersonLicensePlates || initialDisabledPersonLicensePlates;
  

  const validateDisabledPersonLicensePlates = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    const info = currentLicensePlates;
    

    if (!info.licensePlateNumber) {
      errors.push({
        field: 'licensePlateNumber',
        message: 'License plate number is required'
      });
    } else if (!/^[A-Z0-9]{1,7}$/.test(info.licensePlateNumber)) {
      errors.push({
        field: 'licensePlateNumber',
        message: 'Please enter a valid license plate number'
      });
    }
    

    if (!info.vehicleIdentificationNumber) {
      errors.push({
        field: 'vehicleIdentificationNumber',
        message: 'Vehicle identification number is required'
      });
    } else if (!/^[A-Z0-9]{17}$/.test(info.vehicleIdentificationNumber)) {
      errors.push({
        field: 'vehicleIdentificationNumber',
        message: 'Please enter a valid 17-character VIN'
      });
    }
    

    if (!info.vehicleMake) {
      errors.push({
        field: 'vehicleMake',
        message: 'Vehicle make is required'
      });
    } else if (info.vehicleMake.length < 2) {
      errors.push({
        field: 'vehicleMake',
        message: 'Please enter a valid vehicle make'
      });
    }
    

    if (!info.vehicleYear) {
      errors.push({
        field: 'vehicleYear',
        message: 'Vehicle year is required'
      });
    } else if (!/^\d{4}$/.test(info.vehicleYear)) {
      errors.push({
        field: 'vehicleYear',
        message: 'Please enter a valid 4-digit year'
      });
    } else {
      const yearValue = parseInt(info.vehicleYear, 10);
      const currentYear = new Date().getFullYear();
      
      if (yearValue < 1900 || yearValue > currentYear + 1) {
        errors.push({
          field: 'vehicleYear',
          message: `Year must be between 1900 and ${currentYear + 1}`
        });
      }
    }
    

    if (info.weightFeeExemption === undefined) {
      errors.push({
        field: 'weightFeeExemption',
        message: 'Please indicate whether you are requesting a weight fee exemption'
      });
    }
    
    return errors;
  };


  const getErrorMessage = (field: string): string | null => {
    const error = validationErrors.find(err => err.field === field);
    return error ? error.message : null;
  };


  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      
      if (!contextFormData.disabledPersonLicensePlates) {
        updateField('disabledPersonLicensePlates', initialDisabledPersonLicensePlates);
        if (onChange) {
          onChange(initialDisabledPersonLicensePlates);
        }
      }
    }
  }, []);


  useEffect(() => {
    if (showValidationErrors) {
      const errors = validateDisabledPersonLicensePlates();
      setValidationErrors(errors);
    } else {
      setValidationErrors([]);
    }
  }, [showValidationErrors]);


  useEffect(() => {
    if (!showValidationErrors) return;
    
    const hasErrors = validationErrors.length > 0;
    

    if (prevValidationState.current !== hasErrors) {
      prevValidationState.current = hasErrors;
      

      updateField('_validationErrors', (prev: any = {}) => {
        if (prev?.disabledPersonLicensePlates !== hasErrors) {
          return {
            ...prev,
            disabledPersonLicensePlates: hasErrors
          };
        }
        return prev;
      });
    }
  }, [validationErrors, showValidationErrors]);


  useEffect(() => {
    if (showValidationErrors) {
      const errors = validateDisabledPersonLicensePlates();
      setValidationErrors(errors);
    }
  }, [
    currentLicensePlates.licensePlateNumber,
    currentLicensePlates.vehicleIdentificationNumber,
    currentLicensePlates.vehicleMake,
    currentLicensePlates.vehicleYear,
    currentLicensePlates.weightFeeExemption,
    showValidationErrors
  ]);

  const handleDisabledPersonLicensePlatesChange = (field: keyof DisabledPersonLicensePlatesType, value: string | boolean) => {
    const currentInfo = { ...currentLicensePlates };
    

    let formattedValue = value;
    
    if (field === 'licensePlateNumber' && typeof value === 'string') {

      formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
    } else if (field === 'vehicleIdentificationNumber' && typeof value === 'string') {

      formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 17);
    } else if (field === 'vehicleMake' && typeof value === 'string') {

      formattedValue = value.toUpperCase();
    } else if (field === 'vehicleYear' && typeof value === 'string') {

      formattedValue = value.replace(/[^0-9]/g, '').slice(0, 4);
    }

    const newInfo = { ...currentInfo, [field]: formattedValue };
    
    updateField('disabledPersonLicensePlates', newInfo);
    if (onChange) {
      onChange(newInfo);
    }
  };

  return (
    <div className="disabledPersonLicensePlatesWrapper">
      <div className="sectionHeader">
        <h3 className="sectionTitle">DISABLED PERSON LICENSE PLATES APPLICANTS <span className="onlyText">ONLY</span>: VEHICLE INFORMATION</h3>
        {showValidationErrors && validationErrors.length > 0 && (
          <div className="headerErrorMessage">Please complete all required fields below</div>
        )}
      </div>
    
      <div className="formFields">
        <div className="formRow">
          <div className="formField">
            <label className="fieldLabel">LICENSE PLATE</label>
            <input
              className={`fieldInput ${showValidationErrors && getErrorMessage('licensePlateNumber') ? 'error-input' : ''}`}
              type="text"
              placeholder="License Plate Number"
              value={currentLicensePlates.licensePlateNumber || ''}
              onChange={(e) => handleDisabledPersonLicensePlatesChange('licensePlateNumber', e.target.value)}
              disabled={readOnly}
              maxLength={7}
              style={{ textTransform: 'uppercase' }}
            />
            {showValidationErrors && getErrorMessage('licensePlateNumber') && (
              <div className="error-message">{getErrorMessage('licensePlateNumber')}</div>
            )}
          </div>

          <div className="formField vinField">
            <label className="fieldLabel">VEHICLE IDENTIFICATION NUMBER</label>
            <input
              className={`fieldInput ${showValidationErrors && getErrorMessage('vehicleIdentificationNumber') ? 'error-input' : ''}`}
              type="text"
              placeholder="Vehicle Identification Number"
              value={currentLicensePlates.vehicleIdentificationNumber || ''}
              onChange={(e) => handleDisabledPersonLicensePlatesChange('vehicleIdentificationNumber', e.target.value)}
              disabled={readOnly}
              maxLength={17}
              style={{ textTransform: 'uppercase' }}
            />
            {showValidationErrors && getErrorMessage('vehicleIdentificationNumber') && (
              <div className="error-message">{getErrorMessage('vehicleIdentificationNumber')}</div>
            )}
          </div>

          <div className="formField">
            <label className="fieldLabel">VEHICLE MAKE</label>
            <input
              className={`fieldInput ${showValidationErrors && getErrorMessage('vehicleMake') ? 'error-input' : ''}`}
              type="text"
              placeholder="Vehicle Make"
              value={currentLicensePlates.vehicleMake || ''}
              onChange={(e) => handleDisabledPersonLicensePlatesChange('vehicleMake', e.target.value)}
              disabled={readOnly}
              style={{ textTransform: 'uppercase' }}
            />
            {showValidationErrors && getErrorMessage('vehicleMake') && (
              <div className="error-message">{getErrorMessage('vehicleMake')}</div>
            )}
          </div>
          
          <div className="formField">
            <label className="fieldLabel">VEHICLE YEAR</label>
            <input
              className={`fieldInput ${showValidationErrors && getErrorMessage('vehicleYear') ? 'error-input' : ''}`}
              type="text"
              placeholder="Vehicle Year"
              value={currentLicensePlates.vehicleYear || ''}
              onChange={(e) => handleDisabledPersonLicensePlatesChange('vehicleYear', e.target.value)}
              maxLength={4}
              disabled={readOnly}
            />
            {showValidationErrors && getErrorMessage('vehicleYear') && (
              <div className="error-message">{getErrorMessage('vehicleYear')}</div>
            )}
          </div>
        </div>
      </div>

       {/* Weight Fee Exemption section */}
       <div className="exemptionContainer">
        <div className="exemptionText">
          <p>Commercial Vehicles – Weight Fee Exemption. I am requesting an exemption from weight fees for the vehicle described above. It weighs less than 8,001 pounds unladen. I understand that this exemption may be used for ONE commercial vehicle only and I do not have this exemption for any other vehicles I own.</p>
        </div>
        <div className={`checkboxOptions ${showValidationErrors && getErrorMessage('weightFeeExemption') ? 'error-checkbox-group' : ''}`}>
          <div className="checkboxOption">
            <input
              type="checkbox"
              id="weightFeeExemptionYes"
              checked={currentLicensePlates.weightFeeExemption === true}
              onChange={() => handleDisabledPersonLicensePlatesChange('weightFeeExemption', true)}
              disabled={readOnly}
              className={showValidationErrors && getErrorMessage('weightFeeExemption') ? 'error-checkbox' : ''}
            />
            <label htmlFor="weightFeeExemptionYes">Yes</label>
          </div>
          <div className="checkboxOption">
            <input
              type="checkbox"
              id="weightFeeExemptionNo"
              checked={currentLicensePlates.weightFeeExemption === false}
              onChange={() => handleDisabledPersonLicensePlatesChange('weightFeeExemption', false)}
              disabled={readOnly}
              className={showValidationErrors && getErrorMessage('weightFeeExemption') ? 'error-checkbox' : ''}
            />
            <label htmlFor="weightFeeExemptionNo">No</label>
          </div>
          {showValidationErrors && getErrorMessage('weightFeeExemption') && (
            <div className="error-message">{getErrorMessage('weightFeeExemption')}</div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default DisabledPersonLicensePlates;