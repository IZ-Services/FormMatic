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
  transferIndex?: number;
}


export const VEHICLE_INFORMATION_STORAGE_KEY = 'formmatic_vehicle_information';


export const getVehicleInformationStorageKey = (transferIndex?: number) => {
  if (transferIndex === undefined) {
    return VEHICLE_INFORMATION_STORAGE_KEY;
  }
  return `${VEHICLE_INFORMATION_STORAGE_KEY}_transfer_${transferIndex}`;
};


export const clearVehicleInformationStorage = (transferIndex?: number) => {
  if (typeof window !== 'undefined') {
    const storageKey = getVehicleInformationStorageKey(transferIndex);
    localStorage.removeItem(storageKey);
    console.log(`Vehicle Information data cleared from localStorage for transfer ${transferIndex !== undefined ? transferIndex : 'default'}`);
  }
};


export const clearAllVehicleInformationStorage = () => {
  if (typeof window !== 'undefined') {

    localStorage.removeItem(VEHICLE_INFORMATION_STORAGE_KEY);
    

    for (let i = 0; i < 5; i++) {
      localStorage.removeItem(`${VEHICLE_INFORMATION_STORAGE_KEY}_transfer_${i}`);
    }
    console.log('All Vehicle Information data cleared from localStorage');
  }
};


