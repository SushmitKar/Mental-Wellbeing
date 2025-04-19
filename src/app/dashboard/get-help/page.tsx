import { getTherapists } from "@/actions/therapists";
import TherapistCard from "./TherapistCard";

interface Therapist {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  photoUrl: string;
  availableSlots: { date: string; time: string }[];
}

export default async function GetHelpPage() {
  const therapists = await getTherapists();
  console.log("Therapists fetched:", therapists);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Therapists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {therapists.map((t: Therapist) => (
          <TherapistCard key={t.id} therapist={t} />
        ))}
      </div>
    </div>
  );
}