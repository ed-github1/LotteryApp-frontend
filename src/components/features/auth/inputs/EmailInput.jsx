import { motion } from 'framer-motion';
import { CiCircleAlert } from 'react-icons/ci';

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
        className={`w-full bg-white/10 border border-white/30 text-white placeholder-white/60 text-sm rounded-xl px-3 sm:px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50 transition-all duration-300 backdrop-blur-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
);

export default EmailInput;
