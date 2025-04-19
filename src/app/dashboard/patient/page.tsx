'use client'

import { useEffect, useState } from 'react'
import { LiveKitRoom, VideoConference } from '@livekit/components-react'
import '@livekit/components-styles'
import { jwtDecode } from 'jwt-decode'
import { useRouter, useSearchParams } from 'next/navigation'

const PatientRoomPage = () => {
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const appointmentId = searchParams.get("appointment")

    if (!storedToken || !appointmentId) {
      router.push("/dashboard")
      return
    }

    try {
      const decoded: any = jwtDecode(storedToken)
      const userId = decoded?.user_id || "unknown"
      const name = decoded?.email || "Patient"
      const roomName = `appointment-${appointmentId}`

      const fetchToken = async () => {
        const res = await fetch("http://localhost:8000/create-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, name, room_id: appointmentId }),
        })

        const data = await res.json()
        setToken(data.token)
      }

      fetchToken()
    } catch (err) {
      console.error("Failed to decode token", err)
      router.push("/dashboard")
    }
  }, [router, searchParams])

  if (!token) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Connecting to session...</p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl="wss://mental-wellbeing-zld92qzq.livekit.cloud"
      connect={true}
      video={true}
      audio={true}
      style={{ height: "100vh" }}
      onDisconnected={() => router.push("/dashboard")}
    >
      <VideoConference />
    </LiveKitRoom>
  )
}

export default PatientRoomPage