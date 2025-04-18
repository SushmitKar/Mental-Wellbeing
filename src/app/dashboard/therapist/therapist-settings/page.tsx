"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";

type Profile = {
  name: string;
  specialization: string;
  bio: string;
  photoUrl: string;
  availableSlots: { date: string; time: string }[];
};

export default function TherapistSettingsPage() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    specialization: "",
    bio: "",
    photoUrl: "",
    availableSlots: [{ date: "", time: "" }],
  });

  useEffect(() => {
    // Fetch profile data (replace with actual API call)
    const fetchProfileData = async () => {
      const profileData = {
        name: "Dr. John",
        specialization: "Mental Health Specialist",
        bio: "Specialist in mental health.",
        photoUrl: "https://example.com/photo.jpg",
        availableSlots: [
          { date: "2025-04-20", time: "10:00 AM" },
          { date: "2025-04-22", time: "2:00 PM" },
        ],
      };
      setProfile(profileData);
    };

    fetchProfileData();
  }, []);

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

  const handleProfileUpdate = () => {
    // Replace with actual API call to update profile data
    console.log("Profile updated:", profile);
  };

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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <input
                  type="text"
                  value={profile.specialization}
                  onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL</label>
                <input
                  type="text"
                  value={profile.photoUrl}
                  onChange={(e) => setProfile({ ...profile, photoUrl: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type="time"
                      value={slot.time}
                      onChange={(e) => handleSlotChange(index, "time", e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
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

              <button
                onClick={handleProfileUpdate}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
