'use client'

import { useEffect, useState } from 'react'
import {
  LiveKitRoom,
  VideoConference,
} from '@livekit/components-react'
import '@livekit/components-styles'
import { jwtDecode } from 'jwt-decode'

const RoomPage = () => {
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string>("")
  const [userName, setUserName] = useState<string>("")
  const [roomName, setRoomName] = useState<string>("")

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
          const res = await fetch('http://localhost:8000/get-token', {
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

  if (!token) return <div>Loading...</div>

  return (
    <LiveKitRoom
      token={token}
      serverUrl="ws://localhost:7880"
      connect={true}
      video={true}
      audio={true}
      style={{ height: '100vh' }}
    >
      <VideoConference />
    </LiveKitRoom>
  )
}

export default RoomPage