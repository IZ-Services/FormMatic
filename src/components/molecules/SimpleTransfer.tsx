'use client';
import { useSearchParams } from 'next/navigation';
import Address from '../atoms/Address';
import NewRegisteredOwners from '../atoms/NewRegisteredOwner';
import NewLien from '../atoms/NewLienHolder';
import VehicalInformation from '../atoms/VehicleInformation';
import Seller from '../atoms/Seller';
import ResidentialAddress from '../atoms/ResidentialAddress';
import SaveButton from '../atoms/savebutton';
import { FormDataProvider } from '../../app/api/formDataContext/formDataContextProvider';
import { ScenarioProvider } from '../../context/ScenarioContext';
import './Simpletransfer.css';
import TypeContainer from '../atoms/TypesContainer';
import React, { useEffect, useState } from 'react';
interface SimpleTransferProps {
  formData?: any;
}


export default function SimpleTransfer({ formData }: SimpleTransferProps) {
  const [formValues, setFormValues] = useState(formData || {});

  useEffect(() => {
    setFormValues(formData);
  }, [formData]);
  const handleSaveSuccess = () => {
    console.log('Save completed successfully');
  };

  return (
    <FormDataProvider>
      <ScenarioProvider>
        <div className="simpleTransferWrapper">
          <div className='wholeForm'>
            <TypeContainer />
            <NewRegisteredOwners formData={formValues} />
            <Address />
            <NewLien />
            <VehicalInformation />
            <Seller />
            <ResidentialAddress />
            <SaveButton 
              transactionType="Simple Transfer Without Title"
              onSuccess={handleSaveSuccess}
            />
          </div>
        </div>
      </ScenarioProvider>
    </FormDataProvider>
  );
}
