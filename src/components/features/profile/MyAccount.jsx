import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import ProfileForm from './ProfileForm'
import SecurityActions from './SecurityActions'
import { useAuth } from '../../../context/AuthContext'

const MyAccount = () => {
  const { user, setUser, logout } = useAuth()
  const [editMode, setEditMode] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting }
  } = useForm({
    defaultValues: user,
    mode: 'onBlur'
  })

  const onSubmit = async (data) => {
    setApiError('')
    setSuccess(false)
    try {
      await axios.put('/api/profile', data)
      setUser(data)
      setEditMode(false)
      setSuccess(true)
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Error updating profile')
    }
  }

  const handleEdit = () => {
    reset(user)
    setEditMode(true)
    setSuccess(false)
    setApiError('')
  }

  const handleCancel = () => {
    setEditMode(false)
    reset(user)
    setApiError('')
    setSuccess(false)
  }



  return (
    <div className="min-h-screen flex flex-col items-center justify-center  p-4">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            👤 My
            <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Account
            </span>
          </h1>
          <p className="text-base text-white/60 mt-2">
            Manage your profile and account settings
          </p>
        </motion.div>

        {/* Main Content Glassmorphic Container */}
        {/* Main Content Glassmorphic Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col gap-8"
        >
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Account Information</h3>
              {!editMode && (
                <motion.button
                  onClick={handleEdit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFC300] text-[#232946] rounded-xl font-bold hover:shadow-lg hover:shadow-[#FFD700]/25 transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </motion.button>
              )}
            </div>

            <ProfileForm
              user={user}
              editMode={editMode}
              register={register}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              handleEdit={handleEdit}
              handleCancel={handleCancel}
              errors={errors}
              isDirty={isDirty}
              isSubmitting={isSubmitting}
              apiError={apiError}
              success={success}
            />
          </div>

          {/* Security Section */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Security & Privacy</h3>
            </div>
            <SecurityActions editMode={editMode} />
          </div>

          {/* Logout Button - always visible at bottom */}
          <motion.button
            onClick={logout}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="mt-8 w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-pink-500/30 transition-all duration-300 flex items-center justify-center gap-2 mb-20 sm:mb-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
            </svg>
            Log Out
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default MyAccount
