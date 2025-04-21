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
  isSamePerson: true,
  samePerson: {
    firstPerson: '',
    secondPerson: '',
  },
  isNameMisspelled: false,
  misspelledNameCorrection: '',
  isChangingName: false,
  nameChange: {
    fromName: '',
    toName: '',
  },
};

const NameDiscrepancy: React.FC = () => {
  const { formData, updateField } = useFormContext();
  
  // Initialize form data if needed
  useEffect(() => {
    if (!formData.nameStatement) {
      updateField('nameStatement', initialNameStatement);
    } else if (!(formData.nameStatement as NameStatementType).isSamePerson) {
      // Make sure the correct checkbox is checked when component mounts
      updateField('nameStatement', {
        ...formData.nameStatement,
        isSamePerson: true,
        isNameMisspelled: false,
        isChangingName: false
      });
    }
  }, []);
  
  const handleCheckboxChange = (value: boolean) => {
    const currentInfo = (formData.nameStatement || initialNameStatement) as NameStatementType;
    updateField('nameStatement', { 
      ...currentInfo, 
      isSamePerson: value,
      isNameMisspelled: false,
      isChangingName: false
    });
  };
  
  const handlePersonChange = (field: 'firstPerson' | 'secondPerson', value: string) => {
    const currentInfo = (formData.nameStatement || initialNameStatement) as NameStatementType;
    const currentSamePerson = currentInfo.samePerson || { firstPerson: '', secondPerson: '' };
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    
    updateField('nameStatement', { 
      ...currentInfo, 
      samePerson: { 
        ...currentSamePerson, 
        [field]: capitalizedValue 
      } 
    });
  };
  
  // Handle the TypeScript error by properly typing nameStatement
  const nameStatement = (formData.nameStatement as NameStatementType) || initialNameStatement;
  const isSamePerson = nameStatement.isSamePerson;
  const firstPerson = nameStatement.samePerson?.firstPerson || '';
  const secondPerson = nameStatement.samePerson?.secondPerson || '';
  
  return (
    <div className="nameStatementWrapper">
      <h3 className="nameStatementHeading">Name Statement (Ownership Certificate Required)</h3>
      <div className="nameStatementOption">
        <label className="nameStatementCheckboxLabel">
          <input
            type="checkbox"
            checked={isSamePerson}
            onChange={(e) => handleCheckboxChange(e.target.checked)}
            className="nameStatementCheckboxInput"
            data-testid="name-statement-same-person"
          />
          <span className="nameStatementText">I,</span>
        </label>
        <input
          className="nameStatementInput firstPersonInput"
          type="text"
          placeholder=""
          value={firstPerson}
          onChange={(e) => handlePersonChange('firstPerson', e.target.value)}
          disabled={!isSamePerson}
          data-testid="name-statement-first-person"
        />
        <span className="nameStatementText">and</span>
        <input
          className="nameStatementInput secondPersonInput"
          type="text"
          placeholder=""
          value={secondPerson}
          onChange={(e) => handlePersonChange('secondPerson', e.target.value)}
          disabled={!isSamePerson}
          data-testid="name-statement-second-person"
        />
        <span className="nameStatementText">are one and the same person.</span>
      </div>
    </div>
  );
};

export default NameDiscrepancy;