'use client';
import Address from '../atoms/Address';
import VehicleInformation from '../atoms/VehicleInformation';
import SellerSection from '../atoms/Seller';
import SaveButton from '../atoms/savebutton';
import { FormDataProvider, useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ScenarioProvider } from '../../context/ScenarioContext';
import './Simpletransfer.css';
import TypeContainer from '../layouts/TransactionsContainer';
import React, { useEffect, useState } from 'react';
import SellerAddress from '../atoms/SellerAdrress';

interface VehicleTransactionDetailsData {
  currentLienholder?: boolean;
  isMotorcycle?: boolean;
}

interface FormContextData {
  vehicleTransactionDetails?: VehicleTransactionDetailsData;
  vehicleInformation?: any;
  [key: string]: any;
}

interface DuplicateRegistrationTransferProps {
  formData?: any;
}

export default function DuplicateRegistrationTransfer({ formData }: DuplicateRegistrationTransferProps) {
  const [formValues, setFormValues] = useState(formData || {});

  useEffect(() => {
    setFormValues(formData);
  }, [formData]);

  const FormContent = () => {
    const { formData: contextFormData, updateField } = useFormContext() as { 
      formData: FormContextData;
      updateField: (key: string, value: any) => void;
    };

    useEffect(() => {
      if (formValues) {
        Object.entries(formValues).forEach(([key, value]) => {
          updateField(key, value);
        });
      }
    }, [formValues]);

    const [isMotorcycle, setIsMotorcycle] = useState<boolean>(
      contextFormData?.vehicleTransactionDetails?.isMotorcycle || false
    );

    useEffect(() => {
      if (contextFormData?.vehicleTransactionDetails?.isMotorcycle !== undefined) {
        setIsMotorcycle(contextFormData.vehicleTransactionDetails.isMotorcycle);
      }
    }, [contextFormData?.vehicleTransactionDetails?.isMotorcycle]);

    const handleMotorcycleChange = () => {
      const newValue = !isMotorcycle;
      setIsMotorcycle(newValue);
      
 
      const currentDetails = contextFormData?.vehicleTransactionDetails || {};
      updateField('vehicleTransactionDetails', {
        ...currentDetails,
        isMotorcycle: newValue
      });
      
 
      if (!newValue) {
        const currentVehicleInfo = contextFormData.vehicleInformation || {};
        if (currentVehicleInfo.engineNumber) {
          updateField('vehicleInformation', {
            ...currentVehicleInfo,
            engineNumber: ''
          });
        }
      }
    };

    return (
      <div className='wholeForm'>
        <TypeContainer />
        
        {/* Motorcycle checkbox directly in the component */}
        <div className="releaseWrapper">
          <div className="headerRow">
          <h3 className="releaseHeading">Transaction Details</h3>
          </div>

          <div className="checkbox-cont">
            <div className="checkbox-section">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isMotorcycle}
                  onChange={handleMotorcycleChange}
                />
                Is the vehicle a Motorcycle
              </label>
            </div>
          </div>
        </div>

        <VehicleInformation 
          formData={formValues}
          isDuplicateRegistrationMode={true}
        />
        
        <SellerSection 
        formData={{
          hideDateOfSale: true,
          hideDateOfBirth: true,
          limitOwnerCount: true

        }}
      />
        <SellerAddress formData={formValues} />
        
        <SaveButton 
          transactionType="Duplicate Registration Transfer"
          onSuccess={() => console.log('Save completed successfully')}
        />
      </div>
    );
  };

  return (
    <FormDataProvider>
      <ScenarioProvider>
        <div className="simpleTransferWrapper">
          <FormContent />
        </div>
      </ScenarioProvider>
    </FormDataProvider>
  );
}