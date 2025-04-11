import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './Checkboxes.css';

interface CommercialVehicleData {
  isCommercial: boolean;
  isBus: boolean;
  isLimo: boolean;
  isTaxi: boolean;
  hasLienHolder: boolean; 
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
    isCommercial: false,
    isBus: false,
    isLimo: false,
    isTaxi: false,
    hasLienHolder: false 
  });

  useEffect(() => {
    const mergedData: CommercialVehicleData = {
      isCommercial: false,
      isBus: false,
      isLimo: false,
      isTaxi: false,
      hasLienHolder: false, 
      ...combinedFormData?.commercialVehicle
    };
    
 
    if (!mergedData.isCommercial) {
      mergedData.isCommercial = mergedData.isBus || mergedData.isLimo || mergedData.isTaxi;
    }
    
    setCommercialData(mergedData);
  }, [combinedFormData?.commercialVehicle]);

  const handleCommercialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    
    const newData = { 
      ...commercialData,
      isCommercial: isChecked,
 
      isBus: isChecked,
      isLimo: false,
      isTaxi: false
    };
    
    console.log("Commercial checkbox changed to:", isChecked);
    console.log("New commercial vehicle data:", newData);
    console.log("Adding Reg590 form for commercial vehicle type: Bus");

    setCommercialData(newData);
    updateField('commercialVehicle', newData);
    
    if (onChange) {
      onChange(newData);
    }
  };

  const handleLienHolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    
    const newData = { 
      ...commercialData,
      hasLienHolder: isChecked
    };
    
    console.log("Lien holder checkbox changed to:", isChecked);
    console.log("Updated vehicle data:", newData);

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
              checked={commercialData.isCommercial}
              onChange={handleCommercialChange}
            />
            Commercial Vehicle (Bus/Limo/Taxi)
          </label>
        </div>
        
        <div className="checkbox-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={commercialData.hasLienHolder}
              onChange={handleLienHolderChange}
            />
            Current Lien Holder
          </label>
        </div>
      </div>
    </div>
  );
};

export default CommercialCheckboxes;