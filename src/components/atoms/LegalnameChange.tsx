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
  isNameMisspelled: false,
  misspelledNameCorrection: '',
  isChangingName: true,
  nameChange: {
    fromName: '',
    toName: '',
  },
};

const LegalNameChange: React.FC = () => {
  const { formData, updateField } = useFormContext();
  
  // Initialize form data if needed
  useEffect(() => {
    if (!formData.nameStatement) {
      updateField('nameStatement', initialNameStatement);
    } else if (!(formData.nameStatement as NameStatementType).isChangingName) {
      // Make sure the correct checkbox is checked when component mounts
      updateField('nameStatement', {
        ...formData.nameStatement,
        isChangingName: true,
        isSamePerson: false,
        isNameMisspelled: false
      });
    }
  }, []);
  
  const handleCheckboxChange = (value: boolean) => {
    const currentInfo = (formData.nameStatement || initialNameStatement) as NameStatementType;
    updateField('nameStatement', { 
      ...currentInfo, 
      isChangingName: value,
      isSamePerson: false,
      isNameMisspelled: false
    });
  };
  
  const handleNameChange = (field: 'fromName' | 'toName', value: string) => {
    const currentInfo = (formData.nameStatement || initialNameStatement) as NameStatementType;
    const currentNameChange = currentInfo.nameChange || { fromName: '', toName: '' };
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    
    updateField('nameStatement', { 
      ...currentInfo, 
      nameChange: { 
        ...currentNameChange, 
        [field]: capitalizedValue 
      } 
    });
  };
  
  // Handle the TypeScript error by properly typing nameStatement
  const nameStatement = (formData.nameStatement as NameStatementType) || initialNameStatement;
  const isChangingName = nameStatement.isChangingName;
  const fromName = nameStatement.nameChange?.fromName || '';
  const toName = nameStatement.nameChange?.toName || '';
  
  return (
    <div className="nameStatementWrapper">
      <h3 className="nameStatementHeading">Name Statement (Ownership Certificate Required)</h3>
      <div className="nameStatementOption">
        <label className="nameStatementCheckboxLabel">
          <input
            type="checkbox"
            checked={isChangingName}
            onChange={(e) => handleCheckboxChange(e.target.checked)}
            className="nameStatementCheckboxInput"
            data-testid="name-statement-changing"
          />
          <span className="nameStatementText">I am changing my name from</span>
        </label>
        <input
          className="nameStatementInput fromNameInput"
          type="text"
          placeholder=""
          value={fromName}
          onChange={(e) => handleNameChange('fromName', e.target.value)}
          disabled={!isChangingName}
          data-testid="name-statement-from-name"
        />
        <span className="nameStatementText">to</span>
        <input
          className="nameStatementInput toNameInput"
          type="text"
          placeholder=""
          value={toName}
          onChange={(e) => handleNameChange('toName', e.target.value)}
          disabled={!isChangingName}
          data-testid="name-statement-to-name"
        />
      </div>
    </div>
  );
};

export default LegalNameChange;