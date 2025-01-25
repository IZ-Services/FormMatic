// File: NewLienHolder.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './NewLienHolder.css';

const NewLienHolder = () => {
  const { formData, updateField } = useFormContext();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const regRef = useRef<HTMLUListElement | null>(null);
  const mailingRef = useRef<HTMLUListElement | null>(null);

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

  const handleStateChange = (dropdown: string, stateAbbreviation: string, isMailing = false) => {
    const lienHolder = formData.lienHolder || {};
    const addressKey = isMailing ? 'mailingAddress' : 'address';
    const currentAddress = lienHolder[addressKey] || {};

    updateField('lienHolder', {
      ...lienHolder,
      [addressKey]: {
        ...currentAddress,
        state: stateAbbreviation,
      },
    });
    setOpenDropdown(null);
  };

  return (
    <div className="newLienHolderWrapper">
      <div className="headingCheckboxWrapper">
        <h3 className="newLienHolderHeading">New Lien Holder</h3>
        <div className="mailingCheckboxWrapper">
          <label className="mailingCheckboxLabel">
            <input
              type="checkbox"
              className="mailingCheckboxInput"
              checked={formData.lienHolder?.mailingAddressDifferent || false}
              onChange={(e) => {
                const lienHolder = formData.lienHolder || {};
                updateField('lienHolder', {
                  ...lienHolder,
                  mailingAddressDifferent: e.target.checked,
                });
              }}
            />
            If mailing address is different
          </label>
        </div>
      </div>
      <div className="formGroup maxWidthField">
        <label className="formLabel">True Full Name or Bank/Finance Company or Individual</label>
        <input
          className="formInput"
          type="text"
          placeholder="True Full Name or Bank/Finance Company or Individual"
          value={formData.lienHolder?.name || ''}
          onChange={(e) => {
            const lienHolder = formData.lienHolder || {};
            updateField('lienHolder', { ...lienHolder, name: e.target.value });
          }}
        />
      </div>
      <div className="formGroup maxWidthField">
        <label className="formLabel">ELT Number</label>
        <input
          className="formInput"
          type="text"
          placeholder="ELT Number"
          value={formData.lienHolder?.eltNumber || ''}
          onChange={(e) => {
            const lienHolder = formData.lienHolder || {};
            updateField('lienHolder', { ...lienHolder, eltNumber: e.target.value });
          }}
        />
      </div>
      <div className="streetAptGroup">
        <div className="formGroup streetField">
          <label className="formLabel">Street</label>
          <input
            className="formInput"
            type="text"
            placeholder="Street"
            value={formData.lienHolder?.address?.street || ''}
            onChange={(e) => {
              const lienHolder = formData.lienHolder || {};
              const address = lienHolder.address || {};
              updateField('lienHolder', {
                ...lienHolder,
                address: { ...address, street: e.target.value },
              });
            }}
          />
        </div>
        <div className="formGroup aptField">
          <label className="formLabel">APT./SPACE/STE.#</label>
          <input
            className="formInput"
            type="text"
            placeholder="APT./SPACE/STE.#"
            value={formData.lienHolder?.address?.apt || ''}
            onChange={(e) => {
              const lienHolder = formData.lienHolder || {};
              const address = lienHolder.address || {};
              updateField('lienHolder', {
                ...lienHolder,
                address: { ...address, apt: e.target.value },
              });
            }}
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
            value={formData.lienHolder?.address?.city || ''}
            onChange={(e) => {
              const lienHolder = formData.lienHolder || {};
              const address = lienHolder.address || {};
              updateField('lienHolder', {
                ...lienHolder,
                address: { ...address, city: e.target.value },
              });
            }}
          />
        </div>
        <div className="regStateWrapper">
          <label className="registeredOwnerLabel">State</label>
          <button
            onClick={() => setOpenDropdown(openDropdown === 'reg' ? null : 'reg')}
            className="regStateDropDown"
          >
            {formData.lienHolder?.address?.state || 'State'}
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
            value={formData.lienHolder?.address?.zip || ''}
            onChange={(e) => {
              const lienHolder = formData.lienHolder || {};
              const address = lienHolder.address || {};
              updateField('lienHolder', {
                ...lienHolder,
                address: { ...address, zip: e.target.value },
              });
            }}
          />
        </div>
      </div>

      {formData.lienHolder?.mailingAddressDifferent && (
        <div className="addressWrapper">
          <h3 className="addressHeading">Mailing Address</h3>
          <div className="streetAptGroup">
            <div className="formGroup streetField">
              <label className="formLabel">Street</label>
              <input
                className="formInputt streetInput"
                type="text"
                placeholder="Street"
                value={formData.lienHolder?.mailingAddress?.street || ''}
                onChange={(e) => {
                  const lienHolder = formData.lienHolder || {};
                  const mailingAddress = lienHolder.mailingAddress || {};
                  updateField('lienHolder', {
                    ...lienHolder,
                    mailingAddress: { ...mailingAddress, street: e.target.value },
                  });
                }}
              />
            </div>
            <div className="formGroup aptField">
              <label className="formLabel">PO Box No</label>
              <input
                className="formInputt aptInput"
                type="text"
                placeholder="PO Box No"
                value={formData.lienHolder?.mailingAddress?.poBox || ''}
                onChange={(e) => {
                  const lienHolder = formData.lienHolder || {};
                  const mailingAddress = lienHolder.mailingAddress || {};
                  updateField('lienHolder', {
                    ...lienHolder,
                    mailingAddress: { ...mailingAddress, poBox: e.target.value },
                  });
                }}
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
                value={formData.lienHolder?.mailingAddress?.city || ''}
                onChange={(e) => {
                  const lienHolder = formData.lienHolder || {};
                  const mailingAddress = lienHolder.mailingAddress || {};
                  updateField('lienHolder', {
                    ...lienHolder,
                    mailingAddress: { ...mailingAddress, city: e.target.value },
                  });
                }}
              />
            </div>
            <div className="regStateWrapper">
              <label className="registeredOwnerLabel">State</label>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'mailing' ? null : 'mailing')}
                className="regStateDropDown"
              >
                {formData.lienHolder?.mailingAddress?.state || 'State'}
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
                value={formData.lienHolder?.mailingAddress?.zip || ''}
                onChange={(e) => {
                  const lienHolder = formData.lienHolder || {};
                  const mailingAddress = lienHolder.mailingAddress || {};
                  updateField('lienHolder', {
                    ...lienHolder,
                    mailingAddress: { ...mailingAddress, zip: e.target.value },
                  });
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewLienHolder;