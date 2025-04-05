'use client';
import VehicalInformation from '../atoms/VehicleInformation';
import Seller from '../atoms/Seller';
import SaveButton from '../atoms/savebutton';
import { FormDataProvider, useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './Simpletransfer.css';
import TypeContainer from '../layouts/TransactionsContainer';
import React, { useEffect, useState } from 'react';
import NameStatement from '../atoms/NameStatement';
interface VehicleTransactionDetailsData {
  currentLienholder?: boolean;
  isSmogExempt?: boolean;
}

interface FormContextData {
  vehicleTransactionDetails?: VehicleTransactionDetailsData;
  [key: string]: any;
}

interface NameChangeTransferProps {
  formData?: any;
  onDataChange?: (data: any) => void;
}

export default function NameChangeTransfer({ formData, onDataChange }: NameChangeTransferProps) {
  const [formValues, setFormValues] = useState(formData || {});
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);     }
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


    return (
      <div className='wholeForm'>
        <TypeContainer />
        {/* <TitleStatus formData={formValues}/> */}

        <VehicalInformation 
        formData={{
          hideMileageFields: true
        }}
      />            <NameStatement formData={formValues} />

        <Seller 
        formData={{
          hideDateOfSale: true,
          hideDateOfBirth: true,
          forceSingleOwner: true
        }}
      />
        {/* <SellerAddress formData={formValues} /> */}
        <SaveButton 
          transactionType="Name Change/Correction Transfer"
          onSuccess={() => console.log('Save completed successfully')}
        />
      </div>
    );
  };

  return (
    <FormDataProvider>
      {/* <ScenarioProvider> */}
        <div className="simpleTransferWrapper">
          <FormContent />
        </div>
      {/* </ScenarioProvider> */}
    </FormDataProvider>
  );
}