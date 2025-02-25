import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './DisabledPersonParking.css';

interface DisabledPersonParkingData {
  parkingPlacardType?: string;
  previousIssuance?: string;
  licensePlateNumber?: string;
}

interface DisabledPersonParkingProps {
  formData?: {
    disabledPersonParkingInfo?: DisabledPersonParkingData;
  };
}

const initialDisabledPersonParkingData: DisabledPersonParkingData = {
  parkingPlacardType: '',
  previousIssuance: '',
  licensePlateNumber: ''
};

const DisabledPersonParkingForm: React.FC<DisabledPersonParkingProps> = ({ formData: propFormData }) => {
  const [formState, setFormState] = useState<DisabledPersonParkingData>(
    propFormData?.disabledPersonParkingInfo || initialDisabledPersonParkingData
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { updateField } = useFormContext();

  const parkingPlacardTypes = [
    'Permanent DP Parking Placard (No Fee)',
    'Temporary DP Parking Placard ($6.00 Fee)',
    'Travel Parking DP Parking Placard (No Fee)',
    'Disabled Person License Plates (No Fee), see Section 3',
    'Disabled Person License Plates Reassignment, see Section 3'
  ];

  useEffect(() => {
    if (propFormData?.disabledPersonParkingInfo) {
      setFormState(propFormData.disabledPersonParkingInfo);
    }
  }, [propFormData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleParkingPlacardTypeChange = (value: string) => {
    const newData = { 
      ...formState, 
      parkingPlacardType: value 
    };
    setFormState(newData);
    setIsDropdownOpen(false);
    updateField('disabledPersonParkingInfo', newData);
  };

  const handlePreviousIssuanceChange = (value: string) => {
    const newData = { 
      ...formState, 
      previousIssuance: value,
      licensePlateNumber: value === 'no' ? '' : formState.licensePlateNumber
    };
    setFormState(newData);
    updateField('disabledPersonParkingInfo', newData);
  };

  const handleLicensePlateNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { 
      ...formState, 
      licensePlateNumber: e.target.value 
    };
    setFormState(newData);
    updateField('disabledPersonParkingInfo', newData);
  };

  return (
    <div className="space-y-6 w-full max-w-2xl">
        <div className="pnoHeader">
        <h3 className="pnoTitle">Type of Disabled Person Parking Placard(S) or License Plates</h3>
      </div>
      <div className="topGroup">
        <label className="subHeadings">Select Parking Placard Type</label>
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="dropdown cursor-pointer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px',
              width: '100%',
              border: '1px solid #ccc',
              borderRadius: '2px',
              backgroundColor: 'white'
            }}
          >
            <span style={{ color: formState.parkingPlacardType ? '#000' : '#999' }}>
              {formState.parkingPlacardType || 'Select parking placard type'}
            </span>
            <ChevronDownIcon className={`regIcon ${isDropdownOpen ? 'rotate' : ''}`} />
          </div>
          {isDropdownOpen && (
            <ul className="menu">
              {parkingPlacardTypes.map((type) => (
                <li
                  key={type}
                  className="lists"
                  onClick={() => handleParkingPlacardTypeChange(type)}
                >
                  {type}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <p className="subHeadings">
          Have you ever been issued DP License Plates, Disabled Veteran License Plates, 
          or a Permanent DP parking placard in California?
        </p>
        <div className="space-y-2">
          <div className="checkboxSection">
            <input
              type="radio"
              id="previous-issuance-yes"
              name="previousIssuance"
              className="checkBoxAddress"
              checked={formState.previousIssuance === 'yes'}
              onChange={() => handlePreviousIssuanceChange('yes')}
            />
            <p>Yes</p>
          </div>
          <div className="checkboxSection">
            <input
              type="radio"
              id="previous-issuance-no"
              name="previousIssuance"
              className="checkBoxAddress"
              checked={formState.previousIssuance === 'no'}
              onChange={() => handlePreviousIssuanceChange('no')}
            />
            <p>No</p>
          </div>
        </div>
      </div>

      {formState.previousIssuance === 'yes' && (
        <div className="space-y-2">
          <label className="subHeadings">
            License Plate or DP Parking Placard Number
          </label>
          <input
            className="registeredDateInput"
            type="text"
            placeholder="Enter license plate or DP parking placard number"
            value={formState.licensePlateNumber || ''}
            onChange={handleLicensePlateNumberChange}
          />
          <p className="text-xs text-gray-600 mt-2">
            A doctor's certification is not required unless it was cancelled 
            by DMV or is no longer on record, or four replacement permanent 
            DP placards have been issued during the 2-year renewal period.
          </p>
        </div>
      )}
    </div>
  );
};

export default DisabledPersonParkingForm;