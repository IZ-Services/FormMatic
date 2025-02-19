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
    transactionType: 'Transfer & Renewal',
    subsections: [
      'Transfer',
      'Renewal',
    ],
  },
  {
    transactionType: 'Duplicate & Replacement',
    subsections: [
      'Duplicate Title',
      'Duplicate Plates/Stickers',
      'Registration Replacement'
    ],
  },
  {
    transactionType: 'Planned Non-Operation',
    subsections: [
      'Filing PNO',
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
    transactionType: 'Address & Name Changes',
    subsections: [
      'Name Change/Correction on Title',
      'Change of Address'
    ],
  },
  {
    transactionType: 'Specialty Transactions',
    subsections: [
      'Disabled Person Placards/Plates',
      'Personalized Plates',
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