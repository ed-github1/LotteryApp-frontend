import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { IoIosReturnLeft } from 'react-icons/io'
import { motion } from 'framer-motion'
import { useAuth } from '../../../context/AuthContext'
import FirstNameInput from './inputs/FirstNameInput'
import LastNameInput from './inputs/LastNameInput'
import PasswordInput from './inputs/PasswordInput'
import ConfirmPasswordInput from './inputs/ConfirmPasswordInput'
import EmailInput from './inputs/EmailInput'
import BirthDateInput from './inputs/BirthDateInput'
import { IoCheckmarkCircleOutline } from 'react-icons/io5';


const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const { createUser, user, authErrors, loading: authLoading, message } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registered, setRegistered] = useState(false)

  // ==========================================
  // EFFECTS
  // ==========================================

  useEffect(() => {
    if (user) {
      navigate('/dashboard/buy-ticket')
    }
  }, [user, navigate])

  /**
   * Handle form submission with authentication
   */
  const onSubmit = async (data) => {
    setIsSubmitting(true)

    try {
      // Calculate age from birth date
      const birthDate = new Date(data.birthDate)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      if (age < 18) {
        throw new Error('You must be at least 18 years old to register.')
      }

      await createUser(data)
      // Stop local submitting state; AuthContext will expose message/authErrors
      setIsSubmitting(false)
      // If registration created a message and there are no auth errors, mark as registered
      if ((authErrors == null || authErrors.length === 0) && !!(typeof window !== 'undefined' && window) ) {
        // message from context may update slightly after createUser; rely on effect below too
      }
    } catch (error) {
      setIsSubmitting(false)
    }
  }

  // If the auth context reports a success message and no authErrors, show success UI
  useEffect(() => {
    if (message && (!authErrors || authErrors.length === 0)) {
      setRegistered(true)
      setIsSubmitting(false)
    }
  }, [message, authErrors])

  /**
   * Handle Google authentication (placeholder)
   */
  const handleGoogleLogin = () => {
    alert('Google Auth coming soon!')
    // Here you would trigger your Google OAuth flow
  }


  // Combined loading state from auth context and form submission
  const loading = authLoading || isSubmitting


  return (
    <div className="w-full max-w-xl sm:max-w-md mx-auto py-6 sm:py-10">
      <div className="w-full  mx-auto">
        {/* Main Form Container */}
        <div className="relative backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden w-full px-2">
          {/* Background Decorations */}
          <BackgroundDecorations />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative z-10 p-2 sm:p-4 space-y-3 sm:space-y-5 w-full "
          >
            {/* Header Section */}
            <RegisterHeader />

            {registered ? (
              <div className="py-8 px-4 text-center flex flex-col items-center">
                <IoCheckmarkCircleOutline className="text-green-400 text-7xl mb-6 drop-shadow-lg" />
                <h3 className="text-xl font-bold text-amber-400">Account created successfully</h3>
                <div className="mt-6">
                  <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFC300] text-[#232946] font-bold shadow-lg hover:shadow-xl transition-all duration-200">
                    Go to Login
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Form Fields */}
                <FirstNameInput register={register} errors={errors} loading={loading} />
                <LastNameInput register={register} errors={errors} loading={loading} />
                <EmailInput register={register} errors={errors} loading={loading} />
                <BirthDateInput register={register} errors={errors} loading={loading} />
                <PasswordInput
                  register={register}
                  errors={errors}
                  loading={loading}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
                <ConfirmPasswordInput
                  register={register}
                  errors={errors}
                  loading={loading}
                  showConfirmPassword={showConfirmPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                  watch={watch}
                />

                {/* Error Display */}
                <AuthErrors authErrors={authErrors} />

                {/* Register Button */}
                <RegisterButton loading={loading} />

                {/* Social Login */}
                <SocialLogin handleGoogleLogin={handleGoogleLogin} loading={loading} />

                {/* Footer Links */}
                <FormFooter />
              </>
            )}
          </form>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-8 text-white/60 text-sm">
          Already have an account?
          <Link to="/login" className="text-[#FFD700] hover:text-[#FFC300] font-medium transition-colors duration-200">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * Register header with simple design
 */
const RegisterHeader = () => (
  <div className="text-center space-y-3 mb-2 pt-5">
    <h2 className="text-2xl font-bold text-white">Create your account</h2>
    <p className="text-white/70 text-sm">Join us and start playing</p>
  </div >
)

/**
 * Display authentication errors from backend
 */
const AuthErrors = ({ authErrors }) => {
  if (!authErrors.length) return null

  return (
    <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
      {authErrors.map((err, idx) => (
        <div key={idx} className="text-red-300 text-sm text-center">
          {err}
        </div>
      ))}
    </div>
  )
}

/**
 * Main register button with loading state
 */
const RegisterButton = ({ loading }) => (
  <motion.button
    type="submit"
    disabled={loading}
    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${loading
      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-800 cursor-not-allowed'
      : 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-gray-800 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
      }`}
    whileHover={!loading ? { scale: 1.02 } : {}}
    whileTap={!loading ? { scale: 0.98 } : {}}
  >
    {loading ? (
      <div className="flex items-center justify-center space-x-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full"
        />
        <span>Creating Account...</span>
      </div>
    ) : (
      'Create Account'
    )}
  </motion.button>
)

/**
 * Social login section with Google authentication
 */
const SocialLogin = ({ handleGoogleLogin, loading }) => (
  <>
    {/* Divider */}
    <div className="relative flex items-center justify-center py-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/30"></div>
      </div>
      <div className="relative px-4 text-sm text-white/60" style={{
        background: 'linear-gradient(135deg, rgba(2,12,40,0.9), rgba(2,12,40,0.8))'
      }}>
        or continue with
      </div>
    </div>

    {/* Google Auth Button */}
    <motion.button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl border border-white/30 bg-white/10 text-white font-medium shadow-lg backdrop-blur-sm ${loading ? 'cursor-not-allowed' : ''
        }`}
      whileHover={!loading ? {
        scale: 1.02,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 25px rgba(255, 255, 255, 0.1)'
      } : {}}
      whileTap={!loading ? {
        scale: 0.98,
        transition: { duration: 0.1 }
      } : {}}
      animate={loading ? {
        opacity: 0.5
      } : {}}
      transition={{
        scale: { type: "spring", stiffness: 400, damping: 17 },
        backgroundColor: { duration: 0.2 }
      }}
    >
      <motion.img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="w-5 h-5"
        animate={loading ? {
          rotate: [0, 10, -10, 0]
        } : {}}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.span
        animate={loading ? {
          opacity: [1, 0.7, 1]
        } : {}}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        Continue with Google
      </motion.span>
    </motion.button>
  </>
)

/**
 * Form footer with navigation links
 */
const FormFooter = () => (
  <>
    {/* Back Link */}
    <div className="text-center pt-4">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-white/60 hover:text-[#FFD700] transition-colors duration-200 text-sm"
      >
        <IoIosReturnLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  </>
)

/**
 * Decorative background elements
 */
const BackgroundDecorations = () => (
  <>
    <div className="absolute top-0 left-0 w-full h-full" style={{
      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 195, 0, 0.05))'
    }}></div>
    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl" style={{
      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 195, 0, 0.1))'
    }}></div>
    <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-2xl" style={{
      background: 'linear-gradient(135deg, rgba(2, 12, 40, 0.3), rgba(2, 12, 40, 0.1))'
    }}></div>
  </>
)

export default RegisterForm
