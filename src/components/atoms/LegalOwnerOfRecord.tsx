'use client';
import React, { useState, useRef, useEffect, CSSProperties } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import './LegalOwnerOfRecord.css';

 
export const LEGAL_OWNER_STORAGE_KEY = 'formmatic_legal_owner';

 
export const clearLegalOwnerStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LEGAL_OWNER_STORAGE_KEY);
    console.log('Legal owner data cleared from localStorage');
  }
};

const dropdownStyles: Record<string, CSSProperties> = {
  dropdownWrapper: {
    position: 'relative',
    zIndex: 5,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 'calc(100% + 2px)',
    left: 0,
    width: '100%',
    maxHeight: '200px',
    overflowY: 'auto',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    zIndex: 9999,
    padding: 0,
    margin: 0,
    listStyle: 'none',
  },
  dropdownItem: {
    padding: '12px 16px',
    cursor: 'pointer',
    color:'rgb(150 148 148)',
    fontSize: '15px',
    borderBottom: '1px solid #f5f5f5',
    transition: 'background-color 0.2s ease',
  }
};

interface Address {
  street?: string;
  apt?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface MailingAddress {
  street?: string;
  poBox?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface LegalOwnerType {
  name?: string;
  eltNumber?: string;
  address?: Address;
  mailingAddressDifferent?: boolean;
  mailingAddress?: MailingAddress;
  date?: string;
  phoneNumber?: string;
  authorizedAgentName?: string;
  authorizedAgentTitle?: string;
}

interface LegalOwnerProps {
  formData?: {
    legalOwnerInformation?: LegalOwnerType;
    vehicleTransactionDetails?: {
      currentLienholder?: boolean;
      isOutOfStateTitle?: boolean;
    };
    commercialVehicle?: {
      isCommercial?: boolean;
      hasLienHolder?: boolean;
    };
  };
  onChange?: (data: LegalOwnerType) => void;
}

const initialAddress: Address = {
  street: '',
  apt: '',
  city: '',
  state: '',
  zip: ''
};

const initialMailingAddress: MailingAddress = {
  street: '',
  poBox: '',
  city: '',
  state: '',
  zip: ''
};

const initialLegalOwner: LegalOwnerType = {
  name: '',
  eltNumber: '',
  address: initialAddress,
  mailingAddressDifferent: false,
  mailingAddress: initialMailingAddress,
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

const LegalOwnerOfRecord: React.FC<LegalOwnerProps> = ({ formData: propFormData, onChange }) => {
  const { formData: contextFormData, updateField, clearFormTriggered } = useFormContext();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [legalOwnerData, setLegalOwnerData] = useState<LegalOwnerType>(initialLegalOwner);
  const [eltError, setEltError] = useState<string>('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const stateDropdownRef = useRef<HTMLDivElement>(null);
  const mailingStateDropdownRef = useRef<HTMLDivElement>(null);

  const formData = { ...contextFormData, ...propFormData };
  const isOutOfStateTitle = formData?.vehicleTransactionDetails?.isOutOfStateTitle === true;
  const isCommercial = formData?.commercialVehicle?.isCommercial === true || formData?.commercialVehicle?.hasLienHolder === true;
  
 
  const showMailingOption = isOutOfStateTitle || isCommercial;

 
  useEffect(() => {
    if (clearFormTriggered) {
      console.log('Clear form triggered in LegalOwnerOfRecord component');
      clearLegalOwnerStorage();
      setLegalOwnerData(initialLegalOwner);
      
 
      updateField('legalOwnerInformation', initialLegalOwner);
      
      if (onChange) {
        onChange(initialLegalOwner);
      }
    }
  }, [clearFormTriggered]);
  
 
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const savedData = localStorage.getItem(LEGAL_OWNER_STORAGE_KEY);
        
        if (savedData) {
          console.log("Loading legal owner data from localStorage");
          const parsedData = JSON.parse(savedData);
          
 
          const mergedData = {
            ...initialLegalOwner,
            ...parsedData,
            ...(propFormData?.legalOwnerInformation || {})
          };
          
          setLegalOwnerData(mergedData);
          
 
          updateField('legalOwnerInformation', mergedData);
          
          if (onChange) {
            onChange(mergedData);
          }
        } else if (propFormData?.legalOwnerInformation) {
 
          setLegalOwnerData(propFormData.legalOwnerInformation);
        } else {
 
          updateField('legalOwnerInformation', initialLegalOwner);
          if (onChange) {
            onChange(initialLegalOwner);
          }
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading saved legal owner data:', error);
        setIsInitialized(true);
        
 
        if (propFormData?.legalOwnerInformation) {
          setLegalOwnerData(propFormData.legalOwnerInformation);
        } else {
          updateField('legalOwnerInformation', initialLegalOwner);
          if (onChange) {
            onChange(initialLegalOwner);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!showMailingOption && legalOwnerData.mailingAddressDifferent) {
      const newData = { 
        ...legalOwnerData,
        mailingAddressDifferent: false,
        mailingAddress: {
          street: '',
          poBox: '',
          city: '',
          state: '',
          zip: ''
        }
      };
      setLegalOwnerData(newData);
      updateField('legalOwnerInformation', newData);
      
 
      if (typeof window !== 'undefined') {
        localStorage.setItem(LEGAL_OWNER_STORAGE_KEY, JSON.stringify(newData));
      }
      
      if (onChange) {
        onChange(newData);
      }
    }
  }, [showMailingOption]);

  useEffect(() => {
    const hasCurrentLienholder = propFormData?.vehicleTransactionDetails?.currentLienholder === true ||
                                propFormData?.commercialVehicle?.hasLienHolder === true;
    if (!hasCurrentLienholder && 
        legalOwnerData && 
        (legalOwnerData.name || 
         legalOwnerData.eltNumber ||
         legalOwnerData.address?.street || 
         legalOwnerData.address?.city || 
         legalOwnerData.address?.state || 
         legalOwnerData.address?.zip || 
         legalOwnerData.address?.apt ||
         legalOwnerData.mailingAddressDifferent ||
         (legalOwnerData.mailingAddress && Object.values(legalOwnerData.mailingAddress).some(val => val)) ||
         legalOwnerData.date ||
         legalOwnerData.phoneNumber ||
         legalOwnerData.authorizedAgentName ||
         legalOwnerData.authorizedAgentTitle)) {
      const resetData = { ...initialLegalOwner };
      setLegalOwnerData(resetData);
      updateField('legalOwnerInformation', resetData);
      
 
      if (typeof window !== 'undefined') {
        localStorage.setItem(LEGAL_OWNER_STORAGE_KEY, JSON.stringify(resetData));
      }
      
      if (onChange) {
        onChange(resetData);
      }
    }
  }, [propFormData?.vehicleTransactionDetails?.currentLienholder, propFormData?.commercialVehicle?.hasLienHolder]); 

  useEffect(() => {
    if (isInitialized && propFormData?.legalOwnerInformation) {
      setLegalOwnerData(propFormData.legalOwnerInformation);
    }
  }, [propFormData, isInitialized]);

  const handleInfoChange = (field: keyof LegalOwnerType, value: any) => {
    const newData = { ...legalOwnerData, [field]: value };
    setLegalOwnerData(newData);
    updateField('legalOwnerInformation', newData);
    
 
    if (typeof window !== 'undefined') {
      localStorage.setItem(LEGAL_OWNER_STORAGE_KEY, JSON.stringify(newData));
    }
    
    if (onChange) {
      onChange(newData);
    }
  };

  const handleMailingCheckboxChange = (checked: boolean) => {
    const newData = { ...legalOwnerData };
    newData.mailingAddressDifferent = checked;
    
    if (!checked && newData.mailingAddress) {
      newData.mailingAddress = {
        street: '',
        poBox: '',
        city: '',
        state: '',
        zip: ''
      };
    }
    
    setLegalOwnerData(newData);
    updateField('legalOwnerInformation', newData);
    
 
    if (typeof window !== 'undefined') {
      localStorage.setItem(LEGAL_OWNER_STORAGE_KEY, JSON.stringify(newData));
    }
    
    if (onChange) {
      onChange(newData);
    }
  };

  const handleEltChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    const truncatedValue = digitsOnly.slice(0, 3);
    
    if (value !== truncatedValue) {
      setEltError('ELT Number must be exactly 3 digits');
    } else if (truncatedValue.length > 0 && truncatedValue.length < 3) {
      setEltError('ELT Number must be exactly 3 digits');
    } else {
      setEltError('');
    }
    
    handleInfoChange('eltNumber', truncatedValue);
  };

  const handleAddressChange = (addressType: 'address' | 'mailingAddress', field: string, value: string) => {
    const newData = { ...legalOwnerData };
    newData[addressType] = {
      ...(newData[addressType] || {}),
      [field]: value
    };
    setLegalOwnerData(newData);
    updateField('legalOwnerInformation', newData);
    
 
    if (typeof window !== 'undefined') {
      localStorage.setItem(LEGAL_OWNER_STORAGE_KEY, JSON.stringify(newData));
    }
    
    if (onChange) {
      onChange(newData);
    }
  };
  
  const handleToggleDropdown = (dropdown: string) => {
    setOpenDropdown(prev => (prev === dropdown ? null : dropdown));
  };
  
  const handleStateSelect = (dropdown: string, stateAbbreviation: string) => {
    const addressType = dropdown === 'mailing' ? 'mailingAddress' : 'address';
    handleAddressChange(addressType, 'state', stateAbbreviation);
    setOpenDropdown(null);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      
      if (stateDropdownRef.current && 
          !stateDropdownRef.current.contains(target) && 
          openDropdown === 'reg') {
        setOpenDropdown(null);
      }
      
      if (mailingStateDropdownRef.current && 
          !mailingStateDropdownRef.current.contains(target) && 
          openDropdown === 'mailing') {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const containerStyle: CSSProperties = { 
    position: 'relative', 
    overflow: 'visible' 
  };
  
  const cityStateZipStyle: CSSProperties = { 
    position: 'relative', 
    overflow: 'visible' 
  };

  const buttonStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    padding: '8px 12px',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
    color: '#666',
    fontSize: '15px',
    cursor: 'pointer'
  };

  return (
    <div className="releaseWrapper" style={{ ...containerStyle, marginBottom: '30px' }}>
      <div className="headerRow" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'baseline', marginBottom: '15px' }}>
        <h3 className="releaseHeading" style={{ margin: 0 }}>Legal Owner of Record</h3>
        {showMailingOption && (
          <div className="mailingCheckboxWrapper">
            <label className="mailingCheckboxLabel" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                className="mailingCheckboxInput"
                checked={legalOwnerData.mailingAddressDifferent || false}
                onChange={(e) => handleMailingCheckboxChange(e.target.checked)}
                style={{ margin: 0 }}
              />
              If mailing address is different
            </label>
          </div>
        )}
      </div>
      
      {/* Name and ELT fields in one row */}
      <div className="nameEltGroup" style={{ display: 'flex', gap: '1rem' }}>
        <div className="formGroup" style={{ flex: '3' }}>
          <label className="releaseFormLabel">Name of Bank, Finance Company, or Individual having a Lien on this Vehicle</label>
          <input
            className="releaseFormInput"
            type="text"
            placeholder="Name of Bank, Finance Company, or Individual having a Lien on this Vehicle"
            value={legalOwnerData.name || ''}
            onChange={(e) => handleInfoChange('name', e.target.value)}
          />
        </div>
        
        <div className="formGroup" style={{ flex: '1' }}>
          <label className="formLabel">ELT Number (3 digits)</label>
          <input
            className="formInput"
            type="text"
            placeholder="ELT Number"
            value={legalOwnerData.eltNumber || ''}
            onChange={(e) => handleEltChange(e.target.value)}
            maxLength={3}
            style={{ borderColor: eltError ? 'red' : '' }}
          />
          {eltError && (
            <div className="errorMessage" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
              {eltError}
            </div>
          )}
        </div>
      </div>

      {/* Primary Address */}
      <div className="streetAptGroup">
        <div className="formGroup streetField">
          <label className="formLabel">Street</label>
          <input
            className="formInputt"
            type="text"
            placeholder="Street"
            value={legalOwnerData.address?.street || ''}
            onChange={(e) => handleAddressChange('address', 'street', e.target.value)}
          />
        </div>
        <div className="formGroup aptField">
          <label className="formLabel">APT./SPACE/STE.#</label>
          <input
            className="formInputt"
            type="text"
            placeholder="APT./SPACE/STE.#"
            value={legalOwnerData.address?.apt || ''}
            onChange={(e) => handleAddressChange('address', 'apt', e.target.value)}
          />
        </div>
      </div>

      <div className="cityStateZipGroupp" style={{ ...cityStateZipStyle, position: 'relative', zIndex: 6 }}>
        <div className="cityFieldCustomWidth">
          <label className="formLabel">City</label>
          <input
            className="cityInputt"
            type="text"
            placeholder="City"
            value={legalOwnerData.address?.city || ''}
            onChange={(e) => handleAddressChange('address', 'city', e.target.value)}
          />
        </div>
        
        {/* State dropdown with refined styles */}
        <div 
          className="regStateWrapper" 
          ref={stateDropdownRef}
          style={{ ...dropdownStyles.dropdownWrapper, zIndex: 6 }}
        >
          <label className="registeredOwnerLabel">State</label>
          <button
            type="button"
            onClick={() => handleToggleDropdown('reg')}
            className="regStateDropDown"
            style={buttonStyle}
          >
            {legalOwnerData.address?.state || 'State'}
            <ChevronDownIcon className={`regIcon ${openDropdown === 'reg' ? 'rotate' : ''}`} style={{ width: '20px', height: '20px' }} />
          </button>
          
          {/* Dropdown menu with refined styles */}
          {openDropdown === 'reg' && (
            <ul style={dropdownStyles.dropdownMenu}>
              {states.map((state, index) => (
                <li
                  key={index}
                  onClick={() => handleStateSelect('reg', state.abbreviation)}
                  style={dropdownStyles.dropdownItem}
                  onMouseEnter={(e) => {
                    (e.target as HTMLLIElement).style.backgroundColor = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLLIElement).style.backgroundColor = 'white';
                  }}
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
            onChange={(e) => handleAddressChange('address', 'zip', e.target.value)}
          />
        </div>
      </div>

      {/* Mailing Address Section (shows only when checkbox is checked) */}
      {showMailingOption && legalOwnerData.mailingAddressDifferent && (
        <div className="addressWrapper" style={{ marginTop: '30px', position: 'relative' }}>
          <h3 className="addressHeading" style={{ marginBottom: '15px' }}>Mailing Address</h3>
          <div className="streetAptGroup">
            <div className="formGroup streetField">
              <label className="formLabel">Street</label>
              <input
                className="formInputt streetInput"
                type="text"
                placeholder="Street"
                value={legalOwnerData.mailingAddress?.street || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'street', e.target.value)}
              />
            </div>
            <div className="formGroup aptField">
              <label className="formLabel">APT./SPACE/STE.#</label>
              <input
                className="formInputt aptInput"
                type="text"
                placeholder="APT./SPACE/STE.#"
                value={legalOwnerData.mailingAddress?.poBox || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'poBox', e.target.value)}
              />
            </div>
          </div>

          <div className="cityStateZipGroupp" style={{ ...cityStateZipStyle, position: 'relative', zIndex: 4 }}>
            <div className="cityFieldCustomWidth">
              <label className="formLabel">City</label>
              <input
                className="cityInputt"
                type="text"
                placeholder="City"
                value={legalOwnerData.mailingAddress?.city || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'city', e.target.value)}
              />
            </div>
            
            {/* Mailing State dropdown */}
            <div 
              className="regStateWrapper" 
              ref={mailingStateDropdownRef}
              style={dropdownStyles.dropdownWrapper}
            >
              <label className="registeredOwnerLabel">State</label>
              <button
                type="button"
                onClick={() => handleToggleDropdown('mailing')}
                className="regStateDropDown"
                style={buttonStyle}
              >
                {legalOwnerData.mailingAddress?.state || 'State'}
                <ChevronDownIcon className={`regIcon ${openDropdown === 'mailing' ? 'rotate' : ''}`} style={{ width: '20px', height: '20px' }} />
              </button>
              
              {openDropdown === 'mailing' && (
                <ul style={{
                  ...dropdownStyles.dropdownMenu,
                  zIndex: 10000,                  
                  position: 'absolute',
                  maxHeight: '200px'
                }}>
                  {states.map((state, index) => (
                    <li
                      key={index}
                      onClick={() => handleStateSelect('mailing', state.abbreviation)}
                      style={dropdownStyles.dropdownItem}
                      onMouseEnter={(e) => {
                        (e.target as HTMLLIElement).style.backgroundColor = '#f5f5f5';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLLIElement).style.backgroundColor = 'white';
                      }}
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
                value={legalOwnerData.mailingAddress?.zip || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'zip', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalOwnerOfRecord;