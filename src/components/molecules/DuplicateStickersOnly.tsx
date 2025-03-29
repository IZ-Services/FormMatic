'use client';
import Seller from '../atoms/Seller';
import SaveButton from '../atoms/savebutton';
import { FormDataProvider, useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ScenarioProvider, useScenarioContext } from '../../context/ScenarioContext';
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

interface DuplicateStickersTransferProps {
  formData?: any;
}

export default function DuplicateStickersTransfer({ formData }: DuplicateStickersTransferProps) {
  const [formValues, setFormValues] = useState(formData || {});
  const { activeSubOptions } = useScenarioContext(); 

  useEffect(() => {
    setFormValues(formData);
  }, [formData]);

  const FormContent = () => {
    const { formData: contextFormData } = useFormContext() as { formData: FormContextData };
    const { updateField } = useFormContext();

    useEffect(() => {
      if (formValues) {
        Object.entries(formValues).forEach(([key, value]) => {
          updateField(key, value);
        });
      }
    }, [formValues]);

    useEffect(() => {
      if (activeSubOptions) {
        updateField('duplicateStickers', {
          month: !!activeSubOptions['Duplicate Stickers-Month'],
          year: !!activeSubOptions['Duplicate Stickers-Year']
        });
      }
    }, [activeSubOptions, updateField]);

    const isCurrentLienholder = contextFormData?.vehicleTransactionDetails?.currentLienholder === true;
    
 
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
                <TitleField formData={formData} />
       
                <Seller
        formData={{
          hideDateOfSale: true,
          hideDateOfBirth: true ,
          limitOwnerCount: true

        }}
      />
        <SellerAddress formData={formValues} />
        <ItemRequested formData={formValues}/>

        <LicensePlate formData={formData} />
        
        <SaveButton 
          transactionType="Duplicate Stickers"
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