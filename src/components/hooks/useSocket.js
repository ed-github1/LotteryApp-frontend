// src/components/hooks/useSocket.js
import { useEffect } from 'react'
import io from 'socket.io-client'
import { useAuth } from '../../context/AuthContext' // Import useAuth to get userId

const socket = io(import.meta.env.VITE_API_URL)

export const useSocket = () => {
  const { user } = useAuth() // Get userId from context

  useEffect(() => {
    if (user && user._id) {
      // Join the user's room
      socket.emit('join', user._id)
      console.log('Emitted join for userId:', user._id)
    }


    // Cleanup on unmount
    return () => {
      // Optionally disconnect or clean up
    }
  }, [user])

  return socket // Return the socket instance
}