'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useScenarioContext } from '../../context/ScenarioContext';
import './Seller.css';

interface Seller {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  licenseNumber?: string;
  state?: string;
  phone?: string;
  saleDate?: string;
  relationshipWithGifter?: string;
  giftValue?: string;
  dob?: string; 
}

interface SellerInfo {
  sellerCount?: string;
  sellers?: Seller[];
}

interface FormData {
  sellerInfo?: SellerInfo;
  hideDateOfSale?: boolean;
  hideDateOfBirth?: boolean;
  limitOwnerCount?: boolean;
  forceSingleOwner?: boolean;
  [key: string]: any;
}

interface FormContext {
  formData: FormData;
  updateField: (field: string, value: any) => void;
}

interface SellerSectionProps {
  formData?: FormData;   
  onChange?: (sellerInfo: SellerInfo) => void;
}

const initialSeller: Seller = {
  firstName: '',
  middleName: '',
  lastName: '',
  licenseNumber: '',
  state: '',
  phone: '',
  saleDate: '',
  relationshipWithGifter: '',
  giftValue: '',
  dob: '' 
};

const initialSellerInfo: SellerInfo = {
  sellerCount: '1',
  sellers: [{ ...initialSeller }]
};

const SellerSection: React.FC<SellerSectionProps> = ({ formData: propFormData, onChange }) => {
  const { formData: contextFormData, updateField } = useFormContext() as FormContext;
  const { activeScenarios } = useScenarioContext();
  const [openDropdown, setOpenDropdown] = useState<{ 
    type: 'count' | 'state', 
    index?: number 
  } | null>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const stateDropdownRefs = useRef<(HTMLUListElement | null)[]>([]);
  
  const [syncedSaleDate, setSyncedSaleDate] = useState<string>('');

  const formData = {
    ...contextFormData,
    ...propFormData
  };


  const shouldForceSingleOwner = () => {

    if (formData.forceSingleOwner) {
      return true;
    }
    

    return !!(
      activeScenarios && (
        activeScenarios["Salvage"] ||
        activeScenarios["Name Change"]
      )
    );
  };

  const forceSingleOwner = shouldForceSingleOwner();
  const hideDateOfSale = !!formData.hideDateOfSale || shouldHideDateOfSale();
  const hideDateOfBirth = !!formData.hideDateOfBirth || shouldHideDateOfBirth();
  const limitOwnerCount = !!formData.limitOwnerCount || shouldLimitOwnerCount();


  useEffect(() => {
    console.log("Force Single Owner in Seller:", forceSingleOwner);
    console.log("Should hide date of sale:", hideDateOfSale);
    console.log("Should hide date of birth:", hideDateOfBirth);
    console.log("Should limit owner count:", limitOwnerCount);
    console.log("Active scenarios:", activeScenarios);
  }, [forceSingleOwner, hideDateOfSale, hideDateOfBirth, limitOwnerCount, activeScenarios]);

  function shouldHideDateOfSale() {
    return !!(
      activeScenarios && (
        activeScenarios["Duplicate Registration"] ||
        activeScenarios["Duplicate Plates & Stickers"] ||
        activeScenarios["Add Lienholder"] ||
        activeScenarios["Remove Lienholder"] ||
        activeScenarios["Commercial Vehicle"] ||
        activeScenarios["Filing for Planned Non-Operation (PNO)"] ||
        activeScenarios["Restoring PNO Vehicle to Operational"] ||
        activeScenarios["Disabled Person Placards/Plates"] ||
        activeScenarios["Duplicate Stickers"] ||
        activeScenarios["Name Change"]
      )
    );
  }

  function shouldHideDateOfBirth() {
    return !!(
      activeScenarios && (
        activeScenarios["Duplicate Registration"] ||
        activeScenarios["Duplicate Plates & Stickers"] ||
        activeScenarios["Add Lienholder"] ||
        activeScenarios["Remove Lienholder"] ||
        activeScenarios["Filing for Planned Non-Operation (PNO)"] ||
        activeScenarios["Duplicate Stickers"]
      )
    );
  }

  function shouldLimitOwnerCount() {
    return !!(
      activeScenarios && (
        activeScenarios["Duplicate Title"] ||
        activeScenarios["Duplicate Registration"] ||
        activeScenarios["Duplicate Plates & Stickers"] ||
        activeScenarios["Remove Lienholder"] ||
        activeScenarios["Filing for Planned Non-Operation (PNO)"] ||
        activeScenarios["Disabled Person Placards/Plates"] ||
        activeScenarios["Duplicate Stickers"]
      )
    );
  }


  const getSellerCountOptions = () => {
    if (forceSingleOwner) {
      return ['1'];
    } else if (limitOwnerCount) {
      return ['1', '2'];
    } else if (activeScenarios && activeScenarios["Duplicate Title"] === true) {
      return ['1', '2'];
    }
    return ['1', '2', '3'];
  };


  useEffect(() => {
    if (forceSingleOwner && formData.sellerInfo?.sellerCount !== '1') {
      const newSellerCount = '1';
      

      if (formData.sellerInfo?.sellers && formData.sellerInfo.sellers.length > 1) {
        const newSellers = [formData.sellerInfo.sellers[0]];
        
        const newSellerInfo = {
          ...formData.sellerInfo,
          sellerCount: newSellerCount,
          sellers: newSellers
        };
        
        updateField('sellerInfo', newSellerInfo);
        
        if (onChange) {
          onChange(newSellerInfo);
        }
      } else {

        updateField('sellerInfo', {
          ...formData.sellerInfo,
          sellerCount: newSellerCount
        });
        
        if (onChange) {
          onChange({
            ...formData.sellerInfo,
            sellerCount: newSellerCount
          });
        }
      }
    }
  }, [forceSingleOwner, formData.sellerInfo?.sellerCount]);


  useEffect(() => {
    if (limitOwnerCount && formData.sellerInfo?.sellerCount === '3') {
      const newSellerCount = '2';
      
      if (formData.sellerInfo?.sellers && formData.sellerInfo.sellers.length > 2) {
        const newSellers = formData.sellerInfo.sellers.slice(0, 2);
        
        const newSellerInfo = {
          ...formData.sellerInfo,
          sellerCount: newSellerCount,
          sellers: newSellers
        };
        
        updateField('sellerInfo', newSellerInfo);
        
        if (onChange) {
          onChange(newSellerInfo);
        }
      } else {
        updateField('sellerInfo', {
          ...formData.sellerInfo,
          sellerCount: newSellerCount
        });
        
        if (onChange) {
          onChange({
            ...formData.sellerInfo,
            sellerCount: newSellerCount
          });
        }
      }
    }
  }, [limitOwnerCount, formData.sellerInfo?.sellerCount]);

  useEffect(() => {
    if (!formData.sellerInfo) {
      const newSellerInfo = initialSellerInfo;
      updateField('sellerInfo', newSellerInfo);       
      if (onChange) {
        onChange(newSellerInfo);
      }
    }
  }, []);

  useEffect(() => {
    if (formData.sellerInfo?.sellerCount && (!formData.sellerInfo.sellers || formData.sellerInfo.sellers.length === 0)) {
      const count = Number(formData.sellerInfo.sellerCount);
      const newSellers = Array(count).fill(null).map(() => ({ ...initialSeller }));
      const newSellerInfo = {
        ...formData.sellerInfo,
        sellers: newSellers
      };
      
      updateField('sellerInfo', newSellerInfo);       
      if (onChange) {
        onChange(newSellerInfo);
      }
    }
  }, [formData.sellerInfo?.sellerCount]);

  useEffect(() => {
    if (formData.sellerInfo?.sellers) {
      const currentCount = formData.sellerInfo.sellers.length;
      const targetCount = Number(formData.sellerInfo.sellerCount || 1);
      
      if (currentCount !== targetCount) {
        const newSellers = Array(targetCount)
          .fill(null)
          .map((_, i) => formData.sellerInfo?.sellers?.[i] || { ...initialSeller });
        
        const newSellerInfo = {
          ...formData.sellerInfo,
          sellers: newSellers
        };
        
        updateField('sellerInfo', newSellerInfo);         
        if (onChange) {
          onChange(newSellerInfo);
        }
      }
    }
    
    if (formData.sellerInfo?.sellers?.[0]?.saleDate) {
      setSyncedSaleDate(formData.sellerInfo.sellers[0].saleDate);
    }
  }, [formData.sellerInfo?.sellerCount, formData.sellerInfo?.sellers]);

  useEffect(() => {
    if (syncedSaleDate && formData.sellerInfo?.sellers && formData.sellerInfo.sellers.length > 1) {
      const newSellers = [...formData.sellerInfo.sellers];
      let hasChanges = false;
      
      for (let i = 1; i < newSellers.length; i++) {
        if (newSellers[i]?.saleDate !== syncedSaleDate) {
          newSellers[i] = { ...newSellers[i], saleDate: syncedSaleDate };
          hasChanges = true;
        }
      }
      
      if (hasChanges) {
        const newSellerInfo = {
          ...formData.sellerInfo,
          sellers: newSellers
        };
        
        updateField('sellerInfo', newSellerInfo);
        
        if (onChange) {
          onChange(newSellerInfo);
        }
      }
    }
  }, [syncedSaleDate]);   

  useEffect(() => {
    stateDropdownRefs.current = Array(Number(formData.sellerInfo?.sellerCount || 1))
      .fill(null)
      .map((_, i) => stateDropdownRefs.current[i] || null);
  }, [formData.sellerInfo?.sellerCount]);

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

  const handleSellerChange = (index: number, field: keyof Seller, value: string) => {
    const sellers = [...(formData.sellerInfo?.sellers || [])];
    sellers[index] = { ...sellers[index], [field]: value };
    
    if (index === 0 && field === 'saleDate') {
      setSyncedSaleDate(value);
    }
    
    const newSellerInfo = { 
      ...(formData.sellerInfo || {}), 
      sellers 
    };
    
    updateField('sellerInfo', newSellerInfo);     
    if (onChange) {
      onChange(newSellerInfo);
    }
  };

  useEffect(() => {
    if (hideDateOfSale && (!formData.sellerInfo?.sellers?.[0]?.saleDate || formData.sellerInfo.sellers[0].saleDate === '')) {
      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}/${currentDate.getFullYear()}`;
      
      console.log('Setting current date for hidden sale date field:', formattedDate);
      
      const sellers = [...(formData.sellerInfo?.sellers || [])];
      if (sellers.length > 0) {
        sellers[0] = { ...sellers[0], saleDate: formattedDate };
        
        for (let i = 1; i < sellers.length; i++) {
          sellers[i] = { ...sellers[i], saleDate: formattedDate };
        }
        
        const newSellerInfo = { 
          ...(formData.sellerInfo || {}), 
          sellers 
        };
        
        updateField('sellerInfo', newSellerInfo);     
        if (onChange) {
          onChange(newSellerInfo);
        }
      }
    }
  }, [hideDateOfSale, formData.sellerInfo?.sellers]);

  const handleStateSelect = (index: number, stateAbbreviation: string) => {     
    handleSellerChange(index, 'state', stateAbbreviation);     
    setOpenDropdown(null);
  };

  const handleCountChange = (count: string) => {

    if (forceSingleOwner) {
      count = '1';
    } else if (limitOwnerCount && count === '3') {
      count = '2';
    }
    
    const currentSellers = formData.sellerInfo?.sellers || [{ ...initialSeller }];
    const currentSaleDate = currentSellers[0]?.saleDate || '';
    
    const newSellers = Array(Number(count))
      .fill(null)
      .map((_, i) => {
        if (i === 0) {
          return currentSellers[0] || { ...initialSeller };
        } else {
          return currentSellers[i] || { 
            ...initialSeller, 
            saleDate: currentSaleDate 
          };
        }
      });
    
    const newSellerInfo = {
      ...(formData.sellerInfo || {}),
      sellerCount: count,
      sellers: newSellers
    };
    
    updateField('sellerInfo', newSellerInfo);     
    if (onChange) {
      onChange(newSellerInfo);
    }
    
    setOpenDropdown(null);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Element;     
    if (openDropdown?.type === 'count') {
      if (dropdownRef.current && !dropdownRef.current.contains(target) && !target.closest('.howManyDropDown')) {
        setOpenDropdown(null);
      }
    }     
    if (openDropdown?.type === 'state' && typeof openDropdown.index === 'number') {
      const stateRef = stateDropdownRefs.current[openDropdown.index];
      if (stateRef && !stateRef.contains(target) && !target.closest(`.state-dropdown-button-${openDropdown.index}`)) {
        setOpenDropdown(null);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const validateDateFormat = (dateString: string): boolean => {
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    return dateRegex.test(dateString);
  };
  
  const renderSellerForms = () => {
    const count = Number(formData.sellerInfo?.sellerCount || 1);
    return Array.from({ length: count }).map((_, index) => (
      <div key={index} className="seller-form-section">
        <h4 className="seller-number">Registered Owner {index + 1}</h4>
        
        <div className="sellerFirstGroup">
          <div className="sellerFormItem">
            <label className="sellerLabel">First Name</label>
            <input
              className="sellerInput"
              type="text"
              placeholder="First Name"
              value={formData.sellerInfo?.sellers?.[index]?.firstName || ''}
              onChange={(e) => {                 
                const value = e.target.value;
                const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
                handleSellerChange(index, 'firstName', capitalizedValue);
              }}
            />
          </div>
          <div className="sellerFormItem">
            <label className="sellerLabel">Middle Name</label>
            <input
              className="sellerInput"
              type="text"
              placeholder="Middle Name"
              value={formData.sellerInfo?.sellers?.[index]?.middleName || ''}
              onChange={(e) => {                 
                const value = e.target.value;
                const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
                handleSellerChange(index, 'middleName', capitalizedValue);
              }}
            />
          </div>
          <div className="sellerFormItem">
            <label className="sellerLabel">Last Name</label>
            <input
              className="sellerInput"
              type="text"
              placeholder="Last Name"
              value={formData.sellerInfo?.sellers?.[index]?.lastName || ''}
              onChange={(e) => {
                const value = e.target.value;
                const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
                handleSellerChange(index, 'lastName',capitalizedValue);
              }}
            />
          </div>
        </div>

        <div className="driverState">
          <div className="driverLicenseField">
            <label className="formLabel">Driver License Number</label>
            <input
              className="formInput"
              type="text"
              placeholder="Driver License Number"
              value={formData.sellerInfo?.sellers?.[index]?.licenseNumber || ''}
              onChange={(e) =>{ 
                const value = e.target.value;
                if (/^[a-zA-Z0-9]*$/.test(value)) {

                  handleSellerChange(index, 'licenseNumber', value.toUpperCase());
                }
              }}
              maxLength={8}
              inputMode="numeric"
              pattern="\d{8}"
            />
            {formData.sellerInfo?.sellers?.[index]?.licenseNumber && formData.sellerInfo?.sellers?.[index]?.licenseNumber.length < 8 && (
              <p className="validation-message" style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>
                License number must be 8 digits
              </p>
            )}
          </div>

          <div className="regStateWrapper">
            <label className="registeredOwnerLabel">State</label>
            <button
              onClick={() => setOpenDropdown({ type: 'state', index })}
              className={`regStateDropDown state-dropdown-button-${index}`}
            >
              {formData.sellerInfo?.sellers?.[index]?.state || 'State'}
              <ChevronDownIcon
                className={`regIcon ${openDropdown?.type === 'state' && openDropdown?.index === index ? 'rotate' : ''}`}
              />
            </button>
            {openDropdown?.type === 'state' && openDropdown?.index === index && (
              <ul 
                ref={(el) => {
                  stateDropdownRefs.current[index] = el;
                }}
                className="regStateMenu"
              >
                {states.map((state, i) => (
                  <li
                    className="regStateLists"
                    key={i}
                    onClick={() => handleStateSelect(index, state.abbreviation)}
                  >
                    {state.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Only show Date of Birth field if not hidden */}
          {index === 0 && !hideDateOfBirth && (
            <div className="sellerFormItem">
              <label className="sellerLabel">Date of Birth</label>
              <input
                className="sellerInput"
                type="text"
                placeholder="MM/DD/YYYY"
                value={formData.sellerInfo?.sellers?.[index]?.dob || ''}
                onChange={(e) => handleSellerChange(index, 'dob', e.target.value)}
              />
              {formData.sellerInfo?.sellers?.[index]?.dob && 
                !validateDateFormat(formData.sellerInfo?.sellers?.[index]?.dob || '') && (
                <p className="validation-message" style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>
                  Please use MM/DD/YYYY format
                </p>
              )}
            </div>
          )}
        </div>

        <div className="sellerThirdGroup">
          <div className="sellerThirdItem">
            <label className="sellerLabel">Phone Number</label>
            <input
              className="sellerNumberInput"
              type="text"
              placeholder="Phone Number"
              value={formData.sellerInfo?.sellers?.[index]?.phone || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-9]*$/.test(value) && value.length <= 10) {
                  handleSellerChange(index, 'phone', value);
                }
              }}
              maxLength={10}
              inputMode="numeric"
            />
          </div>
          
          {/* Only show the Date of Sale field if not hidden */}
          {index === 0 && !hideDateOfSale && (
            <div className="sellerThirdItem">
              <label className="sellerLabel">Date of Sale</label>
              <input
                className="sellerDateInput"
                type="text"
                placeholder="MM/DD/YYYY"
                value={formData.sellerInfo?.sellers?.[index]?.saleDate || ''}
                onChange={(e) => handleSellerChange(index, 'saleDate', e.target.value)}
              />
              {formData.sellerInfo?.sellers?.[index]?.saleDate && 
                !validateDateFormat(formData.sellerInfo?.sellers?.[index]?.saleDate || '') && (
                <p className="validation-message" style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>
                  Please use MM/DD/YYYY format
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="seller-section">
      <div className="sellerHeader">
        <h3 className="sellerHeading">Registered Owner(s)</h3>
        {/* Hide dropdown completely if forcing single owner */}
        {!forceSingleOwner && (
          <div className="howManyWrapper">
            <button
              onClick={() => setOpenDropdown(openDropdown?.type === 'count' ? null : { type: 'count' })}
              className="howManyDropDown"
            >
              {formData.sellerInfo?.sellerCount || 'How Many'}
              <ChevronDownIcon
                className={`howManyIcon ${openDropdown?.type === 'count' ? 'rotate' : ''}`}
              />
            </button>
            {openDropdown?.type === 'count' && (
              <ul ref={dropdownRef} className="howManyMenu">
                {getSellerCountOptions().map((option, index) => (
                  <li
                    className="howManyLists"
                    key={index}
                    onClick={() => handleCountChange(option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {renderSellerForms()}
    </div>
  );
};

export default SellerSection;