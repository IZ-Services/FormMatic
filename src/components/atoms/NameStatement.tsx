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

interface NameStatementProps {
  formData?: {
    nameStatement?: NameStatementType;
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
  isChangingName: false,
  nameChange: {
    fromName: '',
    toName: '',
  },
};

const NameStatement: React.FC<NameStatementProps> = ({ formData: propFormData }) => {
  const { formData: contextFormData, updateField } = useFormContext();

  const formData = {
    ...contextFormData,
    ...propFormData
  };

  useEffect(() => {
    if (!formData.nameStatement) {
      updateField('nameStatement', initialNameStatement);
    }
  }, []);

  const handleCheckboxChange = (field: keyof NameStatementType, value: boolean) => {
    const currentInfo = (formData.nameStatement || {}) as NameStatementType;
    updateField('nameStatement', { ...currentInfo, [field]: value });
  };

  const handleSamePersonChange = (field: 'firstPerson' | 'secondPerson', value: string) => {
    const currentInfo = (formData.nameStatement || {}) as NameStatementType;
    const currentSamePerson = currentInfo.samePerson || { firstPerson: '', secondPerson: '' };
    
    updateField('nameStatement', { 
      ...currentInfo, 
      samePerson: { 
        ...currentSamePerson, 
        [field]: value 
      } 
    });
  };

  const handleNameChangeChange = (field: 'fromName' | 'toName', value: string) => {
    const currentInfo = (formData.nameStatement || {}) as NameStatementType;
    const currentNameChange = currentInfo.nameChange || { fromName: '', toName: '' };
    
    updateField('nameStatement', { 
      ...currentInfo, 
      nameChange: { 
        ...currentNameChange, 
        [field]: value 
      } 
    });
  };

  const handleMisspelledNameChange = (value: string) => {
    const currentInfo = (formData.nameStatement || {}) as NameStatementType;
    updateField('nameStatement', { ...currentInfo, misspelledNameCorrection: value });
  };

  return (
    <div className="nameStatementWrapper">
      <h3 className="nameStatementHeading">Name Statement (Ownership Certificate Required)</h3>
      
      <div className="nameStatementOption">
        <label className="nameStatementCheckboxLabel">
          <input
            type="checkbox"
            checked={(formData.nameStatement as NameStatementType)?.isSamePerson || false}
            onChange={(e) => handleCheckboxChange('isSamePerson', e.target.checked)}
            className="nameStatementCheckboxInput"
          />
          <span className="nameStatementText">I,</span>
        </label>
        <input
          className="nameStatementInput firstPersonInput"
          type="text"
          placeholder=""
          value={(formData.nameStatement as NameStatementType)?.samePerson?.firstPerson || ''}
          onChange={(e) => handleSamePersonChange('firstPerson', e.target.value)}
          disabled={!(formData.nameStatement as NameStatementType)?.isSamePerson}
        />
        <span className="nameStatementText">and</span>
        <input
          className="nameStatementInput secondPersonInput"
          type="text"
          placeholder=""
          value={(formData.nameStatement as NameStatementType)?.samePerson?.secondPerson || ''}
          onChange={(e) => handleSamePersonChange('secondPerson', e.target.value)}
          disabled={!(formData.nameStatement as NameStatementType)?.isSamePerson}
        />
        <span className="nameStatementText">are one and the same person.</span>
      </div>
      
      <div className="nameStatementOption">
        <label className="nameStatementCheckboxLabel">
          <input
            type="checkbox"
            checked={(formData.nameStatement as NameStatementType)?.isNameMisspelled || false}
            onChange={(e) => handleCheckboxChange('isNameMisspelled', e.target.checked)}
            className="nameStatementCheckboxInput"
          />
          <span className="nameStatementText">My name is misspelled. Please correct it to:</span>
        </label>
        <input
          className="nameStatementInput misspelledNameInput"
          type="text"
          placeholder=""
          value={(formData.nameStatement as NameStatementType)?.misspelledNameCorrection || ''}
          onChange={(e) => handleMisspelledNameChange(e.target.value)}
          disabled={!(formData.nameStatement as NameStatementType)?.isNameMisspelled}
        />
      </div>
      
      <div className="nameStatementOption">
        <label className="nameStatementCheckboxLabel">
          <input
            type="checkbox"
            checked={(formData.nameStatement as NameStatementType)?.isChangingName || false}
            onChange={(e) => handleCheckboxChange('isChangingName', e.target.checked)}
            className="nameStatementCheckboxInput"
          />
          <span className="nameStatementText">I am changing my name from</span>
        </label>
        <input
          className="nameStatementInput fromNameInput"
          type="text"
          placeholder=""
          value={(formData.nameStatement as NameStatementType)?.nameChange?.fromName || ''}
          onChange={(e) => handleNameChangeChange('fromName', e.target.value)}
          disabled={!(formData.nameStatement as NameStatementType)?.isChangingName}
        />
        <span className="nameStatementText">to</span>
        <input
          className="nameStatementInput toNameInput"
          type="text"
          placeholder=""
          value={(formData.nameStatement as NameStatementType)?.nameChange?.toName || ''}
          onChange={(e) => handleNameChangeChange('toName', e.target.value)}
          disabled={!(formData.nameStatement as NameStatementType)?.isChangingName}
        />
      </div>
    </div>
  );
};

export default NameStatement;