'use client';
import React, { useState, useRef, useEffect } from 'react';
import './Address.css';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function Address() {
  const [isRegMenuOpen, setIsRegMenuOpen] = useState(false);
  const regRef = useRef<HTMLUListElement | null>(null);
  const [mailingAddress, setMailingAddress] = useState(false);
  const [lesseeAddress, setLesseeAddress] = useState(false);
  const [trailerAddress, setTrailerAddress] = useState(false);
  const [isAddressMenuOpen, setIsAddressMenuOpen] = useState(false);
  const addressRef = useRef<HTMLUListElement | null>(null);
  const [isMailingMenuOpen, setIsMailingMenuOpen] = useState(false);
  const mailingRef = useRef<HTMLUListElement | null>(null);
  const [isLesseeMenuOpen, setIsLesseeMenuOpen] = useState(false);
  const lesseeRef = useRef<HTMLUListElement | null>(null);
  const [isTrailerMenuOpen, setIsTrailerMenuOpen] = useState(false);
  const [trailerState, setTrailerState] = useState('');
  const trailerRef = useRef<HTMLUListElement | null>(null);
    const [regState, setRegState] = useState('');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [mailingState, setMailingState] = useState('');
    const [lesseeState, setLesseeState] = useState('');


    const handleDropdownClick = (dropdown: string) => {
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
  
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      const refs = [regRef, addressRef, mailingRef, lesseeRef, trailerRef];
      const dropdownNames = ['reg', 'address', 'mailing', 'lessee', 'trailer'];
  
      if (
        openDropdown &&
        refs[dropdownNames.indexOf(openDropdown)]?.current &&
        !refs[dropdownNames.indexOf(openDropdown)]!.current!.contains(target)
      ) {
        setOpenDropdown(null);
      }
    };
  
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [openDropdown]);
  
   

  const handleClickOutsideAddressMenu = (e: MouseEvent) => {
    const target = e.target as Element;
    if (
      addressRef.current &&
      !addressRef.current.contains(target) &&
      !target.closest('.addressStateDropDown')
    ) {
      setIsAddressMenuOpen(false);
    }
  };

  const handleClickOutsideMailingMenu = (e: MouseEvent) => {
    const target = e.target as Element;
    if (
      mailingRef.current &&
      !mailingRef.current.contains(target) &&
      !target.closest('.mailingStateDropDown')
    ) {
      setIsMailingMenuOpen(false);
    }
  };

  const handleClickOutsideLesseeMenu = (e: MouseEvent) => {
    const target = e.target as Element;
    if (
      lesseeRef.current &&
      !lesseeRef.current.contains(target) &&
      !target.closest('.lesseeStateDropDown')
    ) {
      setIsLesseeMenuOpen(false);
    }
  };

  const handleClickOutsideTrailerMenu = (e: MouseEvent) => {
    const target = e.target as Element;
    if (
      trailerRef.current &&
      !trailerRef.current.contains(target) &&
      !target.closest('.trailerStateDropDown')
    ) {
      setIsTrailerMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isAddressMenuOpen) {
      document.addEventListener('mousedown', handleClickOutsideAddressMenu);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideAddressMenu);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideAddressMenu);
    };
  }, [isAddressMenuOpen]);

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

  useEffect(() => {
    if (isLesseeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutsideLesseeMenu);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideLesseeMenu);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideLesseeMenu);
    };
  }, [isLesseeMenuOpen]);

  useEffect(() => {
    if (isTrailerMenuOpen) {
      document.addEventListener('mousedown', handleClickOutsideTrailerMenu);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideTrailerMenu);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideTrailerMenu);
    };
  }, [isTrailerMenuOpen]);

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

  return (
    <div>
      <div className="addressWrapper">
        <div className="addressCheckboxWrapper">
          <h3 className="addressHeading">Address</h3>
          <div className="checkboxSection">
            <input
              type="checkbox"
              className="checkBoxAddress"
              checked={mailingAddress}
              onChange={() => setMailingAddress(!mailingAddress)}
            />
            <p>If mailing address is different</p>
          </div>
          <div className="checkboxSection">
            <input
              type="checkbox"
              className="checkBoxAddress"
              checked={lesseeAddress}
              onChange={() => setLesseeAddress(!lesseeAddress)}
            />
            <p>If lessee address is different</p>
          </div>
          <div className="checkboxSection">
            <input
              type="checkbox"
              className="checkBoxAddress"
              checked={trailerAddress}
              onChange={() => setTrailerAddress(!trailerAddress)}
            />
            <p>Trailer/Vessel location</p>
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
              <input className="formInputt" type="text" placeholder="Zip Code" />
            </div>
          </div>
      </div>

      {mailingAddress && (
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

{lesseeAddress && (
  <div className="addressWrapper">
    <h3 className="addressHeading">Lessee Address</h3>
    <div className="streetAptGroup">
      <div className="formGroup streetField">
        <label className="formLabel">Street</label>
        <input className="formInputt streetInput" type="text" placeholder="Street" />
      </div>
      <div className="formGroup aptField">
        <label className="formLabel">APT./SPACE/STE.#</label>
        <input className="formInputt aptInput" type="text" placeholder="APT./SPACE/STE.#" />
      </div>
    </div>
    <div className="cityStateZipGroupp">
    <div className="cityFieldCustomWidth">
  <label className="formLabel">City</label>
  <input className="cityInputt" type="text" placeholder="City" />
</div>

<div className="regStateWrapper">
            <label className="registeredOwnerLabel">State</label>
            <button onClick={() => handleDropdownClick('lessee')} className="regStateDropDown">
              {lesseeState || 'State'}
              <ChevronDownIcon className={`regIcon ${openDropdown === 'lessee' ? 'rotate' : ''}`} />
            </button>
            {openDropdown === 'lessee' && (
              <ul ref={lesseeRef} className="regStateMenu">
                {states.map((state, index) => (
                  <li
                    key={index}
                    onClick={() => handleStateChange(setLesseeState, 'lessee', state.abbreviation)}
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


{trailerAddress && (
  <div className="addressWrapper">
    <h3 className="addressHeading">Vessel or Trailer Coach Principally Kept At</h3>
    <div className="streetAptGroup">
      <div className="formGroup streetField">
        <label className="formLabel">Street</label>
        <input className="formInputt streetInput" type="text" placeholder="Street" />
      </div>
      <div className="formGroup aptField">
        <label className="formLabel">APT./SPACE/STE.#</label>
        <input className="formInputt aptInput" type="text" placeholder="APT./SPACE/STE.#" />
      </div>
    </div>
    <div className="cityStateZipGroupp">
    <div className="cityFieldCustomWidth">
  <label className="formLabel">City</label>
  <input className="cityInputt" type="text" placeholder="City" />
</div>

<div className="regStateWrapper">
            <label className="registeredOwnerLabel">State</label>
            <button onClick={() => handleDropdownClick('trailer')} className="regStateDropDown">
              {trailerState || 'State'}
              <ChevronDownIcon className={`regIcon ${openDropdown === 'trailer' ? 'rotate' : ''}`} />
            </button>
            {openDropdown === 'trailer' && (
              <ul ref={trailerRef} className="regStateMenu">
                {states.map((state, index) => (
                  <li
                    key={index}
                    onClick={() => handleStateChange(setTrailerState, 'trailer', state.abbreviation)}
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
    <div className="countryField">
        <label className="formLabel">Country</label>
        <input className="countryInput" type="text" placeholder="Country" />
      </div>
  </div>
)}



    </div>
  );
}
