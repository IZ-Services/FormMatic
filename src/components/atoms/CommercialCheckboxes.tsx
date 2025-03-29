import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './Checkboxes.css';

interface CommercialVehicleData {
  isBus?: boolean;
  isLimo?: boolean;
  isTaxi?: boolean;
}

interface FormDataType {
  commercialVehicle?: CommercialVehicleData;
  [key: string]: any;
}

interface CommercialCheckboxesProps {
  formData?: FormDataType;
  onChange?: (data: CommercialVehicleData) => void;
}

const CommercialCheckboxes: React.FC<CommercialCheckboxesProps> = ({ 
  formData: propFormData,
  onChange 
}) => {
  const { formData: contextFormData, updateField } = useFormContext();
  
  const combinedFormData: FormDataType = {
    ...contextFormData,
    ...propFormData
  };
  
  const [commercialData, setCommercialData] = useState<CommercialVehicleData>({
    isBus: false,
    isLimo: false,
    isTaxi: false
  });

  useEffect(() => {
    const mergedData: CommercialVehicleData = {
      isBus: false,
      isLimo: false,
      isTaxi: false,
      ...combinedFormData?.commercialVehicle
    };
    setCommercialData(mergedData);
  }, [combinedFormData?.commercialVehicle]);

  const handleCheckboxChange = (field: keyof CommercialVehicleData) => {
    const newValue = !commercialData[field];
    
    const newData = { 
      ...commercialData,
      [field]: newValue
    };
    

    if (newValue) {
      Object.keys(newData).forEach((key) => {
        if (key !== field) {
          newData[key as keyof CommercialVehicleData] = false;
        }
      });
    }
    
    console.log(`Changing ${field} to:`, newValue);
    console.log("New commercial vehicle data:", newData);

    setCommercialData(newData);
    updateField('commercialVehicle', newData);
    
    if (onChange) {
      onChange(newData);
    }
  };

  return (
    <div className="releaseWrapper">
      <div className="headerRow">
        <h3 className="releaseHeading">Transaction Details</h3>
      </div>

      <div className="checkboxes">
        <div className="checkbox-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={commercialData.isBus || false}
              onChange={() => handleCheckboxChange('isBus')}
            />
            Bus
          </label>
        </div>

        <div className="checkbox-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={commercialData.isLimo || false}
              onChange={() => handleCheckboxChange('isLimo')}
            />
            Limousine
          </label>
        </div>

        <div className="checkbox-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={commercialData.isTaxi || false}
              onChange={() => handleCheckboxChange('isTaxi')}
            />
            Taxi
          </label>
        </div>
      </div>
    </div>
  );
};

export default CommercialCheckboxes;