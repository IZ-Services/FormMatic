'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import './ReleaseOfOwnership.css';

interface Address {
  street?: string;
  apt?: string;
  poBox?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface ReleaseInformationType {
  name?: string;
  address?: Address;
  mailingAddress?: Address;
  mailingAddressDifferent?: boolean;
  date?: string;
  phoneNumber?: string;
  authorizedAgentName?: string;
  authorizedAgentTitle?: string;
}

interface ReleaseInformationProps {
  formData?: {
    releaseInformation?: ReleaseInformationType;
  };
}

const initialAddress: Address = {
  street: '',
  apt: '',
  poBox: '',
  city: '',
  state: '',
  zip: ''
};

const initialReleaseInformation: ReleaseInformationType = {
  name: '',
  address: initialAddress,
  mailingAddress: initialAddress,
  mailingAddressDifferent: false,
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

const ReleaseOfOwnership: React.FC<ReleaseInformationProps> = ({ formData: propFormData }) => {
  const [releaseData, setReleaseData] = useState<ReleaseInformationType>(
    propFormData?.releaseInformation || initialReleaseInformation
  );
  const { updateField } = useFormContext();
  const [openDropdown, setOpenDropdown] = useState<'reg' | 'mailing' | null>(null);
  const regRef = useRef<HTMLUListElement>(null);
  const mailingRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (propFormData?.releaseInformation) {
      setReleaseData(propFormData.releaseInformation);
    }
  }, [propFormData]);

  const handleReleaseInfoChange = (field: keyof ReleaseInformationType, value: any) => {
    const newData = { ...releaseData, [field]: value };
    setReleaseData(newData);
    updateField('releaseInformation', newData);
  };

