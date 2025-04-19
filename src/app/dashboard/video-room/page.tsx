'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LiveKitRoom,
  VideoConference,
  useRoomContext,
  useParticipantContext,
  Chat,
  ChatMessage,
  useChat,
} from '@livekit/components-react'
import '@livekit/components-styles'
import { jwtDecode } from 'jwt-decode'

export default function VideoRoomPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [roomName, setRoomName] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const setupRoom = async () => {
      try {
        const storedToken = localStorage.getItem("token")
        if (!storedToken) {
          router.push('/dashboard')
          return
        }

        const decoded: any = jwtDecode(storedToken)
        const userId = decoded?.user_id || "unknown"
        const name = decoded?.email || "Guest"
        const appointmentId = searchParams.get("appointment")

        if (!appointmentId) {
          router.push('/dashboard')
          return
        }

        setRoomName(`appointment-${appointmentId}`)
        setUserName(name)

        const response = await fetch('http://localhost:8000/create-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            user_id: userId, 
            name,
            room_name: `appointment-${appointmentId}`
          }),
        })

        const data = await response.json()
        setToken(data.token)
      } catch (error) {
        console.error("Error setting up room:", error)
        router.push('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    setupRoom()
  }, [router, searchParams])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400 border-opacity-50 mb-6"></div>
        <h2 className="text-xl font-semibold text-blue-800 mb-2">
          Setting up your safe space...
        </h2>
        <p className="text-blue-600 max-w-sm text-sm">
          We're connecting you to the room. Take a deep breath and relax.
        </p>
      </div>
    )
  }

  if (!token || !roomName) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <p className="text-red-600">Unable to connect to the room. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="h-screen w-full bg-gray-50">
      <LiveKitRoom
        token={token}
        serverUrl="wss://mental-wellbeing-zld92qzq.livekit.cloud"
        connect={true}
        video={true}
        audio={true}
        className="h-full"
        onDisconnected={() => {
          router.push('/dashboard')
        }}
      >
        <div className="h-full w-full relative flex">
          {/* Video Conference */}
          <div className="flex-1 h-full">
            <VideoConference />
          </div>

          {/* Chat Sidebar */}
          <div className="w-80 border-l border-gray-200 bg-white">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Chat</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Chat />
              </div>
            </div>
          </div>
        </div>
      </LiveKitRoom>
    </div>
  )
}