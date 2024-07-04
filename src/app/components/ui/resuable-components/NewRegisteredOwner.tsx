"use client";
import React from "react";
import "./NewRegisteredOwner.css";

export default function NewRegisteredOwner() {

    return (
        <div className="outer">
            <div className="inner">
                <h1 className="mainTitle">New Registered Owner(s)</h1>
                <input className="mediumInputBox" placeholder="number of new owners"></input>
            </div>
            <div className="inner">
                <input className="mediumInputBox" placeholder="First name"></input>
                <input className="mediumInputBox" placeholder="Middle name"></input>
                <input className="mediumInputBox" placeholder="Last name"></input>
            </div>
            <div className="inner">
                <input className="mediumInputBox" placeholder="Date of Birth"></input>
                <input className="mediumInputBox" placeholder="Driver License Number"></input>
                <input className="mediumInputBox" placeholder="Address"></input>
            </div>
        </div>
    );
}