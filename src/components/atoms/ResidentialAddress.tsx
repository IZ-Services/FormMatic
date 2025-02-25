'use client';
import React, { useRef, useEffect, useState } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import './ResidentialAddress.css';

interface Address {
  street?: string;
  apt?: string;
  poBox?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface ResidentialAddressData {
  mailingAddressDifferent?: boolean;
  address?: Address;
  mailingAddress?: Address;
}

interface MissingTitleInfo {
  reason?: string;
  otherReason?: string;
}

interface PowerOfAttorneyInfo {
  type?: string;
  otherType?: string;
}

interface FormData {
  residentialAddress?: ResidentialAddressData;
  missingTitleInfo?: MissingTitleInfo;
  powerOfAttorneyInfo?: PowerOfAttorneyInfo;
  [key: string]: any;
}

interface FormContext {
  formData: FormData;
  updateField: (field: string, value: any) => void;
}

interface ResidentialAddressProps {
  formData?: FormData;
}

const initialAddress: Address = {
  street: '',
  apt: '',
  poBox: '',
  city: '',
  state: '',
  zip: ''
};

const initialResidentialAddress: ResidentialAddressData = {
  mailingAddressDifferent: false,
  address: { ...initialAddress },
  mailingAddress: { ...initialAddress }
};

const initialMissingTitleInfo: MissingTitleInfo = {
  reason: '',
  otherReason: ''
};

const initialPowerOfAttorneyInfo: PowerOfAttorneyInfo = {
  type: '',
  otherType: ''
};

export default function ResidentialAddress({ formData: propFormData }: ResidentialAddressProps) {
  const { formData: contextFormData, updateField } = useFormContext() as FormContext;
  const regRef = useRef<HTMLUListElement>(null);
  const mailingRef = useRef<HTMLUListElement>(null);
  const [openDropdown, setOpenDropdown] = useState<'reg' | 'mailing' | null>(null);

  const formData = {
    ...contextFormData,
    ...propFormData
  };

  useEffect(() => {
    if (!formData.residentialAddress) {
      updateField('residentialAddress', initialResidentialAddress);
    }
  }, []);

  useEffect(() => {
    if (!formData.missingTitleInfo) {
      updateField('missingTitleInfo', initialMissingTitleInfo);
    }
  }, []);

  useEffect(() => {
    if (!formData.powerOfAttorneyInfo) {
      updateField('powerOfAttorneyInfo', initialPowerOfAttorneyInfo);
    }
  }, []);

  useEffect(() => {
    if (formData.residentialAddress) {
      const updates: Partial<ResidentialAddressData> = {};
      
      if (!formData.residentialAddress.address) {
        updates.address = initialAddress;
      }
      
      if (formData.residentialAddress.mailingAddressDifferent && !formData.residentialAddress.mailingAddress) {
        updates.mailingAddress = initialAddress;
      }

      if (Object.keys(updates).length > 0) {
        updateField('residentialAddress', {
          ...formData.residentialAddress,
          ...updates
        });
      }
    }
  }, [formData.residentialAddress?.mailingAddressDifferent]);

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

  const missingTitleOptions = ['Lost', 'Stolen', 'Not Received From Prior Owner', 'Not Received From DMV (Allow 30 days from issue date)', 'Illegible/Mutilated (Attach old title)' ];
  const powerOfAttorneyOptions = ['General', 'Limited', 'Medical', 'Other'];


  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const handleAddressChange = (section: 'address' | 'mailingAddress', field: keyof Address, value: string) => {
    const current = formData.residentialAddress?.[section] || {};
    updateField('residentialAddress', {
      ...(formData.residentialAddress || {}),
      [section]: { ...current, [field]: value }
    });
  };

  const handleCheckboxChange = (field: keyof ResidentialAddressData, checked: boolean) => {
    updateField('residentialAddress', {
      ...(formData.residentialAddress || {}),
      [field]: checked
    });
  };

  const handleMissingTitleChange = (field: keyof MissingTitleInfo, value: string) => {
    const current = formData.missingTitleInfo || {};
    updateField('missingTitleInfo', {
      ...current,
      [field]: value,
      ...(field === 'reason' && value !== 'Other' ? { otherReason: '' } : {})
    });
  };

  const handlePowerOfAttorneyChange = (field: keyof PowerOfAttorneyInfo, value: string) => {
    const current = formData.powerOfAttorneyInfo || {};
    updateField('powerOfAttorneyInfo', {
      ...current,
      [field]: value,
      ...(field === 'type' && value !== 'Other' ? { otherType: '' } : {})
    });
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

  return (
    <div>
      <div className="addressWrapper">
        <div className="addressCheckboxWrapper">
          <h3 className="addressHeading">Residential Address</h3>
          <div className="checkboxSection">
            <input
              type="checkbox"
              className="checkBoxAddress"
              checked={formData.residentialAddress?.mailingAddressDifferent || false}
              onChange={(e) => handleCheckboxChange('mailingAddressDifferent', e.target.checked)}
            />
            <p>If mailing address is different</p>
          </div>
        </div>
        <div className="streetAptGroup">
          <div className="formGroup streetField">
            <label className="formLabel">Street</label>
            <input
              className="formInputt"
              type="text"
              placeholder="Street"
              value={formData.residentialAddress?.address?.street || ''}
              onChange={(e) => handleAddressChange('address', 'street', e.target.value)}
            />
          </div>
          <div className="formGroup aptField">
            <label className="formLabel">APT./SPACE/STE.#</label>
            <input
              className="formInputt"
              type="text"
              placeholder="APT./SPACE/STE.#"
              value={formData.residentialAddress?.address?.apt || ''}
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
              value={formData.residentialAddress?.address?.city || ''}
              onChange={(e) => handleAddressChange('address', 'city', e.target.value)}
            />
          </div>
          <div className="regStateWrapper">
            <label className="registeredOwnerLabel">State</label>
            <button
              onClick={() => setOpenDropdown(openDropdown === 'reg' ? null : 'reg')}
              className="regStateDropDown"
            >
              {formData.residentialAddress?.address?.state || 'State'}
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
              placeholder="ZIP Code"
              value={formData.residentialAddress?.address?.zip || ''}
              onChange={(e) => handleAddressChange('address', 'zip', e.target.value)}
            />
          </div>
        </div>
      </div>

      {formData.residentialAddress?.mailingAddressDifferent && (
        <div className="addressWrapper">
          <h3 className="addressHeading">Mailing Address</h3>
          <div className="streetAptGroup">
            <div className="formGroup streetField">
              <label className="formLabel">Street</label>
              <input
                className="formInputt streetInput"
                type="text"
                placeholder="Street"
                value={formData.residentialAddress?.mailingAddress?.street || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'street', e.target.value)}
              />
            </div>
            <div className="formGroup aptField">
              <label className="formLabel">PO Box No</label>
              <input
                className="formInputt aptInput"
                type="text"
                placeholder="PO Box No"
                value={formData.residentialAddress?.mailingAddress?.poBox || ''}
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
                value={formData.residentialAddress?.mailingAddress?.city || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'city', e.target.value)}
              />
            </div>
            <div className="regStateWrapper">
              <label className="registeredOwnerLabel">State</label>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'mailing' ? null : 'mailing')}
                className="regStateDropDown"
              >
                {formData.residentialAddress?.mailingAddress?.state || 'State'}
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
                className="formInputt zipInput"
                type="text"
                placeholder="ZIP Code"
                value={formData.residentialAddress?.mailingAddress?.zip || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'zip', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="dropdownWrapper">
        <h3>Missing Title Reason</h3>
        <select
          className="dropdown"
          value={formData.missingTitleInfo?.reason || ''}
          onChange={(e) => handleMissingTitleChange('reason', e.target.value)}
        >
          <option value="">Options</option>
          {missingTitleOptions.map((reason, index) => (
            <option key={index} value={reason}>
              {reason}
            </option>
          ))}
        </select>
        {formData.missingTitleInfo?.reason === 'Other' && (
          <input
            type="text"
            className="otherInput"
            placeholder="Enter the reason"
            value={formData.missingTitleInfo?.otherReason || ''}
            onChange={(e) => handleMissingTitleChange('otherReason', e.target.value)}
          />
        )}
      </div>

      <div className="dropdownWrapper">
        <h3>Power of Attorney</h3>
        <select
          className="dropdown"
          value={formData.powerOfAttorneyInfo?.type || ''}
          onChange={(e) => handlePowerOfAttorneyChange('type', e.target.value)}
        >
          <option value="">Options</option>
          {powerOfAttorneyOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        {formData.powerOfAttorneyInfo?.type === 'Other' && (
          <input
            type="text"
            className="otherInput"
            placeholder="Enter the reason"
            value={formData.powerOfAttorneyInfo?.otherType || ''}
            onChange={(e) => handlePowerOfAttorneyChange('otherType', e.target.value)}
          />
        )}
      </div>
    </div>
  );
}