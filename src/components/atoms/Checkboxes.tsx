import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './Checkboxes.css';

interface VehicleTransactionDetailsData {
  withTitle?: boolean;
  currentLienholder?: boolean;
  isMotorcycle?: boolean;
  isGift?: boolean;
  isFamilyTransfer?: boolean;
  isSmogExempt?: boolean;
  isOutOfStateTitle?: boolean;
}

interface VehicleTypeData {
  isAuto?: boolean;
  isMotorcycle?: boolean;
  isOffHighway?: boolean;
  isTrailerCoach?: boolean;
}

interface OwnerData {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  licenseNumber?: string;
  state?: string;
  phoneCode?: string;
  phoneNumber?: string;
  purchaseDate?: string;
  purchaseValue?: string;
  marketValue?: string;
  isGift?: boolean;
  isTrade?: boolean;
  relationshipWithGifter?: string;
  giftValue?: string;
  relationshipType?: 'AND' | 'OR';
}

interface VehicleInformationType {
  licensePlate?: string;
  hullId?: string;
  engineNumber?: string;  
  year?: string;
  make?: string;
  odometerDiscrepancyExplanation?: string;
  mileage?: string;
  notActualMileage?: boolean;
  exceedsMechanicalLimit?: boolean;
  vehicleUnder10001lbs?: boolean;
  isMotorcycle?: boolean;
  gvwCode?: string;
  cgwCode?: string;
  operationDate?: string;
}

interface FormDataType {
  vehicleTransactionDetails?: VehicleTransactionDetailsData;
  vehicleInformation?: VehicleInformationType;
  vehicleType?: VehicleTypeData;
  owners?: OwnerData[];
}

interface VehicleTransactionDetailsProps {
  formData?: FormDataType;
  onChange?: (data: VehicleTransactionDetailsData) => void;
}

export const VEHICLE_TRANSACTION_STORAGE_KEY = 'formmatic_transaction_details';

 
export const clearVehicleTransactionDetailsStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(VEHICLE_TRANSACTION_STORAGE_KEY);
    console.log('Vehicle transaction details cleared from localStorage');
  }
};

