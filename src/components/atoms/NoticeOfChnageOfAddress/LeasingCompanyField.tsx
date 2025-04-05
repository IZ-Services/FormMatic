import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../../app/api/formDataContext/formDataContextProvider';
import './LeasingCompanyField.css';

interface LeasingCompanyFieldProps {
  value?: string;
  onChange?: (value: string) => void;
}

const LeasingCompanyField: React.FC<LeasingCompanyFieldProps> = ({ 
  value = '', 
  onChange 
}) => {
  const [companyName, setCompanyName] = useState<string>(value);
  const { updateField, formData: contextFormData } = useFormContext();

  // Function to capitalize the first letter of each word
  const capitalizeWords = (value: string): string => {
    if (!value) return '';
    
    // Split the string by spaces and other word boundaries and capitalize the first letter of each word
    return value.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Update local state when prop value changes
  useEffect(() => {
    setCompanyName(value);
  }, [value]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Capitalize the first letter of each word
    const capitalizedValue = capitalizeWords(newValue);
    
    setCompanyName(capitalizedValue);
    
    // Call the onChange handler if provided
    if (onChange) {
      onChange(capitalizedValue);
    } else {
      // Fallback to using context if no onChange prop is provided
      const currentCheckboxOptions = contextFormData.checkboxOptions || {};
      
      updateField('checkboxOptions', {
        ...currentCheckboxOptions,
        leasingCompanyName: capitalizedValue
      });
    }
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
          placeholder="Enter leasing company name"
        />
      </div>
    </div>
  );
};

export default LeasingCompanyField;