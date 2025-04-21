// 'use client';
// import React from 'react';
// import { useScenarioContext } from '../../context/ScenarioContext';
// import NameCorrection from './NameCorrection';
// import LegalNameChange from './LegalnameChange';
// import NameDiscrepancy from './NameDiscrepancy';

// interface NameStatementProps {
//   formData?: any;
// }

// const NameStatement: React.FC<NameStatementProps> = ({ formData }) => {
//   const { activeSubOptions } = useScenarioContext();
  
//   // Determine which component to render based on active sub-options
//   const renderNameComponent = () => {
//     if (activeSubOptions['Name Change-Name Correction']) {
//       return <NameCorrection />;
//     } else if (activeSubOptions['Name Change-Legal Name Change']) {
//       return <LegalNameChange />;
//     } else if (activeSubOptions['Name Change-Name Discrepancy']) {
//       return <NameDiscrepancy />;
//     }
    
//     // Default to NameCorrection if nothing is selected
//     return <NameCorrection />;
//   };
  
//   return (
//     <div>
//       {renderNameComponent()}
//     </div>
//   );
// };

// export default NameStatement;