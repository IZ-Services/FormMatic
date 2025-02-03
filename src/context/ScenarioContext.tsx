'use client';
import React, { createContext, useState, useContext } from 'react';

export interface Scenerio {
  _id?: string;
  transactionType: string;
  subsections: string[];
}

interface ScenarioContextType {
  scenarios: Scenerio[];
  selectedSubsection: string | null;
  setSelectedSubsection: React.Dispatch<React.SetStateAction<string | null>>;
}

const ScenarioContext = createContext<ScenarioContextType | null>(null);

const scenerios: Scenerio[] = [
  {
    transactionType: 'Transfers',
    subsections: [
      'Simple Transfer With Title',
      'Simple Transfer Without Title',
      'Multiple Transfer With Title',
      'Multiple Transfer Without Title',
    ],
  },
    {
    transactionType: 'Out of State Transfer',
    subsections: [
      'Out-of-State Registration (Within 1 year)',
      'Out-of-State Registration (Over 1 year)',
    ],
  },
  {
    transactionType: 'Renewal',
    subsections: [
      'Renewal Only',
    ],
  },
  {
    transactionType: 'Duplicate Title',
    subsections: [
      'Duplicate Title'
    ],
  },
  {
    transactionType: 'Duplicate Plates/Stickers',
    subsections: [
      'Duplicate Plates/Stickers'
    ],
  },
  {
    transactionType: 'Planned Non-Operation (PNO)',
    subsections: [
      'Filing PNO (Registered)',
      'Filing PNO (Not Registered)',
      'PNO to Operational',
    ],
  },
  {
    transactionType: 'Lienholder Changes',
    subsections: [
      'Lienholder Addition',
      'Lienholder Removal'
    ],
  },
  {
    transactionType: 'Other Unique Transactions',
    subsections: [
      'Name Change/Correction on Title',
      'Disabled Person Placards/Plates',
      'Personalized Plates',
      'Salvage Title Registration',
      'Commercial Vehicle Registration + Conversion to Private Use',
    ],
  },
];

export function ScenarioProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [selectedSubsection, setSelectedSubsection] = useState<string | null>(null);

  return (
    <ScenarioContext.Provider
      value={{ scenarios: scenerios, selectedSubsection, setSelectedSubsection }}
    >
      {children}
    </ScenarioContext.Provider>
  );
}

export const useScenarioContext = () => {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error('useScenarioContext must be used within a ScenarioProvider');
  }
  return context;
};