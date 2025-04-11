'use client';

import VehicleInformation from '../atoms/VehicleInformation';
import Seller from '../atoms/Seller';
import SaveButton from '../atoms/savebutton';
import { FormDataProvider, useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ScenarioProvider } from '../../context/ScenarioContext';
import './Simpletransfer.css';
import TypeContainer from '../layouts/TransactionsContainer';
import React, { useEffect, useState } from 'react';
import LegalOwnerOfRecord from '../atoms/LegalOwnerOfRecord';
import MissingTitle from '../atoms/MissingTitle';
import SellerAddress from '../atoms/SellerAdrress';

interface VehicleTransactionDetailsData {
  currentLienholder?: boolean;
}

interface LegalOwnerInfo {
  name?: string;
  address?: {
    street?: string;
    apt?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  date?: string;
  phoneNumber?: string;
  authorizedAgentName?: string;
  authorizedAgentTitle?: string;
}

interface FormContextData {
  vehicleTransactionDetails?: VehicleTransactionDetailsData;
  legalOwnerInformation?: LegalOwnerInfo;
  [key: string]: any;
}

interface DuplicateTitleTransferProps {
  formData?: any;
  onDataChange?: (data: any) => void;
}

export default function DuplicateTitleTransfer({ formData, onDataChange }: DuplicateTitleTransferProps) {
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
      setTransactionType("Duplicate Title Transfer");
    }, [setTransactionType]);

    useEffect(() => {
      if (formValues) {
        Object.entries(formValues).forEach(([key, value]) => {
          updateField(key, value);
        });
      }
    }, [formValues, updateField]);

 
    const vehicleTransactionDetails = (contextFormData?.vehicleTransactionDetails || {}) as VehicleTransactionDetailsData;

    const [hasLienholder, setHasLienholder] = useState<boolean>(
      vehicleTransactionDetails.currentLienholder || false
    );

    useEffect(() => {
      if (vehicleTransactionDetails.currentLienholder !== undefined) {
        setHasLienholder(vehicleTransactionDetails.currentLienholder);
      }
    }, [vehicleTransactionDetails.currentLienholder]);

    const handleLienholderChange = () => {
      const newValue = !hasLienholder;
      setHasLienholder(newValue);
      
      const currentDetails = contextFormData?.vehicleTransactionDetails || {};
      updateField('vehicleTransactionDetails', {
        ...currentDetails,
        currentLienholder: newValue
      });
      
      if (!newValue) {
        updateField('legalOwnerInformation', {
          name: 'NONE',
          address: {
            street: '',
            apt: '',
            city: '',
            state: '',
            zip: ''
          },
          date: '',
          phoneNumber: '',
          authorizedAgentName: '',
          authorizedAgentTitle: ''
        });
      }
    };

    return (
      <div className='wholeForm'>
        <TypeContainer />
        <div className="lienholderCheckboxWrapper">
          <div className="headerRow">
            <h3 className="releaseHeading">Transaction Details</h3>
          </div>
          <div className="checkbox-cont">
            <div className="checkbox-section">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={hasLienholder}
                  onChange={handleLienholderChange}
                />
                There is a Current Lienholder
              </label>
            </div>
          </div>
        </div>

        <VehicleInformation 
          formData={formValues}
          isDuplicateRegistrationMode={true}
        />
        <Seller
          formData={{
            hideDateOfBirth: true,
            limitOwnerCount: true,
            hideDateOfSale: true,
          }}
        />
        <SellerAddress formData={formValues} />
        <MissingTitle formData={formValues} />
        {hasLienholder && (
          <LegalOwnerOfRecord formData={formValues} />
        )}

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