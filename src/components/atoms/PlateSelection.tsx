'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './PlateSelection.css';

interface PlateSelectionType {
  plateType?: string;
  plateCategory?: 'characters2to6' | 'characters2to7';
  organizationalCode?: string;
  duplicateDecalNumber?: string;
}

interface PlateSelectionProps {
  formData?: {
    plateSelection?: PlateSelectionType;
  };
}

const initialPlateSelection: PlateSelectionType = {
  plateType: '',
  plateCategory: undefined,
  organizationalCode: '',
  duplicateDecalNumber: ''
};

const PlateSelection: React.FC<PlateSelectionProps> = ({ formData: propFormData }) => {
  const { formData: contextFormData, updateField } = useFormContext();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const formData = {
    ...contextFormData,
    ...propFormData
  };

  useEffect(() => {
    if (!formData.plateSelection) {
      updateField('plateSelection', initialPlateSelection);
    }
  }, []);

  const handleClickOutside = (e: MouseEvent) => {
    if (openDropdown && !dropdownRefs.current[openDropdown]?.contains(e.target as Node)) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const handleChange = (field: keyof PlateSelectionType, value: any) => {
    const currentInfo = (formData.plateSelection || {}) as PlateSelectionType;
    const newData = { ...currentInfo, [field]: value };     if (field === 'plateType') {       if (['Breast Cancer Awareness', 'California Arts Council', 'California Agricultural (CalAg)', 
          'California Memorial', 'California Museums (Snoopy)', 'Collegiate (only UCLA is available)', 
          'Kids - Child Health and Safety Funds', 'Pet Lovers', 'Veterans\' Organization'].includes(value)) {
        newData.plateCategory = 'characters2to6';
      } else if (['Environmental License Plate (ELP)', 'California Coastal Commission (Whale Tail)', 
                'Lake Tahoe Conservancy', 'Yosemite Foundation', 'California 1960s Legacy'].includes(value)) {
        newData.plateCategory = 'characters2to7';
      }       if (value !== 'Veterans\' Organization') {
        delete newData.organizationalCode;
      }       if (value !== 'Duplicate Decal') {
        delete newData.duplicateDecalNumber;
      }
    }

    updateField('plateSelection', newData);
    setOpenDropdown(null);
  };

  const setRef = (key: string) => (node: HTMLDivElement | null) => {
    dropdownRefs.current[key] = node;
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

  return (
    <div className="plateWrapper">
      <div className="plateHeader">
        <h3 className="plateTitle">PLATE SELECTION</h3>
      </div>
      
      <div className="plateContent">
        
        {(formData.plateSelection as PlateSelectionType)?.plateType === 'Veterans\' Organization' && (
          <div className="inputContainer">
            <label className="inputLabel">(PROVIDE ORGANIZATIONAL CODE OF DECAL)</label>
            <p className="inputNote">List of Logos can be found at https://www.calvet.ca.gov/VetServices/Pages/License-Plates.aspx</p>
            <input
              type="text"
              className="textInput"
              value={(formData.plateSelection as PlateSelectionType)?.organizationalCode || ''}
              onChange={(e) => handleChange('organizationalCode', e.target.value)}
              placeholder="Enter organizational code"
            />
          </div>
        )}
        
        <div 
          className="dropdownContainer"
          ref={setRef('plate')}
        >
          <div
            className="dropdownButton"
            onClick={() => setOpenDropdown(openDropdown === 'plate' ? null : 'plate')}
          >
            <span>{(formData.plateSelection as PlateSelectionType)?.plateType || 'Select plate type'}</span>
            <ChevronDownIcon className={`dropdownIcon ${openDropdown === 'plate' ? 'rotate' : ''}`} />
          </div>

          {openDropdown === 'plate' && (
            <ul className="dropdownMenu">
              <li className="dropdownCategory">Plates allowed 2-6 Characters</li>
              {plates2to6.map((plate, index) => (
                <li
                  key={`2to6-${index}`}
                  onClick={() => handleChange('plateType', plate)}
                  className="dropdownItem"
                >
                  {plate}
                </li>
              ))}
              <li className="dropdownCategory">Plates allowed 2-7 Characters</li>
              {plates2to7.map((plate, index) => (
                <li
                  key={`2to7-${index}`}
                  onClick={() => handleChange('plateType', plate)}
                  className="dropdownItem"
                >
                  {plate}
                </li>
              ))}
              <li className="dropdownCategory">Other Options</li>
              {otherOptions.map((option, index) => (
                <li
                  key={`other-${index}`}
                  onClick={() => handleChange('plateType', option)}
                  className="dropdownItem"
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {(formData.plateSelection as PlateSelectionType)?.plateType === 'Duplicate Decal' && (
          <div className="inputContainer" style={{ marginTop: '15px' }}>
            <label className="inputLabel">CURRENT LICENSE PLATE NUMBER</label>
            <input
              type="text"
              className="textInput"
              value={(formData.plateSelection as PlateSelectionType)?.duplicateDecalNumber || ''}
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