import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './Checkboxes.css';

interface VoterAddressUpdateData {
  doNotUpdateVoterRegistration?: boolean;
}

interface VoterAddressUpdateProps {
  formData?: {
    voterAddressUpdate?: VoterAddressUpdateData;
  };
  onChange?: (data: VoterAddressUpdateData) => void;
}

const VoterAddressUpdate: React.FC<VoterAddressUpdateProps> = ({ 
  formData: propFormData,
  onChange 
}) => {
  const { formData: contextFormData, updateField } = useFormContext();
  
  const combinedFormData = {
    ...contextFormData,
    ...propFormData
  };
  
  const [voterAddressUpdateData, setVoterAddressUpdateData] = useState<VoterAddressUpdateData>({
    doNotUpdateVoterRegistration: false
  });

  useEffect(() => {
    const mergedData: VoterAddressUpdateData = {
      doNotUpdateVoterRegistration: false,
      ...combinedFormData?.voterAddressUpdate
    };
    setVoterAddressUpdateData(mergedData);
  }, [combinedFormData?.voterAddressUpdate]);

  const handleCheckboxChange = () => {
    const newValue = !voterAddressUpdateData.doNotUpdateVoterRegistration;
    
    const newData = { 
      doNotUpdateVoterRegistration: newValue
    };

    console.log('Changing do not update voter registration to:', newValue);
    console.log("New voter address update data:", newData);

    setVoterAddressUpdateData(newData);
    updateField('voterAddressUpdate', newData);
    
    if (onChange) {
      onChange(newData);
    }
  };

  return (
    <div className="releaseWrapper">
      <div className="headerRow">
        <h3 className="releaseHeading">Voter Address Update</h3>
      </div>

      <div className="checkbox-container">
        <div className="checkbox-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={voterAddressUpdateData.doNotUpdateVoterRegistration || false}
              onChange={handleCheckboxChange}
            />
            Do not use my new address for voter registration purposes
          </label>
        </div>
      </div>
    </div>
  );
};

export default VoterAddressUpdate;