interface FormContextType {
  formData: Record<string, any>;
  updateField: (field: string, value: any) => void;
  validationErrors: Array<{ fieldPath: string; message: string }>;
  showValidationErrors: boolean;
  clearFormTriggered: number | null;
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
  isDuplicateRegistrationMode = false,
  transferIndex
}) => {
  const { 
    formData: contextFormData, 
    updateField,
    validationErrors,
    showValidationErrors,
    clearFormTriggered
  } = useFormContext() as FormContextType;
  
  const { activeScenarios } = useScenarioContext();
  const [isInitialized, setIsInitialized] = useState(false);
  const [vehicleInformationData, setVehicleInformationData] = useState<VehicleInformationType>(initialVehicleInformation);

  const formData = {
    ...contextFormData,
    ...propFormData
  };


  const storageKey = getVehicleInformationStorageKey(transferIndex);


  useEffect(() => {
    if (clearFormTriggered !== null && clearFormTriggered > 0) {
      console.log(`Clear form triggered in VehicleInformation component for transfer ${transferIndex !== undefined ? transferIndex : 'default'}`);
      clearVehicleInformationStorage(transferIndex);
      setVehicleInformationData(initialVehicleInformation);
      

      const fieldName = transferIndex !== undefined 
        ? `transfer${transferIndex}_vehicleInformation` 
        : 'vehicleInformation';
        
      updateField(fieldName, initialVehicleInformation);
    }
  }, [clearFormTriggered, transferIndex, updateField]);


  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const savedData = localStorage.getItem(storageKey);
        
        if (savedData) {
          console.log(`Loading vehicle information data from localStorage for transfer ${transferIndex !== undefined ? transferIndex : 'default'}`);
          const parsedData = JSON.parse(savedData);
          
          const mergedData = {
            ...initialVehicleInformation,
            ...parsedData
          };
          
          setVehicleInformationData(mergedData);
          

          const fieldName = transferIndex !== undefined 
            ? `transfer${transferIndex}_vehicleInformation` 
            : 'vehicleInformation';
            
          updateField(fieldName, mergedData);
          
          if (onChange) {
            onChange(mergedData);
          }
        } else if (formData.vehicleInformation) {
          setVehicleInformationData(formData.vehicleInformation);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error(`Error loading saved vehicle information data for transfer ${transferIndex !== undefined ? transferIndex : 'default'}:`, error);
        setIsInitialized(true);
      }
    }
  }, [formData, storageKey, transferIndex, onChange, updateField, isInitialized]);


  useEffect(() => {
    if (isInitialized && formData.vehicleInformation && JSON.stringify(formData.vehicleInformation) !== JSON.stringify(vehicleInformationData)) {
      setVehicleInformationData(formData.vehicleInformation);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(formData.vehicleInformation));
      }
    }
  }, [formData.vehicleInformation, isInitialized, storageKey, vehicleInformationData]);


  const shouldShowValidationError = (field: string) => {
    if (!showValidationErrors) return false;
    

    const fieldPath = transferIndex !== undefined
      ? `transfer${transferIndex}_vehicleInformation.${field}`
      : `vehicleInformation.${field}`;
    
    return validationErrors.some(error => error.fieldPath === fieldPath);
  };
  
  const getValidationErrorMessage = (field: string): string => {

    const fieldPath = transferIndex !== undefined
      ? `transfer${transferIndex}_vehicleInformation.${field}`
      : `vehicleInformation.${field}`;
    
    const error = validationErrors.find(e => e.fieldPath === fieldPath);
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
    if (!formData.vehicleInformation && isInitialized) {
      const newData = initialVehicleInformation;
      

      const fieldName = transferIndex !== undefined 
        ? `transfer${transferIndex}_vehicleInformation` 
        : 'vehicleInformation';
      
      updateField(fieldName, newData);
      if (onChange) {
        onChange(newData);
      }
    }
  }, [formData.vehicleInformation, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      const currentInfo = vehicleInformationData;
      
      if (!isOutOfStateTitle && currentInfo.isKilometers) {
        const newInfo = {
          ...currentInfo,
          isKilometers: false
        };
        
        setVehicleInformationData(newInfo);
        

        const fieldName = transferIndex !== undefined 
          ? `transfer${transferIndex}_vehicleInformation` 
          : 'vehicleInformation';
        
        updateField(fieldName, newInfo);
        
        if (onChange) {
          onChange(newInfo);
        }
        
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, JSON.stringify(newInfo));
        }
      }
    }
  }, [isOutOfStateTitle, isInitialized]);

  const handleVehicleInfoChange = (field: keyof VehicleInformationType, value: string | boolean) => {
    let newInfo: VehicleInformationType;
    
    if (field === 'notActualMileage' && value === true) {
      newInfo = { 
        ...vehicleInformationData, 
        [field]: value, 
        exceedsMechanicalLimit: false 
      };
    } else if (field === 'exceedsMechanicalLimit' && value === true) {
      newInfo = { 
        ...vehicleInformationData, 
        [field]: value, 
        notActualMileage: false 
      };
    } else {
      newInfo = { ...vehicleInformationData, [field]: value };
    }
    
    setVehicleInformationData(newInfo);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(newInfo));
    }
    

    const fieldName = transferIndex !== undefined 
      ? `transfer${transferIndex}_vehicleInformation` 
      : 'vehicleInformation';
    
    updateField(fieldName, newInfo);
    
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
              value={(vehicleInformationData?.engineNumber || '').toUpperCase()}
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
            value={(vehicleInformationData?.hullId || '').toUpperCase()}
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
            value={(vehicleInformationData?.licensePlate || '').toUpperCase()}
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
            value={vehicleInformationData?.year || ''}
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
            value={vehicleInformationData?.make || ''}
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
              value={vehicleInformationData?.length || ''}
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
              value={vehicleInformationData?.width || ''}
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
                value={vehicleInformationData?.mileage || ''}
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
                checked={vehicleInformationData?.notActualMileage || false}
                onChange={(e) => handleVehicleInfoChange('notActualMileage', e.target.checked)}
                className="checkboxInput"
                disabled={vehicleInformationData?.exceedsMechanicalLimit || false}
              />
              NOT Actual Mileage
            </label>
            
            <label className="checkboxLabel">
              <input
                type="checkbox"
                checked={vehicleInformationData?.exceedsMechanicalLimit || false}
                onChange={(e) => handleVehicleInfoChange('exceedsMechanicalLimit', e.target.checked)}
                className="checkboxInput"
                disabled={vehicleInformationData?.notActualMileage || false}
              />
              Mileage Exceeds Mechanical Limit
            </label>
            
            {/* Only show kilometers checkbox if out of state title is checked */}
            {isOutOfStateTitle && (
              <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                <label className="checkboxLabel">
                  <input
                    type="checkbox"
                    checked={vehicleInformationData?.isKilometers || false}
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