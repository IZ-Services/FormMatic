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
    firstName2: '',
    middleName2: '',
    lastName2: '',
    licenseNumber2: '',
    firstName3: '',
    middleName3: '',
    lastName3: '',
    licenseNumber3: '',
    mailingAddress: '',
    aptSpace: '',
    city: '',
    state: '',
    zipCode: '',
    vinNumber: '',
    licensePlateNumber: '',
    make: '',
    vehicleState: '',
    vehicleZipCode: ''
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