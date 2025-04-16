'use client';
import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './SelectConfiguration.css';

interface SelectConfigurationType {
  vehicleType?: 'Automobile' | 'Commercial' | 'Trailer' | 'Motorcycle';
  plateType?: 'Sequential' | 'Personalized';
  currentLicensePlate?: string;
  fullVehicleId?: string;
  personalized?: {
    firstChoice?: string;
    firstChoiceMeaning?: string;
    secondChoice?: string;
    secondChoiceMeaning?: string;
    thirdChoice?: string;
    thirdChoiceMeaning?: string;
    plateNotCentered?: boolean;
    kidsPlateSymbol?: 'Heart' | 'Star' | 'Hand' | 'Plus';
  };
  pickupLocation?: 'DMV Office' | 'Auto Club';
  locationCity?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface SelectConfigurationProps {
  formData?: {
    selectConfiguration?: SelectConfigurationType;
  };
  onChange?: (data: any) => void;
  showValidationErrors?: boolean;
}

const initialSelectConfiguration: SelectConfigurationType = {
  vehicleType: undefined,
  plateType: undefined,
  currentLicensePlate: '',
  fullVehicleId: '',
  personalized: {
    firstChoice: '',
    firstChoiceMeaning: '',
    secondChoice: '',
    secondChoiceMeaning: '',
    thirdChoice: '',
    thirdChoiceMeaning: '',
    plateNotCentered: false,
    kidsPlateSymbol: undefined
  },
  pickupLocation: undefined,
  locationCity: ''
};

const SelectConfiguration: React.FC<SelectConfigurationProps> = ({ 
  formData: propFormData, 
  onChange,
  showValidationErrors = false 
}) => {
  const { formData: contextFormData, updateField } = useFormContext();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const formData = {
    ...contextFormData,
    ...propFormData
  };

  // Validation function
  const validateSelectConfiguration = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    const config = formData.selectConfiguration as SelectConfigurationType;
    
    // Validate vehicle type
    if (!config?.vehicleType) {
      errors.push({
        field: 'vehicleType',
        message: 'Vehicle type is required'
      });
    }
    
    // Validate plate type
    if (!config?.plateType) {
      errors.push({
        field: 'plateType',
        message: 'Plate type is required'
      });
    }
    
    // Validate sequential plate fields
    if (config?.plateType === 'Sequential') {
      if (!config.currentLicensePlate) {
        errors.push({
          field: 'currentLicensePlate',
          message: 'Current license plate number is required'
        });
      } else if (config.currentLicensePlate.length < 5) {
        errors.push({
          field: 'currentLicensePlate',
          message: 'License plate must be at least 5 characters'
        });
      }
      
      if (!config.fullVehicleId) {
        errors.push({
          field: 'fullVehicleId',
          message: 'Vehicle ID number is required'
        });
      } else if (config.fullVehicleId.length < 17) {
        errors.push({
          field: 'fullVehicleId',
          message: 'VIN must be 17 characters'
        });
      }
    }
    
    // Validate personalized plate fields
    if (config?.plateType === 'Personalized') {
      // At least first choice is required
      if (!config.personalized?.firstChoice) {
        errors.push({
          field: 'firstChoice',
          message: 'First choice is required'
        });
      }
      
      if (!config.personalized?.firstChoiceMeaning) {
        errors.push({
          field: 'firstChoiceMeaning',
          message: 'Meaning for first choice is required'
        });
      }
      
      // If second choice is provided, meaning is required
      if (config.personalized?.secondChoice && !config.personalized?.secondChoiceMeaning) {
        errors.push({
          field: 'secondChoiceMeaning',
          message: 'Meaning is required when second choice is provided'
        });
      }
      
      // If third choice is provided, meaning is required
      if (config.personalized?.thirdChoice && !config.personalized?.thirdChoiceMeaning) {
        errors.push({
          field: 'thirdChoiceMeaning',
          message: 'Meaning is required when third choice is provided'
        });
      }
    }
    
    // Validate pickup location
    if (config?.plateType && !config.pickupLocation) {
      errors.push({
        field: 'pickupLocation',
        message: 'Pickup location is required'
      });
    }
    
    // Validate location city
    if (config?.pickupLocation && !config.locationCity) {
      errors.push({
        field: 'locationCity',
        message: 'Location city is required'
      });
    }
    
    return errors;
  };

