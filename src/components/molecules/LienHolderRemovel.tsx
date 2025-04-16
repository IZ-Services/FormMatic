'use client';
import VehicalInformation from '../atoms/VehicleInformation';
import Seller from '../atoms/Seller';
import SaveButton from '../atoms/savebutton';
import { FormDataProvider, useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ScenarioProvider } from '../../context/ScenarioContext';
import './Simpletransfer.css';
import TypeContainer from '../layouts/TransactionsContainer';
import MissingTitle from '../atoms/MissingTitle';
import React, { useEffect, useState } from 'react';
import TitleStatus from '../atoms/TitleStatus';
import ReleaseOfOwnership from '../atoms/ReleaseOfOwnership';
import SellerAddress from '../atoms/SellerAdrress';

interface VehicleTransactionDetailsData {
  currentLienholder?: boolean;
}

interface FormContextData {
  vehicleTransactionDetails?: VehicleTransactionDetailsData;
  [key: string]: any;
}

interface LienHolderRemovalProps {
  formData?: any;
  onDataChange?: (data: any) => void;
}

export default function LienHolderRemovalTransfer({ formData, onDataChange }: LienHolderRemovalProps) {
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
    const { formData: contextFormData, updateField, setTransactionType, showValidationErrors } = useFormContext();

 
    useEffect(() => {
      setTransactionType("Lien Holder Removal");
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

    return (
      <div className='wholeForm'>
        <TypeContainer />
        {/* <VehicleTransactionDetails formData={formValues} /> */}
        <TitleStatus formData={formValues}/>

        <VehicalInformation 
          formData={{
            hideMileageFields: true
          }}
        />
        <Seller 
          formData={{
            hideDateOfSale: true,
            hideDateOfBirth: true,
            limitOwnerCount: true
          }}
        />
        <SellerAddress formData={formValues} />
        <MissingTitle formData={formValues} />
        <ReleaseOfOwnership   formData={formValues} 
  showValidationErrors={showValidationErrors} />
        <SaveButton 
          transactionType="Lien Holder Removal"
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