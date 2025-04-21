'use client';

import SaveButton from '../atoms/savebutton';
import { FormDataProvider, useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ScenarioProvider } from '../../context/ScenarioContext';
import './Simpletransfer.css';
import TypeContainer from '../layouts/TransactionsContainer';
import React, { useEffect, useState } from 'react';
import SalvageCertificate from '../atoms/SalvageCertificate';
import LicensePlateDisposition from '../atoms/LicensePlateDispsition';
import Seller from '../atoms/Seller';
import VehicleInformation from '../atoms/VehicleInformation';
import Address from '../atoms/Address';
import StatementOfFacts from '../atoms/StatementOfFacts';
import NewRegisteredOwners from '../atoms/NewRegisteredOwner';

interface VehicleTransactionDetailsData {
  currentLienholder?: boolean;
  isSmogExempt?: boolean;
  isOutOfStateTitle?: boolean;
}

interface FormContextData {
  vehicleTransactionDetails?: VehicleTransactionDetailsData;
  [key: string]: any;
}

interface RestoringPNOTransferProps {
  formData?: any;
  onDataChange?: (data: any) => void;
}

export default function RestoringPNOTransfer({ formData, onDataChange }: RestoringPNOTransferProps) {
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
      setTransactionType("Restoring PNO Transfer");
    }, [setTransactionType]);

    useEffect(() => {
      if (formValues) {
        Object.entries(formValues).forEach(([key, value]) => {
          updateField(key, value);
        });
      }
    }, [formValues, updateField]);

 
    const vehicleTransactionDetails = (contextFormData?.vehicleTransactionDetails || {}) as VehicleTransactionDetailsData;

    const modifiedFormData = {
      ...formValues,
      isPNORestoration: true
    };

    console.log("Passing isPNORestoration flag to NewRegisteredOwners:", modifiedFormData.isPNORestoration);

    return (
      <div className='wholeForm'>
        <TypeContainer />
        <VehicleInformation formData={{
          hideMileageFields: true,
        }}/>
        <NewRegisteredOwners formData={{modifiedFormData, forceSingleOwner: true, hideLicenseField: true, hideStateField: true, hidePurchaseValueField: true}} />
        {/* <StatementOfFacts formData={formValues} /> */}
        <SaveButton
          transactionType="Restoring PNO Transfer"
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