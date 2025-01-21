// File: NewLienHolder.jsx
import React, { useState, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import './NewLienHolder.css';

const NewLienHolder = () => {
    const [isRegMenuOpen, setIsRegMenuOpen] = useState(false);
    const regRef = useRef<HTMLUListElement | null>(null);

const [regState, setRegState] = useState('');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [mailingState, setMailingState] = useState('');
      const [mailingAddress, setMailingAddress] = useState(false);
      const mailingRef = useRef<HTMLUListElement | null>(null);
    
    const handleRegStateChange = (state: string) => {
      setIsRegMenuOpen(false);
      setRegState(state);
    };

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
    <div className="newLienHolderWrapper">
      <div className="headingCheckboxWrapper">
        <h3 className="newLienHolderHeading">New Lien Holder</h3>
        <div className="mailingCheckboxWrapper">
          <label className="mailingCheckboxLabel">
            <input
              type="checkbox"
              className="mailingCheckboxInput"
              checked={mailingAddress}
              onChange={() => setMailingAddress(!mailingAddress)}
            />
            If mailing address is different
          </label>
        </div>
      </div>
      <div className="formGroup maxWidthField">
        <label className="formLabel">True Full Name or Bank/Finance Company or Individual</label>
        <input
          className="formInput"
          type="text"
          placeholder="True Full Name or Bank/Finance Company or Individual"
        />
      </div>
      <div className="formGroup maxWidthField">
        <label className="formLabel">ELT Number</label>
        <input className="formInput" type="text" placeholder="ELT Number" />
      </div>
      <div className="streetAptGroup">
        <div className="formGroup streetField">
          <label className="formLabel">Street</label>
          <input className="formInput" type="text" placeholder="Street" />
        </div>
        <div className="formGroup aptField">
          <label className="formLabel">APT./SPACE/STE.#</label>
          <input className="formInput" type="text" placeholder="APT./SPACE/STE.#" />
        </div>
      </div>
      <div className="cityStateZipGroup">
      <div className="cityFieldCustomWidth">
  <label className="formLabel">City</label>
  <input className="cityInputt" type="text" placeholder="City" />
</div>
        <div className="regStateWrapper">
                        <label className="registeredOwnerLabel">State</label>
                        <button
                          onClick={() => setIsRegMenuOpen(!isRegMenuOpen)}
                          className="regStateDropDown"
                        >
                          {regState || 'State'}
                          <ChevronDownIcon
                            className={`regIcon ${isRegMenuOpen ? 'rotate' : ''}`}
                          />
                        </button>
                        {isRegMenuOpen && (
                          <ul ref={regRef} className="regStateMenu">
                            {states.map((state, index) => (
                              <li
                                className="regStateLists"
                                key={index}
                                onClick={() => handleRegStateChange(state.abbreviation)}
                              >
                                {state.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
        <div className="formGroup zipCodeField">
          <label className="formLabel">ZIP Code</label>
          <input className="formInput" type="text" placeholder="Zip Code" />
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
    </div>
  );
};

export default NewLienHolder;
