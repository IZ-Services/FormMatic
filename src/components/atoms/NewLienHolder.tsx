'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './NewLienHolder.css';

export const NEW_LIEN_HOLDER_STORAGE_KEY = 'formmatic_new_lien_holder';

export const clearNewLienHolderStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(NEW_LIEN_HOLDER_STORAGE_KEY);
    console.log('New lien holder data cleared from localStorage');
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

interface LienHolder {
  name?: string;
  eltNumber?: string;
  mailingAddressDifferent?: boolean;
  address?: Address;
  mailingAddress?: MailingAddress;
}

interface ValidationError {
  field: string;
  message: string;
}

interface FormContextType {
  formData: {
    lienHolder?: LienHolder;
    _validationErrors?: Record<string, any>;
  };
  updateField: (field: string, value: any) => void;
  clearFormTriggered?: number | null;
}

interface NewLienHolderProps {
  formData?: {
    lienHolder?: LienHolder;
  };
  onChange?: (data: LienHolder) => void;
  showValidationErrors?: boolean;
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

const initialLienHolder: LienHolder = {
  name: '',
  eltNumber: '',
  mailingAddressDifferent: false,
  address: initialAddress,
  mailingAddress: initialMailingAddress
};

const NewLienHolder: React.FC<NewLienHolderProps> = ({ 
  formData: propFormData, 
  onChange,
  showValidationErrors = false 
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [lienHolderData, setLienHolderData] = useState<LienHolder>(initialLienHolder);
  const [eltError, setEltError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const { formData: contextFormData, updateField, clearFormTriggered } = useFormContext() as FormContextType;
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const regRef = useRef<HTMLUListElement>(null);
  const mailingRef = useRef<HTMLUListElement>(null);


  const validateLienHolder = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    

    if (!lienHolderData.name) {
      errors.push({
        field: 'name',
        message: 'Lien holder name is required'
      });
    }
    
    if (lienHolderData.eltNumber && lienHolderData.eltNumber.length !== 3) {
      errors.push({
        field: 'eltNumber',
        message: 'ELT Number must be exactly 3 digits'
      });
    }
    

    if (!lienHolderData.address?.street) {
      errors.push({
        field: 'address.street',
        message: 'Street is required'
      });
    }
    
    if (!lienHolderData.address?.city) {
      errors.push({
        field: 'address.city',
        message: 'City is required'
      });
    }
    
    if (!lienHolderData.address?.state) {
      errors.push({
        field: 'address.state',
        message: 'State is required'
      });
    }
    
    if (!lienHolderData.address?.zip) {
      errors.push({
        field: 'address.zip',
        message: 'ZIP code is required'
      });
    }
    

    if (lienHolderData.mailingAddressDifferent) {
      if (!lienHolderData.mailingAddress?.street) {
        errors.push({
          field: 'mailingAddress.street',
          message: 'Mailing street is required'
        });
      }
      
      if (!lienHolderData.mailingAddress?.city) {
        errors.push({
          field: 'mailingAddress.city',
          message: 'Mailing city is required'
        });
      }
      
      if (!lienHolderData.mailingAddress?.state) {
        errors.push({
          field: 'mailingAddress.state',
          message: 'Mailing state is required'
        });
      }
      
      if (!lienHolderData.mailingAddress?.zip) {
        errors.push({
          field: 'mailingAddress.zip',
          message: 'Mailing ZIP code is required'
        });
      }
    }
    
    return errors;
  };


useEffect(() => {
  if (showValidationErrors) {
    const errors = validateLienHolder();
    setValidationErrors(errors);
  }
}, [showValidationErrors, lienHolderData]);


useEffect(() => {
  if (showValidationErrors && validationErrors.length >= 0) {

    updateField('_validationErrors', {
      lienHolder: validationErrors.length > 0
    });
  }
}, [validationErrors, showValidationErrors]);

  useEffect(() => {
    if (clearFormTriggered) {
      console.log('Clear form triggered in NewLienHolder component');
      clearNewLienHolderStorage();
      setLienHolderData(initialLienHolder);
      
      updateField('lienHolder', initialLienHolder);
      
      if (onChange) {
        onChange(initialLienHolder);
      }
    }
  }, [clearFormTriggered]);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const savedData = localStorage.getItem(NEW_LIEN_HOLDER_STORAGE_KEY);
        
        if (savedData) {
          console.log("Loading new lien holder data from localStorage");
          const parsedData = JSON.parse(savedData);
          
          const mergedData = {
            ...initialLienHolder,
            ...parsedData,
            ...(propFormData?.lienHolder || {})
          };
          
          setLienHolderData(mergedData);
          
          updateField('lienHolder', mergedData);
          
          if (onChange) {
            onChange(mergedData);
          }
        } else if (propFormData?.lienHolder) {
          setLienHolderData(propFormData.lienHolder);
        } else {
          updateField('lienHolder', initialLienHolder);
          if (onChange) {
            onChange(initialLienHolder);
          }
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading saved new lien holder data:', error);
        setIsInitialized(true);
        
        if (propFormData?.lienHolder) {
          setLienHolderData(propFormData.lienHolder);
        } else {
          updateField('lienHolder', initialLienHolder);
          if (onChange) {
            onChange(initialLienHolder);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    if (isInitialized && propFormData?.lienHolder) {
      setLienHolderData(propFormData.lienHolder);
    }
  }, [propFormData, isInitialized]);

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Element;
    if (openDropdown === 'reg' && regRef.current && !regRef.current.contains(target)) {
      setOpenDropdown(null);
    } else if (openDropdown === 'mailing' && mailingRef.current && !mailingRef.current.contains(target)) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);


  const getErrorMessage = (field: string): string | null => {
    const error = validationErrors.find(err => err.field === field);
    return error ? error.message : null;
  };

  const handleInputChange = (field: keyof LienHolder, value: any) => {
    const newLienHolder = { ...lienHolderData, [field]: value };
    setLienHolderData(newLienHolder);
    updateField('lienHolder', newLienHolder);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(NEW_LIEN_HOLDER_STORAGE_KEY, JSON.stringify(newLienHolder));
    }
    
    if (onChange) {
      onChange(newLienHolder);
    }
    

    if (showValidationErrors) {
      const errors = validateLienHolder();
      setValidationErrors(errors);
      

      const currentValidationErrors = typeof contextFormData._validationErrors === 'object' && contextFormData._validationErrors !== null
        ? contextFormData._validationErrors
        : {};
        
      updateField('_validationErrors', {
        ...currentValidationErrors,
        lienHolder: errors.length > 0
      });
    }
  };

  const handleMailingCheckboxChange = (checked: boolean) => {
    const newLienHolder = { ...lienHolderData };
    newLienHolder.mailingAddressDifferent = checked;
    
    if (!checked) {
      newLienHolder.mailingAddress = {
        street: '',
        poBox: '',
        city: '',
        state: '',
        zip: ''
      };
    }
    
    setLienHolderData(newLienHolder);
    updateField('lienHolder', newLienHolder);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(NEW_LIEN_HOLDER_STORAGE_KEY, JSON.stringify(newLienHolder));
    }
    
    if (onChange) {
      onChange(newLienHolder);
    }
    

    if (showValidationErrors) {
      const errors = validateLienHolder();
      setValidationErrors(errors);
      

      const currentValidationErrors = typeof contextFormData._validationErrors === 'object' && contextFormData._validationErrors !== null
        ? contextFormData._validationErrors
        : {};
        
      updateField('_validationErrors', {
        ...currentValidationErrors,
        lienHolder: errors.length > 0
      });
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
    
    handleInputChange('eltNumber', truncatedValue);
  };

  const handleAddressChange = (addressType: 'address' | 'mailingAddress', field: string, value: string) => {
    const newLienHolder = { ...lienHolderData };
    newLienHolder[addressType] = {
      ...(newLienHolder[addressType] || {}),
      [field]: value
    };
    setLienHolderData(newLienHolder);
    updateField('lienHolder', newLienHolder);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(NEW_LIEN_HOLDER_STORAGE_KEY, JSON.stringify(newLienHolder));
    }
    
    if (onChange) {
      onChange(newLienHolder);
    }
    

    if (showValidationErrors) {
      const errors = validateLienHolder();
      setValidationErrors(errors);
      

      const currentValidationErrors = typeof contextFormData._validationErrors === 'object' && contextFormData._validationErrors !== null
        ? contextFormData._validationErrors
        : {};
        
      updateField('_validationErrors', {
        ...currentValidationErrors,
        lienHolder: errors.length > 0
      });
    }
  };

