'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import './LegalOwnerOfRecord.css';

interface Address {
  street?: string;
  apt?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface LegalOwnerType {
  name?: string;
  address?: Address;
  date?: string;
  phoneNumber?: string;
  authorizedAgentName?: string;
  authorizedAgentTitle?: string;
}

interface LegalOwnerProps {
  formData?: {
    legalOwnerInformation?: LegalOwnerType;
  };
}

const initialAddress: Address = {
  street: '',
  apt: '',
  city: '',
  state: '',
  zip: ''
};

const initialLegalOwner: LegalOwnerType = {
  name: '',
  address: initialAddress,
  date: '',
  phoneNumber: '',
  authorizedAgentName: '',
  authorizedAgentTitle: ''
};

const states = [
    { name: 'Alabama', abbreviation: 'AL' },
    { name: 'Alaska', abbreviation: 'AK' },
    { name: 'Arizona', abbreviation: 'AZ' },
    { name: 'Arkansas', abbreviation: 'AR' },
    { name: 'California', abbreviation: 'CA' },
    { name: 'Colorado', abbreviation: 'CO' },
    { name: 'Connecticut', abbreviation: 'CT' },
    { name: 'Delaware', abbreviation: 'DE' },
    { name: 'Florida', abbreviation: 'FL' },
    { name: 'Georgia', abbreviation: 'GA' },
    { name: 'Hawaii', abbreviation: 'HI' },
    { name: 'Idaho', abbreviation: 'ID' },
    { name: 'Illinois', abbreviation: 'IL' },
    { name: 'Indiana', abbreviation: 'IN' },
    { name: 'Iowa', abbreviation: 'IA' },
    { name: 'Kansas', abbreviation: 'KS' },
    { name: 'Kentucky', abbreviation: 'KY' },
    { name: 'Louisiana', abbreviation: 'LA' },
    { name: 'Maine', abbreviation: 'ME' },
    { name: 'Maryland', abbreviation: 'MD' },
    { name: 'Massachusetts', abbreviation: 'MA' },
    { name: 'Michigan', abbreviation: 'MI' },
    { name: 'Minnesota', abbreviation: 'MN' },
    { name: 'Mississippi', abbreviation: 'MS' },
    { name: 'Missouri', abbreviation: 'MO' },
    { name: 'Montana', abbreviation: 'MT' },
    { name: 'Nebraska', abbreviation: 'NE' },
    { name: 'Nevada', abbreviation: 'NV' },
    { name: 'New Hampshire', abbreviation: 'NH' },
    { name: 'New Jersey', abbreviation: 'NJ' },
    { name: 'New Mexico', abbreviation: 'NM' },
    { name: 'New York', abbreviation: 'NY' },
    { name: 'North Carolina', abbreviation: 'NC' },
    { name: 'North Dakota', abbreviation: 'ND' },
    { name: 'Ohio', abbreviation: 'OH' },
    { name: 'Oklahoma', abbreviation: 'OK' },
    { name: 'Oregon', abbreviation: 'OR' },
    { name: 'Pennsylvania', abbreviation: 'PA' },
    { name: 'Rhode Island', abbreviation: 'RI' },
    { name: 'South Carolina', abbreviation: 'SC' },
    { name: 'South Dakota', abbreviation: 'SD' },
    { name: 'Tennessee', abbreviation: 'TN' },
    { name: 'Texas', abbreviation: 'TX' },
    { name: 'Utah', abbreviation: 'UT' },
    { name: 'Vermont', abbreviation: 'VT' },
    { name: 'Virginia', abbreviation: 'VA' },
    { name: 'Washington', abbreviation: 'WA' },
    { name: 'West Virginia', abbreviation: 'WV' },
    { name: 'Wisconsin', abbreviation: 'WI' },
    { name: 'Wyoming', abbreviation: 'WY' },
  ];

const LegalOwnerOfRecord: React.FC<LegalOwnerProps> = ({ formData: propFormData }) => {
  const [legalOwnerData, setLegalOwnerData] = useState<LegalOwnerType>(
    propFormData?.legalOwnerInformation || initialLegalOwner
  );
  const { updateField } = useFormContext();
  const [openDropdown, setOpenDropdown] = useState<'reg' | null>(null);
  const regRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (propFormData?.legalOwnerInformation) {
      setLegalOwnerData(propFormData.legalOwnerInformation);
    }
  }, [propFormData]);

  const handleInfoChange = (field: keyof LegalOwnerType, value: any) => {
    const newData = { ...legalOwnerData, [field]: value };
    setLegalOwnerData(newData);
    updateField('legalOwnerInformation', newData);
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    const newData = { ...legalOwnerData };
    newData.address = {
      ...(newData.address || {}),
      [field]: value
    };
    setLegalOwnerData(newData);
    updateField('legalOwnerInformation', newData);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Element;
    if (openDropdown && 
      regRef.current && 
      !regRef.current.contains(target) &&
      !target.closest('.regStateDropDown')) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  return (
    <div className="releaseWrapper">
      <div className="headerRow">
        <h3 className="releaseHeading">Legal Owner of Record</h3>
      </div>
      
      <div className="releaseFormGroup">
      <label className="releaseFormLabel">Name of Bank, Fianance Company, or Individual having a Lien on this Vehicle</label>
      <input
          className="releaseFormInput"
          type="text"
          placeholder="Name of Bank, Fianance Company, or Individual having a Lien on this Vehicle"
          value={legalOwnerData.name || ''}
          onChange={(e) => handleInfoChange('name', e.target.value)}
        />
      </div>

      {/* Address */}
      <div className="streetAptGroup">
        <div className="formGroup streetField">
          <label className="formLabel">Street</label>
          <input
            className="formInputt"
            type="text"
            placeholder="Street"
            value={legalOwnerData.address?.street || ''}
            onChange={(e) => handleAddressChange('street', e.target.value)}
          />
        </div>
        <div className="formGroup aptField">
          <label className="formLabel">APT./SPACE/STE.#</label>
          <input
            className="formInputt"
            type="text"
            placeholder="APT./SPACE/STE.#"
            value={legalOwnerData.address?.apt || ''}
            onChange={(e) => handleAddressChange('apt', e.target.value)}
          />
        </div>
      </div>

      <div className="cityStateZipGroupp">
        <div className="cityFieldCustomWidth">
          <label className="formLabel">City</label>
          <input
            className="cityInputt"
            type="text"
            placeholder="City"
            value={legalOwnerData.address?.city || ''}
            onChange={(e) => handleAddressChange('city', e.target.value)}
          />
        </div>
        <div className="regStateWrapper">
          <label className="registeredOwnerLabel">State</label>
          <button
            onClick={() => setOpenDropdown(openDropdown === 'reg' ? null : 'reg')}
            className="regStateDropDown"
          >
            {legalOwnerData.address?.state || 'State'}
            <ChevronDownIcon className={`regIcon ${openDropdown === 'reg' ? 'rotate' : ''}`} />
          </button>
          {openDropdown === 'reg' && (
            <ul ref={regRef} className="regStateMenu">
              {states.map((state, index) => (
                <li
                  key={index}
                  onClick={() => handleAddressChange('state', state.abbreviation)}
                  className="regStateLists"
                >
                  {state.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="formGroup zipCodeField">
          <label className="formLabel">ZIP Code</label>
          <input
            className="formInputt"
            type="text"
            placeholder="Zip Code"
            value={legalOwnerData.address?.zip || ''}
            onChange={(e) => handleAddressChange('zip', e.target.value)}
          />
        </div>
      </div>


    </div>
  );
};

export default LegalOwnerOfRecord;