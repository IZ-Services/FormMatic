import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
// import './SellerAddress.css';

interface Address {
  street?: string;
  apt?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface SellerAddressProps {
  formData?: {
    sellerAddress?: Address;
  };
}

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

const initialAddress: Address = {
  street: '',
  apt: '',
  city: '',
  state: '',
  zip: ''
};

const SellerAddress: React.FC<SellerAddressProps> = ({ formData: propFormData }) => {
  const [addressData, setAddressData] = useState<Address>(
    propFormData?.sellerAddress || initialAddress
  );
  const { updateField } = useFormContext();
  const [openDropdown, setOpenDropdown] = useState(false);
  const stateRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (propFormData?.sellerAddress) {
      setAddressData(propFormData.sellerAddress);
    }
  }, [propFormData]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (openDropdown && 
        stateRef.current && 
        !stateRef.current.contains(target) &&
        !target.closest('.regStateDropDown')) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const handleAddressChange = (field: keyof Address, value: string) => {
    const newData = { 
      ...addressData, 
      [field]: value.toUpperCase() 
    };
    setAddressData(newData);
    updateField('sellerAddress', newData);
  };

  return (
    <div className="releaseWrapper">
      <div className="headerRow">
        <h3 className="releaseHeading">Seller Address</h3>
      </div>
      
      <div className="streetAptGroup">
        <div className="formGroup streetField">
          <label className="formLabel">Street</label>
          <input
            className="formInput"
            type="text"
            placeholder="Street"
            value={addressData.street || ''}
            onChange={(e) => handleAddressChange('street', e.target.value)}
          />
        </div>
        <div className="formGroup aptField">
          <label className="formLabel">Apt./Space/Ste.#</label>
          <input
            className="formInput"
            type="text"
            placeholder="Apt./Space/Ste.#"
            value={addressData.apt || ''}
            onChange={(e) => handleAddressChange('apt', e.target.value)}
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
            value={addressData.city || ''}
            onChange={(e) => handleAddressChange('city', e.target.value)}
          />
        </div>
        
        <div className="regStateWrapper">
          <label className="registeredOwnerLabel">State</label>
          <button
            onClick={() => setOpenDropdown(openDropdown ? false : true)}
            className="regStateDropDown"
          >
            {addressData.state || 'State'}
            <ChevronDownIcon className={`regIcon ${openDropdown ? 'rotate' : ''}`} />
          </button>
          {openDropdown && (
            <ul ref={stateRef} className="regStateMenu">
              {states.map((state, index) => (
                <li
                  key={index}
                  onClick={() => {
                    handleAddressChange('state', state.abbreviation);
                    setOpenDropdown(false);
                  }}
                  className="regStateLists"
                >
                  {state.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="formGroup zipCodeField">
          <label className="formLabel">Zip Code</label>
          <input
            className="formInput"
            type="text"
            placeholder="Zip Code"
            value={addressData.zip || ''}
            onChange={(e) => handleAddressChange('zip', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SellerAddress;