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

import LegalOwnerOfRecord from '../atoms/LegalOwnerOfRecord';

import VehicleTransactionDetails from '../atoms/Checkboxes';
import MissingTitle from '../atoms/MissingTitle';
import SellerAddress from '../atoms/SellerAdrress';

interface VehicleTransactionDetailsData {
  currentLienholder?: boolean;
}

interface FormContextData {
  vehicleTransactionDetails?: VehicleTransactionDetailsData;
  [key: string]: any;
}

interface DuplicateTitleTransferProps {
  formData?: any;
}

export default function DuplicateTitleTransfer({ formData }: DuplicateTitleTransferProps) {
  const [formValues, setFormValues] = useState(formData || {});

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

    return (
      <div className='wholeForm'>
        <TypeContainer />
        <VehicleTransactionDetails formData={formValues} />

        <VehicalInformation formData={formValues}/>
        <Seller formData={formValues} />
        <SellerAddress formData={formValues} />
        <MissingTitle formData={formValues} />
        {isCurrentLienholder && (
          <LegalOwnerOfRecord formData={formValues} />
        )}
        {/* <NewRegisteredOwners formData={formValues} />
        <Address formData={formValues} />
        <NewLien formData={formValues} />
        <PowerOfAttorney formData={formValues} /> */}

        {/* <VehicleTransactionDetails formData={formValues} /> */}
        
        {/* <ResidentialAddress formData={formValues} /> */}
        {/* <ReleaseofOwnership formData={formValues} />
        <TypeofVehicle formData={formValues} />
        <SmogExemption formData={formValues} />
        
        <NameStatement formData={formValues} />
        <StatementOfFacts formData={formValues} />
        <PlateSelection formData={formValues} />
        <SelectConfiguration formData={formValues} />
        <ReplacementSection formData={formValues} />
        <PlatePurchaserOwner formData={formValues} />
        <StatementOfError formData={formValues} />
        <PlannedNonOperation formData={formValues} />
        <DisabledPersonParkingForm formData={formValues} />
        <SectionOne formData={formValues} />
        <SectionTwo formData={formValues} />
        <SectionThree formData={formValues} />
        <SectionFive formData={formValues} />
        <SectionSix formData={formValues} />
        <VehicleInformationReg formData={formValues} />
        <DisabledPersonPlacard formData={formValues} />
        <PlatesStickerDocRequests formData={formValues} />
        <LicensePlate formData={formValues} />
        <SalvageCertificate formData={formValues} />
        <LicensePlateDisposition formData={formValues} />
        <PowerOfAttorney formData={formValues} />
        <MultipleTransfer /> */}
        <SaveButton 
          transactionType="Duplicate Title Transfer"
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