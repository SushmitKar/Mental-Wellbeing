'use client'

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Trophy, User } from "lucide-react"

interface UserEntry {
  username: string
  streak: number
  xp: number
}

export default function Leaderboard() {
  const [users, setUsers] = useState<UserEntry[]>([])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("http://localhost:8000/leaderboard")
        const data = await res.json()
        setUsers(data.users || [])
      } catch (err) {
        console.error("Failed to fetch leaderboard", err)
      }
    }

    fetchLeaderboard()
  }, [])

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Trophy className="text-yellow-500" /> Leaderboard
      </h1>

      <div className="space-y-3">
        {users.map((user, index) => (
          <Card key={user.username} className="p-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-700">#{index + 1}</span>
              <User className="text-gray-500" />
              <span className="text-lg">{user.username}</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <span>🔥 {user.streak}d</span>
              <span>⭐ {user.xp} XP</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
