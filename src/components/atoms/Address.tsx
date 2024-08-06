'use client';
import React from 'react';
import './Address.css';

export default function Address() {
  return (
	<>
		<h1 className="addressHeading">Address</h1>
		<div>
			<h3>Street</h3>
	    	<input className="streetInput" placeholder="Street"></input>
		</div>
		<div>
			<h3>APT./SPACE/STE.#</h3>
	    	<input className="aptInput" placeholder="APT./SPACE/STE.#"></input>
		</div>
		<div>
			<h3>City</h3>
	    	<input className="cityInput" placeholder="City"></input>
		</div>
		<div>
			<h3>State</h3>
	    	<input className="stateInput" placeholder="APT./SPACE/STE.#"></input>
		</div>
		<div>
			<h3>Zip Code</h3>
	    	<input className="zipInput" placeholder="Zip Code"></input>
		</div>
	</>
  );
}
