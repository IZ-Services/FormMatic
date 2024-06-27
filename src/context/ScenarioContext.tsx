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
  setSelectedSubsection: (subsection: string) => void;
}

const ScenarioContext = createContext<ScenarioContextType | null>(null);

const scenerios: Scenerio[] = [
  {
    transactionType: 'Transfer',
    subsections: ['Simple Transfer'],
  },
  {
    transactionType: 'Renewal',
    subsections: ['Simple Renewal'],
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
