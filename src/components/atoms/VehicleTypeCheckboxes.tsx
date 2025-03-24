import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './Checkboxes.css';

interface VehicleTypeData {
  isAuto?: boolean;
  isMotorcycle?: boolean;
  isOffHighway?: boolean;
  isTrailerCoach?: boolean;
}

interface VehicleInformationType {
  engineNumber?: string;
  length?: string;
  width?: string;
  [key: string]: any;
}

interface FormDataType {
  vehicleType?: VehicleTypeData;
  vehicleInformation?: VehicleInformationType;
  owners?: any[];
}

interface VehicleTypeProps {
  formData?: FormDataType;
  onChange?: (data: VehicleTypeData) => void;
}

const VehicleType: React.FC<VehicleTypeProps> = ({ 
  formData: propFormData,
  onChange 
}) => {
  const { formData: contextFormData, updateField } = useFormContext();
  
  const combinedFormData: FormDataType = {
    ...contextFormData,
    ...propFormData
  };
  
  const [typeData, setTypeData] = useState<VehicleTypeData>({
    isAuto: false,
    isMotorcycle: false,
    isOffHighway: false,
    isTrailerCoach: false
  });

  useEffect(() => {
    const mergedData: VehicleTypeData = {
      isAuto: false,
      isMotorcycle: false,
      isOffHighway: false,
      isTrailerCoach: false,
      ...combinedFormData?.vehicleType
    };
    setTypeData(mergedData);
  }, [combinedFormData?.vehicleType]);

  const handleCheckboxChange = (field: keyof VehicleTypeData) => {
    const newValue = !typeData[field];
    
    const newData = { 
      ...typeData,
      [field]: newValue
    };    if (newValue) {
      Object.keys(newData).forEach((key) => {
        if (key !== field) {
          newData[key as keyof VehicleTypeData] = false;
        }
      });
    }    const currentVehicleInfo = combinedFormData.vehicleInformation || {};
    const vehicleInfoUpdates: Partial<VehicleInformationType> = {...currentVehicleInfo};    if (field === 'isMotorcycle' && !newValue && currentVehicleInfo.engineNumber) {
      vehicleInfoUpdates.engineNumber = '';
    }    if (field === 'isTrailerCoach' && !newValue) {
      if (currentVehicleInfo.length || currentVehicleInfo.width) {
        vehicleInfoUpdates.length = '';
        vehicleInfoUpdates.width = '';
      }
    }    if (vehicleInfoUpdates !== currentVehicleInfo) {
      updateField('vehicleInformation', vehicleInfoUpdates);
    }
    
    console.log(`Changing ${field} to:`, newValue);
    console.log("New vehicle type data:", newData);

    setTypeData(newData);
    updateField('vehicleType', newData);
    
    if (onChange) {
      onChange(newData);
    }
  };

  return (
    <div className="releaseWrapper">
      <div className="headerRow">
        <h3 className="releaseHeading">Type of Vehicle</h3>
      </div>

      <div className="checkbox-container">
        <div className="checkbox-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={typeData.isAuto || false}
              onChange={() => handleCheckboxChange('isAuto')}
            />
            Auto
          </label>
        </div>

        <div className="checkbox-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={typeData.isMotorcycle || false}
              onChange={() => handleCheckboxChange('isMotorcycle')}
            />
            Motorcycle
          </label>
        </div>

        <div className="checkbox-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={typeData.isOffHighway || false}
              onChange={() => handleCheckboxChange('isOffHighway')}
            />
            Off Highway
          </label>
        </div>

        <div className="checkbox-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={typeData.isTrailerCoach || false}
              onChange={() => handleCheckboxChange('isTrailerCoach')}
            />
            Trailer Coach
          </label>
        </div>
      </div>
    </div>
  );
};

export default VehicleType;