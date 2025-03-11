'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import './MissingTitle.css';

interface MissingTitleInfo {
  reason?: string;
  otherReason?: string;
}

interface MissingTitleProps {
  formData?: {
    missingTitleInfo?: MissingTitleInfo;
  };
  onChange?: (data: MissingTitleInfo) => void;
}

const MissingTitle: React.FC<MissingTitleProps> = ({ formData, onChange }) => {
  const [titleData, setTitleData] = useState<MissingTitleInfo>(
    formData?.missingTitleInfo || {}
  );
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const missingTitleOptions = [
    'Lost', 
    'Stolen', 
    'Not Received From Prior Owner', 
    'Not Received From DMV (Allow 30 days from issue date)', 
    'Illegible/Mutilated (Attach old title)',
    'Other'
  ];

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
    onChange?.(newData);
    
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
          className="dropdownContainer"
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

        {/* Other Reason Input (Conditional) */}
        {titleData.reason === 'Other' && (
          <div className="inputContainer">
            <label className="inputLabel">Specify other reason:</label>
            <input
              type="text"
              className="textInput"
              value={titleData.otherReason || ''}
              onChange={(e) => handleChange('otherReason', e.target.value)}
              placeholder="Enter the reason"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MissingTitle;