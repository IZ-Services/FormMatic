'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useScenarioContext } from '../../context/ScenarioContext';
import './NewRegisteredOwner.css';


export const REGISTERED_OWNERS_STORAGE_KEY = 'formmatic_registered_owners';


export const getRegisteredOwnersStorageKey = (transferIndex?: number) => {
  if (transferIndex === undefined) {
    return REGISTERED_OWNERS_STORAGE_KEY;
  }
  return `${REGISTERED_OWNERS_STORAGE_KEY}_transfer_${transferIndex}`;
};


export const clearRegisteredOwnersStorage = (transferIndex?: number) => {
  if (typeof window !== 'undefined') {
    const storageKey = getRegisteredOwnersStorageKey(transferIndex);
    localStorage.removeItem(storageKey);
    console.log(`Registered owners data cleared from localStorage for transfer ${transferIndex !== undefined ? transferIndex : 'default'}`);
  }
};


export const clearAllRegisteredOwnersStorage = () => {
  if (typeof window !== 'undefined') {

    localStorage.removeItem(REGISTERED_OWNERS_STORAGE_KEY);
    

    for (let i = 0; i < 5; i++) {
      localStorage.removeItem(`${REGISTERED_OWNERS_STORAGE_KEY}_transfer_${i}`);
    }
    console.log('All Registered owners data cleared from localStorage');
  }
};

interface OwnerData {
  firstName: string;
  middleName: string;
  lastName: string;
  licenseNumber: string;
  state: string;
  phoneCode: string;
  phoneNumber: string;
  purchaseDate: string;
  purchaseValue: string;
  marketValue: string;
  isGift: boolean;
  isTrade: boolean;
  relationshipWithGifter?: string;
  giftValue?: string;
  relationshipType?: 'AND' | 'OR'; 
}


interface NewRegisteredOwnersProps {
  formData?: { 
    owners?: OwnerData[]; 
    howMany?: string;
    vehicleTransactionDetails?: {
      isGift?: boolean;
      withTitle?: boolean;
      currentLienholder?: boolean;
      isMotorcycle?: boolean;
    };
    _showValidationErrors?: boolean;
    isPNORestoration?: boolean;
    forceSingleOwner?: boolean;
    hideLicenseField?: boolean; 
    hideStateField?: boolean; 
    hidePurchaseValueField?: boolean; 
    [key: string]: any;   
  };
  onChange?: (data: { owners: OwnerData[], howMany: string }) => void;
  transferIndex?: number;
}

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

