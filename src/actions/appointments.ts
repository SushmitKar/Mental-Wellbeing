  'use server'


  export async function bookAppointment(therapistId: string, patientId: string, date: string, time: string) {
    try {
      const response = await fetch('http://localhost:8000/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          therapist_id: therapistId,
          patient_id: patientId,
          date,
          time,
          status: 'pending'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  }

  export async function getTherapistAppointments(therapistId: string) {
    try {
      const response = await fetch(`http://localhost:8000/appointments/therapist/${therapistId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  export async function updateAppointmentStatus(appointmentId: string, status: 'accepted' | 'rejected' | 'completed') {
    try {
      const response = await fetch(`http://localhost:8000/appointments/${appointmentId}/status?status=${status}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update appointment status");
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }

  export async function getPatientAppointments(patientId: string) {
    try {
      const response = await fetch(`http://localhost:8000/appointments/patient/${patientId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }