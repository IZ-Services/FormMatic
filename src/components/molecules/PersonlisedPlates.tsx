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
  // Initialize with empty object instead of undefined
  const [formValues, setFormValues] = useState(formData || {});
  
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);     
    }
  }, [formData, onDataChange]);
  
  useEffect(() => {
    // Ensure we're not setting to undefined
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
  const { formData: contextFormData, updateField, clearField } = useFormContext();
  const { activeScenarios, activeSubOptions } = useScenarioContext();
  const prevActiveOptionRef = useRef<string | null>(null);
  const initialLoadRef = useRef(true);

  // Initialize a local state to safely store cleared values
  // This prevents uncontrolled to controlled switching
  const [safeFormData, setSafeFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (formValues) {
      // Update both context and local safe data
      Object.entries(formValues).forEach(([key, value]) => {
        // Ensure values are never undefined
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

  const getCurrentActiveOption = (): string | null => {
    if (isOrderSelected) return 'order';
    if (isExchangeSelected) return 'exchange';
    if (isReplaceSelected) return 'replace';
    if (isReassignSelected) return 'reassign';
    return null;
  };

  const currentActiveOption = getCurrentActiveOption();

  // Define all relevant fields by category
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
    'selectConfiguration'  // Add the component name itself if needed
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
    'replacementSection'  // Add the component name itself if needed
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
    'reassignmentSection'  // Add the component name itself if needed
  ];

  // This function clears fields and updates safeFormData to maintain controlled inputs
  const clearFieldGroup = (fields: string[]) => {
    const updates: Record<string, string> = {};
    
    fields.forEach(field => {
      if (contextFormData[field] !== undefined) {
        console.log(`Clearing field: ${field}`);
        clearField(field);
        
        // Set to empty string (or appropriate default) in safeFormData
        // instead of undefined to avoid controlled/uncontrolled switch
        updates[field] = '';
      }
    });
    
    // Batch update the safe data
    if (Object.keys(updates).length > 0) {
      setSafeFormData(prev => ({ ...prev, ...updates }));
    }
  };

  // Function to clear all fields except the ones needed for the current option
  const clearAllExceptCurrent = (currentOption: string | null) => {
    // Always preserve common fields
    const fieldsToPreserve = [...commonFields];
    
    // Add fields to preserve based on current option
    if (currentOption === 'order' || currentOption === 'exchange') {
      fieldsToPreserve.push(...configurationFields);
    }
    
    if (currentOption === 'replace') {
      fieldsToPreserve.push(...replacementFields);
    }
    
    if (currentOption === 'reassign') {
      fieldsToPreserve.push(...reassignmentFields);
    }
    
    // Get all keys from context form data
    const allFields = Object.keys(contextFormData);
    
    // Determine which fields to clear
    const fieldsToClear = allFields.filter(field => 
      !fieldsToPreserve.includes(field) && 
      // Don't clear platePurchaserOwner or other essential shared data
      !field.includes('platePurchaserOwner') &&
      !field.includes('plateSelection')
    );
    
    // Clear those fields
    clearFieldGroup(fieldsToClear);
  };

  // Effect to handle option changes
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      prevActiveOptionRef.current = currentActiveOption;
      return;
    }

    // If the option has changed
    if (currentActiveOption !== prevActiveOptionRef.current) {
      console.log(`Option changed from ${prevActiveOptionRef.current} to ${currentActiveOption}`);
      
      // Clear everything except fields needed for the new option
      clearAllExceptCurrent(currentActiveOption);
      
      // When switching from one option to another, ensure specific fields are cleared
      
      // If we were in reassign mode but now we're not
      if (prevActiveOptionRef.current === 'reassign' && currentActiveOption !== 'reassign') {
        console.log('Clearing all reassignment fields');
        clearFieldGroup(reassignmentFields);
      }
      
      // If we were in replace mode but now we're not
      if (prevActiveOptionRef.current === 'replace' && currentActiveOption !== 'replace') {
        console.log('Clearing all replacement fields');
        clearFieldGroup(replacementFields);
      }
      
      // If we were in order/exchange mode but now we're not
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

  // A derived prop object that combines contextFormData with safeFormData
  // This ensures child components never receive undefined values
  const safeProps = {
    ...safeFormData,
    ...contextFormData
  };

  return (
    <div className='wholeForm'>
      <TypeContainer />
      
      {isPlatesSelected ? (
        getCurrentActiveOption() ? (
          <>
            {/* Common component for all options */}
            <PlateSelection formData={safeProps} />

            {/* Conditional components based on selection */}
            {(isOrderSelected || isExchangeSelected) && (
              <SelectConfiguration formData={safeProps} />
            )}

            {isReplaceSelected && (
              <ReplacementSection formData={safeProps} />
            )}
            
            {isReassignSelected && (
              <ReassignmentSection formData={safeProps} />
            )}

            {/* Common component for all options */}
            <PlatePurchaserOwner formData={safeProps} />

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