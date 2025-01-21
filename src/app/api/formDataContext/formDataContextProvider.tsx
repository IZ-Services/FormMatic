'use client';
import React, { createContext, useContext, useState } from 'react';

type FormData = {
  [key: string]: any;
};

type FormContextType = {
  formData: FormData;
  updateField: (key: string, value: any) => void;
  transactionType: string;
  setTransactionType: (type: string) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [transactionType, setTransactionType] = useState<string>('');

  const updateField = (key: string, value: any) => {
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
  console.log('FormContext value in useFormContext:', context); // Log context value
  if (!context) {
    throw new Error('useFormContext must be used within a FormDataProvider');
  }
  return context;
};

