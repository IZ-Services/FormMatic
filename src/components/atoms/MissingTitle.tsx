'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './MissingTitle.css';

interface MissingTitleInfo {
  reason?: string;
  otherReason?: string;
}

interface MissingTitleProps {
  formData?: {
    missingTitleInfo?: MissingTitleInfo;
  };
}

 
export const MISSING_TITLE_STORAGE_KEY = 'formmatic_missing_title';

 
export const clearMissingTitleStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(MISSING_TITLE_STORAGE_KEY);
    console.log('Missing title data cleared from localStorage');
  }
};

const MissingTitle: React.FC<MissingTitleProps> = ({ formData: propFormData }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [titleData, setTitleData] = useState<MissingTitleInfo>({});
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { updateField, clearFormTriggered } = useFormContext();

  const missingTitleOptions = [
    'Lost', 
    'Stolen', 
    'Not Received From Prior Owner', 
    'Not Received From DMV (Allow 30 days from issue date)', 
    'Illegible/Mutilated (Attach old title)',
  ];

 
  useEffect(() => {
    if (clearFormTriggered) {
      console.log('Clear form triggered in MissingTitle component');
      clearMissingTitleStorage();
      setTitleData({});
      
 
      updateField('missingTitleInfo', {});
    }
  }, [clearFormTriggered]);
  
 
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const savedData = localStorage.getItem(MISSING_TITLE_STORAGE_KEY);
        
        if (savedData) {
          console.log("Loading missing title data from localStorage");
          const parsedData = JSON.parse(savedData);
          
 
          const mergedData = {
            ...parsedData,
            ...(propFormData?.missingTitleInfo || {})
          };
          
          setTitleData(mergedData);
          
 
          updateField('missingTitleInfo', mergedData);
        } else if (propFormData?.missingTitleInfo) {
 
          setTitleData(propFormData.missingTitleInfo);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading saved missing title data:', error);
        setIsInitialized(true);
        
 
        if (propFormData?.missingTitleInfo) {
          setTitleData(propFormData.missingTitleInfo);
        }
      }
    }
  }, []);

 
  useEffect(() => {
    if (isInitialized && propFormData?.missingTitleInfo) {
      setTitleData(propFormData.missingTitleInfo);
    }
  }, [propFormData, isInitialized]);

  const handleClickOutside = (e: MouseEvent) => {
    if (openDropdown && !dropdownRef.current?.contains(e.target as Node)) {
      setOpenDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const handleChange = (field: keyof MissingTitleInfo, value: string) => {
    const newData = { ...titleData, [field]: value };
    
    if (field === 'reason' && value !== 'Other') {
      delete newData.otherReason;
    }

    setTitleData(newData);
    updateField('missingTitleInfo', newData);
    
 
    if (typeof window !== 'undefined') {
      localStorage.setItem(MISSING_TITLE_STORAGE_KEY, JSON.stringify(newData));
    }
    
    if (field === 'reason') {
      setOpenDropdown(false);
    }
  };

  return (
    <div className="missingTitleWrapper">
      <div className="missingTitleHeader">
        <h3 className="missingTitleTitle">Missing Title Reason</h3>
      </div>
      
      <div className="missingTitleContent">
        <div 
          className="dropdownContainerr"
          ref={dropdownRef}
        >
          <div
            className="dropdownButton"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <span>{titleData.reason || 'Select reason'}</span>
            <ChevronDownIcon className={`dropdownIcon ${openDropdown ? 'rotate' : ''}`} />
          </div>

          {openDropdown && (
            <ul className="dropdownMenu">
              {missingTitleOptions.map((reason, index) => (
                <li
                  key={index}
                  onClick={() => handleChange('reason', reason)}
                  className="dropdownItem"
                >
                  {reason}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissingTitle;