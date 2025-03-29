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
  pnoDetails?: {
    isBeforeRegExpires?: boolean;
    requestPnoCard?: boolean;
  };
  [key: string]: any;
}

interface FilingPNOProps {
  formData?: any;
  onDataChange?: (data: any) => void;
}

export default function FilingPNOTransfer({ formData, onDataChange }: FilingPNOProps) {
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
    

    const isPnoCardRequested = contextFormData?.pnoDetails?.requestPnoCard || false;

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
        <FilingPnoCheckboxes formData={formValues} />
        
        {/* Only render Seller and SellerAddress components if PNO card is requested */}
        {isPnoCardRequested && (
          <>
<Seller
        formData={{
          hideDateOfSale: true,
          hideDateOfBirth: true,
          limitOwnerCount: true

        }}
      />
            <SellerAddress formData={formValues} />
          </>
        )}
        
        <VehicleStorageLocation formData={formValues} />
        <PlannedNonoperation formData={formValues} />
        <SaveButton 
          transactionType="Filing PNO Transfer"
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