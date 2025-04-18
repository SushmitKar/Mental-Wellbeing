"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../../../components/sidebar";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome, Dr. {email}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Appointments</h2>
              {appointments.length > 0 ? (
                <ul className="space-y-4">
                  {appointments.map((appointment) => (
                    <li key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <p className="text-lg font-semibold text-gray-800">{appointment.patientName}</p>
                      <p className="text-gray-600">{appointment.date} at {appointment.time}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No upcoming appointments.</p>
              )}
            </div>

            {/* Messages */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Messages</h2>
              {messages.length > 0 ? (
                <ul className="space-y-4">
                  {messages.map((message) => (
                    <li key={message.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <p className="font-semibold text-gray-800">{message.sender}:</p>
                      <p className="text-gray-600">{message.content}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No new messages.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
