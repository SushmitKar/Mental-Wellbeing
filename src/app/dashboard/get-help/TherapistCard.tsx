"use client";

import { useState } from "react";
import { bookAppointment } from "@/actions/appointments";
import { jwtDecode } from "jwt-decode";

interface Therapist {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  photoUrl: string;
  availableSlots: { date: string; time: string }[];
}

interface TherapistCardProps {
  therapist: Therapist;
}

export default function TherapistCard({ therapist }: TherapistCardProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState("");

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to book appointment");
    } finally {
      setIsBooking(false);
    }
  };

  const availableTimes = therapist.availableSlots
    .filter(slot => slot.date === selectedDate)
    .map(slot => slot.time);

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
    </div>
  );
}