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

interface VehicleBodyChangeProps {
  formData?: {
    vehicleBodyChange?: VehicleBodyChangeData;
    _showValidationErrors?: boolean;
  };
}

const VehicleBodyChange: React.FC<VehicleBodyChangeProps> = ({ formData: propFormData }) => {
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
  
  const showValidationErrors = formData?._showValidationErrors === true;

  useEffect(() => {
    if (formData?.vehicleBodyChange) {
      setBodyChangeData({
        ...bodyChangeData,
        ...formData.vehicleBodyChange
      });
    }
  }, [formData?.vehicleBodyChange]);

  const handleInputChange = (field: keyof VehicleBodyChangeData, value: string | boolean) => {
    const newData = { ...bodyChangeData, [field]: value };
    setBodyChangeData(newData);
    updateField('vehicleBodyChange', newData);
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
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '150px'
            }}
          />
        </div>
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
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '150px',
              marginRight: '10px'
            }}
          />
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
            onChange={(e) => handleInputChange('changeDate', e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '150px'
            }}
          />
        </div>
      </div>
      
      <div className="changes-header" style={{ 
        marginBottom: '10px', 
        fontSize: '14px', 
        fontWeight: 'bold' 
      }}>
        This is what I changed: <span style={{ fontStyle: 'italic' }}>Check all that apply:</span>
      </div>
      
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
                border: '1px solid #ccc',
                borderRadius: '4px',
                width: 'calc(100% - 20px)',
                maxWidth: '500px'
              }}
            />
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
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  width: '150px'
                }}
              />
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
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  width: '150px'
                }}
              />
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
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  width: '150px'
                }}
              />
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
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  width: '150px'
                }}
              />
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
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  width: '100px'
                }}
              />
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
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  width: '100px'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleBodyChange;