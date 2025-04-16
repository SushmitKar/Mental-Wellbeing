'use client';

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

interface Appointment {
  id: string;
  title: string;
  start: string;
  end: string;
  status: 'pending' | 'approved' | 'cancelled'; // Explicitly typing the status
  description: string;
}

interface AppointmentCalendarProps {
  userId: string;
  userType: 'patient' | 'therapist';
}

const AppointmentCalendar = ({ userId, userType }: AppointmentCalendarProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  const fetchAppointments = async () => {
    try {
      const endpoint = userType === 'patient' 
        ? `/api/appointments/patient/${userId}`
        : `/api/appointments/therapist/${userId}`;
      
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        const formattedAppointments = data.appointments.map((appointment: any) => ({
          id: appointment._id,
          title: userType === 'patient' 
            ? `Session with ${appointment.therapist_name}`
            : `Session with ${appointment.patient_name}`,
          start: `${appointment.date}T${appointment.time}`,
          end: `${appointment.date}T${appointment.time}`,
          status: appointment.status, // Ensure status matches 'pending', 'approved', or 'cancelled'
          description: appointment.description,
        }));
        setAppointments(formattedAppointments);
      } else {
        throw new Error('Failed to fetch appointments');
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch appointments',
      });
    } finally {
      setLoading(false);
    }
  };

  const eventContent = (eventInfo: any) => {
    const statusColors: Record<'pending' | 'approved' | 'cancelled', string> = {  // Define the object with exact status keys
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    const status = eventInfo.event.extendedProps.status as 'pending' | 'approved' | 'cancelled'; // Cast status to the correct type

    return (
      <div className={`p-2 rounded ${statusColors[status]}`}>
        <div className="font-semibold">{eventInfo.event.title}</div>
        <div className="text-sm">{eventInfo.timeText}</div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <Toast ref={toast} />
      <h2 className="text-2xl font-semibold mb-4">Your Appointments</h2>
      <div className="h-[600px]">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={appointments}
          eventContent={eventContent}
          eventClick={(info) => {
            toast.current?.show({
              severity: 'info',
              summary: info.event.title,
              detail: info.event.extendedProps.description,
            });
          }}
          selectable={userType === 'therapist'}
          select={(info) => {
            // Handle new appointment creation for therapists
            console.log('Selected time:', info.startStr, info.endStr);
          }}
          loading={(isLoading) => {
            setLoading(isLoading);
          }}
        />
      </div>
    </div>
  );
};

export default AppointmentCalendar;