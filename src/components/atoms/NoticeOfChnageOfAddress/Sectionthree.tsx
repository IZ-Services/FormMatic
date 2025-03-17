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
  county?: string; 
}

interface SectionThreeData {
  address?: Address;
  mailingAddress?: Address;
  trailerVesselAddress?: Address; 
  mailingAddressDifferent?: boolean;
  hasTrailerVessel?: boolean; 
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
  zipCode: '',
  county: '' 
};

const initialSectionThreeData: SectionThreeData = {
  address: { ...initialAddress },
  mailingAddress: { ...initialAddress },
  trailerVesselAddress: { ...initialAddress }, 
  mailingAddressDifferent: false,
  hasTrailerVessel: false 
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

const SectionThree: React.FC<SectionThreeProps> = ({ formData: propFormData }) => {
  const [sectionData, setSectionData] = useState<SectionThreeData>(
    propFormData?.newOrCorrectResidence || initialSectionThreeData
  );
  const { updateField } = useFormContext();
  const [openDropdown, setOpenDropdown] = useState<'residential' | 'mailing' | 'trailerVessel' | null>(null);

  useEffect(() => {
    if (propFormData?.newOrCorrectResidence) {
      setSectionData(propFormData.newOrCorrectResidence);
    }
  }, [propFormData]);

  const handleAddressChange = (addressType: 'address' | 'mailingAddress' | 'trailerVesselAddress', field: keyof Address, value: string) => {
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
    if (!newData.mailingAddressDifferent) {
      newData.mailingAddress = { ...initialAddress };
    }
    
    setSectionData(newData);
    updateField('newOrCorrectResidence', newData);
  };

  const handleTrailerVesselToggle = () => {
    const newData = {
      ...sectionData,
      hasTrailerVessel: !sectionData.hasTrailerVessel
    };     
    if (!newData.hasTrailerVessel) {
      newData.trailerVesselAddress = { ...initialAddress };
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

      {/* Added County field based on the image */}
      <div className="releaseFormGroup">
        <label className="releaseFormLabel">COUNTY - DO NOT ABBREVIATE</label>
        <input
          className="releaseFormInput"
          type="text"
          placeholder="County"
          value={sectionData.address?.county || ''}
          onChange={(e) => handleAddressChange('address', 'county', e.target.value)}
          maxLength={30}
        />
      </div>

      <div className="mailingCheckboxWrapperr">
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

      {/* New Checkbox for Location of Trailer Coach or Vessel */}
      <div className="mailingCheckboxWrapperr">
        <label className="mailingCheckboxLabel">
          <input
            type="checkbox"
            className="mailingCheckboxInput"
            checked={sectionData.hasTrailerVessel || false}
            onChange={handleTrailerVesselToggle}
          />
          Location of Trailer Coach or Vessel
        </label>
      </div>

      {/* Trailer Coach or Vessel Address Section */}
      {sectionData.hasTrailerVessel && (
        <div>
          <div className="headerRow">
            <h3 className="releaseHeading">Location of Trailer Coach or Vessel</h3>
          </div>
          
          <div className="streetAptGroup">
            <div className="formGroup streetField">
              <label className="formLabel">STREET NUMBER ONLY</label>
              <input
                className="formInputt"
                type="text"
                placeholder="Street Number"
                value={sectionData.trailerVesselAddress?.streetNumber || ''}
                onChange={(e) => handleAddressChange('trailerVesselAddress', 'streetNumber', e.target.value)}
                maxLength={10}
              />
            </div>
            <div className="formGroup aptField">
              <label className="formLabel">APT. NO.</label>
              <input
                className="formInputt"
                type="text"
                placeholder="Apt Number"
                value={sectionData.trailerVesselAddress?.aptNo || ''}
                onChange={(e) => handleAddressChange('trailerVesselAddress', 'aptNo', e.target.value)}
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
              value={sectionData.trailerVesselAddress?.streetName || ''}
              onChange={(e) => handleAddressChange('trailerVesselAddress', 'streetName', e.target.value)}
              maxLength={50}
            />
          </div>

          <div className="cityStateZipGroupp">
            <div className="cityFieldCustomWidth">
              <label className="formLabel">CITY - DO NOT ABBREVIATE - USE FIRST 16 CHARACTERS IN CITY NAME</label>
              <input
                className="cityInputt"
                type="text"
                placeholder="City"
                value={sectionData.trailerVesselAddress?.city || ''}
                onChange={(e) => handleAddressChange('trailerVesselAddress', 'city', e.target.value)}
                maxLength={16}
              />
            </div>
            <div className="regStateWrapper">
              <label className="registeredOwnerLabel">STATE</label>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'trailerVessel' ? null : 'trailerVessel')}
                className="regStateDropDown"
              >
                {sectionData.trailerVesselAddress?.state || 'State'}
                <ChevronDownIcon className={`regIcon ${openDropdown === 'trailerVessel' ? 'rotate' : ''}`} />
              </button>
              {openDropdown === 'trailerVessel' && (
                <ul className="regStateMenu">
                  {states.map((state, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        handleAddressChange('trailerVesselAddress', 'state', state.abbreviation);
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
                value={sectionData.trailerVesselAddress?.zipCode || ''}
                onChange={(e) => handleAddressChange('trailerVesselAddress', 'zipCode', e.target.value)}
                maxLength={10}
              />
            </div>
          </div>

          {/* County field for Trailer/Vessel */}
          <div className="releaseFormGroup">
            <label className="releaseFormLabel">COUNTY - DO NOT ABBREVIATE</label>
            <input
              className="releaseFormInput"
              type="text"
              placeholder="County"
              value={sectionData.trailerVesselAddress?.county || ''}
              onChange={(e) => handleAddressChange('trailerVesselAddress', 'county', e.target.value)}
              maxLength={30}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionThree;