'use client';
import React, { useState, useRef, useEffect, CSSProperties } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import './LegalOwnerOfRecord.css';


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
    vehicleTransactionDetails?: {
      currentLienholder?: boolean;
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

const LegalOwnerOfRecord: React.FC<LegalOwnerProps> = ({ formData: propFormData, onChange }) => {
  const [legalOwnerData, setLegalOwnerData] = useState<LegalOwnerType>(
    propFormData?.legalOwnerInformation || initialLegalOwner
  );
  const { updateField } = useFormContext();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  

  const stateDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!propFormData?.legalOwnerInformation) {
      const initialData = { ...initialLegalOwner };
      updateField('legalOwnerInformation', initialData);
      if (onChange) {
        onChange(initialData);
      }
    }
  }, []);

  useEffect(() => {
    const hasCurrentLienholder = propFormData?.vehicleTransactionDetails?.currentLienholder === true;
    if (!hasCurrentLienholder && 
        legalOwnerData && 
        (legalOwnerData.name || 
         legalOwnerData.address?.street || 
         legalOwnerData.address?.city || 
         legalOwnerData.address?.state || 
         legalOwnerData.address?.zip || 
         legalOwnerData.address?.apt ||
         legalOwnerData.date ||
         legalOwnerData.phoneNumber ||
         legalOwnerData.authorizedAgentName ||
         legalOwnerData.authorizedAgentTitle)) {
      const resetData = { ...initialLegalOwner };
      setLegalOwnerData(resetData);
      updateField('legalOwnerInformation', resetData);
      if (onChange) {
        onChange(resetData);
      }
    }
  }, [propFormData?.vehicleTransactionDetails?.currentLienholder]); 

  useEffect(() => {
    if (propFormData?.legalOwnerInformation) {
      setLegalOwnerData(propFormData.legalOwnerInformation);
    }
  }, [propFormData]);

  const handleInfoChange = (field: keyof LegalOwnerType, value: any) => {
    const newData = { ...legalOwnerData, [field]: value };
    setLegalOwnerData(newData);
    updateField('legalOwnerInformation', newData);
    if (onChange) {
      onChange(newData);
    }
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    const newData = { ...legalOwnerData };
    newData.address = {
      ...(newData.address || {}),
      [field]: value
    };
    setLegalOwnerData(newData);
    updateField('legalOwnerInformation', newData);
    if (onChange) {
      onChange(newData);
    }
  };
  
  const handleToggleDropdown = () => {
    setOpenDropdown(prev => (prev === 'reg' ? null : 'reg'));
  };
  
  const handleStateSelect = (stateAbbreviation: string) => {
    handleAddressChange('state', stateAbbreviation);
    setOpenDropdown(null);
  };


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


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
    justifyContent: 'space-between',
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
    <div className="releaseWrapper" style={containerStyle}>
      <div className="headerRow">
        <h3 className="releaseHeading">Legal Owner of Record</h3>
      </div>
      
      <div className="releaseFormGroup">
        <label className="releaseFormLabel">Name of Bank, Finance Company, or Individual having a Lien on this Vehicle</label>
        <input
          className="releaseFormInput"
          type="text"
          placeholder="Name of Bank, Finance Company, or Individual having a Lien on this Vehicle"
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

      <div className="cityStateZipGroupp" style={cityStateZipStyle}>
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
        
        {/* State dropdown with refined styles */}
        <div 
          className="regStateWrapper" 
          ref={stateDropdownRef}
          style={dropdownStyles.dropdownWrapper}
        >
          <label className="registeredOwnerLabel">State</label>
          <button
            type="button"
            onClick={handleToggleDropdown}
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
                  onClick={() => handleStateSelect(state.abbreviation)}
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
            onChange={(e) => handleAddressChange('zip', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default LegalOwnerOfRecord;