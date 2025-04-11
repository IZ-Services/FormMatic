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

.state-dropdown-wrapper {
  position: relative;
  width: 120px;
}

.state-dropdown-button {
  width: 100%;
  padding: 10px 10px;
  background-color: white;
  border: 1px solid #ced4da;
  font-size: 14px;
  color: #757575;
  text-align: left;
  height:35px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.state-dropdown-button:hover {
  border-color: #b8b8b8;
}

.state-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  width: 100%;
  height:170px;
  max-height: 300px;

  overflow-y: auto;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.15);
  margin-top: 2px;
}

.state-dropdown-item {
  padding: 7px 12px;
  color: #9b9b9b;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
}

.state-dropdown-item:hover {
  background-color: #f8f9fa;
  color: #212529;
}

.state-dropdown-menu::-webkit-scrollbar {
  width: 6px;
}

.state-dropdown-menu::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.state-dropdown-menu::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.state-dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.rotate {
  transform: rotate(180deg);
}

.city-state-zip-group {
  display: flex;
  gap: 15px;
  align-items: flex-start;
  width: 100%;
}

.state-label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 400;
  color: #333;
}
`;

interface AddressData {
  street?: string;
  apt?: string;
  city?: string;
  state?: string;
  zip?: string;
  poBox?: string;
  county?: string;
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
  clearFormTriggered?: number | null;
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
  county: ''
};

const emptyMailingAddress: AddressData = {
  street: '',
  apt: '',
  city: '',
  state: '',
  zip: '',
  poBox: '',
  county: ''
};

const emptyAddress: AddressData = {
  street: '',
  apt: '',
  city: '',
  state: '',
  zip: '',
  county: ''
};

 
export const ADDRESS_STORAGE_KEY = 'formmatic_address_data';

 
export const clearAddressStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADDRESS_STORAGE_KEY);
    console.log('Address data cleared from localStorage');
  }
};

const Address: React.FC<AddressProps> = ({ formData: propFormData, onChange, isMultipleTransfer = false }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  
 
  const defaultAddressData: FormData = {
    mailingAddressDifferent: false,
    lesseeAddressDifferent: false,
    trailerLocationDifferent: false,
    address: { ...initialAddressData },
    mailingAddress: { ...initialAddressData, poBox: '' },
    lesseeAddress: { ...initialAddressData },
    trailerLocation: { ...initialAddressData }
  };
  
  const [addressData, setAddressData] = useState<FormData>(defaultAddressData);

  const { updateField, clearFormTriggered } = useFormContext() as FormContextType;
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = {
    address: useRef<HTMLDivElement>(null),
    mailingAddress: useRef<HTMLDivElement>(null),
    lesseeAddress: useRef<HTMLDivElement>(null),
    trailerLocation: useRef<HTMLDivElement>(null),
  };
  
 
  useEffect(() => {
    if (clearFormTriggered) {
      console.log('Clear form triggered in Address component');
      clearAddressStorage();
      setAddressData(defaultAddressData);
      
 
      updateField('address', { ...initialAddressData });
      updateField('mailingAddressDifferent', false);
      updateField('lesseeAddressDifferent', false);
      updateField('trailerLocationDifferent', false);
      updateField('mailingAddress', { ...emptyMailingAddress });
      updateField('lesseeAddress', { ...emptyAddress });
      updateField('trailerLocation', { ...emptyAddress });
    }
  }, [clearFormTriggered]);
  
 
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const savedData = localStorage.getItem(ADDRESS_STORAGE_KEY);
        
        if (savedData) {
          console.log("Loading address data from localStorage");
          const parsedData = JSON.parse(savedData);
          
 
          const mergedData = {
            ...defaultAddressData,
            ...parsedData,
            ...propFormData
          };
          
          setAddressData(mergedData);
          
 
          updateField('address', mergedData.address);
          updateField('mailingAddressDifferent', !!mergedData.mailingAddressDifferent);
          updateField('lesseeAddressDifferent', !!mergedData.lesseeAddressDifferent);
          updateField('trailerLocationDifferent', !!mergedData.trailerLocationDifferent);
          
          if (mergedData.mailingAddressDifferent) {
            updateField('mailingAddress', mergedData.mailingAddress);
          }
          
          if (mergedData.lesseeAddressDifferent) {
            updateField('lesseeAddress', mergedData.lesseeAddress);
          }
          
          if (mergedData.trailerLocationDifferent) {
            updateField('trailerLocation', mergedData.trailerLocation);
          }
          
          if (onChange) {
            onChange(mergedData);
          }
        } else {
 
          const mergedData = {
            ...defaultAddressData,
            ...propFormData
          };
          setAddressData(mergedData);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading saved address data:', error);
        setIsInitialized(true);
        
 
        const mergedData = {
          ...defaultAddressData,
          ...propFormData
        };
        setAddressData(mergedData);
      }
    }
  }, []);
 
  useEffect(() => {
    if (isInitialized && propFormData) {
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
        
 
        if (typeof window !== 'undefined') {
          localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(newData));
        }
      }
    }
  }, [propFormData, isInitialized]);

 
  useEffect(() => {
    if (isInitialized && !onChange) {
 
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
  }, [addressData, isInitialized]);

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
    setAddressData(newData);
    console.log(`Updating ${section}.${field} to:`, value);
    console.log("New section data:", updatedSection);
    
 
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(newData));
    }
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField(String(section), updatedSection);
      if (isMultipleTransfer && section === 'address') {
        console.log(`Extra update for multiple transfer: address.${field}`, value);
      }
    }
  };

  const handleCheckboxChange = (field: keyof FormData, checked: boolean) => {
    const newData = { ...addressData };
    newData[field] = checked;
    
    if (!checked) {
      switch (field) {
        case 'mailingAddressDifferent':
          newData.mailingAddress = { ...emptyMailingAddress };
          if (!onChange) {
            updateField('mailingAddress', { ...emptyMailingAddress });
          }
          break;
        case 'lesseeAddressDifferent':
          newData.lesseeAddress = { ...emptyAddress };
          if (!onChange) {
            updateField('lesseeAddress', { ...emptyAddress });
          }
          break;
        case 'trailerLocationDifferent':
          newData.trailerLocation = { ...emptyAddress };
          if (!onChange) {
            updateField('trailerLocation', { ...emptyAddress });
          }
          break;
      }
    }
    
    if (field === 'lesseeAddressDifferent' && checked) {
      newData.trailerLocationDifferent = false;
      if (!onChange) {
        updateField('trailerLocationDifferent', false);
        updateField('trailerLocation', { ...emptyAddress });
      }
      newData.trailerLocation = { ...emptyAddress };
    } else if (field === 'trailerLocationDifferent' && checked) {
      newData.lesseeAddressDifferent = false;
      if (!onChange) {
        updateField('lesseeAddressDifferent', false);
        updateField('lesseeAddress', { ...emptyAddress });
      }
      newData.lesseeAddress = { ...emptyAddress };
    }
    
    setAddressData(newData);
    
 
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(newData));
    }
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField(String(field), checked);
    }
  };

  const handleStateChange = (addressType: keyof FormData, stateAbbreviation: string) => {
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


  type AddressTypeMap = {
    [K in keyof FormData]?: keyof typeof dropdownRefs;
  };
  
  const addressTypeToRefKey: AddressTypeMap = {
    address: 'address',
    mailingAddress: 'mailingAddress',
    lesseeAddress: 'lesseeAddress',
    trailerLocation: 'trailerLocation'
  };
  const renderStateDropdown = (addressType: keyof FormData, value: string | undefined) => {
    const dropdownId = String(addressType);
    const refKey = addressTypeToRefKey[addressType];
    
    return (
      <div className="state-field" ref={refKey ? dropdownRefs[refKey] : null}>
        <label className="state-label">State</label>
        <div className="state-dropdown-wrapper">
          <button
            type="button"
            className="state-dropdown-button"
            onClick={() => setOpenDropdown(openDropdown === dropdownId ? null : dropdownId)}
          >
            {value || 'STATE'}
            <ChevronDownIcon 
              className={`${openDropdown === dropdownId ? 'rotate' : ''}`}
              style={{ width: '18px', height: '18px' }} 
            />
          </button>
          
          {openDropdown === dropdownId && (
            <div className="state-dropdown-menu">
              {states.map((state) => (
                <div
                  key={state.abbreviation}
                  className="state-dropdown-item"
                  onClick={() => handleStateChange(addressType, state.abbreviation)}
                >
                  {state.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

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
              className="formInput"
              type="text"
              placeholder="Street"
              value={addressData.address?.street || ''}
              onChange={(e) => handleAddressChange('address', 'street', e.target.value)}
            />
          </div>
          <div className="formGroup aptField">
            <label className="formLabel">APT./SPACE/STE.#</label>
            <input
              className="formInput"
              type="text"
              placeholder="APT./SPACE/STE.#"
              value={addressData.address?.apt || ''}
              onChange={(e) => handleAddressChange('address', 'apt', e.target.value)}
            />
          </div>
        </div>
        <div className="city-state-zip-group">
          <div className="cityFieldCustomWidth">
            <label className="formLabel">City</label>
            <input
              className="cityInputtt"
              type="text"
              placeholder="City"
              value={addressData.address?.city || ''}
              onChange={(e) => handleAddressChange('address', 'city', e.target.value)}
            />
          </div>
          
          {/* State Dropdown for Main Address */}
          {renderStateDropdown('address', addressData.address?.state)}
          
          <div className="formGroup zipCodeField">
            <label className="formLabel">ZIP Code</label>
            <input
              className="formInput"
              type="text"
              placeholder="Zip Code"
              value={addressData.address?.zip || ''}
              onChange={(e) => handleAddressChange('address', 'zip', e.target.value)}
            />
          </div>
          
        </div>
        <div className="countyField">
  <label className="formLabel">County</label>
  <input
    className="cityInputtt"
    type="text"
    placeholder="County"
    value={addressData.address?.county || ''}
    onChange={(e) => handleAddressChange('address', 'county', e.target.value)}
  />
</div>

      </div>

      {(!isMultipleTransfer || addressData.mailingAddressDifferent) && addressData.mailingAddressDifferent && (
        <div className="addressWrapper">
          <h3 className="addressHeading">Mailing Address</h3>
          <div className="streetAptGroup">
            <div className="formGroup streetField">
              <label className="formLabel">Street</label>
              <input
                className="formInput"
                type="text"
                placeholder="Street"
                value={addressData.mailingAddress?.street || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'street', e.target.value)}
              />
            </div>
            <div className="formGroup aptField">
              <label className="formLabel">APT./SPACE/STE.#</label>
              <input
                className="formInput"
                type="text"
                placeholder="APT./SPACE/STE.#"
                value={addressData.mailingAddress?.poBox || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'poBox', e.target.value)}
              />
            </div>
          </div>
          <div className="city-state-zip-group">
            <div className="cityFieldCustomWidth">
              <label className="formLabel">City</label>
              <input
                className="cityInputtt"
                type="text"
                placeholder="City"
                value={addressData.mailingAddress?.city || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'city', e.target.value)}
              />
            </div>
            
            {renderStateDropdown('mailingAddress', addressData.mailingAddress?.state)}
          
            <div className="formGroup zipCodeField">
              <label className="formLabel">ZIP Code</label>
              <input
                className="formInput"
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
                className="formInput"
                type="text"
                placeholder="Street"
                value={addressData.lesseeAddress?.street || ''}
                onChange={(e) => handleAddressChange('lesseeAddress', 'street', e.target.value)}
              />
            </div>
            <div className="formGroup aptField">
              <label className="formLabel">APT./SPACE/STE.#</label>
              <input
                className="formInput"
                type="text"
                placeholder="APT./SPACE/STE.#"
                value={addressData.lesseeAddress?.apt || ''}
                onChange={(e) => handleAddressChange('lesseeAddress', 'apt', e.target.value)}
              />
            </div>
          </div>
          <div className="city-state-zip-group">
            <div className="cityFieldCustomWidth">
              <label className="formLabel">City</label>
              <input
                className="cityInputtt"
                type="text"
                placeholder="City"
                value={addressData.lesseeAddress?.city || ''}
                onChange={(e) => handleAddressChange('lesseeAddress', 'city', e.target.value)}
              />
            </div>
            
            {renderStateDropdown('lesseeAddress', addressData.lesseeAddress?.state)}
           
            <div className="formGroup zipCodeField">
              <label className="formLabel">ZIP Code</label>
              <input
                className="formInput"
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
                className="formInput"
                type="text"
                placeholder="Street"
                value={addressData.trailerLocation?.street || ''}
                onChange={(e) => handleAddressChange('trailerLocation', 'street', e.target.value)}
              />
            </div>
            <div className="formGroup aptField">
              <label className="formLabel">APT./SPACE/STE.#</label>
              <input
                className="formInput"
                type="text"
                placeholder="APT./SPACE/STE.#"
                value={addressData.trailerLocation?.apt || ''}
                onChange={(e) => handleAddressChange('trailerLocation', 'apt', e.target.value)}
              />
            </div>
          </div>
          <div className="city-state-zip-group">
            <div className="cityFieldCustomWidth">
              <label className="formLabel">City</label>
              <input
                className="cityInputtt"
                type="text"
                placeholder="City"
                value={addressData.trailerLocation?.city || ''}
                onChange={(e) => handleAddressChange('trailerLocation', 'city', e.target.value)}
              />
            </div>
            
            {renderStateDropdown('trailerLocation', addressData.trailerLocation?.state)}
           
            <div className="formGroup zipCodeField">
              <label className="formLabel">ZIP Code</label>
              <input
                className="formInput"
                type="text"
                placeholder="ZIP Code"
                value={addressData.trailerLocation?.zip || ''}
                onChange={(e) => handleAddressChange('trailerLocation', 'zip', e.target.value)}
              />
            </div>
          </div>
          <div className="countyField">
            <label className="formLabel">County</label>
            <input
              className="cityInputtt"
              type="text"
              placeholder="County"
              value={addressData.trailerLocation?.county || ''}
              onChange={(e) => handleAddressChange('trailerLocation', 'county', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Address;