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
  showMailingCounty?: boolean;
  transferIndex?: number; // New prop to identify which transfer this belongs to
}

// Form context type with validation properties
interface FormContextType {
  formData: Record<string, any>;
  updateField: (section: string, value: any) => void;
  clearFormTriggered?: number | null; // Updated to match SellerSection
  validationErrors: Array<{ fieldPath: string; message: string }>;
  showValidationErrors: boolean;
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

// Base storage key that will be prefixed with transfer index
export const SELLER_ADDRESS_STORAGE_KEY = 'formmatic_seller_address';

// Get the storage key specific to a transfer index
export const getSellerAddressStorageKey = (transferIndex?: number) => {
  if (transferIndex === undefined) {
    return SELLER_ADDRESS_STORAGE_KEY;
  }
  return `${SELLER_ADDRESS_STORAGE_KEY}_transfer_${transferIndex}`;
};

// Clear storage for a specific transfer
export const clearSellerAddressStorage = (transferIndex?: number) => {
  if (typeof window !== 'undefined') {
    const storageKey = getSellerAddressStorageKey(transferIndex);
    localStorage.removeItem(storageKey);
    console.log(`Seller address data cleared from localStorage for transfer ${transferIndex !== undefined ? transferIndex : 'default'}`);
  }
};

// Clear all seller address storage (useful for complete reset)
export const clearAllSellerAddressStorage = () => {
  if (typeof window !== 'undefined') {
    // Clear default
    localStorage.removeItem(SELLER_ADDRESS_STORAGE_KEY);
    
    // Clear all numbered transfers (0-4 for max 5 transfers)
    for (let i = 0; i < 5; i++) {
      localStorage.removeItem(`${SELLER_ADDRESS_STORAGE_KEY}_transfer_${i}`);
    }
    console.log('All Seller address data cleared from localStorage');
  }
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
  hideOutOfState = false,
  showMailingCounty = false,
  transferIndex
}) => {
  const cleanedFormData = cleanFormData(propFormData);
  const { activeScenarios } = useScenarioContext();
  const [isInitialized, setIsInitialized] = useState(false);

  const { 
    formData: contextFormData, 
    updateField, 
    clearFormTriggered,
    validationErrors,
    showValidationErrors 
  } = useFormContext() as FormContextType;

  // Get the storage key for this specific transfer
  const storageKey = getSellerAddressStorageKey(transferIndex);

  // Helper functions for validation
  const shouldShowValidationError = (addressType: string, field: string) => {
    if (!showValidationErrors) return false;
    
    // Update the validation path to include transfer index when needed
    const fieldPath = transferIndex !== undefined
      ? `transfer${transferIndex}_${addressType}.${field}`
      : `${addressType}.${field}`;
    
    return validationErrors.some(error => 
      error.fieldPath === fieldPath
    );
  };
  
  const getValidationErrorMessage = (addressType: string, field: string): string => {
    // Update the validation path to include transfer index when needed
    const fieldPath = transferIndex !== undefined
      ? `transfer${transferIndex}_${addressType}.${field}`
      : `${addressType}.${field}`;
    
    const error = validationErrors.find(e => e.fieldPath === fieldPath);
    return error ? error.message : '';
  };

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
  
  const defaultAddressData: FormData = {
    sellerMailingAddressDifferent: hideMailingAddress ? false : false,
    sellerAddress: { ...initialAddress },
    sellerMailingAddress: { ...initialAddress }
  };
  
  const [addressData, setAddressData] = useState<FormData>(defaultAddressData);

  useEffect(() => {
    if (clearFormTriggered) {
      console.log(`Clear form triggered in SellerAddress component for transfer ${transferIndex !== undefined ? transferIndex : 'default'}`);
      clearSellerAddressStorage(transferIndex);
      setAddressData(defaultAddressData);
      
      // Use the appropriate field name based on transfer index
      const addressFieldName = transferIndex !== undefined 
        ? `transfer${transferIndex}_sellerAddress` 
        : 'sellerAddress';
        
      const mailingDiffFieldName = transferIndex !== undefined 
        ? `transfer${transferIndex}_sellerMailingAddressDifferent` 
        : 'sellerMailingAddressDifferent';
        
      const mailingAddressFieldName = transferIndex !== undefined 
        ? `transfer${transferIndex}_sellerMailingAddress` 
        : 'sellerMailingAddress';
      
      updateField(addressFieldName, { ...initialAddress });
      updateField(mailingDiffFieldName, false);
      updateField(mailingAddressFieldName, { ...initialAddress });
    }
  }, [clearFormTriggered, transferIndex, updateField]);

  // This effect should only run once when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const savedData = localStorage.getItem(storageKey);
        
        if (savedData) {
          console.log(`Loading seller address data from localStorage for transfer ${transferIndex !== undefined ? transferIndex : 'default'}`);
          const parsedData = JSON.parse(savedData);
          
          const mergedData = {
            ...defaultAddressData,
            ...parsedData,
            ...cleanedFormData
          };
          
          if (hideMailingAddress) {
            mergedData.sellerMailingAddressDifferent = false;
          }
          
          setAddressData(mergedData);
          
          // Use the appropriate field name based on transfer index
          const addressFieldName = transferIndex !== undefined 
            ? `transfer${transferIndex}_sellerAddress` 
            : 'sellerAddress';
            
          const mailingDiffFieldName = transferIndex !== undefined 
            ? `transfer${transferIndex}_sellerMailingAddressDifferent` 
            : 'sellerMailingAddressDifferent';
            
          const mailingAddressFieldName = transferIndex !== undefined 
            ? `transfer${transferIndex}_sellerMailingAddress` 
            : 'sellerMailingAddress';
          
          // First-time initialization from localStorage
          updateField(addressFieldName, mergedData.sellerAddress);
          updateField(mailingDiffFieldName, mergedData.sellerMailingAddressDifferent);
          
          if (mergedData.sellerMailingAddressDifferent && !hideMailingAddress) {
            updateField(mailingAddressFieldName, mergedData.sellerMailingAddress);
          }
          
          if (onChange) {
            onChange(mergedData);
          }
        } else {
          const mergedData = {
            ...defaultAddressData,
            ...cleanedFormData
          };
          setAddressData(mergedData);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error(`Error loading saved seller address for transfer ${transferIndex !== undefined ? transferIndex : 'default'}:`, error);
        setIsInitialized(true);
        
        const mergedData = {
          ...defaultAddressData,
          ...cleanedFormData
        };
        setAddressData(mergedData);
      }
    }
  // Empty dependency array - this should only run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("Should hide mailing option:", hideMailingAddress);
    console.log("Should show out-of-state checkbox:", showOutOfStateCheckbox);
    console.log("Should show mailing county field:", showMailingCounty);
    console.log("Active scenarios:", activeScenarios);
    console.log("Direct hideMailingOption prop:", hideMailingOption);
    console.log("Transfer index:", transferIndex);
  }, [hideMailingAddress, showOutOfStateCheckbox, showMailingCounty, activeScenarios, hideMailingOption, transferIndex]);

  // Track previous props to avoid unnecessary updates
  const prevPropFormDataRef = useRef<FormData | undefined>(undefined);
  
  useEffect(() => {
    if (isInitialized && propFormData) {
      // Skip if props haven't changed
      if (prevPropFormDataRef.current === propFormData) {
        return;
      }
      
      prevPropFormDataRef.current = propFormData;
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
        
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, JSON.stringify(newData));
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propFormData, hideMailingAddress, isInitialized, storageKey]);

  // This useEffect was causing infinite updates
  // We need to make sure it only runs when really needed
  const [lastUpdatedData, setLastUpdatedData] = useState<string>('');
  
  useEffect(() => {
    if (isInitialized && !onChange) {
      // Convert addressData to string to easily compare against previous state
      const currentAddressDataStr = JSON.stringify({
        sellerAddress: addressData.sellerAddress,
        sellerMailingAddressDifferent: addressData.sellerMailingAddressDifferent,
        sellerMailingAddress: addressData.sellerMailingAddressDifferent ? addressData.sellerMailingAddress : null
      });
      
      // Only update if data actually changed
      if (currentAddressDataStr !== lastUpdatedData) {
        // Use the appropriate field name based on transfer index
        const addressFieldName = transferIndex !== undefined 
          ? `transfer${transferIndex}_sellerAddress` 
          : 'sellerAddress';
          
        const mailingDiffFieldName = transferIndex !== undefined 
          ? `transfer${transferIndex}_sellerMailingAddressDifferent` 
          : 'sellerMailingAddressDifferent';
          
        const mailingAddressFieldName = transferIndex !== undefined 
          ? `transfer${transferIndex}_sellerMailingAddress` 
          : 'sellerMailingAddress';
        
        if (addressData.sellerAddress && typeof addressData.sellerAddress === 'object') {
          updateField(addressFieldName, addressData.sellerAddress);
        }
        
        if (!hideMailingAddress) {
          updateField(mailingDiffFieldName, !!addressData.sellerMailingAddressDifferent);
          
          if (addressData.sellerMailingAddressDifferent && addressData.sellerMailingAddress && 
              typeof addressData.sellerMailingAddress === 'object') {
            updateField(mailingAddressFieldName, addressData.sellerMailingAddress);
          }
        } else {
          updateField(mailingDiffFieldName, false);
        }
        
        // Save current data to avoid infinite updates
        setLastUpdatedData(currentAddressDataStr);
      }
    }
  }, [hideMailingAddress, addressData, isInitialized, transferIndex, updateField, onChange, lastUpdatedData]);

  // Track the last multiple transfer update to prevent infinite loops
  const [lastMultiTransferUpdate, setLastMultiTransferUpdate] = useState<string>('');
  
  useEffect(() => {
    if (isInitialized && isMultipleTransfer && !onChange) {
      console.log(`SellerAddress: Multiple transfer mode detected for transfer ${transferIndex !== undefined ? transferIndex : 'default'}`);
      
      // Create a string representation of current data to compare
      const currentDataStr = JSON.stringify({
        sellerAddress: addressData.sellerAddress,
        sellerMailingAddressDifferent: addressData.sellerMailingAddressDifferent,
        sellerMailingAddress: addressData.sellerMailingAddress
      });
      
      // Only update if the data has changed from last update
      if (currentDataStr !== lastMultiTransferUpdate) {
        console.log("Updating multiple transfer data");
        
        // Use the appropriate field name based on transfer index
        const addressFieldName = transferIndex !== undefined 
          ? `transfer${transferIndex}_sellerAddress` 
          : 'sellerAddress';
          
        const mailingDiffFieldName = transferIndex !== undefined 
          ? `transfer${transferIndex}_sellerMailingAddressDifferent` 
          : 'sellerMailingAddressDifferent';
          
        const mailingAddressFieldName = transferIndex !== undefined 
          ? `transfer${transferIndex}_sellerMailingAddress` 
          : 'sellerMailingAddress';
        
        updateField(addressFieldName, addressData.sellerAddress);
        
        if (!hideMailingAddress) {
          updateField(mailingDiffFieldName, !!addressData.sellerMailingAddressDifferent);
          updateField(mailingAddressFieldName, addressData.sellerMailingAddress || { ...initialAddress });
        } else {
          updateField(mailingDiffFieldName, false);
        }
        
        // Update the last state we processed
        setLastMultiTransferUpdate(currentDataStr);
      }
    }
  }, [isMultipleTransfer, hideMailingAddress, isInitialized, addressData, transferIndex, updateField, onChange, lastMultiTransferUpdate]);

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
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(newData));
    }
    
    if (onChange) {
      onChange(newData);
    } else {
      // Use the appropriate field name based on transfer index
      const fieldName = transferIndex !== undefined 
        ? `transfer${transferIndex}_${String(section)}` 
        : String(section);
        
      updateField(fieldName, updatedSection);
      
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
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(newData));
    }
    
    if (onChange) {
      onChange(newData);
    } else {
      // Use the appropriate field name based on transfer index
      const fieldName = transferIndex !== undefined 
        ? `transfer${transferIndex}_${String(field)}` 
        : String(field);
        
      updateField(fieldName, checked);
      
      if (field === 'sellerMailingAddressDifferent') {
        // Use the appropriate field name for mailing address based on transfer index
        const mailingAddressFieldName = transferIndex !== undefined 
          ? `transfer${transferIndex}_sellerMailingAddress` 
          : 'sellerMailingAddress';
          
        updateField(mailingAddressFieldName, newData.sellerMailingAddress);
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
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(newData));
    }
    
    if (onChange) {
      onChange(newData);
    } else {
      // Use the appropriate field name based on transfer index
      const fieldName = transferIndex !== undefined 
        ? `transfer${transferIndex}_sellerAddress` 
        : 'sellerAddress';
        
      updateField(fieldName, newData.sellerAddress);
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
            className={`state-dropdown-button ${shouldShowValidationError(String(addressType), 'state') ? 'validation-error' : ''}`}
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
          
          {shouldShowValidationError(String(addressType), 'state') && (
            <p className="validation-message">{getValidationErrorMessage(String(addressType), 'state')}</p>
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
        
        .state-dropdown-button.validation-error {
          border-color: #dc3545;
          background-color: #fff8f8;
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
        
        .validation-error {
          border-color: #dc3545;
          background-color: #fff8f8;
        }

        .validation-message {
          color: #dc3545;
          font-size: 12px;
          margin-top: 4px;
          margin-bottom: 0;
        }
        
        .formInput.validation-error,
        .cityInputtt.validation-error {
          border-color: #dc3545;
          background-color: #fff8f8;
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
              className={`formInput ${shouldShowValidationError('sellerAddress', 'street') ? 'validation-error' : ''}`}
              type="text"
              placeholder="Street"
              value={addressData.sellerAddress?.street || ''}
              onChange={(e) => handleAddressChange('sellerAddress', 'street', e.target.value)}
            />
            {shouldShowValidationError('sellerAddress', 'street') && (
              <p className="validation-message">{getValidationErrorMessage('sellerAddress', 'street')}</p>
            )}
          </div>
          <div className="formGroup aptField">
            <label className="formLabel">APT./SPACE/STE.#</label>
            <input
              className={`formInput ${shouldShowValidationError('sellerAddress', 'apt') ? 'validation-error' : ''}`}
              type="text"
              placeholder="APT./SPACE/STE.#"
              value={addressData.sellerAddress?.apt || ''}
              onChange={(e) => handleAddressChange('sellerAddress', 'apt', e.target.value)}
            />
            {shouldShowValidationError('sellerAddress', 'apt') && (
              <p className="validation-message">{getValidationErrorMessage('sellerAddress', 'apt')}</p>
            )}
          </div>
        </div>
        <div className="cityStateZipGroupp">
          <div className="cityFieldCustomWidth">
            <label className="formLabel">City</label>
            <input
              className={`cityInputtt ${shouldShowValidationError('sellerAddress', 'city') ? 'validation-error' : ''}`}
              type="text"
              placeholder="City"
              value={addressData.sellerAddress?.city || ''}
              onChange={(e) => handleAddressChange('sellerAddress', 'city', e.target.value)}
            />
            {shouldShowValidationError('sellerAddress', 'city') && (
              <p className="validation-message">{getValidationErrorMessage('sellerAddress', 'city')}</p>
            )}
          </div>

          <div className="cityFieldCustomWidth">
            <label className="formLabel">County</label>
            <input
              className={`cityInputtt ${shouldShowValidationError('sellerAddress', 'county') ? 'validation-error' : ''}`}
              type="text"
              placeholder="County"
              value={addressData.sellerAddress?.county || ''}
              onChange={(e) => handleAddressChange('sellerAddress', 'county', e.target.value)}
            />
            {shouldShowValidationError('sellerAddress', 'county') && (
              <p className="validation-message">{getValidationErrorMessage('sellerAddress', 'county')}</p>
            )}
          </div>
          
          {/* State Dropdown for Seller Address - New implementation */}
          {renderStateDropdown('sellerAddress', addressData.sellerAddress?.state)}
          
          <div className="formGroup zipCodeField">
            <label className="formLabel">ZIP Code</label>
            <input
              className={`formInput ${shouldShowValidationError('sellerAddress', 'zip') ? 'validation-error' : ''}`}
              type="text"
              placeholder="Zip Code"
              value={addressData.sellerAddress?.zip || ''}
              onChange={(e) => handleAddressChange('sellerAddress', 'zip', e.target.value)}
            />
            {shouldShowValidationError('sellerAddress', 'zip') && (
              <p className="validation-message">{getValidationErrorMessage('sellerAddress', 'zip')}</p>
            )}
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
          className={`formInput ${shouldShowValidationError('sellerMailingAddress', 'street') ? 'validation-error' : ''}`}
          type="text"
          placeholder="Street"
          value={addressData.sellerMailingAddress?.street || ''}
          onChange={(e) => handleAddressChange('sellerMailingAddress', 'street', e.target.value)}
        />
        {shouldShowValidationError('sellerMailingAddress', 'street') && (
          <p className="validation-message">{getValidationErrorMessage('sellerMailingAddress', 'street')}</p>
        )}
      </div>
      <div className="formGroup aptField">
        <label className="formLabel">APT./SPACE/STE.#</label>
        <input
          className={`formInput ${shouldShowValidationError('sellerMailingAddress', 'poBox') ? 'validation-error' : ''}`}
          type="text"
          placeholder="APT./SPACE/STE.#"
          value={addressData.sellerMailingAddress?.poBox || ''}
          onChange={(e) => handleAddressChange('sellerMailingAddress', 'poBox', e.target.value)}
        />
        {shouldShowValidationError('sellerMailingAddress', 'poBox') && (
          <p className="validation-message">{getValidationErrorMessage('sellerMailingAddress', 'poBox')}</p>
        )}
      </div>
    </div>
    <div className="cityStateZipGroupp">
      <div className="cityFieldCustomWidth">
        <label className="formLabel">City</label>
        <input
          className={`cityInputtt ${shouldShowValidationError('sellerMailingAddress', 'city') ? 'validation-error' : ''}`}
          type="text"
          placeholder="City"
          value={addressData.sellerMailingAddress?.city || ''}
          onChange={(e) => handleAddressChange('sellerMailingAddress', 'city', e.target.value)}
        />
        {shouldShowValidationError('sellerMailingAddress', 'city') && (
          <p className="validation-message">{getValidationErrorMessage('sellerMailingAddress', 'city')}</p>
        )}
      </div>

      {/* Only show county field in mailing address when showMailingCounty is true */}
      {showMailingCounty && (
        <div className="cityFieldCustomWidth">
          <label className="formLabel">County</label>
          <input
            className={`cityInputtt ${shouldShowValidationError('sellerMailingAddress', 'county') ? 'validation-error' : ''}`}
            type="text"
            placeholder="County"
            value={addressData.sellerMailingAddress?.county || ''}
            onChange={(e) => handleAddressChange('sellerMailingAddress', 'county', e.target.value)}
          />
          {shouldShowValidationError('sellerMailingAddress', 'county') && (
            <p className="validation-message">{getValidationErrorMessage('sellerMailingAddress', 'county')}</p>
          )}
        </div>
      )}

      {/* State Dropdown for Mailing Address - New implementation */}
      {renderStateDropdown('sellerMailingAddress', addressData.sellerMailingAddress?.state)}
      
      <div className="formGroup zipCodeField">
        <label className="formLabel">ZIP Code</label>
        <input
          className={`formInput ${shouldShowValidationError('sellerMailingAddress', 'zip') ? 'validation-error' : ''}`}
          type="text"
          placeholder="ZIP Code"
          value={addressData.sellerMailingAddress?.zip || ''}
          onChange={(e) => handleAddressChange('sellerMailingAddress', 'zip', e.target.value)}
        />
        {shouldShowValidationError('sellerMailingAddress', 'zip') && (
          <p className="validation-message">{getValidationErrorMessage('sellerMailingAddress', 'zip')}</p>
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default SellerAddress;