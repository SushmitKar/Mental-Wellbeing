'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface JoinRoomButtonProps {
  userId: string
  appointmentId: string
  isTherapist: boolean
}

export default function JoinRoomButton({ userId, appointmentId, isTherapist }: JoinRoomButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleJoin = async () => {
    setLoading(true)

    const res = await fetch('http://localhost:8000/create-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identity: userId,
        room: appointmentId,
        is_therapist: isTherapist
      })
    })

    const data = await res.json()

    if (data.token) {
      router.push(`/dashboard/video-room?room=${appointmentId}&token=${data.token}`)
    } else {
      alert('Token fetch failed!')
    }

    setLoading(false)
  }

  return (
    <button
      onClick={handleJoin}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      disabled={loading}
    >
      {loading ? 'Joining...' : 'Join Video Session'}
    </button>
  )
}