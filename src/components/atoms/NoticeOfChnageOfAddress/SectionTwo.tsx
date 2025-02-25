import React, { useState, useEffect } from 'react';
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

const SectionTwo: React.FC<SectionTwoProps> = ({ formData: propFormData }) => {
  const [addressData, setAddressData] = useState<Address>(
    propFormData?.previousResidence || initialAddress
  );
  const { updateField } = useFormContext();
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    if (propFormData?.previousResidence) {
      setAddressData(propFormData.previousResidence);
    }
  }, [propFormData]);

  const handleAddressChange = (field: keyof Address, value: string) => {
    const newData = { 
      ...addressData, 
      [field]: value.toUpperCase() 
    };
    setAddressData(newData);
    updateField('previousResidence', newData);
  };

  return (
    <div className="releaseWrapper">
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

      <div className="releaseFormGroup">
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

      <div className="cityStateZipGroupp">
        <div className="cityFieldCustomWidth">
          <label className="formLabel">CITY - DO NOT ABBREVIATE</label>
          <input
            className="cityInputt"
            type="text"
            placeholder="City"
            value={addressData.city || ''}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            maxLength={22}
          />
        </div>
        <div className="regStateWrapper">
          <label className="registeredOwnerLabel">STATE</label>
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="regStateDropDown"
          >
            {addressData.state || 'State'}
            <ChevronDownIcon className={`regIcon ${openDropdown ? 'rotate' : ''}`} />
          </button>
          {openDropdown && (
            <ul className="regStateMenu">
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