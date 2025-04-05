import React, { useState, useEffect, useRef } from 'react';
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  

  const dropdownRefs = {
    residential: useRef<HTMLDivElement>(null),
    mailing: useRef<HTMLDivElement>(null),
    trailerVessel: useRef<HTMLDivElement>(null)
  };

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


  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Element;
    
    Object.entries(dropdownRefs).forEach(([key, ref]) => {
      if (openDropdown === key && ref.current && !ref.current.contains(target)) {
        setOpenDropdown(null);
      }
    });
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);


  const renderStateDropdown = (addressType: 'address' | 'mailingAddress' | 'trailerVesselAddress', dropdownId: string, value?: string) => {
    const refKey = dropdownId as keyof typeof dropdownRefs;
    
    return (
      <div className="state-field" ref={dropdownRefs[refKey]}>
        <label className="state-label">STATE</label>
        <div className="state-dropdown-wrapper">
          <button
            type="button"
            className="state-dropdown-button"
            onClick={() => setOpenDropdown(openDropdown === dropdownId ? null : dropdownId)}
          >
            {value || 'STATE'}
            <ChevronDownIcon 
              className={`state-icon ${openDropdown === dropdownId ? 'rotate' : ''}`}
              style={{ width: '18px', height: '18px' }} 
            />
          </button>
          
          {openDropdown === dropdownId && (
            <div className="state-dropdown-menu">
              {states.map((state) => (
                <div
                  key={state.abbreviation}
                  className="state-dropdown-item"
                  onClick={() => {
                    handleAddressChange(addressType, 'state', state.abbreviation);
                    setOpenDropdown(null);
                  }}
                >
                  {state.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="releaseWrapper">
      {/* Fixed styles for state dropdown to prevent it from being cut off */}
      <style>{`
        .state-dropdown-wrapper {
          position: relative;
          width: 120px;
        }

        .state-dropdown-button {
          width: 100%;
          padding: 10px 12px;
          background-color: white;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 16px;
          color: #495057;
          text-align: left;
          height: 35px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        }

        .state-dropdown-button:hover {
          border-color: #b8b8b8;
        }

        .state-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 9999; /* Significantly increased z-index to ensure it appears above all other elements */
          width: 100%;
          height: 170px;
          max-height: 300px;
          overflow-y: auto;
          background-color: white;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 4px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
          margin-top: 2px;
        }

        /* Make sure the dropdown container is above everything else */
        .state-field {
          position: relative;
          // flex: 0 0 120px;
          // z-index: 1000; /* Add z-index to the container */
        }

        .state-dropdown-item {
          padding: 7px 15px;
          color: #9b9b9b;
          cursor: pointer;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-align: center;
          text-overflow: ellipsis;
        }

        .state-dropdown-item:hover {
          background-color: #f8f9fa;
          color: #212529;
        }

        /* Ensure the dropdown doesn't get cut off */
        .cityStateZipGroupp {
          position: relative;
          overflow: visible !important; /* Ensure the container doesn't clip overflow */
        }

        /* Make sure parent wrapper doesn't hide the dropdown */
        .releaseWrapper {
          overflow: visible !important;
        }

        .state-dropdown-menu::-webkit-scrollbar {
          width: 6px;
        }

        .state-dropdown-menu::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .state-dropdown-menu::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .state-dropdown-menu::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        .rotate {
          transform: rotate(180deg);
        }

        .state-label {
          display: block;
          margin-bottom: 5px;
          font-size: 14px;
          font-weight: 400;
          color: #333;
        }
        
        /* New styles for checkbox row */
        .checkbox-row {
          display: flex;
          flex-direction: row;
          gap: 30px;
          margin-top: 10px;
          margin-bottom: 20px;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #333;
        }
      `}</style>

      <div className="headerRow">
        <h3 className="releaseHeading">New or Correct Residence or Business Address</h3>
      </div>
      
      {/* Moved both checkboxes into a single row */}
      <div className="checkbox-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            className="mailingCheckboxInput"
            checked={sectionData.mailingAddressDifferent || false}
            onChange={handleMailingAddressToggle}
          />
          If mailing address is different
        </label>
        
        <label className="checkbox-label">
          <input
            type="checkbox"
            className="mailingCheckboxInput"
            checked={sectionData.hasTrailerVessel || false}
            onChange={handleTrailerVesselToggle}
          />
          Location of Trailer Coach or Vessel
        </label>
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

      <div className="releaseForm">
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
          <label className="formLabell">CITY - DO NOT ABBREVIATE</label>
          <input
            className="cityInputt"
            type="text"
            placeholder="City"
            value={sectionData.address?.city || ''}
            onChange={(e) => handleAddressChange('address', 'city', e.target.value)}
            maxLength={22}
          />
        </div>
        
        {/* New State Dropdown Component */}
        {renderStateDropdown('address', 'residential', sectionData.address?.state)}
        
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
      <div className="releaseForm">
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

          <div className="releaseForm">
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
              <label className="formLabelll">CITY - DO NOT ABBREVIATE</label>
              <input
                className="cityInputt"
                type="text"
                placeholder="City"
                value={sectionData.mailingAddress?.city || ''}
                onChange={(e) => handleAddressChange('mailingAddress', 'city', e.target.value)}
                maxLength={22}
              />
            </div>
            
            {/* New State Dropdown for Mailing */}
            {renderStateDropdown('mailingAddress', 'mailing', sectionData.mailingAddress?.state)}
            
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

          <div className="releaseForm">
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
              <label className="formLabelll">CITY - DO NOT ABBREVIATE - USE FIRST 16 CHARACTERS IN CITY NAME</label>
              <input
                className="cityInputt"
                type="text"
                placeholder="City"
                value={sectionData.trailerVesselAddress?.city || ''}
                onChange={(e) => handleAddressChange('trailerVesselAddress', 'city', e.target.value)}
                maxLength={16}
              />
            </div>
            
            {/* New State Dropdown for Trailer/Vessel */}
            {renderStateDropdown('trailerVesselAddress', 'trailerVessel', sectionData.trailerVesselAddress?.state)}
            
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
          <div className="releaseForm">
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