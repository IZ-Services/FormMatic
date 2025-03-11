import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './LicensePlate.css';

interface LicensePlateData {
  oneMissingPlate?: boolean;
  twoMissingPlates?: boolean;
}

interface LicensePlateProps {
  formData?: {
    licensePlate?: LicensePlateData;
  };
}

const LicensePlate: React.FC<LicensePlateProps> = ({ formData: propFormData }) => {
  const [licensePlateData, setLicensePlateData] = useState<LicensePlateData>(
    propFormData?.licensePlate || {}
  );
  const { updateField } = useFormContext();

  useEffect(() => {
    if (propFormData?.licensePlate) {
      setLicensePlateData(propFormData.licensePlate);
    }
  }, [propFormData]);

  const handleLicensePlateChange = (field: keyof LicensePlateData, value: boolean) => {
    const newData = { 
      ...licensePlateData,       oneMissingPlate: field === 'oneMissingPlate' ? value : false,
      twoMissingPlates: field === 'twoMissingPlates' ? value : false
    };
    setLicensePlateData(newData);
    updateField('licensePlate', newData);
  };

  return (
    <div className="license-plate-wrapper">
      <div className="section-header">
        <h3 className="section-title">License Plate</h3>
      </div>

      <div className="license-plate-content">
        {/* <p className="section-description">
          Complete only if address is different than DMV records (California Vehicle Code (CVC) §4466)
        </p> */}

        <div className="license-plate-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={licensePlateData.oneMissingPlate || false}
              onChange={(e) => handleLicensePlateChange('oneMissingPlate', e.target.checked)}
            />
            One license plate missing (automobiles/two-plate commercial vehicles/pick-ups only)
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={licensePlateData.twoMissingPlates || false}
              onChange={(e) => handleLicensePlateChange('twoMissingPlates', e.target.checked)}
            />
            Two license plates are missing or one plate is missing for a single-plate commercial truck tractor, motorcycle, or trailer
          </label>
        </div>

        {/* <div className="important-note">
          <p>
            <strong>Important:</strong> If license plate(s) were stolen or missing, you must:
            <ul>
              <li>Appear in person at a DMV office</li>
              <li>Bring proof of ownership documents</li>
              <li>Bring Driver License or Identification Card</li>
              <li>If stolen, bring a police report</li>
            </ul>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default LicensePlate;