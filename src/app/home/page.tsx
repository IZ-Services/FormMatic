'use client';
import React, { useState, useEffect } from 'react';
import './home.css';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useScenarioContext } from '../../context/ScenarioContext';
import Loading from '../../components/pages/Loading';
import TransactionsContainer from '@/components/layouts/TransactionsContainer';

import SimpleTransfer from '../../components/molecules/SimpleTransfer';
import MultipleTransfer from '../../components/molecules/MultipleTransfer';
// import OutOfStateTitle from '../../components/scenarios/OutOfStateTitle';
import DuplicateTitle from '../../components/molecules/DuplicateTitle';
import DuplicateRegistration from '../../components/molecules/DuplicateRegistration';
import DuplicateStickers from '../../components/molecules/DuplicateStickersOnly';
import DuplicatePlatesStickers from '../../components/molecules/DuplicatePlatesAndSticklers';
import AddLienholder from '../../components/molecules/LienHolderAddition';
import RemoveLienholder from '../../components/molecules/LienHolderRemovel';
// import NameChange from '../../components/scenarios/NameChange';
// import ChangeOfAddress from '../../components/scenarios/ChangeOfAddress';
// import PlannedNonOperation from '../../components/scenarios/PlannedNonOperation';
// import RestoringPNO from '../../components/scenarios/RestoringPNO';
// import PersonalizedPlates from '../../components/scenarios/PersonalizedPlates';
// import DisabledPersonPlacards from '../../components/scenarios/DisabledPersonPlacards';

export default function Home() {
  const { selectedSubsection, activeScenarios, activeSubOptions } = useScenarioContext();
  const { user, isSubscribed } = UserAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (!isSubscribed) {
      router.push('/signUp');
    } else {
      setLoading(false);
    }
  }, [user, isSubscribed, router]);

  if (loading) {
    return <Loading />;
  }

  // Check if any scenario is active
  const hasActiveScenarios = Object.values(activeScenarios).some(value => value);

  // Render components based on active scenarios
  const renderActiveComponents = () => {
    const components = [];

    // Check for simple scenarios
    if (activeScenarios["Simple Transfer"]) components.push(<SimpleTransfer key="simple-transfer" />);
    if (activeScenarios["Multiple Transfer"]) components.push(<MultipleTransfer key="multiple-transfer" />);
    if (activeScenarios["Duplicate Title"]) components.push(<DuplicateTitle key="duplicate-title" />);
    if (activeScenarios["Duplicate Registration"]) components.push(<DuplicateRegistration key="duplicate-registration" />);
    if (activeScenarios["Duplicate Plates & Stickers"]) components.push(<DuplicatePlatesStickers key="duplicate-plates-stickers" />);
    if (activeScenarios["Add Lienholder"]) components.push(<AddLienholder key="add-lienholder" />);
    if (activeScenarios["Remove Lienholder"]) components.push(<RemoveLienholder key="remove-lienholder" />);
    // if (activeScenarios["Change of Address"]) components.push(<ChangeOfAddress key="change-of-address" />);
    // if (activeScenarios["Filing for Planned Non-Operation (PNO)"]) components.push(<PlannedNonOperation key="planned-non-operation" />);
    // if (activeScenarios["Restoring PNO Vehicle to Operational"]) components.push(<RestoringPNO key="restoring-pno" />);
    // if (activeScenarios["Disabled Person Placards/Plates"]) components.push(<DisabledPersonPlacards key="disabled-person-placards" />);
    
    // // Check for scenarios with suboptions
    // if (activeScenarios["Out-of-State Title"]) {
    //   components.push(<OutOfStateTitle 
    //     key="out-of-state-title"
    //     purchasedOverYear={activeSubOptions["Out-of-State Title-Purchased Over a Year Ago"]}
    //     purchasedLessThanYear={activeSubOptions["Out-of-State Title-Purchased Less Than a Year Ago"]}
    //   />);
    // }
    
    if (activeScenarios["Duplicate Stickers"]) {
      components.push(<DuplicateStickers 
        key="duplicate-stickers"
      />);
    }
    
    // if (activeScenarios["Name Change"]) {
    //   components.push(<NameChange 
    //     key="name-change"
    //     correction={activeSubOptions["Name Change-Name Correction"]}
    //     legalChange={activeSubOptions["Name Change-Legal Name Change"]}
    //     discrepancy={activeSubOptions["Name Change-Name Discrepancy"]}
    //   />);
    // }
    
    // if (activeScenarios["Personalized Plates"]) {
    //   components.push(<PersonalizedPlates 
    //     key="personalized-plates"
    //     order={activeSubOptions["Personalized Plates-Order"]}
    //     replace={activeSubOptions["Personalized Plates-Replace"]}
    //     reassign={activeSubOptions["Personalized Plates-Reassign/Retain"]}
    //     exchange={activeSubOptions["Personalized Plates-Exchange"]}
    //   />);
    // }
    
    return components;
  };

  return (
    <div className="homeContainer">
      <div className="componentWrapper">
        {hasActiveScenarios ? (
          renderActiveComponents()
        ) : (
          <div className="welcome-message">
            <p className='Welcome'>Please select a transaction from the side. You can mix and match multiple options to fit your needs.</p>
          </div>
        )}
      </div>
      <TransactionsContainer />
    </div>
  );
}