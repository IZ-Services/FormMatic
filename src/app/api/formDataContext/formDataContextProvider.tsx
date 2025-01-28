'use client';
import React, { createContext, useContext, useState } from 'react';

type FormData = Record<string, unknown>;

type FormContextType = {
  formData: FormData;
  updateField: (key: string, value: unknown) => void; 
  transactionType: string;
  setTransactionType: (type: string) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [transactionType, setTransactionType] = useState<string>('');

  const updateField = (key: string, value: unknown) => {
    console.log(`Updating field: ${key} with value:`, value);
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  console.log('FormDataProvider is rendering with state:', { formData, transactionType });

  return (
    <FormContext.Provider
      value={{ formData, updateField, transactionType, setTransactionType }}
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

