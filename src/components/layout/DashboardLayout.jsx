import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Sidebar from '../layout/Sidebar'
import BottomNav from './BottomNav'
import { useAuth } from '../../context/AuthContext'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSocket } from '../../context/SocketContext'
import { motion } from 'framer-motion'
import SuperballWinnerNotification from '../features/superball/SuperballWinnerNotification'

const DashboardLayout = () => {
  const location = useLocation()
  const mainRef = useRef(null)
  const { user } = useAuth()
  const socket = useSocket()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // disable browser auto-restoration so we control scroll
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto'
      }
    }
  }, [])

  // changed useLayoutEffect for robust top-scroll on navigation
  useLayoutEffect(() => {
    const scrollTopNow = () => {
      try {
        // remove any element focus that may trigger scrollIntoView
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur()
        }
      } catch (e) { }

      // reset main container if available
      if (mainRef.current) {
        try {
          mainRef.current.scrollTop = 0
          mainRef.current.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        } catch (e) { }
      }

      // fallback to window
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      } catch (e) { }
    }

    // immediate + double RAF + small timeout to counter layout shifts
    scrollTopNow()
    const raf1 = requestAnimationFrame(scrollTopNow)
    const raf2 = requestAnimationFrame(() => requestAnimationFrame(scrollTopNow))
    const timeout = setTimeout(scrollTopNow, 80)

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      clearTimeout(timeout)
    }
  }, [location.pathname])

  useEffect(() => {
    console.log('=== DashboardLayout Socket Setup ===')
    console.log('Socket object:', socket)
    console.log('Socket connected:', socket?.connected)
    console.log('Socket ID:', socket?.id)
    console.log('User:', user?.email)
    
    // Only set up listener if socket is connected
    if (!socket || !socket.connected || !user) {
      console.log('⏸️ Waiting for socket connection or user...')
      return
    }

    console.log('✅ Setting up socket listener for user:', user.email, 'Role:', user.role)
    console.log('✅ Socket ID:', socket.id)

    const handleOrderUpdate = (data) => {
      console.log('🔔 Received orderStatusUpdate from backend:', data)
      
      // Show toast for user (backend emits to user's room)
      if (data.status === 'paid') { 
        toast.success(data.message || '✅ Your order has been approved!', {
          position: 'top-right',
          autoClose: 20000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } else if (data.status === 'rejected') {
        toast.error(data.message || '❌ Your order has been rejected.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } else {
        toast.info(data.message || 'Order status updated.', {
          position: 'top-right',
          autoClose: 5000,
        })
      }
    }

    console.log('📡 Attaching orderStatusUpdate listener...')
    socket.on('orderStatusUpdate', handleOrderUpdate)
    console.log('✅ Listener attached!')

    return () => {
      console.log('🧹 Cleaning up listener...')
      socket.off('orderStatusUpdate', handleOrderUpdate)
    }
  }, [socket?.connected, socket?.id, user]) // Depend on connection state

  return (
    <motion.div
      className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 bg-fixed overflow-x-hidden flex flex-col lg:grid ${sidebarCollapsed ? 'lg:grid-cols-[64px_1fr]' : 'lg:grid-cols-[256px_1fr]'}`}
      style={{ transition: 'grid-template-columns 0.3s ease-in-out' }}
    >
      {/* SuperBall Winner Notification */}
      <SuperballWinnerNotification />
      
      {/* Sidebar overlays or is hidden on mobile, grid on lg+ */}
      <div className="hidden lg:block">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>
      {/* Main Content */}
      <main
        ref={mainRef}
        className={`flex-1 w-full min-h-0 overflow-auto p-2 m-0 space-y-8`}
      >
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName="!bg-gradient-to-r !from-purple-600 !to-purple-700 !rounded-xl !shadow-2xl !border-2 !border-purple-500 !min-w-[300px] !max-w-[500px]"
          bodyClassName="!text-white !font-semibold !text-base"
          progressClassName="!bg-white/30"
          closeButtonClassName="!text-white/80 hover:!text-white"
        />
        <div className="space-y-8">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </motion.div>
  )
}

export default DashboardLayout
