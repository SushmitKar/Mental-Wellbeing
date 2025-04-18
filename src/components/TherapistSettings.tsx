"use client";

import { useEffect, useState } from "react";

type Slot = { date: string; time: string };

export default function TherapistSettings() {
  const [profile, setProfile] = useState({
    name: "",
    specialization: "",
    bio: "",
    photoUrl: "",
    availableSlots: [{ date: "", time: "" }],
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      // Replace with actual API
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

    fetchProfile();
  }, []);

  const updateSlot = (index: number, field: keyof Slot, value: string) => {
    const updatedSlots = [...profile.availableSlots];
    updatedSlots[index][field] = value;
    setProfile({ ...profile, availableSlots: updatedSlots });
  };

  const addSlot = () => {
    setProfile({
      ...profile,
      availableSlots: [...profile.availableSlots, { date: "", time: "" }],
    });
  };

  const removeSlot = (index: number) => {
    setProfile({
      ...profile,
      availableSlots: profile.availableSlots.filter((_, i) => i !== index),
    });
  };

  const saveChanges = () => {
    // API call here
    console.log("Saving profile:", profile);
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Therapist Settings</h2>

      {isEditing ? (
        <div className="space-y-4">
          <input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full p-3 border rounded-md"
            placeholder="Name"
          />
          <input
            value={profile.specialization}
            onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
            className="w-full p-3 border rounded-md"
            placeholder="Specialization"
          />
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full p-3 border rounded-md"
            placeholder="Bio"
          />
          <input
            value={profile.photoUrl}
            onChange={(e) => setProfile({ ...profile, photoUrl: e.target.value })}
            className="w-full p-3 border rounded-md"
            placeholder="Photo URL"
          />

          <h3 className="text-lg font-semibold">Available Slots</h3>
          {profile.availableSlots.map((slot, idx) => (
            <div key={idx} className="flex gap-4 items-center">
              <input
                type="date"
                value={slot.date}
                onChange={(e) => updateSlot(idx, "date", e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="time"
                value={slot.time}
                onChange={(e) => updateSlot(idx, "time", e.target.value)}
                className="p-2 border rounded"
              />
              <button onClick={() => removeSlot(idx)} className="text-red-500">Remove</button>
            </div>
          ))}

          <button onClick={addSlot} className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
            Add Slot
          </button>

          <button onClick={saveChanges} className="bg-green-600 text-white px-6 py-2 mt-4 rounded">
            Save Changes
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Specialization:</strong> {profile.specialization}</p>
          <p><strong>Bio:</strong> {profile.bio}</p>
          {/* <img src={profile.photoUrl} alt="Profile" className="w-16 h-16 rounded-full" /> */}
          <p>
            <strong>Available Slots:</strong> {profile.availableSlots.map(slot => `${slot.date} at ${slot.time}`).join(", ")}
          </p>
          <button onClick={() => setIsEditing(true)} className="bg-yellow-600 text-white px-6 py-2 rounded">
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}
