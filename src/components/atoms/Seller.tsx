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
  validationErrors: Array<{ fieldPath: string; message: string }>;
  showValidationErrors: boolean;
  clearFormTriggered: number | null;
}

interface SellerSectionProps {
  formData?: FormData;   
  onChange?: (sellerInfo: SellerInfo) => void;
  transferIndex?: number;
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


export const SELLER_INFO_STORAGE_KEY = 'formmatic_seller_info';


export const getSellerInfoStorageKey = (transferIndex?: number) => {
  if (transferIndex === undefined) {
    return SELLER_INFO_STORAGE_KEY;
  }
  return `${SELLER_INFO_STORAGE_KEY}_transfer_${transferIndex}`;
};


export const clearSellerInfoStorage = (transferIndex?: number) => {
  if (typeof window !== 'undefined') {
    const storageKey = getSellerInfoStorageKey(transferIndex);
    localStorage.removeItem(storageKey);
    console.log(`Seller info data cleared from localStorage for transfer ${transferIndex !== undefined ? transferIndex : 'default'}`);
  }
};


export const clearAllSellerInfoStorage = () => {
  if (typeof window !== 'undefined') {

    localStorage.removeItem(SELLER_INFO_STORAGE_KEY);
    

    for (let i = 0; i < 5; i++) {
      localStorage.removeItem(`${SELLER_INFO_STORAGE_KEY}_transfer_${i}`);
    }
    console.log('All Seller info data cleared from localStorage');
  }
};

const SellerSection: React.FC<SellerSectionProps> = ({ 
  formData: propFormData, 
  onChange,
  transferIndex 
}) => {
  const { 
    formData: contextFormData, 
    updateField,
    validationErrors,
    showValidationErrors,
    clearFormTriggered 
  } = useFormContext() as FormContext;
  
  const { activeScenarios } = useScenarioContext();
  const [openDropdown, setOpenDropdown] = useState<{ 
    type: 'count' | 'state', 
    index?: number 
  } | null>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const stateDropdownRefs = useRef<(HTMLUListElement | null)[]>([]);
  
  const [syncedSaleDate, setSyncedSaleDate] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  const formData = {
    ...contextFormData,
    ...propFormData
  };


  const storageKey = getSellerInfoStorageKey(transferIndex);


  const shouldShowValidationError = (index: number, field: string) => {
    if (!showValidationErrors) return false;
    

    const fieldPath = transferIndex !== undefined
      ? `transfer${transferIndex}_sellerInfo.sellers[${index}].${field}`
      : `sellerInfo.sellers[${index}].${field}`;
      
    return validationErrors.some(error => error.fieldPath === fieldPath);
  };
  
  const getValidationErrorMessage = (index: number, field: string): string => {

    const fieldPath = transferIndex !== undefined
      ? `transfer${transferIndex}_sellerInfo.sellers[${index}].${field}`
      : `sellerInfo.sellers[${index}].${field}`;
      
    const error = validationErrors.find(e => e.fieldPath === fieldPath);
    return error ? error.message : '';
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
    console.log("Transfer index:", transferIndex);
  }, [forceSingleOwner, hideDateOfSale, hideDateOfBirth, limitOwnerCount, activeScenarios, transferIndex]);


  useEffect(() => {
    if (clearFormTriggered) {
      console.log(`Clear form triggered in SellerSection component for transfer ${transferIndex !== undefined ? transferIndex : 'default'}`);
      clearSellerInfoStorage(transferIndex);
      

      const fieldName = transferIndex !== undefined 
        ? `transfer${transferIndex}_sellerInfo` 
        : 'sellerInfo';
        
      updateField(fieldName, initialSellerInfo);
      
      setIsInitialized(false);
    }
  }, [clearFormTriggered, transferIndex, updateField]);

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
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const savedData = localStorage.getItem(storageKey);
        
