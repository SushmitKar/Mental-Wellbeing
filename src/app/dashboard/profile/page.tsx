import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MoodHistory from "@/components/mood-tracker/MoodHistory"
// import UploadMood from "@/components/mood-tracker/uploadMood"
// <UploadMood />
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
  Upload,
  Edit,
  Menu,
  Plus,
} from "lucide-react"
import { MoodChart } from "@/components/mood-tracker/mood-chart"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const userId = "user123"; // Replace with authenticated user ID
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
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 rounded-md bg-purple-100 px-3 py-2 text-sm font-medium text-purple-900 transition-all hover:text-purple-900"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link
                href="/dashboard/settings"
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
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Profile</h1>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </div>
        <div className="container py-6 md:py-10">
          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                      <User className="h-12 w-12 text-slate-400" />
                    </div>
                    <Button size="icon" variant="outline" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                      <Upload className="h-4 w-4" />
                      <span className="sr-only">Upload avatar</span>
                    </Button>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                      <h2 className="text-2xl font-bold">John Doe</h2>
                      <Link href="/dashboard/profile/edit">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Edit className="h-3.5 w-3.5" />
                          Edit Profile
                        </Button>
                      </Link>
                    </div>
                    <p className="text-muted-foreground mb-4">Member since March 2023</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                        Consistent
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                        Mindful
                      </Badge>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                        Reflective
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
                        <div className="container mx-auto px-4">
                          <h1 className="text-3xl font-bold mb-6">My Mood History</h1>
                          <MoodHistory userId={userId} />
                        </div>
                      </main>
                </CardHeader>
                <CardContent>
                  {/* <div className="h-[300px]">
                    <MoodChart />
                  </div> */}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Your progress badges</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className={`rounded-full p-3 ${i <= 3 ? "bg-purple-100" : "bg-slate-100"}`}>
                          <Award className={`h-6 w-6 ${i <= 3 ? "text-purple-600" : "text-slate-400"}`} />
                        </div>
                        <span className="text-xs text-center">{i <= 3 ? "Level " + i : "Locked"}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Insights</CardTitle>
                <CardDescription>AI-generated analysis based on your mood data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-2">Mood Patterns</h3>
                  <p className="text-sm text-blue-700">
                    Your mood tends to be most positive in the mornings and gradually decreases throughout the day.
                    Consider adding an evening relaxation routine to maintain your positive energy.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-md">
                  <h3 className="font-medium text-green-800 mb-2">Journal Insights</h3>
                  <p className="text-sm text-green-700">
                    When you mention "exercise" or "meditation" in your journal, your mood scores are 30% higher on
                    average. These activities appear to have a significant positive impact on your wellbeing.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-md">
                  <h3 className="font-medium text-purple-800 mb-2">Progress Highlights</h3>
                  <p className="text-sm text-purple-700">
                    You've shown consistent improvement in managing stress over the past month. Your anxiety scores have
                    decreased by 15% compared to when you first started.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
