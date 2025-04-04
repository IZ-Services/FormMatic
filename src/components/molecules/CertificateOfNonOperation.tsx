'use client';
import VehicalInformation from '../atoms/VehicleInformation';
import Seller from '../atoms/Seller';
import SaveButton from '../atoms/savebutton';
import { FormDataProvider, useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ScenarioProvider } from '../../context/ScenarioContext';
import './Simpletransfer.css';
import TypeContainer from '../layouts/TransactionsContainer';
import React, { useEffect, useState } from 'react';
import PlannedNonoperation from '../atoms/PlannedNonoperation';
import FilingPnoCheckboxes from '../atoms/FilingPnoCheckboxes';
import SellerAddress from '../atoms/SellerAdrress';
import VehicleStorageLocation from '../atoms/VehicleStorageLocation';

interface VehicleTransactionDetailsData {
  currentLienholder?: boolean;
}

interface FormContextData {
  vehicleTransactionDetails?: VehicleTransactionDetailsData;
  [key: string]: any;
}

interface CertificateOfNonOperationProps {
  formData?: any;
  onDataChange?: (data: any) => void;

}

export default function CertificateOfNonOperationTransfer({ formData, onDataChange }:CertificateOfNonOperationProps) {
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
        {/* <FilingPnoCheckboxes formData={formValues} /> */}
        {/* <VehicalInformation formData={formValues}/> */}
        {/* <Seller formData={formValues} /> */}
        {/* <SellerAddress formData={formValues} /> */}
        <VehicleStorageLocation formData={formValues} />
        <PlannedNonoperation formData={formValues} />
        <SaveButton 
          transactionType="Certificate Of Non-Operation Transfer"
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