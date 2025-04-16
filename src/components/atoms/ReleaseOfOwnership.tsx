'use client';
import React, { useState, useRef, useEffect, CSSProperties } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import './ReleaseOfOwnership.css';

export const RELEASE_OWNERSHIP_STORAGE_KEY = 'formmatic_release_ownership';

export const clearReleaseOwnershipStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(RELEASE_OWNERSHIP_STORAGE_KEY);
    console.log('Release of ownership data cleared from localStorage');
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
    textAlign: 'center'
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

interface ValidationError {
  field: string;
  message: string;
}

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
  showValidationErrors?: boolean;
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

const ReleaseOfOwnership: React.FC<ReleaseInformationProps> = ({ 
  formData: propFormData,
  showValidationErrors = false 
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [releaseData, setReleaseData] = useState<ReleaseInformationType>(initialReleaseInformation);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const { updateField, clearFormTriggered } = useFormContext();
  
  const [showRegStateDropdown, setShowRegStateDropdown] = useState(false);
  const [showMailingStateDropdown, setShowMailingStateDropdown] = useState(false);
  
  const regStateDropdownRef = useRef<HTMLDivElement>(null);
  const mailingStateDropdownRef = useRef<HTMLDivElement>(null);

// Validation function
const validateReleaseInfo = (): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Validate required fields
  if (!releaseData.name) {
    errors.push({
      field: 'name',
      message: 'Name is required'
    });
  }
  
  // Validate address fields
  if (!releaseData.address?.street) {
    errors.push({
      field: 'address.street',
      message: 'Street is required'
    });
  }
  
  if (!releaseData.address?.city) {
    errors.push({
      field: 'address.city',
      message: 'City is required'
    });
  }
  
  if (!releaseData.address?.state) {
    errors.push({
      field: 'address.state',
      message: 'State is required'
    });
  }
  
  if (!releaseData.address?.zip) {
    errors.push({
      field: 'address.zip',
      message: 'ZIP code is required'
    });
  }
  
  // Validate date and phone fields
  if (!releaseData.date) {
    errors.push({
      field: 'date',
      message: 'Date is required'
    });
  } else if (releaseData.date.length < 10) {
    errors.push({
      field: 'date',
      message: 'Date must be in MM/DD/YYYY format'
    });
  }
  
  if (!releaseData.phoneNumber) {
    errors.push({
      field: 'phoneNumber',
      message: 'Phone number is required'
    });
  }
  
  // Validate authorized agent fields
  if (!releaseData.authorizedAgentName) {
    errors.push({
      field: 'authorizedAgentName',
      message: 'Authorized agent name is required'
    });
  }
  
  if (!releaseData.authorizedAgentTitle) {
    errors.push({
      field: 'authorizedAgentTitle',
      message: 'Authorized agent title is required'
    });
  }
  
  // Validate mailing address if different
  if (releaseData.mailingAddressDifferent) {
    if (!releaseData.mailingAddress?.street) {
      errors.push({
        field: 'mailingAddress.street',
        message: 'Mailing street is required'
      });
    }
    
    if (!releaseData.mailingAddress?.city) {
      errors.push({
        field: 'mailingAddress.city',
        message: 'Mailing city is required'
      });
    }
    
    if (!releaseData.mailingAddress?.state) {
      errors.push({
        field: 'mailingAddress.state',
        message: 'Mailing state is required'
      });
    }
    
    if (!releaseData.mailingAddress?.zip) {
      errors.push({
        field: 'mailingAddress.zip',
        message: 'Mailing ZIP code is required'
      });
    }
  }
  
  return errors;
};

  // First useEffect: Run validation when showing validation errors or when data changes
  useEffect(() => {
    if (showValidationErrors) {
      const errors = validateReleaseInfo();
      setValidationErrors(errors);
    }
  }, [showValidationErrors, releaseData]);

  useEffect(() => {
    if (showValidationErrors) {
      updateField('_validationErrors', (prev: { releaseInformation: boolean }) => ({
        ...prev,
        releaseInformation: validationErrors.length > 0
      }));
    }
  }, [validationErrors, showValidationErrors]);
  

  useEffect(() => {
    if (clearFormTriggered) {
      console.log('Clear form triggered in ReleaseOfOwnership component');
      clearReleaseOwnershipStorage();
      setReleaseData(initialReleaseInformation);
      
      updateField('releaseInformation', initialReleaseInformation);
    }
  }, [clearFormTriggered]);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const savedData = localStorage.getItem(RELEASE_OWNERSHIP_STORAGE_KEY);
        
        if (savedData) {
          console.log("Loading release of ownership data from localStorage");
          const parsedData = JSON.parse(savedData);
          
          const mergedData = {
            ...initialReleaseInformation,
            ...parsedData,
            ...(propFormData?.releaseInformation || {})
          };
          
          setReleaseData(mergedData);
          
          updateField('releaseInformation', mergedData);
        } else if (propFormData?.releaseInformation) {
          setReleaseData(propFormData.releaseInformation);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading saved release of ownership data:', error);
        setIsInitialized(true);
        
        if (propFormData?.releaseInformation) {
          setReleaseData(propFormData.releaseInformation);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (isInitialized && propFormData?.releaseInformation) {
      setReleaseData(propFormData.releaseInformation);
    }
  }, [propFormData, isInitialized]);

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

  // Helper to get error message for a field
  const getErrorMessage = (field: string): string | null => {
    const error = validationErrors.find(err => err.field === field);
    return error ? error.message : null;
  };

  const capitalizeWords = (value: string): string => {
    if (!value) return '';
    return value.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    
    const limitedDigits = digits.slice(0, 10);
    
    if (limitedDigits.length === 0) {
      return '';
    } else if (limitedDigits.length <= 3) {
      return `(${limitedDigits}`;
    } else if (limitedDigits.length <= 6) {
      return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3)}`;
    } else {
      return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6, 10)}`;
    }
  };

  const formatDate = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }
  };

  const handleReleaseInfoChange = (field: keyof ReleaseInformationType, value: any) => {
    let formattedValue = value;

    if (field === 'phoneNumber') {
      formattedValue = formatPhoneNumber(value);
    } else if (field === 'date') {
      formattedValue = formatDate(value);
    } else if (typeof value === 'string') {
      formattedValue = capitalizeWords(value);
    }

    const newData = { ...releaseData, [field]: formattedValue };
    setReleaseData(newData);
    updateField('releaseInformation', newData);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(RELEASE_OWNERSHIP_STORAGE_KEY, JSON.stringify(newData));
    }
    
    // Run validation if we're showing validation errors
    if (showValidationErrors) {
      const errors = validateReleaseInfo();
      setValidationErrors(errors);
    }
  };

  const handleMailingCheckboxChange = (checked: boolean) => {
    const newData = { ...releaseData };
    newData.mailingAddressDifferent = checked;
    
    if (!checked) {
      newData.mailingAddress = {
        street: '',
        apt: '',
        poBox: '',
        city: '',
        state: '',
        zip: ''
      };
    }
    
    setReleaseData(newData);
    updateField('releaseInformation', newData);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(RELEASE_OWNERSHIP_STORAGE_KEY, JSON.stringify(newData));
    }
    
    // Run validation if we're showing validation errors
    if (showValidationErrors) {
      const errors = validateReleaseInfo();
      setValidationErrors(errors);
    }
  };

  const handleAddressChange = (addressType: 'address' | 'mailingAddress', field: keyof Address, value: string) => {
    const capitalizedValue = typeof value === 'string' ? capitalizeWords(value) : value;
    
    const newData = { ...releaseData };
    newData[addressType] = {
      ...(newData[addressType] || {}),
      [field]: capitalizedValue
    };
    setReleaseData(newData);
    updateField('releaseInformation', newData);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(RELEASE_OWNERSHIP_STORAGE_KEY, JSON.stringify(newData));
    }
    
    // Run validation if we're showing validation errors
    if (showValidationErrors) {
      const errors = validateReleaseInfo();
      setValidationErrors(errors);
    }
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
        <div className="checkboxSectionn">
          <input
            type="checkbox"
            className="checkBoxAddress"
            checked={releaseData.mailingAddressDifferent || false}
            onChange={(e) => handleMailingCheckboxChange(e.target.checked)}
          />
          <p>If mailing address is different</p>
        </div>
      </div>

      <div className="releaseFormGroup">
        <div className="bankNameField">
          <label className="releaseFormLabel">Name of bank, finance company, or individual(s) having a lien on this vehicle</label>
          <input
            className={`formInput ${showValidationErrors && getErrorMessage('name') ? 'error-input' : ''}`}
            type="text"
            placeholder="Name of bank, finance company, or individual(s)"
            value={releaseData.name || ''}
            onChange={(e) => handleReleaseInfoChange('name', e.target.value)}
          />
          {showValidationErrors && getErrorMessage('name') && (
            <div className="error-message">{getErrorMessage('name')}</div>
          )}
        </div>
      </div>

      <div className="streetAptGroup">
        <div className="formGroup streetField">
          <label className="formLabel">Street</label>
          <input
            className={`formInput ${showValidationErrors && getErrorMessage('address.street') ? 'error-input' : ''}`}
            type="text"
            placeholder="Street"
            value={releaseData.address?.street || ''}
            onChange={(e) => handleAddressChange('address', 'street', e.target.value)}
          />
          {showValidationErrors && getErrorMessage('address.street') && (
            <div className="error-message">{getErrorMessage('address.street')}</div>
          )}
        </div>
        <div className="formGroup aptField">
          <label className="formLabel">Apt./space/ste.#</label>
          <input
            className="formInput"
            type="text"
            placeholder="Apt./space/ste.#"
            value={releaseData.address?.apt || ''}
            onChange={(e) => handleAddressChange('address', 'apt', e.target.value)}
          />
        </div>
      </div>

      <div className="cityStateZipGroupp" style={cityStateZipStyle}>
        <div className="cityFieldCustomWidth">
          <label className="formLabel">City</label>
          <input
            className={`cityInputtt ${showValidationErrors && getErrorMessage('address.city') ? 'error-input' : ''}`}
            type="text"
            placeholder="City"
            value={releaseData.address?.city || ''}
            onChange={(e) => handleAddressChange('address', 'city', e.target.value)}
          />
          {showValidationErrors && getErrorMessage('address.city') && (
            <div className="error-message">{getErrorMessage('address.city')}</div>
          )}
        </div>
        <div className="regStateWrapper" ref={regStateDropdownRef} style={dropdownStyles.dropdownWrapper}>
          <label className="registeredOwnerLabel">State</label>
          <button
            type="button"
            onClick={toggleRegStateDropdown}
            className={`regStateDropDown ${showValidationErrors && getErrorMessage('address.state') ? 'error-button' : ''}`}
            style={dropdownStyles.button}
          >
            {releaseData.address?.state || 'State'}
            <ChevronDownIcon 
              className={`regIcon ${showRegStateDropdown ? 'rotate' : ''}`} 
              style={dropdownStyles.chevron} 
            />
          </button>
          {showValidationErrors && getErrorMessage('address.state') && (
            <div className="error-message">{getErrorMessage('address.state')}</div>
          )}
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
          <label className="formLabel">Zip code</label>
          <input
            className={`formInput ${showValidationErrors && getErrorMessage('address.zip') ? 'error-input' : ''}`}
            type="text"
            placeholder="Zip code"
            value={releaseData.address?.zip || ''}
            onChange={(e) => handleAddressChange('address', 'zip', e.target.value)}
          />
          {showValidationErrors && getErrorMessage('address.zip') && (
            <div className="error-message">{getErrorMessage('address.zip')}</div>
          )}
        </div>
      </div>
      
      <div className="wrap">
        <div className="datePhoneGroup">
          <div className="formGroup dateField">
            <label className="releaseFormLabel">Date</label>
            <input
              className={`registeredDateInput ${showValidationErrors && getErrorMessage('date') ? 'error-input' : ''}`}
              type="text"
              placeholder="Mm/dd/yyyy"
              value={releaseData.date || ''}
              onChange={(e) => handleReleaseInfoChange('date', e.target.value)}
              maxLength={10}
            />
            {showValidationErrors && getErrorMessage('date') && (
              <div className="error-message">{getErrorMessage('date')}</div>
            )}
          </div>
          <div className="formGroup phoneField">
            <label className="releaseFormLabel">Phone number</label>
            <input
              className={`formInput ${showValidationErrors && getErrorMessage('phoneNumber') ? 'error-input' : ''}`}
              type="tel"
              placeholder="Phone number"
              value={releaseData.phoneNumber || ''}
              onChange={(e) => handleReleaseInfoChange('phoneNumber', e.target.value)}
            />
            {showValidationErrors && getErrorMessage('phoneNumber') && (
              <div className="error-message">{getErrorMessage('phoneNumber')}</div>
            )}
          </div>
          <div className="agentNameInline">
            <label className="releaseFormLabel">Printed name of authorized agent</label>
            <input
              className={`agentFormInput ${showValidationErrors && getErrorMessage('authorizedAgentName') ? 'error-input' : ''}`}
              type="text"
              placeholder="Full name"
              value={releaseData.authorizedAgentName || ''}
              onChange={(e) => handleReleaseInfoChange('authorizedAgentName', e.target.value)}
            />
            {showValidationErrors && getErrorMessage('authorizedAgentName') && (
              <div className="error-message">{getErrorMessage('authorizedAgentName')}</div>
            )}
          </div>
        </div>

        <div className="authorizedAgentGroup">
          <div className="formGroup agentTitleField">
            <label className="releaseFormLabel">Title of authorized agent signing for company</label>
            <input
              className={`formInput ${showValidationErrors && getErrorMessage('authorizedAgentTitle') ? 'error-input' : ''}`}
              type="text"
              placeholder="Title"
              value={releaseData.authorizedAgentTitle || ''}
              onChange={(e) => handleReleaseInfoChange('authorizedAgentTitle', e.target.value)}
            />
            {showValidationErrors && getErrorMessage('authorizedAgentTitle') && (
              <div className="error-message">{getErrorMessage('authorizedAgentTitle')}</div>
            )}
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
                className={`formInput ${showValidationErrors && getErrorMessage('mailingAddress.street') ? 'error-input' : ''}`}
                type="text"
                placeholder="Street"
                value={releaseData.mailingAddress?.street || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'street', e.target.value)}
              />
              {showValidationErrors && getErrorMessage('mailingAddress.street') && (
                <div className="error-message">{getErrorMessage('mailingAddress.street')}</div>
              )}
            </div>
            <div className="formGroup aptField">
              <label className="formLabel">Apt./space/ste.#</label>
              <input
                className="formInput"
                type="text"
                placeholder="Apt./space/ste.#"
                value={releaseData.mailingAddress?.poBox || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'poBox', e.target.value)}
              />
            </div>
          </div>
          <div className="cityStateZipGroupp" style={cityStateZipStyle}>
            <div className="cityFieldCustomWidth">
              <label className="formLabel">City</label>
              <input
                className={`cityInputt ${showValidationErrors && getErrorMessage('mailingAddress.city') ? 'error-input' : ''}`}
                type="text"
                placeholder="City"
                value={releaseData.mailingAddress?.city || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'city', e.target.value)}
              />
              {showValidationErrors && getErrorMessage('mailingAddress.city') && (
                <div className="error-message">{getErrorMessage('mailingAddress.city')}</div>
              )}
            </div>
            <div className="regStateWrapper" ref={mailingStateDropdownRef} style={dropdownStyles.dropdownWrapper}>
              <label className="registeredOwnerLabel">State</label>
              <button
                type="button"
                onClick={toggleMailingStateDropdown}
                className={`regStateDropDown ${showValidationErrors && getErrorMessage('mailingAddress.state') ? 'error-button' : ''}`}
                style={dropdownStyles.button}
              >
                {releaseData.mailingAddress?.state || 'State'}
                <ChevronDownIcon 
                  className={`regIcon ${showMailingStateDropdown ? 'rotate' : ''}`} 
                  style={dropdownStyles.chevron} 
                />
              </button>
              {showValidationErrors && getErrorMessage('mailingAddress.state') && (
                <div className="error-message">{getErrorMessage('mailingAddress.state')}</div>
              )}
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
              <label className="formLabel">Zip code</label>
              <input
                className={`formInput ${showValidationErrors && getErrorMessage('mailingAddress.zip') ? 'error-input' : ''}`}
                type="text"
                placeholder="Zip code"
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