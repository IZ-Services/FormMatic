import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './SalvageCertificate.css';

interface SalvageCertificateData {
  vehicleLicenseNumber?: string;
  makeOfVehicle?: string;
  year?: string;
  vehicleIdentificationNumber?: string;
  stateOfLastRegistration?: string;
  dateRegistrationExpires?: string;
  claimNumber?: string;
  dateWreckedOrDestroyed?: string;
  dateStolen?: string;
  dateRecovered?: string;
  costOrValue?: string;
}

interface SalvageCertificateProps {
  formData?: {
    salvageCertificate?: SalvageCertificateData;
  };
}

const SalvageCertificate: React.FC<SalvageCertificateProps> = ({ formData: propFormData }) => {
  const [salvageData, setSalvageData] = useState<SalvageCertificateData>(
    propFormData?.salvageCertificate || {}
  );
  const { updateField } = useFormContext();

  useEffect(() => {
    if (propFormData?.salvageCertificate) {
      setSalvageData(propFormData.salvageCertificate);
    }
  }, [propFormData]);

  const handleInputChange = (field: keyof SalvageCertificateData, value: string) => {
    const newData = { 
      ...salvageData, 
      [field]: field.toLowerCase().includes('date') 
        ? formatDate(value) 
        : value 
    };
    setSalvageData(newData);
    updateField('salvageCertificate', newData);
  };

  const formatDate = (value: string) => {
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
    <div className="salvage-certificate-wrapper">
      <div className="section-header">
        <h3 className="section-title">Salvage Certificate</h3>
      </div>

      <div className="form-grid">
        <div className="input-row">
          <div className="input-group">
            <label className="input-label">State of last registration</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter state"
              value={salvageData.stateOfLastRegistration || ''}
              onChange={(e) => handleInputChange('stateOfLastRegistration', e.target.value)}
              maxLength={2}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Date registration expires</label>
            <input
              type="text"
              className="form-input"
              placeholder="MM/DD/YYYY"
              value={salvageData.dateRegistrationExpires || ''}
              onChange={(e) => handleInputChange('dateRegistrationExpires', e.target.value)}
              maxLength={10}
            />
          </div>
        </div>
        <div className="input-row">
          <div className="input-group">
            <label className="input-label">Cost/value</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter cost or value"
              value={salvageData.costOrValue || ''}
              onChange={(e) => handleInputChange('costOrValue', e.target.value)}
              maxLength={20}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Claim number</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter claim number"
              value={salvageData.claimNumber || ''}
              onChange={(e) => handleInputChange('claimNumber', e.target.value)}
              maxLength={20}
            />
          </div>
        </div>
        <div className="input-row">
          <div className="input-group">
            <label className="input-label">Date wrecked</label>
            <input
              type="text"
              className="form-input"
              placeholder="MM/DD/YYYY"
              value={salvageData.dateWreckedOrDestroyed || ''}
              onChange={(e) => handleInputChange('dateWreckedOrDestroyed', e.target.value)}
              maxLength={10}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Date stolen</label>
            <input
              type="text"
              className="form-input"
              placeholder="MM/DD/YYYY"
              value={salvageData.dateStolen || ''}
              onChange={(e) => handleInputChange('dateStolen', e.target.value)}
              maxLength={10}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Date recovered</label>
            <input
              type="text"
              className="form-input"
              placeholder="MM/DD/YYYY"
              value={salvageData.dateRecovered || ''}
              onChange={(e) => handleInputChange('dateRecovered', e.target.value)}
              maxLength={10}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalvageCertificate;