import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './CitizenshipQuestion.css';

interface CitizenshipData {
  isUsCitizen?: boolean;
}

interface CitizenshipQuestionProps {
  formData?: {
    citizenship?: CitizenshipData;
  };
  onChange?: (data: CitizenshipData) => void;
}

const CitizenshipQuestion: React.FC<CitizenshipQuestionProps> = ({ 
  formData: propFormData,
  onChange 
}) => {
  const { formData: contextFormData, updateField } = useFormContext();
  
  const combinedFormData = {
    ...contextFormData,
    ...propFormData
  };
  
  const [citizenshipData, setCitizenshipData] = useState<CitizenshipData>({
    isUsCitizen: undefined
  });

  useEffect(() => {
    const mergedData: CitizenshipData = {
      ...combinedFormData?.citizenship
    };
    setCitizenshipData(mergedData);
  }, [combinedFormData?.citizenship]);

  const handleRadioChange = (value: boolean) => {
    const newData: CitizenshipData = { 
      isUsCitizen: value 
    };
    
    console.log('Setting citizenship status to:', value);
    
    setCitizenshipData(newData);
    updateField('citizenship', newData);
    
    if (onChange) {
      onChange(newData);
    }
  };

  return (
    <div className="citizenship-wrapper">
      <div className="citizenship-question">
        <span className="question-text">Are you a United States citizen?</span>
        <div className="radio-options">
          <label className="radio-label">
            <input
              type="radio"
              name="citizenship"
              checked={citizenshipData.isUsCitizen === true}
              onChange={() => handleRadioChange(true)}
              data-testid="citizenship-yes"
            />
            <span>Yes</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="citizenship"
              checked={citizenshipData.isUsCitizen === false}
              onChange={() => handleRadioChange(false)}
              data-testid="citizenship-no"
            />
            <span>No</span>
          </label>
        </div>
      </div>
      {citizenshipData.isUsCitizen === false && (
        <div className="citizenship-note">
          If you answered "No," you cannot register to vote. Skip to Section 10.
        </div>
      )}
    </div>
  );
};

export default CitizenshipQuestion;