'use client'

import { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';

interface Appointment {
  _id: string;
  patient_id: string;
  patient_name: string;
  patient_email: string;
  date: string;
  time: string;
  status: string;
  description: string;
}

const TherapistDashboard = ({ therapistId }: { therapistId: string }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [feedback, setFeedback] = useState('');
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    fetchAppointments();
  }, [therapistId]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`/api/appointments/therapist/${therapistId}`);
      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments);
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

  const handleStatusUpdate = async (appointmentId: string, status: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: `Appointment ${status} successfully`,
        });
        fetchAppointments();
      } else {
        throw new Error('Failed to update appointment status');
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update appointment status',
      });
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedAppointment || !feedback) return;

    try {
      const response = await fetch(`/api/appointments/${selectedAppointment._id}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback }),
      });

      if (response.ok) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Feedback submitted successfully',
        });
        setShowFeedbackDialog(false);
        setFeedback('');
        setSelectedAppointment(null);
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to submit feedback',
      });
    }
  };

  const statusBodyTemplate = (rowData: Appointment) => {
    return (
      <div className="flex gap-2">
        {rowData.status === 'pending' && (
          <>
            <Button
              label="Approve"
              className="p-button-success"
              onClick={() => handleStatusUpdate(rowData._id, 'approved')}
            />
            <Button
              label="Cancel"
              className="p-button-danger"
              onClick={() => handleStatusUpdate(rowData._id, 'cancelled')}
            />
          </>
        )}
        {rowData.status === 'approved' && (
          <Button
            label="Add Feedback"
            className="p-button-info"
            onClick={() => {
              setSelectedAppointment(rowData);
              setShowFeedbackDialog(true);
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h2 className="text-2xl font-semibold mb-4">Therapist Dashboard</h2>
      
      <div className="mb-4">
        <Calendar
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.value as Date)}
          inline
          showWeek
        />
      </div>

      <DataTable
        value={appointments}
        loading={loading}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        className="p-datatable-striped"
      >
        <Column field="patient_name" header="Patient Name" />
        <Column field="patient_email" header="Patient Email" />
        <Column field="date" header="Date" />
        <Column field="time" header="Time" />
        <Column field="status" header="Status" />
        <Column field="description" header="Description" />
        <Column body={statusBodyTemplate} header="Actions" />
      </DataTable>

      <Dialog
        visible={showFeedbackDialog}
        onHide={() => setShowFeedbackDialog(false)}
        header="Add Feedback"
        style={{ width: '50vw' }}
      >
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="feedback">Feedback</label>
            <InputTextarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              autoResize
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Cancel"
              className="p-button-text"
              onClick={() => setShowFeedbackDialog(false)}
            />
            <Button
              label="Submit"
              onClick={handleFeedbackSubmit}
              disabled={!feedback}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default TherapistDashboard; 