'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './Address.css';

const inlineCheckboxStyles = `
.addressHeadingWithCheckboxes {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 15px;
  gap: 15px;
}

.inlineCheckboxContainer {
  display: flex;
  gap: 15px;
}

.inlineCheckboxSection {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
}

.inlineCheckboxSection label {
  font-size: 14px;
  cursor: pointer;
}

.disabledCheckbox {
  opacity: 0.5;
  cursor: not-allowed;
}

.disabledCheckbox input, .disabledCheckbox label {
  cursor: not-allowed;
}
`;

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
  [key: string]: any;
}

interface FormContextType {
  formData: Record<string, any>;
  updateField: (field: string, value: any) => void;
}

interface AddressProps {
  formData?: {
    address?: AddressData;
    mailingAddress?: AddressData;
    lesseeAddress?: AddressData;
    trailerLocation?: AddressData;
    mailingAddressDifferent?: boolean;
    lesseeAddressDifferent?: boolean;
    trailerLocationDifferent?: boolean;
  };
  onChange?: (data: FormData) => void;
  isMultipleTransfer?: boolean;
}

const initialAddressData: AddressData = {
  street: '',
  apt: '',
  city: '',
  state: '',
  zip: '',
  country: ''
};


const Address: React.FC<AddressProps> = ({ formData: propFormData, onChange, isMultipleTransfer = false }) => {
 
  const [addressData, setAddressData] = useState<FormData>({
    mailingAddressDifferent: propFormData?.mailingAddressDifferent || false,
    lesseeAddressDifferent: propFormData?.lesseeAddressDifferent || false,
    trailerLocationDifferent: propFormData?.trailerLocationDifferent || false,
    address: propFormData?.address || { ...initialAddressData },
    mailingAddress: propFormData?.mailingAddress || { ...initialAddressData, poBox: '' },
    lesseeAddress: propFormData?.lesseeAddress || { ...initialAddressData },
    trailerLocation: propFormData?.trailerLocation || { ...initialAddressData }
  });

  const { updateField } = useFormContext() as FormContextType;
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = {
    reg: useRef<HTMLUListElement>(null),
    mailing: useRef<HTMLUListElement>(null),
    lessee: useRef<HTMLUListElement>(null),
    trailer: useRef<HTMLUListElement>(null),
  };

 
  useEffect(() => {
    if (propFormData) {
      const newData = { ...addressData };
      let hasChanges = false;

      if (propFormData.mailingAddressDifferent !== undefined && 
          propFormData.mailingAddressDifferent !== addressData.mailingAddressDifferent) {
        newData.mailingAddressDifferent = propFormData.mailingAddressDifferent;
        hasChanges = true;
      }

      if (propFormData.lesseeAddressDifferent !== undefined && 
          propFormData.lesseeAddressDifferent !== addressData.lesseeAddressDifferent) {
        newData.lesseeAddressDifferent = propFormData.lesseeAddressDifferent;
        hasChanges = true;
      }

      if (propFormData.trailerLocationDifferent !== undefined && 
          propFormData.trailerLocationDifferent !== addressData.trailerLocationDifferent) {
        newData.trailerLocationDifferent = propFormData.trailerLocationDifferent;
        hasChanges = true;
      }

      if (propFormData.address) {
        newData.address = { ...addressData.address, ...propFormData.address };
        hasChanges = true;
      }

      if (propFormData.mailingAddress) {
        newData.mailingAddress = { ...addressData.mailingAddress, ...propFormData.mailingAddress };
        hasChanges = true;
      }

      if (propFormData.lesseeAddress) {
        newData.lesseeAddress = { ...addressData.lesseeAddress, ...propFormData.lesseeAddress };
        hasChanges = true;
      }

      if (propFormData.trailerLocation) {
        newData.trailerLocation = { ...addressData.trailerLocation, ...propFormData.trailerLocation };
        hasChanges = true;
      }

      if (hasChanges) {
        setAddressData(newData);
      }
    }
  }, [propFormData]);

 
  useEffect(() => {
 
    if (!onChange) {
 
      if (addressData.address && typeof addressData.address === 'object') {
        updateField('address', addressData.address);
      }
      
 
      if (typeof addressData.mailingAddressDifferent === 'boolean') {
        updateField('mailingAddressDifferent', addressData.mailingAddressDifferent);
      }
      
      if (typeof addressData.lesseeAddressDifferent === 'boolean') {
        updateField('lesseeAddressDifferent', addressData.lesseeAddressDifferent);
      }
      
      if (typeof addressData.trailerLocationDifferent === 'boolean') {
        updateField('trailerLocationDifferent', addressData.trailerLocationDifferent);
      }
      
 
      if (addressData.mailingAddressDifferent && addressData.mailingAddress && 
          typeof addressData.mailingAddress === 'object') {
        updateField('mailingAddress', addressData.mailingAddress);
      }
      
      if (addressData.lesseeAddressDifferent && addressData.lesseeAddress && 
          typeof addressData.lesseeAddress === 'object') {
        updateField('lesseeAddress', addressData.lesseeAddress);
      }
      
      if (addressData.trailerLocationDifferent && addressData.trailerLocation && 
          typeof addressData.trailerLocation === 'object') {
        updateField('trailerLocation', addressData.trailerLocation);
      }
    }
  }, []);

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Element;
    
    Object.entries(dropdownRefs).forEach(([key, ref]) => {
      if (openDropdown === key && ref.current && !ref.current.contains(target)) {
        setOpenDropdown(null);
      }
    });
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const handleAddressChange = (section: keyof FormData, field: string, value: string) => {
    if (typeof addressData[section] !== 'object') return;
    
    const newData = { ...addressData };
    const currentSection = newData[section] as AddressData | undefined;
    
    const updatedSection = {
      ...(currentSection || {}),
      [field]: value
    };
    
    newData[section] = updatedSection;
    setAddressData(newData);     console.log(`Updating ${section}.${field} to:`, value);
    console.log("New section data:", updatedSection);
    
    if (onChange) {
      onChange(newData);
    } else {       updateField(String(section), updatedSection);       if (isMultipleTransfer && section === 'address') {
        console.log(`Extra update for multiple transfer: address.${field}`, value);
      }
    }
  };

  const handleCheckboxChange = (field: keyof FormData, checked: boolean) => {
    const newData = { ...addressData };
    newData[field] = checked;
    
 
    if (field === 'lesseeAddressDifferent' && checked) {
 
      newData.trailerLocationDifferent = false;
      if (!onChange) {
        updateField('trailerLocationDifferent', false);
      }
    } else if (field === 'trailerLocationDifferent' && checked) {
 
      newData.lesseeAddressDifferent = false;
      if (!onChange) {
        updateField('lesseeAddressDifferent', false);
      }
    }
    
    setAddressData(newData);
    
 
    if (onChange) {
      onChange(newData);
    } else {
      updateField(String(field), checked);
    }
  };

  const handleStateChange = (dropdown: string, stateAbbreviation: string, addressType: keyof FormData) => {
    handleAddressChange(addressType, 'state', stateAbbreviation);
    setOpenDropdown(null);
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


  const isLesseeCheckboxDisabled = addressData.trailerLocationDifferent;
  const isTrailerCheckboxDisabled = addressData.lesseeAddressDifferent;

  return (
    <div>
      <style>{inlineCheckboxStyles}</style>
      <div className="addressWrapper">
        {!isMultipleTransfer ? (
          <div className="addressCheckboxWrapper">
            <h3 className="addressHeading">Address</h3>
            <div className="checkboxSection">
              <input
                type="checkbox"
                className="checkBoxAddress"
                checked={!!addressData.mailingAddressDifferent}
                onChange={(e) => handleCheckboxChange('mailingAddressDifferent', e.target.checked)}
              />
              <p>If mailing address is different</p>
            </div>
            <div className={`checkboxSection ${isLesseeCheckboxDisabled ? 'disabledCheckbox' : ''}`}>
              <input
                type="checkbox"
                className="checkBoxAddress"
                checked={!!addressData.lesseeAddressDifferent}
                onChange={(e) => !isLesseeCheckboxDisabled && handleCheckboxChange('lesseeAddressDifferent', e.target.checked)}
                disabled={isLesseeCheckboxDisabled}
              />
              <p>If lessee address is different</p>
            </div>
            <div className={`checkboxSection ${isTrailerCheckboxDisabled ? 'disabledCheckbox' : ''}`}>
              <input
                type="checkbox"
                className="checkBoxAddress"
                checked={!!addressData.trailerLocationDifferent}
                onChange={(e) => !isTrailerCheckboxDisabled && handleCheckboxChange('trailerLocationDifferent', e.target.checked)}
                disabled={isTrailerCheckboxDisabled}
              />
              <p>Trailer/Vessel location</p>
            </div>
          </div>
        ) : (
          <div className="addressHeadingWithCheckboxes">
            <h3 className="addressHeading">Address</h3>
            <div className="inlineCheckboxContainer">
              <div className="inlineCheckboxSection">
                <input
                  type="checkbox"
                  className="checkBoxAddress"
                  checked={!!addressData.mailingAddressDifferent}
                  onChange={(e) => handleCheckboxChange('mailingAddressDifferent', e.target.checked)}
                  id="mailingCheck"
                />
                <label htmlFor="mailingCheck">If mailing address is different</label>
              </div>
              <div className={`inlineCheckboxSection ${isLesseeCheckboxDisabled ? 'disabledCheckbox' : ''}`}>
                <input
                  type="checkbox"
                  className="checkBoxAddress"
                  checked={!!addressData.lesseeAddressDifferent}
                  onChange={(e) => !isLesseeCheckboxDisabled && handleCheckboxChange('lesseeAddressDifferent', e.target.checked)}
                  id="lesseeCheck"
                  disabled={isLesseeCheckboxDisabled}
                />
                <label htmlFor="lesseeCheck">If lessee address is different</label>
              </div>
              <div className={`inlineCheckboxSection ${isTrailerCheckboxDisabled ? 'disabledCheckbox' : ''}`}>
                <input
                  type="checkbox"
                  className="checkBoxAddress"
                  checked={!!addressData.trailerLocationDifferent}
                  onChange={(e) => !isTrailerCheckboxDisabled && handleCheckboxChange('trailerLocationDifferent', e.target.checked)}
                  id="trailerCheck"
                  disabled={isTrailerCheckboxDisabled}
                />
                <label htmlFor="trailerCheck">Trailer/Vessel location is different</label>
              </div>
            </div>
          </div>
        )}

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
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'reg' ? null : 'reg')}
              className="regStateDropDown"
            >
              {addressData.address?.state || 'State'}
              <ChevronDownIcon className={`regIcon ${openDropdown === 'reg' ? 'rotate' : ''}`} />
            </button>
            {openDropdown === 'reg' && (
              <ul ref={dropdownRefs.reg} className="regStateMenu">
                {states.map((state, index) => (
                  <li
                    key={index}
                    onClick={() => handleStateChange('reg', state.abbreviation, 'address')}
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

      {(!isMultipleTransfer || addressData.mailingAddressDifferent) && addressData.mailingAddressDifferent && (
        <div className="addressWrapper">
          <h3 className="addressHeading">Mailing Address</h3>
          <div className="streetAptGroup">
            <div className="formGroup streetField">
              <label className="formLabel">Street</label>
              <input
                className="formInputt"
                type="text"
                placeholder="Street"
                value={addressData.mailingAddress?.street || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'street', e.target.value)}
              />
            </div>
            <div className="formGroup aptField">
              <label className="formLabel">PO Box No</label>
              <input
                className="formInputt"
                type="text"
                placeholder="PO Box No"
                value={addressData.mailingAddress?.poBox || ''}
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
                value={addressData.mailingAddress?.city || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'city', e.target.value)}
              />
            </div>
            <div className="regStateWrapper">
              <label className="registeredOwnerLabel">State</label>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'mailing' ? null : 'mailing')}
                className="regStateDropDown"
              >
                {addressData.mailingAddress?.state || 'State'}
                <ChevronDownIcon className={`regIcon ${openDropdown === 'mailing' ? 'rotate' : ''}`} />
              </button>
              {openDropdown === 'mailing' && (
                <ul ref={dropdownRefs.mailing} className="regStateMenu">
                  {states.map((state, index) => (
                    <li
                      key={index}
                      onClick={() => handleStateChange('mailing', state.abbreviation, 'mailingAddress')}
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
                value={addressData.mailingAddress?.zip || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'zip', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Lessee Address */}
      {(!isMultipleTransfer || addressData.lesseeAddressDifferent) && addressData.lesseeAddressDifferent && (
        <div className="addressWrapper">
          <h3 className="addressHeading">Lessee Address</h3>
          <div className="streetAptGroup">
            <div className="formGroup streetField">
              <label className="formLabel">Street</label>
              <input
                className="formInputt"
                type="text"
                placeholder="Street"
                value={addressData.lesseeAddress?.street || ''}
                onChange={(e) => handleAddressChange('lesseeAddress', 'street', e.target.value)}
              />
            </div>
            <div className="formGroup aptField">
              <label className="formLabel">APT./SPACE/STE.#</label>
              <input
                className="formInputt"
                type="text"
                placeholder="APT./SPACE/STE.#"
                value={addressData.lesseeAddress?.apt || ''}
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
                value={addressData.lesseeAddress?.city || ''}
                onChange={(e) => handleAddressChange('lesseeAddress', 'city', e.target.value)}
              />
            </div>
            <div className="regStateWrapper">
              <label className="registeredOwnerLabel">State</label>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'lessee' ? null : 'lessee')}
                className="regStateDropDown"
              >
                {addressData.lesseeAddress?.state || 'State'}
                <ChevronDownIcon className={`regIcon ${openDropdown === 'lessee' ? 'rotate' : ''}`} />
              </button>
              {openDropdown === 'lessee' && (
                <ul ref={dropdownRefs.lessee} className="regStateMenu">
                  {states.map((state, index) => (
                    <li
                      key={index}
                      onClick={() => handleStateChange('lessee', state.abbreviation, 'lesseeAddress')}
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
                value={addressData.lesseeAddress?.zip || ''}
                onChange={(e) => handleAddressChange('lesseeAddress', 'zip', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Trailer Location */}
      {(!isMultipleTransfer || addressData.trailerLocationDifferent) && addressData.trailerLocationDifferent && (
        <div className="addressWrapper">
          <h3 className="addressHeading">Vessel or Trailer Coach Principally Kept At</h3>
          <div className="streetAptGroup">
            <div className="formGroup streetField">
              <label className="formLabel">Street</label>
              <input
                className="formInputt"
                type="text"
                placeholder="Street"
                value={addressData.trailerLocation?.street || ''}
                onChange={(e) => handleAddressChange('trailerLocation', 'street', e.target.value)}
              />
            </div>
            <div className="formGroup aptField">
              <label className="formLabel">APT./SPACE/STE.#</label>
              <input
                className="formInputt"
                type="text"
                placeholder="APT./SPACE/STE.#"
                value={addressData.trailerLocation?.apt || ''}
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
                value={addressData.trailerLocation?.city || ''}
                onChange={(e) => handleAddressChange('trailerLocation', 'city', e.target.value)}
              />
            </div>
            <div className="regStateWrapper">
              <label className="registeredOwnerLabel">State</label>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'trailer' ? null : 'trailer')}
                className="regStateDropDown"
              >
                {addressData.trailerLocation?.state || 'State'}
                <ChevronDownIcon className={`regIcon ${openDropdown === 'trailer' ? 'rotate' : ''}`} />
              </button>
              {openDropdown === 'trailer' && (
                <ul ref={dropdownRefs.trailer} className="regStateMenu">
                  {states.map((state, index) => (
                    <li
                      key={index}
                      onClick={() => handleStateChange('trailer', state.abbreviation, 'trailerLocation')}
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
                value={addressData.trailerLocation?.zip || ''}
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
              value={addressData.trailerLocation?.country || ''}
              onChange={(e) => handleAddressChange('trailerLocation', 'country', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Address;