// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const { user } = useAuth()
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:3000')
      setSocket(newSocket)

      newSocket.on('connect', () => {
        console.log('Connected to socket, ID:', newSocket.id)
        newSocket.emit('join', user._id) // Use user._id for consistency
        console.log('Emitted join for userId:', user._id)
      })

      newSocket.on('disconnect', () => console.log('Disconnected from socket'))

      // Toast notifications are handled in DashboardLayout.jsx
      // Just log here for debugging
      newSocket.on('orderStatusUpdate', (data) => {
        console.log('SocketContext: Order status update received:', data)
      })

      // Global listener for Superball events (for debugging)
      newSocket.on('superballActivated', (data) => {
        console.log('🎉 SocketContext: SUPERBALL ACTIVATED EVENT RECEIVED!', data)
      })

      newSocket.on('superballDeactivated', () => {
        console.log('🔴 SocketContext: SUPERBALL DEACTIVATED EVENT RECEIVED')
      })

      return () => newSocket.disconnect()
    }
  }, [user])



  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)