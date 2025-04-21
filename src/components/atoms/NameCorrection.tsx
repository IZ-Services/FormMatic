'use client';
import React, { useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './NameStatement.css';

interface NameStatementType {
  isSamePerson: boolean;
  samePerson?: {
    firstPerson: string;
    secondPerson: string;
  };
  isNameMisspelled: boolean;
  misspelledNameCorrection?: string;
  isChangingName: boolean;
  nameChange?: {
    fromName: string;
    toName: string;
  };
}

const initialNameStatement: NameStatementType = {
  isSamePerson: false,
  samePerson: {
    firstPerson: '',
    secondPerson: '',
  },
  isNameMisspelled: true,
  misspelledNameCorrection: '',
  isChangingName: false,
  nameChange: {
    fromName: '',
    toName: '',
  },
};

const NameCorrection: React.FC = () => {
  const { formData, updateField } = useFormContext();
  

  useEffect(() => {
    if (!formData.nameStatement) {
      updateField('nameStatement', initialNameStatement);
    } else if (!(formData.nameStatement as NameStatementType).isNameMisspelled) {

      updateField('nameStatement', {
        ...formData.nameStatement,
        isNameMisspelled: true,
        isSamePerson: false,
        isChangingName: false
      });
    }
  }, []);
  
  const handleCheckboxChange = (value: boolean) => {
    const currentInfo = (formData.nameStatement || initialNameStatement) as NameStatementType;
    updateField('nameStatement', { 
      ...currentInfo, 
      isNameMisspelled: value,
      isSamePerson: false,
      isChangingName: false
    });
  };
  
  const handleMisspelledNameChange = (value: string) => {
    const currentInfo = (formData.nameStatement || initialNameStatement) as NameStatementType;
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    updateField('nameStatement', { ...currentInfo, misspelledNameCorrection: capitalizedValue });
  };
  

  const nameStatement = (formData.nameStatement as NameStatementType) || initialNameStatement;
  const isNameMisspelled = nameStatement.isNameMisspelled;
  const misspelledNameCorrection = nameStatement.misspelledNameCorrection || '';
  
  return (
    <div className="nameStatementWrapper">
      <h3 className="nameStatementHeading">Name Statement (Ownership Certificate Required)</h3>
      <div className="nameStatementOption">
        <label className="nameStatementCheckboxLabel">
          <input
            type="checkbox"
            checked={isNameMisspelled}
            onChange={(e) => handleCheckboxChange(e.target.checked)}
            className="nameStatementCheckboxInput"
            data-testid="name-statement-misspelled"
          />
          <span className="nameStatementText">My name is misspelled. Please correct it to:</span>
        </label>
        <input
          className="nameStatementInput misspelledNameInput"
          type="text"
          placeholder=""
          value={misspelledNameCorrection}
          onChange={(e) => handleMisspelledNameChange(e.target.value)}
          disabled={!isNameMisspelled}
          data-testid="name-statement-correction"
        />
      </div>
    </div>
  );
};

export default NameCorrection;