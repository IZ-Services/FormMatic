"use client"
import { createContext, useContext, useState } from "react";

interface FormData {
    firstName1: string,
    middleName1: string,
    lastName1: string,
    licenseNumber1: string,
    and1: boolean,
    or1: boolean,
    firstName2: string,
    middleName2: string,
    lastName2: string,
    licenseNumber2: string,
    and2: boolean,
    or2: boolean,
    firstName3: string,
    middleName3: string,
    lastName3: string,
    licenseNumber3: string,
    residentualAddress: string,
    residentualAptSpace: string,
    residentualCity: string,
    residentualState: string,
    residentualZipCode: string,
    mailingAddress: string,
    mailingPoBox: string,
    mailingCity: string,
    mailingState: string,
    mailingZipCode: string,
    vehicleVinNumber: string,
    vehicleLicensePlateNumber: string,
    vehicleMake: string,
    vehicleSaleMonth: string,
    vehicleSaleDay: string,
    vehicleSaleYear: string,
    vehiclePurchasePrice: string,
    gift: boolean,
    trade: boolean,
}

type FormDataType = {
  formData: FormData;
  setFormData: (data: FormData) => void; 
}

const AppContext = createContext<FormDataType | null>(null);

export function AppWrapper({ children } :  Readonly<{
  children: React.ReactNode;
}>) {
  const [formData, setFormData] = useState<FormData>({
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