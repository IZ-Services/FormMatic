import connectDB from "@/lib/mongoDB";
import Client from "@/models/clientSchema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request : NextRequest){
    await connectDB()
    try {
        const { searchParams } = new URL(request.url);
        const vehicleVinNumber = searchParams.get("vehicleVinNumber");
        
        if (!vehicleVinNumber) {
            return NextResponse.json({ error: "VIN number is required" }, { status: 400 });
        }
        
        const client = await Client.findOne({ vehicleVinNumber });
        
        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        return NextResponse.json(client);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
