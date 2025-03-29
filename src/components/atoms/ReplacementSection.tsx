'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import './ReplacementSection.css';

interface ReplacementSectionType {
  specialInterestLicensePlate?: string;
  ineed?: 'One Plate' | 'Two Plates';
  plateStatus?: 'Lost' | 'Mutilated' | 'Stolen';
}

interface ReplacementSectionProps {
  formData?: {
    replacementSection?: ReplacementSectionType;
  };
}

const initialReplacementSection: ReplacementSectionType = {
  specialInterestLicensePlate: '',
  ineed: undefined,
  plateStatus: undefined
};

const ReplacementSection: React.FC<ReplacementSectionProps> = ({ formData: propFormData }) => {
  const { formData: contextFormData, updateField } = useFormContext();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const formData = {
    ...contextFormData,
    ...propFormData
  };

  useEffect(() => {
    if (!formData.replacementSection) {
      updateField('replacementSection', initialReplacementSection);
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

  const handleChange = (field: keyof ReplacementSectionType, value: any) => {
    const currentInfo = (formData.replacementSection || {}) as ReplacementSectionType;
    const newData = { ...currentInfo, [field]: value };
    updateField('replacementSection', newData);
    setOpenDropdown(null);
  };

  const setRef = (key: string) => (node: HTMLDivElement | null) => {
    dropdownRefs.current[key] = node;
  };

  const plateStatuses = ['Lost', 'Mutilated', 'Stolen'];
  const plateOptions = ['One Plate', 'Two Plates'];

  return (
    <div className="replacementWrapper">
      <div className="replacementHeader">
        <h3 className="replacementTitle">FOR REPLACEMENT ONLY</h3>
      </div>
      
      <div className="replacementContent">
        <div className="replacementTopRow">
          <div className="specialInterestContainer">
            <label className="specialInterestLabel">Special Interest License Plate Number</label>
            <input
              type="text"
              className="specialInterestInput"
              value={(formData.replacementSection as ReplacementSectionType)?.specialInterestLicensePlate || ''}
              onChange={(e) => handleChange('specialInterestLicensePlate', e.target.value)}
              placeholder="Enter plate number"
            />
          </div>
          
          <div className="replacementInfo">
            <p className="replacementNote">If BOTH plates were lost or stolen, the same configuration cannot be reissued on any plate type.</p>
          </div>
        </div>
        
        <div className="replacementOptionsRow">
          <div className="ineedSection">
            <span className="ineedLabel">I NEED:</span>
            <div className="optionCheckboxes">
              {plateOptions.map((option) => (
                <label key={option} className="checkboxLabel">
                  <input
                    type="checkbox"
                    checked={(formData.replacementSection as ReplacementSectionType)?.ineed === option}
                    onChange={() => handleChange('ineed', option)}
                    className="checkboxInput"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          
          <div className="statusSec">
            <span className="statusLabel">PLATE(S) WERE:</span>
            <div className="optionCheckboxes">
              {plateStatuses.map((status) => (
                <label key={status} className="checkboxLabel">
                  <input
                    type="checkbox"
                    checked={(formData.replacementSection as ReplacementSectionType)?.plateStatus === status}
                    onChange={() => handleChange('plateStatus', status)}
                    className="checkboxInput"
                  />
                  {status}
                </label>
              ))}
            </div>
          </div>
        </div>
        
        {/* Alternative dropdown for plate status (mobile-friendly) */}
        <div className="dropdownSections">
          <div className="dropdownSection">
            <label className="dropdownSectionLabel">I NEED:</label>
            <div 
              className="dropdownContainer"
              ref={setRef('ineed')}
            >
              <div
                className="dropdownButton"
                onClick={() => setOpenDropdown(openDropdown === 'ineed' ? null : 'ineed')}
              >
                <span>{(formData.replacementSection as ReplacementSectionType)?.ineed || 'Select option'}</span>
                <ChevronDownIcon className={`dropdownIcon ${openDropdown === 'ineed' ? 'rotate' : ''}`} />
              </div>

              {openDropdown === 'ineed' && (
                <ul className="dropdownMenu">
                  {plateOptions.map((option, index) => (
                    <li
                      key={`ineed-${index}`}
                      onClick={() => handleChange('ineed', option)}
                      className="dropdownItem"
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="dropdownSection">
            <label className="dropdownSectionLabel">PLATE(S) WERE:</label>
            <div 
              className="dropdownContainer"
              ref={setRef('status')}
            >
              <div
                className="dropdownButton"
                onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
              >
                <span>{(formData.replacementSection as ReplacementSectionType)?.plateStatus || 'Select status'}</span>
                <ChevronDownIcon className={`dropdownIcon ${openDropdown === 'status' ? 'rotate' : ''}`} />
              </div>

              {openDropdown === 'status' && (
                <ul className="dropdownMenu">
                  {plateStatuses.map((status, index) => (
                    <li
                      key={`status-${index}`}
                      onClick={() => handleChange('plateStatus', status)}
                      className="dropdownItem"
                    >
                      {status}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplacementSection;