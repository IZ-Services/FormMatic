'use client';
import Address from '../atoms/Address';
import NewRegisteredOwners from '../atoms/NewRegisteredOwner';
import NewLien from '../atoms/NewLienHolder';
import VehicalInformation from '../atoms/VehicleInformation';
import Seller from '../atoms/Seller';
import ResidentialAddress from '../atoms/ResidentialAddress';
import SaveButton from '../atoms/savebutton';
import { FormDataProvider, useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ScenarioProvider } from '../../context/ScenarioContext';
import './Simpletransfer.css';
import TypeContainer from '../atoms/TransactionsContainer';
import React, { useEffect, useState } from 'react';
import ReleaseofOwnership from '../atoms/ReleaseOfOwnership';
import TypeofVehicle from '../atoms/TypeOfVehicle';
import SmogExemption from '../atoms/SmogExemption';
import LegalOwnerOfRecord from '../atoms/LegalOwnerOfRecord';
import NameStatement from '../atoms/NameStatement';
import StatementOfFacts from '../atoms/StatementOfFacts';
import PlateSelection from '../atoms/PlateSelection';
import SelectConfiguration from '../atoms/SelectConfiguration';
import ReplacementSection from '../atoms/ReplacementSection';
import PlatePurchaserOwner from '../atoms/PlatePurchaser';
import StatementOfError from '../atoms/StatementOfError';
import PlannedNonOperation from '../atoms/PlannedNonoperation';
import DisabledPersonParkingForm from '../atoms/DisabledPersonparking';
import SectionOne from '../atoms/NoticeOfChnageOfAddress/SectionOne';
import SectionTwo from '../atoms/NoticeOfChnageOfAddress/SectionTwo';
import SectionThree from '../atoms/NoticeOfChnageOfAddress/Sectionthree';
import SectionFive from '../atoms/NoticeOfChnageOfAddress/SectionFive';
import SectionSix from '../atoms/NoticeOfChnageOfAddress/SectionSix';
import VehicleInformationReg from '../atoms/VehicleInformationForTitleorReg';
import LicensePlate from '../atoms/LicensePlate';
import DisabledPersonPlacard from '../atoms/DisabledPersonplacard';

interface SimpleTransferProps {
  formData?: any;
}

export default function SimpleTransfer({ formData }: SimpleTransferProps) {
  const [formValues, setFormValues] = useState(formData || {});

  useEffect(() => {
    setFormValues(formData);
  }, [formData]);

  const FormContent = () => {
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
        <NewRegisteredOwners formData={formValues} />
        <Address formData={formValues} />
        <NewLien formData={formValues} />
        <VehicalInformation formData={formValues}/>
        <Seller formData={formValues} />
        <ResidentialAddress formData={formValues} />
        <ReleaseofOwnership formData={formValues} />
        <TypeofVehicle formData={formValues} />
        <SmogExemption formData={formValues} />
        <LegalOwnerOfRecord formData={formValues} />
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
        <LicensePlate formData={formValues} />
        <SaveButton 
          transactionType="Simple Transfer"
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