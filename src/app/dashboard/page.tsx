'use client'

import { MoodTrendChart } from "./mood-tracker/MoodTrendChart"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  BarChart3,
  Calendar,
  MessageCircle,
  Award,
  Settings,
  User,
  Home,
  LogOut,
  Plus,
  ChevronRight,
  Menu,
  Video,
} from "lucide-react"
import { MoodChart } from "@/components/mood-tracker/mood-chart"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { getPatientAppointments } from "@/actions/appointments";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface Appointment {
  id: string;
  therapist_id: string;
  patient_id: string;
  date: string;
  time: string;
  status: string;
  therapist_name?: string;
}

export default function DashboardPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [journalText, setJournalText] = useState("")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const router = useRouter()

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

  const handleJoinCall = (appointmentId: string) => {
    router.push(`/room?appointment=${appointmentId}`);
  };

  const handleSaveEntry = async () => {
    
    if (!selectedMood || !journalText) {
      alert("Please select a mood and write something in the journal.");
      return;
    }
  
    try {
      setIsSaving(true)
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:8000/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emoji: selectedMood,
          text: journalText,
        }),
      });
  
      if (response.ok) {
        alert("Journal entry saved!");
        setSelectedMood(null);
        setJournalText("");
      } else {
        alert("Failed to save entry.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };
  
  const upcomingAppointments = appointments.filter(
    app => app.status === "accepted" && new Date(app.date) >= new Date()
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
            <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight">Dashboard</h2>
            <div className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-md bg-purple-100 px-3 py-2 text-sm font-medium text-purple-900 transition-all hover:text-purple-900"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link
                href="/dashboard/settings/account"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </div>
          </div>
          <div className="px-4 py-2">
            <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight">Features</h2>
            <div className="space-y-1">
              <Link
                href="/dashboard/mood-tracker"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
              >
                <BarChart3 className="h-4 w-4" />
                Mood Tracker
              </Link>
              <Link
                href="/dashboard/journal"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
              >
                <Calendar className="h-4 w-4" />
                Journal
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
              >
                <Award className="h-4 w-4" />
                Achievements
              </Link>
              <Link
                href="/dashboard/get-help"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
              >
                <Calendar className="h-4 w-4" />
                Get Help
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
              >
                <MessageCircle className="h-4 w-4" />
                Community
              </Link>
            </div>
          </div>
        </nav>
        <div className="mt-auto border-t p-4">
          <Link href="/">
            <Button variant="outline" className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6">
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="container py-6 md:py-10">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Daily Check-in</CardTitle>
                <CardDescription>How are you feeling today?</CardDescription>
              </CardHeader>
              <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {["😢", "😔", "😐", "🙂", "😄"].map((emoji, i) => (
                  <Button 
                  key={i} 
                  variant={selectedMood === emoji ? "default" : "outline" }
                  className="h-12 text-2xl"
                  onClick={() => setSelectedMood(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="journal" className="block text-sm font-medium mb-1">
                      Journal Entry
                    </label>
                    <textarea
                      id="journal"
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Write about your day, thoughts, or feelings..."
                      value={journalText}
                      onChange={(e) => setJournalText(e.target.value)}
                    />
                  </div>
                  <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={handleSaveEntry}
                  >
                    Save Today's Entry
                  </Button>
                </div>  
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>Your progress so far</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-green-100 p-2">
                      <Award className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">7-Day Streak</p>
                      <p className="text-xs text-muted-foreground">Completed a week of daily check-ins</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Award className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Journal Master</p>
                      <p className="text-xs text-muted-foreground">Wrote 10 journal entries</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-purple-100 p-2">
                      <Award className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Mood Tracker</p>
                      <p className="text-xs text-muted-foreground">Tracked your mood for 14 days</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardHeader className="pb-2">
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled therapy sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="space-y-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-indigo-100 p-2">
                              <Calendar className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                              </p>
                              <p className="text-xs text-gray-500">
                                {appointment.therapist_name || "Therapist"}
                              </p>
                            </div>
                          </div>
                          <Button
                            className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={() => handleJoinCall(appointment.id)}
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Join Video Call
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-indigo-100 p-2">
                        <Calendar className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">No upcoming sessions</p>
                        <p className="text-xs text-muted-foreground">Book a session to get started</p>
                      </div>
                    </div>
                  )}
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => router.push('/dashboard/get-help')}
                  >
                    Book a Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Tabs defaultValue="insights">
              <TabsList>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
                <TabsTrigger value="journal">Recent Journal</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              <TabsContent value="insights" className="p-4 border rounded-md mt-2">
                <h3 className="text-lg font-semibold mb-2">Your Emotional Patterns</h3>
                <p className="text-muted-foreground mb-4">
                  Based on your recent mood entries, our AI has identified the following patterns:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                    <span>Your mood tends to improve in the afternoons</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                    <span>Journal entries mentioning "exercise" correlate with more positive moods</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                    <span>You've shown consistent improvement in overall mood this month</span>
                  </li>
                </ul>
              </TabsContent>
              <TabsContent value="journal" className="space-y-4 p-4 border rounded-md mt-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Morning Reflection</h4>
                    <span className="text-xs text-muted-foreground">2 days ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Today I woke up feeling anxious about my presentation, but after my morning walk and meditation, I
                    felt much more centered and prepared.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Evening Thoughts</h4>
                    <span className="text-xs text-muted-foreground">3 days ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Had a great day at work! The team meeting went well and I received positive feedback on my project.
                    Feeling accomplished and satisfied.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="recommendations" className="p-4 border rounded-md mt-2">
                <h3 className="text-lg font-semibold mb-2">Personalized Recommendations</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-1">Morning Meditation</h4>
                      <p className="text-sm text-muted-foreground">
                        Based on your patterns, a 10-minute morning meditation could help reduce your anxiety levels.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-1">Evening Journal</h4>
                      <p className="text-sm text-muted-foreground">
                        Try writing in your journal before bed to process the day's emotions and improve sleep quality.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}