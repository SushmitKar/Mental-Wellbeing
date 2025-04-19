"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Sidebar from "@/components/sidebar";
import { updateTherapistProfile } from "@/actions/therapists";

type Profile = {
  name: string;
  specialization: string;
  bio: string;
  photoUrl: string;
  availableSlots: { date: string; time: string }[];
};

export default function TherapistSettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    name: "",
    specialization: "",
    bio: "",
    photoUrl: "",
    availableSlots: [{ date: "", time: "" }],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/dashboard");
      return;
    }

    try {
      const decoded = jwtDecode<{ user_id: string }>(token);
      fetchProfileData(decoded.user_id);
    } catch (error) {
      console.error("Failed to decode token", error);
      router.push("/dashboard");
    }
  }, []);

  const fetchProfileData = async (therapistId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/therapists/${therapistId}/profile`);
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotChange = (index: number, field: string, value: string) => {
    const newSlots = [...profile.availableSlots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setProfile({ ...profile, availableSlots: newSlots });
  };

  const addSlot = () => {
    setProfile({
      ...profile,
      availableSlots: [...profile.availableSlots, { date: "", time: "" }],
    });
  };

  const removeSlot = (index: number) => {
    const newSlots = profile.availableSlots.filter((_, i) => i !== index);
    setProfile({ ...profile, availableSlots: newSlots });
  };

  const handleProfileUpdate = async () => {
    try {
      setError("");
      setSuccess("");
      setIsLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to update profile");
      }

      const decoded = jwtDecode<{ user_id: string }>(token);
      await updateTherapistProfile(decoded.user_id, profile);
      
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Therapist Settings</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <input
                  type="text"
                  value={profile.specialization}
                  onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                  className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL</label>
                <input
                  type="text"
                  value={profile.photoUrl}
                  onChange={(e) => setProfile({ ...profile, photoUrl: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Available Slots</h3>
                {profile.availableSlots.map((slot, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-4">
                    <input
                      type="date"
                      value={slot.date}
                      onChange={(e) => handleSlotChange(index, "date", e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <input
                      type="time"
                      value={slot.time}
                      onChange={(e) => handleSlotChange(index, "time", e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"                    />
                    <button
                      onClick={() => removeSlot(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={addSlot}
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Slot
                </button>
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              {success && (
                <p className="text-green-500 text-sm">{success}</p>
              )}

              <button
                onClick={handleProfileUpdate}
                disabled={isLoading}
                className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
