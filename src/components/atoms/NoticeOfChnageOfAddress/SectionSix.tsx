import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../../app/api/formDataContext/formDataContextProvider';

interface SectionSixData {
  leasingCompanyName?: string;
}

interface SectionSixProps {
  formData?: {
    leasedVehicles?: SectionSixData;
  };
}

const SectionSix: React.FC<SectionSixProps> = ({ formData: propFormData }) => {
  const [leasingData, setLeasingData] = useState<SectionSixData>(
    propFormData?.leasedVehicles || { leasingCompanyName: '' }
  );
  const { updateField } = useFormContext();

  useEffect(() => {
    if (propFormData?.leasedVehicles) {
      setLeasingData(propFormData.leasedVehicles);
    }
  }, [propFormData]);

  const handleInputChange = (value: string) => {
    const newData = { 
      leasingCompanyName: value.toUpperCase() 
    };
    setLeasingData(newData);
    updateField('leasedVehicles', newData);
  };

  return (
    <div className="section-six-wrapper">
      <div className="section-header">
        <h3 className="section-title">Leased Vehicles</h3>
      </div>

      <div className="input-group">
        <label className="input-label">LEASING COMPANY'S NAME</label>
        <input
          type="text"
          className="form-input"
          value={leasingData.leasingCompanyName || ''}
          onChange={(e) => handleInputChange(e.target.value)}
          maxLength={30}
        />
      </div>
    </div>
  );
};

export default SectionSix;