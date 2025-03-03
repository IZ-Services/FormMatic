'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import './NewRegisteredOwner.css';

interface OwnerData {
  firstName: string;
  middleName: string;
  lastName: string;
  licenseNumber: string;
  state: string;
  phoneCode: string;
  phoneNumber: string;
  purchaseDate: string;
  purchaseValue: string;
  isGift: boolean;
  isTrade: boolean;
  relationshipWithGifter?: string;
  giftValue?: string;
}

interface NewRegisteredOwnersProps {
  formData?: { 
    owners?: OwnerData[]; 
    howMany?: string;
    vehicleTransactionDetails?: {
      isGift?: boolean;
      withTitle?: boolean;
      currentLienholder?: boolean;
      isMotorcycle?: boolean;
    };
  };
}

const phoneCodes = ['+1', '+44', '+91', '+61', '+81'];

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

const howManyOptions = ['1', '2', '3'];

const NewRegisteredOwners: React.FC<NewRegisteredOwnersProps> = ({ formData: propFormData }) => {
  const { formData: contextFormData, updateField } = useFormContext();
  
  const formData = {
    ...contextFormData,
    ...propFormData
  };
  
  const [owners, setOwners] = useState<OwnerData[]>([]);
  const [isRegMenuOpen, setIsRegMenuOpen] = useState(false);
  const [isHowManyMenuOpen, setIsHowManyMenuOpen] = useState(false);
  const [activeOwnerIndex, setActiveOwnerIndex] = useState(0);
  
  const isVehicleGift = formData?.vehicleTransactionDetails?.isGift === true;

  const regRef = useRef<HTMLUListElement | null>(null);
  const howManyRef = useRef<HTMLUListElement | null>(null);
  
  useEffect(() => {
    if (!formData?.howMany) {
      updateField('howMany', '1');
    }
  }, []);
  
  useEffect(() => {
    if (formData?.owners) {
      setOwners(formData.owners);
    }
  }, [formData?.owners]);
  
  useEffect(() => {
    if (!formData?.owners || formData.owners.length === 0) {
      const initialOwner = {
        firstName: '',
        middleName: '',
        lastName: '',
        licenseNumber: '',
        state: '',
        phoneCode: '',
        phoneNumber: '',
        purchaseDate: '',
        purchaseValue: '',
        isGift: false,
        isTrade: false,
        relationshipWithGifter: '',
        giftValue: '',
      };
      setOwners([initialOwner]);
      updateField('owners', [initialOwner]);
    }
  }, []);
  
  useEffect(() => {
    console.log("Gift status in NewRegisteredOwners:", isVehicleGift);
  }, [isVehicleGift]);

  const handleHowManyChange = (count: string) => {
    const newCount = parseInt(count);
    let newOwners = [...owners];

    while (newOwners.length < newCount) {
      newOwners.push({
        firstName: '',
        middleName: '',
        lastName: '',
        licenseNumber: '',
        state: '',
        phoneCode: '',
        phoneNumber: '',
        purchaseDate: '',
        purchaseValue: '',
        isGift: false,
        isTrade: false,
        relationshipWithGifter: '',
        giftValue: '',
      });
    }

    while (newOwners.length > newCount) {
      newOwners.pop();
    }

    setOwners(newOwners);
    updateField('owners', newOwners);
    updateField('howMany', count);
    setIsHowManyMenuOpen(false);
  };

  const handleOwnerFieldChange = (index: number, field: keyof OwnerData, value: any) => {
    const newOwners = [...owners];
    newOwners[index] = { ...newOwners[index], [field]: value };
    setOwners(newOwners);
    updateField('owners', newOwners);
  };

  const handleClickOutsideMenus = (e: MouseEvent) => {
    const target = e.target as Element;
    if (regRef.current && !regRef.current.contains(target) && !target.closest('.regStateDropDown')) {
      setIsRegMenuOpen(false);
    }
    if (howManyRef.current && !howManyRef.current.contains(target) && !target.closest('.howManyDropDown')) {
      setIsHowManyMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideMenus);
    return () => document.removeEventListener('mousedown', handleClickOutsideMenus);
  }, []);
  
  useEffect(() => {
  }, [JSON.stringify(formData?.vehicleTransactionDetails)]);
  
  return (
    <div className="new-registered-owners">
      <div className="newRegHeader">
        <h3 className="newRegHeading">New Registered Owner(s)</h3>
        <div className="howManyWrapper">
          <button
              onClick={() => setIsHowManyMenuOpen(!isHowManyMenuOpen)}
              className="howManyDropDown"
            >
              {String(formData?.howMany ?? '1')}
              <ChevronDownIcon className={`howManyIcon ${isHowManyMenuOpen ? 'rotate' : ''}`} />
            </button>

          {isHowManyMenuOpen && (
            <ul ref={howManyRef} className="howManyMenu">
              {howManyOptions.map((option, index) => (
                <li
                  className="howManyLists"
                  key={index}
                  onClick={() => handleHowManyChange(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {owners.map((owner, index) => (
        <div key={index} className="owner-section">
          <h4 className="owner-section-heading">New Registered Owner {index + 1}</h4>

          <div className="newRegFirstGroup">
            <div className="newRegFormItem">
              <label className="registeredOwnerLabel">First Name</label>
              <input
                className="registeredOwnerInput"
                type="text"
                placeholder="First Name"
                value={owner.firstName}
                onChange={(e) => handleOwnerFieldChange(index, 'firstName', e.target.value)}
              />
            </div>
            <div className="newRegFormItem">
              <label className="registeredOwnerLabel">Middle Name</label>
              <input
                className="registeredOwnerInput"
                type="text"
                placeholder="Middle Name"
                value={owner.middleName}
                onChange={(e) => handleOwnerFieldChange(index, 'middleName', e.target.value)}
              />
            </div>
            <div className="newRegFormItem">
              <label className="registeredOwnerLabel">Last Name</label>
              <input
                className="registeredOwnerInput"
                type="text"
                placeholder="Last Name"
                value={owner.lastName}
                onChange={(e) => handleOwnerFieldChange(index, 'lastName', e.target.value)}
              />
            </div>
          </div>

          <div className="newRegSecondGroup">
            <div className="newRegInfo">
              <label className="registeredOwnerLabel">Driver License Number</label>
              <input
                className="registeredOwnerLicenseInput"
                type="text"
                placeholder="Driver License Number"
                value={owner.licenseNumber}
                onChange={(e) => handleOwnerFieldChange(index, 'licenseNumber', e.target.value)}
              />
            </div>

            <div className="regStateWrapper">
              <label className="registeredOwnerLabel">State</label>
              <button
                onClick={() => {
                  setActiveOwnerIndex(index);
                  setIsRegMenuOpen(true);
                }}
                className="regStateDropDown"
              >
                {owner.state || 'State'}
                <ChevronDownIcon className={`regIcon ${isRegMenuOpen ? 'rotate' : ''}`} />
              </button>
              {isRegMenuOpen && activeOwnerIndex === index && (
                <ul ref={regRef} className="regStateMenu">
                  {states.map((state, stateIndex) => (
                    <li
                      className="regStateLists"
                      key={stateIndex}
                      onClick={() => {
                        handleOwnerFieldChange(index, 'state', state.abbreviation);
                        setIsRegMenuOpen(false);
                      }}
                    >
                      {state.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="newRegThirdGroup">
            <div className="newRegThirdItem">
              <label className="registeredOwnerLabel">Phone Number</label>
              <div className="phone-input-group">
                <select
                  className="phone-code-select"
                  value={owner.phoneCode}
                  onChange={(e) => handleOwnerFieldChange(index, 'phoneCode', e.target.value)}
                >
                  {phoneCodes.map((code) => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
                <input
                  className="registeredNumberInput"
                  type="text"
                  placeholder="Phone Number"
                  value={owner.phoneNumber}
                  onChange={(e) => handleOwnerFieldChange(index, 'phoneNumber', e.target.value)}
                />
              </div>
              </div>
              <div className="newRegThirdItem">
              <label className="registeredOwnerLabel">Date of Purchase</label>
              <input
                className="registeredDateInput"
                type="text"
                placeholder="MM/DD/YYYY"
                value={owner.purchaseDate}
                onChange={(e) => handleOwnerFieldChange(index, 'purchaseDate', e.target.value)}
              />
            </div>
            <div className="newRegThirdItem">
              <label className="registeredOwnerLabel">Purchase Price/Value</label>
              <input
                className="registeredValueInput"
                type="text"
                placeholder="Enter Amount"
                value={owner.purchaseValue}
                onChange={(e) => handleOwnerFieldChange(index, 'purchaseValue', e.target.value)}
              />
            </div>
            <div className="newRegThirdItem checkboxWrapper">
              {/* <label className="checkboxLabel">
                <input
                  type="checkbox"
                  className="checkboxInput"
                  checked={owner.isGift}
                  onChange={(e) => handleOwnerFieldChange(index, 'isGift', e.target.checked)}
                />{' '}
                Gift
              </label> */}
              <label className="checkboxLabel">
                <input
                  type="checkbox"
                  className="checkboxInput"
                  checked={owner.isTrade}
                  onChange={(e) => handleOwnerFieldChange(index, 'isTrade', e.target.checked)}
                />{' '}
                Trade
              </label>
            </div>
          </div>
          
          {/* Gift fields section - debugging output included */}
          {isVehicleGift ? (
            <div className="ownerGiftGroup">
              <div className="ownerGiftItem">
                <label className="registeredOwnerLabel">Relationship with Gifter</label>
                <input
                  className="registeredOwnerInput"
                  type="text"
                  placeholder="Enter Relationship"
                  value={owner.relationshipWithGifter || ''}
                  onChange={(e) => handleOwnerFieldChange(index, 'relationshipWithGifter', e.target.value)}
                />
              </div>
              <div className="ownerGiftItem">
                <label className="registeredOwnerLabel">Gift Value</label>
                <input
                  className="registeredOwnerInput"
                  type="text"
                  placeholder="Enter Gift Value"
                  value={owner.giftValue || ''}
                  onChange={(e) => handleOwnerFieldChange(index, 'giftValue', e.target.value)}
                />
              </div>
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
                Displayed because Vehicle is a Gift is checked
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default NewRegisteredOwners;