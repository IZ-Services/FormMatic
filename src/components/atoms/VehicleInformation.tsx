'use client';
import React, { useEffect, useState } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { useScenarioContext } from '../../context/ScenarioContext';
import './VehicleInformation.css';

interface VehicleInformationType {
  licensePlate?: string;
  hullId?: string;
  engineNumber?: string;  
  year?: string;
  make?: string;
  odometerDiscrepancyExplanation?: string;
  mileage?: string;
  notActualMileage?: boolean;
  exceedsMechanicalLimit?: boolean;
  vehicleUnder10001lbs?: boolean;
  isMotorcycle?: boolean;
  gvwCode?: string;
  cgwCode?: string;
  operationDate?: string;
  length?: string;  
  width?: string;
  isKilometers?: boolean;
}

interface VehicleInformationProps {
  formData?: {
    vehicleInformation?: VehicleInformationType;
    vehicleTransactionDetails?: {
      isMotorcycle?: boolean;
      isOutOfStateTitle?: boolean;
    };
    vehicleType?: {
      isMotorcycle?: boolean;
      isTrailerCoach?: boolean;
    };
    hideMileageFields?: boolean;
  };
  onChange?: (data: VehicleInformationType) => void;
  isDuplicateRegistrationMode?: boolean;
}

// Form context type with validation properties
interface FormContextType {
  formData: Record<string, any>;
  updateField: (field: string, value: any) => void;
  validationErrors: Array<{ fieldPath: string; message: string }>;
  showValidationErrors: boolean;
}

const initialVehicleInformation: VehicleInformationType = {
  licensePlate: '',
  hullId: '',
  engineNumber: '',
  year: '',
  make: '',
  odometerDiscrepancyExplanation: '',
  mileage: '',
  notActualMileage: false,
  exceedsMechanicalLimit: false,
  vehicleUnder10001lbs: false,
  isMotorcycle: false,
  gvwCode: '',
  cgwCode: '',
  operationDate: '',
  length: '',
  width: '',
  isKilometers: false
};