const VehicleTransactionDetails: React.FC<VehicleTransactionDetailsProps> = ({ 
  formData: propFormData,
  onChange 
}) => {
  const { formData: contextFormData, updateField, clearFormTriggered } = useFormContext();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const combinedFormData: FormDataType = {
    ...contextFormData,
    ...propFormData
  };
  
  const defaultTransactionData: VehicleTransactionDetailsData = {
    withTitle: false,
    currentLienholder: false,
    isMotorcycle: false,
    isGift: false,
    isFamilyTransfer: false,
    isSmogExempt: false,
    isOutOfStateTitle: false
  };

  const [transactionData, setTransactionData] = useState<VehicleTransactionDetailsData>(defaultTransactionData);

 
  useEffect(() => {
    if (clearFormTriggered) {
      console.log('Clear form triggered in VehicleTransactionDetails component');
      clearPersistedTransactionDetails();
    }
  }, [clearFormTriggered]);

 
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const savedData = localStorage.getItem(VEHICLE_TRANSACTION_STORAGE_KEY);
        
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          
 
          const mergedData = {
            ...defaultTransactionData,
            ...parsedData,
            ...combinedFormData?.vehicleTransactionDetails
          };
          
          setTransactionData(mergedData);
          
 
          updateField('vehicleTransactionDetails', mergedData);
          
          if (onChange) {
            onChange(mergedData);
          }
        } else {
 
          const mergedData = {
            ...defaultTransactionData,
            ...combinedFormData?.vehicleTransactionDetails
          };
          setTransactionData(mergedData);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading saved transaction details:', error);
        setIsInitialized(true);
        
 
        const mergedData = {
          ...defaultTransactionData,
          ...combinedFormData?.vehicleTransactionDetails
        };
        setTransactionData(mergedData);
      }
    }
  }, []);

 
  useEffect(() => {
    if (isInitialized && combinedFormData?.vehicleTransactionDetails) {
      const mergedData: VehicleTransactionDetailsData = {
        ...transactionData,
        ...combinedFormData.vehicleTransactionDetails
      };
      setTransactionData(mergedData);
    }
  }, [isInitialized, combinedFormData?.vehicleTransactionDetails]);

 
  useEffect(() => {
    if (isInitialized && combinedFormData?.vehicleType?.isMotorcycle !== undefined) {
      if (combinedFormData.vehicleType.isMotorcycle !== transactionData.isMotorcycle) {
        console.log("Syncing motorcycle state from vehicle type:", combinedFormData.vehicleType.isMotorcycle);
        
        const newData = { 
          ...transactionData,
          isMotorcycle: combinedFormData.vehicleType.isMotorcycle 
        };
        
        setTransactionData(newData);
        updateField('vehicleTransactionDetails', newData);
        
 
        if (typeof window !== 'undefined') {
          localStorage.setItem(VEHICLE_TRANSACTION_STORAGE_KEY, JSON.stringify(newData));
        }
        
        if (onChange) {
          onChange(newData);
        }
      }
    }
  }, [isInitialized, combinedFormData?.vehicleType?.isMotorcycle]);

  const handleCheckboxChange = (field: keyof VehicleTransactionDetailsData) => {
    const newValue = !transactionData[field];
    
    const newData = { 
      ...transactionData,
      [field]: newValue
    };    
    
    if (field === 'isGift' && newValue) {
      newData.isFamilyTransfer = false;
    }     
    
    if (field === 'isFamilyTransfer' && newValue) {
      newData.isGift = false;
    }     
    
    if (field === 'currentLienholder' && !newValue) {
      updateField('legalOwnerInformation', {
        name: 'NONE',
        address: {
          street: '',
          apt: '',
          city: '',
          state: '',
          zip: ''
        },
        date: '',
        phoneNumber: '',
        authorizedAgentName: '',
        authorizedAgentTitle: ''
      });
    }     
    
    if (field === 'isMotorcycle' && !newValue) {
      const currentVehicleInfo = combinedFormData.vehicleInformation || {};
      if (currentVehicleInfo.engineNumber) {
        updateField('vehicleInformation', {
          ...currentVehicleInfo,
          engineNumber: ''
        });
      }
    }     
    
    if (field === 'isGift' && !newValue) {
      const currentOwners = combinedFormData.owners || [];
      if (currentOwners.length > 0) {
        const updatedOwners = currentOwners.map((owner: OwnerData) => ({
          ...owner,
          relationshipWithGifter: '',
          giftValue: ''
        }));
        updateField('owners', updatedOwners);
      }
    }
    
    if (field === 'isMotorcycle') {
      const currentVehicleType = combinedFormData.vehicleType || {};
      
      if (currentVehicleType.isMotorcycle !== newValue) {
        console.log(`Syncing motorcycle state to vehicle type: ${newValue}`);
        
        const newVehicleType = {
          ...currentVehicleType,
          isMotorcycle: newValue
        };
        
        if (newValue) {
          newVehicleType.isAuto = false;
          newVehicleType.isOffHighway = false;
          newVehicleType.isTrailerCoach = false;
        }
        
        updateField('vehicleType', newVehicleType);
      }
    }
    
    console.log(`Changing ${field} to:`, newValue);
    console.log("New transaction data:", newData);

    setTransactionData(newData);
    updateField('vehicleTransactionDetails', newData);
    
 
    if (typeof window !== 'undefined') {
      localStorage.setItem(VEHICLE_TRANSACTION_STORAGE_KEY, JSON.stringify(newData));
    }
    
    if (onChange) {
      onChange(newData);
    }
  };

 
  const clearPersistedTransactionDetails = () => {
    clearVehicleTransactionDetailsStorage();
    setTransactionData(defaultTransactionData);
    updateField('vehicleTransactionDetails', defaultTransactionData);
    
    if (onChange) {
      onChange(defaultTransactionData);
    }
  };

  return (
    <div className="releaseWrapper">
      <div className="headerRow">
        <h3 className="releaseHeading">Transaction Details</h3>
      </div>

      <div className="checkboxes">
        <div className="checkbox-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={transactionData.withTitle || false}
              onChange={() => handleCheckboxChange('withTitle')}
            />
            Transaction with Vehicle Title
          </label>
        </div>

        <div className="checkbox-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={transactionData.isOutOfStateTitle || false}
              onChange={() => handleCheckboxChange('isOutOfStateTitle')}
            />
            Out of State Title
          </label>
        </div>

        <div className="checkbox-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={transactionData.currentLienholder || false}
              onChange={() => handleCheckboxChange('currentLienholder')}
            />
            There is a Current Lienholder
          </label>
        </div>

        <div className="checkbox-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={transactionData.isMotorcycle || false}
              onChange={() => handleCheckboxChange('isMotorcycle')}
            />
            Is the vehicle a Motorcycle
          </label>
        </div>

        <div className="checkbox-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={transactionData.isGift || false}
              onChange={() => handleCheckboxChange('isGift')}
              disabled={transactionData.isFamilyTransfer}
            />
            Vehicle is a Gift
          </label>
        </div>

        <div className="checkbox-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={transactionData.isFamilyTransfer || false}
              onChange={() => handleCheckboxChange('isFamilyTransfer')}
              disabled={transactionData.isGift}
            />
            Family Transfer
          </label>
        </div>

        <div className="checkbox-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={transactionData.isSmogExempt || false}
              onChange={() => handleCheckboxChange('isSmogExempt')}
            />
            Smog Exemption
          </label>
        </div>
      </div>
    </div>
  );
};

export default VehicleTransactionDetails;