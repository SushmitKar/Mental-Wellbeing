"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Sidebar from "@/components/sidebar";
import { getTherapistAppointments, updateAppointmentStatus } from "@/actions/appointments";

interface Appointment {
  id: string;
  patient_id: string;
  date: string;
  time: string;
  status: string;
  created_at: string;
}

export default function TherapistAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/dashboard");
      return;
    }

    try {
      const decoded = jwtDecode<{ user_id: string }>(token);
      fetchAppointments(decoded.user_id);
    } catch (error) {
      console.error("Failed to decode token", error);
      router.push("/dashboard");
    }
  }, []);

  const fetchAppointments = async (therapistId: string) => {
    try {
      const data = await getTherapistAppointments(therapistId);
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId: string, status: 'accepted' | 'rejected' | 'completed') => {
    try {
      setError("");
      await updateAppointmentStatus(appointmentId, status);
      
      // Refresh appointments
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode<{ user_id: string }>(token);
        fetchAppointments(decoded.user_id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update appointment status");
    }
  };

  const joinVideoCall = (appointmentId: string) => {
    router.push(`/room?appointment=${appointmentId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading appointments...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Appointments</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {appointments.length === 0 ? (
              <p className="text-gray-500">No appointments found.</p>
            ) : (
              appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Appointment with Patient
                      </h3>
                      <p className="text-gray-600">
                        {new Date(appointment.date).toLocaleDateString()} at{" "}
                        {appointment.time}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Status:{" "}
                        <span
                          className={`font-medium ${
                            appointment.status === "accepted"
                              ? "text-green-600"
                              : appointment.status === "rejected"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      {appointment.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(appointment.id, "accepted")}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(appointment.id, "rejected")}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {appointment.status === "accepted" && (
                        <>
                          <button
                            onClick={() => joinVideoCall(appointment.id)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            Join Call
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(appointment.id, "completed")}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Mark Complete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 