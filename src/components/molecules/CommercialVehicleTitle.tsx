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
import CommercialCheckboxes from '../atoms/CommercialCheckboxes';
import SellerAddress from '../atoms/SellerAdrress';
import VehicleStatus from '../atoms/VehicleStatus';
import VehicleAcquisition from '../atoms/VehicleAcquisition';
import TypeOfVehicle from '../atoms/TypeOfVehicle';
import StatementOfFacts from '../atoms/StatementOfFacts';
import VehicleWeightInfo from '../atoms/VehicleWeightInfo';
import CommercialVehicleInfo from '../atoms/CommercialVehicleInfo';
import LegalOwnerOfRecord from '../atoms/LegalOwnerOfRecord';
import CommercialVehicleQuestions from '../atoms/CommercialVehicleQuestions';
import VehicleBodyChange from '../atoms/VehicleBodyChange';

interface VehicleTransactionDetailsData {
  currentLienholder?: boolean;
  isSmogExempt?: boolean;
  isOutOfStateTitle?: boolean;
}

interface CommercialVehicleData {
  isCommercial?: boolean;
  isBus?: boolean;
  isLimo?: boolean;
  isTaxi?: boolean;
  hasLienHolder?: boolean;
}

interface FormContextData {
  vehicleTransactionDetails?: VehicleTransactionDetailsData;
  commercialVehicle?: CommercialVehicleData;
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
      onDataChange(formData);     
    }
  }, [formData, onDataChange]);
  
  useEffect(() => {
    setFormValues(formData);
  }, [formData]);

  const FormContent = () => {
    const { formData: contextFormData, updateField, setTransactionType } = useFormContext();

 
    useEffect(() => {
      setTransactionType("Commercial Vehicle Transfer");
    }, [setTransactionType]);

    useEffect(() => {
      if (formValues) {
        Object.entries(formValues).forEach(([key, value]) => {
          updateField(key, value);
        });
      }
    }, [formValues, updateField]);

 
    const vehicleTransactionDetails = (contextFormData?.vehicleTransactionDetails || {}) as VehicleTransactionDetailsData;
    const commercialVehicle = (contextFormData?.commercialVehicle || {}) as CommercialVehicleData;
    
    const isCurrentLienholder = vehicleTransactionDetails.currentLienholder === true;
    const isSmogExempt = vehicleTransactionDetails.isSmogExempt === true;
    const isOutOfStateTitle = vehicleTransactionDetails.isOutOfStateTitle === true;
    const hasLienHolder = commercialVehicle.hasLienHolder === true;

    return (
      <div className='wholeForm'>
        <TypeContainer />
        <CommercialCheckboxes formData={formValues}/>
        <CommercialVehicleInfo formData={formValues} />
        <TypeOfVehicle formData={formValues} />
        <CommercialVehicleQuestions formData={formValues} />
        <Seller 
          formData={{
            hideDateOfSale: true,
            hideDateOfBirth: true,
          }}
        />
        <SellerAddress 
          hideOutOfState={true}
        />
        <VehicalInformation formData={formValues} />
        <VehicleWeightInfo formData={formValues} />
        <NewRegisteredOwners formData={formValues} />
        <Address formData={formValues} />
        <DateInformation formData={formValues} />
        <VehicleStatus formData={formValues} />
        <VehicleAcquisition formData={formValues} />
        
        {/* Show LegalOwnerOfRecord only if hasLienHolder is true */}
        {hasLienHolder && <LegalOwnerOfRecord formData={formValues} />}
        <VehicleBodyChange formData={formValues} />
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