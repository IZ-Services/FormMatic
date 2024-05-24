"use client"
import { createContext, useContext, useState } from "react";

const AppContext = createContext({});

export function AppWrapper({ children } :  Readonly<{
  children: React.ReactNode;
}>) {
  const [formData, setFormData] = useState({
    firstName1: '',
    middleName1: '',
    lastName1: '',
    licenseNumber1: '',
    and1: false,
    or1: false,
    firstName2: '',
    middleName2: '',
    lastName2: '',
    licenseNumber2: '',
    and2: false,
    or2: false,
    firstName3: '',
    middleName3: '',
    lastName3: '',
    licenseNumber3: '',
    residentualAddress: '',
    residentualAptSpace: '',
    residentualCity: '',
    residentualState: '',
    residentualZipCode: '',
    mailingAddress: '',
    mailingPoBox: '',
    mailingCity: '',
    mailingState: '',
    mailingZipCode: '',
    vehicleVinNumber: '',
    vehicleLicensePlateNumber: '',
    vehicleMake: '',
    vehicleSaleMonth: '',
    vehicleSaleDay: '',
    vehicleSaleYear: '',
    vehiclePurchasePrice: '',
    gift: false,
    trade: false,
  });

	return(
		<AppContext.Provider value={{ formData, setFormData }}>
			{children}
		</AppContext.Provider>
	)
}

export function useAppContext() {
	return useContext(AppContext)
}