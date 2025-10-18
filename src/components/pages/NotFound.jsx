import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#232946] text-white px-4">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 10 }}
      className="flex flex-col items-center"
    >
      <motion.h1
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="text-7xl font-extrabold text-[#FFD700] drop-shadow mb-2"
      >
        404
      </motion.h1>
      <motion.p
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        className="text-2xl font-bold mb-4"
      >
        Page Not Found
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-8 text-gray-300 text-center max-w-md"
      >
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </motion.p>
      <Link
        to="/"
        className="px-6 py-3 rounded-lg bg-[#FFD700] text-black font-bold shadow hover:bg-[#FFC300] transition"
      >
        Go Home
      </Link>
    </motion.div>
  </div>
)

export default NotFound