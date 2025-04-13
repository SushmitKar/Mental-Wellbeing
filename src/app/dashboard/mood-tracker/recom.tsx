'use client'

import { useEffect, useState } from "react"

interface Recommendation {
  title: string
  text: string
}

export default function Recommendations() {
  const [recs, setRecs] = useState<Recommendation[]>([])

  useEffect(() => {
    const fetchRecs = async () => {
      const res = await fetch('http://localhost:8000/recommendations?user_id=user123')
      const data = await res.json()
      setRecs(data.recommendations || [])
    }
    fetchRecs()
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {recs.map((rec, i) => (
        <div key={i} className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold text-lg">{rec.title}</h3>
          <p className="text-sm text-gray-600">{rec.text}</p>
        </div>
      ))}
    </div>
  )
}
  