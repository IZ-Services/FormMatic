'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import './VehicleStorageLocation.css';

interface StorageLocationData {
  fromDate: string;
  toDate: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface FormData {
  storageLocation?: StorageLocationData;
  [key: string]: any;
}

interface FormContextType {
  updateField: (field: string, value: any) => void;
  formData: FormData;
}

interface VehicleStorageLocationProps {
  formData?: FormData;
  onChange?: (data: FormData) => void;
  isMultipleTransfer?: boolean;
  showValidationErrors?: boolean;
}

const initialStorageData: StorageLocationData = {
  fromDate: '',
  toDate: '',
  address: '',
  city: '',
  state: '',
  zipCode: ''
};

const cleanFormData = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  
  const result: any = {};
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (key === 'storageLocation' && value && typeof value === 'object' && 
        (value.storageLocation !== undefined)) {
      const { fromDate, toDate, address, city, state, zipCode } = value;
      result[key] = { fromDate, toDate, address, city, state, zipCode };
    } else {
      result[key] = value;
    }
  });
  
  return result;
};

const VehicleStorageLocation: React.FC<VehicleStorageLocationProps> = ({ 
  formData: propFormData, 
  onChange, 
  isMultipleTransfer = false,
  showValidationErrors = false
}) => {
  const { formData: contextFormData, updateField } = useFormContext() as FormContextType;
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  

  const cleanedPropData = cleanFormData(propFormData);
  

  const combinedFormData = {
    ...contextFormData,
    ...cleanedPropData
  };
  

  const [storageData, setStorageData] = useState<StorageLocationData>(
    cleanedPropData?.storageLocation || 
    (contextFormData?.storageLocation as StorageLocationData) || 
    { ...initialStorageData }
  );
  
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const stateDropdownRef = useRef<HTMLUListElement>(null);

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


  const validateStorageLocation = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    

    if (!storageData.fromDate) {
      errors.push({
        field: 'fromDate',
        message: 'From date is required'
      });
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(storageData.fromDate)) {
      errors.push({
        field: 'fromDate',
        message: 'Date must be in MM/DD/YYYY format'
      });
    }
    

    if (!storageData.toDate) {
      errors.push({
        field: 'toDate',
        message: 'To date is required'
      });
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(storageData.toDate)) {
      errors.push({
        field: 'toDate',
        message: 'Date must be in MM/DD/YYYY format'
      });
    }
    

    if (!storageData.address) {
      errors.push({
        field: 'address',
        message: 'Address is required'
      });
    }
    

    if (!storageData.city) {
      errors.push({
        field: 'city',
        message: 'City is required'
      });
    }
    

    if (!storageData.state) {
      errors.push({
        field: 'state',
        message: 'State is required'
      });
    }
    

    if (!storageData.zipCode) {
      errors.push({
        field: 'zipCode',
        message: 'ZIP code is required'
      });
    } else if (!/^\d{5}(-\d{4})?$/.test(storageData.zipCode)) {
      errors.push({
        field: 'zipCode',
        message: 'Please enter a valid ZIP code'
      });
    }
    
    return errors;
  };
  

  const getErrorMessage = (field: string): string | null => {
    const error = validationErrors.find(err => err.field === field);
    return error ? error.message : null;
  };


  useEffect(() => {
    if (!contextFormData?.storageLocation) {
      updateField('storageLocation', initialStorageData);
    }
  }, []);


  useEffect(() => {
    if (propFormData) {
      const cleanedProps = cleanFormData(propFormData);
      
      if (cleanedProps.storageLocation) {
        setStorageData(prev => ({
          ...prev,
          ...cleanedProps.storageLocation
        }));
      }
    }
  }, [propFormData]);


  useEffect(() => {
    const currentData = combinedFormData?.storageLocation;
    if (currentData) {
      setStorageData(currentData as StorageLocationData);
    }
  }, [combinedFormData?.storageLocation]);


  useEffect(() => {
    if (showValidationErrors) {
      const errors = validateStorageLocation();
      setValidationErrors(errors);
    }
  }, [showValidationErrors, storageData]);


  useEffect(() => {
    if (showValidationErrors) {
      updateField('_validationErrors', (prev: any) => ({
        ...prev,
        storageLocation: validationErrors.length > 0
      }));
    }
  }, [validationErrors, showValidationErrors]);


  useEffect(() => {
    if (isMultipleTransfer) {
      console.log("VehicleStorageLocation: Multiple transfer mode detected");
      console.log("Initial storageData:", storageData);
      
      if (!onChange) {
        updateField('storageLocation', storageData);
      }
    }
  }, [isMultipleTransfer]);

  const formatDate = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }
  };

  const handleInputChange = (field: keyof StorageLocationData, value: string): void => {
    console.log(`Updating storage.${field} to:`, value);
    
    let formattedValue = value;
    if (field === 'fromDate' || field === 'toDate') {
      formattedValue = formatDate(value);
    }
    
    const updatedStorageData = {
      ...storageData,
      [field]: formattedValue
    };
    
    setStorageData(updatedStorageData);
    
    if (onChange) {
      onChange({ storageLocation: updatedStorageData });
    } else {
      updateField('storageLocation', updatedStorageData);
      
      if (isMultipleTransfer) {
        console.log(`Multiple transfer update for storage.${field}:`, formattedValue);
      }
    }
    

    if (showValidationErrors) {
      const errors = validateStorageLocation();
      setValidationErrors(errors);
    }
  };

  const handleStateSelect = (stateAbbreviation: string) => {
    handleInputChange('state', stateAbbreviation);
    setOpenDropdown(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Element;
    
    if (stateDropdownRef.current && !stateDropdownRef.current.contains(target) && 
        !target.closest('.regStateDropDown')) {
      setOpenDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="addressWrapper">
      <h3 className="addressHeading">Vehicle Storage Location</h3>
 
      <div className="vehicleFirstGroup">
        <div className="vehicleFormItem">
          <label className="formLabe">FROM: MONTH, DAY, YEAR</label>
          <input
            className={`makeInput ${showValidationErrors && getErrorMessage('fromDate') ? 'error-input' : ''}`}
            type="text"
            placeholder="MM/DD/YYYY"
            value={storageData.fromDate}
            onChange={(e) => handleInputChange('fromDate', e.target.value)}
            maxLength={10}
          />
          {showValidationErrors && getErrorMessage('fromDate') && (
            <div className="error-message">{getErrorMessage('fromDate')}</div>
          )}
        </div>
        <div className="vehicleFormItem">
          <label className="formLabe">TO: MONTH, DAY, YEAR</label>
          <input
            className={`odometerInput ${showValidationErrors && getErrorMessage('toDate') ? 'error-input' : ''}`}
            type="text"
            placeholder="MM/DD/YYYY"
            value={storageData.toDate}
            onChange={(e) => handleInputChange('toDate', e.target.value)}
            maxLength={10}
          />
          {showValidationErrors && getErrorMessage('toDate') && (
            <div className="error-message">{getErrorMessage('toDate')}</div>
          )}
        </div>
      </div>
      
      {/* Address Section */}
      <div className="streetAptGroup">
        <div className="formGroup fullWidthField">
          <label className="formLabel">Address</label>
          <input
            className={`formInputt ${showValidationErrors && getErrorMessage('address') ? 'error-input' : ''}`}
            type="text"
            placeholder="Address"
            value={storageData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
          />
          {showValidationErrors && getErrorMessage('address') && (
            <div className="error-message">{getErrorMessage('address')}</div>
          )}
        </div>
      </div>
      
      {/* City, State, ZIP */}
      <div className="cityStateZipGroupp">
        <div className="cityFieldCustomWidth">
          <label className="formLabel">City</label>
          <input
            className={`cityInputt ${showValidationErrors && getErrorMessage('city') ? 'error-input' : ''}`}
            type="text"
            placeholder="City"
            value={storageData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
          />
          {showValidationErrors && getErrorMessage('city') && (
            <div className="error-message">{getErrorMessage('city')}</div>
          )}
        </div>
        
        <div className="regStateWrapper">
          <label className="registeredOwnerLabel">State</label>
          <button
            type="button"
            onClick={() => setOpenDropdown(!openDropdown)}
            className={`regStateDropDown ${showValidationErrors && getErrorMessage('state') ? 'error-button' : ''}`}
          >
            {storageData.state || 'State'}
            <ChevronDownIcon className={`regIcon ${openDropdown ? 'rotate' : ''}`} />
          </button>
          {showValidationErrors && getErrorMessage('state') && (
            <div className="error-message">{getErrorMessage('state')}</div>
          )}
          {openDropdown && (
            <ul ref={stateDropdownRef} className="regStateMenu">
              {states.map((state, index) => (
                <li
                  key={index}
                  onClick={() => handleStateSelect(state.abbreviation)}
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
          <input
            className={`formInputt ${showValidationErrors && getErrorMessage('zipCode') ? 'error-input' : ''}`}
            type="text"
            placeholder="ZIP Code"
            value={storageData.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
          />
          {showValidationErrors && getErrorMessage('zipCode') && (
            <div className="error-message">{getErrorMessage('zipCode')}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleStorageLocation;