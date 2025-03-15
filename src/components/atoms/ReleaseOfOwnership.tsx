'use client';
import React, { useState, useRef, useEffect, CSSProperties } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import './ReleaseOfOwnership.css';


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
  },
  button: {
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
  },
  chevron: {
    width: '20px',
    height: '20px',
    transition: 'transform 0.2s ease'
  }
};

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
  

  const [showRegStateDropdown, setShowRegStateDropdown] = useState(false);
  const [showMailingStateDropdown, setShowMailingStateDropdown] = useState(false);
  

  const regStateDropdownRef = useRef<HTMLDivElement>(null);
  const mailingStateDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (propFormData?.releaseInformation) {
      setReleaseData(propFormData.releaseInformation);
    }
  }, [propFormData]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (regStateDropdownRef.current && !regStateDropdownRef.current.contains(target)) {
        setShowRegStateDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (mailingStateDropdownRef.current && !mailingStateDropdownRef.current.contains(target)) {
        setShowMailingStateDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
  
  const handleStateSelect = (addressType: 'address' | 'mailingAddress', stateAbbreviation: string) => {
    handleAddressChange(addressType, 'state', stateAbbreviation);
    
    if (addressType === 'address') {
      setShowRegStateDropdown(false);
    } else {
      setShowMailingStateDropdown(false);
    }
  };

  const toggleRegStateDropdown = () => {
    setShowRegStateDropdown(!showRegStateDropdown);
    setShowMailingStateDropdown(false);
  };
  
  const toggleMailingStateDropdown = () => {
    setShowMailingStateDropdown(!showMailingStateDropdown);
    setShowRegStateDropdown(false);
  };


  const containerStyle: CSSProperties = { 
    position: 'relative', 
    overflow: 'visible' 
  };
  
  const cityStateZipStyle: CSSProperties = { 
    position: 'relative', 
    overflow: 'visible' 
  };

  return (
    <div className="releaseWrapper" style={containerStyle}>
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

      <div className="cityStateZipGroupp" style={cityStateZipStyle}>
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
        <div className="regStateWrapper" ref={regStateDropdownRef} style={dropdownStyles.dropdownWrapper}>
          <label className="registeredOwnerLabel">State</label>
          <button
            type="button"
            onClick={toggleRegStateDropdown}
            className="regStateDropDown"
            style={dropdownStyles.button}
          >
            {releaseData.address?.state || 'State'}
            <ChevronDownIcon 
              className={`regIcon ${showRegStateDropdown ? 'rotate' : ''}`} 
              style={dropdownStyles.chevron} 
            />
          </button>
          {showRegStateDropdown && (
            <ul style={dropdownStyles.dropdownMenu}>
              {states.map((state, index) => (
                <li
                  key={index}
                  onClick={() => handleStateSelect('address', state.abbreviation)}
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
            value={releaseData.address?.zip || ''}
            onChange={(e) => handleAddressChange('address', 'zip', e.target.value)}
          />
        </div>
      </div>
      
      <div className="wrap">
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
            <label className="releaseFormLabel">Phone Number</label>
            <input
              className="formInputt"
              type="tel"
              placeholder="Phone Number"
              value={releaseData.phoneNumber || ''}
              onChange={(e) => handleReleaseInfoChange('phoneNumber', e.target.value)}
            />
          </div>
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
        </div>

        <div className="authorizedAgentGroup">
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
        <div className="addressWrapper" style={containerStyle}>
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
          <div className="cityStateZipGroupp" style={cityStateZipStyle}>
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
            <div className="regStateWrapper" ref={mailingStateDropdownRef} style={dropdownStyles.dropdownWrapper}>
              <label className="registeredOwnerLabel">State</label>
              <button
                type="button"
                onClick={toggleMailingStateDropdown}
                className="regStateDropDown"
                style={dropdownStyles.button}
              >
                {releaseData.mailingAddress?.state || 'State'}
                <ChevronDownIcon 
                  className={`regIcon ${showMailingStateDropdown ? 'rotate' : ''}`} 
                  style={dropdownStyles.chevron} 
                />
              </button>
              {showMailingStateDropdown && (
                <ul style={dropdownStyles.dropdownMenu}>
                  {states.map((state, index) => (
                    <li
                      key={index}
                      onClick={() => handleStateSelect('mailingAddress', state.abbreviation)}
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