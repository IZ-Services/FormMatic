import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider'; 
import { useScenarioContext } from '../../context/ScenarioContext';

interface Address {
  street?: string;
  apt?: string;
  city?: string;
  state?: string;
  zip?: string;
  poBox?: string;
  county?: string; 
  isOutOfState?: boolean;
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
  hideMailingOption?: boolean;
  hideOutOfState?: boolean;
}

const initialAddress: Address = {
  street: '',
  apt: '',
  city: '',
  state: '',
  zip: '',
  poBox: '',
  county: '',
  isOutOfState: false
};

const cleanFormData = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  
  const result: any = {};
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    
    if (key === 'sellerAddress' && value && typeof value === 'object' && 
        (value.sellerAddress !== undefined)) {
      const { street, apt, city, state, zip, poBox, county, isOutOfState } = value;
      result[key] = { street, apt, city, state, zip, poBox, county, isOutOfState };
    } else {
      result[key] = value;
    }
  });
  
  return result;
};


const capitalizeWords = (value: string): string => {
  if (!value) return '';
  

  return value.replace(/\b\w/g, (char) => char.toUpperCase());
};

const SellerAddress: React.FC<SellerAddressProps> = ({ 
  formData: propFormData, 
  onChange, 
  isMultipleTransfer = false,
  hideMailingOption = false,
  hideOutOfState = false
}) => {
  const cleanedFormData = cleanFormData(propFormData);
  const { activeScenarios } = useScenarioContext();
  

  const shouldShowOutOfStateCheckbox = () => {
    if (hideOutOfState) {
      return true;
    }
    return !!(
      activeScenarios && (
        activeScenarios["Commercial Vehicle"]
      )
    );
  };


  const shouldHideMailingOption = () => {
    if (hideMailingOption) {
      return true;
    }
    
    return !!(
      activeScenarios && (
        activeScenarios["Salvage"]
      )
    );
  };
  
  const hideMailingAddress = shouldHideMailingOption();
  const showOutOfStateCheckbox = shouldShowOutOfStateCheckbox();
  
  const [addressData, setAddressData] = useState<FormData>({
    sellerMailingAddressDifferent: hideMailingAddress ? false : (cleanedFormData?.sellerMailingAddressDifferent || false),
    sellerAddress: cleanedFormData?.sellerAddress || { ...initialAddress },
    sellerMailingAddress: cleanedFormData?.sellerMailingAddress || { ...initialAddress }
  });
  
  const { formData: contextFormData, updateField } = useFormContext() as {
    formData: Record<string, any>;
    updateField: (section: string, value: any) => void;
  };

  useEffect(() => {
    console.log("Should hide mailing option:", hideMailingAddress);
    console.log("Should show out-of-state checkbox:", showOutOfStateCheckbox);
    console.log("Active scenarios:", activeScenarios);
    console.log("Direct hideMailingOption prop:", hideMailingOption);
  }, [hideMailingAddress, showOutOfStateCheckbox, activeScenarios, hideMailingOption]);

  useEffect(() => {
    if (propFormData) {
      const cleanedProps = cleanFormData(propFormData);
      
      const newData = { ...addressData };
      let hasChanges = false;

      if (!hideMailingAddress && cleanedProps.sellerMailingAddressDifferent !== undefined && 
          cleanedProps.sellerMailingAddressDifferent !== addressData.sellerMailingAddressDifferent) {
        newData.sellerMailingAddressDifferent = cleanedProps.sellerMailingAddressDifferent;
        hasChanges = true;
      } else if (hideMailingAddress && newData.sellerMailingAddressDifferent) {
        newData.sellerMailingAddressDifferent = false;
        hasChanges = true;
      }

      if (cleanedProps.sellerAddress) {
        newData.sellerAddress = { ...addressData.sellerAddress, ...cleanedProps.sellerAddress };
        hasChanges = true;
      }

      if (!hideMailingAddress && cleanedProps.sellerMailingAddress) {
        newData.sellerMailingAddress = { ...addressData.sellerMailingAddress, ...cleanedProps.sellerMailingAddress };
        hasChanges = true;
      }

      if (hasChanges) {
        setAddressData(newData);
      }
    }
  }, [propFormData, hideMailingAddress]);

  useEffect(() => {
    if (!onChange) {
      if (addressData.sellerAddress && typeof addressData.sellerAddress === 'object') {
        updateField('sellerAddress', addressData.sellerAddress);
      }
      
      if (!hideMailingAddress) {
        updateField('sellerMailingAddressDifferent', !!addressData.sellerMailingAddressDifferent);
        
        if (addressData.sellerMailingAddressDifferent && addressData.sellerMailingAddress && 
            typeof addressData.sellerMailingAddress === 'object') {
          updateField('sellerMailingAddress', addressData.sellerMailingAddress);
        }
      } else {
        updateField('sellerMailingAddressDifferent', false);
      }
    }
  }, [hideMailingAddress]);

  useEffect(() => {
    if (isMultipleTransfer) {
      console.log("SellerAddress: Multiple transfer mode detected");
      console.log("Initial addressData:", addressData);
      
      if (!onChange) {
        updateField('sellerAddress', addressData.sellerAddress);
        
        if (!hideMailingAddress) {
          updateField('sellerMailingAddressDifferent', !!addressData.sellerMailingAddressDifferent);
          updateField('sellerMailingAddress', addressData.sellerMailingAddress || { ...initialAddress });
        } else {
          updateField('sellerMailingAddressDifferent', false);
        }
      }
    }
  }, [isMultipleTransfer, hideMailingAddress]);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const dropdownRefs = {
    sellerAddress: useRef<HTMLDivElement>(null),
    sellerMailingAddress: useRef<HTMLDivElement>(null),
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

  const handleAddressChange = (section: keyof FormData, field: keyof Address, value: string | boolean) => {
    console.log(`Updating ${section}.${field} to:`, value);
    
    const newData = { ...addressData };
    
    if (!newData[section]) {
      if (section === 'sellerAddress' || section === 'sellerMailingAddress') {
        newData[section] = { ...initialAddress } as any;
      } else if (section === 'sellerMailingAddressDifferent') {
        newData[section] = false as any;
      }
    }
    
    const currentSection = (newData[section] as Address) || {};
    

    let processedValue = value;
    if (typeof value === 'string' && field !== 'zip' && field !== 'state') {
      processedValue = capitalizeWords(value);
    }
    
    const updatedSection = {
      ...currentSection,
      [field]: processedValue
    };
    
    newData[section] = updatedSection as any;
    
    setAddressData(newData);
    
    console.log(`Updated ${section} data:`, updatedSection);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField(String(section), updatedSection);
      
      if (isMultipleTransfer) {
        console.log(`Multiple transfer update for ${section}.${field}:`, processedValue);
      }
    }
  };

  const handleCheckboxChange = (field: keyof FormData, checked: boolean) => {
    if (hideMailingAddress && field === 'sellerMailingAddressDifferent') {
      return;
    }
    
    console.log(`Checkbox clicked: ${field} to ${checked}`);
    
    const newData = { ...addressData };
    newData[field] = checked;
    
    if (field === 'sellerMailingAddressDifferent' && !checked) {
      newData.sellerMailingAddress = { ...initialAddress };
      console.log("Clearing mailing address fields:", newData.sellerMailingAddress);
    } else if (field === 'sellerMailingAddressDifferent' && checked) {
      if (!newData.sellerMailingAddress || Object.keys(newData.sellerMailingAddress).length === 0) {
        newData.sellerMailingAddress = { ...initialAddress };
      }
      console.log("Initialized sellerMailingAddress:", newData.sellerMailingAddress);
    }
    
    setAddressData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField(String(field), checked);
      
      if (field === 'sellerMailingAddressDifferent') {
        updateField('sellerMailingAddress', newData.sellerMailingAddress);
      }
    }
  };

  const handleOutOfStateChange = (checked: boolean) => {
    const newData = { ...addressData };
    if (!newData.sellerAddress) {
      newData.sellerAddress = { ...initialAddress };
    }
    
    newData.sellerAddress.isOutOfState = checked;
    
    setAddressData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField('sellerAddress', newData.sellerAddress);
    }
  };

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

  const renderStateDropdown = (addressType: keyof FormData, value: string | undefined) => {
    const dropdownId = String(addressType);
    const refKey = addressType as keyof typeof dropdownRefs;
    
    return (
      <div className="state-field" ref={dropdownRefs[refKey]}>
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
                  onClick={() => {
                    handleAddressChange(addressType, 'state', state.abbreviation);
                    setOpenDropdown(null);
                  }}
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

  return (
    <div>
      <style>{`
        .state-dropdown-wrapper {
          position: relative;
          width: 120px;
        }

        .state-dropdown-button {
          width: 100%;
          padding: 10px 12px;
          background-color: white;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 16px;
          color: #495057;
          text-align: left;
          height: 35px;
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
          height: 170px;
          max-height: 300px;
          overflow-y: auto;
          background-color: white;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 4px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
          margin-top: 2px;
        }

        .state-dropdown-item {
          padding: 7px 15px;
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

        

        .state-label {
          display: block;
          margin-bottom: 5px;
          font-size: 14px;
          font-weight: 400;
          color: #333;
        }
        
        .out-of-state-checkbox {
          margin-top: 10px;
          padding: 5px 0;
          display: flex;
          align-items: center;
        }
        
        .out-of-state-checkbox input {
          margin-right: 8px;
        }
        
        .out-of-state-checkbox p {
          font-size: 14px;
          margin: 0;
        }
      `}</style>

      <div className="addressWrapper">
        <div className="addressCheckboxWrapper">
          <h4 className="addressHeading">Address</h4>
          {/* Only show the mailing address checkbox if not hidden */}
          {!hideMailingAddress && (
            <div className="checkboxSection">
              <input
                type="checkbox"
                className="checkBoxAddress"
                checked={!!addressData.sellerMailingAddressDifferent}
                onChange={(e) => handleCheckboxChange('sellerMailingAddressDifferent', e.target.checked)}
              />
              <p>If mailing address is different</p>
            </div>
          )}
        </div>

        {/* Main Seller Address */}
        <div className="streetAptGroup">
          <div className="formGroup streetField">
            <label className="formLabel">Street</label>
            <input
              className="formInput"
              type="text"
              placeholder="Street"
              value={addressData.sellerAddress?.street || ''}
              onChange={(e) => handleAddressChange('sellerAddress', 'street', e.target.value)}
            />
          </div>
          <div className="formGroup aptField">
            <label className="formLabel">APT./SPACE/STE.#</label>
            <input
              className="formInput"
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
              className="cityInputtt"
              type="text"
              placeholder="City"
              value={addressData.sellerAddress?.city || ''}
              onChange={(e) => handleAddressChange('sellerAddress', 'city', e.target.value)}
            />
          </div>

          <div className="cityFieldCustomWidth">
            <label className="formLabel">County</label>
            <input
              className="cityInputtt"
              type="text"
              placeholder="County"
              value={addressData.sellerAddress?.county || ''}
              onChange={(e) => handleAddressChange('sellerAddress', 'county', e.target.value)}
            />
          </div>
          
          {/* State Dropdown for Seller Address - New implementation */}
          {renderStateDropdown('sellerAddress', addressData.sellerAddress?.state)}
          
          <div className="formGroup zipCodeField">
            <label className="formLabel">ZIP Code</label>
            <input
              className="formInput"
              type="text"
              placeholder="Zip Code"
              value={addressData.sellerAddress?.zip || ''}
              onChange={(e) => handleAddressChange('sellerAddress', 'zip', e.target.value)}
            />
          </div>
        </div>
        
        {/* New Out-of-State Checkbox - Only show when Commercial Vehicle is selected */}
        {showOutOfStateCheckbox && (
          <div className="out-of-state-checkbox">
            <input
              type="checkbox"
              checked={!!addressData.sellerAddress?.isOutOfState}
              onChange={(e) => handleOutOfStateChange(e.target.checked)}
            />
            <p>If no California county and used out-of-state, check this box</p>
          </div>
        )}
      </div>

      {/* Mailing Address - only show if checkbox is checked AND mailing option is not hidden */}
      {!hideMailingAddress && addressData.sellerMailingAddressDifferent && (
        <div className="addressWrapper">
          <h3 className="addressHeading">Mailing Address</h3>
          <div className="streetAptGroup">
            <div className="formGroup streetField">
              <label className="formLabel">Street</label>
              <input
                className="formInput"
                type="text"
                placeholder="Street"
                value={addressData.sellerMailingAddress?.street || ''}
                onChange={(e) => handleAddressChange('sellerMailingAddress', 'street', e.target.value)}
              />
            </div>
            <div className="formGroup aptField">
              <label className="formLabel">APT./SPACE/STE.#</label>
              <input
                className="formInput"
                type="text"
                placeholder="APT./SPACE/STE.#"
                value={addressData.sellerMailingAddress?.poBox || ''}
                onChange={(e) => handleAddressChange('sellerMailingAddress', 'poBox', e.target.value)}
              />
            </div>
          </div>
          <div className="cityStateZipGroupp">
            <div className="cityFieldCustomWidth">
              <label className="formLabel">City</label>
              <input
                className="cityInputtt"
                type="text"
                placeholder="City"
                value={addressData.sellerMailingAddress?.city || ''}
                onChange={(e) => handleAddressChange('sellerMailingAddress', 'city', e.target.value)}
              />
            </div>

            {/* State Dropdown for Mailing Address - New implementation */}
            {renderStateDropdown('sellerMailingAddress', addressData.sellerMailingAddress?.state)}
            
            <div className="formGroup zipCodeField">
              <label className="formLabel">ZIP Code</label>
              <input
                className="formInput"
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