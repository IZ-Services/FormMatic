'use client';
import React from 'react';
import './NewRegisteredOwner.css';

// export default function NewRegisteredOwner() {
//   return (
//     <div className="outer">
//       <div className="inner">
//         <h1 className="mainTitle">New Registered Owner(s)</h1>
//         <input className="mediumInputBox" placeholder="number of new owners"></input>
//       </div>
//       <div className="inner">
//         <input className="mediumInputBox" placeholder="First name"></input>
//         <input className="mediumInputBox" placeholder="Middle name"></input>
//         <input className="mediumInputBox" placeholder="Last name"></input>
//       </div>
//       <div className="inner">
//         <input className="mediumInputBox" placeholder="Date of Birth"></input>
//         <input className="mediumInputBox" placeholder="Driver License Number"></input>
//         <input className="mediumInputBox" placeholder="Address"></input>
//       </div>
//     </div>
//   );
// }

const NewRegisteredOwners = () => {
  return (
    <div className="new-registered-owners">
      <h2 className="heading">New Registered Owner(s)</h2>
      <div className="form-group">
        <div className="form-item">
          <label>First Name</label>
          <input type="text" placeholder="First Name" />
        </div>
        <div className="form-item">
          <label>Middle Name</label>
          <input type="text" placeholder="Middle Name" />
        </div>
        <div className="form-item">
          <label>Last Name</label>
          <input type="text" placeholder="Last Name" />
        </div>
      </div>
      <div className="form-group">
        <div className="form-item">
          <label>Driver License Number</label>
          <input type="text" placeholder="Driver License Number" />
        </div>
        <div className="form-item">
          <label>State</label>
          <select>
            <option value="">State</option>
            {/* Add other states here */}
          </select>
        </div>
      </div>
      <div className="form-group">
        <div className="form-item">
          <label>Phone Number</label>
          <input type="text" placeholder="Phone Number" />
        </div>
        <div className="form-item">
          <label>Date of Purchase</label>
          <input type="date" placeholder="MM/DD/YYYY" />
        </div>
      </div>
    </div>
  );
};

export default NewRegisteredOwners;