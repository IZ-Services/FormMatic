'use client';
import Seller from '../atoms/Seller';
import SaveButton from '../atoms/savebutton';
import { FormDataProvider, useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ScenarioProvider } from '../../context/ScenarioContext';
import './Simpletransfer.css';
import TypeContainer from '../layouts/TransactionsContainer';
import React, { useEffect, useState } from 'react';
import SellerAddress from '../atoms/SellerAdrress';
import LicensePlate from '../atoms/LicensePlate';
import VehicleInformation from '../atoms/VehicleInformation';
import ItemRequested from '../atoms/ItemRequested';
import TitleField from '../atoms/TitleCompany';

interface VehicleTransactionDetailsData {
  currentLienholder?: boolean;
  isMotorcycle?: boolean;
}

interface FormContextData {
  vehicleTransactionDetails?: VehicleTransactionDetailsData;
  vehicleInformation?: any;
  [key: string]: any;
}

interface DuplicatePlatesAndStickersTransferProps {
  formData?: any;
  onDataChange?: (data: any) => void;
}

export default function DuplicatePlatesAndStickersTransfer({ formData, onDataChange }: DuplicatePlatesAndStickersTransferProps) {
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
      setTransactionType("Duplicate Plates & Stickers");
    }, [setTransactionType]);

    useEffect(() => {
      if (formValues) {
        Object.entries(formValues).forEach(([key, value]) => {
          updateField(key, value);
        });
      }
    }, [formValues, updateField]);

 
    const vehicleTransactionDetails = (contextFormData?.vehicleTransactionDetails || {}) as VehicleTransactionDetailsData;
    
    const isCurrentLienholder = vehicleTransactionDetails.currentLienholder === true;
    
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
 
        interface VehicleInfo {
          engineNumber?: string;
          [key: string]: any;
        }
        
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
        
        {/* Motorcycle checkbox */}
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
        <Seller
          formData={{
            hideDateOfSale: true,
            hideDateOfBirth: true,
            limitOwnerCount: true
          }}
        />
        <TitleField formData={formValues} />

        <SellerAddress formData={formValues} />

        <ItemRequested formData={formValues}/>

        <LicensePlate formData={formValues} />
        
        <SaveButton 
          transactionType="Duplicate Plates & Stickers"
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