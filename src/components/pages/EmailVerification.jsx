import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from 'react-icons/io5'
import { motion } from 'framer-motion'
import { verifyEmail } from '../../services/authService'

const EmailVerification = () => {
  const [status, setStatus] = useState('loading')
  const location = useLocation()
  const navigate = useNavigate()

  // Helper to get token from query string
  const getToken = () => {
    const params = new URLSearchParams(location.search)
    return params.get('token')
  }

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setStatus('error')
      return
    }
    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [location])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', damping: 15 }}
        className="relative backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden max-w-md w-full"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))'
        }}
      >
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl" style={{
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 195, 0, 0.1))'
          }}></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-2xl" style={{
            background: 'linear-gradient(135deg, rgba(2, 12, 40, 0.3), rgba(2, 12, 40, 0.1))'
          }}></div>
        </div>

        <div className="relative z-10 p-8 flex flex-col items-center">
          {status === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full"
              />
              <p className="text-white text-lg font-semibold">Verifying your email...</p>
            </motion.div>
          )}
          
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center w-full"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <IoCheckmarkCircleOutline className="text-green-400 text-7xl mb-6 drop-shadow-lg" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-3 text-center">
                Email Verified!
              </h1>
              <p className="text-white/70 text-center mb-8 leading-relaxed">
                Your email address has been successfully verified.
                <br />
                You can now enjoy all the features of the Lottery App.
              </p>
              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-gray-800 shadow-lg hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 transition-all duration-300"
              >
                Go to Login
              </motion.button>
            </motion.div>
          )}
          
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center w-full"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <IoCloseCircleOutline className="text-red-400 text-7xl mb-6 drop-shadow-lg" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-3 text-center">
                Verification Failed
              </h1>
              <p className="text-white/70 text-center mb-8 leading-relaxed">
                The verification link is invalid or expired.
                <br />
                Please request a new verification email.
              </p>
              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl font-semibold text-lg bg-white/10 border border-white/30 text-white shadow-lg hover:bg-white/20 transition-all duration-300"
              >
                Back to Login
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default EmailVerification
