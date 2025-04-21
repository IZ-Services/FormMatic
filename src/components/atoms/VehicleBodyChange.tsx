import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';

interface VehicleBodyChangeData {
  marketValue: string;
  changeCost: string;
  changeDate: string;
  unladenWeightChanged: boolean;
  unladenWeightReason: string;
  motiveChanged: boolean;
  motiveFrom: string;
  motiveTo: string;
  bodyTypeChanged: boolean;
  bodyTypeFrom: string;
  bodyTypeTo: string;
  axlesChanged: boolean;
  axlesFrom: string;
  axlesTo: string;
}

interface ValidationError {
  fieldPath: string;
  message: string;
}

interface VehicleBodyChangeProps {
  formData?: {
    vehicleBodyChange?: VehicleBodyChangeData;
    _showValidationErrors?: boolean;
  };
  onChange?: (data: VehicleBodyChangeData) => void;
  showValidationErrors?: boolean;
}

const VehicleBodyChange: React.FC<VehicleBodyChangeProps> = ({ 
  formData: propFormData, 
  onChange,
  showValidationErrors = false
}) => {
  const { formData: contextFormData, updateField } = useFormContext();
  
  const formData = {
    ...contextFormData,
    ...propFormData
  };
  
  const initialBodyChangeData: VehicleBodyChangeData = {
    marketValue: '',
    changeCost: '',
    changeDate: '',
    unladenWeightChanged: false,
    unladenWeightReason: '',
    motiveChanged: false,
    motiveFrom: '',
    motiveTo: '',
    bodyTypeChanged: false,
    bodyTypeFrom: '',
    bodyTypeTo: '',
    axlesChanged: false,
    axlesFrom: '',
    axlesTo: ''
  };
  
  const [bodyChangeData, setBodyChangeData] = useState<VehicleBodyChangeData>({
    ...initialBodyChangeData,
    ...(formData?.vehicleBodyChange || {})
  });
  
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  

  const shouldShowValidationErrors = showValidationErrors || formData?._showValidationErrors === true;

  useEffect(() => {
    if (formData?.vehicleBodyChange) {
      setBodyChangeData({
        ...bodyChangeData,
        ...formData.vehicleBodyChange
      });
    }
  }, [formData?.vehicleBodyChange]);


  const validateVehicleBodyChange = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    

    if (!bodyChangeData.marketValue || bodyChangeData.marketValue.trim() === '') {
      errors.push({
        fieldPath: 'vehicleBodyChange.marketValue',
        message: 'Current market value is required'
      });
    } else if (isNaN(parseFloat(bodyChangeData.marketValue))) {
      errors.push({
        fieldPath: 'vehicleBodyChange.marketValue',
        message: 'Market value must be a valid number'
      });
    }
    

    if (!bodyChangeData.changeCost || bodyChangeData.changeCost.trim() === '') {
      errors.push({
        fieldPath: 'vehicleBodyChange.changeCost',
        message: 'Change cost is required'
      });
    } else if (isNaN(parseFloat(bodyChangeData.changeCost))) {
      errors.push({
        fieldPath: 'vehicleBodyChange.changeCost',
        message: 'Change cost must be a valid number'
      });
    }
    

    if (!bodyChangeData.changeDate || bodyChangeData.changeDate.trim() === '') {
      errors.push({
        fieldPath: 'vehicleBodyChange.changeDate',
        message: 'Change date is required'
      });
    } else {

      const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
      if (!datePattern.test(bodyChangeData.changeDate)) {
        errors.push({
          fieldPath: 'vehicleBodyChange.changeDate',
          message: 'Date must be in MM/DD/YYYY format'
        });
      } else {

        const [month, day, year] = bodyChangeData.changeDate.split('/').map(Number);
        const inputDate = new Date(year, month - 1, day);
        const today = new Date();
        
        if (inputDate > today) {
          errors.push({
            fieldPath: 'vehicleBodyChange.changeDate',
            message: 'Change date cannot be in the future'
          });
        }
      }
    }
    

    if (!bodyChangeData.unladenWeightChanged && 
        !bodyChangeData.motiveChanged && 
        !bodyChangeData.bodyTypeChanged && 
        !bodyChangeData.axlesChanged) {
      errors.push({
        fieldPath: 'vehicleBodyChange.changeType',
        message: 'Please select at least one type of change'
      });
    }
    

    if (bodyChangeData.unladenWeightChanged && 
        (!bodyChangeData.unladenWeightReason || bodyChangeData.unladenWeightReason.trim() === '')) {
      errors.push({
        fieldPath: 'vehicleBodyChange.unladenWeightReason',
        message: 'Please provide a reason for unladen weight change'
      });
    }
    

    if (bodyChangeData.motiveChanged) {
      if (!bodyChangeData.motiveFrom || bodyChangeData.motiveFrom.trim() === '') {
        errors.push({
          fieldPath: 'vehicleBodyChange.motiveFrom',
          message: 'Original motive power is required'
        });
      }
      
      if (!bodyChangeData.motiveTo || bodyChangeData.motiveTo.trim() === '') {
        errors.push({
          fieldPath: 'vehicleBodyChange.motiveTo',
          message: 'New motive power is required'
        });
      }
    }
    

    if (bodyChangeData.bodyTypeChanged) {
      if (!bodyChangeData.bodyTypeFrom || bodyChangeData.bodyTypeFrom.trim() === '') {
        errors.push({
          fieldPath: 'vehicleBodyChange.bodyTypeFrom',
          message: 'Original body type is required'
        });
      }
      
      if (!bodyChangeData.bodyTypeTo || bodyChangeData.bodyTypeTo.trim() === '') {
        errors.push({
          fieldPath: 'vehicleBodyChange.bodyTypeTo',
          message: 'New body type is required'
        });
      }
    }
    

    if (bodyChangeData.axlesChanged) {
      if (!bodyChangeData.axlesFrom || bodyChangeData.axlesFrom.trim() === '') {
        errors.push({
          fieldPath: 'vehicleBodyChange.axlesFrom',
          message: 'Original number of axles is required'
        });
      } else if (isNaN(parseInt(bodyChangeData.axlesFrom))) {
        errors.push({
          fieldPath: 'vehicleBodyChange.axlesFrom',
          message: 'Number of axles must be a valid number'
        });
      }
      
      if (!bodyChangeData.axlesTo || bodyChangeData.axlesTo.trim() === '') {
        errors.push({
          fieldPath: 'vehicleBodyChange.axlesTo',
          message: 'New number of axles is required'
        });
      } else if (isNaN(parseInt(bodyChangeData.axlesTo))) {
        errors.push({
          fieldPath: 'vehicleBodyChange.axlesTo',
          message: 'Number of axles must be a valid number'
        });
      }
    }
    
    return errors;
  };
  

  const getErrorMessage = (fieldPath: string): string | null => {
    const error = validationErrors.find(err => err.fieldPath === fieldPath);
    return error ? error.message : null;
  };
  

  const shouldShowValidationError = (field: string): boolean => {
    if (!shouldShowValidationErrors) return false;
    return validationErrors.some(err => err.fieldPath === `vehicleBodyChange.${field}`);
  };
  

  useEffect(() => {
    if (shouldShowValidationErrors) {
      const errors = validateVehicleBodyChange();
      setValidationErrors(errors);
      

      const currentValidationErrors = typeof contextFormData._validationErrors === 'object' && 
        contextFormData._validationErrors !== null
        ? contextFormData._validationErrors
        : {};
        
      updateField('_validationErrors', {
        ...currentValidationErrors,
        vehicleBodyChange: errors.length > 0
      });
    }
  }, [shouldShowValidationErrors, bodyChangeData]);

  const handleInputChange = (field: keyof VehicleBodyChangeData, value: string | boolean) => {
    const newData = { ...bodyChangeData, [field]: value };
    setBodyChangeData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField('vehicleBodyChange', newData);
    }
  };

  const handleCheckboxChange = (field: keyof VehicleBodyChangeData, checked: boolean) => {
    handleInputChange(field, checked);
  };

  const formatCurrency = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits === '') return '';
    const dollars = digits.substring(0, digits.length);
    return dollars;
  };
  
  const handleCurrencyChange = (field: 'marketValue' | 'changeCost', value: string) => {
    const formattedValue = formatCurrency(value);
    handleInputChange(field, formattedValue);
  };
  

  const handleDateChange = (value: string) => {

    let cleaned = value.replace(/[^\d/]/g, '');
    

    if (cleaned.length === 2 && !cleaned.includes('/') && !bodyChangeData.changeDate.includes('/')) {
      cleaned = cleaned + '/';
    } else if (cleaned.length === 5 && cleaned.indexOf('/') === 2 && cleaned.lastIndexOf('/') === 2) {
      cleaned = cleaned + '/';
    }
    
    handleInputChange('changeDate', cleaned);
  };

  return (
    <div className="vehicle-body-change-wrapper" style={{ 
      marginTop: '20px',
      marginBottom: '20px',
      width: '100%'
    }}>
      <div className="section-heading" style={{ 
        marginBottom: '15px' 
      }}>
        <h3 style={{ 
          fontSize: '16px',
          fontWeight: 'bold',
          margin: 0
        }}>
          STATEMENT FOR VEHICLE BODY CHANGE (OWNERSHIP CERTIFICATE REQUIRED)
        </h3>
      </div>
      
      {/* Market Value Row */}
      <div className="market-value-row" style={{ 
        marginBottom: '15px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <label style={{ 
          marginRight: '10px', 
          fontSize: '14px',
          marginBottom: '5px'
        }}>
          The current market value of the vehicle or vessel is:
        </label>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center'
        }}>
          <span style={{ marginRight: '5px', fontSize: '16px' }}>$</span>
          <input
            type="text"
            value={bodyChangeData.marketValue || ''}
            onChange={(e) => handleCurrencyChange('marketValue', e.target.value)}
            style={{
              padding: '8px',
              border: shouldShowValidationError('marketValue') ? '1px solid #f44336' : '1px solid #ccc',
              borderRadius: '4px',
              width: '150px'
            }}
          />
        </div>
        {shouldShowValidationError('marketValue') && (
          <div style={{ 
            color: '#f44336', 
            fontSize: '12px', 
            marginTop: '5px',
            width: '100%'
          }}>
            {getErrorMessage('vehicleBodyChange.marketValue')}
          </div>
        )}
      </div>
      
      {/* Changes Cost Row */}
      <div className="changes-cost-row" style={{ 
        marginBottom: '15px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          marginBottom: '10px',
          flexWrap: 'wrap'
        }}>
          <label style={{ 
            marginRight: '10px', 
            fontSize: '14px'
          }}>
            Changes were made at a cost of $
          </label>
          <input
            type="text"
            value={bodyChangeData.changeCost || ''}
            onChange={(e) => handleCurrencyChange('changeCost', e.target.value)}
            style={{
              padding: '8px',
              border: shouldShowValidationError('changeCost') ? '1px solid #f44336' : '1px solid #ccc',
              borderRadius: '4px',
              width: '150px',
              marginRight: '10px'
            }}
          />
          {shouldShowValidationError('changeCost') && (
            <div style={{ 
              color: '#f44336', 
              fontSize: '12px', 
              marginTop: '5px',
              width: '100%'
            }}>
              {getErrorMessage('vehicleBodyChange.changeCost')}
            </div>
          )}
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <label style={{ 
            marginRight: '10px', 
            fontSize: '14px'
          }}>
            on this date
          </label>
          <input
            type="text"
            placeholder="MM/DD/YYYY"
            value={bodyChangeData.changeDate || ''}
            onChange={(e) => handleDateChange(e.target.value)}
            style={{
              padding: '8px',
              border: shouldShowValidationError('changeDate') ? '1px solid #f44336' : '1px solid #ccc',
              borderRadius: '4px',
              width: '150px'
            }}
          />
          {shouldShowValidationError('changeDate') && (
            <div style={{ 
              color: '#f44336', 
              fontSize: '12px', 
              marginTop: '5px',
              width: '100%'
            }}>
              {getErrorMessage('vehicleBodyChange.changeDate')}
            </div>
          )}
        </div>
      </div>
      
      <div className="changes-header" style={{ 
        marginBottom: '10px', 
        fontSize: '14px', 
        fontWeight: 'bold' 
      }}>
        This is what I changed: <span style={{ fontStyle: 'italic' }}>Check all that apply:</span>
      </div>
      
      {shouldShowValidationError('changeType') && (
        <div style={{ 
          color: '#f44336', 
          fontSize: '12px', 
          marginBottom: '10px'
        }}>
          {getErrorMessage('vehicleBodyChange.changeType')}
        </div>
      )}
      
      <div className="changes-list" style={{ marginLeft: '20px' }}>
        {/* Unladen Weight Change */}
        <div className="change-item" style={{ 
          marginBottom: '15px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start'
          }}>
            <input
              type="checkbox"
              checked={bodyChangeData.unladenWeightChanged || false}
              onChange={(e) => handleCheckboxChange('unladenWeightChanged', e.target.checked)}
              style={{ marginRight: '10px', marginTop: '3px' }}
            />
            <label style={{ fontSize: '14px' }}>
              Unladen Weight changed because
            </label>
          </div>
          <div style={{ 
            marginLeft: '25px', 
            marginTop: '5px' 
          }}>
            <input
              type="text"
              value={bodyChangeData.unladenWeightReason || ''}
              onChange={(e) => handleInputChange('unladenWeightReason', e.target.value)}
              style={{
                padding: '8px',
                border: shouldShowValidationError('unladenWeightReason') ? '1px solid #f44336' : '1px solid #ccc',
                borderRadius: '4px',
                width: 'calc(100% - 20px)',
                maxWidth: '500px'
              }}
              disabled={!bodyChangeData.unladenWeightChanged}
            />
            {shouldShowValidationError('unladenWeightReason') && (
              <div style={{ 
                color: '#f44336', 
                fontSize: '12px', 
                marginTop: '5px'
              }}>
                {getErrorMessage('vehicleBodyChange.unladenWeightReason')}
              </div>
            )}
            <div style={{ 
              marginTop: '5px', 
              fontSize: '14px', 
              fontStyle: 'italic' 
            }}>
              (Public Weighmaster Certificate is required. Exception: Trailers)
            </div>
          </div>
        </div>
        
        {/* Motive Power Change */}
        <div className="change-item" style={{ 
          marginBottom: '15px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center'
          }}>
            <input
              type="checkbox"
              checked={bodyChangeData.motiveChanged || false}
              onChange={(e) => handleCheckboxChange('motiveChanged', e.target.checked)}
              style={{ marginRight: '10px' }}
            />
            <label style={{ fontSize: '14px' }}>
              Motive Power changed from
            </label>
          </div>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            marginLeft: '25px',
            marginTop: '5px' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginRight: '15px',
              marginBottom: '10px'
            }}>
              <input
                type="text"
                value={bodyChangeData.motiveFrom || ''}
                onChange={(e) => handleInputChange('motiveFrom', e.target.value)}
                style={{
                  padding: '8px',
                  border: shouldShowValidationError('motiveFrom') ? '1px solid #f44336' : '1px solid #ccc',
                  borderRadius: '4px',
                  width: '150px'
                }}
                disabled={!bodyChangeData.motiveChanged}
              />
              {shouldShowValidationError('motiveFrom') && (
                <div style={{ 
                  color: '#f44336', 
                  fontSize: '12px', 
                  marginTop: '5px',
                  marginLeft: '5px'
                }}>
                  {getErrorMessage('vehicleBodyChange.motiveFrom')}
                </div>
              )}
            </div>
            <div style={{ 
              display: 'flex',
              alignItems: 'center'
            }}>
              <label style={{ 
                fontSize: '14px', 
                marginRight: '10px'
              }}>to</label>
              <input
                type="text"
                value={bodyChangeData.motiveTo || ''}
                onChange={(e) => handleInputChange('motiveTo', e.target.value)}
                style={{
                  padding: '8px',
                  border: shouldShowValidationError('motiveTo') ? '1px solid #f44336' : '1px solid #ccc',
                  borderRadius: '4px',
                  width: '150px'
                }}
                disabled={!bodyChangeData.motiveChanged}
              />
              {shouldShowValidationError('motiveTo') && (
                <div style={{ 
                  color: '#f44336', 
                  fontSize: '12px', 
                  marginTop: '5px',
                  marginLeft: '5px'
                }}>
                  {getErrorMessage('vehicleBodyChange.motiveTo')}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Body Type Change */}
        <div className="change-item" style={{ 
          marginBottom: '15px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center'
          }}>
            <input
              type="checkbox"
              checked={bodyChangeData.bodyTypeChanged || false}
              onChange={(e) => handleCheckboxChange('bodyTypeChanged', e.target.checked)}
              style={{ marginRight: '10px' }}
            />
            <label style={{ fontSize: '14px' }}>
              Body Type changed from
            </label>
          </div>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            marginLeft: '25px',
            marginTop: '5px' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginRight: '15px',
              marginBottom: '10px'
            }}>
              <input
                type="text"
                value={bodyChangeData.bodyTypeFrom || ''}
                onChange={(e) => handleInputChange('bodyTypeFrom', e.target.value)}
                style={{
                  padding: '8px',
                  border: shouldShowValidationError('bodyTypeFrom') ? '1px solid #f44336' : '1px solid #ccc',
                  borderRadius: '4px',
                  width: '150px'
                }}
                disabled={!bodyChangeData.bodyTypeChanged}
              />
              {shouldShowValidationError('bodyTypeFrom') && (
                <div style={{ 
                  color: '#f44336', 
                  fontSize: '12px', 
                  marginTop: '5px',
                  marginLeft: '5px'
                }}>
                  {getErrorMessage('vehicleBodyChange.bodyTypeFrom')}
                </div>
              )}
            </div>
            <div style={{ 
              display: 'flex',
              alignItems: 'center'
            }}>
              <label style={{ 
                fontSize: '14px', 
                marginRight: '10px'
              }}>to</label>
              <input
                type="text"
                value={bodyChangeData.bodyTypeTo || ''}
                onChange={(e) => handleInputChange('bodyTypeTo', e.target.value)}
                style={{
                  padding: '8px',
                  border: shouldShowValidationError('bodyTypeTo') ? '1px solid #f44336' : '1px solid #ccc',
                  borderRadius: '4px',
                  width: '150px'
                }}
                disabled={!bodyChangeData.bodyTypeChanged}
              />
              {shouldShowValidationError('bodyTypeTo') && (
                <div style={{ 
                  color: '#f44336', 
                  fontSize: '12px', 
                  marginTop: '5px',
                  marginLeft: '5px'
                }}>
                  {getErrorMessage('vehicleBodyChange.bodyTypeTo')}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Number of Axles Change */}
        <div className="change-item" style={{ 
          marginBottom: '15px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center'
          }}>
            <input
              type="checkbox"
              checked={bodyChangeData.axlesChanged || false}
              onChange={(e) => handleCheckboxChange('axlesChanged', e.target.checked)}
              style={{ marginRight: '10px' }}
            />
            <label style={{ fontSize: '14px' }}>
              Number of Axles changed from
            </label>
          </div>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            marginLeft: '25px',
            marginTop: '5px' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginRight: '15px',
              marginBottom: '10px'
            }}>
              <input
                type="text"
                value={bodyChangeData.axlesFrom || ''}
                onChange={(e) => handleInputChange('axlesFrom', e.target.value)}
                style={{
                  padding: '8px',
                  border: shouldShowValidationError('axlesFrom') ? '1px solid #f44336' : '1px solid #ccc',
                  borderRadius: '4px',
                  width: '100px'
                }}
                disabled={!bodyChangeData.axlesChanged}
              />
              {shouldShowValidationError('axlesFrom') && (
                <div style={{ 
                  color: '#f44336', 
                  fontSize: '12px', 
                  marginTop: '5px',
                  marginLeft: '5px'
                }}>
                  {getErrorMessage('vehicleBodyChange.axlesFrom')}
                </div>
              )}
            </div>
            <div style={{ 
              display: 'flex',
              alignItems: 'center'
            }}>
              <label style={{ 
                fontSize: '14px', 
                marginRight: '10px'
              }}>to</label>
              <input
                type="text"
                value={bodyChangeData.axlesTo || ''}
                onChange={(e) => handleInputChange('axlesTo', e.target.value)}
                style={{
                  padding: '8px',
                  border: shouldShowValidationError('axlesTo') ? '1px solid #f44336' : '1px solid #ccc',
                  borderRadius: '4px',
                  width: '100px'
                }}
                disabled={!bodyChangeData.axlesChanged}
              />
              {shouldShowValidationError('axlesTo') && (
                <div style={{ 
                  color: '#f44336', 
                  fontSize: '12px', 
                  marginTop: '5px',
                  marginLeft: '5px'
                }}>
                  {getErrorMessage('vehicleBodyChange.axlesTo')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleBodyChange;