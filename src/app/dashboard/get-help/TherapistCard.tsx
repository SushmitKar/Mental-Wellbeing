"use client";

import { useState, useEffect } from "react";
import { bookAppointment, getPatientAppointments } from "@/actions/appointments";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface Therapist {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  photoUrl: string;
  availableSlots: { date: string; time: string }[];
}

interface Appointment {
  id: string;
  therapist_id: string;
  patient_id: string;
  date: string;
  time: string;
  status: string;
}

interface TherapistCardProps {
  therapist: Therapist;
}

export default function TherapistCard({ therapist }: TherapistCardProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode<{ user_id: string }>(token);
        const patientId = decoded.user_id;
        const data = await getPatientAppointments(patientId);
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, []);

  const handleBook = async () => {
    try {
      setIsBooking(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to book an appointment");
      }

      const decoded = jwtDecode<{ user_id: string }>(token);
      const patientId = decoded.user_id;

      await bookAppointment(therapist.id, patientId, selectedDate, selectedTime);
      alert("Appointment requested successfully!");
      
      // Reset form
      setSelectedDate("");
      setSelectedTime("");
      
      // Refresh appointments
      const data = await getPatientAppointments(patientId);
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to book appointment");
    } finally {
      setIsBooking(false);
    }
  };

  const handleJoinCall = (appointmentId: string) => {
    router.push(`/dashboard/video-room?appointment=${appointmentId}`);
  };

  const availableTimes = therapist.availableSlots
    .filter(slot => slot.date === selectedDate)
    .map(slot => slot.time);

  const currentAppointment = appointments.find(
    app => app.therapist_id === therapist.id && app.status === "accepted"
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <img
          src={therapist.photoUrl || "/default-avatar.png"}
          alt={therapist.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{therapist.name}</h3>
          <p className="text-indigo-600">{therapist.specialization}</p>
        </div>
      </div>

      <p className="text-gray-600">{therapist.bio}</p>

      {currentAppointment ? (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 font-medium">Accepted Appointment</p>
            <p className="text-sm text-green-600">
              {new Date(currentAppointment.date).toLocaleDateString()} at {currentAppointment.time}
            </p>
          </div>
          <button
            onClick={() => handleJoinCall(currentAppointment.id)}
            className="w-full py-2 px-4 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Join Video Call
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Time
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-2 border border-gray-300 bg-white text-gray-800 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"            
              >
                <option value="">Select a time</option>
                {availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            onClick={handleBook}
            disabled={!selectedDate || !selectedTime || isBooking}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              !selectedDate || !selectedTime || isBooking
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isBooking ? "Booking..." : "Book Appointment"}
          </button>
        </div>
      )}
    </div>
  );
}