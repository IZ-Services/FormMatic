'use client';
import VehicalInformation from '../atoms/VehicleInformation';
import Seller from '../atoms/Seller';
import SaveButton from '../atoms/savebutton';
import { FormDataProvider, useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { useScenarioContext } from '../../context/ScenarioContext';
import './Simpletransfer.css';
import TypeContainer from '../layouts/TransactionsContainer';
import React, { useEffect, useState, useRef } from 'react';
import NameCorrection from '../atoms/NameCorrection';
import LegalNameChange from '../atoms/LegalnameChange';
import NameDiscrepancy from '../atoms/NameDiscrepancy';

interface NameChangeTransferProps {
  formData?: any;
  onDataChange?: (data: any) => void;
}

export default function NameChangeTransfer({ formData, onDataChange }: NameChangeTransferProps) {
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
    setTransactionType("Name Change/Correction Transfer");
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

  const isNameChangeSelected = activeScenarios['Name Change'] === true;
  const isCorrectionSelected = activeSubOptions['Name Change-Name Correction'] === true;
  const isLegalSelected = activeSubOptions['Name Change-Legal Name Change'] === true;
  const isDiscrepancySelected = activeSubOptions['Name Change-Name Discrepancy'] === true;


  const isAnySubOptionSelected = isCorrectionSelected || isLegalSelected || isDiscrepancySelected;

  const getCurrentActiveOption = (): string | null => {
    if (isCorrectionSelected) return 'correction';
    if (isLegalSelected) return 'legal';
    if (isDiscrepancySelected) return 'discrepancy';
    return null;
  };

  const currentActiveOption = getCurrentActiveOption();

  useEffect(() => {
    const transactionType = getTransactionType();
    setTransactionType(transactionType);
  }, [isCorrectionSelected, isLegalSelected, isDiscrepancySelected, setTransactionType]);


  const commonFields = [
    'vehicleInformation', 
    'seller'

  ];
  
  const correctionFields = [
    'nameStatement',
    'correctionType',
    'correctionReason',
    'nameOnTitle',
    'correctName',
    'correctionProof'

  ];
  
  const legalFields = [
    'nameStatement',
    'legalReason',
    'previousName',
    'newName',
    'legalProof'

  ];
  
  const discrepancyFields = [
    'nameStatement',
    'discrepancyType',
    'discrepancyDetails',
    'nameOnDocument1',
    'nameOnDocument2',
    'discrepancyProof'

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
    
    if (currentOption === 'correction') {
      fieldsToPreserve.push(...correctionFields);
    }
    
    if (currentOption === 'legal') {
      fieldsToPreserve.push(...legalFields);
    }
    
    if (currentOption === 'discrepancy') {
      fieldsToPreserve.push(...discrepancyFields);
    }
    
    const allFields = Object.keys(contextFormData);
    
    const fieldsToClear = allFields.filter(field => 
      !fieldsToPreserve.includes(field) && 
      !field.includes('seller') &&
      !field.includes('vehicleInformation')
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
      
      if (prevActiveOptionRef.current === 'correction' && currentActiveOption !== 'correction') {
        console.log('Clearing all correction fields');
        clearFieldGroup(correctionFields);
      }
      
      if (prevActiveOptionRef.current === 'legal' && currentActiveOption !== 'legal') {
        console.log('Clearing all legal name change fields');
        clearFieldGroup(legalFields);
      }
      
      if (prevActiveOptionRef.current === 'discrepancy' && currentActiveOption !== 'discrepancy') {
        console.log('Clearing all discrepancy fields');
        clearFieldGroup(discrepancyFields);
      }
      
      prevActiveOptionRef.current = currentActiveOption;
    }
  }, [
    isCorrectionSelected,
    isLegalSelected,
    isDiscrepancySelected,
    clearField,
    contextFormData
  ]);

  const getTransactionType = () => {
    return "Name Change/Correction Transfer";
  };

  const safeProps = {
    ...safeFormData,
    ...contextFormData
  };

  return (
    <div className='wholeForm'>
      <TypeContainer />
      
      {isNameChangeSelected ? (
        isAnySubOptionSelected ? (
          <>
            {/* Common component for all options */}
            <VehicalInformation 
              formData={{
                ...safeProps,
                hideMileageFields: true
              }}
            />

            {/* Conditional components based on selection - no props passed */}
            {isCorrectionSelected && <NameCorrection />}
            {isLegalSelected && <LegalNameChange />}
            {isDiscrepancySelected && <NameDiscrepancy />}

            {/* Common component for all options */}
            <Seller 
              formData={{
                ...safeProps,
                hideDateOfSale: true,
                hideDateOfBirth: true,
                forceSingleOwner: true
              }}
            />

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
            <p>Please select a specific Name Change option (Name Correction, Legal Name Change, or Name Discrepancy) from the transaction menu.</p>
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
          <p>Please select Name Change from the transaction menu.</p>
        </div>
      )}
    </div>
  );
};