import React, { Children, useState } from "react";
import { motion } from "framer-motion"

const ActionButtons = ({ editMode, isSubmitting, isDirty, onCancel }) => {
  if (!editMode) return null

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
      <motion.button
        type="submit"
        disabled={isSubmitting || !isDirty}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFC300] text-[#232946] font-bold rounded-xl shadow-lg hover:shadow-[#FFD700]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-[#232946]/30 border-t-[#232946] rounded-full animate-spin"></div>
            <span>Saving...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Save Changes</span>
          </>
        )}
      </motion.button>
      
      <motion.button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span>Cancel</span>
      </motion.button>
    </div>
  )
}

const ActionButton = ({
  children,
  onClick,
  disabled = false,
  className = "",
  icon = null,
  type = "button",
  ...props
}) => (
  <motion.button
    type={type}
    onClick={onClick}
    disabled={disabled}
    whileHover={!disabled ? { 
      scale: 1.05, 
      boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)", 
      transition: { type: "spring", stiffness: 300, damping: 20 } 
    } : {}}
    whileTap={!disabled ? { 
      scale: 0.95, 
      transition: { type: "spring", stiffness: 400, damping: 10 } 
    } : {}}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className={`w-full py-4 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${className} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    {...props}
  >
    {icon && <motion.span className="text-xl" whileHover={{ rotate: 5 }}>{icon}</motion.span>}
    <span>{children}</span>
  </motion.button>
);


const DotExpandButton = ({
  children,
  onClick,
  disabled = false,
  tickets = 1, // <-- add this line
  className = "",
  icon = null,
  type = "button",
  ...props
}) => {
  const isDisabled = disabled || tickets < 1; // <-- use tickets to disable

  const bgVariants = {
    rest: { scaleX: 0 },
    hover: { scaleX: 1, transition: { duration: 0.36, ease: "easeOut" } }
  }

  const whiteTextVariants = {
    rest: { opacity: 1 },
    hover: { opacity: 0, transition: { duration: 0.18, ease: "easeOut" } }
  }

  const darkTextVariants = {
    rest: { opacity: 0, x: "-8%" },
    hover: { opacity: 1, x: "0%", transition: { duration: 0.36, ease: "easeOut", delay: 0.08 } }
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      initial="rest"
      whileHover={!isDisabled ? "hover" : "rest"}
      animate="rest"
      className={`relative overflow-hidden w-full py-4 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 flex items-center justify-center bg-transparent ${className} ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      {...props}
    >
      {/* background fill (fills left -> right, yellow) */}
      <motion.div
        aria-hidden
        className="absolute inset-0 transform origin-left"
        style={{ transformOrigin: "left center", zIndex: 0 }}
        variants={bgVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#FFC300]" />
      </motion.div>

      {/* optional icon (static) */}
      {icon && (
        <span className="relative z-10 mr-3 text-xl flex-shrink-0">
          {icon}
        </span>
      )}

      {/* static white label (fades out on hover) */}
      <motion.span
        className="relative z-10 inline-block text-white"
        variants={whiteTextVariants}
      >
        {children}
      </motion.span>

      {/* dark label (fades in and slides in on hover) */}
      <motion.span
        className="absolute inset-0 flex items-center justify-center pointer-events-none font-bold"
        style={{ zIndex: 20 }}
        variants={darkTextVariants}
      >
        <span className="text-[#232946] ml-5">{children}</span>
      </motion.span>
    </motion.button>
  )
}



export { ActionButtons, DotExpandButton }
export default ActionButton;