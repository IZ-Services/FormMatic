import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './LeasedVehicles.css';

interface LeasedVehiclesData {
  isLeased: boolean;
  leasingCompanyName: string;
}

interface LeasedVehiclesProps {
  formData?: {
    leasedVehicles?: Partial<LeasedVehiclesData>;
  };
  onChange?: (data: LeasedVehiclesData) => void;
  onShowSection6?: (show: boolean) => void;
}

const LeasedVehicles: React.FC<LeasedVehiclesProps> = ({ 
  formData: propFormData,
  onChange,
  onShowSection6 
}) => {
  const { formData: contextFormData, updateField } = useFormContext();
  
  const combinedFormData = {
    ...contextFormData,
    ...propFormData
  };
  
  const [leasedVehiclesData, setLeasedVehiclesData] = useState<LeasedVehiclesData>({
    isLeased: false,
    leasingCompanyName: ''
  });

  useEffect(() => {
    const mergedData: LeasedVehiclesData = {
      isLeased: false,
      leasingCompanyName: '',
      ...combinedFormData?.leasedVehicles
    };
    setLeasedVehiclesData(mergedData);

 
    if (onShowSection6) {
      onShowSection6(mergedData.isLeased);
    }
  }, [combinedFormData?.leasedVehicles, onShowSection6]);

  const handleRadioChange = () => {
    const newValue = !leasedVehiclesData.isLeased;
    
    const newData: LeasedVehiclesData = { 
      isLeased: newValue,
      leasingCompanyName: newValue ? leasedVehiclesData.leasingCompanyName : ''
    };

    console.log('Changing is leased to:', newValue);
    console.log("New leased vehicles data:", newData);

    setLeasedVehiclesData(newData);
    updateField('leasedVehicles', newData);
    
 
    if (onShowSection6) {
      onShowSection6(newValue);
    }
    
    if (onChange) {
      onChange(newData);
    }
  };

  const handleLeasingCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData: LeasedVehiclesData = {
      ...leasedVehiclesData,
      leasingCompanyName: e.target.value
    };

    setLeasedVehiclesData(newData);
    updateField('leasedVehicles', newData);

    if (onChange) {
      onChange(newData);
    }
  };

  return (
    <div className="leased-vehicles">
      <div className="releaseWrapper">
        <div className="headerRow">
          <h3 className="releaseHeading">Leased Vehicles</h3>
        </div>

        <div className="checkbox-containerr">
          <div className="checkbox-sectionn">
            <label className="checkbox-label">
              <input
                type="radio"
                name="leasedVehicles"
                checked={leasedVehiclesData.isLeased === false}
                onChange={handleRadioChange}
                data-testid="no-leased-vehicles"
              />
              No Leased Vehicles
            </label>
          </div>

          <div className="checkbox-sectionn">
            <label className="checkbox-label">
              <input
                type="radio"
                name="leasedVehicles"
                checked={leasedVehiclesData.isLeased === true}
                onChange={handleRadioChange}
                data-testid="has-leased-vehicles"
              />
              Leased Vehicles
            </label>
          </div>

          {leasedVehiclesData.isLeased && (
            <div className="leased-vehicles-details">
              <div className="leased-vehicles-input-group">
                <div className="leased-vehicles-input-wrapper">
                  <label className="leased-vehicles-label">LEASING COMPANY'S NAME</label>
                  <input
                    type="text"
                    className="leased-vehicles-input"
                    value={leasedVehiclesData.leasingCompanyName}
                    onChange={handleLeasingCompanyNameChange}
                    maxLength={50}
                    placeholder="Enter leasing company name"
                    data-testid="leasing-company-name"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeasedVehicles;