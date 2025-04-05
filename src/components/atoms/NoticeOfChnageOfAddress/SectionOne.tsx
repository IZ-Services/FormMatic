import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../../app/api/formDataContext/formDataContextProvider';
import './SectionOne.css';

interface SectionOneData {
  lastName?: string;
  firstName?: string;
  initial?: string;
  birthDate?: string;
  driverLicenseId?: string;
}

interface SectionOneProps {
  formData?: {
    personalBusinessInfo?: SectionOneData;
  };
}

const initialSectionOneData: SectionOneData = {
  lastName: '',
  firstName: '',
  initial: '',
  birthDate: '',
  driverLicenseId: ''
};

const SectionOne: React.FC<SectionOneProps> = ({ formData: propFormData }) => {
  const [formState, setFormState] = useState<SectionOneData>(
    propFormData?.personalBusinessInfo || initialSectionOneData
  );
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const { updateField } = useFormContext();

  useEffect(() => {
    if (propFormData?.personalBusinessInfo) {
      setFormState(propFormData.personalBusinessInfo);
    }
  }, [propFormData]);

  const capitalizeFirstLetter = (value: string): string => {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const handleInputChange = (field: keyof SectionOneData, value: string) => {
    const capitalizedValue = capitalizeFirstLetter(value);
    
    let hasError = false;
    if (field === 'lastName' && value.length > 20) {
      hasError = true;
    } else if (field === 'firstName' && value.length > 9) {
      hasError = true;
    } else if (field === 'driverLicenseId' && value.length > 0 && value.length < 8) {

      hasError = true;
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: hasError
    }));
    
    const newData = { 
      ...formState, 
      [field]: capitalizedValue 
    };
    setFormState(newData);
    updateField('personalBusinessInfo', newData);
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + '/' + value.slice(5);
    }
    value = value.slice(0, 10);

    handleInputChange('birthDate', value);
  };

  return (
    <div className="section-one-container">
      <div className="section-header">
        <span className="section-title">PERSONAL OR BUSINESS INFORMATION</span>
      </div>

      <div className="formcontent">
        {/* Name row with last, first, initial */}
        <div className="name-row">
        <div className="input-group first-name">
            <label className="input-label">FIRST</label>
            <input
              type="text"
              className={`standard-input ${errors.firstName ? 'input-error' : ''}`}
              value={formState.firstName || ''}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              maxLength={9}
            />
            {errors.firstName && <div className="error-message">Maximum 9 characters</div>}
          </div>
          <div className="input-group last-name">
            <label className="input-label">LAST NAME OR BUSINESS NAME</label>
            <input
              type="text"
              className={`standard-input ${errors.lastName ? 'input-error' : ''}`}
              value={formState.lastName || ''}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              maxLength={20}
            />
            {errors.lastName && <div className="error-message">Maximum 20 characters</div>}
          </div>

         

          <div className="input-group initial">
            <label className="input-label">INITIAL</label>
            <input
              type="text"
              className="standard-input initial-input"
              value={formState.initial || ''}
              onChange={(e) => handleInputChange('initial', e.target.value)}
              maxLength={1}
            />
          </div>
        </div>

        {/* ID row with birth date and driver license */}
        <div className="id-row">
          <div className="input-group birth-date">
            <label className="input-label">BIRTH DATE (FOR DL/ID CHANGE OF ADDRESS ONLY)</label>
            <input
              type="text"
              className="standard-input"
              placeholder="MM/DD/YYYY"
              value={formState.birthDate || ''}
              onChange={handleBirthDateChange}
              maxLength={10}
            />
          </div>

          <div className="input-group driver-license">
            <label className="input-label">DRIVER LICENSE/ID (FOR DL/ID CHANGE OF ADDRESS ONLY)</label>
            <input
              type="text"
              className={`standard-input ${errors.driverLicenseId ? 'input-error' : ''}`}
              value={formState.driverLicenseId || ''}
              onChange={(e) => handleInputChange('driverLicenseId', e.target.value)}
              maxLength={8}
            />
            {errors.driverLicenseId && <div className="error-message">Must be exactly 8 characters</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionOne;