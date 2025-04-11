'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { clearSellerAddressStorage } from '../../../components/atoms/SellerAdrress'; 

type FormData = Record<string, unknown>;

type FormContextType = {
  formData: FormData;
  updateField: (key: string, value: unknown) => void;
  clearField: (key: string) => void;
  transactionType: string;
  setTransactionType: (type: string) => void;
  clearAllFormData: () => void;
  clearFormTriggered: number | null; 
};

const FormContext = createContext<FormContextType | undefined>(undefined);

interface FormDataProviderProps {
  children: React.ReactNode;
  initialData?: FormData;
}

export const FormDataProvider: React.FC<FormDataProviderProps> = ({ 
  children, 
  initialData = {} }) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [transactionType, setTransactionType] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [clearFormTriggered, setClearFormTriggered] = useState<number | null>(null);

 
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
 
        const savedType = localStorage.getItem('formmatic_transaction_type');
        if (savedType) {
          setTransactionType(savedType);
          
 
          const savedData = localStorage.getItem(`formmatic_form_data_${savedType}`);
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            setFormData(prev => ({ ...prev, ...parsedData }));
            console.log(`Restored form data for transaction: ${savedType}`);
          }
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading saved form data:', error);
        setIsInitialized(true);
      }
    }
  }, [isInitialized]);

 
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized && transactionType) {
      localStorage.setItem('formmatic_transaction_type', transactionType);
    }
  }, [transactionType, isInitialized]);

 
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized && transactionType) {
      const saveTimeout = setTimeout(() => {
        try {
          localStorage.setItem(`formmatic_form_data_${transactionType}`, JSON.stringify(formData));
          console.log(`Saved form data for transaction: ${transactionType}`);
        } catch (error) {
          console.error('Error saving form data:', error);
        }
      }, 500); 

      return () => clearTimeout(saveTimeout);
    }
  }, [formData, transactionType, isInitialized]);

  const updateField = (key: string, value: unknown) => {
    console.log(`Updating field: ${key} with value:`, value);
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const clearField = (key: string) => {
    console.log(`Clearing field: ${key}`);
    setFormData((prev) => {
      const newData = { ...prev };
      delete newData[key];
      return newData;
    });
  };

  const clearAllFormData = () => {
 
    if (typeof window !== 'undefined' && transactionType) {
      localStorage.removeItem(`formmatic_form_data_${transactionType}`);
      
 
      clearSellerAddressStorage();
      
 
 
    }
    
 
    setFormData({});
    
 
    setClearFormTriggered(Date.now());
    
    console.log('All form data cleared successfully');
  };

  console.log('FormDataProvider is rendering with state:', { formData, transactionType });

  return (
    <FormContext.Provider
      value={{ 
        formData, 
        updateField, 
        clearField,
        transactionType, 
        setTransactionType,
        clearAllFormData,
        clearFormTriggered
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormDataProvider');
  }
  return context;
};