  // Helper to get error message for a field
  const getErrorMessage = (field: string): string | null => {
    const error = validationErrors.find(err => err.field === field);
    return error ? error.message : null;
  };

  useEffect(() => {
    if (!formData.selectConfiguration) {
      updateField('selectConfiguration', initialSelectConfiguration);
    }
  }, []);

  // Run validation when showing validation errors or when data changes
  useEffect(() => {
    if (showValidationErrors) {
      const errors = validateSelectConfiguration();
      setValidationErrors(errors);
    }
  }, [showValidationErrors, formData.selectConfiguration]);

  // Update parent component about validation status
  useEffect(() => {
    if (showValidationErrors) {
      updateField('_validationErrors', (prev: any) => ({
        ...prev,
        selectConfiguration: validationErrors.length > 0
      }));
    }
  }, [validationErrors, showValidationErrors]);

  const handleChange = (field: keyof SelectConfigurationType, value: any) => {
    const currentInfo = (formData.selectConfiguration || {}) as SelectConfigurationType;
    const newData = { ...currentInfo, [field]: value };     
    if (field === 'plateType' && value === 'Sequential') {
      newData.personalized = initialSelectConfiguration.personalized;
    }     
    if (field === 'plateType' && value === 'Personalized') {
      newData.currentLicensePlate = '';
      newData.fullVehicleId = '';
    }

    if (onChange) {
      onChange({ selectConfiguration: newData });
    } else {
      updateField('selectConfiguration', newData);
    }
    
    // Run validation if showing validation errors
    if (showValidationErrors) {
      setTimeout(() => {
        const errors = validateSelectConfiguration();
        setValidationErrors(errors);
      }, 0);
    }
  };

