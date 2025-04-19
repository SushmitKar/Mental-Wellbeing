'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import {
  LiveKitRoom,
  VideoConference,
} from '@livekit/components-react'
import '@livekit/components-styles'

export default function VideoRoomPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams.get('token')
  const room = searchParams.get('room')
  const role = searchParams.get('role')

  if (!token) return <div>Missing token...</div>

  return (
    <div className="h-screen w-full">
      <LiveKitRoom
        token={token}
        serverUrl="wss://mental-wellbeing-zld92qzq.livekit.cloud"
        connect
        video
        audio
        className="h-full"
        onDisconnected={() => {
          router.push('/dashboard')
        }}
      >
        <div className="h-full w-full relative">
          {/* Optional label */}
          {role && (
            <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 rounded text-sm z-50">
              You are a <strong>{role}</strong>
            </div>
          )}

          {/* Default UI (can be replaced with full custom UI later) */}
          <VideoConference />
        </div>
      </LiveKitRoom>
    </div>
  )
}