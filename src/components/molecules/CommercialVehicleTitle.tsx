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
import React, { useEffect, useState } from 'react';
import DateInformation from '../atoms/DateInformation'; 
import LegalOwnerOfRecord from '../atoms/LegalOwnerOfRecord';
import SmogExemption from '../atoms/SmogExemption';
import VehicleTransactionDetails from '../atoms/Checkboxes';
import VehicleType from '../atoms/VehicleTypeCheckboxes';
import PowerOfAttorney from '../atoms/PowerOfAttorney';
import SellerAddress from '../atoms/SellerAdrress';
import VehicleStatus from '../atoms/VehicleStatus';
import VehicleAcquisition from '../atoms/VehicleAcquisition';
import TypeOfVehicle from '../atoms/TypeOfVehicle';
import StatementOfFacts from '../atoms/StatementOfFacts';
import VehicleWeightInfo from '../atoms/VehicleWeightInfo';
interface VehicleTransactionDetailsData {
  currentLienholder?: boolean;
  isSmogExempt?: boolean;
  isOutOfStateTitle?: boolean;}

interface FormContextData {
  vehicleTransactionDetails?: VehicleTransactionDetailsData;
  [key: string]: any;
}

interface CommercialVehicleTransferProps {
  formData?: any;
  onDataChange?: (data: any) => void;
}

export default function CommercialVehicleTransfer({ formData, onDataChange }: CommercialVehicleTransferProps) {
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

    const isCurrentLienholder = contextFormData?.vehicleTransactionDetails?.currentLienholder === true;
    const isSmogExempt = contextFormData?.vehicleTransactionDetails?.isSmogExempt === true;
    const isOutOfStateTitle = contextFormData?.vehicleTransactionDetails?.isOutOfStateTitle === true;

    return (
      <div className='wholeForm'>
        <TypeContainer />
        <TypeOfVehicle formData={formValues} />

        <Seller formData={formValues} />
        <SellerAddress formData={formValues} />
        <VehicalInformation formData={formValues} />
        <VehicleWeightInfo formData={formValues} />
        <NewRegisteredOwners formData={formValues} />
        <Address formData={formValues} />
        <DateInformation formData={formValues} />
        <VehicleStatus formData={formValues} />
        <VehicleAcquisition formData={formValues} />
        <NewLien formData={formValues} />
        <StatementOfFacts formData={formValues} />
        <SaveButton 
          transactionType="Commercial Vehicle Transfer"
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