  const handlePersonalizedChange = (field: string, value: any) => {
    const currentInfo = (formData.selectConfiguration || {}) as SelectConfigurationType;
    const personalized = { ...(currentInfo.personalized || {}) };     
    if (field.includes('Meaning') && typeof value === 'string') {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    
    // @ts-ignore - Using string as key
    personalized[field] = value;
    
    const newData = { 
      ...currentInfo,
      personalized
    };
    
    if (onChange) {
      onChange({ selectConfiguration: newData });
    } else {
      updateField('selectConfiguration', newData);
    }
    
    // Run validation if showing validation errors
    if (showValidationErrors) {
      setTimeout(() => {
        const errors = validateSelectConfiguration();
        setValidationErrors(errors);
      }, 0);
    }
  };

  const vehicleTypes = ['Automobile', 'Commercial', 'Trailer', 'Motorcycle'];
  const kidsSymbols = ['Heart', 'Star', 'Hand', 'Plus'];
  const pickupLocations = ['DMV Office', 'Auto Club'];

  const handleCityChange = (value: string) => {
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    handleChange('locationCity', capitalizedValue);
  };

  const handlePlateTypeChange = (type: 'Sequential' | 'Personalized') => {
    const currentPlateType = (formData.selectConfiguration as SelectConfigurationType)?.plateType;
    
    if (currentPlateType === type) {
      handleChange('plateType', undefined);
    } else {
      handleChange('plateType', type);
    }
  };

  // Style constants for plate inputs
  const plateInputStyle = {
    width: '220px', // Fixed width instead of 100%
    padding: '8px',
    textAlign: 'center' as const,
    fontWeight: 'bold' as const,
    fontSize: '16px',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    display: 'block', // Ensure it's a block element for margin auto to work
    border: '2px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box' as const,
  };

  return (
    <div className="configWrapper" style={{ margin: '15px 0' }}>
      <div className="configHeader">
        <h3 className="configTitle">SELECT CONFIGURATION</h3>
      </div>
      
      <div className="configContent">
        <div className="vehicleTypeSection">
          <p className="assignedTo">PLATES WILL BE ASSIGNED TO:</p>
          
          <div className="vehicleTypeOptions">
            {vehicleTypes.map((type) => (
              <label key={type} className={`vehicleTypeLabel ${showValidationErrors && !formData.selectConfiguration?.vehicleType && type === vehicleTypes[0] ? 'error-label' : ''}`}>
                <input
                  type="checkbox"
                  checked={(formData.selectConfiguration as SelectConfigurationType)?.vehicleType === type}
                  onChange={() => handleChange('vehicleType', type)}
                  className={`vehicleTypeCheckbox ${showValidationErrors && !formData.selectConfiguration?.vehicleType ? 'error-input' : ''}`}
                />
                {type} {type === 'Motorcycle' && <span className="noteText">(Select motorcycle plates will be issued a special interest decal on the left.)</span>}
              </label>
            ))}
            {showValidationErrors && getErrorMessage('vehicleType') && (
              <div className="error-message">{getErrorMessage('vehicleType')}</div>
            )}
          </div>
        </div>

        <div className="plateTypeSection">
          <div className="plateTypeOption">
            <label className={`plateTypeLabel ${showValidationErrors && !formData.selectConfiguration?.plateType ? 'error-label' : ''}`}>
              <input
                type="checkbox"
                checked={(formData.selectConfiguration as SelectConfigurationType)?.plateType === 'Sequential'}
                onChange={() => handlePlateTypeChange('Sequential')}
                className={`plateTypeCheckbox ${showValidationErrors && !formData.selectConfiguration?.plateType ? 'error-input' : ''}`}
              />
              <div className="plateTypeText">
                <span className="plateTypeTitle">Sequential (Non-Personalized) — Issued in number sequence.</span>
                <p className="plateTypeDescription">
                  Your existing sequential license plate number cannot be re-used. You must submit a copy of your current registration card.
                </p>
              </div>
            </label>
            
            {(formData.selectConfiguration as SelectConfigurationType)?.plateType === 'Sequential' && (
              <div className="sequentialDetails">
                <h4 className="sequentialTitle">Sequential plates will be assigned to:</h4>
                <div className="sequentialInputs">
                <div className="sequentialInput">
                  <label className="sequentialLabel">CURRENT LICENSE PLATE NUMBER</label>
                  <input
                    type="text"
                    className={`textInput uppercase-input ${showValidationErrors && getErrorMessage('currentLicensePlate') ? 'error-input' : ''}`}
                    value={(formData.selectConfiguration as SelectConfigurationType)?.currentLicensePlate || ''}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 7);
                      handleChange('currentLicensePlate', value);
                    }}
                    maxLength={7} 
                  />
                  {showValidationErrors && getErrorMessage('currentLicensePlate') && (
                    <div className="error-message">{getErrorMessage('currentLicensePlate')}</div>
                  )}
                </div>
                  <div className="sequentialInput">
                    <label className="sequentialLabel">FULL VEHICLE IDENTIFICATION NUMBER</label>
                    <input
                      type="text"
                      className={`textInput ${showValidationErrors && getErrorMessage('fullVehicleId') ? 'error-input' : ''}`}
                      value={(formData.selectConfiguration as SelectConfigurationType)?.fullVehicleId || ''}
                      onChange={(e) => handleChange('fullVehicleId', e.target.value)}
                    />
                    {showValidationErrors && getErrorMessage('fullVehicleId') && (
                      <div className="error-message">{getErrorMessage('fullVehicleId')}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="plateTypeOption">
            <label className={`plateTypeLabel ${showValidationErrors && !formData.selectConfiguration?.plateType ? 'error-label' : ''}`}>
              <input
                type="checkbox"
                checked={(formData.selectConfiguration as SelectConfigurationType)?.plateType === 'Personalized'}
                onChange={() => handlePlateTypeChange('Personalized')}
                className={`plateTypeCheckbox ${showValidationErrors && !formData.selectConfiguration?.plateType ? 'error-input' : ''}`}
              />
              <span className="plateTypeTitle">Personalized</span>
            </label>
            {showValidationErrors && getErrorMessage('plateType') && (
              <div className="error-message">{getErrorMessage('plateType')}</div>
            )}
          </div>
        </div>
        
        {(formData.selectConfiguration as SelectConfigurationType)?.plateType === 'Personalized' && (
          <div className="personalizedSection">
            <h4 className="personalizedTitle">PERSONALIZED CONFIGURATION CHOICE</h4>
            <p className="personalizedDescription">
              DMV has the right to refuse any combination of letters and/or letters and numbers for any of the following reason(s): it could be considered offensive to good taste and decency in any language or slang term, it substitutes letters for numbers or vice versa (e.g. ROBERT/RO8ERT), to look like another personalized plate, or it conflicts with any regular license plate series issued.
            </p>
            <p className="personalizedWarning">
              Your application will not be accepted if the MEANING of the plate is not entered, even if it appears obvious, OR if the plate configuration is unacceptable.
            </p>
            
            <div className="centeringOption">
              <label className="centeringLabel">
                <span className="centeringText">If you do NOT want the plate centered, check this box:</span>
                <input
                  type="checkbox"
                  checked={(formData.selectConfiguration as SelectConfigurationType)?.personalized?.plateNotCentered}
                  onChange={(e) => handlePersonalizedChange('plateNotCentered', e.target.checked)}
                  className="centeringCheckbox"
                />
              </label>
            </div>
            
            {/* Kids plate symbol section with responsive styling */}
            <div className="kidsPlateOption">
              <span className="kidsPlateText">KIDS PLATE: Circle choice of symbol</span>
              <div className="kidsPlateSymbols">
                {kidsSymbols.map((symbol) => (
                  <label key={symbol} className="symbolLabel">
                    <input
                      type="radio"
                      name="kidsPlateSymbol"
                      checked={(formData.selectConfiguration as SelectConfigurationType)?.personalized?.kidsPlateSymbol === symbol}
                      onChange={() => handlePersonalizedChange('kidsPlateSymbol', symbol)}
                      className="symbolRadio"
                    />
                    <div 
                      className={`symbol${symbol}`} 
                      style={{ 
                        width: '24px', 
                        height: '24px', 
                        display: 'inline-block',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        verticalAlign: 'middle'
                      }}
                    ></div>
                    <span style={{ marginLeft: '5px' }}>{symbol}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="choicesSection">
              {/* First Choice - Fixed width text input */}
              <div className="choiceColumn">
                <h5 className="choiceTitle">First Choice</h5>
                <p className="boxNote">Maximum 8 characters</p>
                <div className="plateBoxes">
                  <input
                    type="text"
                    maxLength={8}
                    className={`textInput ${showValidationErrors && getErrorMessage('firstChoice') ? 'error-input' : ''}`}
                    style={plateInputStyle}
                    value={(formData.selectConfiguration as SelectConfigurationType)?.personalized?.firstChoice || ''}
                    onChange={(e) => handlePersonalizedChange('firstChoice', e.target.value.toUpperCase())}
                    placeholder="PLATE1"
                  />
                  {showValidationErrors && getErrorMessage('firstChoice') && (
                    <div className="error-message">{getErrorMessage('firstChoice')}</div>
                  )}
                </div>
                <div className="meaningSection">
                  <label className="meaningLabel">
                    Meaning <span className="requiredText">(REQUIRED)</span>
                    <input
                      type="text"
                      className={`meaningInput ${showValidationErrors && getErrorMessage('firstChoiceMeaning') ? 'error-input' : ''}`}
                      value={(formData.selectConfiguration as SelectConfigurationType)?.personalized?.firstChoiceMeaning || ''}
                      onChange={(e) => handlePersonalizedChange('firstChoiceMeaning', e.target.value)}
                    />
                    {showValidationErrors && getErrorMessage('firstChoiceMeaning') && (
                      <div className="error-message">{getErrorMessage('firstChoiceMeaning')}</div>
                    )}
                  </label>
                </div>
              </div>
              
              {/* Second Choice - Fixed width text input */}
              <div className="choiceColumn">
                <h5 className="choiceTitle">Second Choice</h5>
                <p className="boxNote">Maximum 8 characters</p>
                <div className="plateBoxes">
                  <input
                    type="text"
                    maxLength={8}
                    className="textInput"
                    style={plateInputStyle}
                    value={(formData.selectConfiguration as SelectConfigurationType)?.personalized?.secondChoice || ''}
                    onChange={(e) => handlePersonalizedChange('secondChoice', e.target.value.toUpperCase())}
                    placeholder="PLATE2"
                  />
                </div>
                <div className="meaningSection">
                  <label className="meaningLabel">
                    Meaning <span className="requiredText">(REQUIRED)</span>
                    <input
                      type="text"
                      className={`meaningInput ${showValidationErrors && getErrorMessage('secondChoiceMeaning') ? 'error-input' : ''}`}
                      value={(formData.selectConfiguration as SelectConfigurationType)?.personalized?.secondChoiceMeaning || ''}
                      onChange={(e) => handlePersonalizedChange('secondChoiceMeaning', e.target.value)}
                    />
                    {showValidationErrors && getErrorMessage('secondChoiceMeaning') && (
                      <div className="error-message">{getErrorMessage('secondChoiceMeaning')}</div>
                    )}
                  </label>
                </div>
              </div>
              
              {/* Third Choice - Fixed width text input */}
              <div className="choiceColumn">
                <h5 className="choiceTitle">Third Choice</h5>
                <p className="boxNote">Maximum 8 characters</p>
                <div className="plateBoxes">
                  <input
                    type="text"
                    maxLength={8}
                    className="textInput"
                    style={plateInputStyle}
                    value={(formData.selectConfiguration as SelectConfigurationType)?.personalized?.thirdChoice || ''}
                    onChange={(e) => handlePersonalizedChange('thirdChoice', e.target.value.toUpperCase())}
                    placeholder="PLATE3"
                  />
                </div>
                <div className="meaningSection">
                  <label className="meaningLabel">
                    Meaning <span className="requiredText">(REQUIRED)</span>
                    <input
                      type="text"
                      className={`meaningInput ${showValidationErrors && getErrorMessage('thirdChoiceMeaning') ? 'error-input' : ''}`}
                      value={(formData.selectConfiguration as SelectConfigurationType)?.personalized?.thirdChoiceMeaning || ''}
                      onChange={(e) => handlePersonalizedChange('thirdChoiceMeaning', e.target.value)}
                    />
                    {showValidationErrors && getErrorMessage('thirdChoiceMeaning') && (
                      <div className="error-message">{getErrorMessage('thirdChoiceMeaning')}</div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Pickup location section moved outside personalized conditional block */}
        {(formData.selectConfiguration as SelectConfigurationType)?.plateType && (
          <div className="pickupSection">
            <div className="pickupOptions">
              {pickupLocations.map((location) => (
                <label key={location} className={`pickupLabel ${showValidationErrors && getErrorMessage('pickupLocation') ? 'error-label' : ''}`}>
                  <input
                    type="checkbox"
                    checked={(formData.selectConfiguration as SelectConfigurationType)?.pickupLocation === location}
                    onChange={() => handleChange('pickupLocation', location)}
                    className={`pickupCheckbox ${showValidationErrors && getErrorMessage('pickupLocation') ? 'error-input' : ''}`}
                  />
                  {location} {location === 'Auto Club' && <span className="noteText">(must be a member)</span>}
                </label>
              ))}
              {showValidationErrors && getErrorMessage('pickupLocation') && (
                <div className="error-message">{getErrorMessage('pickupLocation')}</div>
              )}
              <div className="locationInput">
                <label className="locationLabel">
                  LOCATION (city):
                  <input
                    type="text"
                    className={`textInput locationText ${showValidationErrors && getErrorMessage('locationCity') ? 'error-input' : ''}`}
                    value={(formData.selectConfiguration as SelectConfigurationType)?.locationCity || ''}
                    onChange={(e) => handleCityChange(e.target.value)}
                  />
                  {showValidationErrors && getErrorMessage('locationCity') && (
                    <div className="error-message">{getErrorMessage('locationCity')}</div>
                  )}
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectConfiguration;