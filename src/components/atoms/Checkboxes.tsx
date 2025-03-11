import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './Checkboxes.css';

interface VehicleTransactionDetailsData {
  withTitle?: boolean;
  currentLienholder?: boolean;
  isMotorcycle?: boolean;
  isGift?: boolean;
  isFamilyTransfer?: boolean;
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
  owners?: OwnerData[];
}

interface VehicleTransactionDetailsProps {
  formData?: FormDataType;
  onChange?: (data: VehicleTransactionDetailsData) => void;
}

const VehicleTransactionDetails: React.FC<VehicleTransactionDetailsProps> = ({ 
  formData: propFormData,
  onChange 
}) => {
  const { formData: contextFormData, updateField } = useFormContext();
  
  const combinedFormData: FormDataType = {
    ...contextFormData,
    ...propFormData
  };
  
  const [transactionData, setTransactionData] = useState<VehicleTransactionDetailsData>({
    withTitle: false,
    currentLienholder: false,
    isMotorcycle: false,
    isGift: false,
    isFamilyTransfer: false
  });

  useEffect(() => {
    const mergedData: VehicleTransactionDetailsData = {
      withTitle: false,
      currentLienholder: false,
      isMotorcycle: false,
      isGift: false,
      isFamilyTransfer: false,
      ...combinedFormData?.vehicleTransactionDetails
    };
    setTransactionData(mergedData);
  }, [combinedFormData?.vehicleTransactionDetails]);

  const handleCheckboxChange = (field: keyof VehicleTransactionDetailsData) => {
    const newValue = !transactionData[field];
    
    const newData = { 
      ...transactionData,
      [field]: newValue
    };     if (field === 'withTitle' && !newValue) {
      newData.currentLienholder = false;
    }     if (field === 'isGift' && newValue) {
      newData.isFamilyTransfer = false;
    }     if (field === 'isFamilyTransfer' && newValue) {
      newData.isGift = false;
    }     if (field === 'currentLienholder' && !newValue) {
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
    }     if (field === 'isMotorcycle' && !newValue) {
      const currentVehicleInfo = combinedFormData.vehicleInformation || {};
      if (currentVehicleInfo.engineNumber) {
        updateField('vehicleInformation', {
          ...currentVehicleInfo,
          engineNumber: ''
        });
      }
    }     if (field === 'isGift' && !newValue) {
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

    console.log(`Changing ${field} to:`, newValue);
    console.log("New transaction data:", newData);

    setTransactionData(newData);
    updateField('vehicleTransactionDetails', newData);
    
    if (onChange) {
      onChange(newData);
    }
  };

  return (
    <div className="releaseWrapper">
      <div className="headerRow">
        <h3 className="releaseHeading">Transaction Details</h3>
      </div>

      <div className="checkbox-container">
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
              checked={transactionData.currentLienholder || false}
              onChange={() => handleCheckboxChange('currentLienholder')}
              disabled={!transactionData.withTitle}
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
      </div>
    </div>
  );
};

export default VehicleTransactionDetails;