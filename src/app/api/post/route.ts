import connect from "@/lib/mongoDB";
import Client from "@/models/clientSchema";
import { NextResponse } from "next/server";

export async function POST(formData : any ) {
  try {

    await connect();

    const newClient = new Client(formData);
    await newClient.save();

    return NextResponse.json({ status: 'success', message: 'Client saved successfully' });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to save client', error });
  }
}