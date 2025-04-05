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

const MissingTitle: React.FC<MissingTitleProps> = ({ formData: propFormData }) => {
  const [titleData, setTitleData] = useState<MissingTitleInfo>(
    propFormData?.missingTitleInfo || {}
  );
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { updateField } = useFormContext();

  const missingTitleOptions = [
    'Lost', 
    'Stolen', 
    'Not Received From Prior Owner', 
    'Not Received From DMV (Allow 30 days from issue date)', 
    'Illegible/Mutilated (Attach old title)',
  ];

  useEffect(() => {
    if (propFormData?.missingTitleInfo) {
      setTitleData(propFormData.missingTitleInfo);
    }
  }, [propFormData]);

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