'use client';
import React, { useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './PlateSelection.css';

interface PlateSelectionType {
  plateType: string;
  plateCategory: string;
  organizationalCode: string;
  duplicateDecalNumber: string;
}

interface PlateSelectionProps {
  formData?: {
    plateSelection?: PlateSelectionType;
  };
}

const initialPlateSelection: PlateSelectionType = {
  plateType: '',
  plateCategory: '',
  organizationalCode: '',
  duplicateDecalNumber: ''
};

const PlateSelection: React.FC<PlateSelectionProps> = ({ formData: propFormData }) => {
  const { formData: contextFormData, updateField } = useFormContext();

  const formData = {
    ...contextFormData,
    ...propFormData
  };


  useEffect(() => {
    if (!formData.plateSelection) {
      updateField('plateSelection', initialPlateSelection);
    } else {

      const currentSelection = formData.plateSelection;
      const updatedSelection = {
        ...initialPlateSelection,
        ...currentSelection,
        plateCategory: currentSelection.plateCategory || ''
      };
      

      if (JSON.stringify(currentSelection) !== JSON.stringify(updatedSelection)) {
        updateField('plateSelection', updatedSelection);
      }
    }
  }, []);

  const handleChange = (field: keyof PlateSelectionType, value: any) => {
    const currentInfo = (formData.plateSelection || initialPlateSelection) as PlateSelectionType;
    

    if (field === 'plateType' && currentInfo.plateType === value) {
      value = '';
    }
    
    const newData = { ...currentInfo, [field]: value };
    
    if (field === 'plateType') {
      if (['Breast Cancer Awareness', 'California Arts Council', 'California Agricultural (CalAg)', 
          'California Memorial', 'California Museums (Snoopy)', 'Collegiate (only UCLA is available)', 
          'Kids - Child Health and Safety Funds', 'Pet Lovers', 
          'Veterans\' Organization'].includes(value)) {
        newData.plateCategory = 'characters2to6';
      } else if (['Environmental License Plate (ELP)', 'California Coastal Commission (Whale Tail)', 
                'Lake Tahoe Conservancy', 'Yosemite Foundation', 'California 1960s Legacy'].includes(value)) {
        newData.plateCategory = 'characters2to7';
      } else {
        newData.plateCategory = '';
      }
      
      if (value !== 'Veterans\' Organization') {
        newData.organizationalCode = '';
      }
      
      if (value !== 'Duplicate Decal') {
        newData.duplicateDecalNumber = '';
      }
    }

    updateField('plateSelection', newData);
  };

  const plates2to6 = [
    'Breast Cancer Awareness',
    'California Arts Council',
    'California Agricultural (CalAg)',
    'California Memorial',
    'California Museums (Snoopy)',
    'Collegiate (only UCLA is available)',
    'Kids - Child Health and Safety Funds',
    'Pet Lovers',
    'Veterans\' Organization'
  ];

  const plates2to7 = [
    'Environmental License Plate (ELP)',
    'California Coastal Commission (Whale Tail)',
    'Lake Tahoe Conservancy',
    'Yosemite Foundation',
    'California 1960s Legacy'
  ];

  const otherOptions = [
    'Honoring Veterans Plate',
    'Duplicate Decal'
  ];


  const plateSelection = formData.plateSelection || initialPlateSelection;

  return (
    <div className="plateWrapper">
      <div className="plateHeader">
        <h3 className="plateTitle">PLATE SELECTION</h3>
      </div>
      
      <div className="plateContent">
        <div className="checklistRow">
          <div className="checklistColumn">
            <h4 className="categoryTitle">Plates allowed 2-6 Characters</h4>
            {plates2to6.map((plate, index) => (
              <div key={`2to6-${index}`} className="checklistItem">
                <input
                  type="radio"
                  id={`plate-${plate}`}
                  name="plateType"
                  value={plate}
                  checked={plateSelection.plateType === plate}
                  onChange={() => handleChange('plateType', plate)}
                  className="radioInput"
                />
                <label htmlFor={`plate-${plate}`} className="checklistLabel">{plate}</label>
              </div>
            ))}
          </div>
          
          <div className="checklistColumn">
            <h4 className="categoryTitle">Plates allowed 2-7 Characters</h4>
            {plates2to7.map((plate, index) => (
              <div key={`2to7-${index}`} className="checklistItem">
                <input
                  type="radio"
                  id={`plate-${plate}`}
                  name="plateType"
                  value={plate}
                  checked={plateSelection.plateType === plate}
                  onChange={() => handleChange('plateType', plate)}
                  className="radioInput"
                />
                <label htmlFor={`plate-${plate}`} className="checklistLabel">{plate}</label>
              </div>
            ))}
            
            <h4 className="categoryTitle">Other Options</h4>
            {otherOptions.map((option, index) => (
              <div key={`other-${index}`} className="checklistItem">
                <input
                  type="radio"
                  id={`plate-${option}`}
                  name="plateType"
                  value={option}
                  checked={plateSelection.plateType === option}
                  onChange={() => handleChange('plateType', option)}
                  className="radioInput"
                />
                <label htmlFor={`plate-${option}`} className="checklistLabel">{option}</label>
              </div>
            ))}
          </div>
        </div>
        
        {plateSelection.plateType === 'Veterans\' Organization' && (
          <div className="inputContainer">
            <label className="inputLabel">(PROVIDE ORGANIZATIONAL CODE OF DECAL)</label>
            <p className="inputNote">
              List of Logos can be found at{' '}
              <a 
                href="https://www.calvet.ca.gov/VetServices/Pages/License-Plates.aspx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="linkText"
              >
                https://www.calvet.ca.gov/VetServices/Pages/License-Plates.aspx
              </a>
            </p>
            <input
              type="text"
              className="textInput"
              value={plateSelection.organizationalCode || ''}
              onChange={(e) => handleChange('organizationalCode', e.target.value)}
              placeholder="Enter organizational code"
            />
          </div>
        )}
        
        {plateSelection.plateType === 'Duplicate Decal' && (
          <div className="inputContainer">
            <label className="inputLabel">CURRENT LICENSE PLATE NUMBER</label>
            <input
              type="text"
              className="textInput"
              value={plateSelection.duplicateDecalNumber || ''}
              onChange={(e) => handleChange('duplicateDecalNumber', e.target.value)}
              placeholder="Enter current license plate number"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlateSelection;