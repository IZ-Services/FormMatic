import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './OutOfStateVehicles.css';
import CustomDropdown from './CustomDropdown';

interface OutOfStateVehiclesData {
  salesTaxPaid?: 'na' | 'yes' | 'no';
  taxAmount?: string;
  plateDisposition?: 'expired' | 'surrendered' | 'destroyed' | 'retained' | 'returned';
  plateDispositionText?: string;
}

interface FormDataType {
  outOfStateVehicles?: OutOfStateVehiclesData;
  [key: string]: any;
}

interface OutOfStateVehiclesProps {
  formData?: FormDataType;
  onChange?: (data: OutOfStateVehiclesData) => void;
}

const OutOfStateVehicles: React.FC<OutOfStateVehiclesProps> = ({
  formData: propFormData,
  onChange
}) => {
  const { formData: contextFormData, updateField } = useFormContext();

  const combinedFormData: FormDataType = {
    ...contextFormData,
    ...propFormData
  };

  const [stateData, setStateData] = useState<OutOfStateVehiclesData>({
    salesTaxPaid: undefined,
    taxAmount: '',
    plateDisposition: undefined,
    plateDispositionText: ''
  });

  useEffect(() => {
    const mergedData: OutOfStateVehiclesData = {
      salesTaxPaid: undefined,
      taxAmount: '',
      plateDisposition: undefined,
      plateDispositionText: '',
      ...combinedFormData?.outOfStateVehicles
    };
    setStateData(mergedData);
  }, [combinedFormData?.outOfStateVehicles]);

  const handleSalesTaxChange = (value: 'na' | 'yes' | 'no') => {
    const newData = {
      ...stateData,
      salesTaxPaid: value
    };    if (value !== 'yes') {
      newData.taxAmount = '';
    }
    
    setStateData(newData);
    updateField('outOfStateVehicles', newData);
    
    if (onChange) {
      onChange(newData);
    }
  };

  const handleTaxAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = {
      ...stateData,
      taxAmount: e.target.value
    };
    
    setStateData(newData);
    updateField('outOfStateVehicles', newData);
    
    if (onChange) {
      onChange(newData);
    }
  };

  const handlePlateDispositionChange = (value: 'expired' | 'surrendered' | 'destroyed' | 'retained' | 'returned', text: string) => {
    const newData = {
      ...stateData,
      plateDisposition: value,
      plateDispositionText: text
    };
    
    setStateData(newData);
    updateField('outOfStateVehicles', newData);
    
    if (onChange) {
      onChange(newData);
    }
  };

  return (
    <div className="outOfStateWrapper" style={{ position: 'relative', overflow: 'visible' }}>
      <div className="headerRow">
        <h3 className="sectionHeading">FOR OUT-OF-STATE OR OUT-OF-COUNTRY VEHICLES</h3>
      </div>

      <div className="taxSection">
        <p className="taxQuestion">
          For vehicles which enter the state within 1 year of purchase, was Sales Tax paid to another state?
        </p>
        
        <div className="taxOptions">
          <label className="radio-label">
            <input
              type="radio"
              name="salesTaxPaid"
              checked={stateData.salesTaxPaid === 'na'}
              onChange={() => handleSalesTaxChange('na')}
            />
            N/A
          </label>
          
          <label className="radio-label">
            <input
              type="radio"
              name="salesTaxPaid"
              checked={stateData.salesTaxPaid === 'yes'}
              onChange={() => handleSalesTaxChange('yes')}
            />
            Yes
          </label>
          
          <label className="radio-label">
            <input
              type="radio"
              name="salesTaxPaid"
              checked={stateData.salesTaxPaid === 'no'}
              onChange={() => handleSalesTaxChange('no')}
            />
            No
          </label>
        </div>
        
        {stateData.salesTaxPaid === 'yes' && (
          <div className="taxAmountSection">
            <label className="taxAmountLabel">
              If yes, enter amount of tax paid $
              <input
                type="text"
                className="taxAmountInput"
                value={stateData.taxAmount || ''}
                onChange={handleTaxAmountChange}
              />
            </label>
            <p className="taxNote">
              (this amount will be credited toward any Use Tax in CA). If your vehicle was last registered in another state, you may be eligible for a Use Tax exemption. For more information, contact the Board of Equalization (www.boe.ca.gov).
            </p>
          </div>
        )}
      </div>

      <div className="plateSection">
        <p className="plateTitle">DISPOSITION OF OUT-OF-STATE PLATES:</p>
        <p className="plateInfo">
          The plates will not be affixed to any vehicle at any time, unless the vehicle is "Dual Registered" in both states.
        </p>
        
        <div className="plateDropdownSection">
          <CustomDropdown
            label="Out of state plates were:"
            options={[
              'Expired, or will be or were',
              'Surrendered to CA DMV',
              'Destroyed',
              'Retained',
              'Returned to the motor vehicle department of the state of issuance'
            ]}
            selectedText={stateData.plateDispositionText || ''}
            onSelect={(value, text) => {              let disposition: 'expired' | 'surrendered' | 'destroyed' | 'retained' | 'returned';
              
              switch(text) {
                case 'Expired, or will be or were':
                  disposition = 'expired';
                  break;
                case 'Surrendered to CA DMV':
                  disposition = 'surrendered';
                  break;
                case 'Destroyed':
                  disposition = 'destroyed';
                  break;
                case 'Retained':
                  disposition = 'retained';
                  break;
                case 'Returned to the motor vehicle department of the state of issuance':
                  disposition = 'returned';
                  break;
                default:
                  disposition = 'expired';
              }
              
              handlePlateDispositionChange(disposition, text);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OutOfStateVehicles;