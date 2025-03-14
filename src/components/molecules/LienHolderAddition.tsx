'use client';
import Address from '../atoms/Address';
import NewRegisteredOwners from '../atoms/NewRegisteredOwner';
import NewLien from '../atoms/NewLienHolder';
import VehicalInformation from '../atoms/VehicleInformation';
import Seller from '../atoms/Seller';
import SaveButton from '../atoms/savebutton';
import { FormDataProvider, useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ScenarioProvider } from '../../context/ScenarioContext';
import './Simpletransfer.css';
import TypeContainer from '../layouts/TransactionsContainer';
import MissingTitle from '../atoms/MissingTitle';
import React, { useEffect, useState } from 'react';
import LegalOwnerOfRecord from '../atoms/LegalOwnerOfRecord';
import VehicleTransactionDetails from '../atoms/Checkboxes';
import PowerOfAttorney from '../atoms/PowerOfAttorney';
import SellerAddress from '../atoms/SellerAdrress';
import TitleStatus from '../atoms/TitleStatus';

interface VehicleTransactionDetailsData {
  currentLienholder?: boolean;
  withTitle?: boolean;
}

interface FormContextData {
  vehicleTransactionDetails?: VehicleTransactionDetailsData;
  [key: string]: any;
}

interface LienHolderAdditionProps {
  formData?: any;
  onDataChange?: (data: any) => void;
}

export default function LienHolderAdditionTransfer({ formData, onDataChange }: LienHolderAdditionProps) {
  const [formValues, setFormValues] = useState(formData || {});
  
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData]);
  
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
      if (!contextFormData.vehicleTransactionDetails) {
        updateField('vehicleTransactionDetails', {});
      }
    }, []);

    const isCurrentLienholder = contextFormData?.vehicleTransactionDetails?.currentLienholder === true;
    const withTitle = contextFormData?.vehicleTransactionDetails?.withTitle === true;

    return (
      <div className='wholeForm'>
        <TypeContainer />
        
        {/* Add the new TitleStatus component */}
        <TitleStatus formData={formValues} />
        
        <VehicalInformation formData={formValues}/>
        <Seller formData={formValues} />
        <SellerAddress formData={formValues} />
        
        {/* Only show MissingTitle component when "Without Title" is selected */}
        {!withTitle && <MissingTitle formData={formValues} />}
        
        <NewLien formData={formValues} />
        <SaveButton 
          transactionType="Lien Holder Addition"
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