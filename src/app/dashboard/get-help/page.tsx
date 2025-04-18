import { getTherapists } from "@/actions/therapists";
import TherapistCard from "./TherapistCard";

export default async function GetHelpPage() {
  const therapists = await getTherapists();
  console.log("Therapists fetched:", therapists);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Therapists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {therapists.map((t) => (
          <TherapistCard key={t._id} therapist={t} />
        ))}
      </div>
    </div>
  );
}