"use client"
import { useRouter } from "next/navigation";
import "../globals.css";
import { useAppContext } from "@/context";

export default function Clients() {
	const router = useRouter()
  	const {clients, setFormData, setClients} = useAppContext()!

	const handleEdit = async (clientId: string) => {
        try {
            const clientToEdit = clients.find(client => client._id === clientId);
            if (clientToEdit) {
                setFormData(clientToEdit);
                router.push('/');
            } else {
                alert("Client not found.");
            }
        } catch (error) {
            console.error("Error fetching clients:", error);
            alert("An error occurred while editing the client.");
        }
    };

    const handleDelete = async (clientId: string) => {
        try {
            const response = await fetch(`/api/delete?clientId=${clientId}`, {
                method: 'DELETE',
            });
            
            const data = await response.json();

            setClients(clients.filter(client => client._id !== clientId));
            alert("Client Deleted.");
           
        } catch (error) {
            console.error("Error deleting client:", error);
        }
    };

  return (
        <div className="clients-container">
            <h1>Clients</h1>
            <button className="home-button" onClick={()=>{router.push('/')}}>
                Home
            </button>
            <table className="client-table">
                <thead >
                    <tr>
                        <th>Date</th>
                        <th>First Name</th>
                        <th>Middle Name</th>
                        <th>Last Name</th>
                        <th>Vehicle Vin Number</th>
                        <th>Edit/Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr key={client._id}>
                            <td>{new Date(client.timeCreated).toLocaleString()}</td>
                            <td>{client.firstName1}</td>
                            <td>{client.middleName1}</td>
                            <td>{client.lastName1}</td>
                            <td>{client.vehicleVinNumber}</td>
                            <td>
                                <button className="editanddelete-button" onClick={() => handleEdit(client._id)}>
                                    Edit
                                </button>
                                <button className="editanddelete-button" onClick={() => handleDelete(client._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
