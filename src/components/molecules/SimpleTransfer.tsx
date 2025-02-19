'use client';
import { useSearchParams } from 'next/navigation';

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
import TypeContainer from '../atoms/TypesContainer';
import React, { useEffect, useState } from 'react';
import ReleaseofOwnership from '../atoms/ReleaseOfOwnership';
import TypeofVehicle from '../atoms/TypeOfVehicle';
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