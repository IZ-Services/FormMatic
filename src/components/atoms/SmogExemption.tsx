'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import './SmogExemption.css';

interface SmogExemptionType {
  exemptionReason?: string;
  powerSource?: string;
  powerSourceOther?: string;
}

interface SmogExemptionProps {
  formData?: {
    smogExemption?: SmogExemptionType;
  };
  onChange?: (data: SmogExemptionType) => void;
}

const SmogExemption: React.FC<SmogExemptionProps> = ({ formData, onChange }) => {
  const [smogData, setSmogData] = useState<SmogExemptionType>(
    formData?.smogExemption || {}
  );
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleClickOutside = (e: MouseEvent) => {
    if (openDropdown && !dropdownRefs.current[openDropdown]?.contains(e.target as Node)) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const handleChange = (field: keyof SmogExemptionType, value: string) => {
    const newData = { ...smogData, [field]: value };
    
    if (field === 'exemptionReason' && value !== 'Powered by alternative fuel') {
      delete newData.powerSource;
      delete newData.powerSourceOther;
    }
    if (field === 'powerSource' && value !== 'Other') {
      delete newData.powerSourceOther;
    }

    setSmogData(newData);
    onChange?.(newData);
    setOpenDropdown(null);
  };

  const setRef = (key: string) => (node: HTMLDivElement | null) => {
    dropdownRefs.current[key] = node;
  };

  const exemptionReasons = [
    'The last smog certification was obtained within the last 90 days',
    'It is powered by alternative fuel',
    'It is located outside the State of California (Exception: Nevada and Mexico)',
    'It is being transferred between family members',
    'A sole proprietorship to the proprietor as owner',
    'Companies whose principal business is leasing vehicles',
    'Lessor and lessee of vehicle with no change in operator',
    'Lessor and person who has been lessee\'s operator for at least one year',
    'Individual(s) being added as registered owner(s)'
  ];

  const powerSources = [
    'Electricity',
    'Diesel',
    'Other'
  ];

  return (
    <div className="smogWrapper">
      <div className="smogHeader">
        <h3 className="smogTitle">Statement for Smog Exemption</h3>
      </div>
      
      <p className="smogSubtitle">The vehicle does not require a smog certification for transfer of ownership because:</p>

      <div className="smogContent">
        <div 
          className="dropdownContainer"
          ref={setRef('exemption')}
        >
          <div
            className="dropdownButton"
            onClick={() => setOpenDropdown(openDropdown === 'exemption' ? null : 'exemption')}
          >
            <span>{smogData.exemptionReason || 'Select reason'}</span>
            <ChevronDownIcon className={`dropdownIcon ${openDropdown === 'exemption' ? 'rotate' : ''}`} />
          </div>

          {openDropdown === 'exemption' && (
            <ul className="dropdownMenu">
              {exemptionReasons.map((reason, index) => (
                <li
                  key={index}
                  onClick={() => handleChange('exemptionReason', reason)}
                  className="dropdownItem"
                >
                  {reason}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Power Source Dropdown (Conditional) */}
        {smogData.exemptionReason === 'It is powered by alternative fuel' && (
          <div 
            className="dropdownContainer"
            ref={setRef('power')}
          >
            <label className="dropdownLabel">It is powered by:</label>
            <div
              className="dropdownButton"
              onClick={() => setOpenDropdown(openDropdown === 'power' ? null : 'power')}
            >
              <span>{smogData.powerSource || 'Select power source'}</span>
              <ChevronDownIcon className={`dropdownIcon ${openDropdown === 'power' ? 'rotate' : ''}`} />
            </div>

            {openDropdown === 'power' && (
              <ul className="dropdownMenu">
                {powerSources.map((source, index) => (
                  <li
                    key={index}
                    onClick={() => handleChange('powerSource', source)}
                    className="dropdownItem"
                  >
                    {source}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Other Power Source Input (Conditional) */}
        {smogData.powerSource === 'Other' && (
          <div className="inputContainer">
            <label className="inputLabel">Specify other power source:</label>
            <input
              type="text"
              className="textInput"
              value={smogData.powerSourceOther || ''}
              onChange={(e) => handleChange('powerSourceOther', e.target.value)}
              placeholder="Enter power source"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SmogExemption;