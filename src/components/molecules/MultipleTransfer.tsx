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
}

// Storage key constant for localStorage
const STORAGE_KEY = 'multipleTransferState';

export const clearmultipleStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    console.log('multiple address data cleared from localStorage');
  }
};

// Helper function to save state to localStorage
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

// Helper function to load state from localStorage
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

const MultiSaveButton: React.FC<MultiSaveButtonProps> = ({ transfersData, numberOfTransfers }) => {
  const consolidatedData = {
    numberOfTransfers,
    transfersData,
    isMultipleTransfer: true
  };
  
  // Add handler to clear storage on successful save
  const handleSaveSuccess = () => {
    console.log('Multiple transfer save completed successfully');
    // Optional: Clear the saved state from localStorage after successful save
    // localStorage.removeItem(STORAGE_KEY);
  };
  
  return (
    <SaveButton 
      transactionType="Multiple Transfer"
      onSuccess={handleSaveSuccess}
      multipleTransferData={consolidatedData}
    />
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
  const { formData: contextFormData, updateField } = useFormContext() as { 
    formData: Record<string, any>; 
    updateField: (key: string, value: any) => void;
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
    <div className="transfer-form-container">
      <VehicleTransactionDetails 
        formData={componentFormData}
        onChange={(data: VehicleTransactionDetailsData) => {
          if (data) {
            handleFieldChange('vehicleTransactionDetails', data);
            updateField(`transfer${index}_vehicleTransactionDetails`, data);
          }
        }} 
      />
      
      <VehicalInformation 
        formData={componentFormData}
        onChange={handleVehicleInfoChange}
      />
      
      <Seller 
        formData={componentFormData}
        onChange={(data: SellerInfo) => {
          handleFieldChange('seller', data);
        }}
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
      />
      
      {isCurrentLienholderChecked && (
        <LegalOwnerOfRecord 
          formData={componentFormData}
          onChange={(data: LegalOwnerType) => {
            handleFieldChange('legalOwner', data);
          }}
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
      />
      
      <NewLien 
        formData={componentFormData}
        onChange={(data: LienHolder) => {
          handleFieldChange('newLien', data);
        }}
      />
      
      <PowerOfAttorney 
        formData={componentFormData}
        onChange={(data: PowerOfAttorneyData) => {
          handleFieldChange('powerOfAttorney', data);
        }}
      />
    </div>
  );
};

const MultipleTransfer: React.FC<MultipleTransferProps> = ({ formData, onDataChange }) => {
  // Initialize states with default values
  const [numberOfTransfers, setNumberOfTransfers] = useState<number>(1);
  const [transfersData, setTransfersData] = useState<TransferData[]>(Array(5).fill({}));
  const [activeTransferIndex, setActiveTransferIndex] = useState<number>(0);
  const [sharedVehicleInfo, setSharedVehicleInfo] = useState<VehicleInformationType>({});
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
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

  // Make sure transfersData is an array before using it
  const safeTransfersData = Array.isArray(transfersData) ? transfersData : Array(5).fill({});
  
  // Early return if component is still initializing
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <FormDataProvider>
      <ScenarioProvider>
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
              {Array.from({ length: numberOfTransfers }).map((_, index) => (
                <button
                  key={`tab-${index}`}
                  className={`transfer-tab ${activeTransferIndex === index ? 'active' : ''}`}
                  onClick={() => handleTransferTabClick(index)}
                >
                  Transfer {index + 1}
                </button>
              ))}
            </div>
          </div>
          
          <TypeContainer />
          
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
            />
          </div>
        </div>
      </ScenarioProvider>
    </FormDataProvider>
  );
};

export default MultipleTransfer;