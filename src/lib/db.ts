// src/lib/db.ts
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI as string);

export async function getAppointmentsByTherapistId(therapistId: string) {
  try {
    await client.connect();
    const database = client.db("mental_health");
    const appointmentsCollection = database.collection("appointments");

    const appointments = await appointmentsCollection.find({ therapistId }).toArray();
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  } finally {
    await client.close();
  }
}