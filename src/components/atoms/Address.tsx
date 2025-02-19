'use client';
import React, { useRef, useState, useEffect } from 'react';
import './Address.css';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';

interface AddressData {
  street?: string;
  apt?: string;
  city?: string;
  state?: string;
  zip?: string;
  poBox?: string;
  country?: string;
}

interface FormData {
  mailingAddressDifferent?: boolean;
  lesseeAddressDifferent?: boolean;
  trailerLocationDifferent?: boolean;
  address?: AddressData;
  mailingAddress?: AddressData;
  lesseeAddress?: AddressData;
  trailerLocation?: AddressData;
}

interface AddressProps {
  formData?: FormData;
}

const initialAddressData: AddressData = {
  street: '',
  apt: '',
  city: '',
  state: '',
  zip: '',
  poBox: '',
  country: ''
};

export default function Address({ formData: propFormData }: AddressProps) {

    const [addressData, setAddressData] = useState<FormData>(propFormData || {});

  const { formData: contextFormData, updateField } = useFormContext() as {
    
    formData: FormData;
    updateField: (section: string, value: any) => void;
  };

  const formData = {
    ...contextFormData,
    ...propFormData
  };
  useEffect(() => {
    if (propFormData) {
      setAddressData(propFormData);
    }
  }, [propFormData]);
  

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  useEffect(() => {
    if (!formData.address) {
      updateField('address', { ...initialAddressData });
    }
  }, [formData.address]);

  useEffect(() => {
    if (formData.mailingAddressDifferent && !formData.mailingAddress) {
      updateField('mailingAddress', { ...initialAddressData });
    }
  }, [formData.mailingAddressDifferent, formData.mailingAddress]);

  useEffect(() => {
    if (formData.lesseeAddressDifferent && !formData.lesseeAddress) {
      updateField('lesseeAddress', { ...initialAddressData });
    }
  }, [formData.lesseeAddressDifferent, formData.lesseeAddress]);

  useEffect(() => {
    if (formData.trailerLocationDifferent && !formData.trailerLocation) {
      updateField('trailerLocation', { ...initialAddressData });
    }
  }, [formData.trailerLocationDifferent, formData.trailerLocation]);

  useEffect(() => {
    if (formData.mailingAddressDifferent === undefined) {
      updateField('mailingAddressDifferent', false);
    }
    if (formData.lesseeAddressDifferent === undefined) {
      updateField('lesseeAddressDifferent', false);
    }
    if (formData.trailerLocationDifferent === undefined) {
      updateField('trailerLocationDifferent', false);
    }
  }, []);

  const dropdownRefs = {
    reg: useRef<HTMLUListElement>(null),
    mailing: useRef<HTMLUListElement>(null),
    lessee: useRef<HTMLUListElement>(null),
    trailer: useRef<HTMLUListElement>(null),
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
  const handleDropdownClick = (dropdown: string) => {
    setOpenDropdown(prev => (prev === dropdown ? null : dropdown));
  };

  const handleAddressChange = (section: keyof FormData, field: keyof AddressData, value: string) => {
    const currentData = (addressData[section] ?? {}) as AddressData;
    const newData = {
      ...addressData,
      [section]: { ...currentData, [field]: value }
    };
    
    setAddressData(newData);  
    updateField(section, newData[section]);  
  };

  const handleCheckboxChange = (field: keyof FormData, checked: boolean) => {
    const newData = {
      ...addressData,
      [field]: checked
    };
    setAddressData(newData);  
    updateField(field, checked);  
  };
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Element;
    if (
      openDropdown &&
      dropdownRefs[openDropdown as keyof typeof dropdownRefs].current &&
      !dropdownRefs[openDropdown as keyof typeof dropdownRefs].current?.contains(target)
    ) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);



  return (
    <div>
      <div className="addressWrapper">
        <div className="addressCheckboxWrapper">
          <h3 className="addressHeading">Address</h3>
          <div className="checkboxSection">
            <input
              type="checkbox"
              className="checkBoxAddress"
              checked={!!formData.mailingAddressDifferent}
              onChange={(e) => handleCheckboxChange('mailingAddressDifferent', e.target.checked)}
            />
            <p>If mailing address is different</p>
          </div>
          <div className="checkboxSection">
            <input
              type="checkbox"
              className="checkBoxAddress"
              checked={!!formData.lesseeAddressDifferent}
              onChange={(e) => handleCheckboxChange('lesseeAddressDifferent', e.target.checked)}
            />
            <p>If lessee address is different</p>
          </div>
          <div className="checkboxSection">
            <input
              type="checkbox"
              className="checkBoxAddress"
              checked={!!formData.trailerLocationDifferent}
              onChange={(e) => handleCheckboxChange('trailerLocationDifferent', e.target.checked)}
            />
            <p>Trailer/Vessel location</p>
          </div>
        </div>

        {/* Main Address */}
        <div className="streetAptGroup">
          <div className="formGroup streetField">
            <label className="formLabel">Street</label>
            <input
              className="formInputt"
              type="text"
              placeholder="Street"
              value={addressData.address?.street || ''}
              onChange={(e) => handleAddressChange('address', 'street', e.target.value)}
            />
          </div>
          <div className="formGroup aptField">
            <label className="formLabel">APT./SPACE/STE.#</label>
            <input
              className="formInputt"
              type="text"
              placeholder="APT./SPACE/STE.#"
              value={addressData.address?.apt || ''}
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
              value={addressData.address?.city || ''}
              onChange={(e) => handleAddressChange('address', 'city', e.target.value)}
            />
          </div>
          <div className="regStateWrapper">
            <label className="registeredOwnerLabel">State</label>
            <button
              onClick={() => handleDropdownClick('reg')}
              className="regStateDropDown"
            >
              {formData.address?.state || 'State'}
              <ChevronDownIcon className={`regIcon ${openDropdown === 'reg' ? 'rotate' : ''}`} />
            </button>
            {openDropdown === 'reg' && (
              <ul ref={dropdownRefs.reg} className="regStateMenu">
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
              value={addressData.address?.zip || ''}
              onChange={(e) => handleAddressChange('address', 'zip', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Mailing Address */}
      {formData.mailingAddressDifferent && (
        <div className="addressWrapper">
          <h3 className="addressHeading">Mailing Address</h3>
          <div className="streetAptGroup">
            <div className="formGroup streetField">
              <label className="formLabel">Street</label>
              <input
                className="formInputt"
                type="text"
                placeholder="Street"
                value={formData.mailingAddress?.street || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'street', e.target.value)}
              />
            </div>
            <div className="formGroup aptField">
              <label className="formLabel">PO Box No</label>
              <input
                className="formInputt"
                type="text"
                placeholder="PO Box No"
                value={formData.mailingAddress?.poBox || ''}
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
                value={formData.mailingAddress?.city || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'city', e.target.value)}
              />
            </div>
            <div className="regStateWrapper">
              <label className="registeredOwnerLabel">State</label>
              <button
                onClick={() => handleDropdownClick('mailing')}
                className="regStateDropDown"
              >
                {formData.mailingAddress?.state || 'State'}
                <ChevronDownIcon className={`regIcon ${openDropdown === 'mailing' ? 'rotate' : ''}`} />
              </button>
              {openDropdown === 'mailing' && (
                <ul ref={dropdownRefs.mailing} className="regStateMenu">
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
                value={formData.mailingAddress?.zip || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'zip', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Lessee Address */}
      {formData.lesseeAddressDifferent && (
        <div className="addressWrapper">
          <h3 className="addressHeading">Lessee Address</h3>
          <div className="streetAptGroup">
            <div className="formGroup streetField">
              <label className="formLabel">Street</label>
              <input
                className="formInputt"
                type="text"
                placeholder="Street"
                value={formData.lesseeAddress?.street || ''}
                onChange={(e) => handleAddressChange('lesseeAddress', 'street', e.target.value)}
              />
            </div>
            <div className="formGroup aptField">
              <label className="formLabel">APT./SPACE/STE.#</label>
              <input
                className="formInputt"
                type="text"
                placeholder="APT./SPACE/STE.#"
                value={formData.lesseeAddress?.apt || ''}
                onChange={(e) => handleAddressChange('lesseeAddress', 'apt', e.target.value)}
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
                value={formData.lesseeAddress?.city || ''}
                onChange={(e) => handleAddressChange('lesseeAddress', 'city', e.target.value)}
              />
            </div>
            <div className="regStateWrapper">
              <label className="registeredOwnerLabel">State</label>
              <button
                onClick={() => handleDropdownClick('lessee')}
                className="regStateDropDown"
              >
                {formData.lesseeAddress?.state || 'State'}
                <ChevronDownIcon className={`regIcon ${openDropdown === 'lessee' ? 'rotate' : ''}`} />
              </button>
              {openDropdown === 'lessee' && (
                <ul ref={dropdownRefs.lessee} className="regStateMenu">
                  {states.map((state, index) => (
                    <li
                      key={index}
                      onClick={() => handleAddressChange('lesseeAddress', 'state', state.abbreviation)}
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
                value={formData.lesseeAddress?.zip || ''}
                onChange={(e) => handleAddressChange('lesseeAddress', 'zip', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Trailer Location */}
      {formData.trailerLocationDifferent && (
        <div className="addressWrapper">
          <h3 className="addressHeading">Vessel or Trailer Coach Principally Kept At</h3>
          <div className="streetAptGroup">
            <div className="formGroup streetField">
              <label className="formLabel">Street</label>
              <input
                className="formInputt"
                type="text"
                placeholder="Street"
                value={formData.trailerLocation?.street || ''}
                onChange={(e) => handleAddressChange('trailerLocation', 'street', e.target.value)}
              />
            </div>
            <div className="formGroup aptField">
              <label className="formLabel">APT./SPACE/STE.#</label>
              <input
                className="formInputt"
                type="text"
                placeholder="APT./SPACE/STE.#"
                value={formData.trailerLocation?.apt || ''}
                onChange={(e) => handleAddressChange('trailerLocation', 'apt', e.target.value)}
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
                value={formData.trailerLocation?.city || ''}
                onChange={(e) => handleAddressChange('trailerLocation', 'city', e.target.value)}
              />
            </div>
            <div className="regStateWrapper">
              <label className="registeredOwnerLabel">State</label>
              <button
                onClick={() => handleDropdownClick('trailer')}
                className="regStateDropDown"
              >
                {formData.trailerLocation?.state || 'State'}
                <ChevronDownIcon className={`regIcon ${openDropdown === 'trailer' ? 'rotate' : ''}`} />
              </button>
              {openDropdown === 'trailer' && (
                <ul ref={dropdownRefs.trailer} className="regStateMenu">
                  {states.map((state, index) => (
                    <li
                      key={index}
                      onClick={() => handleAddressChange('trailerLocation', 'state', state.abbreviation)}
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
                value={formData.trailerLocation?.zip || ''}
                onChange={(e) => handleAddressChange('trailerLocation', 'zip', e.target.value)}
              />
            </div>
          </div>
          <div className="countryField">
            <label className="formLabel">Country</label>
            <input
              className="countryInput"
              type="text"
              placeholder="Country"
              value={formData.trailerLocation?.country || ''}
              onChange={(e) => handleAddressChange('trailerLocation', 'country', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}