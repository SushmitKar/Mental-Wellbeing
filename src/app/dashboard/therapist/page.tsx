"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../../../components/sidebar";
import TherapistSettings from "../../../components/TherapistSettings";

type DecodedToken = {
  email: string;
  role: string;
  user_id: string;
  exp: number;
};

export default function TherapistDashboard() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [profile, setProfile] = useState({
    name: "",
    specialization: "",
    bio: "",
    photoUrl: "",
    availableSlots: [{ date: "", time: "" }],
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "therapist") {
      router.push("/dashboard");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setEmail(decoded.email);

      // Fetch upcoming appointments and messages for the therapist
      fetchUpcomingAppointments();
      fetchMessages();

      // Fetch profile data (you can replace this with an actual API call)
      fetchProfileData(decoded.user_id);
    } catch (error) {
      console.error("Failed to decode token", error);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUpcomingAppointments = async () => {
    // Replace with your actual API call to fetch upcoming appointments
    const appointments = [
      { id: 1, patientName: "John Doe", date: "2025-04-20", time: "10:00 AM" },
      { id: 2, patientName: "Jane Smith", date: "2025-04-22", time: "2:00 PM" },
    ];
    setAppointments(appointments);
  };

  const fetchMessages = async () => {
    // Replace with your actual API call to fetch messages/notifications
    const messages = [
      { id: 1, sender: "Patient", content: "How are you today?" },
      { id: 2, sender: "Patient", content: "Please let me know if you have any available slots." },
    ];
    setMessages(messages);
  };

  const fetchProfileData = async (userId: string) => {
    // Replace with your actual API call to fetch profile data
    const profileData = {
      name: "Dr. John",
      specialization: "Mental Health Specialist",
      bio: "Specialist in mental health.",
      photoUrl: "https://example.com/photo.jpg",
      availableSlots: [{ date: "2025-04-20", time: "10:00 AM" }, { date: "2025-04-22", time: "2:00 PM" }],
    };
    setProfile(profileData);
  };

  const handleProfileUpdate = () => {
    // Replace with actual API call to update profile data
    console.log("Profile updated:", profile);
    setIsEditingProfile(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-500">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <Sidebar />
      <h1 className="text-3xl font-bold mb-4 text-indigo-700">Therapist Dashboard</h1>
      <p className="text-lg text-gray-700 mb-6">
        Welcome, <span className="font-semibold">Dr. {email}</span> 👩‍⚕️
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-indigo-600">Upcoming Appointments</h2>
          {appointments.length > 0 ? (
            <ul className="space-y-4 mt-4">
              {appointments.map((appointment) => (
                <li key={appointment.id} className="border p-4 rounded-lg bg-white shadow-sm">
                  <p className="text-lg font-semibold">{appointment.patientName}</p>
                  <p>{appointment.date} at {appointment.time}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-4">No upcoming appointments.</p>
          )}
        </div>

        {/* Messages */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-indigo-600">Messages</h2>
          {messages.length > 0 ? (
            <ul className="space-y-4 mt-4">
              {messages.map((message) => (
                <li key={message.id} className="border p-4 rounded-lg bg-white shadow-sm">
                  <p className="font-semibold">{message.sender}:</p>
                  <p>{message.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-4">No new messages.</p>
          )}
        </div>
      </div>

      {/* Profile Editing Section */}
      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold text-indigo-600">Profile</h2>
        {isEditingProfile ? (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-3 border rounded-md mt-2"
              />
            </div>

            <div>
              <label className="block text-sm">Specialization</label>
              <input
                type="text"
                value={profile.specialization}
                onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                className="w-full p-3 border rounded-md mt-2"
              />
            </div>

            <div>
              <label className="block text-sm">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full p-3 border rounded-md mt-2"
              />
            </div>

            <div>
              <label className="block text-sm">Photo URL</label>
              <input
                type="text"
                value={profile.photoUrl}
                onChange={(e) => setProfile({ ...profile, photoUrl: e.target.value })}
                className="w-full p-3 border rounded-md mt-2"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold">Available Slots</h3>
              {profile.availableSlots.map((slot, index) => (
                <div key={index} className="flex items-center space-x-4 mt-4">
                  <input
                    type="date"
                    value={slot.date}
                    onChange={(e) => handleSlotChange(index, "date", e.target.value)}
                    className="p-3 border rounded-md"
                  />
                  <input
                    type="time"
                    value={slot.time}
                    onChange={(e) => handleSlotChange(index, "time", e.target.value)}
                    className="p-3 border rounded-md"
                  />
                  <button
                    onClick={() => removeSlot(index)}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addSlot}
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg"
              >
                Add Slot
              </button>
            </div>

            <button
              onClick={handleProfileUpdate}
              className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Specialization:</strong> {profile.specialization}</p>
            <p><strong>Bio:</strong> {profile.bio}</p>
            <p><strong>Photo:</strong> <img src={profile.photoUrl} alt="Profile" className="w-16 h-16 rounded-full" /></p>
            <p><strong>Available Slots:</strong> {profile.availableSlots.map(slot => `${slot.date} at ${slot.time}`).join(", ")}</p>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="mt-4 px-6 py-3 bg-yellow-600 text-white rounded-lg"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
