'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import './PlatePurchaser.css';

interface PersonInfoType {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
}

interface PlatePurchaserOwnerType {
  sameAsOwner: boolean;
  purchaser: PersonInfoType;
  owner?: PersonInfoType;
}

interface ValidationError {
  field: string;
  message: string;
}

interface PlatePurchaserOwnerProps {
  formData?: {
    platePurchaserOwner?: PlatePurchaserOwnerType;
  };
  showValidationErrors?: boolean;
}

const initialPersonInfo: PersonInfoType = {
  fullName: '',
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  phoneNumber: ''
};

const initialPlatePurchaserOwner: PlatePurchaserOwnerType = {
  sameAsOwner: false,
  purchaser: { ...initialPersonInfo },
  owner: { ...initialPersonInfo } 
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

const PlatePurchaserOwner: React.FC<PlatePurchaserOwnerProps> = ({ 
  formData: propFormData,
  showValidationErrors = false
}) => {
  const { formData: contextFormData, updateField } = useFormContext();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const purchaserStateRef = useRef<HTMLUListElement>(null);
  const ownerStateRef = useRef<HTMLUListElement>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  

  const getFormDataSafely = () => {
    const combined = {
      ...contextFormData,
      ...propFormData
    };
    
    if (!combined.platePurchaserOwner) {
      return {
        ...combined,
        platePurchaserOwner: initialPlatePurchaserOwner
      };
    }
    
    const purchaser = {
      ...initialPersonInfo,
      ...(combined.platePurchaserOwner.purchaser || {})
    };
    
    const owner = {
      ...initialPersonInfo,
      ...(combined.platePurchaserOwner.owner || {})
    };
    
    return {
      ...combined,
      platePurchaserOwner: {
        sameAsOwner: combined.platePurchaserOwner.sameAsOwner || false,
        purchaser,
        owner
      }
    };
  };
  

  const safeFormData = getFormDataSafely();
  

  const validatePlatePurchaserOwner = (info: PlatePurchaserOwnerType): ValidationError[] => {
    const errors: ValidationError[] = [];
    

    if (!info.purchaser.fullName) {
      errors.push({
        field: 'purchaser.fullName',
        message: 'Purchaser name is required'
      });
    }
    
    if (!info.purchaser.streetAddress) {
      errors.push({
        field: 'purchaser.streetAddress',
        message: 'Street address is required'
      });
    }
    
    if (!info.purchaser.city) {
      errors.push({
        field: 'purchaser.city',
        message: 'City is required'
      });
    }
    
    if (!info.purchaser.state) {
      errors.push({
        field: 'purchaser.state',
        message: 'State is required'
      });
    }
    
    if (!info.purchaser.zipCode) {
      errors.push({
        field: 'purchaser.zipCode',
        message: 'ZIP code is required'
      });
    } else if (!/^\d{5}(-\d{4})?$/.test(info.purchaser.zipCode)) {
      errors.push({
        field: 'purchaser.zipCode',
        message: 'Please enter a valid ZIP code'
      });
    }
    
    if (!info.purchaser.phoneNumber) {
      errors.push({
        field: 'purchaser.phoneNumber',
        message: 'Phone number is required'
      });
    } else if (info.purchaser.phoneNumber.length < 14) {
      errors.push({
        field: 'purchaser.phoneNumber',
        message: 'Please enter a complete phone number'
      });
    }
    

    if (!info.sameAsOwner) {
      if (!info.owner?.fullName) {
        errors.push({
          field: 'owner.fullName',
          message: 'Owner name is required'
        });
      }
      
      if (!info.owner?.streetAddress) {
        errors.push({
          field: 'owner.streetAddress',
          message: 'Street address is required'
        });
      }
      
      if (!info.owner?.city) {
        errors.push({
          field: 'owner.city',
          message: 'City is required'
        });
      }
      
      if (!info.owner?.state) {
        errors.push({
          field: 'owner.state',
          message: 'State is required'
        });
      }
      
      if (!info.owner?.zipCode) {
        errors.push({
          field: 'owner.zipCode',
          message: 'ZIP code is required'
        });
      } else if (!/^\d{5}(-\d{4})?$/.test(info.owner.zipCode)) {
        errors.push({
          field: 'owner.zipCode',
          message: 'Please enter a valid ZIP code'
        });
      }
      
      if (!info.owner?.phoneNumber) {
        errors.push({
          field: 'owner.phoneNumber',
          message: 'Phone number is required'
        });
      } else if (info.owner.phoneNumber.length < 14) {
        errors.push({
          field: 'owner.phoneNumber',
          message: 'Please enter a complete phone number'
        });
      }
    }
    
    return errors;
  };


  const getErrorMessage = (field: string): string | null => {
    const error = validationErrors.find(err => err.field === field);
    return error ? error.message : null;
  };


  useEffect(() => {
    if (!contextFormData.platePurchaserOwner) {
      updateField('platePurchaserOwner', initialPlatePurchaserOwner);
    }
  }, [contextFormData.platePurchaserOwner, updateField]);


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        openDropdown === 'purchaserState' && 
        purchaserStateRef.current && 
        !purchaserStateRef.current.contains(target) &&
        !target.closest('.purchaser-state-button')
      ) {
        setOpenDropdown(null);
      }
      
      if (
        openDropdown === 'ownerState' && 
        ownerStateRef.current && 
        !ownerStateRef.current.contains(target) &&
        !target.closest('.owner-state-button')
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);


  useEffect(() => {
    if (showValidationErrors) {
      const errors = validatePlatePurchaserOwner(safeFormData.platePurchaserOwner);
      setValidationErrors(errors);
      


      const hasErrors = errors.length > 0;
      updateField('_validationErrors', (prev: any) => {

        if (prev?.platePurchaserOwner !== hasErrors) {
          return {
            ...prev,
            platePurchaserOwner: hasErrors
          };
        }
        return prev;
      });
    }
  }, [showValidationErrors, safeFormData.platePurchaserOwner.sameAsOwner]);

  const handleSameAsOwnerChange = (checked: boolean) => {
    const currentInfo = { ...safeFormData.platePurchaserOwner };
    
    if (checked) {
      currentInfo.sameAsOwner = true;
      currentInfo.owner = { ...currentInfo.purchaser };
    } else {
      currentInfo.sameAsOwner = false;
    }
    
    updateField('platePurchaserOwner', currentInfo);
  };   
  
  const capitalizeFirstLetter = (value: string): string => {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  };
  
  const capitalizeWords = (value: string): string => {
    if (!value) return value;
    return value.split(' ').map(word => 
      word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
    ).join(' ');
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

  const handlePurchaserChange = (field: keyof PersonInfoType, value: string) => {
    const currentInfo = { ...safeFormData.platePurchaserOwner };
    
    let formattedValue = value;
    if (field === 'phoneNumber') {
      formattedValue = formatPhoneNumber(value);
    } else if (field === 'fullName') {
      formattedValue = capitalizeWords(value);
    } else if (field !== 'state') {
      formattedValue = capitalizeFirstLetter(value);
    }
    
    currentInfo.purchaser = { ...currentInfo.purchaser, [field]: formattedValue };
    
    if (currentInfo.sameAsOwner) {
      currentInfo.owner = { ...currentInfo.purchaser };
    }
    
    updateField('platePurchaserOwner', currentInfo);
    

    if (showValidationErrors) {
      const errors = validatePlatePurchaserOwner(currentInfo);
      setValidationErrors(errors);
    }
  };

  const handleOwnerChange = (field: keyof PersonInfoType, value: string) => {
    const currentInfo = { ...safeFormData.platePurchaserOwner };
    
    let formattedValue = value;
    if (field === 'phoneNumber') {
      formattedValue = formatPhoneNumber(value);
    } else if (field === 'fullName') {
      formattedValue = capitalizeWords(value);
    } else if (field !== 'state') {
      formattedValue = capitalizeFirstLetter(value);
    }
    
    if (!currentInfo.owner) {
      currentInfo.owner = { ...initialPersonInfo };
    }
    
    currentInfo.owner = {
      ...currentInfo.owner,
      [field]: formattedValue
    };
    
    updateField('platePurchaserOwner', currentInfo);
    

    if (showValidationErrors) {
      const errors = validatePlatePurchaserOwner(currentInfo);
      setValidationErrors(errors);
    }
  };
  
  const handlePurchaserStateSelect = (abbreviation: string) => {
    handlePurchaserChange('state', abbreviation);
    setOpenDropdown(null);
  };
  
  const handleOwnerStateSelect = (abbreviation: string) => {
    handleOwnerChange('state', abbreviation);
    setOpenDropdown(null);
  };

  const getSafeValue = (path: string[], defaultValue = ''): string => {
    let current: any = safeFormData;
    for (const key of path) {
      if (current === undefined || current === null) return defaultValue;
      current = current[key];
    }
    return current === undefined || current === null ? defaultValue : current;
  };

  return (
    <div className="purchaserOwnerWrapper">
      <div className="purchaserOwnerHeader">
        <h3 className="purchaserOwnerTitle">PLATE PURCHASER</h3>
        <label className="sameAsOwnerLabel">
          <input
            type="checkbox"
            checked={safeFormData.platePurchaserOwner.sameAsOwner}
            onChange={(e) => handleSameAsOwnerChange(e.target.checked)}
            className="sameAsOwnerCheckbox"
          />
          Same as Plate Owner
        </label>
        {showValidationErrors && validationErrors.length > 0 && (
          <div className="headerErrorMessage">Please complete all required fields below</div>
        )}
      </div>
      
      <div className="purchaserOwnerContent">
        <div className="personInfoColumns">
          {/* Purchaser Column */}
          <div className="personColumn purchaserColumn">
            <div className="infoField">
              <label className="infoLabel">
                True Full Name <span className="fieldNote">(Last, First, Middle Initial, Suffix)</span>
              </label>
              <input
                type="text"
                className={`infoInput ${showValidationErrors && getErrorMessage('purchaser.fullName') ? 'error-input' : ''}`}
                placeholder="Enter full name"
                value={getSafeValue(['platePurchaserOwner', 'purchaser', 'fullName'])}
                onChange={(e) => handlePurchaserChange('fullName', e.target.value)}
              />
              {showValidationErrors && getErrorMessage('purchaser.fullName') && (
                <div className="error-message">{getErrorMessage('purchaser.fullName')}</div>
              )}
            </div>
            
            <div className="addressCityRow">
              <div className="streetField">
                <label className="infoLabel">Street Address or PO Box</label>
                <input
                  type="text"
                  className={`infoInput ${showValidationErrors && getErrorMessage('purchaser.streetAddress') ? 'error-input' : ''}`}
                  placeholder="Enter street address or PO box"
                  value={getSafeValue(['platePurchaserOwner', 'purchaser', 'streetAddress'])}
                  onChange={(e) => handlePurchaserChange('streetAddress', e.target.value)}
                />
                {showValidationErrors && getErrorMessage('purchaser.streetAddress') && (
                  <div className="error-message">{getErrorMessage('purchaser.streetAddress')}</div>
                )}
              </div>
              
              <div className="cityField">
                <label className="infoLabel">City</label>
                <input
                  type="text"
                  className={`infoInput ${showValidationErrors && getErrorMessage('purchaser.city') ? 'error-input' : ''}`}
                  placeholder="Enter city"
                  value={getSafeValue(['platePurchaserOwner', 'purchaser', 'city'])}
                  onChange={(e) => handlePurchaserChange('city', e.target.value)}
                />
                {showValidationErrors && getErrorMessage('purchaser.city') && (
                  <div className="error-message">{getErrorMessage('purchaser.city')}</div>
                )}
              </div>
            </div>
            
            <div className="stateZipPhoneRow">
              <div className="stateField">
                <label className="infoLabel">State</label>
                <div className="regStateWrapper">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'purchaserState' ? null : 'purchaserState')}
                    className={`regStateDropDown purchaser-state-button ${showValidationErrors && getErrorMessage('purchaser.state') ? 'error-button' : ''}`}
                  >
                    {getSafeValue(['platePurchaserOwner', 'purchaser', 'state']) ? 
                      getSafeValue(['platePurchaserOwner', 'purchaser', 'state']) : 
                      'STATE'}
                    <ChevronDownIcon className={`regIcon ${openDropdown === 'purchaserState' ? 'rotate' : ''}`} />
                  </button>
                  {openDropdown === 'purchaserState' && (
                    <ul ref={purchaserStateRef} className="regStateMenu">
                      {states.map((state, index) => (
                        <li
                          key={index}
                          onClick={() => handlePurchaserStateSelect(state.abbreviation)}
                          className="regStateLists"
                        >
                          {state.name}
                        </li>
                      ))}
                    </ul>
                  )}
                  {showValidationErrors && getErrorMessage('purchaser.state') && (
                    <div className="error-message">{getErrorMessage('purchaser.state')}</div>
                  )}
                </div>
              </div>
              
              <div className="zipField">
                <label className="infoLabel">ZIP Code</label>
                <input
                  type="text"
                  className={`infoInput ${showValidationErrors && getErrorMessage('purchaser.zipCode') ? 'error-input' : ''}`}
                  placeholder="Enter ZIP code"
                  value={getSafeValue(['platePurchaserOwner', 'purchaser', 'zipCode'])}
                  onChange={(e) => handlePurchaserChange('zipCode', e.target.value)}
                />
                {showValidationErrors && getErrorMessage('purchaser.zipCode') && (
                  <div className="error-message">{getErrorMessage('purchaser.zipCode')}</div>
                )}
              </div>
              
              <div className="phoneField">
                <label className="infoLabel">Phone Number</label>
                <input
                  type="tel"
                  className={`infoInput ${showValidationErrors && getErrorMessage('purchaser.phoneNumber') ? 'error-input' : ''}`}
                  placeholder="Phone Number"
                  value={getSafeValue(['platePurchaserOwner', 'purchaser', 'phoneNumber'])}
                  onChange={(e) => handlePurchaserChange('phoneNumber', e.target.value)}
                />
                {showValidationErrors && getErrorMessage('purchaser.phoneNumber') && (
                  <div className="error-message">{getErrorMessage('purchaser.phoneNumber')}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="personColumn ownerColumn">
            <div className="ownerHeader">
              <h4 className="ownerTitle">PLATE OWNER <span className="ownerNote">(If different from PLATE PURCHASER, i.e. gift or release)</span></h4>
            </div>
            
            <div className="infoField">
              <label className="infoLabel">
                True Full Name <span className="fieldNote">(Last, First, Middle Initial, Suffix)</span>
              </label>
              <input
                type="text"
                className={`infoInput ${!safeFormData.platePurchaserOwner.sameAsOwner && showValidationErrors && getErrorMessage('owner.fullName') ? 'error-input' : ''}`}
                placeholder="Enter full name"
                value={getSafeValue(['platePurchaserOwner', 'owner', 'fullName'])}
                onChange={(e) => handleOwnerChange('fullName', e.target.value)}
                disabled={safeFormData.platePurchaserOwner.sameAsOwner}
              />
              {!safeFormData.platePurchaserOwner.sameAsOwner && showValidationErrors && getErrorMessage('owner.fullName') && (
                <div className="error-message">{getErrorMessage('owner.fullName')}</div>
              )}
            </div>
            
            <div className="addressCityRow">
              <div className="streetField">
                <label className="infoLabel">Street Address or PO Box</label>
                <input
                  type="text"
                  className={`infoInput ${!safeFormData.platePurchaserOwner.sameAsOwner && showValidationErrors && getErrorMessage('owner.streetAddress') ? 'error-input' : ''}`}
                  placeholder="Enter street address or PO box"
                  value={getSafeValue(['platePurchaserOwner', 'owner', 'streetAddress'])}
                  onChange={(e) => handleOwnerChange('streetAddress', e.target.value)}
                  disabled={safeFormData.platePurchaserOwner.sameAsOwner}
                />
                {!safeFormData.platePurchaserOwner.sameAsOwner && showValidationErrors && getErrorMessage('owner.streetAddress') && (
                  <div className="error-message">{getErrorMessage('owner.streetAddress')}</div>
                )}
              </div>
              
              <div className="cityField">
                <label className="infoLabel">City</label>
                <input
                  type="text"
                  className={`infoInput ${!safeFormData.platePurchaserOwner.sameAsOwner && showValidationErrors && getErrorMessage('owner.city') ? 'error-input' : ''}`}
                  placeholder="Enter city"
                  value={getSafeValue(['platePurchaserOwner', 'owner', 'city'])}
                  onChange={(e) => handleOwnerChange('city', e.target.value)}
                  disabled={safeFormData.platePurchaserOwner.sameAsOwner}
                />
                {!safeFormData.platePurchaserOwner.sameAsOwner && showValidationErrors && getErrorMessage('owner.city') && (
                  <div className="error-message">{getErrorMessage('owner.city')}</div>
                )}
              </div>
            </div>
            
            <div className="stateZipPhoneRow">
              <div className="stateField">
                <label className="infoLabel">State</label>
                <div className="regStateWrapper">
                  <button
                    onClick={() => !safeFormData.platePurchaserOwner.sameAsOwner && 
                      setOpenDropdown(openDropdown === 'ownerState' ? null : 'ownerState')}
                    className={`regStateDropDown owner-state-button ${!safeFormData.platePurchaserOwner.sameAsOwner && showValidationErrors && getErrorMessage('owner.state') ? 'error-button' : ''}`}
                    disabled={safeFormData.platePurchaserOwner.sameAsOwner}
                  >
                    {getSafeValue(['platePurchaserOwner', 'owner', 'state']) ? 
                      getSafeValue(['platePurchaserOwner', 'owner', 'state']) : 
                      'STATE'}
                    <ChevronDownIcon className={`regIcon ${openDropdown === 'ownerState' ? 'rotate' : ''}`} />
                  </button>
                  {openDropdown === 'ownerState' && (
                    <ul ref={ownerStateRef} className="regStateMenu">
                      {states.map((state, index) => (
                        <li
                          key={index}
                          onClick={() => handleOwnerStateSelect(state.abbreviation)}
                          className="regStateLists"
                        >
                          {state.name}
                        </li>
                      ))}
                    </ul>
                  )}
                  {!safeFormData.platePurchaserOwner.sameAsOwner && showValidationErrors && getErrorMessage('owner.state') && (
                    <div className="error-message">{getErrorMessage('owner.state')}</div>
                  )}
                </div>
              </div>
              
              <div className="zipField">
                <label className="infoLabel">ZIP Code</label>
                <input
                  type="text"
                  className={`infoInput ${!safeFormData.platePurchaserOwner.sameAsOwner && showValidationErrors && getErrorMessage('owner.zipCode') ? 'error-input' : ''}`}
                  placeholder="Enter ZIP code"
                  value={getSafeValue(['platePurchaserOwner', 'owner', 'zipCode'])}
                  onChange={(e) => handleOwnerChange('zipCode', e.target.value)}
                  disabled={safeFormData.platePurchaserOwner.sameAsOwner}
                />
                {!safeFormData.platePurchaserOwner.sameAsOwner && showValidationErrors && getErrorMessage('owner.zipCode') && (
                  <div className="error-message">{getErrorMessage('owner.zipCode')}</div>
                )}
              </div>
              
              <div className="phoneField">
                <label className="infoLabel">Phone Number</label>
                <input
                  type="tel"
                  className={`infoInput ${!safeFormData.platePurchaserOwner.sameAsOwner && showValidationErrors && getErrorMessage('owner.phoneNumber') ? 'error-input' : ''}`}
                  placeholder="Phone Number"
                  value={getSafeValue(['platePurchaserOwner', 'owner', 'phoneNumber'])}
                  onChange={(e) => handleOwnerChange('phoneNumber', e.target.value)}
                  disabled={safeFormData.platePurchaserOwner.sameAsOwner}
                />
                {!safeFormData.platePurchaserOwner.sameAsOwner && showValidationErrors && getErrorMessage('owner.phoneNumber') && (
                  <div className="error-message">{getErrorMessage('owner.phoneNumber')}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatePurchaserOwner;