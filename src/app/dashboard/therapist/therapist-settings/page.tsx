import TherapistSettings from "@/components/TherapistSettings";
import Sidebar from "@/components/sidebar";

export default function TherapistSettingsPage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <TherapistSettings />
      </main>
    </div>
  );
}
