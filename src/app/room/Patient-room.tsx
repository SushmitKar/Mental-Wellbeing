'use client'

import { useEffect, useState } from 'react'
import {
  LiveKitRoom,
  VideoConference,
} from '@livekit/components-react'
import '@livekit/components-styles'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'

const RoomPage = () => {
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string>("")
  const [userName, setUserName] = useState<string>("")
  const [roomName, setRoomName] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem("token")

    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken)
        const id = decoded?.user_id || "unknown-user"
        const name = decoded?.email || "Guest"

        setUserId(id)
        setUserName(name)
        setRoomName(`appointment-${id}`)

        const fetchToken = async () => {
          const res = await fetch('http://localhost:8000/create-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: id, name }),
          })
          const data = await res.json()
          setToken(data.token)
        }

        fetchToken()
      } catch (err) {
        console.error("Error decoding local token:", err)
      }
    }
  }, [])

  if (!token) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400 border-opacity-50 mb-6"></div>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">
        Setting up your safe space...
      </h2>
      <p className="text-blue-600 max-w-sm text-sm">
        We're connecting you to the room. Take a deep breath and relax.
      </p>
    </div>
  )

  return (
    <LiveKitRoom
      token={token}
      serverUrl="wss://mental-wellbeing-zld92qzq.livekit.cloud"
      connect={true}
      video={true}
      audio={true}
      style={{ height: '100vh' }}
      onDisconnected={() => {
        console.log("Disconnected from room.")
        setToken(null)
        router.push("/dashboard")
      }}
    >
      <VideoConference />
    </LiveKitRoom>
  )
}

export default RoomPage
