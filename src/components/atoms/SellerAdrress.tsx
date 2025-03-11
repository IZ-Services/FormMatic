'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider'; 
interface Address {
  street?: string;
  apt?: string;
  city?: string;
  state?: string;
  zip?: string;
  poBox?: string;
  country?: string;
}

interface FormData {
  sellerMailingAddressDifferent?: boolean;
  sellerAddress?: Address;
  sellerMailingAddress?: Address;
}

interface SellerAddressProps {
  formData?: FormData;
  onChange?: (data: FormData) => void;
  isMultipleTransfer?: boolean;
}

const initialAddress: Address = {
  street: '',
  apt: '',
  city: '',
  state: '',
  zip: '',
  poBox: '',
  country: ''
}; const cleanFormData = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  
  const result: any = {};   Object.keys(data).forEach(key => {
    const value = data[key];     if (key === 'sellerAddress' && value && typeof value === 'object' && 
        (value.sellerAddress !== undefined)) {       const { street, apt, city, state, zip, poBox, country } = value;
      result[key] = { street, apt, city, state, zip, poBox, country };
    } else {
      result[key] = value;
    }
  });
  
  return result;
};

const SellerAddress: React.FC<SellerAddressProps> = ({ formData: propFormData, onChange, isMultipleTransfer = false }) => {   const cleanedFormData = cleanFormData(propFormData);
  
  const [addressData, setAddressData] = useState<FormData>({
    sellerMailingAddressDifferent: cleanedFormData?.sellerMailingAddressDifferent || false,
    sellerAddress: cleanedFormData?.sellerAddress || { ...initialAddress },
    sellerMailingAddress: cleanedFormData?.sellerMailingAddress || { ...initialAddress }
  });
  
  const { formData: contextFormData, updateField } = useFormContext() as {
    formData: Record<string, any>;
    updateField: (section: string, value: any) => void;
  };   useEffect(() => {
    if (propFormData) {       const cleanedProps = cleanFormData(propFormData);
      
      const newData = { ...addressData };
      let hasChanges = false;

      if (cleanedProps.sellerMailingAddressDifferent !== undefined && 
          cleanedProps.sellerMailingAddressDifferent !== addressData.sellerMailingAddressDifferent) {
        newData.sellerMailingAddressDifferent = cleanedProps.sellerMailingAddressDifferent;
        hasChanges = true;
      }

      if (cleanedProps.sellerAddress) {
        newData.sellerAddress = { ...addressData.sellerAddress, ...cleanedProps.sellerAddress };
        hasChanges = true;
      }

      if (cleanedProps.sellerMailingAddress) {
        newData.sellerMailingAddress = { ...addressData.sellerMailingAddress, ...cleanedProps.sellerMailingAddress };
        hasChanges = true;
      }

      if (hasChanges) {
        setAddressData(newData);
      }
    }
  }, [propFormData]);   useEffect(() => {
    if (!onChange) {       if (addressData.sellerAddress && typeof addressData.sellerAddress === 'object') {
        updateField('sellerAddress', addressData.sellerAddress);
      }       updateField('sellerMailingAddressDifferent', !!addressData.sellerMailingAddressDifferent);       if (addressData.sellerMailingAddressDifferent && addressData.sellerMailingAddress && 
          typeof addressData.sellerMailingAddress === 'object') {
        updateField('sellerMailingAddress', addressData.sellerMailingAddress);
      }
    }
  }, []);   useEffect(() => {
    if (isMultipleTransfer) {
      console.log("SellerAddress: Multiple transfer mode detected");
      console.log("Initial addressData:", addressData);       if (!onChange) {
        updateField('sellerAddress', addressData.sellerAddress);
        updateField('sellerMailingAddressDifferent', !!addressData.sellerMailingAddressDifferent);
        updateField('sellerMailingAddress', addressData.sellerMailingAddress || { ...initialAddress });
      }
    }
  }, [isMultipleTransfer]);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const dropdownRefs = {
    seller: useRef<HTMLUListElement>(null),
    mailing: useRef<HTMLUListElement>(null),
    business: useRef<HTMLUListElement>(null),
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
const handleAddressChange = (section: keyof FormData, field: keyof Address, value: string) => {
  console.log(`Updating ${section}.${field} to:`, value);   const newData = { ...addressData };   if (!newData[section]) {     if (section === 'sellerAddress' || section === 'sellerMailingAddress') {
      newData[section] = { ...initialAddress } as any;
    } else if (section === 'sellerMailingAddressDifferent') {
      newData[section] = false as any;
    }
  }   const currentSection = (newData[section] as Address) || {};   const updatedSection = {
    ...currentSection,
    [field]: value
  };   newData[section] = updatedSection as any;
  
  setAddressData(newData);
  
  console.log(`Updated ${section} data:`, updatedSection);
  
  if (onChange) {
    onChange(newData);
  } else {     updateField(String(section), updatedSection);
    
    if (isMultipleTransfer) {
      console.log(`Multiple transfer update for ${section}.${field}:`, value);
    }
  }
};   const handleCheckboxChange = (field: keyof FormData, checked: boolean) => {
    console.log(`Checkbox clicked: ${field} to ${checked}`);
    
    const newData = { ...addressData };
    newData[field] = checked;     if (field === 'sellerMailingAddressDifferent' && checked) {
      if (!newData.sellerMailingAddress || Object.keys(newData.sellerMailingAddress).length === 0) {
        newData.sellerMailingAddress = { ...initialAddress };
      }
      console.log("Initialized sellerMailingAddress:", newData.sellerMailingAddress);
    }
    
    setAddressData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField(String(field), checked);       if (field === 'sellerMailingAddressDifferent' && checked) {
        updateField('sellerMailingAddress', newData.sellerMailingAddress);
      }
    }
  };

  const handleStateSelect = (section: keyof FormData, abbreviation: string) => {
    handleAddressChange(section, 'state', abbreviation);
    setOpenDropdown(null);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Element;
    
    Object.entries(dropdownRefs).forEach(([key, ref]) => {
      if (openDropdown === key && ref.current && !ref.current.contains(target) && 
          !target.closest(`.${key}DropdownButton`)) {
        setOpenDropdown(null);
      }
    });
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);
  return (
    <div>
      <div className="addressWrapper">
        <div className="addressCheckboxWrapper">
          <h3 className="addressHeading">Residential Address</h3>
          <div className="checkboxSection">
            <input
              type="checkbox"
              className="checkBoxAddress"
              checked={!!addressData.sellerMailingAddressDifferent}
              onChange={(e) => handleCheckboxChange('sellerMailingAddressDifferent', e.target.checked)}
            />
            <p>If mailing address is different</p>
          </div>
        </div>

        {/* Main Seller Address */}
        <div className="streetAptGroup">
          <div className="formGroup streetField">
            <label className="formLabel">Street</label>
            <input
              className="formInputt"
              type="text"
              placeholder="Street"
              value={addressData.sellerAddress?.street || ''}
              onChange={(e) => handleAddressChange('sellerAddress', 'street', e.target.value)}
            />
          </div>
          <div className="formGroup aptField">
            <label className="formLabel">APT./SPACE/STE.#</label>
            <input
              className="formInputt"
              type="text"
              placeholder="APT./SPACE/STE.#"
              value={addressData.sellerAddress?.apt || ''}
              onChange={(e) => handleAddressChange('sellerAddress', 'apt', e.target.value)}
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
              value={addressData.sellerAddress?.city || ''}
              onChange={(e) => handleAddressChange('sellerAddress', 'city', e.target.value)}
            />
          </div>
          <div className="regStateWrapper">
            <label className="registeredOwnerLabel">State</label>
            <button
              type="button"
              onClick={() => handleDropdownClick('seller')}
              className="regStateDropDown sellerDropdownButton"
            >
              {addressData.sellerAddress?.state || 'State'}
              <ChevronDownIcon className={`regIcon ${openDropdown === 'seller' ? 'rotate' : ''}`} />
            </button>
            {openDropdown === 'seller' && (
              <ul ref={dropdownRefs.seller} className="regStateMenu">
                {states.map((state, index) => (
                  <li
                    key={index}
                    onClick={() => handleStateSelect('sellerAddress', state.abbreviation)}
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
              value={addressData.sellerAddress?.zip || ''}
              onChange={(e) => handleAddressChange('sellerAddress', 'zip', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Mailing Address - only show if checkbox is checked */}
      {addressData.sellerMailingAddressDifferent && (
        <div className="addressWrapper">
          <h3 className="addressHeading">Mailing Address</h3>
          <div className="streetAptGroup">
            <div className="formGroup streetField">
              <label className="formLabel">Street</label>
              <input
                className="formInputt"
                type="text"
                placeholder="Street"
                value={addressData.sellerMailingAddress?.street || ''}
                onChange={(e) => handleAddressChange('sellerMailingAddress', 'street', e.target.value)}
              />
            </div>
            <div className="formGroup aptField">
              <label className="formLabel">PO Box No</label>
              <input
                className="formInputt"
                type="text"
                placeholder="PO Box No"
                value={addressData.sellerMailingAddress?.poBox || ''}
                onChange={(e) => handleAddressChange('sellerMailingAddress', 'poBox', e.target.value)}
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
                value={addressData.sellerMailingAddress?.city || ''}
                onChange={(e) => handleAddressChange('sellerMailingAddress', 'city', e.target.value)}
              />
            </div>
            <div className="regStateWrapper">
              <label className="registeredOwnerLabel">State</label>
              <button
                type="button"
                onClick={() => handleDropdownClick('mailing')}
                className="regStateDropDown mailingDropdownButton"
              >
                {addressData.sellerMailingAddress?.state || 'State'}
                <ChevronDownIcon className={`regIcon ${openDropdown === 'mailing' ? 'rotate' : ''}`} />
              </button>
              {openDropdown === 'mailing' && (
                <ul ref={dropdownRefs.mailing} className="regStateMenu">
                  {states.map((state, index) => (
                    <li
                      key={index}
                      onClick={() => handleStateSelect('sellerMailingAddress', state.abbreviation)}
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
                value={addressData.sellerMailingAddress?.zip || ''}
                onChange={(e) => handleAddressChange('sellerMailingAddress', 'zip', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerAddress;