import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { CiCircleAlert } from 'react-icons/ci'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { IoIosReturnLeft } from 'react-icons/io'
import { motion } from 'framer-motion'
import { useAuth } from '../../../context/AuthContext'

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const { createUser, user, authErrors, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      // Navigation is handled in useEffect
    } catch (error) {
      setIsSubmitting(false)
    }
  }

  /**
   * Handle Google authentication (placeholder)
   */
  const handleGoogleLogin = () => {
    alert('Google Auth coming soon!')
    // Here you would trigger your Google OAuth flow
  }

  // ==========================================
  // COMPUTED VALUES
  // ==========================================

  // Combined loading state from auth context and form submission
  const loading = authLoading || isSubmitting

  // ==========================================
  // RENDER
  // ==========================================

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
          </form>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-8 text-white/60 text-sm">
          Already have an account?{' '}
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
 * First name input field
 */
const FirstNameInput = ({ register, errors, loading }) => (
  <motion.div
    className="space-y-3"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
  >
    <motion.label
      className="block text-sm font-semibold text-white/90 tracking-wide"
      animate={{
        color: errors.firstName ? '#ef4444' : 'rgba(255, 255, 255, 0.9)'
      }}
      transition={{ duration: 0.2 }}
    >
      First Name
    </motion.label>
    <div className="relative">
      <motion.input
        placeholder="Enter your first name"
        disabled={loading}
        className={`w-full bg-white/10 border border-white/30 text-white placeholder-white/60 text-sm rounded-xl px-3 sm:px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50 transition-all duration-300 backdrop-blur-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        {...register('firstName', {
          required: 'First name is required',
          minLength: {
            value: 2,
            message: 'First name must be at least 2 characters'
          },
          maxLength: {
            value: 50,
            message: 'First name must be less than 50 characters'
          },
          validate: (value) =>
            value.trim() !== '' || 'First name cannot be empty'
        })}
        whileFocus={{
          scale: 1.02,
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 195, 0, 0.05))'
        }}
        whileHover={{
          opacity: 0.3,
          transition: { duration: 0.2 }
        }}
      ></motion.div>
    </div>
    {errors.firstName && (
      <motion.div
        className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-xs"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <CiCircleAlert className="w-4 h-4" />
        <span>{errors.firstName.message}</span>
      </motion.div>
    )}
  </motion.div>
)

/**
 * Last name input field
 */
const LastNameInput = ({ register, errors, loading }) => (
  <motion.div
    className="space-y-3"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <motion.label
      className="block text-sm font-semibold text-white/90 tracking-wide"
      animate={{
        color: errors.lastName ? '#ef4444' : 'rgba(255, 255, 255, 0.9)'
      }}
      transition={{ duration: 0.2 }}
    >
      Last Name
    </motion.label>
    <div className="relative">
      <motion.input
        placeholder="Enter your last name"
        disabled={loading}
        className={`w-full bg-white/10 border border-white/30 text-white placeholder-white/60 text-sm rounded-xl px-3 sm:px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50 transition-all duration-300 backdrop-blur-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        {...register('lastName', {
          required: 'Last name is required',
          minLength: {
            value: 2,
            message: 'Last name must be at least 2 characters'
          },
          maxLength: {
            value: 50,
            message: 'Last name must be less than 50 characters'
          },
          validate: (value) =>
            value.trim() !== '' || 'Last name cannot be empty'
        })}
        whileFocus={{
          scale: 1.02,
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 195, 0, 0.05))'
        }}
        whileHover={{
          opacity: 0.3,
          transition: { duration: 0.2 }
        }}
      ></motion.div>
    </div>
    {errors.lastName && (
      <motion.div
        className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-xs"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <CiCircleAlert className="w-4 h-4" />
        <span>{errors.lastName.message}</span>
      </motion.div>
    )}
  </motion.div>
)

/**
 * Email input field
 */
const EmailInput = ({ register, errors, loading }) => (
  <motion.div
    className="space-y-3"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
  >
    <motion.label
      className="block text-sm font-semibold text-white/90 tracking-wide"
      animate={{
        color: errors.email ? '#ef4444' : 'rgba(255, 255, 255, 0.9)'
      }}
      transition={{ duration: 0.2 }}
    >
      Email
    </motion.label>
    <div className="relative">
      <motion.input
        placeholder="Enter your email"
        disabled={loading}
        className={`w-full bg-white/10 border border-white/30 text-white placeholder-white/60 text-sm rounded-xl px-3 sm:px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50 transition-all duration-300 backdrop-blur-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'Please enter a valid email'
          },
          validate: (value) => value.trim() !== '' || 'Email cannot be empty'
        })}
        whileFocus={{
          scale: 1.02,
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 195, 0, 0.05))'
        }}
        whileHover={{
          opacity: 0.3,
          transition: { duration: 0.2 }
        }}
      ></motion.div>
    </div>
    {errors.email && (
      <motion.div
        className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-xs"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <CiCircleAlert className="w-4 h-4" />
        <span>{errors.email.message}</span>
      </motion.div>
    )}
  </motion.div>
)

/**
 * Birth date input field with age validation
*/

const BirthDateInput = ({ register, errors, loading }) => (
  <motion.div
    className="space-y-3"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
  >
    <motion.label
      className="block text-sm font-semibold text-white/90 tracking-wide"
      animate={{
        color: errors.birthDate ? '#ef4444' : 'rgba(255, 255, 255, 0.9)'
      }}
      transition={{ duration: 0.2 }}
    >
      Date of Birth
    </motion.label>
    <div className="relative">
      <motion.input
        type="date"
        disabled={loading}
        className={`w-full min-w-0 appearance-none bg-white/10 border border-white/30 text-white placeholder-white/60 text-sm rounded-xl px-3 sm:px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50 transition-all duration-300 backdrop-blur-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...register('birthDate', {
          required: 'Date of birth is required',
          validate: (value) => {
            const birthDate = new Date(value)
            const today = new Date()
            let age = today.getFullYear() - birthDate.getFullYear()  // Changed from const to let
            const monthDiff = today.getMonth() - birthDate.getMonth()

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--  // Now this works since age is let
            }

            return age >= 18 || 'You must be at least 18 years old to register'
          }
        })}
        whileFocus={{
          scale: 1.02,
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 195, 0, 0.05))'
        }}
        whileHover={{
          opacity: 0.3,
          transition: { duration: 0.2 }
        }}
      ></motion.div>
    </div>
    {errors.birthDate && (
      <motion.div
        className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-xs"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <CiCircleAlert className="w-4 h-4" />
        <span>{errors.birthDate.message}</span>
      </motion.div>
    )}
  </motion.div>
)

/**
 * Password input field with show/hide toggle
 */
const PasswordInput = ({ register, errors, loading, showPassword, setShowPassword }) => (
  <motion.div
    className="space-y-3"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.5 }}
  >
    <motion.label
      className="block text-sm font-semibold text-white/90 tracking-wide"
      animate={{
        color: errors.password ? '#ef4444' : 'rgba(255, 255, 255, 0.9)'
      }}
      transition={{ duration: 0.2 }}
    >
      Password
    </motion.label>
    <div className="relative">
      <motion.input
        placeholder="Enter your password"
        type={showPassword ? 'text' : 'password'}
        disabled={loading}
        className={`w-full bg-white/10 border border-white/30 text-white placeholder-white/60 text-sm rounded-xl px-3 sm:px-4 py-3 sm:py-4 pr-10 sm:pr-12 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50 transition-all duration-300 backdrop-blur-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters'
          },
          maxLength: {
            value: 100,
            message: 'Password must be less than 100 characters'
          },
          validate: (value) =>
            value.trim() !== '' || 'Password cannot be empty'
        })}
        whileFocus={{
          scale: 1.02,
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      />
      <motion.button
        type="button"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-[#FFD700] transition-colors duration-200"
        onClick={() => setShowPassword(!showPassword)}
        whileHover={{
          scale: 1.1,
          transition: { duration: 0.2 }
        }}
        whileTap={{
          scale: 0.95,
          transition: { duration: 0.1 }
        }}
      >
        {showPassword ? <IoEyeOff className="w-5 h-5" /> : <IoEye className="w-5 h-5" />}
      </motion.button>
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 195, 0, 0.05))'
        }}
        whileHover={{
          opacity: 0.3,
          transition: { duration: 0.2 }
        }}
      ></motion.div>
    </div>
    {errors.password && (
      <motion.div
        className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-xs"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <CiCircleAlert className="w-4 h-4" />
        <span>{errors.password.message}</span>
      </motion.div>
    )}
  </motion.div>
)

/**
 * Confirm password input field
 */
const ConfirmPasswordInput = ({ register, errors, loading, showConfirmPassword, setShowConfirmPassword, watch }) => (
  <motion.div
    className="space-y-3"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.6 }}
  >
    <motion.label
      className="block text-sm font-semibold text-white/90 tracking-wide"
      animate={{
        color: errors.confirmPassword ? '#ef4444' : 'rgba(255, 255, 255, 0.9)'
      }}
      transition={{ duration: 0.2 }}
    >
      Confirm Password
    </motion.label>
    <div className="relative">
      <motion.input
        placeholder="Confirm your password"
        type={showConfirmPassword ? 'text' : 'password'}
        disabled={loading}
        className={`w-full bg-white/10 border border-white/30 text-white placeholder-white/60 text-sm rounded-xl px-3 sm:px-4 py-3 sm:py-4 pr-10 sm:pr-12 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50 transition-all duration-300 backdrop-blur-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        {...register('confirmPassword', {
          required: 'Please confirm your password',
          validate: (value) =>
            value === watch('password') || 'Passwords do not match'
        })}
        whileFocus={{
          scale: 1.02,
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      />
      <motion.button
        type="button"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-[#FFD700] transition-colors duration-200"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        whileHover={{
          scale: 1.1,
          transition: { duration: 0.2 }
        }}
        whileTap={{
          scale: 0.95,
          transition: { duration: 0.1 }
        }}
      >
        {showConfirmPassword ? <IoEyeOff className="w-5 h-5" /> : <IoEye className="w-5 h-5" />}
      </motion.button>
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 195, 0, 0.05))'
        }}
        whileHover={{
          opacity: 0.3,
          transition: { duration: 0.2 }
        }}
      ></motion.div>
    </div>
    {errors.confirmPassword && (
      <motion.div
        className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-xs"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <CiCircleAlert className="w-4 h-4" />
        <span>{errors.confirmPassword.message}</span>
      </motion.div>
    )}
  </motion.div>
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
