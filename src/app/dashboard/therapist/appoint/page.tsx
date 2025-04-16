'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Calendar, Clock, User, XCircle } from "lucide-react"

type Appointment = {
  id: string
  patient: string
  date: string
  time: string
  status: 'Upcoming' | 'Completed' | 'Canceled'
}

const dummyAppointments: Appointment[] = [
  {
    id: "1",
    patient: "John Doe",
    date: "2025-04-20",
    time: "10:30 AM",
    status: "Upcoming",
  },
  {
    id: "2",
    patient: "Jane Smith",
    date: "2025-04-14",
    time: "04:00 PM",
    status: "Completed",
  },
  {
    id: "3",
    patient: "Alex Johnson",
    date: "2025-04-22",
    time: "02:00 PM",
    status: "Upcoming",
  },
]

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(dummyAppointments)

  const cancelAppointment = (id: string) => {
    setAppointments(prev =>
      prev.map(appt =>
        appt.id === id ? { ...appt, status: "Canceled" } : appt
      )
    )
  }

  return (
    <div className="container py-6 md:py-10">
      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
          <CardDescription>Manage and view upcoming and past appointments.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="border rounded-lg p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2 bg-white shadow-sm"
            >
              <div className="space-y-1">
                <p className="font-medium text-lg flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {appt.patient}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {appt.date}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {appt.time}
                </p>
                <p className={`text-sm font-semibold ${appt.status === "Canceled" ? "text-red-500" : appt.status === "Completed" ? "text-green-600" : "text-blue-600"}`}>
                  Status: {appt.status}
                </p>
              </div>

              {appt.status === "Upcoming" && (
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => cancelAppointment(appt.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button size="sm" variant="outline">
                    Reschedule
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}