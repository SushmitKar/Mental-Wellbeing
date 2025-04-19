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
  GridLayout,
  ParticipantTile,
  useTracks,
  RoomAudioRenderer,
  ControlBar,
} from '@livekit/components-react'
import '@livekit/components-styles'
import { jwtDecode } from 'jwt-decode'
import { Track } from 'livekit-client'
import { motion, AnimatePresence } from 'framer-motion'
import { useParticles } from '@/hooks/useParticles'
import { MessageCircle, X } from 'lucide-react'

// Particle background component
const ParticleBackground = () => {
  const particles = useParticles(50)
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-indigo-500/20 rounded-full"
          initial={{ x: particle.x, y: particle.y }}
          animate={{
            x: particle.x + Math.sin(particle.angle) * 100,
            y: particle.y + Math.cos(particle.angle) * 100,
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

// Loading animation component
const LoadingAnimation = () => (
  <motion.div 
    className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <ParticleBackground />
    <motion.div
      className="relative"
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="w-24 h-24 border-4 border-indigo-500/30 rounded-full" />
      <motion.div
        className="absolute top-0 left-0 w-24 h-24 border-4 border-indigo-500 rounded-full"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
    <motion.h2 
      className="text-xl font-semibold text-white mt-8"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      Setting up your safe space...
    </motion.h2>
    <motion.p 
      className="text-gray-400 max-w-sm text-sm mt-2"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.7 }}
    >
      We're connecting you to the room. Take a deep breath and relax.
    </motion.p>
  </motion.div>
)

function VideoConferenceLayout() {
  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone])
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <motion.div 
      className="h-full w-full relative flex bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-100/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <ParticleBackground />
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col h-full p-6 relative z-10 ${isChatOpen ? 'mr-[400px]' : ''} transition-all duration-300`}>
        {/* Video Conference */}
        <div className="flex-1 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-md shadow-2xl border border-white/50">
          <div className="h-full flex flex-col">
            <div className="flex-1">
              <GridLayout tracks={tracks} className="h-full">
                <ParticipantTile />
              </GridLayout>
            </div>
          </div>
        </div>

        {/* Control Bar */}
        <div className="mt-4 flex justify-center">
          <div className="!relative !transform-none bg-white/90 backdrop-blur-md rounded-full px-6 py-3 border border-white/50 shadow-lg flex items-center space-x-4">
            <ControlBar 
              className="[&_button]:!bg-indigo-600 [&_button]:hover:!bg-indigo-700 [&_button]:!transition-colors [&_button]:!rounded-full [&_button]:!border-0"
            />
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`px-6 py-2.5 rounded-full flex items-center gap-2 transition-colors ${
                isChatOpen 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              <span>Chat</span>
            </button>
          </div>
        </div>
        <RoomAudioRenderer />
      </div>

      {/* Chat Sidebar */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            className="w-[400px] bg-gradient-to-b from-white/80 to-white/60 backdrop-blur-md shadow-lg border-l border-white/50"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-indigo-100/50 bg-white/50 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-indigo-900 text-lg">Chat Room</h3>
                  <p className="text-sm text-indigo-600/70">Connect with your therapist</p>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <Chat 
                  className="!bg-transparent [&_.lk-chat-message]:!bg-indigo-50/50 [&_.lk-chat-message]:!border-indigo-100/50 [&_.lk-chat-message]:!rounded-2xl [&_.lk-chat-message]:!shadow-sm [&_.lk-chat-form]:!bg-white/50 [&_.lk-chat-form]:!border-t-indigo-100/50 [&_.lk-chat-form]:!p-4 [&_.lk-chat-form_input]:!bg-white [&_.lk-chat-form_input]:!border-indigo-100 [&_.lk-chat-form_input]:!rounded-full [&_.lk-chat-form_button]:!bg-indigo-600 [&_.lk-chat-form_button]:!rounded-full [&_.lk-chat-form_button]:!px-6 [&_.lk-chat-form_button]:hover:!bg-indigo-700"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

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

        const roomName = `appointment-${appointmentId}`
        setRoomName(roomName)
        setUserName(name)

        const response = await fetch('http://localhost:8000/create-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            user_id: userId, 
            name,
            room_name: roomName
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to get room token')
        }

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
    return <LoadingAnimation />
  }

  if (!token || !roomName) {
    return (
      <motion.div 
        className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ParticleBackground />
        <p className="text-red-400">Unable to connect to the room. Please try again.</p>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LiveKitRoom
        token={token}
        serverUrl="wss://mental-wellbeing-zld92qzq.livekit.cloud"
        connect={true}
        video={true}
        audio={true}
        className="h-full"
        data-lk-theme="default"
        onDisconnected={() => {
          const role = localStorage.getItem("role");
          router.push(role === "therapist" ? "/dashboard/therapist" : "/dashboard");
        }}
      >
        <VideoConferenceLayout />
      </LiveKitRoom>
    </motion.div>
  )
}