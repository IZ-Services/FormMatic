'use client';
import React, { useState, useRef, useEffect } from 'react';
import './ResidentialAddress.css';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function ResidentialAddress() {
  const [isRegMenuOpen, setIsRegMenuOpen] = useState(false);
  const regRef = useRef<HTMLUListElement | null>(null);
  const [regState, setRegState] = useState('');
  const [isMailingAddress, setIsMailingAddress] = useState(false);
  const [isMailingMenuOpen, setIsMailingMenuOpen] = useState(false);
  const mailingRef = useRef<HTMLUListElement | null>(null);
  const [mailingState, setMailingState] = useState('');

  const [missingTitleReason, setMissingTitleReason] = useState('');
  const [showMissingTitleOtherInput, setShowMissingTitleOtherInput] = useState(false);
  const [missingTitleOther, setMissingTitleOther] = useState('');

  const [powerOfAttorney, setPowerOfAttorney] = useState('');
  const [showPowerOfAttorneyOtherInput, setShowPowerOfAttorneyOtherInput] = useState(false);
  const [powerOfAttorneyOther, setPowerOfAttorneyOther] = useState('');

  const [openDropdown, setOpenDropdown] = useState<'reg' | 'mailing' | null>(null);


  const handleMissingTitleReasonChange = (reason: string) => {
    setMissingTitleReason(reason);
    setShowMissingTitleOtherInput(reason === 'Other');
  };

  const handlePowerOfAttorneyChange = (reason: string) => {
    setPowerOfAttorney(reason);
    setShowPowerOfAttorneyOtherInput(reason === 'Other');
  };

  const handleClickOutsideRegMenu = (e: MouseEvent) => {
    const target = e.target as Element;
    if (
      regRef.current &&
      !regRef.current.contains(target) &&
      !target.closest('.regStateDropDown')
    ) {
      setIsRegMenuOpen(false);
    }
  };

  const handleClickOutsideMailingMenu = (e: MouseEvent) => {
    const target = e.target as Element;
    if (
      mailingRef.current &&
      !mailingRef.current.contains(target) &&
      !target.closest('.regStateDropDown')
    ) {
      setIsMailingMenuOpen(false);
    }
  };

  const handleDropdownClick = (dropdown: 'reg' | 'mailing') => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const handleStateChange = (
    stateSetter: React.Dispatch<React.SetStateAction<string>>,
    dropdown: string,
    state: string
  ) => {
    stateSetter(state);
    setOpenDropdown(null); 
  };

  useEffect(() => {
    if (isRegMenuOpen) {
      document.addEventListener('mousedown', handleClickOutsideRegMenu);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideRegMenu);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideRegMenu);
    };
  }, [isRegMenuOpen]);

  useEffect(() => {
    if (isMailingMenuOpen) {
      document.addEventListener('mousedown', handleClickOutsideMailingMenu);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideMailingMenu);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMailingMenu);
    };
  }, [isMailingMenuOpen]);

  

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

  const missingTitleOptions = ['Lost', 'Damaged', 'Never Received', 'Other'];
  const powerOfAttorneyOptions = ['General', 'Limited', 'Medical', 'Other'];

  return (
    <div>
      <div className="addressWrapper">
        <div className="addressCheckboxWrapper">
          <h3 className="addressHeading">Residential Address</h3>
          <div className="checkboxSection">
            <input
              type="checkbox"
              className="checkBoxAddress"
              checked={isMailingAddress}
              onChange={() => setIsMailingAddress(!isMailingAddress)}
            />
            <p>If mailing address is different</p>
          </div>
        </div>
        <div className="streetAptGroup">
          <div className="formGroup streetField">
            <label className="formLabel">Street</label>
            <input className="formInputt" type="text" placeholder="Street" />
          </div>
          <div className="formGroup aptField">
            <label className="formLabel">APT./SPACE/STE.#</label>
            <input className="formInputt" type="text" placeholder="APT./SPACE/STE.#" />
          </div>
        </div>
        <div className="cityStateZipGroupp">
          <div className="cityFieldCustomWidth">
            <label className="formLabel">City</label>
            <input className="cityInputt" type="text" placeholder="City" />
          </div>
          <div className="regStateWrapper">
                    <label className="registeredOwnerLabel">State</label>
                    <button onClick={() => handleDropdownClick('reg')} className="regStateDropDown">
                      {regState || 'State'}
                      <ChevronDownIcon className={`regIcon ${openDropdown === 'reg' ? 'rotate' : ''}`} />
                    </button>
                    {openDropdown === 'reg' && (
                      <ul ref={regRef} className="regStateMenu">
                        {states.map((state, index) => (
                          <li
                            key={index}
                            onClick={() => handleStateChange(setRegState, 'reg', state.abbreviation)}
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
            <input className="formInputt" type="text" placeholder="ZIP Code" />
          </div>
        </div>
      </div>

       {isMailingAddress && (
       <div className="addressWrapper">
         <h3 className="addressHeading">Mailing Address</h3>
         <div className="streetAptGroup">
           <div className="formGroup streetField">
             <label className="formLabel">Street</label>
             <input className="formInputt streetInput" type="text" placeholder="Street" />
           </div>
           <div className="formGroup aptField">
             <label className="formLabel">PO Box No</label>
             <input className="formInputt aptInput" type="text" placeholder="PO Box No" />
           </div>
         </div>
         <div className="cityStateZipGroupp">
         <div className="cityFieldCustomWidth">
       <label className="formLabel">City</label>
       <input className="cityInputt" type="text" placeholder="City" />
     </div>
     
     <div className="regStateWrapper">
                 <label className="registeredOwnerLabel">State</label>
                 <button onClick={() => handleDropdownClick('mailing')} className="regStateDropDown">
                   {mailingState || 'State'}
                   <ChevronDownIcon className={`regIcon ${openDropdown === 'mailing' ? 'rotate' : ''}`} />
                 </button>
                 {openDropdown === 'mailing' && (
                   <ul ref={mailingRef} className="regStateMenu">
                     {states.map((state, index) => (
                       <li
                         key={index}
                         onClick={() => handleStateChange(setMailingState, 'mailing', state.abbreviation)}
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
             <input className="formInputt zipInput" type="text" placeholder="ZIP Code" />
           </div>
         </div>
       </div>
     )}

      <div className="dropdownWrapper">
        <h3>Missing Title Reason</h3>
        <select
          className="dropdown"
          value={missingTitleReason}
          onChange={(e) => handleMissingTitleReasonChange(e.target.value)}
        >
          <option value="">Options</option>
          {missingTitleOptions.map((reason, index) => (
            <option key={index} value={reason}>
              {reason}
            </option>
          ))}
        </select>
        {showMissingTitleOtherInput && (
          <input
            type="text"
            className="otherInput"
            placeholder="Enter the reason"
            value={missingTitleOther}
            onChange={(e) => setMissingTitleOther(e.target.value)}
          />
        )}
      </div>

      <div className="dropdownWrapper">
        <h3>Power of Attorney</h3>
        <select
          className="dropdown"
          value={powerOfAttorney}
          onChange={(e) => handlePowerOfAttorneyChange(e.target.value)}
        >
          <option value="">Options</option>
          {powerOfAttorneyOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        {showPowerOfAttorneyOtherInput && (
          <input
            type="text"
            className="otherInput"
            placeholder="Enter the reason"
            value={powerOfAttorneyOther}
            onChange={(e) => setPowerOfAttorneyOther(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
