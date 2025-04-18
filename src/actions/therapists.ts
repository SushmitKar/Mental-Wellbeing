import clientPromise from "@/lib/mongodb";

export async function getTherapists() {
  
  const client = await clientPromise;
  const db = client.db("mental_health");

  const therapists = await db
    .collection("users")
    .find({ role: "therapist" })
    .toArray();

  return therapists.map((t) => ({
    ...t,
    _id: t._id.toString(),
  }));
}