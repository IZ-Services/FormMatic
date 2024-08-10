'use client';
import React, { useEffect, useRef, useState } from 'react';
import './NewRegisteredOwner.css';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const NewRegisteredOwners = () => {
    {/* copy for drop down of number */}
   const [isRegMenuOpen, setIsRegMenuOpen] = useState(false);
  const [regState, setRegState] = useState('');
  const regRef = useRef<HTMLUListElement | null>(null);

  {/* copy for drop down of number */}
  const handleRegStateChange = async (state: string) => {
    setIsRegMenuOpen(false);
    setRegState(state);
  };

          {/* copy for drop down of number */}
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
        {/* copy for drop down of number */}
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

  const states = [
    { name: "Alabama", abbreviation: "AL" },
    { name: "Alaska", abbreviation: "AK" },
    { name: "Arizona", abbreviation: "AZ" },
    { name: "Arkansas", abbreviation: "AR" },
    { name: "California", abbreviation: "CA" },
    { name: "Colorado", abbreviation: "CO" },
    { name: "Connecticut", abbreviation: "CT" },
    { name: "Delaware", abbreviation: "DE" },
    { name: "Florida", abbreviation: "FL" },
    { name: "Georgia", abbreviation: "GA" },
    { name: "Hawaii", abbreviation: "HI" },
    { name: "Idaho", abbreviation: "ID" },
    { name: "Illinois", abbreviation: "IL" },
    { name: "Indiana", abbreviation: "IN" },
    { name: "Iowa", abbreviation: "IA" },
    { name: "Kansas", abbreviation: "KS" },
    { name: "Kentucky", abbreviation: "KY" },
    { name: "Louisiana", abbreviation: "LA" },
    { name: "Maine", abbreviation: "ME" },
    { name: "Maryland", abbreviation: "MD" },
    { name: "Massachusetts", abbreviation: "MA" },
    { name: "Michigan", abbreviation: "MI" },
    { name: "Minnesota", abbreviation: "MN" },
    { name: "Mississippi", abbreviation: "MS" },
    { name: "Missouri", abbreviation: "MO" },
    { name: "Montana", abbreviation: "MT" },
    { name: "Nebraska", abbreviation: "NE" },
    { name: "Nevada", abbreviation: "NV" },
    { name: "New Hampshire", abbreviation: "NH" },
    { name: "New Jersey", abbreviation: "NJ" },
    { name: "New Mexico", abbreviation: "NM" },
    { name: "New York", abbreviation: "NY" },
    { name: "North Carolina", abbreviation: "NC" },
    { name: "North Dakota", abbreviation: "ND" },
    { name: "Ohio", abbreviation: "OH" },
    { name: "Oklahoma", abbreviation: "OK" },
    { name: "Oregon", abbreviation: "OR" },
    { name: "Pennsylvania", abbreviation: "PA" },
    { name: "Rhode Island", abbreviation: "RI" },
    { name: "South Carolina", abbreviation: "SC" },
    { name: "South Dakota", abbreviation: "SD" },
    { name: "Tennessee", abbreviation: "TN" },
    { name: "Texas", abbreviation: "TX" },
    { name: "Utah", abbreviation: "UT" },
    { name: "Vermont", abbreviation: "VT" },
    { name: "Virginia", abbreviation: "VA" },
    { name: "Washington", abbreviation: "WA" },
    { name: "West Virginia", abbreviation: "WV" },
    { name: "Wisconsin", abbreviation: "WI" },
    { name: "Wyoming", abbreviation: "WY" }
  ];

  return (
    <div className="new-registered-owners">
      <h3 className="newRegHeading">New Registered Owner(s)</h3>
      <div className="newRegFirstGroup">
        <div className="newRegFormItem">
          <label className='registeredOwnerLabel'>First Name</label>
          <input  className='registeredOwnerInput' type="text" placeholder="First Name" />
        </div>
        <div className="newRegFormItem">
          <label className='registeredOwnerLabel'>Middle Name</label>
          <input  className='registeredOwnerInput' type="text" placeholder="Middle Name" />
        </div>
        <div className="newRegFormItem">
          <label className='registeredOwnerLabel'>Last Name</label>
          <input  className='registeredOwnerInput' type="text" placeholder="Last Name" />
        </div>
      </div>
      <div className="newRegSecondGroup">
        <div className="newRegInfo">
          <label className='registeredOwnerLabel'>Driver License Number</label>
          <input  className='registeredOwnerLicenseInput' type="text" placeholder="Driver License Number" />
        </div>

        {/* copy for drop down of number */}
        <div className='regStateWrapper'>
          <label className='registeredOwnerLabel'>State</label>
            <button onClick={() => setIsRegMenuOpen(!isRegMenuOpen)} className="regStateDropDown">
              { regState || 'State'}
              <ChevronDownIcon className={`regIcon ${isRegMenuOpen ? 'rotate' : ''}`} />
            </button>
            {isRegMenuOpen && (
              <ul ref={regRef} className="regStateMenu">
                {states.map((state, index) => (
                  <li
                    className='regStateLists'
                    key={index}
                    onClick={() => handleRegStateChange(state.abbreviation)}
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
          <label className='registeredOwnerLabel'>Phone Number</label>
          <input className='registeredNumberInput' type="text" placeholder="Phone Number" />
        </div>
        <div className="newRegThirdItem">
          <label className='registeredOwnerLabel'>Date of Purchase</label>
          <input  className='registeredDateInput' type="text" placeholder="MM/DD/YYYY" />
        </div>
      </div>
    </div>
  );
};

export default NewRegisteredOwners;