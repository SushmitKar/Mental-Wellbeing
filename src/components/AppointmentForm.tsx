'use client'

import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

interface Therapist {
  id: string;
  name: string;
  specialization: string;
}

const AppointmentForm = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>('');
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useRef<Toast>(null);

  // Mock therapist data - replace with actual API call
  const therapists: Therapist[] = [
    { id: '1', name: 'Dr. Sarah Johnson', specialization: 'Anxiety & Depression' },
    { id: '2', name: 'Dr. Michael Chen', specialization: 'Trauma & PTSD' },
    { id: '3', name: 'Dr. Emily Rodriguez', specialization: 'Family Therapy' },
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          therapistId: therapist?.id,
          date: date?.toISOString(),
          time,
          description,
        }),
      });

      if (response.ok) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Appointment booked successfully!',
        });
        // Reset form
        setDate(null);
        setTime('');
        setTherapist(null);
        setDescription('');
      } else {
        throw new Error('Failed to book appointment');
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to book appointment. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <Toast ref={toast} />
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Select Therapist</label>
          <Dropdown
            value={therapist}
            options={therapists}
            onChange={(e) => setTherapist(e.value)}
            optionLabel="name"
            placeholder="Select a therapist"
            className="w-full"
            filter
            showClear
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Date</label>
            <Calendar
              value={date}
              onChange={(e) => setDate(e.value as Date)}
              className="w-full"
              minDate={new Date()}
              showIcon
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Time</label>
            <Dropdown
              value={time}
              options={timeSlots}
              onChange={(e) => setTime(e.value)}
              placeholder="Select a time slot"
              className="w-full"
              showClear
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <InputTextarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Please describe what you'd like to discuss..."
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          label={isSubmitting ? 'Booking...' : 'Book Appointment'}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          disabled={isSubmitting || !date || !time || !therapist}
        />
      </form>
    </div>
  );
};

export default AppointmentForm; 