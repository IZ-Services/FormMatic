'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import Sidebar from '../layouts/Sidebar';
import Address from '../atoms/Address';
import NewRegisteredOwners from '../atoms/NewRegisteredOwner';
import NewLien from '../atoms/NewLienHolder';
import VehicalInformation from '../atoms/VehicleInformation';
import Seller from '../atoms/Seller';
import ResidentialAddress from '../atoms/ResidentialAddress';
import SaveButton from '../atoms/savebutton';
import { FormDataProvider } from '../../app/api/formDataContext/formDataContextProvider';
import { ScenarioProvider } from '../../context/ScenarioContext';
import './SimpleTransfer.css';
export default function SimpleTransfer() {
  const searchParams = useSearchParams();

  return (
    <FormDataProvider>
      <ScenarioProvider>
        <div className="simpleTransferWrapper">
          <div className='wholeForm'>
          <NewRegisteredOwners />
          <Address />
          <NewLien />
          <VehicalInformation />
          <Seller />
          <ResidentialAddress />
          <SaveButton transactionType="Simple Transfer Without Title" />
        </div>
        </div>
      </ScenarioProvider>
    </FormDataProvider>
  );
}