const VehicleInformation: React.FC<VehicleInformationProps> = ({ 
  formData: propFormData, 
  onChange,
  isDuplicateRegistrationMode = false
}) => {
  const { 
    formData: contextFormData, 
    updateField,
    validationErrors,
    showValidationErrors 
  } = useFormContext() as FormContextType;
  
  const { activeScenarios } = useScenarioContext();

  const formData = {
    ...contextFormData,
    ...propFormData
  };

  // Helper functions for validation
  const shouldShowValidationError = (field: string) => {
    if (!showValidationErrors) return false;
    
    return validationErrors.some(error => 
      error.fieldPath === `vehicleInformation.${field}`
    );
  };
  
  const getValidationErrorMessage = (field: string): string => {
    const error = validationErrors.find(e => e.fieldPath === `vehicleInformation.${field}`);
    return error ? error.message : '';
  };

  const shouldHideMileageFields = () => {
    if (formData.hideMileageFields) {
      return true;
    }
    
    return !!(
      activeScenarios && (
        activeScenarios["Add Lienholder"] ||
        activeScenarios["Remove Lienholder"] ||
        activeScenarios["Name Change"] ||
        activeScenarios["Salvage"]
      )
    );
  };

  const hideMileageFields = isDuplicateRegistrationMode || shouldHideMileageFields();
  const isMotorcycle = 
    formData.vehicleType?.isMotorcycle === true || 
    formData.vehicleTransactionDetails?.isMotorcycle === true;
  const isTrailerCoach = formData.vehicleType?.isTrailerCoach === true;
  
  const isOutOfStateTitle = formData.vehicleTransactionDetails?.isOutOfStateTitle === true;

  useEffect(() => {
    if (!formData.vehicleInformation) {
      const newData = initialVehicleInformation;
      updateField('vehicleInformation', newData);
      if (onChange) {
        onChange(newData);
      }
    }
  }, []);

  useEffect(() => {
    const currentInfo = (formData.vehicleInformation || {}) as VehicleInformationType;
    
    if (!isOutOfStateTitle && currentInfo.isKilometers) {
      const newInfo = {
        ...currentInfo,
        isKilometers: false
      };
      updateField('vehicleInformation', newInfo);
      if (onChange) {
        onChange(newInfo);
      }
    }
  }, [isOutOfStateTitle]);

  const handleVehicleInfoChange = (field: keyof VehicleInformationType, value: string | boolean) => {
    const currentInfo = (formData.vehicleInformation || {}) as VehicleInformationType;
    let newInfo: VehicleInformationType;
    
    if (field === 'notActualMileage' && value === true) {
      newInfo = { 
        ...currentInfo, 
        [field]: value, 
        exceedsMechanicalLimit: false 
      };
    } else if (field === 'exceedsMechanicalLimit' && value === true) {
      newInfo = { 
        ...currentInfo, 
        [field]: value, 
        notActualMileage: false 
      };
    } else {
      newInfo = { ...currentInfo, [field]: value };
    }
    
    updateField('vehicleInformation', newInfo);
    if (onChange) {
      onChange(newInfo);
    }
  };

  return (
    <div className="vehicleInformationWrapper">
      <div className="vehicleHeaderContainer">
        <h3 className="vehicleInformationHeading">Vehicle Information</h3>
      </div>
      <div className="vehicleFirstGroup">
        {isMotorcycle && (
          <div className="vehicleFormItem">
            <label>Motorcycle Engine Number</label>
            <input
              className={`yearInput ${shouldShowValidationError('engineNumber') ? 'validation-error' : ''}`}
              type="text"
              placeholder="Motorcycle Engine Number"
              value={((formData.vehicleInformation as VehicleInformationType)?.engineNumber || '').toUpperCase()}
              onChange={(e) => handleVehicleInfoChange('engineNumber', e.target.value.toUpperCase())}
            />
            {shouldShowValidationError('engineNumber') && (
              <p className="validation-message">{getValidationErrorMessage('engineNumber')}</p>
            )}
          </div>
        )}
        <div className="vehicleFormItem">
          <label>Vehicle/Hull Identification Number</label>
          <input
            className={`makeInput ${shouldShowValidationError('hullId') ? 'validation-error' : ''}`}
            type="text"
            placeholder="Vehicle/ Hull Identification Number"
            value={((formData.vehicleInformation as VehicleInformationType)?.hullId || '').toUpperCase()}
            onChange={(e) => handleVehicleInfoChange('hullId', e.target.value.toUpperCase())}
          />
          {shouldShowValidationError('hullId') && (
            <p className="validation-message">{getValidationErrorMessage('hullId')}</p>
          )}
        </div>
        <div className="vehicleFormItem">
          <label>Vehicle License Plate or Vessel CF Number</label>
          <input
            className={`odometerInput ${shouldShowValidationError('licensePlate') ? 'validation-error' : ''}`}
            type="text"
            placeholder="Vehicle License Plate or Vessel CF Number"
            value={((formData.vehicleInformation as VehicleInformationType)?.licensePlate || '').toUpperCase()}
            onChange={(e) => handleVehicleInfoChange('licensePlate', e.target.value.toUpperCase())}
          />
          {shouldShowValidationError('licensePlate') && (
            <p className="validation-message">{getValidationErrorMessage('licensePlate')}</p>
          )}
        </div>
      </div>
      
      <div className="vehicleFirstGroup">
        <div className="vehicleFormItem">
          <label>Year of Vehicle</label>
          <input
            className={`yearInput ${shouldShowValidationError('year') ? 'validation-error' : ''}`}
            type="text"
            placeholder="Year of Vehicle"
            value={(formData.vehicleInformation as VehicleInformationType)?.year || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/[^\d]/g, '').slice(0, 4);
              handleVehicleInfoChange('year', value);
            }}
            maxLength={4} 
          />
          {shouldShowValidationError('year') && (
            <p className="validation-message">{getValidationErrorMessage('year')}</p>
          )}
        </div>
        <div className="vehicleFormItem">
          <label>Make of Vehicle OR Vessel Builder</label>
          <input
            className={`makeInput ${shouldShowValidationError('make') ? 'validation-error' : ''}`}
            type="text"
            placeholder="Make of Vehicle OR Vessel Builder"
            value={(formData.vehicleInformation as VehicleInformationType)?.make || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length > 0) {
                const capitalizedValue = value
                  .split(' ')
                  .map(word => {
                    if (word.length > 0 && /^[a-zA-Z]/.test(word)) {
                      return word.charAt(0).toUpperCase() + word.slice(1);
                    }
                    return word;
                  })
                  .join(' ');
                
                handleVehicleInfoChange('make', capitalizedValue);
              } else {
                handleVehicleInfoChange('make', value);
              }
            }}
          />
          {shouldShowValidationError('make') && (
            <p className="validation-message">{getValidationErrorMessage('make')}</p>
          )}
        </div>
      </div>

      {isTrailerCoach && (
        <div className="vehicleFirstGroup">
          <div className="vehicleFormItem">
            <label>Length (IN)</label>
            <input
              className={`yearInput ${shouldShowValidationError('length') ? 'validation-error' : ''}`}
              type="text"
              placeholder="Length in inches"
              value={(formData.vehicleInformation as VehicleInformationType)?.length || ''}
              onChange={(e) => {
                const value = e.target.value;
                const numericValue = value.replace(/[^0-9]/g, '');
                handleVehicleInfoChange('length', numericValue);
              }}
            />
            {shouldShowValidationError('length') && (
              <p className="validation-message">{getValidationErrorMessage('length')}</p>
            )}
          </div>
          <div className="vehicleFormItem">
            <label>Width (IN)</label>
            <input
              className={`makeInput ${shouldShowValidationError('width') ? 'validation-error' : ''}`}
              type="text"
              placeholder="Width in inches"
              value={(formData.vehicleInformation as VehicleInformationType)?.width || ''}
              onChange={(e) => {
                const value = e.target.value;
                const numericValue = value.replace(/[^0-9]/g, '');
                handleVehicleInfoChange('width', numericValue);
              }}
            />
            {shouldShowValidationError('width') && (
              <p className="validation-message">{getValidationErrorMessage('width')}</p>
            )}
          </div>
        </div>
      )}

      {/* Only show mileage fields if not hidden by conditions */}
      {!hideMileageFields && (
        <div className="mileageRow">
          <div className="mileageField" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flexGrow: 1 }}>
              <label>Mileage of Vehicle</label>
              <input
                className={`yearInput ${shouldShowValidationError('mileage') ? 'validation-error' : ''}`}
                type="text"
                placeholder="Vehicle Mileage"
                value={(formData.vehicleInformation as VehicleInformationType)?.mileage || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const numericValue = value.replace(/[^0-9]/g, '');
                  const limitedValue = numericValue.slice(0, 6);
                  
                  handleVehicleInfoChange('mileage', limitedValue);
                }}
                maxLength={6}
              />
              {shouldShowValidationError('mileage') && (
                <p className="validation-message">{getValidationErrorMessage('mileage')}</p>
              )}
            </div>
          </div>
          
          <div className="mileageCheckboxes">
            <label className="checkboxLabel">
              <input
                type="checkbox"
                checked={(formData.vehicleInformation as VehicleInformationType)?.notActualMileage || false}
                onChange={(e) => handleVehicleInfoChange('notActualMileage', e.target.checked)}
                className="checkboxInput"
                disabled={(formData.vehicleInformation as VehicleInformationType)?.exceedsMechanicalLimit || false}
              />
              NOT Actual Mileage
            </label>
            
            <label className="checkboxLabel">
              <input
                type="checkbox"
                checked={(formData.vehicleInformation as VehicleInformationType)?.exceedsMechanicalLimit || false}
                onChange={(e) => handleVehicleInfoChange('exceedsMechanicalLimit', e.target.checked)}
                className="checkboxInput"
                disabled={(formData.vehicleInformation as VehicleInformationType)?.notActualMileage || false}
              />
              Mileage Exceeds Mechanical Limit
            </label>
            
            {/* Only show kilometers checkbox if out of state title is checked */}
            {isOutOfStateTitle && (
              <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                <label className="checkboxLabel">
                  <input
                    type="checkbox"
                    checked={(formData.vehicleInformation as VehicleInformationType)?.isKilometers || false}
                    onChange={(e) => handleVehicleInfoChange('isKilometers', e.target.checked)}
                    className="checkboxInput"
                    style={{ marginRight: '5px' }}
                  />
                  If kilometers check this box
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .validation-error {
          border-color: #dc3545;
          background-color: #fff8f8;
        }

        .validation-message {
          color: #dc3545;
          font-size: 12px;
          margin-top: 4px;
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
};

export default VehicleInformation;