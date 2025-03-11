'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './NewLienHolder.css';

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

interface FormContextType {
  formData: {
    lienHolder?: LienHolder;
  };
  updateField: (field: string, value: any) => void;
}

interface NewLienHolderProps {
  formData?: {
    lienHolder?: LienHolder;
  };   onChange?: (data: LienHolder) => void;
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

const NewLienHolder: React.FC<NewLienHolderProps> = ({ formData: propFormData, onChange }) => {
  const [lienHolderData, setLienHolderData] = useState<LienHolder>(
    propFormData?.lienHolder || initialLienHolder
  );
  const [eltError, setEltError] = useState<string>('');
  const { updateField } = useFormContext() as FormContextType;
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const regRef = useRef<HTMLUListElement>(null);
  const mailingRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (propFormData?.lienHolder) {
      setLienHolderData(propFormData.lienHolder);
    }
  }, [propFormData]);

  useEffect(() => {
    if (!lienHolderData) {
      const defaultData = initialLienHolder;
      setLienHolderData(defaultData);
      updateField('lienHolder', defaultData);       if (onChange) {
        onChange(defaultData);
      }
    }
  }, []);

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

  const handleInputChange = (field: keyof LienHolder, value: any) => {
    const newLienHolder = { ...lienHolderData, [field]: value };
    setLienHolderData(newLienHolder);
    updateField('lienHolder', newLienHolder);     if (onChange) {
      onChange(newLienHolder);
    }
  };

  const handleEltChange = (value: string) => {     const digitsOnly = value.replace(/\D/g, '');     const truncatedValue = digitsOnly.slice(0, 3);     if (value !== truncatedValue) {
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
    updateField('lienHolder', newLienHolder);     if (onChange) {
      onChange(newLienHolder);
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
              onChange={(e) => handleInputChange('mailingAddressDifferent', e.target.checked)}
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
            className="formInput"
            type="text"
            placeholder="True Full Name or Bank/Finance Company or Individual"
            value={lienHolderData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>

        <div className="formGroup" style={{ flex: '1' }}>
          <label className="formLabel">ELT Number (3 digits)</label>
          <input
            className="formInput"
            type="text"
            placeholder="ELT Number"
            value={lienHolderData.eltNumber || ''}
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

      <div className="streetAptGroup">
        <div className="formGroup streetField">
          <label className="formLabel">Street</label>
          <input
            className="formInput"
            type="text"
            placeholder="Street"
            value={lienHolderData.address?.street || ''}
            onChange={(e) => handleAddressChange('address', 'street', e.target.value)}
          />
        </div>
        <div className="formGroup aptField">
          <label className="formLabel">APT./SPACE/STE.#</label>
          <input
            className="formInput"
            type="text"
            placeholder="APT./SPACE/STE.#"
            value={lienHolderData.address?.apt || ''}
            onChange={(e) => handleAddressChange('address', 'apt', e.target.value)}
          />
        </div>
      </div>

      <div className="cityStateZipGroup">
        <div className="cityFieldCustomWidth">
          <label className="formLabel">City</label>
          <input
            className="cityInputt"
            type="text"
            placeholder="City"
            value={lienHolderData.address?.city || ''}
            onChange={(e) => handleAddressChange('address', 'city', e.target.value)}
          />
        </div>
        
        <div className="regStateWrapper">
          <label className="registeredOwnerLabel">State</label>
          <button
            onClick={() => setOpenDropdown(openDropdown === 'reg' ? null : 'reg')}
            className="regStateDropDown"
          >
            {lienHolderData.address?.state || 'State'}
            <ChevronDownIcon className={`regIcon ${openDropdown === 'reg' ? 'rotate' : ''}`} />
          </button>
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
            className="formInput"
            type="text"
            placeholder="Zip Code"
            value={lienHolderData.address?.zip || ''}
            onChange={(e) => handleAddressChange('address', 'zip', e.target.value)}
          />
        </div>
      </div>

      {lienHolderData.mailingAddressDifferent && (
        <div className="addressWrapper">
          <h3 className="addressHeading">Mailing Address</h3>
          <div className="streetAptGroup">
            <div className="formGroup streetField">
              <label className="formLabel">Street</label>
              <input
                className="formInputt streetInput"
                type="text"
                placeholder="Street"
                value={lienHolderData.mailingAddress?.street || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'street', e.target.value)}
              />
            </div>
            <div className="formGroup aptField">
              <label className="formLabel">PO Box No</label>
              <input
                className="formInputt aptInput"
                type="text"
                placeholder="PO Box No"
                value={lienHolderData.mailingAddress?.poBox || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'poBox', e.target.value)}
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
                value={lienHolderData.mailingAddress?.city || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'city', e.target.value)}
              />
            </div>

            <div className="regStateWrapper">
              <label className="registeredOwnerLabel">State</label>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'mailing' ? null : 'mailing')}
                className="regStateDropDown"
              >
                {lienHolderData.mailingAddress?.state || 'State'}
                <ChevronDownIcon className={`regIcon ${openDropdown === 'mailing' ? 'rotate' : ''}`} />
              </button>
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
                className="formInputt zipInput"
                type="text"
                placeholder="ZIP Code"
                value={lienHolderData.mailingAddress?.zip || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'zip', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewLienHolder;