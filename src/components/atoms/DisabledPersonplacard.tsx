import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './DisabledPersonPlacard.css';

interface DisabledPersonPlacardData {
  placardNumber?: string;
  birthDate?: string;
}

interface DisabledPersonPlacardProps {
  formData?: {
    disabledPersonPlacard?: DisabledPersonPlacardData;
  };
}

const DisabledPersonPlacard: React.FC<DisabledPersonPlacardProps> = ({ formData: propFormData }) => {
  const [placardData, setPlacardData] = useState<DisabledPersonPlacardData>(
    propFormData?.disabledPersonPlacard || {}
  );
  const { updateField } = useFormContext();

  useEffect(() => {
    if (propFormData?.disabledPersonPlacard) {
      setPlacardData(propFormData.disabledPersonPlacard);
    }
  }, [propFormData]);

  const handleInputChange = (field: keyof DisabledPersonPlacardData, value: string) => {
    const newData = { 
      ...placardData, 
      [field]: field === 'birthDate' ? formatBirthDate(value) : value.toUpperCase() 
    };
    setPlacardData(newData);
    updateField('disabledPersonPlacard', newData);
  };

  const formatBirthDate = (value: string) => {
    // Remove non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // Format as MM/DD/YYYY
    let formatted = digitsOnly;
    if (formatted.length > 2) {
      formatted = `${formatted.slice(0, 2)}/${formatted.slice(2)}`;
    }
    if (formatted.length > 5) {
      formatted = `${formatted.slice(0, 5)}/${formatted.slice(5)}`;
    }
    
    // Limit to 10 characters (MM/DD/YYYY)
    return formatted.slice(0, 10);
  };

  return (
    <div className="disabled-placard-wrapper">
      <div className="section-header">
        <h3 className="section-title">Disabled Person Placard</h3>
      </div>

      <div className="form-content">
        <div className="input-group">
          <label className="input-label">DISABLED PERSON PLACARD NUMBER</label>
          <input
            type="text"
            className="form-input"
            value={placardData.placardNumber || ''}
            onChange={(e) => handleInputChange('placardNumber', e.target.value)}
            maxLength={20}
          />
        </div>

        <div className="input-group">
          <label className="input-label">BIRTH DATE, IF DP PLACARD</label>
          <input
            type="text"
            className="form-input"
            placeholder="MM/DD/YYYY"
            value={placardData.birthDate || ''}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
            maxLength={10}
          />
        </div>
      </div>
    </div>
  );
};

export default DisabledPersonPlacard;