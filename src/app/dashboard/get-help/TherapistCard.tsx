"use client";

import { useState } from "react";
import { bookAppointment } from "@/actions/appointments";

export default function TherapistCard({ therapist }: any) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleBook = async () => {
    await bookAppointment(therapist._id, date, time); // Therapist ID passed from the therapist card
    alert("Appointment Requested!");
  };

  return (
    <div className="border p-4 rounded shadow">
      <img src={therapist.photo} className="w-16 h-16 rounded-full" alt="Therapist" />
      <h2 className="text-xl font-semibold">{therapist.name}</h2>
      <p className="text-gray-600">{therapist.specialization}</p>
      <p className="text-gray-600">{therapist.bio}</p>

      {/* Calendar for date selection */}
      <input type="date" onChange={(e) => setDate(e.target.value)} className="my-2" />
      
      {/* Time slot dropdown */}
      <select onChange={(e) => setTime(e.target.value)} className="mb-2">
        <option value="">Select Time</option>
        {therapist.availableSlots?.[date]?.map((slot: string) => (
          <option key={slot} value={slot}>{slot}</option>
        ))}
      </select>

      <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={handleBook}>
        Book Appointment
      </button>
    </div>
  );
}