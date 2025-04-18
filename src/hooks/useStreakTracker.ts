import { useEffect, useState } from "react"

export const useStreakTracker = () => {
  const [streak, setStreak] = useState<number>(0)
  const [xp, setXp] = useState<number>(0)

  useEffect(() => {
    const storedStreak = localStorage.getItem("streak")
    const storedXp = localStorage.getItem("xp")

    if (storedStreak) {
      setStreak(parseInt(storedStreak, 10))
    }
    if (storedXp) {
      setXp(parseInt(storedXp, 10))
    }
  }, [])

  const updateStreak = () => {
    const today = new Date().toDateString()
    const lastDate = localStorage.getItem("lastCheckedIn")

    if (lastDate === today) return // already checked in today

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const isConsecutive =
      lastDate && new Date(lastDate).toDateString() === yesterday.toDateString()

    const newStreak = isConsecutive ? streak + 1 : 1
    const earnedXp = isConsecutive ? 10 : 5 // example XP logic

    setStreak(newStreak)
    setXp((prev) => prev + earnedXp)

    localStorage.setItem("streak", newStreak.toString())
    localStorage.setItem("xp", (xp + earnedXp).toString())
    localStorage.setItem("lastCheckedIn", today)
  }

  return { streak, xp, updateStreak }
}