const NewRegisteredOwners: React.FC<NewRegisteredOwnersProps> = ({ 
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
  } = useFormContext();
  
  const { activeScenarios } = useScenarioContext();
  
  const formData = {
    ...contextFormData,
    ...propFormData
  };

  const [isInitialized, setIsInitialized] = useState(false);
  

  const storageKey = getRegisteredOwnersStorageKey(transferIndex);
  

  const [lastUpdatedData, setLastUpdatedData] = useState<string>('');
  
  const [owners, setOwners] = useState<OwnerData[]>([]);
  const [isHowManyMenuOpen, setIsHowManyMenuOpen] = useState(false);
  const [activeOwnerIndex, setActiveOwnerIndex] = useState(0);
  const [syncedPurchaseDate, setSyncedPurchaseDate] = useState<string>('');
  
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const stateDropdownRefs = useRef<Array<React.RefObject<HTMLUListElement>>>([]);
  
  const isVehicleGift = formData?.vehicleTransactionDetails?.isGift === true;
  const isPNORestorationActive = !!formData?.isPNORestoration;
  const hideLicenseField = !!formData?.hideLicenseField;
  const hideStateField = !!formData?.hideStateField;
  const hidePurchaseValueField = !!formData?.hidePurchaseValueField;


  const shouldShowValidationError = (index: number, field: keyof OwnerData) => {
    if ((field === 'licenseNumber' && hideLicenseField) ||
    (field === 'state' && hideStateField) ||
    ((field === 'purchaseValue' || field === 'marketValue') && hidePurchaseValueField)) {
  return false;
}
  
    if (isPNORestorationActive && (field === 'purchaseValue' || field === 'marketValue')) {
      return false;
    }
    

    return showValidationErrors && 
      validationErrors.some(error => 
        error.fieldPath === `owners[${index}].${field}`
      );
  };
  
  const getValidationErrorMessage = (index: number, field: keyof OwnerData): string => {
    const error = validationErrors.find(e => e.fieldPath === `owners[${index}].${field}`);
    return error ? error.message : '';
  };

  const shouldForceSingleOwner = () => {
    if (formData.forceSingleOwner) {
      return true;
    }
    
    return !!(
      activeScenarios && (
        activeScenarios["Salvage"]
      )
    );
  };
  
  const forceSingleOwner = shouldForceSingleOwner();
  
  useEffect(() => {
    console.log("NewRegisteredOwners - isPNORestoration:", isPNORestorationActive);
    console.log("Force Single Owner:", forceSingleOwner);
    console.log("Active Scenarios:", activeScenarios);
    console.log("Hide License Field:", hideLicenseField);
    console.log("Hide State Field:", hideStateField);
    console.log("Transfer Index:", transferIndex);
  }, [isPNORestorationActive, forceSingleOwner, activeScenarios, hideLicenseField, hideStateField, transferIndex]);

  const howManyOptions = forceSingleOwner ? ['1'] : ['1', '2', '3'];  
  const howManyRef = useRef<HTMLUListElement | null>(null);


  useEffect(() => {
    if (clearFormTriggered) {
      console.log(`Clear form triggered in NewRegisteredOwners component for transfer ${transferIndex !== undefined ? transferIndex : 'default'}`);
      clearRegisteredOwnersStorage(transferIndex);
      
      const initialOwner = {
        firstName: '',
        middleName: '',
        lastName: '',
        licenseNumber: hideLicenseField ? 'EXEMPT' : '',
        state: hideStateField ? 'CA' : '',
        phoneCode: '',
        phoneNumber: '',
        purchaseDate: '',
        purchaseValue: '',
        marketValue: '',
        isGift: false,
        isTrade: false,
        relationshipWithGifter: '',
        giftValue: '',
        relationshipType: undefined
      };
      const initialOwners = [initialOwner];
      
      setOwners(initialOwners);
      

      const ownersFieldName = transferIndex !== undefined 
        ? `transfer${transferIndex}_owners` 
        : 'owners';
      const howManyFieldName = transferIndex !== undefined 
        ? `transfer${transferIndex}_howMany` 
        : 'howMany';
        
      updateField(ownersFieldName, initialOwners);
      updateField(howManyFieldName, '1');
      
      if (onChange) {
        onChange({ 
          owners: initialOwners,
          howMany: '1'
        });
      }
    }
  }, [clearFormTriggered, transferIndex, updateField, onChange, hideLicenseField, hideStateField]);


  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const savedData = localStorage.getItem(storageKey);
        
        if (savedData) {
          console.log(`Loading registered owners data from localStorage for transfer ${transferIndex !== undefined ? transferIndex : 'default'}`);
          const parsedData = JSON.parse(savedData);
          
          setOwners(parsedData.owners || []);
          

          const ownersFieldName = transferIndex !== undefined 
            ? `transfer${transferIndex}_owners` 
            : 'owners';
          const howManyFieldName = transferIndex !== undefined 
            ? `transfer${transferIndex}_howMany` 
            : 'howMany';
            
          updateField(ownersFieldName, parsedData.owners || []);
          updateField(howManyFieldName, parsedData.howMany || '1');
          
          if (parsedData.owners && parsedData.owners.length > 0 && parsedData.owners[0].purchaseDate) {
            setSyncedPurchaseDate(parsedData.owners[0].purchaseDate);
          }
          
          if (onChange) {
            onChange({ 
              owners: parsedData.owners || [],
              howMany: parsedData.howMany || '1' 
            });
          }
        } else {
          initializeDefaultOwners();
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error(`Error loading saved registered owners data for transfer ${transferIndex !== undefined ? transferIndex : 'default'}:`, error);
        setIsInitialized(true);
        initializeDefaultOwners();
      }
    }
  }, []);

  const initializeDefaultOwners = () => {

    const initialOwner = {
      firstName: '',
      middleName: '',
      lastName: '',
      licenseNumber: hideLicenseField ? 'EXEMPT' : '',
      state: hideStateField ? 'CA' : '',
      phoneCode: '',
      phoneNumber: '',
      purchaseDate: '',
      purchaseValue: '',
      marketValue: '',
      isGift: false,
      isTrade: false,
      relationshipWithGifter: '',
      giftValue: '',
      relationshipType: undefined
    };
    

    const initialOwners = propFormData?.owners && propFormData.owners.length > 0 
      ? propFormData.owners 
      : [initialOwner];
    
    const initialHowMany = propFormData?.howMany || '1';
    
    setOwners(initialOwners);
    

    const ownersFieldName = transferIndex !== undefined 
      ? `transfer${transferIndex}_owners` 
      : 'owners';
    const howManyFieldName = transferIndex !== undefined 
      ? `transfer${transferIndex}_howMany` 
      : 'howMany';
      
    updateField(ownersFieldName, initialOwners);
    updateField(howManyFieldName, initialHowMany);
    
    if (onChange) {
      onChange({ 
        owners: initialOwners,
        howMany: initialHowMany 
      });
    }
    

    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify({
        owners: initialOwners,
        howMany: initialHowMany
      }));
    }
  };

  useEffect(() => {
    if (formData?.owners) {
      setOwners(formData.owners);
      
      if (formData.owners.length > 0 && formData.owners[0].purchaseDate) {
        setSyncedPurchaseDate(formData.owners[0].purchaseDate);
      }
    }
  }, [formData?.owners]);  

  useEffect(() => {
    if (owners.length > 0) {
      let shouldUpdate = false;
      const newOwners = [...owners];
      
      newOwners.forEach(owner => {
        if (hideLicenseField && (!owner.licenseNumber || owner.licenseNumber === '')) {
          owner.licenseNumber = 'EXEMPT';
          shouldUpdate = true;
        }
        
        if (hideStateField && (!owner.state || owner.state === '')) {
          owner.state = 'CA';
          shouldUpdate = true;
        }
      });
      
      if (shouldUpdate) {
        setOwners(newOwners);
        

        const fieldName = transferIndex !== undefined 
          ? `transfer${transferIndex}_owners` 
          : 'owners';
          

        const currentDataStr = JSON.stringify({
          owners: newOwners,
          howMany: formData?.howMany || '1'
        });
        
        if (currentDataStr !== lastUpdatedData) {
          updateField(fieldName, newOwners);
          setLastUpdatedData(currentDataStr);
        }
        

        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, JSON.stringify({
            owners: newOwners,
            howMany: formData?.howMany || '1'
          }));
        }
        
        if (onChange) {
          onChange({ 
            owners: newOwners,
            howMany: formData?.howMany || '1' 
          });
        }
      }
    }
  }, [hideLicenseField, hideStateField, owners.length]);

  useEffect(() => {
    if (forceSingleOwner && formData?.howMany !== '1') {
      const newHowMany = '1';
      

      const fieldName = transferIndex !== undefined 
        ? `transfer${transferIndex}_howMany` 
        : 'howMany';
        
      updateField(fieldName, newHowMany);
      
      if (owners.length > 1) {
        const newOwners = [owners[0]];
        setOwners(newOwners);
        

        const ownersFieldName = transferIndex !== undefined 
          ? `transfer${transferIndex}_owners` 
          : 'owners';
          
        updateField(ownersFieldName, newOwners);
        

        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, JSON.stringify({
            owners: newOwners,
            howMany: newHowMany
          }));
        }
        
        if (onChange) {
          onChange({
            owners: newOwners,
            howMany: newHowMany
          });
        }
      }
    }
  }, [forceSingleOwner, formData?.howMany]);

  useEffect(() => {
    if (syncedPurchaseDate && owners.length > 1) {
      const newOwners = [...owners];
      
      for (let i = 1; i < newOwners.length; i++) {
        if (newOwners[i].purchaseDate !== syncedPurchaseDate) {
          newOwners[i] = { ...newOwners[i], purchaseDate: syncedPurchaseDate };
        }
      }
      
      setOwners(newOwners);
      

      const fieldName = transferIndex !== undefined 
        ? `transfer${transferIndex}_owners` 
        : 'owners';
        

      const currentDataStr = JSON.stringify({
        owners: newOwners,
        howMany: formData?.howMany || '1'
      });
      
      if (currentDataStr !== lastUpdatedData) {
        updateField(fieldName, newOwners);
        setLastUpdatedData(currentDataStr);
      }
      

      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify({
          owners: newOwners,
          howMany: formData?.howMany || '1'
        }));
      }
      
      if (onChange) {
        onChange({
          owners: newOwners,
          howMany: formData?.howMany || '1'
        });
      }
    }
  }, [syncedPurchaseDate, owners.length]);

  const handleHowManyChange = (count: string) => {
    if (forceSingleOwner && count !== '1') {
      count = '1';
    }
    
    const newCount = parseInt(count);
    let newOwners = [...owners];
    const currentPurchaseDate = owners.length > 0 ? owners[0].purchaseDate : '';
    const currentPurchaseValue = owners.length > 0 ? owners[0].purchaseValue : '';
    const currentMarketValue = owners.length > 0 ? owners[0].marketValue : '';

    while (newOwners.length < newCount) {
      newOwners.push({
        firstName: '',
        middleName: '',
        lastName: '',
        licenseNumber: hideLicenseField ? 'EXEMPT' : '',
        state: hideStateField ? 'CA' : '',
        phoneCode: '',
        phoneNumber: '',
        purchaseDate: currentPurchaseDate,
        purchaseValue: currentPurchaseValue, 
        marketValue: currentMarketValue, 
        isGift: false,
        isTrade: false,
        relationshipWithGifter: '',
        giftValue: '',
        relationshipType: 'AND'       
      });
    }

    while (newOwners.length > newCount) {
      newOwners.pop();
    }

    setOwners(newOwners);
    

    const ownersFieldName = transferIndex !== undefined 
      ? `transfer${transferIndex}_owners` 
      : 'owners';
    const howManyFieldName = transferIndex !== undefined 
      ? `transfer${transferIndex}_howMany` 
      : 'howMany';
      

    const currentDataStr = JSON.stringify({
      owners: newOwners,
      howMany: count
    });
    
    if (currentDataStr !== lastUpdatedData) {
      updateField(ownersFieldName, newOwners);
      updateField(howManyFieldName, count);
      setLastUpdatedData(currentDataStr);
    }
    

    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify({
        owners: newOwners,
        howMany: count
      }));
    }
    
    if (onChange) {
      onChange({ 
        owners: newOwners,
        howMany: count 
      });
    }
    
    setIsHowManyMenuOpen(false);
  };

  const handleOwnerFieldChange = (index: number, field: keyof OwnerData, value: any) => {
    const newOwners = [...owners];
    newOwners[index] = { ...newOwners[index], [field]: value };
    
    if (index === 0 && field === 'purchaseDate') {
      setSyncedPurchaseDate(value);
    }
    
    if (index === 0 && (field === 'purchaseValue' || field === 'marketValue')) {
      for (let i = 1; i < newOwners.length; i++) {
        newOwners[i] = { ...newOwners[i], [field]: value };
      }
    }
    
    setOwners(newOwners);
    

    const fieldName = transferIndex !== undefined 
      ? `transfer${transferIndex}_owners` 
      : 'owners';
      

    const currentDataStr = JSON.stringify({
      owners: newOwners,
      howMany: formData?.howMany || '1'
    });
    
    if (currentDataStr !== lastUpdatedData) {
      updateField(fieldName, newOwners);
      setLastUpdatedData(currentDataStr);
    }
    

    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify({
        owners: newOwners,
        howMany: formData?.howMany || '1'
      }));
    }
    
    if (onChange) {
      onChange({ 
        owners: newOwners,
        howMany: formData?.howMany || '1' 
      });
    }
  };

  const handleRelationshipTypeChange = (index: number, type: 'AND' | 'OR') => {
    const newOwners = [...owners];     
    
    if (index > 0) {
      newOwners[index] = { ...newOwners[index], relationshipType: type };
      setOwners(newOwners);
      

      const fieldName = transferIndex !== undefined 
        ? `transfer${transferIndex}_owners` 
        : 'owners';
        

      const currentDataStr = JSON.stringify({
        owners: newOwners,
        howMany: formData?.howMany || '1'
      });
      
      if (currentDataStr !== lastUpdatedData) {
        updateField(fieldName, newOwners);
        setLastUpdatedData(currentDataStr);
      }
      

      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify({
          owners: newOwners,
          howMany: formData?.howMany || '1'
        }));
      }
      
      if (onChange) {
        onChange({ 
          owners: newOwners,
          howMany: formData?.howMany || '1' 
        });
      }
    }
  };

  const handleStateDropdownClick = (index: number) => {
    setOpenDropdown(prev => (prev === index ? null : index));
  };

  const handleStateSelect = (index: number, abbreviation: string) => {
    handleOwnerFieldChange(index, 'state', abbreviation);
    setOpenDropdown(null);
  };

  const handleClickOutsideMenus = (e: MouseEvent) => {
    const target = e.target as Element;
    
    if (howManyRef.current && !howManyRef.current.contains(target) && !target.closest('.howManyDropDown')) {
      setIsHowManyMenuOpen(false);
    }
    
    if (openDropdown !== null && !target.closest(`.stateDropdown-${openDropdown}`)) {
      let clickedOnDropdown = false;
      stateDropdownRefs.current.forEach((ref, idx) => {
        if (ref && ref.current && ref.current.contains(target)) {
          clickedOnDropdown = true;
        }
      });
      
      if (!clickedOnDropdown) {
        setOpenDropdown(null);
      }
    }
  };

  useEffect(() => {
    if (owners.length > 0) {
      const newOwners = [...owners];
      
      if (isVehicleGift) {
        newOwners.forEach(owner => {
          owner.purchaseValue = '';
        });
      } else {
        newOwners.forEach(owner => {
          owner.relationshipWithGifter = '';
          owner.giftValue = '';
          owner.marketValue = '';
        });
      }
      
      setOwners(newOwners);
      

      const fieldName = transferIndex !== undefined 
        ? `transfer${transferIndex}_owners` 
        : 'owners';
        

      const currentDataStr = JSON.stringify({
        owners: newOwners,
        howMany: formData?.howMany || '1'
      });
      
      if (currentDataStr !== lastUpdatedData) {
        updateField(fieldName, newOwners);
        setLastUpdatedData(currentDataStr);
      }
      

      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify({
          owners: newOwners,
          howMany: formData?.howMany || '1'
        }));
      }
      
      if (onChange) {
        onChange({ 
          owners: newOwners,
          howMany: formData?.howMany || '1' 
        });
      }
    }
  }, [isVehicleGift]);

  useEffect(() => {     
    if (!isVehicleGift && owners.length > 0) {
      const newOwners = owners.map(owner => ({
        ...owner,
        relationshipWithGifter: '',
        giftValue: ''
      }));
      
      setOwners(newOwners);
      

      const fieldName = transferIndex !== undefined 
        ? `transfer${transferIndex}_owners` 
        : 'owners';
        

      const currentDataStr = JSON.stringify({
        owners: newOwners,
        howMany: formData?.howMany || '1'
      });
      
      if (currentDataStr !== lastUpdatedData) {
        updateField(fieldName, newOwners);
        setLastUpdatedData(currentDataStr);
      }
      

      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify({
          owners: newOwners,
          howMany: formData?.howMany || '1'
        }));
      }
      
      if (onChange) {
        onChange({ 
          owners: newOwners,
          howMany: formData?.howMany || '1' 
        });
      }
    }
  }, [isVehicleGift]); 
  
  useEffect(() => {
    stateDropdownRefs.current = owners.map(() => React.createRef<HTMLUListElement>());
  }, [owners.length]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideMenus);
    return () => document.removeEventListener('mousedown', handleClickOutsideMenus);
  }, []);
  return (
    <div className="new-registered-owners">
      <div className="newRegHeader">
        <h3 className="newRegHeading">New Registered Owner(s)</h3>
        {/* Hide the dropdown entirely if force single owner is active */}
        {!forceSingleOwner && (
          <div className="howManyWrapper">
            <button
              onClick={() => setIsHowManyMenuOpen(!isHowManyMenuOpen)}
              className="howManyDropDown"
            >
              {String(formData?.howMany ?? '1')}
              <ChevronDownIcon className={`howManyIcon ${isHowManyMenuOpen ? 'rotate' : ''}`} />
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
        )}
      </div>

      {owners.map((owner, index) => (
        <div key={index} className="owner-section">
          <div className="owner-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h4 className="owner-section-heading">New Registered Owner {index + 1}</h4>
            
            {/* AND/OR radio buttons for owners after the first one */}
            {index > 0 && (
              <div className="relationship-type" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="radio"
                    name={`relationshipType-${index}`}
                    checked={owner.relationshipType === 'AND'}
                    onChange={() => handleRelationshipTypeChange(index, 'AND')}
                  />
                  <span>AND</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="radio"
                    name={`relationshipType-${index}`}
                    checked={owner.relationshipType === 'OR'}
                    onChange={() => handleRelationshipTypeChange(index, 'OR')}
                  />
                  <span>OR</span>
                </label>
              </div>
            )}
          </div>

          <div className="newRegFirstGroup">
            <div className="newRegFormItem">
              <label className="registeredOwnerLabel">First Name</label>
              <input
                className={`registeredOwnerInput ${shouldShowValidationError(index, 'firstName') ? 'validation-error' : ''}`}
                type="text"
                placeholder="First Name"
                value={owner.firstName}
                onChange={(e) => {                   
                  const value = e.target.value;
                  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
                  handleOwnerFieldChange(index, 'firstName', capitalizedValue);
                }}
              />
              {shouldShowValidationError(index, 'firstName') && (
                <p className="validation-message">{getValidationErrorMessage(index, 'firstName')}</p>
              )}
            </div>
            <div className="newRegFormItem">
              <label className="registeredOwnerLabel">Middle Name</label>
              <input
                className="registeredOwnerInput"
                type="text"
                placeholder="Middle Name"
                value={owner.middleName}
                onChange={(e) => {                   
                  const value = e.target.value;
                  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
                  handleOwnerFieldChange(index, 'middleName', capitalizedValue);
                }}
              />
            </div>
            <div className="newRegFormItem">
              <label className="registeredOwnerLabel">Last Name</label>
              <input
                className={`registeredOwnerInput ${shouldShowValidationError(index, 'lastName') ? 'validation-error' : ''}`}
                type="text"
                placeholder="Last Name"
                value={owner.lastName}
                onChange={(e) => {                   
                  const value = e.target.value;
                  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
                  handleOwnerFieldChange(index, 'lastName', capitalizedValue);
                }}
              />
              {shouldShowValidationError(index, 'lastName') && (
                <p className="validation-message">{getValidationErrorMessage(index, 'lastName')}</p>
              )}
            </div>
          </div>

          <div className="newRegSecondGroup">
            {/* Conditionally render the license field */}
            {!hideLicenseField && (
              <div className="newRegInfo">
                <label className="registeredOwnerLabel">Driver License Number</label>
                <input
                  className={`registeredOwnerLicenseInput ${shouldShowValidationError(index, 'licenseNumber') ? 'validation-error' : ''}`}
                  type="text"
                  placeholder="Driver License Number (8 digits)"
                  value={owner.licenseNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    
                    if (/^[a-zA-Z0-9]*$/.test(value)) {
                      handleOwnerFieldChange(index, 'licenseNumber', value.toUpperCase());
                    }
                  }}
                  maxLength={8}
                  inputMode="numeric"
                  pattern="\d{8}"
                />
                {shouldShowValidationError(index, 'licenseNumber') ? (
                  <p className="validation-message">{getValidationErrorMessage(index, 'licenseNumber')}</p>
                ) : (
                  owner.licenseNumber && owner.licenseNumber.length < 8 && (
                    <p className="validation-message">License number must be 8 digits</p>
                  )
                )}
              </div>
            )}

            {/* Conditionally render the state field */}
            {!hideStateField && (
              <div className="regStateWrapper">
                <label className="registeredOwnerLabel">State</label>
                <button
                  type="button"
                  onClick={() => handleStateDropdownClick(index)}
                  className={`regStateDropDown stateDropdown-${index} ${shouldShowValidationError(index, 'state') ? 'validation-error' : ''}`}
                >
                  {owner.state || 'State'}
                  <ChevronDownIcon className={`regIcon ${openDropdown === index ? 'rotate' : ''}`} />
                </button>
                
                {openDropdown === index && (
                  <ul 
                    ref={stateDropdownRefs.current[index]}
                    className="regStateMenu"
                  >
                    {states.map((state, stateIndex) => (
                      <li
                        className="regStateLists"
                        key={stateIndex}
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
            )}
          </div>
          
          <div className="newRegThirdGroup">
            <div className="sellerThirdItem">
              <label className="sellerLabel">Phone Number</label>
              <input
                className={`sellerNumberInput ${shouldShowValidationError(index, 'phoneNumber') ? 'validation-error' : ''}`}
                type="text"
                placeholder="Phone Number (10 digits)"
                value={owner.phoneNumber}
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^[0-9]*$/.test(value) && value.length <= 10) {
                    handleOwnerFieldChange(index, 'phoneNumber', value);
                  }
                }}
                maxLength={10}
                inputMode="numeric"
              />
              {shouldShowValidationError(index, 'phoneNumber') ? (
                <p className="validation-message">{getValidationErrorMessage(index, 'phoneNumber')}</p>
              ) : (
                owner.phoneNumber && owner.phoneNumber.length < 10 && (
                  <p className="validation-message">Phone number must be 10 digits</p>
                )
              )}
            </div>
            
            {index === 0 && !isPNORestorationActive && !hidePurchaseValueField && (
              <div className="newRegThirdItem">
                <label className="registeredOwnerLabel">
                  {isVehicleGift ? 'Market Value' : 'Purchase Price/Value'}
                </label>
                <input
                  className={`registeredValueInput ${
                    isVehicleGift 
                      ? shouldShowValidationError(index, 'marketValue') ? 'validation-error' : '' 
                      : shouldShowValidationError(index, 'purchaseValue') ? 'validation-error' : ''
                  }`}
                  type="text"
                  placeholder={isVehicleGift ? "Enter Market Value" : "Enter Amount"}
                  value={isVehicleGift ? (owner.marketValue || '') : (owner.purchaseValue || '')}
                  onChange={(e) => handleOwnerFieldChange(
                    index, 
                    isVehicleGift ? 'marketValue' : 'purchaseValue', 
                    e.target.value
                  )}
                />
                {isVehicleGift && shouldShowValidationError(index, 'marketValue') && (
                  <p className="validation-message">{getValidationErrorMessage(index, 'marketValue')}</p>
                )}
                {!isVehicleGift && shouldShowValidationError(index, 'purchaseValue') && (
                  <p className="validation-message">{getValidationErrorMessage(index, 'purchaseValue')}</p>
                )}
              </div>
            )}
          </div>
      
          {isVehicleGift && index === 0 && !isPNORestorationActive && (
            <div className="newRegGiftGroup">
              <div className="newRegGiftItem">
                <label className="registeredOwnerLabel">Relationship with Gifter</label>
                <input
                  className={`registeredOwnerInput ${shouldShowValidationError(index, 'relationshipWithGifter') ? 'validation-error' : ''}`}
                  type="text"
                  placeholder="Enter Relationship"
                  value={owner.relationshipWithGifter || ''}
                  onChange={(e) => handleOwnerFieldChange(index, 'relationshipWithGifter', e.target.value)}
                />
                {shouldShowValidationError(index, 'relationshipWithGifter') && (
                  <p className="validation-message">{getValidationErrorMessage(index, 'relationshipWithGifter')}</p>
                )}
              </div>
              <div className="newRegGiftItem">
                <label className="registeredOwnerLabel">Gift Value</label>
                <input
                  className={`registeredValueInput ${shouldShowValidationError(index, 'giftValue') ? 'validation-error' : ''}`}
                  type="text"
                  placeholder="Enter Gift Value"
                  value={owner.giftValue || ''}
                  onChange={(e) => handleOwnerFieldChange(index, 'giftValue', e.target.value)}
                />
                {shouldShowValidationError(index, 'giftValue') && (
                  <p className="validation-message">{getValidationErrorMessage(index, 'giftValue')}</p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NewRegisteredOwners;