        if (savedData) {
          console.log(`Loading seller info data from localStorage for transfer ${transferIndex !== undefined ? transferIndex : 'default'}`);
          const parsedData = JSON.parse(savedData);
          
          const mergedData = {
            ...initialSellerInfo,
            ...parsedData
          };
          

          const fieldName = transferIndex !== undefined 
            ? `transfer${transferIndex}_sellerInfo` 
            : 'sellerInfo';
            
          updateField(fieldName, mergedData);
          
          if (onChange) {
            onChange(mergedData);
          }
        } else if (propFormData?.sellerInfo) {

          const fieldName = transferIndex !== undefined 
            ? `transfer${transferIndex}_sellerInfo` 
            : 'sellerInfo';
            
          updateField(fieldName, propFormData.sellerInfo);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error(`Error loading saved seller info data for transfer ${transferIndex !== undefined ? transferIndex : 'default'}:`, error);
        setIsInitialized(true);
      }
    }
  }, [propFormData, storageKey, transferIndex, onChange, updateField, isInitialized]);

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
        

        const fieldName = transferIndex !== undefined 
          ? `transfer${transferIndex}_sellerInfo` 
          : 'sellerInfo';
          
        updateField(fieldName, newSellerInfo);
        
        if (onChange) {
          onChange(newSellerInfo);
        }
        

        if (typeof window !== 'undefined' && isInitialized) {
          localStorage.setItem(storageKey, JSON.stringify(newSellerInfo));
        }
      } else {
        const updatedInfo = {
          ...formData.sellerInfo,
          sellerCount: newSellerCount
        };
        

        const fieldName = transferIndex !== undefined 
          ? `transfer${transferIndex}_sellerInfo` 
          : 'sellerInfo';
          
        updateField(fieldName, updatedInfo);
        
        if (onChange) {
          onChange(updatedInfo);
        }
        

        if (typeof window !== 'undefined' && isInitialized) {
          localStorage.setItem(storageKey, JSON.stringify(updatedInfo));
        }
      }
    }
  }, [forceSingleOwner, formData.sellerInfo?.sellerCount, isInitialized]);

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
        

        const fieldName = transferIndex !== undefined 
          ? `transfer${transferIndex}_sellerInfo` 
          : 'sellerInfo';
          
        updateField(fieldName, newSellerInfo);
        
        if (onChange) {
          onChange(newSellerInfo);
        }
        

        if (typeof window !== 'undefined' && isInitialized) {
          localStorage.setItem(storageKey, JSON.stringify(newSellerInfo));
        }
      } else {
        const updatedInfo = {
          ...formData.sellerInfo,
          sellerCount: newSellerCount
        };
        

        const fieldName = transferIndex !== undefined 
          ? `transfer${transferIndex}_sellerInfo` 
          : 'sellerInfo';
          
        updateField(fieldName, updatedInfo);
        
        if (onChange) {
          onChange(updatedInfo);
        }
        

        if (typeof window !== 'undefined' && isInitialized) {
          localStorage.setItem(storageKey, JSON.stringify(updatedInfo));
        }
      }
    }
  }, [limitOwnerCount, formData.sellerInfo?.sellerCount, isInitialized]);

  useEffect(() => {
    if (!formData.sellerInfo && isInitialized) {
      const newSellerInfo = initialSellerInfo;
      

      const fieldName = transferIndex !== undefined 
        ? `transfer${transferIndex}_sellerInfo` 
        : 'sellerInfo';
        
      updateField(fieldName, newSellerInfo);       
      
      if (onChange) {
        onChange(newSellerInfo);
      }
      

      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(newSellerInfo));
      }
    }
  }, [formData.sellerInfo, isInitialized]);

  useEffect(() => {
    if (formData.sellerInfo?.sellerCount && (!formData.sellerInfo.sellers || formData.sellerInfo.sellers.length === 0)) {
      const count = Number(formData.sellerInfo.sellerCount);
      const newSellers = Array(count).fill(null).map(() => ({ ...initialSeller }));
      const newSellerInfo = {
        ...formData.sellerInfo,
        sellers: newSellers
      };
      

      const fieldName = transferIndex !== undefined 
        ? `transfer${transferIndex}_sellerInfo` 
        : 'sellerInfo';
        
      updateField(fieldName, newSellerInfo);       
      
      if (onChange) {
        onChange(newSellerInfo);
      }
      

      if (typeof window !== 'undefined' && isInitialized) {
        localStorage.setItem(storageKey, JSON.stringify(newSellerInfo));
      }
    }
  }, [formData.sellerInfo?.sellerCount, isInitialized]);

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
        

        const fieldName = transferIndex !== undefined 
          ? `transfer${transferIndex}_sellerInfo` 
          : 'sellerInfo';
          
        updateField(fieldName, newSellerInfo);         
        
        if (onChange) {
          onChange(newSellerInfo);
        }
        

        if (typeof window !== 'undefined' && isInitialized) {
          localStorage.setItem(storageKey, JSON.stringify(newSellerInfo));
        }
      }
    }
    
    if (formData.sellerInfo?.sellers?.[0]?.saleDate) {
      setSyncedSaleDate(formData.sellerInfo.sellers[0].saleDate);
    }
  }, [formData.sellerInfo?.sellerCount, formData.sellerInfo?.sellers, isInitialized]);

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
        

        const fieldName = transferIndex !== undefined 
          ? `transfer${transferIndex}_sellerInfo` 
          : 'sellerInfo';
          
        updateField(fieldName, newSellerInfo);
        
        if (onChange) {
          onChange(newSellerInfo);
        }
        

        if (typeof window !== 'undefined' && isInitialized) {
          localStorage.setItem(storageKey, JSON.stringify(newSellerInfo));
        }
      }
    }
  }, [syncedSaleDate, isInitialized]);   

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
    

    const fieldName = transferIndex !== undefined 
      ? `transfer${transferIndex}_sellerInfo` 
      : 'sellerInfo';
      
    updateField(fieldName, newSellerInfo);     
    
    if (onChange) {
      onChange(newSellerInfo);
    }
    

    if (typeof window !== 'undefined' && isInitialized) {
      localStorage.setItem(storageKey, JSON.stringify(newSellerInfo));
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
        

        const fieldName = transferIndex !== undefined 
          ? `transfer${transferIndex}_sellerInfo` 
          : 'sellerInfo';
          
        updateField(fieldName, newSellerInfo);     
        
        if (onChange) {
          onChange(newSellerInfo);
        }
        

        if (typeof window !== 'undefined' && isInitialized) {
          localStorage.setItem(storageKey, JSON.stringify(newSellerInfo));
        }
      }
    }
  }, [hideDateOfSale, formData.sellerInfo?.sellers, isInitialized]);

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
    

    const fieldName = transferIndex !== undefined 
      ? `transfer${transferIndex}_sellerInfo` 
      : 'sellerInfo';
      
    updateField(fieldName, newSellerInfo);     
    
    if (onChange) {
      onChange(newSellerInfo);
    }
    

    if (typeof window !== 'undefined' && isInitialized) {
      localStorage.setItem(storageKey, JSON.stringify(newSellerInfo));
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
              className={`sellerInput ${shouldShowValidationError(index, 'firstName') ? 'validation-error' : ''}`}
              type="text"
              placeholder="First Name"
              value={formData.sellerInfo?.sellers?.[index]?.firstName || ''}
              onChange={(e) => {                 
                const value = e.target.value;
                const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
                handleSellerChange(index, 'firstName', capitalizedValue);
              }}
            />
            {shouldShowValidationError(index, 'firstName') && (
              <p className="validation-message">{getValidationErrorMessage(index, 'firstName')}</p>
            )}
          </div>
          <div className="sellerFormItem">
            <label className="sellerLabel">Middle Name</label>
            <input
              className={`sellerInput ${shouldShowValidationError(index, 'middleName') ? 'validation-error' : ''}`}
              type="text"
              placeholder="Middle Name"
              value={formData.sellerInfo?.sellers?.[index]?.middleName || ''}
              onChange={(e) => {                 
                const value = e.target.value;
                const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
                handleSellerChange(index, 'middleName', capitalizedValue);
              }}
            />
            {shouldShowValidationError(index, 'middleName') && (
              <p className="validation-message">{getValidationErrorMessage(index, 'middleName')}</p>
            )}
          </div>
          <div className="sellerFormItem">
            <label className="sellerLabel">Last Name</label>
            <input
              className={`sellerInput ${shouldShowValidationError(index, 'lastName') ? 'validation-error' : ''}`}
              type="text"
              placeholder="Last Name"
              value={formData.sellerInfo?.sellers?.[index]?.lastName || ''}
              onChange={(e) => {
                const value = e.target.value;
                const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
                handleSellerChange(index, 'lastName',capitalizedValue);
              }}
            />
            {shouldShowValidationError(index, 'lastName') && (
              <p className="validation-message">{getValidationErrorMessage(index, 'lastName')}</p>
            )}
          </div>
        </div>

        <div className="driverState">
          <div className="driverLicenseField">
            <label className="formLabel">Driver License Number</label>
            <input
              className={`formInput ${shouldShowValidationError(index, 'licenseNumber') ? 'validation-error' : ''}`}
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
            {shouldShowValidationError(index, 'licenseNumber') ? (
              <p className="validation-message">{getValidationErrorMessage(index, 'licenseNumber')}</p>
            ) : (
              formData.sellerInfo?.sellers?.[index]?.licenseNumber && 
              formData.sellerInfo?.sellers?.[index]?.licenseNumber.length < 8 && (
                <p className="validation-message">License number must be 8 digits</p>
              )
            )}
          </div>

          <div className="regStateWrapper">
            <label className="registeredOwnerLabel">State</label>
            <button
              onClick={() => setOpenDropdown({ type: 'state', index })}
              className={`regStateDropDown state-dropdown-button-${index} ${
                shouldShowValidationError(index, 'state') ? 'validation-error' : ''
              }`}
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
            {shouldShowValidationError(index, 'state') && (
              <p className="validation-message">{getValidationErrorMessage(index, 'state')}</p>
            )}
          </div>
          
          {/* Only show Date of Birth field if not hidden */}
          {index === 0 && !hideDateOfBirth && (
            <div className="sellerFormItem">
              <label className="sellerLabel">Date of Birth</label>
              <input
                className={`sellerInput ${shouldShowValidationError(index, 'dob') ? 'validation-error' : ''}`}
                type="text"
                placeholder="MM/DD/YYYY"
                value={formData.sellerInfo?.sellers?.[index]?.dob || ''}
                onChange={(e) => handleSellerChange(index, 'dob', e.target.value)}
              />
              {shouldShowValidationError(index, 'dob') ? (
                <p className="validation-message">{getValidationErrorMessage(index, 'dob')}</p>
              ) : (
                formData.sellerInfo?.sellers?.[index]?.dob && 
                !validateDateFormat(formData.sellerInfo?.sellers?.[index]?.dob || '') && (
                  <p className="validation-message">Please use MM/DD/YYYY format</p>
                )
              )}
            </div>
          )}
        </div>

        <div className="sellerThirdGroup">
          <div className="sellerThirdItem">
            <label className="sellerLabel">Phone Number</label>
            <input
              className={`sellerNumberInput ${shouldShowValidationError(index, 'phone') ? 'validation-error' : ''}`}
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
            {shouldShowValidationError(index, 'phone') ? (
              <p className="validation-message">{getValidationErrorMessage(index, 'phone')}</p>
            ) : (
              formData.sellerInfo?.sellers?.[index]?.phone && 
              formData.sellerInfo?.sellers?.[index]?.phone.length < 10 && (
                <p className="validation-message">Phone number must be 10 digits</p>
              )
            )}
          </div>
          
          {/* Only show the Date of Sale field if not hidden */}
          {index === 0 && !hideDateOfSale && (
            <div className="sellerThirdItem">
              <label className="sellerLabel">Date of Sale</label>
              <input
                className={`sellerDateInput ${shouldShowValidationError(index, 'saleDate') ? 'validation-error' : ''}`}
                type="text"
                placeholder="MM/DD/YYYY"
                value={formData.sellerInfo?.sellers?.[index]?.saleDate || ''}
                onChange={(e) => handleSellerChange(index, 'saleDate', e.target.value)}
              />
              {shouldShowValidationError(index, 'saleDate') ? (
                <p className="validation-message">{getValidationErrorMessage(index, 'saleDate')}</p>
              ) : (
                formData.sellerInfo?.sellers?.[index]?.saleDate && 
                !validateDateFormat(formData.sellerInfo?.sellers?.[index]?.saleDate || '') && (
                  <p className="validation-message">Please use MM/DD/YYYY format</p>
                )
              )}
            </div>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="seller-section">
      <style>{`
        .validation-error {
          border-color: #dc3545 !important;
          background-color: #fff8f8 !important;
        }

        .validation-message {
          color: #dc3545;
          font-size: 12px;
          margin-top: 4px;
          margin-bottom: 0;
        }
        
        .regStateDropDown.validation-error {
          border-color: #dc3545 !important;
          background-color: #fff8f8 !important;
        }
      `}</style>
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