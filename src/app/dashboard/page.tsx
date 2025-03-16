import Link from "next/link"
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
} from "lucide-react"
import { MoodChart } from "@/components/mood-tracker/mood-chart"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-slate-50 border-r">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Brain className="h-6 w-6 text-purple-500" />
            <span>MindfulMood</span>
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
                href="#"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
              >
                <BarChart3 className="h-4 w-4" />
                Mood Tracker
              </Link>
              <Link
                href="#"
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
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
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
                    <Button key={i} variant="outline" className="h-12 text-2xl">
                      {emoji}
                    </Button>
                  ))}
                </div>
                <Button className="mt-4 w-full bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" /> Add Journal Entry
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Mood Insights</CardTitle>
                <CardDescription>Your emotional patterns this week</CardDescription>
              </CardHeader>
              <CardContent>
                <MoodChart />
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