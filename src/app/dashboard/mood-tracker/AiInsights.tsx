'use client'

import { useEffect, useState } from "react"

export default function AIInsights() {
  const [insights, setInsights] = useState<string[]>([])

  useEffect(() => {
    const fetchInsights = async () => {
      const res = await fetch('http://localhost:8000/ai_insights?user_id=user123')
      const data = await res.json()
      setInsights(data.insights || [])
    }
    fetchInsights()
  }, [])

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Your Emotional Patterns</h2>
      <p className="text-gray-500 mb-4">Based on your recent mood entries, our AI has identified the following patterns:</p>
      <ul className="list-disc pl-5 space-y-2">
        {insights.map((insight, i) => (
          <li key={i} className="text-sm">{insight}</li>
        ))}
      </ul>
    </div>
  )
}