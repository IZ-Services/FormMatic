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
import SalvageTransfer from '../../components/molecules/Salvage';
import DuplicateTitle from '../../components/molecules/DuplicateTitle';
import DuplicateRegistration from '../../components/molecules/DuplicateRegistration';
import DuplicateStickers from '../../components/molecules/DuplicateStickersOnly';
import DuplicatePlatesStickers from '../../components/molecules/DuplicatePlatesAndSticklers';
import AddLienholder from '../../components/molecules/LienHolderAddition';
import RemoveLienholder from '../../components/molecules/LienHolderRemovel';
import NameChange from '../../components/molecules/NameChange';
import ChangeOfAddress from '../../components/molecules/ChangeOfAddress';
import PlannedNonOperation from '../../components/molecules/FilingPNO';
import CommercialVehicleTransfer from '@/components/molecules/CommercialVehicleTitle';
import CertificateOfNonOperation from '../../components/molecules/CertificateOfNonOperation';
import PersonalizedPlates from '../../components/molecules/PersonlisedPlates';
import DisabledPersonPlacards from '../../components/molecules/DisabledPersonAndPlacards';

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

  const hasActiveScenarios = Object.values(activeScenarios).some(value => value);

  const renderActiveComponents = () => {
    const components = [];

    if (activeScenarios["Simple Transfer"]) components.push(<SimpleTransfer key="simple-transfer" />);
    if (activeScenarios["Multiple Transfer"]) components.push(<MultipleTransfer key="multiple-transfer" />);
    if (activeScenarios["Duplicate Title"]) components.push(<DuplicateTitle key="duplicate-title" />);
    if (activeScenarios["Duplicate Registration"]) components.push(<DuplicateRegistration key="duplicate-registration" />);
    if (activeScenarios["Duplicate Plates & Stickers"]) components.push(<DuplicatePlatesStickers key="duplicate-plates-stickers" />);
    if (activeScenarios["Add Lienholder"]) components.push(<AddLienholder key="add-lienholder" />);
    if (activeScenarios["Remove Lienholder"]) components.push(<RemoveLienholder key="remove-lienholder" />);
    if (activeScenarios["Change of Address"]) components.push(<ChangeOfAddress key="change-of-address" />);
    if (activeScenarios["Commercial Vehicle"]) components.push(<CommercialVehicleTransfer key="commercial-vehicle-transfer" />);
    if (activeScenarios["Salvage"]) components.push(<SalvageTransfer key="salvage-transfer" />);
    if (activeScenarios["Filing for Planned Non-Operation (PNO)"]) components.push(<PlannedNonOperation key="planned-non-operation" />);

    if (activeScenarios["Certificate of Non-Operation"]) components.push(<CertificateOfNonOperation key="restoring-pno" />);

    if (activeScenarios["Disabled Person Placards/Plates"]) components.push(<DisabledPersonPlacards key="disabled-person-placards" />);
    





    
    if (activeScenarios["Duplicate Stickers"]) {
      components.push(<DuplicateStickers 
        key="duplicate-stickers"
      />);
    }
    
    if (activeScenarios["Name Change"]) {
      components.push(<NameChange 
        key="name-change"
      />);
    }
    
    if (activeScenarios["Personalized Plates"]) {
      components.push(<PersonalizedPlates 
        key="personalized-plates"
      />);
    }
    
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