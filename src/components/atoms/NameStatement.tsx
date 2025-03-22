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
  const { activeScenarios, activeSubOptions } = useScenarioContext();

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
    

    const isNameCorrection = activeSubOptions['Name Change-Name Correction'] === true;
    const isLegalNameChange = activeSubOptions['Name Change-Legal Name Change'] === true;
    const isNameDiscrepancy = activeSubOptions['Name Change-Name Discrepancy'] === true;
    
    if (isNameCorrection) {
      updatedInfo = {
        ...updatedInfo,
        isNameMisspelled: true,
        isSamePerson: false,
        isChangingName: false
      };
    } else if (isLegalNameChange) {
      updatedInfo = {
        ...updatedInfo,
        isChangingName: true,
        isSamePerson: false,
        isNameMisspelled: false
      };
    } else if (isNameDiscrepancy) {
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


  const isNameCorrection = activeSubOptions['Name Change-Name Correction'] === true;
  const isLegalNameChange = activeSubOptions['Name Change-Legal Name Change'] === true;
  const isNameDiscrepancy = activeSubOptions['Name Change-Name Discrepancy'] === true;
  

  const hasSelectedSubOption = isNameCorrection || isLegalNameChange || isNameDiscrepancy;
  

  const nameChangeSelected = activeScenarios['Name Change'] === true;
  




  useEffect(() => {
    console.log('Name Change Context:', {
      'Name Change Selected': nameChangeSelected,
      'Name Correction': isNameCorrection,
      'Legal Name Change': isLegalNameChange, 
      'Name Discrepancy': isNameDiscrepancy,
      'Has Selected Sub-Option': hasSelectedSubOption
    });
    
    console.log('Active Scenarios:', activeScenarios);
    console.log('Active SubOptions:', activeSubOptions);
    console.log('Current form data:', formData.nameStatement);
  }, [activeScenarios, activeSubOptions, formData.nameStatement, nameChangeSelected, hasSelectedSubOption]);

  return (
    <div className="nameStatementWrapper">
      <h3 className="nameStatementHeading">Name Statement (Ownership Certificate Required)</h3>
      
      {/* Only render content if Name Change is selected */}
      {nameChangeSelected ? (
        hasSelectedSubOption ? (
          <>
            {/* Name Discrepancy Option - only show when selected */}
            {isNameDiscrepancy && (
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
            )}
            
            {/* Name Correction Option - only show when selected */}
            {isNameCorrection && (
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
            )}
            
            {/* Legal Name Change Option - only show when selected */}
            {isLegalNameChange && (
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
            )}
          </>
        ) : (
          <div className="nameStatementOption">
            <p>Please select a specific Name Change option from the transaction menu.</p>
          </div>
        )
      ) : (
        <div className="nameStatementOption">
          <p>Please select a Name Change option from the transaction menu.</p>
        </div>
      )}
    </div>
  );
};

export default NameStatement;