import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useFormContext } from '../../../app/api/formDataContext/formDataContextProvider';
import './SectionTwo.css';

interface Address {
  streetNumber?: string;
  streetName?: string;
  aptNo?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface SectionThreeData {
  address?: Address;
  mailingAddress?: Address;
  mailingAddressDifferent?: boolean;
}

interface SectionThreeProps {
  formData?: {
    newOrCorrectResidence?: SectionThreeData;
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

const initialSectionThreeData: SectionThreeData = {
  address: { ...initialAddress },
  mailingAddress: { ...initialAddress },
  mailingAddressDifferent: false
};

const states = [
  { name: 'Alabama', abbreviation: 'AL' },
  // ... (full list of states as in previous components)
  { name: 'Wyoming', abbreviation: 'WY' },
];

const SectionThree: React.FC<SectionThreeProps> = ({ formData: propFormData }) => {
  const [sectionData, setSectionData] = useState<SectionThreeData>(
    propFormData?.newOrCorrectResidence || initialSectionThreeData
  );
  const { updateField } = useFormContext();
  const [openDropdown, setOpenDropdown] = useState<'residential' | 'mailing' | null>(null);

  useEffect(() => {
    if (propFormData?.newOrCorrectResidence) {
      setSectionData(propFormData.newOrCorrectResidence);
    }
  }, [propFormData]);

  const handleAddressChange = (addressType: 'address' | 'mailingAddress', field: keyof Address, value: string) => {
    const newData = { 
      ...sectionData, 
      [addressType]: {
        ...(sectionData[addressType] || {}),
        [field]: value.toUpperCase()
      }
    };
    setSectionData(newData);
    updateField('newOrCorrectResidence', newData);
  };

  const handleMailingAddressToggle = () => {
    const newData = {
      ...sectionData,
      mailingAddressDifferent: !sectionData.mailingAddressDifferent
    };
    
    // Reset mailing address if unchecked
    if (!newData.mailingAddressDifferent) {
      newData.mailingAddress = { ...initialAddress };
    }
    
    setSectionData(newData);
    updateField('newOrCorrectResidence', newData);
  };

  return (
    <div className="releaseWrapper">
      <div className="headerRow">
        <h3 className="releaseHeading">New or Correct Residence or Business Address</h3>
      </div>
      
      <div className="streetAptGroup">
        <div className="formGroup streetField">
          <label className="formLabel">STREET NUMBER ONLY</label>
          <input
            className="formInputt"
            type="text"
            placeholder="Street Number"
            value={sectionData.address?.streetNumber || ''}
            onChange={(e) => handleAddressChange('address', 'streetNumber', e.target.value)}
            maxLength={10}
          />
        </div>
        <div className="formGroup aptField">
          <label className="formLabel">APT. NO.</label>
          <input
            className="formInputt"
            type="text"
            placeholder="Apt Number"
            value={sectionData.address?.aptNo || ''}
            onChange={(e) => handleAddressChange('address', 'aptNo', e.target.value)}
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
          value={sectionData.address?.streetName || ''}
          onChange={(e) => handleAddressChange('address', 'streetName', e.target.value)}
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
            value={sectionData.address?.city || ''}
            onChange={(e) => handleAddressChange('address', 'city', e.target.value)}
            maxLength={22}
          />
        </div>
        <div className="regStateWrapper">
          <label className="registeredOwnerLabel">STATE</label>
          <button
            onClick={() => setOpenDropdown(openDropdown === 'residential' ? null : 'residential')}
            className="regStateDropDown"
          >
            {sectionData.address?.state || 'State'}
            <ChevronDownIcon className={`regIcon ${openDropdown === 'residential' ? 'rotate' : ''}`} />
          </button>
          {openDropdown === 'residential' && (
            <ul className="regStateMenu">
              {states.map((state, index) => (
                <li
                  key={index}
                  onClick={() => {
                    handleAddressChange('address', 'state', state.abbreviation);
                    setOpenDropdown(null);
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
            value={sectionData.address?.zipCode || ''}
            onChange={(e) => handleAddressChange('address', 'zipCode', e.target.value)}
            maxLength={10}
          />
        </div>
      </div>

      <div className="mailingCheckboxWrapper">
        <label className="mailingCheckboxLabel">
          <input
            type="checkbox"
            className="mailingCheckboxInput"
            checked={sectionData.mailingAddressDifferent || false}
            onChange={handleMailingAddressToggle}
          />
          If mailing address is different
        </label>
      </div>

      {sectionData.mailingAddressDifferent && (
        <div>
          <div className="headerRow">
            <h3 className="releaseHeading">New or Correct Mailing Address</h3>
          </div>
          
          <div className="streetAptGroup">
            <div className="formGroup streetField">
              <label className="formLabel">STREET NUMBER ONLY</label>
              <input
                className="formInputt"
                type="text"
                placeholder="Street Number"
                value={sectionData.mailingAddress?.streetNumber || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'streetNumber', e.target.value)}
                maxLength={10}
              />
            </div>
            <div className="formGroup aptField">
              <label className="formLabel">APT. NO.</label>
              <input
                className="formInputt"
                type="text"
                placeholder="Apt Number"
                value={sectionData.mailingAddress?.aptNo || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'aptNo', e.target.value)}
                maxLength={10}
              />
            </div>
          </div>

          <div className="releaseFormGroup">
            <label className="releaseFormLabel">P.O. BOX OR STREET NAME OR STREET NAME AND PRIVATE MAIL BOX (PMB)</label>
            <input
              className="releaseFormInput"
              type="text"
              placeholder="Street/PO Box"
              value={sectionData.mailingAddress?.streetName || ''}
              onChange={(e) => handleAddressChange('mailingAddress', 'streetName', e.target.value)}
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
                value={sectionData.mailingAddress?.city || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'city', e.target.value)}
                maxLength={22}
              />
            </div>
            <div className="regStateWrapper">
              <label className="registeredOwnerLabel">STATE</label>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'mailing' ? null : 'mailing')}
                className="regStateDropDown"
              >
                {sectionData.mailingAddress?.state || 'State'}
                <ChevronDownIcon className={`regIcon ${openDropdown === 'mailing' ? 'rotate' : ''}`} />
              </button>
              {openDropdown === 'mailing' && (
                <ul className="regStateMenu">
                  {states.map((state, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        handleAddressChange('mailingAddress', 'state', state.abbreviation);
                        setOpenDropdown(null);
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
                value={sectionData.mailingAddress?.zipCode || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'zipCode', e.target.value)}
                maxLength={10}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionThree;