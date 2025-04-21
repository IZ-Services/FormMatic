import React, { useState, useEffect, useCallback } from 'react';
import Address from '../atoms/Address';
import NewRegisteredOwners from '../atoms/NewRegisteredOwner';
import NewLien from '../atoms/NewLienHolder';
import VehicalInformation from '../atoms/VehicleInformation';
import Seller from '../atoms/Seller';
import SaveButton from '../atoms/savebutton';
import { FormDataProvider, useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ScenarioProvider } from '../../context/ScenarioContext';
import TypeContainer from '../layouts/TransactionsContainer';
import LegalOwnerOfRecord from '../atoms/LegalOwnerOfRecord';
import VehicleTransactionDetails from '../atoms/Checkboxes';
import PowerOfAttorney from '../atoms/PowerOfAttorney';
import SellerAddress from '../atoms/SellerAdrress';
import './MultipleTransfer.css';

interface VehicleTransactionDetailsData {
  currentLienholder?: boolean;
  [key: string]: any;
}

interface VehicleInformationType {
  hullId?: string;
  make?: string;
  year?: string;
  [key: string]: any;
}

interface SellerInfo {
  [key: string]: any;
}

interface FormData {
  [key: string]: any;
}

interface LegalOwnerType {
  [key: string]: any;
}

interface OwnerData {
  [key: string]: any;
}

interface LienHolder {
  [key: string]: any;
}

interface PowerOfAttorneyData {
  [key: string]: any;
}

interface TransferData {
  vehicleTransactionDetails?: VehicleTransactionDetailsData;
  vehicleInformation?: VehicleInformationType;
  seller?: SellerInfo;
  sellerAddress?: FormData;
  legalOwner?: LegalOwnerType;
  newOwners?: { owners: OwnerData[]; howMany: string };
  address?: FormData;
  newLien?: LienHolder;
  powerOfAttorney?: PowerOfAttorneyData;
  [key: string]: any;
}

interface MultipleTransferProps {
  formData?: any;
  onDataChange?: (data: any) => void;
}

interface TransferFormProps {
  index: number;
  totalTransfers: number;
  formData: any;
  onDataChange: (data: any, index: number) => void;
  isActive: boolean;
  sharedVehicleInfo: VehicleInformationType;
}

interface MultiSaveButtonProps {
  transfersData: TransferData[];
  numberOfTransfers: number;
  validateAllTransfers: () => boolean;
}

const STORAGE_KEY = 'multipleTransferState';

export const clearmultipleStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    console.log('multiple address data cleared from localStorage');
  }
};

const saveStateToStorage = (state: {
  numberOfTransfers: number;
  transfersData: TransferData[];
  activeTransferIndex: number;
  sharedVehicleInfo: VehicleInformationType;
}) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }
};

const loadStateFromStorage = (): {
  numberOfTransfers: number;
  transfersData: TransferData[];
  activeTransferIndex: number;
  sharedVehicleInfo: VehicleInformationType;
} | null => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
  }
  return null;
};

