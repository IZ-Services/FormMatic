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
    transactionType: 'Transfer',
    subsections: [
      'Simple Transfer Without Title',
      'Transfer w. Duplicate Plates/Stickers',
      'Transfer w. Gift',
      'Transfer w. Gift  & Duplicate Plates/Stickers',
    ],
  },
  {
    transactionType: 'Renewal',
    subsections: [
      'Simple Renewal',
      'Renewal w. Duplicate Plates/Stickers',
      'Renewal w. Change of Address',
      'Out of State Renewal & Needs Smog',
      'Renewal w. Disabled Plates',
    ],
  },
  {
    transactionType: 'Out of State Transfer',
    subsections: ['Simple Out of State Transfer'],
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
