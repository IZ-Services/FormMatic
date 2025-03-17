'use client';
import React, { useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { useScenarioContext } from '../../context/ScenarioContext';
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
  const { activeSubOptions } = useScenarioContext();

  const formData = {
    ...contextFormData,
    ...propFormData
  };

  useEffect(() => {
    if (!formData.nameStatement) {
      updateField('nameStatement', initialNameStatement);
    }
  }, []);

 
  useEffect(() => {
    const currentInfo = (formData.nameStatement || initialNameStatement) as NameStatementType;
    let updatedInfo = { ...currentInfo };
    
 
    if (activeSubOptions['Name Correction']) {
      updatedInfo = {
        ...updatedInfo,
        isNameMisspelled: true,
        isSamePerson: false,
        isChangingName: false
      };
    } else if (activeSubOptions['Legal Name Change']) {
      updatedInfo = {
        ...updatedInfo,
        isChangingName: true,
        isSamePerson: false,
        isNameMisspelled: false
      };
    } else if (activeSubOptions['Name Discrepancy']) {
      updatedInfo = {
        ...updatedInfo,
        isSamePerson: true,
        isNameMisspelled: false,
        isChangingName: false
      };
    }
    
 
    if (JSON.stringify(updatedInfo) !== JSON.stringify(currentInfo)) {
      updateField('nameStatement', updatedInfo);
    }
  }, [activeSubOptions, formData.nameStatement]);

  const handleCheckboxChange = (field: keyof NameStatementType, value: boolean) => {
    const currentInfo = (formData.nameStatement || {}) as NameStatementType;
    
 
    if (value) {
      const updatedInfo = {
        ...currentInfo,
        isSamePerson: field === 'isSamePerson' ? true : false,
        isNameMisspelled: field === 'isNameMisspelled' ? true : false,
        isChangingName: field === 'isChangingName' ? true : false
      };
      updateField('nameStatement', updatedInfo);
    } else {
 
      updateField('nameStatement', { ...currentInfo, [field]: value });
    }
  };

  const handleSamePersonChange = (field: 'firstPerson' | 'secondPerson', value: string) => {
    const currentInfo = (formData.nameStatement || {}) as NameStatementType;
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

  const handleNameChangeChange = (field: 'fromName' | 'toName', value: string) => {
    const currentInfo = (formData.nameStatement || {}) as NameStatementType;
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

  const handleMisspelledNameChange = (value: string) => {
    const currentInfo = (formData.nameStatement || {}) as NameStatementType;
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    
    updateField('nameStatement', { ...currentInfo, misspelledNameCorrection: capitalizedValue });
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
            data-testid="name-statement-same-person"
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
          data-testid="name-statement-first-person"
        />
        <span className="nameStatementText">and</span>
        <input
          className="nameStatementInput secondPersonInput"
          type="text"
          placeholder=""
          value={(formData.nameStatement as NameStatementType)?.samePerson?.secondPerson || ''}
          onChange={(e) => handleSamePersonChange('secondPerson', e.target.value)}
          disabled={!(formData.nameStatement as NameStatementType)?.isSamePerson}
          data-testid="name-statement-second-person"
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
            data-testid="name-statement-misspelled"
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
          data-testid="name-statement-correction"
        />
      </div>
      
      <div className="nameStatementOption">
        <label className="nameStatementCheckboxLabel">
          <input
            type="checkbox"
            checked={(formData.nameStatement as NameStatementType)?.isChangingName || false}
            onChange={(e) => handleCheckboxChange('isChangingName', e.target.checked)}
            className="nameStatementCheckboxInput"
            data-testid="name-statement-changing"
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
          data-testid="name-statement-from-name"
        />
        <span className="nameStatementText">to</span>
        <input
          className="nameStatementInput toNameInput"
          type="text"
          placeholder=""
          value={(formData.nameStatement as NameStatementType)?.nameChange?.toName || ''}
          onChange={(e) => handleNameChangeChange('toName', e.target.value)}
          disabled={!(formData.nameStatement as NameStatementType)?.isChangingName}
          data-testid="name-statement-to-name"
        />
      </div>
    </div>
  );
};

export default NameStatement;