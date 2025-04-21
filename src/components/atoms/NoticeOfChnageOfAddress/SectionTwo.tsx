import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { useFormContext } from '../../../app/api/formDataContext/formDataContextProvider';
import './SectionTwo.css';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Address {
  streetNumber?: string;
  streetName?: string;
  aptNo?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface SectionTwoProps {
  formData?: {
    previousResidence?: Address;
  };
}

const initialAddress: Address = {
  streetNumber: '',
  streetName: '',
  aptNo: '',
  city: '',
  state: '',
  zipCode: ''
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
    color: 'rgb(150 148 148)',
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

const SectionTwo: React.FC<SectionTwoProps> = ({ formData: propFormData }) => {
  const { formData: contextFormData, updateField } = useFormContext();
  const [addressData, setAddressData] = useState<Address>(
    propFormData?.previousResidence || (contextFormData?.previousResidence as Address) || initialAddress
  );
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  

  const formData = {
    ...contextFormData,
    ...propFormData
  };


  useEffect(() => {
    if (!contextFormData?.previousResidence) {
      updateField('previousResidence', initialAddress);
    }
  }, []);


  useEffect(() => {
    const currentData = formData?.previousResidence;
    if (currentData) {
      setAddressData(currentData as Address);
    }
  }, [formData?.previousResidence]);
  

  useEffect(() => {
    console.log('Current SectionTwo form data:', formData?.previousResidence);
  }, [formData?.previousResidence]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setOpenDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddressChange = (field: keyof Address, value: string) => {
    const newData = { 
      ...addressData, 
      [field]: value.toUpperCase() 
    };
    setAddressData(newData);
    updateField('previousResidence', newData);
  };
  
  const clearForm = () => {
    setAddressData(initialAddress);
    updateField('previousResidence', initialAddress);
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
        <h3 className="releaseHeading">Previous Residence or Business Address</h3>
      
      </div>
      
      <div className="streetAptGroup">
        <div className="formGroup streetField">
          <label className="formLabel">STREET NUMBER ONLY</label>
          <input
            className="formInputt"
            type="text"
            placeholder="Street Number"
            value={addressData.streetNumber || ''}
            onChange={(e) => handleAddressChange('streetNumber', e.target.value)}
            maxLength={10}
          />
        </div>
        <div className="formGroup aptField">
          <label className="formLabel">APT. NO.</label>
          <input
            className="formInputt"
            type="text"
            placeholder="Apt Number"
            value={addressData.aptNo || ''}
            onChange={(e) => handleAddressChange('aptNo', e.target.value)}
            maxLength={10}
          />
        </div>
      </div>

      <div className="releaseForm">
        <label className="releaseFormLabel">STREET NAME (INCLUDE ST., AVE., RD., CT., ETC.)</label>
        <input
          className="releaseFormInput"
          type="text"
          placeholder="Street Name"
          value={addressData.streetName || ''}
          onChange={(e) => handleAddressChange('streetName', e.target.value)}
          maxLength={50}
        />
      </div>

      <div className="cityStateZipGroupp" style={cityStateZipStyle}>
        <div className="cityFieldCustomWidth">
          <label className="formLabell">CITY - DO NOT ABBREVIATE</label>
          <input
            className="cityInputt"
            type="text"
            placeholder="City"
            value={addressData.city || ''}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            maxLength={22}
          />
        </div>
        <div className="regStateWrapper" ref={dropdownRef} style={dropdownStyles.dropdownWrapper}>
          <label className="registeredOwnerLabel">STATE</label>
          <button
            type="button"
            onClick={() => setOpenDropdown(!openDropdown)}
            style={dropdownStyles.button}
          >
            {addressData.state || 'State'}
            <ChevronDownIcon 
              style={{
                ...dropdownStyles.chevron,
                transform: openDropdown ? 'rotate(180deg)' : 'none'
              }} 
            />
          </button>
          {openDropdown && (
            <ul style={dropdownStyles.dropdownMenu}>
              {states.map((state, index) => (
                <li
                  key={index}
                  onClick={() => {
                    handleAddressChange('state', state.abbreviation);
                    setOpenDropdown(false);
                  }}
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
          <label className="formLabel">ZIP CODE</label>
          <input
            className="formInputt"
            type="text"
            placeholder="Zip Code"
            value={addressData.zipCode || ''}
            onChange={(e) => handleAddressChange('zipCode', e.target.value)}
            maxLength={10}
          />
        </div>
      </div>
    </div>
  );
};

export default SectionTwo;