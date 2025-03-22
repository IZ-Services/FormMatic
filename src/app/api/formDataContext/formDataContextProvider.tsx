'use client';
import React, { createContext, useContext, useState } from 'react';

type FormData = Record<string, unknown>;

type FormContextType = {
  formData: FormData;
  updateField: (key: string, value: unknown) => void;
  clearField: (key: string) => void;
  transactionType: string;
  setTransactionType: (type: string) => void;
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

  console.log('FormDataProvider is rendering with state:', { formData, transactionType });

  return (
    <FormContext.Provider
      value={{ 
        formData, 
        updateField, 
        clearField,
        transactionType, 
        setTransactionType 
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  console.log('FormContext value in useFormContext:', context); 
  if (!context) {
    throw new Error('useFormContext must be used within a FormDataProvider');
  }
  return context;
};