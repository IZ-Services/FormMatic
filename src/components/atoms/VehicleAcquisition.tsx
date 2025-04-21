import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './VehicleAcquisition.css';

interface VehicleAcquisitionData {
  acquiredFrom?: 'dealer' | 'privateParty' | 'dismantler' | 'familyMember';
  familyRelationship?: string;
  hasModifications?: boolean;
}

interface ValidationError {
  fieldPath: string;
  message: string;
}

interface FormDataType {
  vehicleAcquisition?: VehicleAcquisitionData;
  _showValidationErrors?: boolean;
  [key: string]: any;
}

interface VehicleAcquisitionProps {
  formData?: FormDataType;
  onChange?: (data: VehicleAcquisitionData) => void;
  showValidationErrors?: boolean;
}

const VehicleAcquisition: React.FC<VehicleAcquisitionProps> = ({
  formData: propFormData,
  onChange,
  showValidationErrors = false
}) => {
  const { formData: contextFormData, updateField } = useFormContext();

  const combinedFormData: FormDataType = {
    ...contextFormData,
    ...propFormData
  };

  const [acquisitionData, setAcquisitionData] = useState<VehicleAcquisitionData>({
    acquiredFrom: undefined,
    familyRelationship: '',
    hasModifications: false
  });
  
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  

  const shouldShowValidationErrors = showValidationErrors || combinedFormData?._showValidationErrors === true;

  useEffect(() => {
    const mergedData: VehicleAcquisitionData = {
      acquiredFrom: undefined,
      familyRelationship: '',
      hasModifications: false,
      ...combinedFormData?.vehicleAcquisition
    };
    setAcquisitionData(mergedData);
  }, [combinedFormData?.vehicleAcquisition]);


  const validateVehicleAcquisition = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    

    if (!acquisitionData.acquiredFrom) {
      errors.push({
        fieldPath: 'vehicleAcquisition.acquiredFrom',
        message: 'Please select where the vehicle was acquired from'
      });
    }
    

    if (acquisitionData.acquiredFrom === 'familyMember' && 
        (!acquisitionData.familyRelationship || acquisitionData.familyRelationship.trim() === '')) {
      errors.push({
        fieldPath: 'vehicleAcquisition.familyRelationship',
        message: 'Please specify the family relationship'
      });
    }
    

    if (acquisitionData.hasModifications === undefined) {
      errors.push({
        fieldPath: 'vehicleAcquisition.hasModifications',
        message: 'Please indicate whether the vehicle has modifications'
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
    return validationErrors.some(err => err.fieldPath === `vehicleAcquisition.${field}`);
  };
  

  useEffect(() => {
    if (shouldShowValidationErrors) {
      const errors = validateVehicleAcquisition();
      setValidationErrors(errors);
      

      const currentValidationErrors = typeof contextFormData._validationErrors === 'object' && 
        contextFormData._validationErrors !== null
        ? contextFormData._validationErrors
        : {};
        
      updateField('_validationErrors', {
        ...currentValidationErrors,
        vehicleAcquisition: errors.length > 0
      });
    }
  }, [shouldShowValidationErrors, acquisitionData]);

  const handleRadioChange = (value: 'dealer' | 'privateParty' | 'dismantler' | 'familyMember') => {
    const newData = {
      ...acquisitionData,
      acquiredFrom: value
    };
    
    if (value !== 'familyMember') {
      newData.familyRelationship = '';
    }

    setAcquisitionData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField('vehicleAcquisition', newData);
    }
  };

  const handleRelationshipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = {
      ...acquisitionData,
      familyRelationship: e.target.value
    };

    setAcquisitionData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField('vehicleAcquisition', newData);
    }
  };
  
  const handleModificationChange = (value: boolean) => {
    const newData = {
      ...acquisitionData,
      hasModifications: value
    };
    
    setAcquisitionData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField('vehicleAcquisition', newData);
    }
  };

  return (
    <div className="vehicleAcquisitionWrapper">
      <div className="headerRow">
        <h3 className="sectionHeading">VEHICLE WAS PURCHASED OR ACQUIRED FROM:</h3>
      </div>

      <div className={`acquisitionSection ${shouldShowValidationError('acquiredFrom') ? 'validation-error-container' : ''}`}>
        <div className="radioOptions">
          <label className="radio-label">
            <input
              type="radio"
              name="acquiredFrom"
              checked={acquisitionData.acquiredFrom === 'dealer'}
              onChange={() => handleRadioChange('dealer')}
            />
            Dealer
          </label>
          
          <label className="radio-label">
            <input
              type="radio"
              name="acquiredFrom"
              checked={acquisitionData.acquiredFrom === 'privateParty'}
              onChange={() => handleRadioChange('privateParty')}
            />
            Private Party
          </label>
          
          <label className="radio-label">
            <input
              type="radio"
              name="acquiredFrom"
              checked={acquisitionData.acquiredFrom === 'dismantler'}
              onChange={() => handleRadioChange('dismantler')}
            />
            Dismantler
          </label>
          
          <label className="radio-label acquisition-family">
            <input
              type="radio"
              name="acquiredFrom"
              checked={acquisitionData.acquiredFrom === 'familyMember'}
              onChange={() => handleRadioChange('familyMember')}
            />
            Immediate Family Member – State Relationship:
            {acquisitionData.acquiredFrom === 'familyMember' && (
              <input
                type="text"
                className={`relationship-input ${shouldShowValidationError('familyRelationship') ? 'validation-error' : ''}`}
                value={acquisitionData.familyRelationship || ''}
                onChange={handleRelationshipChange}
                placeholder="Enter relationship"
              />
            )}
          </label>
        </div>
        
        {shouldShowValidationError('acquiredFrom') && (
          <p className="validation-message">
            {getErrorMessage('vehicleAcquisition.acquiredFrom')}
          </p>
        )}
        
        {shouldShowValidationError('familyRelationship') && (
          <p className="validation-message">
            {getErrorMessage('vehicleAcquisition.familyRelationship')}
          </p>
        )}
      </div>
      
      <div className={`modificationSection ${shouldShowValidationError('hasModifications') ? 'validation-error-container' : ''}`}>
        <div className="modificationQuestion">
          <p>FOR ALL VEHICLES:</p>
          <p className="modificationText">
            Since purchasing or acquiring this vehicle, were any body type modifications, additions and/or alterations (e.g., changing from pickup to utility, etc.) made to this vehicle?
            <span className="modificationNote"> If yes, a Statement of Construction (REG 5036) form must be completed.</span>
          </p>
          
          <div className="modificationOptions">
            <label className="radio-label">
              <input
                type="radio"
                name="hasModifications"
                checked={acquisitionData.hasModifications === true}
                onChange={() => handleModificationChange(true)}
              />
              Yes
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="hasModifications"
                checked={acquisitionData.hasModifications === false}
                onChange={() => handleModificationChange(false)}
              />
              No
            </label>
          </div>
          
          {shouldShowValidationError('hasModifications') && (
            <p className="validation-message">
              {getErrorMessage('vehicleAcquisition.hasModifications')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleAcquisition;