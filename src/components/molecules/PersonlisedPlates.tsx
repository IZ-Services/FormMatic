'use client';
import SaveButton from '../atoms/savebutton';
import { FormDataProvider, useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { useScenarioContext } from '../../context/ScenarioContext';
import './Simpletransfer.css';
import TypeContainer from '../layouts/TransactionsContainer';
import React, { useEffect, useState, useRef } from 'react';
import ReassignmentSection from '../atoms/ReassignmentSection';

import PlateSelection from '../atoms/PlateSelection';
import ReplacementSection from '../atoms/ReplacementSection';
import PlatePurchaserOwner from '../atoms/PlatePurchaser';
import SelectConfiguration from '../atoms/SelectConfiguration';

interface PersonalisedPlatesTransferProps {
  formData?: any;
  onDataChange?: (data: any) => void;
}

export default function PersonalisedPlatesTransfer({ formData, onDataChange }: PersonalisedPlatesTransferProps) {
  const [formValues, setFormValues] = useState(formData || {});
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);     
    }
  }, [formData]);
  useEffect(() => {
    setFormValues(formData);
  }, [formData]);

  return (
    <FormDataProvider>
      <div className="simpleTransferWrapper">
        <FormContent formValues={formValues} />
      </div>
    </FormDataProvider>
  );
}


const FormContent = ({ formValues }: { formValues: any }) => {
  const { formData: contextFormData, updateField, clearField } = useFormContext();
  const { activeScenarios, activeSubOptions } = useScenarioContext();


  const prevActiveOptionRef = useRef<string | null>(null);
  

  const initialLoadRef = useRef(true);


  useEffect(() => {
    if (formValues) {
      Object.entries(formValues).forEach(([key, value]) => {
        updateField(key, value);
      });
    }
  }, [formValues, updateField]);


  const isPlatesSelected = activeScenarios['Personalized Plates'] === true;
  const isOrderSelected = activeSubOptions['Personalized Plates-Order'] === true;
  const isExchangeSelected = activeSubOptions['Personalized Plates-Exchange'] === true;
  const isReplaceSelected = activeSubOptions['Personalized Plates-Replace'] === true;
  const isReassignSelected = activeSubOptions['Personalized Plates-Reassign/Retain'] === true;
  

  const getCurrentActiveOption = (): string | null => {
    if (isOrderSelected) return 'order';
    if (isExchangeSelected) return 'exchange';
    if (isReplaceSelected) return 'replace';
    if (isReassignSelected) return 'reassign';
    return null;
  };

  const currentActiveOption = getCurrentActiveOption();
  

  const commonFields = [
    'plateSelection', 
    'plateType'
  ];
  
  const configurationFields = [
    'configuration', 
    'plateStyle', 
    'plateMessage', 
    'plateOptions',
    'personalizedConfig',
    'meaning',
    'firstChoice',
    'secondChoice',
    'thirdChoice',
    'kidsPlateSymbol',
    'sequential'
  ];
  
  const replacementFields = [
    'replacementReason', 
    'replacementDetails', 
    'replacementProof',
    'needOnePlate',
    'needTwoPlates',
    'plateWasLost',
    'plateWasMutilated',
    'plateWasStolen',
    'specialInterestLicensePlateNumber'
  ];
  
  const reassignmentFields = [
    'retentionReason', 
    'retentionDetails', 
    'fromVehicle', 
    'toVehicle',
    'retainInterest',
    'releaseInterest',
    'releaseTo',
    'specialInterestLicensePlateNumber',
    'removedFrom',
    'placedOnCurrent',
    'placedOnVehicle',
    'deww',
    'dewfw',
    'dedes',
    'dscds'
  ];


  const clearFieldGroup = (fields: string[]) => {
    fields.forEach(field => {
      if (contextFormData[field] !== undefined) {
        console.log(`Clearing field: ${field}`);
        clearField(field);
      }
    });
  };


  useEffect(() => {

    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      prevActiveOptionRef.current = currentActiveOption;
      return;
    }


    if (currentActiveOption !== prevActiveOptionRef.current) {
      console.log(`Option changed from ${prevActiveOptionRef.current} to ${currentActiveOption}`);
      

      if (prevActiveOptionRef.current === 'reassign') {
        console.log('Clearing all reassignment fields');
        clearFieldGroup(reassignmentFields);
      }
      

      if (prevActiveOptionRef.current === 'replace') {
        console.log('Clearing all replacement fields');
        clearFieldGroup(replacementFields);
      }
      

      if ((prevActiveOptionRef.current === 'order' || prevActiveOptionRef.current === 'exchange') && 
          currentActiveOption !== 'order' && currentActiveOption !== 'exchange') {
        console.log('Clearing all configuration fields');
        clearFieldGroup(configurationFields);
      }
      

      prevActiveOptionRef.current = currentActiveOption;
    }
    

    if (currentActiveOption) {

      if (currentActiveOption !== 'reassign') {
        clearFieldGroup(reassignmentFields);
      }
      

      if (currentActiveOption !== 'replace') {
        clearFieldGroup(replacementFields);
      }
      

      if (currentActiveOption !== 'order' && currentActiveOption !== 'exchange') {
        clearFieldGroup(configurationFields);
      }
    }
  }, [
    isOrderSelected,
    isExchangeSelected,
    isReplaceSelected,
    isReassignSelected,
    clearField,
    contextFormData
  ]);


  const getTransactionType = () => {
    if (isOrderSelected) return "Personalized Plates (Order)";
    if (isExchangeSelected) return "Personalized Plates (Exchange)";
    if (isReplaceSelected) return "Personalized Plates (Replacement)";
    if (isReassignSelected) return "Personalized Plates (Reassignment)";
    return "Personalized Plates";
  };


  useEffect(() => {
    console.log('Current Form Data:', contextFormData);
    console.log('Current Active Option:', currentActiveOption);
  }, [contextFormData, currentActiveOption]);

  return (
    <div className='wholeForm'>
      <TypeContainer />
      
      {isPlatesSelected ? (
        getCurrentActiveOption() ? (
          <>
            {/* Common component for all options */}
            <PlateSelection formData={formValues} />

            {/* Conditional components based on selection */}
            {(isOrderSelected || isExchangeSelected) && (
              <SelectConfiguration formData={formValues} />
            )}

            {isReplaceSelected && (
              <ReplacementSection formData={formValues} />
            )}
            
            {/* Show ReassignmentSection when Reassign/Retain is selected */}
            {isReassignSelected && (
              <ReassignmentSection formData={formValues} />
            )}

            {/* Common component for all options */}
            <PlatePurchaserOwner formData={formValues} />

            {/* Save Button with dynamic transaction type */}
            <SaveButton 
              transactionType={getTransactionType()}
              onSuccess={() => console.log('Save completed successfully')}
            />
          </>
        ) : (
          <div className="guidance-message" style={{ 
            padding: '20px', 
            margin: '20px 0', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '5px', 
            textAlign: 'center' 
          }}>
            <p>Please select a specific Personalized Plates option (Order, Replace, Reassign/Retain, or Exchange) from the transaction menu.</p>
          </div>
        )
      ) : (
        <div className="guidance-message" style={{ 
          padding: '20px', 
          margin: '20px 0', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '5px', 
          textAlign: 'center' 
        }}>
          <p>Please select Personalized Plates from the transaction menu.</p>
        </div>
      )}
    </div>
  );
};