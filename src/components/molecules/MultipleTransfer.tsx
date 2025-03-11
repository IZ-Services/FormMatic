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

const MultiSaveButton: React.FC<MultiSaveButtonProps> = ({ transfersData, numberOfTransfers }) => {
  const consolidatedData = {
    numberOfTransfers,
    transfersData,
    isMultipleTransfer: true
  };
  
  return (
    <SaveButton 
      transactionType="Multiple Transfer"
      onSuccess={() => console.log('Multiple transfer save completed successfully')}
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
        if (updatedValues[key] !== value) {
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

  // Effect to sync vehicle info when shared data changes
  useEffect(() => {
    if (sharedVehicleInfo && Object.keys(sharedVehicleInfo).length > 0) {
      const currentVehicleInfo = localFormValues.vehicleInformation || {};
      const updatedVehicleInfo = {
        ...currentVehicleInfo,
        ...sharedVehicleInfo
      };
      
      // Only update if there are actual changes
      if (JSON.stringify(currentVehicleInfo) !== JSON.stringify(updatedVehicleInfo)) {
        handleFieldChange('vehicleInformation', updatedVehicleInfo);
        
        // Also update in the context
        updateField(`transfer${index}_vehicleInformation`, updatedVehicleInfo);
      }
    }
  }, [sharedVehicleInfo]);
  
  const handleFieldChange = useCallback((key: string, value: any) => {
    setLocalFormValues(prev => {
      const updated = { ...prev, [key]: value };
      
      setTimeout(() => {
        onDataChange(updated, index);
      }, 0);
      
      return updated;
    });
  }, [onDataChange, index]);

  // Special handler for vehicle information to sync the specified fields
  const handleVehicleInfoChange = useCallback((data: VehicleInformationType) => {
    // Extract the fields that need to be synced
    const syncedFields: VehicleInformationType = {};
    
    // Only include fields that are actually present and have changed
    if (data.hullId !== undefined) syncedFields.hullId = data.hullId;
    if (data.make !== undefined) syncedFields.make = data.make;
    if (data.year !== undefined) syncedFields.year = data.year;
    
    // Update local data with ALL vehicle info fields
    handleFieldChange('vehicleInformation', data);
    
    // Also update in the context
    updateField(`transfer${index}_vehicleInformation`, data);
    
    // Signal to parent component that these fields should be synced across all transfers
    if (Object.keys(syncedFields).length > 0) {
      setTimeout(() => {
        onDataChange({
          _syncVehicleInfo: syncedFields
        }, index);
      }, 0);
    }
  }, [handleFieldChange, onDataChange, index, updateField]);
  
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
        onChange={handleVehicleInfoChange} // Use our special handler
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
          if (sellerAddress) handleFieldChange('sellerAddress', sellerAddress);
          if (sellerMailingAddress) handleFieldChange('sellerMailingAddress', sellerMailingAddress);     
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
        }}
      />
      
      <Address 
        formData={componentFormData}
        onChange={(data: FormData) => {
          handleFieldChange('address', data);
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
  const [numberOfTransfers, setNumberOfTransfers] = useState<number>(1);
  const [transfersData, setTransfersData] = useState<TransferData[]>(Array(5).fill({}));
  const [activeTransferIndex, setActiveTransferIndex] = useState<number>(0);
  // Add new state for shared vehicle information
  const [sharedVehicleInfo, setSharedVehicleInfo] = useState<VehicleInformationType>({});
  
  useEffect(() => {
    if (formData) {
      if (formData.transfersData) {
        setTransfersData(formData.transfersData);
        
        // Extract initial vehicle info from first transfer if available
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
  }, [formData]);

  const handleTransferDataChange = useCallback((data: any, index: number) => {
    setTransfersData(prev => {
      const newTransfersData = [...prev];
      
      // Check if this update contains vehicle info that needs to be synced
      if (data._syncVehicleInfo) {
        // Update the shared vehicle info
        setSharedVehicleInfo(current => ({
          ...current,
          ...data._syncVehicleInfo
        }));
        
        // Remove the sync flag before saving to the actual data
        const { _syncVehicleInfo, ...restData } = data;
        
        newTransfersData[index] = {
          ...newTransfersData[index],
          ...restData
        };
      } else {
        // Regular update without syncing
        newTransfersData[index] = {
          ...newTransfersData[index],
          ...data
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
                formData={transfersData[index] || {}}
                onDataChange={handleTransferDataChange}
                isActive={activeTransferIndex === index}
                sharedVehicleInfo={sharedVehicleInfo}
              />
            </FormDataProvider>
          ))}
          
          <div className="save-button-container">
            <MultiSaveButton 
              transfersData={transfersData.slice(0, numberOfTransfers)}
              numberOfTransfers={numberOfTransfers}
            />
          </div>
        </div>
      </ScenarioProvider>
    </FormDataProvider>
  );
};

export default MultipleTransfer;