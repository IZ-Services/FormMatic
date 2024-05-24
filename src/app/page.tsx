"use client"
import {createContext, useContext, useState} from "react"
import "./globals.css";
import { useAppContext } from "@/context";

export default function Home() {
  
  const {formData, setFormData } = useAppContext()

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
        <input className="inputData" value={formData.firstName1} onChange={(e) => setFormData({ ...formData, firstName1: e.target.value })} />

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>Middle Name</label>
        <input className="inputData" value={formData.middleName1} onChange={(e) => setFormData({ ...formData, middleName1: e.target.value })} />

        <label style={{ marginLeft: "10px", marginTop:"10px" }}>Last Name</label>
        <input className="inputData" value={formData.lastName1} onChange={(e) => setFormData({ ...formData, lastName1: e.target.value })} />

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>Driver License Number</label>
        <input className="inputData" value={formData.licenseNumber1} onChange={(e) => setFormData({ ...formData, licenseNumber1: e.target.value })} />
        
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
            <input className="inputData" value={formData.firstName2} onChange={(e) => setFormData({ ...formData, firstName2: e.target.value })} />

            <label style={{ marginLeft: "10px", marginTop: "10px" }}>Middle Name</label>
            <input className="inputData" value={formData.middleName2} onChange={(e) => setFormData({ ...formData, middleName2: e.target.value })} />

            <label style={{ marginLeft: "10px", marginTop: "10px" }}>Last Name</label>
            <input className="inputData" value={formData.lastName2} onChange={(e) => setFormData({ ...formData, lastName2: e.target.value })} />

            <label style={{ marginLeft: "10px", marginTop: "10px" }}>Driver License Number</label>
            <input className="inputData" value={formData.licenseNumber2} onChange={(e) => setFormData({ ...formData, licenseNumber2: e.target.value })} />
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
            <input className="inputData" value={formData.firstName3} onChange={(e) => setFormData({ ...formData, firstName3: e.target.value })} />

            <label style={{ marginLeft: "10px", marginTop: "10px" }}>Middle Name</label>
            <input className="inputData" value={formData.middleName3} onChange={(e) => setFormData({ ...formData, middleName3: e.target.value })} />

            <label style={{ marginLeft: "10px", marginTop: "10px" }}>Last Name</label>
            <input className="inputData" value={formData.lastName3} onChange={(e) => setFormData({ ...formData, lastName3: e.target.value })} />

            <label style={{ marginLeft: "10px", marginTop: "10px" }}>Driver License Number</label>
            <input className="inputData" value={formData.licenseNumber3} onChange={(e) => setFormData({ ...formData, licenseNumber3: e.target.value })} />
          </>
        )}

        <h3 className="title">
          Residence Or Business Address
        </h3>

        <label style={{ marginLeft: "10px" }}>Residence/Business Address</label>
        <input className="inputData" value={formData.mailingAddress} onChange={(e) => setFormData({ ...formData, mailingAddress: e.target.value })} />

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>APT/SPACE/STE#</label>
        <input className="inputData" value={formData.aptSpace} onChange={(e) => setFormData({ ...formData, aptSpace: e.target.value })} />

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>City</label>
        <input className="inputData"></input>

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>State</label>
        <input className="inputData"></input>

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>Zip Code</label>
        <input className="inputData"></input>

        <h3 className="title">
          Mailing Address
        </h3>

        <label style={{ marginLeft: "10px" }}>Mailing   Address</label>
        <input className="inputData"></input>

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>PO Box</label>
        <input className="inputData"></input>

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>City</label>
        <input className="inputData" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>State</label>
        <input className="inputData" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>Zip Code</label>
        <input className="inputData" value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} />

        <h3 className="title">
          Vehicle Information
        </h3>

        <label style={{ marginLeft: "10px" }}>VIN Number</label>
        <input className="inputData" value={formData.vinNumber} onChange={(e) => setFormData({ ...formData, vinNumber: e.target.value })} />

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>License Plate Number</label>
        <input className="inputData" value={formData.licensePlateNumber} onChange={(e) => setFormData({ ...formData, licensePlateNumber: e.target.value })} />

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>Make</label>
        <input className="inputData" value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} />

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>Seller Date: Month</label>
        <input className="smallInputData"></input>
        
        <label style={{ marginLeft: "10px", marginTop: "10px" }}>Seller Date: Day</label>
        <input className="smallInputData" value={formData.vehicleState} onChange={(e) => setFormData({ ...formData, vehicleState: e.target.value })} />

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>Seller Date: Year</label>
        <input className="smallInputData"></input>

        <label style={{ marginLeft: "10px", marginTop: "10px" }}>Purchase Price</label>
        <input className="inputData" value={formData.vehicleZipCode} onChange={(e) => setFormData({ ...formData, vehicleZipCode: e.target.value })} />
      </div>
      
      <div style={{marginTop: "15px"}}>
        <label>
          <input
            type="radio"
            value="Gift"
            name="GiftOrTrade"
          />
          GIFT
        </label>
              
        <label>
          <input
            type="radio"
            value="Trade"
            name="GiftOrTrade"
          />
          TRADE
        </label>      
      </div>

      <div className="bottomContainer">
        <button className="buttonNewCustomer">Save</button>
      </div>

    </div>
  );
}