// Custom validation for multiple transfers
const validateTransfer = (formData: any, index: number): {isValid: boolean, errors: any[]} => {
  const errors: any[] = [];
  
  // Check required vehicle information fields
  if (!formData.vehicleInformation?.hullId) {
    errors.push({
      fieldPath: `transfer${index}_vehicleInformation.hullId`,
      message: 'VIN/Hull ID is required'
    });
  }
  
  if (!formData.vehicleInformation?.make) {
    errors.push({
      fieldPath: `transfer${index}_vehicleInformation.make`,
      message: 'Make is required'
    });
  }
  
  if (!formData.vehicleInformation?.year) {
    errors.push({
      fieldPath: `transfer${index}_vehicleInformation.year`,
      message: 'Year is required'
    });
  }
  
  // Check for seller information
  if (!formData.seller || !formData.seller.sellers || formData.seller.sellers.length === 0) {
    errors.push({
      fieldPath: `transfer${index}_seller.sellers`,
      message: 'Seller information is required'
    });
  } else if (formData.seller.sellers) {
    formData.seller.sellers.forEach((seller: any, sellerIndex: number) => {
      if (!seller.firstName) {
        errors.push({
          fieldPath: `transfer${index}_seller.sellers[${sellerIndex}].firstName`,
          message: 'Seller first name is required'
        });
      }
      
      if (!seller.lastName) {
        errors.push({
          fieldPath: `transfer${index}_seller.sellers[${sellerIndex}].lastName`,
          message: 'Seller last name is required'
        });
      }
    });
  }
  
  // Check seller address
  if (!formData.sellerAddress) {
    errors.push({
      fieldPath: `transfer${index}_sellerAddress`,
      message: 'Seller address is required'
    });
  } else {
    if (!formData.sellerAddress.street) {
      errors.push({
        fieldPath: `transfer${index}_sellerAddress.street`,
        message: 'Seller street address is required'
      });
    }
    
    if (!formData.sellerAddress.city) {
      errors.push({
        fieldPath: `transfer${index}_sellerAddress.city`,
        message: 'Seller city is required'
      });
    }
    
    if (!formData.sellerAddress.state) {
      errors.push({
        fieldPath: `transfer${index}_sellerAddress.state`,
        message: 'Seller state is required'
      });
    }
    
    if (!formData.sellerAddress.zip) {
      errors.push({
        fieldPath: `transfer${index}_sellerAddress.zip`,
        message: 'Seller ZIP code is required'
      });
    }
  }
  
  // Check new owner information
  if (!formData.newOwners || !formData.newOwners.owners || formData.newOwners.owners.length === 0) {
    errors.push({
      fieldPath: `transfer${index}_newOwners.owners`,
      message: 'New owner information is required'
    });
  } else if (formData.newOwners.owners) {
    formData.newOwners.owners.forEach((owner: any, ownerIndex: number) => {
      if (!owner.firstName) {
        errors.push({
          fieldPath: `transfer${index}_newOwners.owners[${ownerIndex}].firstName`,
          message: 'Owner first name is required'
        });
      }
      
      if (!owner.lastName) {
        errors.push({
          fieldPath: `transfer${index}_newOwners.owners[${ownerIndex}].lastName`,
          message: 'Owner last name is required'
        });
      }
    });
  }
  
  // Check new owner address
  if (!formData.address) {
    errors.push({
      fieldPath: `transfer${index}_address`,
      message: 'New owner address is required'
    });
  } else {
    if (!formData.address.street) {
      errors.push({
        fieldPath: `transfer${index}_address.street`,
        message: 'New owner street address is required'
      });
    }
    
    if (!formData.address.city) {
      errors.push({
        fieldPath: `transfer${index}_address.city`,
        message: 'New owner city is required'
      });
    }
    
    if (!formData.address.state) {
      errors.push({
        fieldPath: `transfer${index}_address.state`,
        message: 'New owner state is required'
      });
    }
    
    if (!formData.address.zip) {
      errors.push({
        fieldPath: `transfer${index}_address.zip`,
        message: 'New owner ZIP code is required'
      });
    }
  }
  
  // Add more validations for other fields as needed
  
  return { isValid: errors.length === 0, errors };
};

const MultiSaveButton: React.FC<MultiSaveButtonProps> = ({ 
  transfersData, 
  numberOfTransfers,
  validateAllTransfers
}) => {
  const { 
    setValidationErrors, 
    setShowValidationErrors 
  } = useFormContext() as { 
    setValidationErrors: (errors: any[]) => void;
    setShowValidationErrors: (show: boolean) => void;
  };
  
  const consolidatedData = {
    numberOfTransfers,
    transfersData,
    isMultipleTransfer: true
  };
  
  const handleSaveSuccess = () => {
    console.log('Multiple transfer save completed successfully');
    // Clear validation state on successful save
    setValidationErrors([]);
    setShowValidationErrors(false);
  };
  
  const handleSaveClick = (e: React.MouseEvent) => {
    // Prevent default button behavior
    e.preventDefault();
    e.stopPropagation();
    
    // Validate all transfers before allowing save
    const isValid = validateAllTransfers();
    
    if (!isValid) {
      console.log('Validation failed. Cannot save multiple transfers.');
      setShowValidationErrors(true);
      return;
    }
    
    // If validation passes, continue with save
    console.log('Validation passed. Proceeding with save.');
    // Allow the SaveButton click to proceed
  };
  
  return (
    <div onClick={handleSaveClick}>
      <SaveButton 
        transactionType="Multiple Transfer"
        onSuccess={handleSaveSuccess}
        multipleTransferData={consolidatedData}
      />
    </div>
  );
};

