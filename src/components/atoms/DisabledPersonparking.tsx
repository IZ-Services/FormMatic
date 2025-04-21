import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './DisabledPersonParking.css';

interface DisabledPersonParkingData {
  parkingPlacardType?: string;
  previousIssuance?: string;
  licensePlateNumber?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface DisabledPersonParkingProps {
  formData?: {
    disabledPersonParkingInfo?: DisabledPersonParkingData;
  };
  showValidationErrors?: boolean;
}

const initialDisabledPersonParkingData: DisabledPersonParkingData = {
  parkingPlacardType: '',
  previousIssuance: '',
  licensePlateNumber: ''
};

const DisabledPersonParkingForm: React.FC<DisabledPersonParkingProps> = ({ 
  formData: propFormData,
  showValidationErrors = false
}) => {
  const { formData: contextFormData, updateField } = useFormContext();
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  

  const getFormDataSafely = () => {
    const combined = {
      ...contextFormData,
      ...propFormData
    };
    
    if (!combined.disabledPersonParkingInfo) {
      return {
        ...combined,
        disabledPersonParkingInfo: initialDisabledPersonParkingData
      };
    }
    
    return combined;
  };

  const safeFormData = getFormDataSafely();
  
  const [formState, setFormState] = useState<DisabledPersonParkingData>(
    safeFormData.disabledPersonParkingInfo || initialDisabledPersonParkingData
  );

  const parkingPlacardTypes = [
    'Permanent DP Parking Placard (No Fee)',
    'Temporary DP Parking Placard ($6.00 Fee)',
    'Travel Parking DP Parking Placard (No Fee)',
    'Disabled Person License Plates (No Fee), see Section 3',
    'Disabled Person License Plates Reassignment, see Section 3'
  ];


  const validateDisabledPersonParking = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    const info = safeFormData.disabledPersonParkingInfo || initialDisabledPersonParkingData;
    

    if (!info.parkingPlacardType) {
      errors.push({
        field: 'parkingPlacardType',
        message: 'Please select a parking placard type'
      });
    }
    

    if (!info.previousIssuance) {
      errors.push({
        field: 'previousIssuance',
        message: 'Please indicate if you had a previous issuance'
      });
    }
    

    if (info.previousIssuance === 'yes') {
      if (!info.licensePlateNumber) {
        errors.push({
          field: 'licensePlateNumber',
          message: 'License plate or DP parking placard number is required'
        });
      } else if (!/^[A-Z0-9]{1,8}$/.test(info.licensePlateNumber)) {
        errors.push({
          field: 'licensePlateNumber',
          message: 'Please enter a valid license plate or placard number'
        });
      }
    }
    
    return errors;
  };


  const getErrorMessage = (field: string): string | null => {
    const error = validationErrors.find(err => err.field === field);
    return error ? error.message : null;
  };


  useEffect(() => {
    if (!contextFormData?.disabledPersonParkingInfo) {
      updateField('disabledPersonParkingInfo', initialDisabledPersonParkingData);
    }
  }, [contextFormData?.disabledPersonParkingInfo, updateField]);


  useEffect(() => {
    const currentData = safeFormData?.disabledPersonParkingInfo;
    if (currentData) {
      setFormState(currentData as DisabledPersonParkingData);
    }
  }, [safeFormData?.disabledPersonParkingInfo]);


  useEffect(() => {
    if (showValidationErrors) {
      const errors = validateDisabledPersonParking();
      setValidationErrors(errors);
      

      const hasErrors = errors.length > 0;
      updateField('_validationErrors', (prev: any) => {

        if (prev?.disabledPersonParkingInfo !== hasErrors) {
          return {
            ...prev,
            disabledPersonParkingInfo: hasErrors
          };
        }
        return prev;
      });
    }
  }, [
    showValidationErrors,
    safeFormData.disabledPersonParkingInfo?.parkingPlacardType,
    safeFormData.disabledPersonParkingInfo?.previousIssuance,
    safeFormData.disabledPersonParkingInfo?.licensePlateNumber
  ]);

