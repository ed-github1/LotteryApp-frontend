import { motion } from 'framer-motion';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { CiCircleAlert } from 'react-icons/ci';

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
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="Confirm your password"
        disabled={loading}
        className={`w-full bg-white/10 border border-white/30 text-white placeholder-white/60 text-sm rounded-xl px-3 sm:px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50 transition-all duration-300 backdrop-blur-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...register('confirmPassword', {
          required: 'Please confirm your password',
          validate: (value) => value === watch('password') || 'Passwords do not match'
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
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white/90 focus:outline-none"
        onClick={() => setShowConfirmPassword((prev) => !prev)}
        tabIndex={-1}
      >
        {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
      </button>
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
);

export default ConfirmPasswordInput;
