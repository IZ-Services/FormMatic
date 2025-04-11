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
import TitleField from '../atoms/TitleCompany';

interface VehicleTransactionDetailsData {
  currentLienholder?: boolean;
  isMotorcycle?: boolean;
}

interface VehicleInfo {
  engineNumber?: string;
  [key: string]: any;
}

interface FormContextData {
  vehicleTransactionDetails?: VehicleTransactionDetailsData;
  vehicleInformation?: VehicleInfo;
  [key: string]: any;
}

interface DuplicateRegistrationTransferProps {
  formData?: any;
  onDataChange?: (data: any) => void;
}

export default function DuplicateRegistrationTransfer({ formData, onDataChange }: DuplicateRegistrationTransferProps) {
  const [formValues, setFormValues] = useState(formData || {});

  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  useEffect(() => {
    setFormValues(formData);
  }, [formData]);

  const FormContent = () => {
    const { formData: contextFormData, updateField, setTransactionType } = useFormContext();

 
    useEffect(() => {
      setTransactionType("Duplicate Registration Transfer");
    }, [setTransactionType]);

    useEffect(() => {
      if (formValues) {
        Object.entries(formValues).forEach(([key, value]) => {
          updateField(key, value);
        });
      }
    }, [formValues, updateField]);

 
    const vehicleTransactionDetails = (contextFormData?.vehicleTransactionDetails || {}) as VehicleTransactionDetailsData;
    
    const [isMotorcycle, setIsMotorcycle] = useState<boolean>(
      vehicleTransactionDetails.isMotorcycle || false
    );

    useEffect(() => {
      if (vehicleTransactionDetails.isMotorcycle !== undefined) {
        setIsMotorcycle(vehicleTransactionDetails.isMotorcycle);
      }
    }, [vehicleTransactionDetails.isMotorcycle]);

    const handleMotorcycleChange = () => {
      const newValue = !isMotorcycle;
      setIsMotorcycle(newValue);
      
      const currentDetails = contextFormData?.vehicleTransactionDetails || {};
      updateField('vehicleTransactionDetails', {
        ...currentDetails,
        isMotorcycle: newValue
      });
      
      if (!newValue) {
        const currentVehicleInfo = (contextFormData.vehicleInformation || {}) as VehicleInfo;
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
        <TitleField formData={formValues} />

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