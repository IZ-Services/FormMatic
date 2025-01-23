'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
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

  const handleSaveSuccess = () => {
    const externalPDFs = [
      'https://www.dmv.ca.gov/portal/uploads/2021/11/REG-227-R9-2021-AS-WWW.pdf',
      'https://irp.cdn-website.com/3f72d434/files/uploaded/Statement%20Of%20Fact%20%28REG%20256%29.pdf'
    ];

    // Add a small delay between opening PDFs to prevent popup blocking
    externalPDFs.forEach((url, index) => {
      setTimeout(() => {
        const newWindow = window.open(url, '_blank');
        
        // Check if popup was blocked
        if (newWindow === null) {
          alert('Please allow popups for this site to view the PDF forms.');
        }
      }, index * 500); // 500ms delay between each PDF
    });
  };

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