'use client';
import SaveButton from '../atoms/savebutton';
import { FormDataProvider, useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ScenarioProvider } from '../../context/ScenarioContext';
import './Simpletransfer.css';
import React, { useEffect, useState } from 'react';
import TypeContainer from '../layouts/TransactionsContainer';
import SectionOne from '../atoms/NoticeOfChnageOfAddress/SectionOne';
import SectionTwo from '../atoms/NoticeOfChnageOfAddress/SectionTwo';
import SectionThree from '../atoms/NoticeOfChnageOfAddress/Sectionthree';
import SectionFive from '../atoms/NoticeOfChnageOfAddress/SectionFive';
import VoterAddressUpdate from '../atoms/VoterAddressUpdate';
import LeasedVehicles from '../atoms/LeasedVehiclesData';
import CitizenshipQuestion from '../atoms/CitizenshipQuestion;';
import CheckboxOptions from '../atoms/NoticeOfChnageOfAddress/CheckBoxOptions';
import LeasingCompanyField from '../atoms/NoticeOfChnageOfAddress/LeasingCompanyField';
interface FormContextData {
  [key: string]: any;
}

interface ChangeOfAddressTransferProps {
  formData?: any;
  onDataChange?: (data: any) => void;
}

export default function ChangeOfAddressTransfer({ formData, onDataChange }: ChangeOfAddressTransferProps) {
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


    const isLeasedVehicle = contextFormData?.checkboxOptions?.leasedVehicle === true;
    const isCurrentLienholder = contextFormData?.vehicleTransactionDetails?.currentLienholder === true;
    const isSmogExempt = contextFormData?.vehicleTransactionDetails?.isSmogExempt === true;

    return (
      <div className='wholeForm'>
        <TypeContainer />
        <CheckboxOptions formData={formValues} />
        <SectionOne formData={formValues} />
        <SectionTwo formData={formValues} />
        <SectionThree formData={formValues} />
        <SectionFive formData={formValues} />
        
        {/* Show LeasedVehicles component if leased vehicle checkbox is checked */}
        {isLeasedVehicle && <LeasingCompanyField formData={formValues} />}
        
        <SaveButton 
          transactionType="Change Of Address Transfer"
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