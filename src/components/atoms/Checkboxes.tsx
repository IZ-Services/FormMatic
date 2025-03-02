import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './Checkboxes.css';

interface VehicleTransactionDetailsData {
  withTitle?: boolean;
  currentLienholder?: boolean;
  isMotorcycle?: boolean;
  isGift?: boolean;
}

interface VehicleTransactionDetailsProps {
  formData?: {
    vehicleTransactionDetails?: VehicleTransactionDetailsData;
  };
}

const VehicleTransactionDetails: React.FC<VehicleTransactionDetailsProps> = ({ formData: propFormData }) => {
  const { formData: contextFormData, updateField } = useFormContext();
  
  const combinedFormData = {
    ...contextFormData,
    ...propFormData
  };
  
  const [transactionData, setTransactionData] = useState<VehicleTransactionDetailsData>({
    withTitle: false,
    currentLienholder: false,
    isMotorcycle: false,
    isGift: false
  });

  useEffect(() => {
    const mergedData: VehicleTransactionDetailsData = {
      withTitle: false,
      currentLienholder: false,
      isMotorcycle: false,
      isGift: false,
      ...combinedFormData?.vehicleTransactionDetails
    };
    setTransactionData(mergedData);
  }, [combinedFormData?.vehicleTransactionDetails]);

  const handleCheckboxChange = (field: keyof VehicleTransactionDetailsData) => {
    const newValue = !transactionData[field];
    
    const newData = { 
      ...transactionData,
      [field]: newValue
    };

    if (field === 'withTitle' && !newValue) {
      newData.currentLienholder = false;
    }

    console.log(`Changing ${field} to:`, newValue);
    console.log("New transaction data:", newData);

    setTransactionData(newData);
    
    updateField('vehicleTransactionDetails', newData);
  };

  return (
    <div className="releaseWrapper">
      <div className="headerRow">
        <h3 className="releaseHeading">Vehicle Transaction Details</h3>
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
            />
            Vehicle is a Gift
            {transactionData.isGift && (
              <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem', color: '#666' }}>
                (Gift details will appear in Owner Information)
              </span>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};

export default VehicleTransactionDetails;