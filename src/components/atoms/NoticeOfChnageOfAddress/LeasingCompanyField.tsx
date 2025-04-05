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


  const capitalizeWords = (value: string): string => {
    if (!value) return '';
    

    return value.replace(/\b\w/g, (char) => char.toUpperCase());
  };


  useEffect(() => {
    if (propFormData?.checkboxOptions?.leasingCompanyName !== undefined) {
      setCompanyName(propFormData.checkboxOptions.leasingCompanyName);
    }
  }, [propFormData]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    

    const capitalizedValue = capitalizeWords(value);
    
    setCompanyName(capitalizedValue);
    

    const currentCheckboxOptions = contextFormData.checkboxOptions || {};
    

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