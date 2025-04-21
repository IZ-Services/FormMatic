'use client';
import Seller from '../atoms/Seller';
import SaveButton from '../atoms/savebutton';
import { FormDataProvider, useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ScenarioProvider, useScenarioContext } from '../../context/ScenarioContext';
import './Simpletransfer.css';
import TypeContainer from '../layouts/TransactionsContainer';
import React, { useEffect, useState, useRef } from 'react';
import SellerAddress from '../atoms/SellerAdrress';
import LicensePlate from '../atoms/LicensePlate';
import VehicleInformation from '../atoms/VehicleInformation';
import ItemRequested from '../atoms/ItemRequested';
import TitleField from '../atoms/TitleCompany';

interface VehicleTransactionDetailsData {
  currentLienholder?: boolean;
  isMotorcycle?: boolean;
}

interface VehicleInfo {
  engineNumber?: string;
  [key: string]: any;
}

interface SubOptionsData {
  [key: string]: boolean;
}

interface FormContextData {
  vehicleTransactionDetails?: VehicleTransactionDetailsData;
  vehicleInformation?: VehicleInfo;
  duplicateStickers?: {
    month?: boolean;
    year?: boolean;
  };
  [key: string]: any;
}

interface DuplicateStickersTransferProps {
  formData?: any;
  onDataChange?: (data: any) => void;
}

export default function DuplicateStickersTransfer({ formData, onDataChange }: DuplicateStickersTransferProps) {
  const [formValues, setFormValues] = useState(formData || {});
  const { activeSubOptions } = useScenarioContext(); 

  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  useEffect(() => {
    setFormValues(formData);
  }, [formData]);

  const FormContent = () => {
    const { formData: contextFormData, updateField, setTransactionType, showValidationErrors } = useFormContext();

 
    useEffect(() => {
      setTransactionType("Duplicate Stickers");
    }, [setTransactionType]);

    const prevActiveSubOptionsRef = useRef<{
      month?: boolean;
      year?: boolean;
    } | null>(null);

    useEffect(() => {
      if (formValues) {
        Object.entries(formValues).forEach(([key, value]) => {
          updateField(key, value);
        });
      }
    }, [formValues, updateField]);

    useEffect(() => {
      if (!activeSubOptions) return;
      
      const monthChecked = !!activeSubOptions['Duplicate Stickers-Month'];
      const yearChecked = !!activeSubOptions['Duplicate Stickers-Year'];
      
      const prevMonth = prevActiveSubOptionsRef.current?.month;
      const prevYear = prevActiveSubOptionsRef.current?.year;
      
      if (prevMonth !== monthChecked || prevYear !== yearChecked) {
        updateField('duplicateStickers', {
          month: monthChecked,
          year: yearChecked
        });
        
        prevActiveSubOptionsRef.current = {
          month: monthChecked,
          year: yearChecked
        };
      }
    }, [activeSubOptions, updateField]);

 
    const vehicleTransactionDetails = (contextFormData?.vehicleTransactionDetails || {}) as VehicleTransactionDetailsData;
    
    const isCurrentLienholder = vehicleTransactionDetails.currentLienholder === true;
    
    const [isMotorcycle, setIsMotorcycle] = useState<boolean>(
      vehicleTransactionDetails.isMotorcycle || false
    );

    useEffect(() => {
      if (vehicleTransactionDetails.isMotorcycle !== undefined) {
        setIsMotorcycle(vehicleTransactionDetails.isMotorcycle);
      }
    }, [vehicleTransactionDetails.isMotorcycle]);

    const handleMotorcycleChange = () => {
      const newValue = !isMotorcycle;
      setIsMotorcycle(newValue);
      
      const currentDetails = contextFormData?.vehicleTransactionDetails || {};
      updateField('vehicleTransactionDetails', {
        ...currentDetails,
        isMotorcycle: newValue
      });
      
      if (!newValue) {
        const currentVehicleInfo = (contextFormData.vehicleInformation || {}) as VehicleInfo;
        if (currentVehicleInfo.engineNumber) {
          updateField('vehicleInformation', {
            ...currentVehicleInfo,
            engineNumber: ''
          });
        }
      }
    };

    return (
      <div className='wholeForm'>
        <TypeContainer />
        
        {/* Motorcycle checkbox */}
        <div className="releaseWrapper">
          <div className="headerRow">
          <h3 className="releaseHeading">Transaction Details</h3>
          </div>

          <div className="checkbox-cont">
            <div className="checkbox-section">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isMotorcycle}
                  onChange={handleMotorcycleChange}
                />
                Is the vehicle a Motorcycle
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
            hideDateOfSale: true,
            hideDateOfBirth: true,
            limitOwnerCount: true
          }}
        />
        <TitleField formData={formValues} />

        <SellerAddress formData={formValues} />

        {/* <ItemRequested 
  formData={formValues}
  isDuplicateRegistrationMode={true}
  showValidationErrors={showValidationErrors} 
/> */}
        {/* <LicensePlate formData={formValues} /> */}
        
        <SaveButton 
          transactionType="Duplicate Stickers"
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