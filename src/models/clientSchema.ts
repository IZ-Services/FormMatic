import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  _id: string;
  firstName1: string;
  middleName1: string;
  lastName1: string;
  licenseNumber1: string;
  and1: boolean;
  or1: boolean;
  firstName2: string;
  middleName2: string;
  lastName2: string;
  licenseNumber2: string;
  and2: boolean;
  or2: boolean;
  firstName3: string;
  middleName3: string;
  lastName3: string;
  licenseNumber3: string;
  residentualAddress: string;
  residentualAptSpace: string;
  residentualCity: string;
  residentualState: string;
  residentualZipCode: string;
  mailingAddress: string;
  mailingPoBox: string;
  mailingCity: string;
  mailingState: string;
  mailingZipCode: string;
  vehicleVinNumber: string;
  vehicleLicensePlateNumber: string;
  vehicleMake: string;
  vehicleSaleMonth: string;
  vehicleSaleDay: string;
  vehicleSaleYear: string;
  vehiclePurchasePrice: string;
  gift: boolean;
  trade: boolean;
  transactionType: string;
  timeCreated: Date;
}

const clientSchema = new Schema({
  firstName1: { type: String, required: false },
  middleName1: { type: String, required: false },
  lastName1: { type: String, required: false },
  licenseNumber1: { type: String, required: false },
  and1: { type: Boolean, required: false },
  or1: { type: Boolean, required: false },
  firstName2: { type: String, required: false },
  middleName2: { type: String, required: false },
  lastName2: { type: String, required: false },
  licenseNumber2: { type: String, required: false },
  and2: { type: Boolean, required: false },
  or2: { type: Boolean, required: false },
  firstName3: { type: String, required: false },
  middleName3: { type: String, required: false },
  lastName3: { type: String, required: false },
  licenseNumber3: { type: String, required: false },
  residentualAddress: { type: String, required: false },
  residentualAptSpace: { type: String, required: false },
  residentualCity: { type: String, required: false },
  residentualState: { type: String, required: false },
  residentualZipCode: { type: String, required: false },
  mailingAddress: { type: String, required: false },
  mailingPoBox: { type: String, required: false },
  mailingCity: { type: String, required: false },
  mailingState: { type: String, required: false },
  mailingZipCode: { type: String, required: false },
  vehicleVinNumber: { type: String, required: false },
  vehicleLicensePlateNumber: { type: String, required: false },
  vehicleMake: { type: String, required: false },
  vehicleSaleMonth: { type: String, required: false },
  vehicleSaleDay: { type: String, required: false },
  vehicleSaleYear: { type: String, required: false },
  vehiclePurchasePrice: { type: String, required: false },
  gift: { type: Boolean, required: false },
  trade: { type: Boolean, required: false },
  transactionType: { type: String, required: false },
  timeCreated: { type: Date, default: Date.now },
});

const Client = mongoose.models?.Client || mongoose.model<IClient>('Client', clientSchema);

export default Client;
