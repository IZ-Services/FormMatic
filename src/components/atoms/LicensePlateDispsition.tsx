import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './LicensePlateDisposition.css';

interface LicensePlateDispositionData {
  platesSurrendered?: 'one' | 'two';
  beingSurrendered?: boolean;
  haveLost?: boolean;
  haveDestroyed?: boolean;
  occupationalLicenseNumber?: string;
  plateRetainedByOwner?: boolean;
}

interface LicensePlateDispositionProps {
  formData?: {
    licensePlateDisposition?: LicensePlateDispositionData;
  };
}

const LicensePlateDisposition: React.FC<LicensePlateDispositionProps> = ({ formData: propFormData }) => {
  const [dispositionData, setDispositionData] = useState<LicensePlateDispositionData>({
    beingSurrendered: false,
    haveLost: false,
    haveDestroyed: false,
    plateRetainedByOwner: false
  });

  const { updateField } = useFormContext();

  useEffect(() => {
    const mergedData: LicensePlateDispositionData = {
      beingSurrendered: false,
      haveLost: false,
      haveDestroyed: false,
      plateRetainedByOwner: false,
      ...propFormData?.licensePlateDisposition
    };
    setDispositionData(mergedData);
  }, [propFormData]);

  const handleCheckboxChange = (field: keyof LicensePlateDispositionData) => {
    const newData: LicensePlateDispositionData = { 
      ...dispositionData,
      beingSurrendered: false,
      haveLost: false,
      haveDestroyed: false,
      plateRetainedByOwner: false,
      [field]: true
    };

    setDispositionData(newData);
    updateField('licensePlateDisposition', newData);
  };

  const handlePlatesSurrenderedChange = (plates: 'one' | 'two') => {
    const newData = { 
      ...dispositionData, 
      platesSurrendered: plates 
    };
    setDispositionData(newData);
    updateField('licensePlateDisposition', newData);
  };

  const handleOccupationalLicenseChange = (value: string) => {
    const newData = { 
      ...dispositionData, 
      occupationalLicenseNumber: value.toUpperCase() 
    };
    setDispositionData(newData);
    updateField('licensePlateDisposition', newData);
  };

  return (
    <div className="license-plate-disposition-wrapper">
      <div className="section-header">
        <h3 className="section-title">Certification of License Plate Disposition</h3>
      </div>

      <div className="disposition-content">
        <p className="section-description">The license plates assigned to this vehicle:</p>

        <div className="checkbox-group">
          <div className="checkbox-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={dispositionData.beingSurrendered || false}
                onChange={() => handleCheckboxChange('beingSurrendered')}
              />
              Are being surrendered
            </label>
            
            {dispositionData.beingSurrendered && (
              <div className="plates-surrendered-group">
                <span className="plates-surrendered-title">Plates surrendered:</span>
                <div className="radio-options">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="platesSurrendered"
                      checked={dispositionData.platesSurrendered === 'one'}
                      onChange={() => handlePlatesSurrenderedChange('one')}
                    />
                    One
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="platesSurrendered"
                      checked={dispositionData.platesSurrendered === 'two'}
                      onChange={() => handlePlatesSurrenderedChange('two')}
                    />
                    Two
                  </label>
                </div>
              </div>
            )}
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={dispositionData.haveLost || false}
              onChange={() => handleCheckboxChange('haveLost')}
            />
            Have been lost
          </label>

          <div className="checkbox-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={dispositionData.haveDestroyed || false}
                onChange={() => handleCheckboxChange('haveDestroyed')}
              />
              Have been destroyed (Occupational Licensees Only)
            </label>
            
            {dispositionData.haveDestroyed && (
              <div className="occupational-license-group">
                <label>
                  Occupational License Number
                  <input
                    type="text"
                    className="occupational-license-input"
                    value={dispositionData.occupationalLicenseNumber || ''}
                    onChange={(e) => handleOccupationalLicenseChange(e.target.value)}
                  />
                </label>
              </div>
            )}
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={dispositionData.plateRetainedByOwner || false}
              onChange={() => handleCheckboxChange('plateRetainedByOwner')}
            />
            Plate with owner - Retained by owner for reassignment
          </label>
        </div>
      </div>
    </div>
  );
};

export default LicensePlateDisposition;