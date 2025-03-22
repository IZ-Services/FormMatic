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

interface PlatePurchaserOwnerProps {
  formData?: {
    platePurchaserOwner?: PlatePurchaserOwnerType;
  };
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

const PlatePurchaserOwner: React.FC<PlatePurchaserOwnerProps> = ({ formData: propFormData }) => {
  const { formData: contextFormData, updateField } = useFormContext();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const purchaserStateRef = useRef<HTMLUListElement>(null);
  const ownerStateRef = useRef<HTMLUListElement>(null);

  const formData = {
    ...contextFormData,
    ...propFormData
  };

  useEffect(() => {
    if (!formData.platePurchaserOwner) {
      updateField('platePurchaserOwner', initialPlatePurchaserOwner);
    }
  }, []);

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

  const handleSameAsOwnerChange = (checked: boolean) => {
    const currentInfo = { ...(formData.platePurchaserOwner || initialPlatePurchaserOwner) };
    
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

  const handlePurchaserChange = (field: keyof PersonInfoType, value: string) => {
    const currentInfo = { ...(formData.platePurchaserOwner || initialPlatePurchaserOwner) };     
    const capitalizedValue = field === 'state' || field === 'phoneNumber' ? value : capitalizeFirstLetter(value);
    
    currentInfo.purchaser = { ...currentInfo.purchaser, [field]: capitalizedValue };     
    if (currentInfo.sameAsOwner) {
      currentInfo.owner = { ...currentInfo.purchaser };
    }
    
    updateField('platePurchaserOwner', currentInfo);
  };

  const handleOwnerChange = (field: keyof PersonInfoType, value: string) => {
    const currentInfo = { ...(formData.platePurchaserOwner || initialPlatePurchaserOwner) };     
    const capitalizedValue = field === 'state' || field === 'phoneNumber' ? value : capitalizeFirstLetter(value);
    
    if (!currentInfo.owner) {
      currentInfo.owner = { ...initialPersonInfo };
    }
    
    currentInfo.owner = { ...currentInfo.owner, [field]: capitalizedValue };
    updateField('platePurchaserOwner', currentInfo);
  };
  
  const handlePurchaserStateSelect = (abbreviation: string) => {     
    handlePurchaserChange('state', abbreviation);     
    setOpenDropdown(null);
  };
  
  const handleOwnerStateSelect = (abbreviation: string) => {     
    handleOwnerChange('state', abbreviation);     
    setOpenDropdown(null);
  };

  return (
    <div className="purchaserOwnerWrapper">
      <div className="purchaserOwnerHeader">
        <h3 className="purchaserOwnerTitle">PLATE PURCHASER</h3>
        <label className="sameAsOwnerLabel">
          <input
            type="checkbox"
            checked={(formData.platePurchaserOwner as PlatePurchaserOwnerType)?.sameAsOwner}
            onChange={(e) => handleSameAsOwnerChange(e.target.checked)}
            className="sameAsOwnerCheckbox"
          />
          Same as Plate Owner
        </label>
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
                className="infoInput"
                placeholder="Enter full name"
                value={(formData.platePurchaserOwner as PlatePurchaserOwnerType)?.purchaser?.fullName || ''}
                onChange={(e) => handlePurchaserChange('fullName', e.target.value)}
              />
            </div>
            
            <div className="infoField">
              <label className="infoLabel">Street Address or PO Box</label>
              <input
                type="text"
                className="infoInput"
                placeholder="Enter street address or PO box"
                value={(formData.platePurchaserOwner as PlatePurchaserOwnerType)?.purchaser?.streetAddress || ''}
                onChange={(e) => handlePurchaserChange('streetAddress', e.target.value)}
              />
            </div>
            
            <div className="infoField">
              <label className="infoLabel">Phone Number</label>
              <input
                type="text"
                className="infoInput"
                placeholder="Enter phone number"
                value={(formData.platePurchaserOwner as PlatePurchaserOwnerType)?.purchaser?.phoneNumber || ''}
                onChange={(e) => handlePurchaserChange('phoneNumber', e.target.value)}
              />
            </div>
            
            <div className="cityStateZip">
              <div className="cityField">
                <label className="infoLabel">City</label>
                <input
                  type="text"
                  className="infoInput"
                  placeholder="Enter city"
                  value={(formData.platePurchaserOwner as PlatePurchaserOwnerType)?.purchaser?.city || ''}
                  onChange={(e) => handlePurchaserChange('city', e.target.value)}
                />
              </div>
              
              <div className="stateField">
                <label className="infoLabel">State</label>
                <div className="regStateWrapper">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'purchaserState' ? null : 'purchaserState')}
                    className="regStateDropDown purchaser-state-button"
                  >
                    {(formData.platePurchaserOwner as PlatePurchaserOwnerType)?.purchaser?.state || 'State'}
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
                </div>
              </div>
              
              <div className="zipField">
                <label className="infoLabel">ZIP Code</label>
                <input
                  type="text"
                  className="infoInput"
                  placeholder="Enter ZIP code"
                  value={(formData.platePurchaserOwner as PlatePurchaserOwnerType)?.purchaser?.zipCode || ''}
                  onChange={(e) => handlePurchaserChange('zipCode', e.target.value)}
                />
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
                className="infoInput"
                placeholder="Enter full name"
                value={(formData.platePurchaserOwner as PlatePurchaserOwnerType)?.owner?.fullName || ''}
                onChange={(e) => handleOwnerChange('fullName', e.target.value)}
                disabled={(formData.platePurchaserOwner as PlatePurchaserOwnerType)?.sameAsOwner}
              />
            </div>
            
            <div className="infoField">
              <label className="infoLabel">Street Address or PO Box</label>
              <input
                type="text"
                className="infoInput"
                placeholder="Enter street address or PO box"
                value={(formData.platePurchaserOwner as PlatePurchaserOwnerType)?.owner?.streetAddress || ''}
                onChange={(e) => handleOwnerChange('streetAddress', e.target.value)}
                disabled={(formData.platePurchaserOwner as PlatePurchaserOwnerType)?.sameAsOwner}
              />
            </div>
            
            <div className="infoField">
              <label className="infoLabel">Phone Number</label>
              <input
                type="text"
                className="infoInput"
                placeholder="Enter phone number"
                value={(formData.platePurchaserOwner as PlatePurchaserOwnerType)?.owner?.phoneNumber || ''}
                onChange={(e) => handleOwnerChange('phoneNumber', e.target.value)}
                disabled={(formData.platePurchaserOwner as PlatePurchaserOwnerType)?.sameAsOwner}
              />
            </div>
            
            <div className="cityStateZip">
              <div className="cityField">
                <label className="infoLabel">City</label>
                <input
                  type="text"
                  className="infoInput"
                  placeholder="Enter city"
                  value={(formData.platePurchaserOwner as PlatePurchaserOwnerType)?.owner?.city || ''}
                  onChange={(e) => handleOwnerChange('city', e.target.value)}
                  disabled={(formData.platePurchaserOwner as PlatePurchaserOwnerType)?.sameAsOwner}
                />
              </div>
              
              <div className="stateField">
                <label className="infoLabel">State</label>
                <div className="regStateWrapper">
                  <button
                    onClick={() => !((formData.platePurchaserOwner as PlatePurchaserOwnerType)?.sameAsOwner) && 
                      setOpenDropdown(openDropdown === 'ownerState' ? null : 'ownerState')}
                    className="regStateDropDown owner-state-button"
                    disabled={(formData.platePurchaserOwner as PlatePurchaserOwnerType)?.sameAsOwner}
                  >
                    {(formData.platePurchaserOwner as PlatePurchaserOwnerType)?.owner?.state || 'State'}
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
                </div>
              </div>
              
              <div className="zipField">
                <label className="infoLabel">ZIP Code</label>
                <input
                  type="text"
                  className="infoInput"
                  placeholder="Enter ZIP code"
                  value={(formData.platePurchaserOwner as PlatePurchaserOwnerType)?.owner?.zipCode || ''}
                  onChange={(e) => handleOwnerChange('zipCode', e.target.value)}
                  disabled={(formData.platePurchaserOwner as PlatePurchaserOwnerType)?.sameAsOwner}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatePurchaserOwner;