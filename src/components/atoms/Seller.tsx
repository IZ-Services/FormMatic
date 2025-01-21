'use client';
import React, { useEffect, useRef, useState } from 'react';
import './Seller.css';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const SellerSection = () => {
  const [isSellerMenuOpen, setIsSellerMenuOpen] = useState(false);
  const [isHowManyMenuOpen, setIsHowManyMenuOpen] = useState(false);
  const [sellerState, setSellerState] = useState('');
  const [howMany, setHowMany] = useState('');
  const sellerRef = useRef<HTMLUListElement | null>(null);
  const howManyRef = useRef<HTMLUListElement | null>(null);
  const [selectedState, setSelectedState] = useState('');
  
      const [isRegMenuOpen, setIsRegMenuOpen] = useState(false);
      const regRef = useRef<HTMLUListElement | null>(null);
       const [regState, setRegState] = useState('');
        
          const handleRegStateChange = (state: string) => {
            setIsRegMenuOpen(false);
            setRegState(state);
          };
        
  const handleSellerStateChange = (state: string) => {
    setIsSellerMenuOpen(false);
    setSellerState(state);
  };

  const handleHowManyChange = (value: string) => {
    setIsHowManyMenuOpen(false);
    setHowMany(value);
  };

  const handleClickOutsideMenus = (e: MouseEvent) => {
    const target = e.target as Element;
    if (
      sellerRef.current &&
      !sellerRef.current.contains(target) &&
      !target.closest('.sellerStateDropDown')
    ) {
      setIsSellerMenuOpen(false);
    }
    if (
      howManyRef.current &&
      !howManyRef.current.contains(target) &&
      !target.closest('.howManyDropDown')
    ) {
      setIsHowManyMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideMenus);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMenus);
    };
  }, []);

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

  const howManyOptions = ['1', '2', '3'];

  return (
    <div className="seller-section">
      <div className="sellerHeader">
        <h3 className="sellerHeading">Seller(s)</h3>
        <div className="howManyWrapper">
          <button
            onClick={() => setIsHowManyMenuOpen(!isHowManyMenuOpen)}
            className="howManyDropDown"
          >
            {howMany || 'How Many'}
            <ChevronDownIcon
              className={`howManyIcon ${isHowManyMenuOpen ? 'rotate' : ''}`}
            />
          </button>
          {isHowManyMenuOpen && (
            <ul ref={howManyRef} className="howManyMenu">
              {howManyOptions.map((option, index) => (
                <li
                  className="howManyLists"
                  key={index}
                  onClick={() => handleHowManyChange(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="sellerFirstGroup">
        <div className="sellerFormItem">
          <label className="sellerLabel">First Name</label>
          <input
            className="sellerInput"
            type="text"
            placeholder="First Name"
          />
        </div>
        <div className="sellerFormItem">
          <label className="sellerLabel">Middle Name</label>
          <input
            className="sellerInput"
            type="text"
            placeholder="Middle Name"
          />
        </div>
        <div className="sellerFormItem">
          <label className="sellerLabel">Last Name</label>
          <input
            className="sellerInput"
            type="text"
            placeholder="Last Name"
          />
        </div>
      </div>

      <div className="driverState">
             <div className="driverLicenseField">
               <label className="formLabel">Driver License Number</label>
               <input className="formInput" type="text" placeholder="Driver License Number" />
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
            </div>

      <div className="sellerThirdGroup">
        <div className="sellerThirdItem">
          <label className="sellerLabel">Phone Number</label>
          <input
            className="sellerNumberInput"
            type="text"
            placeholder="Phone Number"
          />
        </div>
        <div className="sellerThirdItem">
          <label className="sellerLabel">Date of Sale</label>
          <input
            className="sellerDateInput"
            type="text"
            placeholder="MM/DD/YYYY"
          />
        </div>
      </div>
    </div>
  );
};

export default SellerSection;