  const handleAddressChange = (addressType: 'address' | 'mailingAddress', field: keyof Address, value: string) => {
    const newData = { ...releaseData };
    newData[addressType] = {
      ...(newData[addressType] || {}),
      [field]: value
    };
    setReleaseData(newData);
    updateField('releaseInformation', newData);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Element;
    if (openDropdown && 
      ((openDropdown === 'reg' && regRef.current && !regRef.current.contains(target)) ||
       (openDropdown === 'mailing' && mailingRef.current && !mailingRef.current.contains(target))) &&
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
        <h3 className="releaseHeading">Lien Release</h3>
        <div className="checkboxSection">
          <input
            type="checkbox"
            className="checkBoxAddress"
            checked={releaseData.mailingAddressDifferent || false}
            onChange={(e) => handleReleaseInfoChange('mailingAddressDifferent', e.target.checked)}
          />
          <p>If mailing address is different</p>
        </div>
      </div>


      
      <div className="releaseFormGroup">
        <label className="releaseFormLabel">Name of Bank, Finance Company, or Individual(s) Having a Lien on this Vehicle</label>
        <input
          className="releaseFormInput"
          type="text"
          placeholder="Name of Bank, Finance Company, or Individual(s)"
          value={releaseData.name || ''}
          onChange={(e) => handleReleaseInfoChange('name', e.target.value)}
        />
      </div>

      <div className="streetAptGroup">
        <div className="formGroup streetField">
          <label className="formLabel">Street</label>
          <input
            className="formInputt"
            type="text"
            placeholder="Street"
            value={releaseData.address?.street || ''}
            onChange={(e) => handleAddressChange('address', 'street', e.target.value)}
          />
        </div>
        <div className="formGroup aptField">
          <label className="formLabel">APT./SPACE/STE.#</label>
          <input
            className="formInputt"
            type="text"
            placeholder="APT./SPACE/STE.#"
            value={releaseData.address?.apt || ''}
            onChange={(e) => handleAddressChange('address', 'apt', e.target.value)}
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
            value={releaseData.address?.city || ''}
            onChange={(e) => handleAddressChange('address', 'city', e.target.value)}
          />
        </div>
        <div className="regStateWrapper">
          <label className="registeredOwnerLabel">State</label>
          <button
            onClick={() => setOpenDropdown(openDropdown === 'reg' ? null : 'reg')}
            className="regStateDropDown"
          >
            {releaseData.address?.state || 'State'}
            <ChevronDownIcon className={`regIcon ${openDropdown === 'reg' ? 'rotate' : ''}`} />
          </button>
          {openDropdown === 'reg' && (
            <ul ref={regRef} className="regStateMenu">
              {states.map((state, index) => (
                <li
                  key={index}
                  onClick={() => handleAddressChange('address', 'state', state.abbreviation)}
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
            value={releaseData.address?.zip || ''}
            onChange={(e) => handleAddressChange('address', 'zip', e.target.value)}
          />
        </div>
      </div>
<div className='wrap'>
      <div className="datePhoneGroup">
        <div className="formGroup dateField">
          <label className="releaseFormLabel">Date</label>
          <input
    className="registeredDateInput"
    type="text"
    placeholder="MM/DD/YYYY"
    value={releaseData.date || ''}
    onChange={(e) => handleReleaseInfoChange('date', e.target.value)}
    maxLength={10}
  />
          
        </div>
        <div className="formGroup phoneField">
          <label className="releaseFormLabel">Daytime Phone Number</label>
          <input
            className="formInputt"
            type="tel"
            placeholder="(XXX) XXX-XXXX"
            value={releaseData.phoneNumber || ''}
            onChange={(e) => handleReleaseInfoChange('phoneNumber', e.target.value)}
          />
        </div>
      </div>

      <div className="authorizedAgentGroup">
        <div className="formGroup agentNameField">
          <label className="releaseFormLabel">Printed Name of Authorized Agent</label>
          <input
            className="formInputt"
            type="text"
            placeholder="Full Name"
            value={releaseData.authorizedAgentName || ''}
            onChange={(e) => handleReleaseInfoChange('authorizedAgentName', e.target.value)}
          />
        </div>
        <div className="formGroup agentTitleField">
          <label className="releaseFormLabel">Title of Authorized Agent Signing for Company</label>
          <input
            className="formInputt"
            type="text"
            placeholder="Title"
            value={releaseData.authorizedAgentTitle || ''}
            onChange={(e) => handleReleaseInfoChange('authorizedAgentTitle', e.target.value)}
          />
        </div>
      </div>
</div>

      {releaseData.mailingAddressDifferent && (
        <div className="addressWrapper">
          <h3 className="addressHeading">Mailing Address</h3>
          <div className="streetAptGroup">
            <div className="formGroup streetField">
              <label className="formLabel">Street</label>
              <input
                className="formInputt"
                type="text"
                placeholder="Street"
                value={releaseData.mailingAddress?.street || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'street', e.target.value)}
              />
            </div>
            <div className="formGroup aptField">
              <label className="formLabel">PO Box No</label>
              <input
                className="formInputt"
                type="text"
                placeholder="PO Box No"
                value={releaseData.mailingAddress?.poBox || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'poBox', e.target.value)}
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
                value={releaseData.mailingAddress?.city || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'city', e.target.value)}
              />
            </div>
            <div className="regStateWrapper">
              <label className="registeredOwnerLabel">State</label>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'mailing' ? null : 'mailing')}
                className="regStateDropDown"
              >
                {releaseData.mailingAddress?.state || 'State'}
                <ChevronDownIcon className={`regIcon ${openDropdown === 'mailing' ? 'rotate' : ''}`} />
              </button>
              {openDropdown === 'mailing' && (
                <ul ref={mailingRef} className="regStateMenu">
                  {states.map((state, index) => (
                    <li
                      key={index}
                      onClick={() => handleAddressChange('mailingAddress', 'state', state.abbreviation)}
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
                placeholder="ZIP Code"
                value={releaseData.mailingAddress?.zip || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'zip', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReleaseOfOwnership;