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

interface CheckboxOptionsData {
  leasedVehicle?: boolean;
  leasingCompanyName?: string;
}

interface VehicleTransactionDetailsData {
  currentLienholder?: boolean;
  isSmogExempt?: boolean;
}

interface FormContextData {
  checkboxOptions?: CheckboxOptionsData;
  vehicleTransactionDetails?: VehicleTransactionDetailsData;
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
  }, [formData, onDataChange]);
  
  useEffect(() => {
    setFormValues(formData);
  }, [formData]);

  const FormContent = () => {
    const { formData: contextFormData, updateField, setTransactionType } = useFormContext();

    useEffect(() => {
      setTransactionType("Change Of Address Transfer");
    }, [setTransactionType]);

    useEffect(() => {
      if (formValues) {
        Object.entries(formValues).forEach(([key, value]) => {
          updateField(key, value);
        });
      }
    }, [formValues, updateField]);

    const checkboxOptions = (contextFormData?.checkboxOptions || {}) as CheckboxOptionsData;
    const vehicleTransactionDetails = (contextFormData?.vehicleTransactionDetails || {}) as VehicleTransactionDetailsData;
    
    const isLeasedVehicle = checkboxOptions.leasedVehicle === true;
    const isCurrentLienholder = vehicleTransactionDetails.currentLienholder === true;
    const isSmogExempt = vehicleTransactionDetails.isSmogExempt === true;

    // Function to update leasing company name
    const handleLeasingCompanyNameChange = (value: string) => {
      const updatedCheckboxOptions = {
        ...checkboxOptions,
        leasingCompanyName: value
      };
      updateField('checkboxOptions', updatedCheckboxOptions);
    };

    return (
      <div className='wholeForm'>
        <TypeContainer />
        <CheckboxOptions formData={formValues} />
        <SectionOne formData={formValues} />
        <SectionTwo formData={formValues} />
        <SectionThree formData={formValues} />
        <SectionFive formData={formValues} />
        {isLeasedVehicle && (
          <LeasingCompanyField 
            leasingCompanyName={checkboxOptions.leasingCompanyName || ''} 
            onLeasingCompanyNameChange={handleLeasingCompanyNameChange} 
          />
        )}
        
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