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

interface ValidationError {
  field: string;
  message: string;
}

interface ReplacementSectionProps {
  formData?: {
    replacementSection?: ReplacementSectionType;
  };
  showValidationErrors?: boolean;
}

const initialReplacementSection: ReplacementSectionType = {
  specialInterestLicensePlate: '',
  ineed: undefined,
  plateStatus: undefined
};

const ReplacementSection: React.FC<ReplacementSectionProps> = ({ 
  formData: propFormData,
  showValidationErrors = false 
}) => {
  const { formData: contextFormData, updateField } = useFormContext();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const formData = {
    ...contextFormData,
    ...propFormData
  };


  const validateReplacementSection = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    const replacementSection = formData.replacementSection as ReplacementSectionType | undefined;
    

    if (!replacementSection?.specialInterestLicensePlate) {
      errors.push({
        field: 'specialInterestLicensePlate',
        message: 'License plate number is required'
      });
    } else if (replacementSection.specialInterestLicensePlate.length < 2) {
      errors.push({
        field: 'specialInterestLicensePlate',
        message: 'Please enter a valid license plate number'
      });
    }
    

    if (!replacementSection?.ineed) {
      errors.push({
        field: 'ineed',
        message: 'Please select how many plates you need'
      });
    }
    

    if (!replacementSection?.plateStatus) {
      errors.push({
        field: 'plateStatus',
        message: 'Please select the status of your plates'
      });
    }
    
    return errors;
  };


  const getErrorMessage = (field: string): string | null => {
    const error = validationErrors.find(err => err.field === field);
    return error ? error.message : null;
  };

  useEffect(() => {
    if (!formData.replacementSection) {
      updateField('replacementSection', initialReplacementSection);
    }
  }, []);


  useEffect(() => {
    if (showValidationErrors) {
      const errors = validateReplacementSection();
      setValidationErrors(errors);
    }
  }, [showValidationErrors, formData.replacementSection]);


  useEffect(() => {
    if (showValidationErrors) {
      updateField('_validationErrors', (prev: any) => ({
        ...prev,
        replacementSection: validationErrors.length > 0
      }));
    }
  }, [validationErrors, showValidationErrors]);

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
    

    if (showValidationErrors) {
      const errors = validateReplacementSection();
      setValidationErrors(errors);
    }
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
        {showValidationErrors && validationErrors.length > 0 && (
          <div className="headerErrorMessage">Please complete all required fields below</div>
        )}
      </div>
      
      <div className="replacementContent">
        <div className="replacementTopRow">
          <div className="specialInterestContainer">
            <label className="specialInterestLabel">SPECIAL INTEREST LICENSE PLATE NUMBER</label>
            <input
              type="text"
              className={`specialInterestInput ${showValidationErrors && getErrorMessage('specialInterestLicensePlate') ? 'error-input' : ''}`}
              value={formData.replacementSection 
                ? (formData.replacementSection.specialInterestLicensePlate || '').toUpperCase() 
                : ''}
              onChange={(e) => handleChange('specialInterestLicensePlate', e.target.value.toUpperCase())}
              placeholder="ENTER PLATE NUMBER"
              maxLength={7}
              style={{ textTransform: 'uppercase' }}
            />
            {showValidationErrors && getErrorMessage('specialInterestLicensePlate') && (
              <div className="error-messagee">{getErrorMessage('specialInterestLicensePlate')}</div>
            )}
          </div>
          
          <div className="replacementInfo">
            <p className="replacementNote">If BOTH plates were lost or stolen, the same configuration cannot be reissued on any plate type.</p>
          </div>
        </div>
        
        <div className="replacementOptionsRow">
          <div className="ineedSection">
            <span className={`ineedLabel ${showValidationErrors && getErrorMessage('ineed') ? 'error-label' : ''}`}>
              I NEED:
            </span>
            <div className="optionCheckboxes">
              {plateOptions.map((option) => (
                <label key={option} className="checkboxLabel">
                  <input
                    type="checkbox"
                    checked={formData.replacementSection ? formData.replacementSection.ineed === option : false}
                    onChange={() => handleChange('ineed', option)}
                    className={`checkboxInput ${showValidationErrors && getErrorMessage('ineed') ? 'error-input' : ''}`}
                  />
                  {option}
                </label>
              ))}
            </div>
            {showValidationErrors && getErrorMessage('ineed') && (
              <div className="error-messagee">{getErrorMessage('ineed')}</div>
            )}
          </div>
          
          <div className="statusSec">
            <span className={`statusLabel ${showValidationErrors && getErrorMessage('plateStatus') ? 'error-label' : ''}`}>
              PLATE(S) WERE:
            </span>
            <div className="optionCheckboxes">
              {plateStatuses.map((status) => (
                <label key={status} className="checkboxLabel">
                  <input
                    type="checkbox"
                    checked={formData.replacementSection ? formData.replacementSection.plateStatus === status : false}
                    onChange={() => handleChange('plateStatus', status)}
                    className={`checkboxInput ${showValidationErrors && getErrorMessage('plateStatus') ? 'error-input' : ''}`}
                  />
                  {status}
                </label>
              ))}
            </div>
            {showValidationErrors && getErrorMessage('plateStatus') && (
              <div className="error-messagee">{getErrorMessage('plateStatus')}</div>
            )}
          </div>
        </div>
        
        {/* Alternative dropdown for plate status (mobile-friendly) */}
        <div className="dropdownSections">
          <div className="dropdownSection">
            <label className={`dropdownSectionLabel ${showValidationErrors && getErrorMessage('ineed') ? 'error-label' : ''}`}>
              I NEED:
            </label>
            <div 
              className="dropdownContainer"
              ref={setRef('ineed')}
            >
              <div
                className={`dropdownButton ${showValidationErrors && getErrorMessage('ineed') ? 'error-dropdown' : ''}`}
                onClick={() => setOpenDropdown(openDropdown === 'ineed' ? null : 'ineed')}
              >
                <span>{formData.replacementSection ? formData.replacementSection.ineed || 'Select option' : 'Select option'}</span>
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
              {showValidationErrors && getErrorMessage('ineed') && (
                <div className="error-messagee">{getErrorMessage('ineed')}</div>
              )}
            </div>
          </div>

          <div className="dropdownSection">
            <label className={`dropdownSectionLabel ${showValidationErrors && getErrorMessage('plateStatus') ? 'error-label' : ''}`}>
              PLATE(S) WERE:
            </label>
            <div 
              className="dropdownContainer"
              ref={setRef('status')}
            >
              <div
                className={`dropdownButton ${showValidationErrors && getErrorMessage('plateStatus') ? 'error-dropdown' : ''}`}
                onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
              >
                <span>{formData.replacementSection ? formData.replacementSection.plateStatus || 'Select status' : 'Select status'}</span>
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
              {showValidationErrors && getErrorMessage('plateStatus') && (
                <div className="error-messagee">{getErrorMessage('plateStatus')}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplacementSection;