'use client';
import SaveButton from '../atoms/savebutton';
import { FormDataProvider, useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ScenarioProvider } from '../../context/ScenarioContext';
import './Simpletransfer.css';
import TypeContainer from '../layouts/TransactionsContainer';
import React, { useEffect, useState } from 'react';
import SalvageCertificate from '../atoms/SalvageCertificate';
import LicensePlateDisposition from '../atoms/LicensePlateDispsition';
import NewRegisteredOwners from '../atoms/NewRegisteredOwner';
import VehicleInformation from '../atoms/VehicleInformation';
import Seller from '../atoms/Seller';
import SellerAddress from '../atoms/SellerAdrress';
import Address from '../atoms/Address';
import AgentName from '../atoms/AgentName';
interface VehicleTransactionDetailsData {
  currentLienholder?: boolean;
  isSmogExempt?: boolean;
  isOutOfStateTitle?: boolean;}

interface FormContextData {
  vehicleTransactionDetails?: VehicleTransactionDetailsData;
  [key: string]: any;
}

interface SalvageTransferProps {
  formData?: any;
  onDataChange?: (data: any) => void;
}

export default function SalvageTransfer({ formData, onDataChange }: SalvageTransferProps) {
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
        <SalvageCertificate formData={formValues} />
        <VehicleInformation 
        formData={{
          hideMileageFields: true
        }}
      />
                  <Seller formData= {formValues} />
      <AgentName formData={formValues} />
 <SellerAddress 
        hideMailingOption={true}
      />        
      {/* <NewRegisteredOwners   formData={{
          forceSingleOwner: true
        }}
      /> */}
        <LicensePlateDisposition formData={formValues} />
        <SaveButton 
          transactionType="Salvage Title Transfer"
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