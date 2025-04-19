import { useState, useEffect } from 'react'

interface Particle {
  x: number
  y: number
  angle: number
}

export const useParticles = (count: number): Particle[] => {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // Generate initial particles
    const initialParticles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      angle: Math.random() * Math.PI * 2
    }))
    setParticles(initialParticles)

    // Update particles on window resize
    const handleResize = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight
        }))
      )
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [count])

  return particles
} 