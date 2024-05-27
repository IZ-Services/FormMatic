import connect from "@/lib/mongoDB";
import Client from "@/models/clientSchema";

export async function GET(){
	await connect()
	try{
		const client = await Client.find({})
        return { status: "success", message: "Connection successful" };

	} catch(error){
        return { status: "error", message: "Connection failed" };
	}
}