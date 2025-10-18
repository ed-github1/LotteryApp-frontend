import { motion, AnimatePresence } from "motion/react"

const Notification = ({ message, show, type = "info", onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 80, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`
            fixed top-10 right-1 -translate-y-1/2 z-[9999]
            flex items-center
          `}
          style={{ pointerEvents: "auto" }}
        >
          <div className={`
            px-8 py-4 rounded-2xl shadow-2xl flex items-center
            bg-gradient-to-r from-[#7b2ff2] to-[#f357a8]/80
          `}>
            <span className="text-white font-bold text-lg">{message}</span>
            {onClose && (
              <button
                className="ml-6 text-white text-2xl font-bold focus:outline-none"
                onClick={onClose}
                aria-label="Close notification"
              >
                ×
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Notification