import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../../app/api/formDataContext/formDataContextProvider';
import './LeasingCompanyField.css';

interface LeasingCompanyFieldProps {
  formData?: {
    checkboxOptions?: {
      leasingCompanyName?: string;
    };
  };
}

const LeasingCompanyField: React.FC<LeasingCompanyFieldProps> = ({ formData: propFormData }) => {
  const [companyName, setCompanyName] = useState<string>(
    propFormData?.checkboxOptions?.leasingCompanyName || ''
  );
  const { updateField, formData: contextFormData } = useFormContext();

  // Function to capitalize the first letter of each word
  const capitalizeWords = (value: string): string => {
    if (!value) return '';
    
    // Split the string by spaces and other word boundaries and capitalize the first letter of each word
    return value.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Update local state when form data changes
  useEffect(() => {
    if (propFormData?.checkboxOptions?.leasingCompanyName !== undefined) {
      setCompanyName(propFormData.checkboxOptions.leasingCompanyName);
    }
  }, [propFormData]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Capitalize the first letter of each word
    const capitalizedValue = capitalizeWords(value);
    
    setCompanyName(capitalizedValue);
    
    // Get current checkbox options from context
    const currentCheckboxOptions = contextFormData.checkboxOptions || {};
    
    // Update the form context with the new leasing company name
    updateField('checkboxOptions', {
      ...currentCheckboxOptions,
      leasingCompanyName: capitalizedValue
    });
  };

  return (
    <div className="leasing-company-container">
      <div className="newRegFormItem">
        <label className="formLabel">LEASING COMPANY'S NAME</label>
        <input
          type="text"
          className="formInput"
          value={companyName}
          onChange={handleInputChange}
          maxLength={30}
        />
      </div>
    </div>
  );
};

export default LeasingCompanyField;