const TransferForm: React.FC<TransferFormProps> = ({ 
  index, 
  totalTransfers, 
  formData, 
  onDataChange,
  isActive,
  sharedVehicleInfo
}) => {
  const { 
    formData: contextFormData, 
    updateField,
    validationErrors,
    showValidationErrors
  } = useFormContext() as { 
    formData: Record<string, any>; 
    updateField: (key: string, value: any) => void;
    validationErrors: Array<{ fieldPath: string; message: string }>;
    showValidationErrors: boolean;
  };
  
  const [localFormValues, setLocalFormValues] = useState<Record<string, any>>({});
  
  useEffect(() => {
    if (formData) {
      const updatedValues = { ...localFormValues };
      let hasChanges = false;
      
      Object.entries(formData).forEach(([key, value]) => {
        if (JSON.stringify(updatedValues[key]) !== JSON.stringify(value)) {
          updatedValues[key] = value;
          hasChanges = true;
          const contextKey = `transfer${index}_${key}`;
          updateField(contextKey, value);
        }
      });
      
      if (hasChanges) {
        setLocalFormValues(updatedValues);
      }
    }
  }, [formData, index, updateField, localFormValues]);
  
  useEffect(() => {
    if (sharedVehicleInfo && Object.keys(sharedVehicleInfo).length > 0) {
      const currentVehicleInfo = localFormValues.vehicleInformation || {};
      
      const updatedVehicleInfo = {
        ...currentVehicleInfo,
        ...sharedVehicleInfo
      };
      
      if (JSON.stringify(currentVehicleInfo) !== JSON.stringify(updatedVehicleInfo)) {
        console.log(`Transfer ${index}: Syncing vehicle info:`, sharedVehicleInfo);
        handleFieldChange('vehicleInformation', updatedVehicleInfo);
        updateField(`transfer${index}_vehicleInformation`, updatedVehicleInfo);
      }
    }
  }, [sharedVehicleInfo, localFormValues, index, updateField]);
  
  const handleFieldChange = useCallback((key: string, value: any) => {
    setLocalFormValues(prev => {
      const updated = { ...prev, [key]: value };
      
      setTimeout(() => {
        const normalizedData = normalizeFieldData(key, value, updated);
        onDataChange(normalizedData, index);
      }, 0);
      
      return updated;
    });
  }, [onDataChange, index]);
  
  const normalizeFieldData = (key: string, value: any, allValues: Record<string, any>) => {
    const result = { ...allValues };
    
    if (key === 'newOwners' && value?.owners) {
      result.owners = value.owners;
    }
    
    if (key === 'seller' && value) {
      if (!value.sellers && typeof value === 'object') {
        result.seller = {
          ...value,
          sellers: [value]
        };
      }
    }
    
    if (key === 'address' && value) {
      result.address = value;
      if (value.mailingAddressDifferent !== undefined) {
        result.mailingAddressDifferent = Boolean(value.mailingAddressDifferent);
      }
      if (value.lesseeAddressDifferent !== undefined) {
        result.lesseeAddressDifferent = Boolean(value.lesseeAddressDifferent);
      }
      if (value.trailerLocationDifferent !== undefined) {
        result.trailerLocationDifferent = Boolean(value.trailerLocationDifferent);
      }
    }
    
    if (key === 'sellerAddress' && value) {
      result.sellerAddress = value;
      if (value.sellerMailingAddressDifferent !== undefined) {
        result.sellerMailingAddressDifferent = Boolean(value.sellerMailingAddressDifferent);
      }
    }
    
    return result;
  };
  
  const handleVehicleInfoChange = useCallback((data: VehicleInformationType) => {
    handleFieldChange('vehicleInformation', data);
    updateField(`transfer${index}_vehicleInformation`, data);
    
    const syncedFields: VehicleInformationType = {};
    const fieldsToSync = ['hullId', 'make', 'year'];
    let hasChanges = false;
    
    fieldsToSync.forEach(field => {
      if (data[field] !== undefined && 
          data[field] !== localFormValues?.vehicleInformation?.[field]) {
        syncedFields[field] = data[field];
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      console.log(`Transfer ${index}: Requesting sync for fields:`, 
                  Object.keys(syncedFields).join(', '));
      
      setTimeout(() => {
        onDataChange({
          _syncVehicleInfo: syncedFields
        }, index);
      }, 0);
    }
  }, [handleFieldChange, updateField, onDataChange, index, localFormValues]);
  
  // Get validation errors specific to this transfer
  const getTransferErrors = useCallback(() => {
    if (!validationErrors || !Array.isArray(validationErrors)) return [];
    
    const transferPrefix = `transfer${index}_`;
    return validationErrors.filter(error => 
      error.fieldPath.startsWith(transferPrefix)
    );
  }, [validationErrors, index]);
  
  // Helper function to get error for a specific field
  const getFieldError = useCallback((fieldPath: string) => {
    if (!validationErrors || !Array.isArray(validationErrors) || !showValidationErrors) return null;
    
    const fullPath = `transfer${index}_${fieldPath}`;
    const error = validationErrors.find(error => error.fieldPath === fullPath);
    return error ? error.message : null;
  }, [validationErrors, index, showValidationErrors]);
  
  const transferErrors = getTransferErrors();
  const hasErrors = transferErrors.length > 0;
  
  const isCurrentLienholderChecked = 
    contextFormData?.[`transfer${index}_vehicleTransactionDetails`]?.currentLienholder === true;
  
  const getComponentFormData = () => {
    const prefix = `transfer${index}_`;
    const result: Record<string, any> = {};
    
    Object.entries(contextFormData || {}).forEach(([key, value]) => {
      if (key.startsWith(prefix)) {
        const unprefixedKey = key.slice(prefix.length);
        result[unprefixedKey] = value;
      }
    });
    
    return result;
  };
  
  const componentFormData = getComponentFormData();
  
  if (!isActive) {
    return null;
  }

  return (
    <div className={`transfer-form-container ${hasErrors && showValidationErrors ? 'has-validation-errors' : ''}`}>
      {hasErrors && showValidationErrors && (
        <div className="transfer-validation-error-summary">
          <h3>Please correct the following issues in Transfer {index + 1}:</h3>
          <ul>
            {transferErrors.map((error, errorIndex) => (
              <li key={`error-${errorIndex}`} style={{ color: 'red' }}>
                {error.message} ({error.fieldPath.replace(`transfer${index}_`, '')})
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <VehicleTransactionDetails 
        formData={componentFormData}
        onChange={(data: VehicleTransactionDetailsData) => {
          if (data) {
            handleFieldChange('vehicleTransactionDetails', data);
            updateField(`transfer${index}_vehicleTransactionDetails`, data);
          }
        }}
        transferIndex={index}
      />
      
      <VehicalInformation 
        formData={componentFormData}
        onChange={handleVehicleInfoChange}
        // transferIndex={index}
      />
      
      <Seller 
        formData={componentFormData}
        onChange={(data: SellerInfo) => {
          handleFieldChange('seller', data);
        }}
        transferIndex={index}
      /> 
      
      <SellerAddress 
        formData={componentFormData}
        onChange={(data: FormData) => {     
          const { 
            sellerAddress, 
            sellerMailingAddress, 
            sellerMailingAddressDifferent 
          } = data;     
          
          if (sellerAddress) {
            handleFieldChange('sellerAddress', sellerAddress);
          }
          
          if (sellerMailingAddress) {
            handleFieldChange('sellerMailingAddress', sellerMailingAddress);
          }
          
          if (sellerMailingAddressDifferent !== undefined) {
            handleFieldChange('sellerMailingAddressDifferent', Boolean(sellerMailingAddressDifferent));       
            updateField(`transfer${index}_sellerMailingAddressDifferent`, Boolean(sellerMailingAddressDifferent));
          }
        }}
        isMultipleTransfer={true}
        transferIndex={index}
      />
      
      {isCurrentLienholderChecked && (
        <LegalOwnerOfRecord 
          formData={componentFormData}
          onChange={(data: LegalOwnerType) => {
            handleFieldChange('legalOwner', data);
          }}
          transferIndex={index}
        />
      )}
      
      <NewRegisteredOwners 
        formData={componentFormData}
        onChange={(data: { owners: OwnerData[]; howMany: string }) => {
          handleFieldChange('newOwners', data);
          
          if (data && data.owners) {
            updateField(`transfer${index}_owners`, data.owners);
          }
        }}
        transferIndex={index}
      />
      
      <Address 
        formData={componentFormData}
        onChange={(data: FormData) => {
          handleFieldChange('address', data);
          
          if (data.mailingAddressDifferent !== undefined) {
            updateField(`transfer${index}_mailingAddressDifferent`, Boolean(data.mailingAddressDifferent));
          }
          
          if (data.lesseeAddressDifferent !== undefined) {
            updateField(`transfer${index}_lesseeAddressDifferent`, Boolean(data.lesseeAddressDifferent));
          }
          
          if (data.trailerLocationDifferent !== undefined) {
            updateField(`transfer${index}_trailerLocationDifferent`, Boolean(data.trailerLocationDifferent));
          }
        }}
        isMultipleTransfer={true}
        transferIndex={index}
      />
      
      <PowerOfAttorney 
        formData={componentFormData}
        onChange={(data: PowerOfAttorneyData) => {
          handleFieldChange('powerOfAttorney', data);
        }}
        transferIndex={index}
      />
    </div>
  );
};



const MultipleTransferWithContext: React.FC<MultipleTransferProps> = (props) => {
  return (
    <FormDataProvider>
      <ScenarioProvider>
        <MultipleTransferInner {...props} />
      </ScenarioProvider>
    </FormDataProvider>
  );
};


const MultipleTransferInner: React.FC<MultipleTransferProps> = ({ formData, onDataChange }) => {
  // Initialize states with default values
  const [numberOfTransfers, setNumberOfTransfers] = useState<number>(1);
  const [transfersData, setTransfersData] = useState<TransferData[]>(Array(5).fill({}));
  const [activeTransferIndex, setActiveTransferIndex] = useState<number>(0);
  const [sharedVehicleInfo, setSharedVehicleInfo] = useState<VehicleInformationType>({});
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [openErrorDropdowns, setOpenErrorDropdowns] = useState<{ [key: number]: boolean }>({});

  const { 
    setValidationErrors,
    setShowValidationErrors,
    showValidationErrors,
    validationErrors
  } = useFormContext() as { 
    setValidationErrors: (errors: any[]) => void;
    setShowValidationErrors: (show: boolean) => void;
    showValidationErrors: boolean;
    validationErrors: Array<{ fieldPath: string; message: string }>;
  };

  const toggleErrorDropdown = (transferIndex: number) => {
    setOpenErrorDropdowns(prev => ({
      ...prev,
      [transferIndex]: !prev[transferIndex]
    }));
  };

  

  // Load saved state from localStorage on component mount
  useEffect(() => {
    try {
      const savedState = loadStateFromStorage();
      
      if (savedState) {
        console.log('Restoring state from localStorage:', savedState);
        
        // Ensure transfersData is properly initialized as an array
        const safeTransfersData = Array.isArray(savedState.transfersData) 
          ? savedState.transfersData 
          : Array(5).fill({});
          
        setNumberOfTransfers(savedState.numberOfTransfers || 1);
        setTransfersData(safeTransfersData);
        setActiveTransferIndex(Math.min(savedState.activeTransferIndex || 0, (savedState.numberOfTransfers || 1) - 1));
        setSharedVehicleInfo(savedState.sharedVehicleInfo || {});
      }
    } catch (error) {
      console.error('Error loading state:', error);
      // In case of error, continue with default state
    } finally {
      setIsInitialized(true);
    }
  }, []);
  
  // Handle incoming formData prop (higher priority than localStorage)
  useEffect(() => {
    if (formData && isInitialized) {
      if (formData.transfersData) {
        setTransfersData(formData.transfersData);
        
        if (formData.transfersData[0]?.vehicleInformation) {
          const { hullId, make, year } = formData.transfersData[0].vehicleInformation;
          if (hullId || make || year) {
            setSharedVehicleInfo({
              hullId,
              make,
              year
            });
          }
        }
      }
      if (formData.numberOfTransfers) {
        setNumberOfTransfers(formData.numberOfTransfers);
      }
    }
  }, [formData, isInitialized]);
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        // Make sure transfersData is an array before saving
        const safeTransfersData = Array.isArray(transfersData) ? 
          transfersData : Array(Math.max(5, numberOfTransfers)).fill({});
        
        // Ensure we're saving valid data
        const stateToSave = {
          numberOfTransfers: Math.max(1, numberOfTransfers),
          transfersData: safeTransfersData,
          activeTransferIndex: Math.min(activeTransferIndex, numberOfTransfers - 1),
          sharedVehicleInfo: sharedVehicleInfo || {}
        };
        
        saveStateToStorage(stateToSave);
        console.log('State saved to localStorage');
      } catch (error) {
        console.error('Failed to save state to localStorage:', error);
      }
    }
  }, [numberOfTransfers, transfersData, activeTransferIndex, sharedVehicleInfo, isInitialized]);
  
  const handleTransferDataChange = useCallback((data: any, index: number) => {
    setTransfersData(prev => {
      // Ensure prev is an array
      const prevArray = Array.isArray(prev) ? prev : Array(5).fill({});
      const newTransfersData = [...prevArray];
      
      // Make sure index is within bounds
      if (index < 0 || index >= newTransfersData.length) {
        console.error(`Invalid index: ${index}. Using index 0 instead.`);
        index = 0;
      }
      
      // Initialize the index if it's undefined
      if (!newTransfersData[index]) {
        newTransfersData[index] = {};
      }
      
      if (data._syncVehicleInfo) {
        setSharedVehicleInfo(current => ({
          ...current,
          ...data._syncVehicleInfo
        }));
        
        const { _syncVehicleInfo, ...restData } = data;
        
        const processedData = prepareTransferDataStructure(restData);
        newTransfersData[index] = {
          ...newTransfersData[index],
          ...processedData
        };
      } else {
        const processedData = prepareTransferDataStructure(data);
        newTransfersData[index] = {
          ...newTransfersData[index],
          ...processedData
        };
      }
      
      if (onDataChange) {
        setTimeout(() => {
          onDataChange({
            numberOfTransfers,
            transfersData: newTransfersData
          });
        }, 0);
      }
      
      return newTransfersData;
    });
  }, [numberOfTransfers, onDataChange]);
  
  const prepareTransferDataStructure = (data: any): TransferData => {
    const result = { ...data };
    
    if (result.newOwners && Array.isArray(result.newOwners.owners)) {
      result.owners = result.newOwners.owners;
    } else if (!result.owners) {
      result.owners = [];
    }
    
    if (result.address && result.address.address) {
      result.address = result.address.address;
    }
    
    if (result.sellerAddress && result.sellerAddress.sellerAddress) {
      result.sellerAddress = result.sellerAddress.sellerAddress;
    }
    
    result.sellerMailingAddressDifferent = 
      result.sellerMailingAddressDifferent !== undefined ? 
      Boolean(result.sellerMailingAddressDifferent) : false;
      
    result.mailingAddressDifferent = 
      result.mailingAddressDifferent !== undefined ? 
      Boolean(result.mailingAddressDifferent) : false;
      
    return result;
  };

  const handleNumberOfTransfersChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setNumberOfTransfers(newValue);
    
    if (activeTransferIndex >= newValue) {
      setActiveTransferIndex(newValue - 1);
    }
    
    if (onDataChange) {
      setTimeout(() => {
        onDataChange({
          numberOfTransfers: newValue,
          transfersData
        });
      }, 0);
    }
  }, [transfersData, onDataChange, activeTransferIndex]);

  const handleTransferTabClick = (index: number) => {
    setActiveTransferIndex(index);
  };
  
  const validateAllTransfers = useCallback(() => {
    const allErrors: any[] = [];
    let isValid = true;
    
    // Validate each transfer
    for (let i = 0; i < numberOfTransfers; i++) {
      const transferData = transfersData[i] || {};
      const { isValid: transferValid, errors } = validateTransfer(transferData, i);
      
      if (!transferValid) {
        isValid = false;
        allErrors.push(...errors);
      }
    }
    
    // Set validation errors in context
    console.log('Setting validation errors:', allErrors);
    setValidationErrors(allErrors);
    
    // Always show validation errors when validation is performed
    setShowValidationErrors(true);
    
    return isValid;
  }, [numberOfTransfers, transfersData, setValidationErrors, setShowValidationErrors]);
  
  
  const safeTransfersData = Array.isArray(transfersData) ? transfersData : Array(5).fill({});
  
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

// Replace your existing getTransfersWithErrors function with this complete version:

const getTransfersWithErrors = () => {
  if (!showValidationErrors || !validationErrors || validationErrors.length === 0) {
    return [];
  }
  
  const transfersWithErrors = new Map<number, { 
    count: number, 
    errors: Array<{ message: string, fieldPath: string }> 
  }>();
  
  validationErrors.forEach(error => {
    const match = error.fieldPath.match(/^transfer(\d+)_/);
    if (match) {
      const transferIndex = parseInt(match[1], 10);
      const current = transfersWithErrors.get(transferIndex) || { count: 0, errors: [] };
      
      current.count += 1;
      current.errors.push({
        message: error.message,
        fieldPath: error.fieldPath.replace(`transfer${transferIndex}_`, '')
      });
      
      transfersWithErrors.set(transferIndex, current);
    }
  });
  
  return Array.from(transfersWithErrors.entries()).map(([index, data]) => ({
    index,
    errorCount: data.count,
    errors: data.errors
  }));
};

// Then, update the transfersWithErrors constant and its type:
const transfersWithErrors: Array<{
  index: number;
  errorCount: number;
  errors: Array<{ message: string, fieldPath: string }>;
}> = getTransfersWithErrors();

  return (
    <div className="multiple-transfer-wrapper">
      <div className="header-section">
        <div className="top-controls">
          <h2>Multiple Transfer</h2>
          <div className="transfer-count-selector">
            <label htmlFor="transferCount">Number of Transfers:</label>
            <select 
              id="transferCount" 
              value={numberOfTransfers}
              onChange={handleNumberOfTransfersChange}
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="transfer-tabs">
          {Array.from({ length: numberOfTransfers }).map((_, index) => {
            const hasErrors = transfersWithErrors.some(t => t.index === index);
            return (
              <button
                key={`tab-${index}`}
                className={`transfer-tab ${activeTransferIndex === index ? 'active' : ''} ${hasErrors && showValidationErrors ? 'has-errors' : ''}`}
                onClick={() => handleTransferTabClick(index)}
                style={hasErrors && showValidationErrors ? { borderColor: 'red' } : {}}
              >
                Transfer {index + 1}
                {hasErrors && showValidationErrors && (
                  <span className="error-indicator" style={{ color: 'red', marginLeft: '5px' }}>⚠️</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      <TypeContainer />
      
      {showValidationErrors && transfersWithErrors.length > 0 && (
  <div className="global-validation-errors" style={{ 
    backgroundColor: '#fff0f0', 
    padding: '10px', 
    margin: '10px 0', 
    border: '1px solid #ff0000', 
    borderRadius: '4px' 
  }}>
    <h3>Please correct the following issues:</h3>
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {transfersWithErrors.map(({ index, errorCount, errors }) => (
        <li key={`transfer-error-${index}`} style={{ 
          color: '#cc0000', 
          marginBottom: '10px',
          padding: '5px',
          borderBottom: index !== transfersWithErrors[transfersWithErrors.length - 1].index ? '1px solid #ffcccc' : 'none'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => toggleErrorDropdown(index)}>
                Transfer {index + 1} has {errorCount} validation {errorCount === 1 ? 'issue' : 'issues'} 
                <span style={{ marginLeft: '5px' }}>
                  {openErrorDropdowns[index] ? '▼' : '►'}
                </span>
              </span>
            </div>
            <div>
              {index !== activeTransferIndex && (
                <button 
                  style={{ 
                    marginLeft: '10px', 
                    cursor: 'pointer',
                    padding: '5px 10px',
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '3px' 
                  }} 
                  onClick={() => setActiveTransferIndex(index)}
                >
                  View
                </button>
              )}
            </div>
          </div>
          
          {openErrorDropdowns[index] && (
            <div className="error-details" style={{ 
              marginTop: '8px', 
              marginLeft: '20px',
              padding: '8px',
              backgroundColor: 'white',
              border: '1px solid #ffcccc',
              borderRadius: '4px'
            }}>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {errors.map((error:any, errorIdx: any) => (
                  <li key={`detail-${index}-${errorIdx}`} style={{ margin: '5px 0' }}>
                    {error.message} ({error.fieldPath})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
)}
      
      {Array.from({ length: numberOfTransfers }).map((_, index) => (
        <FormDataProvider key={`transfer-${index}`}>
          <TransferForm
            index={index}
            totalTransfers={numberOfTransfers}
            formData={safeTransfersData[index] || {}}
            onDataChange={handleTransferDataChange}
            isActive={activeTransferIndex === index}
            sharedVehicleInfo={sharedVehicleInfo}
          />
        </FormDataProvider>
      ))}
      
      <div className="save-button-container">
        <MultiSaveButton 
          transfersData={safeTransfersData.slice(0, numberOfTransfers)}
          numberOfTransfers={numberOfTransfers}
          validateAllTransfers={validateAllTransfers}
        />
      </div>
    </div>
  );
};

export default MultipleTransferWithContext;