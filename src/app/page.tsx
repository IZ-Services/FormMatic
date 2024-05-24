"use client"
import {createContext, useContext, useState} from "react"
import "./globals.css";

export default function Home() {
  

  const [addSecondRegisteredOwner, setAddSecondRegisteredOwner] = useState(false)
  const [addThirdRegisteredOwner, setAddThirdRegisteredOwner] = useState(false)

  const handleClickAddSecondRegisteredOwner = () => {
    setAddSecondRegisteredOwner(true)
  }

  const handleClickAddThirdRegisteredOwner = () => {
    setAddThirdRegisteredOwner(true)
  }

  const handleClickRemoveSecondRegisteredOwner = () => {
    setAddSecondRegisteredOwner(false)
  }
  
  const handleClickRemoveThirdRegisteredOwner = () => {
    setAddThirdRegisteredOwner(false)
  }
  return (
    <div>
      <div className="centerContainer">
        <input className="inputSearch" placeholder="Search..."></input>
        <button className="buttonSearch" style={{marginLeft: "5px"}}>Search Customer</button>
      </div> 

      <div className="middleContainer">
        <h3 className="title">
          Registered Owner #1
          <button 
            style={{ marginLeft: "10px" }} 
            onClick={handleClickAddSecondRegisteredOwner}
          > 
            Add Registered Owner
          </button>
        </h3>
        
        <label style={{marginLeft: "10px"}}>First Name</label>
        <input className="inputData"></input>

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>Middle Name</label>
        <input className="inputData"></input>

        <label style={{ marginLeft: "10px", marginTop:"10px" }}>Last Name</label>
        <input className="inputData"></input>

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>Driver License Number</label>
        <input className="inputData"></input>
        
        {addSecondRegisteredOwner && (
          <>
            <h3 className="title">
              Registered Owner #2
              <button
                style={{ marginLeft: "10px" }}
                onClick={handleClickAddThirdRegisteredOwner}
              >
                Add Registered Owner
              </button>
              <button 
                style={{ color: "red", marginLeft: "10px" }}
                onClick={handleClickRemoveSecondRegisteredOwner}
              >
                Remove Registered Owner
              </button>
            </h3>

            <label style={{marginBottom: "3px"}}>
              <input
                type="radio"
                value="AND"
                name="secondOwnershipType"
              />
              AND
            </label>
            
            <label style={{ marginBottom: "5px" }}>
              <input
                type="radio"
                value="OR"
                name="secondOwnershipType"
              />
              OR
            </label>

            <label style={{ marginLeft: "10px" }}>First Name</label>
            <input className="inputData"></input>

            <label style={{ marginLeft: "10px", marginTop: "10px" }}>Middle Name</label>
            <input className="inputData"></input>

            <label style={{ marginLeft: "10px", marginTop: "10px" }}>Last Name</label>
            <input className="inputData"></input>

            <label style={{ marginLeft: "10px", marginTop: "10px" }}>Driver License Number</label>
            <input className="inputData"></input>
          </>
        )}

        {addThirdRegisteredOwner && (
          <>
            <h3 className="title">
              Registered Owner #3
              <button
                style={{ marginLeft: "10px" }}
              >
                Add Registered Owner
              </button>
              <button
                style={{ color: "red",marginLeft: "10px" }}
                onClick={handleClickRemoveThirdRegisteredOwner}
              >
                Remove Registered Owner
              </button>
            </h3>

            <label style={{ marginBottom: "3px" }}>
              <input
                type="radio"
                value="AND"
                name="thirdOwnershipType"
              />
              AND
            </label>

            <label style={{ marginBottom: "5px" }}>
              <input
                type="radio"
                value="OR"
                name="thirdOwnershipType"
              />
              OR
            </label>

            <label style={{ marginLeft: "10px" }}>First Name</label>
            <input className="inputData"></input>

            <label style={{ marginLeft: "10px", marginTop: "10px" }}>Middle Name</label>
            <input className="inputData"></input>

            <label style={{ marginLeft: "10px", marginTop: "10px" }}>Last Name</label>
            <input className="inputData"></input>

            <label style={{ marginLeft: "10px", marginTop: "10px" }}>Driver License Number</label>
            <input className="inputData"></input>
          </>
        )}

        <h3 className="title">
          Residence Or Business Address
        </h3>

        <label style={{ marginLeft: "10px" }}>Mailing Address</label>
        <input className="inputData"></input>

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>APT/SPACE/STE#</label>
        <input className="inputData"></input>

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>City</label>
        <input className="inputData"></input>

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>State</label>
        <input className="inputData"></input>

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>Zip Code</label>
        <input className="inputData"></input>

        <h3 className="title">
          Vehicle Information
        </h3>

        <label style={{ marginLeft: "10px" }}>VIN Number</label>
        <input className="inputData"></input>

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>License Plate Number</label>
        <input className="inputData"></input>

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>Make</label>
        <input className="inputData"></input>

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>State</label>
        <input className="inputData"></input>

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>Zip Code</label>
        <input className="inputData"></input>
      </div>



      <div className="bottomContainer">
        <button className="buttonNewCustomer">Save</button>
      </div>

    </div>
  );
}
