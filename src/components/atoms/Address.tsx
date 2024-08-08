'use client';
import React, { useState, useRef, useEffect } from 'react';
import './Address.css';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function Address() {
  const [mailingAddress, setMailingAddress] = useState(false);
  const [lesseeAddress, setLesseeAddress] = useState(false);
  const [trailerAddress, setTrailerAddress] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const menuRef = useRef<HTMLUListElement | null>(null);
  const [isSecondMenuOpen, setIsSecondMenuOpen] = useState(false);
  const [selectedSecondState, setSelectedSecondState] = useState('');
  const secondMenuRef = useRef<HTMLUListElement | null>(null);

  const handleStateChange = async (state: string) => {
    setIsMenuOpen(false);
    setSelectedState(state);
  };
    const handleSecondStateChange = async (state: string) => {
    setIsSecondMenuOpen(false);
    setSelectedSecondState(state);
  };

    const handleClickOutsideMenu = (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !target.closest('.stateDropDown')
      ) {
        setIsMenuOpen(false);
      }
  };

  const handleClickOutsideSecondMenu = (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        secondMenuRef.current &&
        !secondMenuRef.current.contains(target) &&
        !target.closest('.secondStateDropDown')
      ) {
        setIsSecondMenuOpen(false);
      }
  };

    useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutsideMenu);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideMenu);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMenu);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isSecondMenuOpen) {
      document.addEventListener('mousedown', handleClickOutsideSecondMenu);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideSecondMenu);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideSecondMenu);
    };
  }, [isSecondMenuOpen]);

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
          <div>
            <h5 className='subHeadings'>Street</h5>
            <input className="streetInput" placeholder="Street"></input>
          </div>
          <div>
            <h5 className='subHeadings'>APT./SPACE/STE.#</h5>
            <input className="aptInput" placeholder="APT./SPACE/STE.#"></input>
          </div>
        </div>
        <div className='cityStateZipLine'>
          <div>
            <h5 className='subHeadings'>City</h5>
            <input className="cityInput" placeholder="City"></input>
          </div>
          <div className='stateWrapper'>
            <h5 className='subHeadings'>State</h5>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="stateDropDown">
              { selectedState || 'State'}
              <ChevronDownIcon className={`stateIcon ${isMenuOpen ? 'rotate' : ''}`} />
            </button>
            {isMenuOpen && (
              <ul ref={menuRef} className="stateMenu">
                {states.map((state, index) => (
                  <li
                    className='stateLists'
                    key={index}
                    onClick={() => handleStateChange(state.abbreviation)}
                  >
                    {state.name}
                  </li>                
                ))}
              </ul>
            )}
          </div>
          <div>
            <h5 className='subHeadings'>Zip Code</h5>
            <input className="zipInput" placeholder="Zip Code"></input>
          </div>
        </div>
      </div>
      
      {mailingAddress && (
        <div className='addressWrapper'>
          <h3 className="addressHeading">Mailing Address</h3>
          <div className='addressFirstLine'>
            <div>
              <h5 className='subHeadings'>Street</h5>
              <input className="streetInput" placeholder="Street"></input>
            </div>
            <div>
              <h5 className='subHeadings'>APT./SPACE/STE.#</h5>
              <input className="aptInput" placeholder="APT./SPACE/STE.#"></input>
            </div>
          </div>
          <div className='cityStateZipLine'>
            <div>
              <h5 className='subHeadings'>City</h5>
              <input className="cityInput" placeholder="City"></input>
            </div>
            <div className='stateWrapper'>
            <h5 className='subHeadings'>State</h5>
              <button onClick={() => setIsSecondMenuOpen(!isSecondMenuOpen)} className="secondStateDropDown">
              { selectedSecondState || 'State'}
              <ChevronDownIcon className={`secondStateIcon ${isSecondMenuOpen ? 'rotate' : ''}`} />
            </button>
            {isSecondMenuOpen && (
              <ul ref={secondMenuRef} className="stateMenu">
                {states.map((state, index) => (
                  <li
                    className='stateLists'
                    key={index}
                    onClick={() => handleSecondStateChange(state.abbreviation)}
                  >
                    {state.name}
                  </li>                
                ))}
              </ul>
            )}
          </div>
            <div>
              <h5 className='subHeadings'>Zip Code</h5>
              <input className="zipInput" placeholder="Zip Code"></input>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
