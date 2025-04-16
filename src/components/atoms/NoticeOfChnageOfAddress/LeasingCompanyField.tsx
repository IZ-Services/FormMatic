import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../../app/api/formDataContext/formDataContextProvider';
import './LeasingCompanyField.css';

interface LeasingCompanyFieldProps {
  leasingCompanyName: string;
  onLeasingCompanyNameChange: (value: string) => void;
}

const LeasingCompanyField: React.FC<LeasingCompanyFieldProps> = ({ 
  leasingCompanyName, 
  onLeasingCompanyNameChange 
}) => {
  const [companyName, setCompanyName] = useState<string>(leasingCompanyName || '');
  const { formData: contextFormData } = useFormContext();

  // Sync the local state with the prop value when it changes
  useEffect(() => {
    if (leasingCompanyName !== undefined) {
      setCompanyName(leasingCompanyName);
    }
  }, [leasingCompanyName]);

  // Log for debugging purposes (optional)
  useEffect(() => {
    console.log('Current LeasingCompanyField value:', companyName);
  }, [companyName]);

  const capitalizeWords = (value: string): string => {
    if (!value) return '';
    return value.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const capitalizedValue = capitalizeWords(value);
    
    setCompanyName(capitalizedValue);
    onLeasingCompanyNameChange(capitalizedValue);
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