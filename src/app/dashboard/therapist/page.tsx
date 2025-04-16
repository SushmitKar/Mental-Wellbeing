'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain, User, Calendar, Settings, LogOut, Menu, MessageCircle, BarChart3
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

type Patient = {
    name: string;
    mood: string;
    id: string;
  }

export default function TherapistDashboard() {
    const [patients, setPatients] = useState<Patient[]>([])
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

//   // Mock data - replace with API call
//   const patients = [
//     { name: "John Doe", mood: "🙂", id: "1" },
//     { name: "Jane Smith", mood: "😔", id: "2" },
//     { name: "Alex Johnson", mood: "😄", id: "3" },
//   ]

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/patients")
                const data = await res.json()
                setPatients(data)
            } catch(err) {
                console.error("Failed to fetch patients", err)
            }
        }
        fetchPatients() 
    }, [])

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-slate-50 border-r">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Brain className="h-6 w-6 text-purple-500" />
            <span>MindHub</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <div className="px-4 py-2">
            <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight">Therapist Panel</h2>
            <div className="space-y-1">
              <Link href="/dashboard/therapist" className="flex items-center gap-3 rounded-md bg-purple-100 px-3 py-2 text-sm font-medium text-purple-900 transition-all">
                <User className="h-4 w-4" />
                Patients
              </Link>
              <Link href="/dashboard/therapist/appoint" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent">
                <Calendar className="h-4 w-4" />
                Appointments
              </Link>
              <Link href="/dashboard/settings" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </div>
          </div>
        </nav>
        <div className="mt-auto border-t p-4">
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6">
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Therapist Dashboard</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="container py-6 md:py-10">
          <Card>
            <CardHeader>
              <CardTitle>Patient Overview</CardTitle>
              <CardDescription>See mood check-ins and journals</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="rounded-lg border p-4 hover:bg-slate-50 transition cursor-pointer"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <h2 className="text-lg font-semibold">{patient.name}</h2>
                  <p className="text-sm text-muted-foreground">Current Mood: {patient.mood}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {selectedPatient && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{selectedPatient.name}'s Insights</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Replace with actual chart/journal data later */}
                <p className="text-sm text-muted-foreground">
                  Mood chart and journal summaries will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}