  const handleParkingPlacardTypeChange = (value: string) => {
    const newData = { 
      ...formState, 
      parkingPlacardType: value 
    };
    setFormState(newData);
    updateField('disabledPersonParkingInfo', newData);
    

    if (showValidationErrors) {
      setTimeout(() => {
        const errors = validateDisabledPersonParking();
        setValidationErrors(errors);
      }, 0);
    }
  };

  const handlePreviousIssuanceChange = (value: string) => {
    const newData = { 
      ...formState, 
      previousIssuance: value,
      licensePlateNumber: value === 'no' ? '' : formState.licensePlateNumber
    };
    setFormState(newData);
    updateField('disabledPersonParkingInfo', newData);
    

    if (showValidationErrors) {
      setTimeout(() => {
        const errors = validateDisabledPersonParking();
        setValidationErrors(errors);
      }, 0);
    }
  };

  const handleLicensePlateNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const formattedValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    
    const newData = { 
      ...formState, 
      licensePlateNumber: formattedValue 
    };
    setFormState(newData);
    updateField('disabledPersonParkingInfo', newData);
    

    if (showValidationErrors) {
      setTimeout(() => {
        const errors = validateDisabledPersonParking();
        setValidationErrors(errors);
      }, 0);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-2xl">
      <div className="pnoHeader">
        <h3 className="pnoTitle">Type of Disabled Person Parking Placard(S) or License Plates</h3>
        {showValidationErrors && validationErrors.length > 0 && (
          <div className="headerErrorMessage">Please complete all required fields below</div>
        )}
      </div>
      <div className="topGroup">
        <label className="subHeadings">Select Parking Placard Type</label>
        <div className="space-y-2">
          {parkingPlacardTypes.map((type) => (
            <div key={type} className="checkboxSection">
              <input
                type="radio"
                id={`placard-type-${type.replace(/\s+/g, '-').toLowerCase()}`}
                name="parkingPlacardType"
                className={`checkBoxAddress ${showValidationErrors && getErrorMessage('parkingPlacardType') ? 'error-checkbox' : ''}`}
                checked={formState.parkingPlacardType === type}
                onChange={() => handleParkingPlacardTypeChange(type)}
              />
              <p>{type}</p>
            </div>
          ))}
          {showValidationErrors && getErrorMessage('parkingPlacardType') && (
            <div className="error-message">{getErrorMessage('parkingPlacardType')}</div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <p className="subHeadings">
          Have you ever been issued DP License Plates, Disabled Veteran License Plates, 
          or a Permanent DP parking placard in California?
        </p>
        <div className="space-y-2">
          <div className="checkboxSection">
            <input
              type="radio"
              id="previous-issuance-yes"
              name="previousIssuance"
              className={`checkBoxAddress ${showValidationErrors && getErrorMessage('previousIssuance') ? 'error-checkbox' : ''}`}
              checked={formState.previousIssuance === 'yes'}
              onChange={() => handlePreviousIssuanceChange('yes')}
            />
            <p>Yes</p>
          </div>
          <div className="checkboxSection">
            <input
              type="radio"
              id="previous-issuance-no"
              name="previousIssuance"
              className={`checkBoxAddress ${showValidationErrors && getErrorMessage('previousIssuance') ? 'error-checkbox' : ''}`}
              checked={formState.previousIssuance === 'no'}
              onChange={() => handlePreviousIssuanceChange('no')}
            />
            <p>No</p>
          </div>
          {showValidationErrors && getErrorMessage('previousIssuance') && (
            <div className="error-message">{getErrorMessage('previousIssuance')}</div>
          )}
        </div>
      </div>

      {formState.previousIssuance === 'yes' && (
        <div className="space-y-2">
          <label className="subHeadings">
            License Plate or DP Parking Placard Number
          </label>
          <input
            className={`registeredDateInput ${showValidationErrors && getErrorMessage('licensePlateNumber') ? 'error-input' : ''}`}
            type="text"
            placeholder="Enter license plate or DP parking placard number"
            value={formState.licensePlateNumber || ''}
            onChange={handleLicensePlateNumberChange}
            style={{ textTransform: 'uppercase' }}
            maxLength={8}
          />
          {showValidationErrors && getErrorMessage('licensePlateNumber') && (
            <div className="error-message">{getErrorMessage('licensePlateNumber')}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DisabledPersonParkingForm;