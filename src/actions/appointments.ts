'use server'

import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function bookAppointment(therapistId: string, date: string, time: string) {
  const client = await clientPromise;
  await client.db().collection("appointments").insertOne({
    therapistId: new ObjectId(therapistId),
    patientId: "user_id_here", // Replace with actual patient ID (from session/cookie/etc)
    date,
    time,
    status: "pending"
  });

  revalidatePath("/dashboard/patient/appointments");
}