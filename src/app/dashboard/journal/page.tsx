'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { useStreakTracker } from "@/hooks/useStreakTracker"
import StreakDisplay from "@/components/StreakDisplay"

interface JournalEntry {
  _id: string
  emoji: string
  text: string
  timestamp: string
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [error, setError] = useState("")
  const { updateStreak } = useStreakTracker()

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:8000/journal`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        const entriesList: JournalEntry[] = data.journal || []
        setEntries(entriesList)

        // ✅ Check if there's an entry for today
        const today = new Date().toDateString()
        const hasTodayEntry = entriesList.some(entry =>
          new Date(entry.timestamp).toDateString() === today
        )
        if (hasTodayEntry) {
          updateStreak()
        }
      } catch (error) {
        console.error("Failed to fetch journal entries:", error)
      }
    }

    fetchEntries()
  }, [updateStreak])

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-4">
          <Calendar className="h-6 w-6" />
          My Journal Entries
          <StreakDisplay />
        </h1>
        {entries.length === 0 ? (
          <p className="text-muted-foreground">No journal entries yet. Start journaling from the Dashboard!</p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry: JournalEntry) => ( // ✅ typed entry
              <Card key={entry.timestamp}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">
                    <span className="text-2xl mr-2">{entry.emoji}</span>
                    {new Date(entry.timestamp).toLocaleDateString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{entry.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}