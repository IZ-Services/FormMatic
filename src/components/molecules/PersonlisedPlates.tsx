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
  }, [formData, onDataChange]);
  
  useEffect(() => {
 
    setFormValues(formData || {});
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
  const { formData: contextFormData, updateField, clearField, setTransactionType, showValidationErrors } = useFormContext();
  const { activeScenarios, activeSubOptions } = useScenarioContext();
  const prevActiveOptionRef = useRef<string | null>(null);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    setTransactionType("Personalized Plates");
  }, [setTransactionType]);

  const [safeFormData, setSafeFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (formValues) {
      Object.entries(formValues).forEach(([key, value]) => {
        const safeValue = value === undefined ? '' : value;
        updateField(key, safeValue);
        setSafeFormData(prev => ({ ...prev, [key]: safeValue }));
      });
    }
  }, [formValues, updateField]);

  const isPlatesSelected = activeScenarios['Personalized Plates'] === true;
  const isOrderSelected = activeSubOptions['Personalized Plates-Order'] === true;
  const isExchangeSelected = activeSubOptions['Personalized Plates-Exchange'] === true;
  const isReplaceSelected = activeSubOptions['Personalized Plates-Replace'] === true;
  const isReassignSelected = activeSubOptions['Personalized Plates-Reassign/Retain'] === true;

  // Check if any suboption is selected
  const isAnySubOptionSelected = isOrderSelected || isExchangeSelected || isReplaceSelected || isReassignSelected;

  const getCurrentActiveOption = (): string | null => {
    if (isOrderSelected) return 'order';
    if (isExchangeSelected) return 'exchange';
    if (isReplaceSelected) return 'replace';
    if (isReassignSelected) return 'reassign';
    return null;
  };

  const currentActiveOption = getCurrentActiveOption();

  useEffect(() => {
    const transactionType = getTransactionType();
    setTransactionType(transactionType);
  }, [isOrderSelected, isExchangeSelected, isReplaceSelected, isReassignSelected, setTransactionType]);

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
    'sequential',
    'currentLicensePlate',
    'selectConfiguration' 
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
    'specialInterestLicensePlateNumber',
    'replacementSection' 
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
    'dscds',
    'reassignmentSection' 
  ];

  const clearFieldGroup = (fields: string[]) => {
    const updates: Record<string, string> = {};
    
    fields.forEach(field => {
      if (contextFormData[field] !== undefined) {
        console.log(`Clearing field: ${field}`);
        clearField(field);
        updates[field] = '';
      }
    });
    
    if (Object.keys(updates).length > 0) {
      setSafeFormData(prev => ({ ...prev, ...updates }));
    }
  };

  const clearAllExceptCurrent = (currentOption: string | null) => {
    const fieldsToPreserve = [...commonFields];
    
    if (currentOption === 'order' || currentOption === 'exchange') {
      fieldsToPreserve.push(...configurationFields);
    }
    
    if (currentOption === 'replace') {
      fieldsToPreserve.push(...replacementFields);
    }
    
    if (currentOption === 'reassign') {
      fieldsToPreserve.push(...reassignmentFields);
    }
    
    const allFields = Object.keys(contextFormData);
    
    const fieldsToClear = allFields.filter(field => 
      !fieldsToPreserve.includes(field) && 
      !field.includes('platePurchaserOwner') &&
      !field.includes('plateSelection')
    );
    
    clearFieldGroup(fieldsToClear);
  };

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      prevActiveOptionRef.current = currentActiveOption;
      return;
    }

    if (currentActiveOption !== prevActiveOptionRef.current) {
      console.log(`Option changed from ${prevActiveOptionRef.current} to ${currentActiveOption}`);
      
      clearAllExceptCurrent(currentActiveOption);
      
      if (prevActiveOptionRef.current === 'reassign' && currentActiveOption !== 'reassign') {
        console.log('Clearing all reassignment fields');
        clearFieldGroup(reassignmentFields);
      }
      
      if (prevActiveOptionRef.current === 'replace' && currentActiveOption !== 'replace') {
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

  const safeProps = {
    ...safeFormData,
    ...contextFormData
  };

  return (
    <div className='wholeForm'>
      <TypeContainer />
      
      {isPlatesSelected ? (
        isAnySubOptionSelected ? (
          <>
            {/* Common component for all options */}
            <PlateSelection formData={safeProps}showValidationErrors={showValidationErrors} />

            {/* Conditional components based on selection */}
            {(isOrderSelected || isExchangeSelected) && (
              <SelectConfiguration formData={safeProps}  showValidationErrors={showValidationErrors} />
            )}

            {isReplaceSelected && (
              <ReplacementSection formData={safeProps}   showValidationErrors={showValidationErrors}  />
            )}
            
            {isReassignSelected && (
              <ReassignmentSection formData={safeProps} showValidationErrors={showValidationErrors} />
            )}

            {/* Common component for all options */}
            <PlatePurchaserOwner formData={safeProps} showValidationErrors={showValidationErrors} />

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