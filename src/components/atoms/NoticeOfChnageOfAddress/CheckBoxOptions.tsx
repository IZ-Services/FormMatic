import React, { useEffect, useState } from 'react';
import { useFormContext } from '../../../app/api/formDataContext/formDataContextProvider';
import '../Checkboxes.css';
import LeasingCompanyField from './LeasingCompanyField';

interface CheckboxState {
  leasedVehicle: boolean;
  notUsCitizen: boolean;
  doNotUseForVoterRegistration: boolean;
  leasingCompanyName?: string;
}

interface CheckboxOptionsProps {
  formData?: {
    checkboxOptions?: CheckboxState;
  };
}

const initialCheckboxState: CheckboxState = {
  leasedVehicle: false,
  notUsCitizen: false,
  doNotUseForVoterRegistration: false,
  leasingCompanyName: ''
};

const CheckboxOptions: React.FC<CheckboxOptionsProps> = ({ formData: propFormData }) => {
  const { formData: contextFormData, updateField } = useFormContext();
  const [checkboxes, setCheckboxes] = useState<CheckboxState>(
    propFormData?.checkboxOptions || (contextFormData?.checkboxOptions as CheckboxState) || initialCheckboxState
  );
  

  useEffect(() => {
    if (!contextFormData?.checkboxOptions) {
      updateField('checkboxOptions', initialCheckboxState);
    }
  }, []);
  

  useEffect(() => {
    const currentData = propFormData?.checkboxOptions || contextFormData?.checkboxOptions;
    if (currentData) {
      setCheckboxes(currentData as CheckboxState);
    }
  }, [propFormData, contextFormData?.checkboxOptions]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    
    const updatedCheckboxes = {
      ...checkboxes,
      [name]: checked
    };
    
    setCheckboxes(updatedCheckboxes);
    updateField('checkboxOptions', updatedCheckboxes);
  };

  const handleLeasingCompanyNameChange = (value: string) => {
    const updatedCheckboxes = {
      ...checkboxes,
      leasingCompanyName: value
    };
    
    setCheckboxes(updatedCheckboxes);
    updateField('checkboxOptions', updatedCheckboxes);
  };
  
  const clearForm = () => {
    setCheckboxes(initialCheckboxState);
    updateField('checkboxOptions', initialCheckboxState);
  };

  return (
    <div className="releaseWrapper">
      <div className="headerRow">
        <h3 className="releaseHeading">Transaction Details</h3>
      
      </div>

      <div className="checkbox-options-container">
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="leasedVehicle"
              checked={checkboxes.leasedVehicle}
              onChange={handleCheckboxChange}
              className="checkbox-input"
            />
            <span className="checkbox-text">Leased Vehicle</span>
          </label>
          
          {/* Note: LeasingCompanyField is commented out per the original code.
              If you want to restore it, you'll need to add it back with the correct props. */}
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="notUsCitizen"
              checked={checkboxes.notUsCitizen}
              onChange={handleCheckboxChange}
              className="checkbox-input"
            />
            <span className="checkbox-text">Not a United States Citizen</span>
          </label>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="doNotUseForVoterRegistration"
              checked={checkboxes.doNotUseForVoterRegistration}
              onChange={handleCheckboxChange}
              className="checkbox-input"
            />
            <span className="checkbox-text">Do not use my new address for voter registration purposes</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CheckboxOptions;