  const handleStateChange = (dropdown: string, stateAbbreviation: string, isMailing = false) => {
    const addressType = isMailing ? 'mailingAddress' : 'address';
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

  return (
    <div className="newLienHolderWrapper">
      <div className="headingCheckboxWrapper">
        <h3 className="newLienHolderHeading">New Lien Holder</h3>
        <div className="mailingCheckboxWrapper">
          <label className="mailingCheckboxLabel">
            <input
              type="checkbox"
              className="mailingCheckboxInput"
              checked={lienHolderData.mailingAddressDifferent || false}
              onChange={(e) => handleMailingCheckboxChange(e.target.checked)}
            />
            If mailing address is different
          </label>
        </div>
      </div>

      {/* Name and ELT in one row */}
      <div className="nameEltGroup" style={{ display: 'flex', gap: '1rem' }}>
        <div className="formGroup" style={{ flex: '3' }}>
          <label className="formLabel">True Full Name or Bank/Finance Company or Individual</label>
          <input
            className={`formInput ${showValidationErrors && getErrorMessage('name') ? 'error-input' : ''}`}
            type="text"
            placeholder="True Full Name or Bank/Finance Company or Individual"
            value={(lienHolderData.name || '').toUpperCase()}
            onChange={(e) => handleInputChange('name', e.target.value.toUpperCase())}
          />
          {showValidationErrors && getErrorMessage('name') && (
            <div className="error-message">{getErrorMessage('name')}</div>
          )}
        </div>

        <div className="formGroup" style={{ flex: '1' }}>
          <label className="formLabel">ELT Number (3 digits)</label>
          <input
            className={`formInput ${(showValidationErrors && getErrorMessage('eltNumber')) || eltError ? 'error-input' : ''}`}
            type="text"
            placeholder="ELT Number"
            value={(lienHolderData.eltNumber || '').toUpperCase()}
            onChange={(e) => handleEltChange(e.target.value.toUpperCase())}
            maxLength={3}
          />
          {(showValidationErrors && getErrorMessage('eltNumber')) || eltError ? (
            <div className="error-message">
              {getErrorMessage('eltNumber') || eltError}
            </div>
          ) : null}
        </div>
      </div>

      <div className="streetAptGroup">
        <div className="formGroup streetField">
          <label className="formLabel">Street</label>
          <input
            className={`formInput ${showValidationErrors && getErrorMessage('address.street') ? 'error-input' : ''}`}
            type="text"
            placeholder="Street"
            value={(lienHolderData.address?.street || '').toUpperCase()}
            onChange={(e) => handleAddressChange('address', 'street', e.target.value.toUpperCase())}
          />
          {showValidationErrors && getErrorMessage('address.street') && (
            <div className="error-message">{getErrorMessage('address.street')}</div>
          )}
        </div>
        <div className="formGroup aptField">
          <label className="formLabel">APT./SPACE/STE.#</label>
          <input
            className="formInput"
            type="text"
            placeholder="APT./SPACE/STE.#"
            value={(lienHolderData.address?.apt || '').toUpperCase()}
            onChange={(e) => handleAddressChange('address', 'apt', e.target.value.toUpperCase())}
          />
        </div>
      </div>

      <div className="cityStateZipGroup">
        <div className="cityFieldCustomWidth">
          <label className="formLabel">City</label>
          <input
            className={`cityInputt ${showValidationErrors && getErrorMessage('address.city') ? 'error-input' : ''}`}
            type="text"
            placeholder="City"
            value={(lienHolderData.address?.city || '').toUpperCase()}
            onChange={(e) => handleAddressChange('address', 'city', e.target.value.toUpperCase())}
          />
          {showValidationErrors && getErrorMessage('address.city') && (
            <div className="error-message">{getErrorMessage('address.city')}</div>
          )}
        </div>
        
        <div className="regStateWrapper">
          <label className="registeredOwnerLabel">State</label>
          <button
            onClick={() => setOpenDropdown(openDropdown === 'reg' ? null : 'reg')}
            className={`regStateDropDown ${showValidationErrors && getErrorMessage('address.state') ? 'error-input' : ''}`}
          >
            {lienHolderData.address?.state || 'State'}
            <ChevronDownIcon className={`regIcon ${openDropdown === 'reg' ? 'rotate' : ''}`} />
          </button>
          {showValidationErrors && getErrorMessage('address.state') && (
            <div className="error-message">{getErrorMessage('address.state')}</div>
          )}
          {openDropdown === 'reg' && (
            <ul ref={regRef} className="regStateMenu">
              {states.map((state, index) => (
                <li
                  className="regStateLists"
                  key={index}
                  onClick={() => handleStateChange('reg', state.abbreviation)}
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
            className={`formInput ${showValidationErrors && getErrorMessage('address.zip') ? 'error-input' : ''}`}
            type="text"
            placeholder="Zip Code"
            value={(lienHolderData.address?.zip || '').toUpperCase()}
            onChange={(e) => handleAddressChange('address', 'zip', e.target.value.toUpperCase())}
          />
          {showValidationErrors && getErrorMessage('address.zip') && (
            <div className="error-message">{getErrorMessage('address.zip')}</div>
          )}
        </div>
      </div>

      {lienHolderData.mailingAddressDifferent && (
        <div className="addressWrapper">
          <h3 className="addressHeading">Mailing Address</h3>
          <div className="streetAptGroup">
            <div className="formGroup streetField">
              <label className="formLabel">Street</label>
              <input
                className={`formInputt streetInput ${showValidationErrors && getErrorMessage('mailingAddress.street') ? 'error-input' : ''}`}
                type="text"
                placeholder="Street"
                value={(lienHolderData.mailingAddress?.street || '').toUpperCase()}
                onChange={(e) => handleAddressChange('mailingAddress', 'street', e.target.value.toUpperCase())}
              />
              {showValidationErrors && getErrorMessage('mailingAddress.street') && (
                <div className="error-message">{getErrorMessage('mailingAddress.street')}</div>
              )}
            </div>
            <div className="formGroup aptField">
              <label className="formLabel">APT./SPACE/STE.#</label>
              <input
                className="formInputt aptInput"
                type="text"
                placeholder="APT./SPACE/STE.#"
                value={(lienHolderData.mailingAddress?.poBox || '').toUpperCase()}
                onChange={(e) => handleAddressChange('mailingAddress', 'poBox', e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div className="cityStateZipGroupp">
            <div className="cityFieldCustomWidth">
              <label className="formLabel">City</label>
              <input
                className={`cityInputt ${showValidationErrors && getErrorMessage('mailingAddress.city') ? 'error-input' : ''}`}
                type="text"
                placeholder="City"
                value={(lienHolderData.mailingAddress?.city || '').toUpperCase()}
                onChange={(e) => handleAddressChange('mailingAddress', 'city', e.target.value.toUpperCase())}
              />
              {showValidationErrors && getErrorMessage('mailingAddress.city') && (
                <div className="error-message">{getErrorMessage('mailingAddress.city')}</div>
              )}
            </div>

            <div className="regStateWrapper">
              <label className="registeredOwnerLabel">State</label>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'mailing' ? null : 'mailing')}
                className={`regStateDropDown ${showValidationErrors && getErrorMessage('mailingAddress.state') ? 'error-input' : ''}`}
              >
                {lienHolderData.mailingAddress?.state || 'State'}
                <ChevronDownIcon className={`regIcon ${openDropdown === 'mailing' ? 'rotate' : ''}`} />
              </button>
              {showValidationErrors && getErrorMessage('mailingAddress.state') && (
                <div className="error-message">{getErrorMessage('mailingAddress.state')}</div>
              )}
              {openDropdown === 'mailing' && (
                <ul ref={mailingRef} className="regStateMenu">
                  {states.map((state, index) => (
                    <li
                      key={index}
                      onClick={() => handleStateChange('mailing', state.abbreviation, true)}
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
                className={`formInputt zipInput ${showValidationErrors && getErrorMessage('mailingAddress.zip') ? 'error-input' : ''}`}
                type="text"
                placeholder="ZIP Code"
                value={(lienHolderData.mailingAddress?.zip || '').toUpperCase()}
                onChange={(e) => handleAddressChange('mailingAddress', 'zip', e.target.value.toUpperCase())}
              />
              {showValidationErrors && getErrorMessage('mailingAddress.zip') && (
                <div className="error-message">{getErrorMessage('mailingAddress.zip')}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewLienHolder;