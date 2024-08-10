'use client';
import React, { useState, useRef, useEffect } from 'react';
import './Address.css';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function Address() {
  const [mailingAddress, setMailingAddress] = useState(false);
  const [lesseeAddress, setLesseeAddress] = useState(false);
  const [trailerAddress, setTrailerAddress] = useState(false);
  const [isAddressMenuOpen, setIsAddressMenuOpen] = useState(false);
  const [addressState, setAddressState] = useState('');
  const addressRef = useRef<HTMLUListElement | null>(null);
  const [isMailingMenuOpen, setIsMailingMenuOpen] = useState(false);
  const [mailingState, setMailingState] = useState('');
  const mailingRef = useRef<HTMLUListElement | null>(null);
  const [isLesseeMenuOpen, setIsLesseeMenuOpen] = useState(false);
  const [lesseeState, setLesseeState] = useState('');
  const lesseeRef = useRef<HTMLUListElement | null>(null);
  const [isTrailerMenuOpen, setIsTrailerMenuOpen] = useState(false);
  const [trailerState, setTrailerState] = useState('');
  const trailerRef = useRef<HTMLUListElement | null>(null);
  

  const handleAddressStateChange = async (state: string) => {
    setIsAddressMenuOpen(false);
    setAddressState(state);
  };
    const handleMailingStateChange = async (state: string) => {
    setIsMailingMenuOpen(false);
    setMailingState(state);
  };
  const handleLesseeStateChange = async (state: string) => {
    setIsLesseeMenuOpen(false);
    setLesseeState(state);
  };
  const handleTrailerStateChange = async (state: string) => {
    setIsTrailerMenuOpen(false);
    setTrailerState(state);
  };

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
    <div>
      <div className='addressWrapper'>
        <div className='addressCheckboxWrapper'>
          <h3 className="addressHeading">Address</h3>
          <div className="checkboxSection">
            <input
              type="checkbox"
              className='checkBoxAddress'
              checked={mailingAddress}
              onChange={() => setMailingAddress(!mailingAddress)}
            />
            <p>If mailing address is different</p>
          </div>
          <div className="checkboxSection">
            <input
              type="checkbox"
              className='checkBoxAddress'
              checked={lesseeAddress}
              onChange={() => setLesseeAddress(!lesseeAddress)}
            />
            <p>If lessee address is different</p>
          </div>
          <div className="checkboxSection">
            <input
              type="checkbox"
              className='checkBoxAddress'
              checked={trailerAddress}
              onChange={() => setTrailerAddress(!trailerAddress)}
            />
            <p>Trailer/Vessel location</p>
          </div>
        </div>
        <div className='addressFirstLine'>
          <div className='topGroup'>
            <label className='subHeadings'>Street</label>
            <input className="streetInput" placeholder="Street"></input>
          </div>
          <div>
            <label className='subHeadings'>APT./SPACE/STE.#</label>
            <input className="aptInput" placeholder="APT./SPACE/STE.#"></input>
          </div>
        </div>
        <div className='cityStateZipLine'>
          <div>
            <label className='subHeadings'>City</label>
            <input className="cityInput" placeholder="City"></input>
          </div>
          <div className='addressStateWrapper'>
            <label className='subHeadings'>State</label>
              <button onClick={() => setIsAddressMenuOpen(!isAddressMenuOpen)} className="addressStateDropDown">
              { addressState || 'State'}
              <ChevronDownIcon className={`addressIcon ${isAddressMenuOpen ? 'rotate' : ''}`} />
            </button>
            {isAddressMenuOpen && (
              <ul ref={addressRef} className="addressStateMenu">
                {states.map((state, index) => (
                  <li
                    className='addressStateLists'
                    key={index}
                    onClick={() => handleAddressStateChange(state.abbreviation)}
                  >
                    {state.name}
                  </li>                
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className='subHeadings'>Zip Code</label>
            <input className="zipInput" placeholder="Zip Code"></input>
          </div>
        </div>
      </div>
      
      {mailingAddress && (
        <div className='addressWrapper'>
          <h3 className="addressHeading">Mailing Address</h3>
          <div className='addressFirstLine'>
          <div className='topGroup'>
              <label className='subHeadings'>Street</label>
              <input className="streetInput" placeholder="Street"></input>
            </div>
            <div>
              <label className='subHeadings'>APT./SPACE/STE.#</label>
              <input className="aptInput" placeholder="APT./SPACE/STE.#"></input>
            </div>
          </div>
          <div className='cityStateZipLine'>
            <div>
              <label className='subHeadings'>City</label>
              <input className="cityInput" placeholder="City"></input>
            </div>
            <div className='addressStateWrapper'>
            <label className='subHeadings'>State</label>
              <button onClick={() => setIsMailingMenuOpen(!isMailingMenuOpen)} className="mailingStateDropDown">
              { mailingState || 'State'}
              <ChevronDownIcon className={`mailingIcon ${isMailingMenuOpen ? 'rotate' : ''}`} />
            </button>
            {isMailingMenuOpen && (
              <ul ref={mailingRef} className="addressStateMenu">
                {states.map((state, index) => (
                  <li
                    className='addressStateLists'
                    key={index}
                    onClick={() => handleMailingStateChange(state.abbreviation)}
                  >
                    {state.name}
                  </li>                
                ))}
              </ul>
            )}
          </div>
            <div>
              <label className='subHeadings'>Zip Code</label>
              <input className="zipInput" placeholder="Zip Code"></input>
            </div>
          </div>
        </div>
      )}

       {lesseeAddress && (
        <div className='addressWrapper'>
          <h3 className="addressHeading">Lessee Address</h3>
          <div className='addressFirstLine'>
          <div className='topGroup'>
              <label className='subHeadings'>Street</label>
              <input className="streetInput" placeholder="Street"></input>
            </div>
            <div>
              <label className='subHeadings'>APT./SPACE/STE.#</label>
              <input className="aptInput" placeholder="APT./SPACE/STE.#"></input>
            </div>
          </div>
          <div className='cityStateZipLine'>
            <div>
              <label className='subHeadings'>City</label>
              <input className="cityInput" placeholder="City"></input>
            </div>
            <div className='addressStateWrapper'>
            <label className='subHeadings'>State</label>
              <button onClick={() => setIsLesseeMenuOpen(!isLesseeMenuOpen)} className="lesseeStateDropDown">
              { lesseeState || 'State'}
              <ChevronDownIcon className={`lesseeIcon ${isLesseeMenuOpen ? 'rotate' : ''}`} />
            </button>
            {isLesseeMenuOpen && (
              <ul ref={lesseeRef} className="addressStateMenu">
                {states.map((state, index) => (
                  <li
                    className='addressStateLists'
                    key={index}
                    onClick={() => handleLesseeStateChange(state.abbreviation)}
                  >
                    {state.name}
                  </li>                
                ))}
              </ul>
            )}
          </div>
            <div>
              <label className='subHeadings'>Zip Code</label>
              <input className="zipInput" placeholder="Zip Code"></input>
            </div>
          </div>
        </div>
      )}

      {trailerAddress && (
        <div className='addressWrapper'>
          <h3 className="addressHeading">Vessel or Trailer Principally Kept At</h3>
          <div className='addressFirstLine'>
          <div className='topGroup'>
              <label className='subHeadings'>Street</label>
              <input className="streetInput" placeholder="Street"></input>
            </div>
            <div>
              <label className='subHeadings'>APT./SPACE/STE.#</label>
              <input className="aptInput" placeholder="APT./SPACE/STE.#"></input>
            </div>
          </div>
          <div className='cityStateZipLine'>
            <div>
              <label className='subHeadings'>City</label>
              <input className="cityInput" placeholder="City"></input>
            </div>
            <div className='addressStateWrapper'>
            <label className='subHeadings'>State</label>
              <button onClick={() => setIsTrailerMenuOpen(!isTrailerMenuOpen)} className="trailerStateDropDown">
              { trailerState || 'State'}
              <ChevronDownIcon className={`trailerIcon ${isTrailerMenuOpen ? 'rotate' : ''}`} />
            </button>
            {isTrailerMenuOpen && (
              <ul ref={trailerRef} className="addressStateMenu">
                {states.map((state, index) => (
                  <li
                    className='addressStateLists'
                    key={index}
                    onClick={() => handleTrailerStateChange(state.abbreviation)}
                  >
                    {state.name}
                  </li>                
                ))}
              </ul>
            )}
          </div>
            <div>
              <label className='subHeadings'>Zip Code</label>
              <input className="zipInput" placeholder="Zip Code"></input>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
