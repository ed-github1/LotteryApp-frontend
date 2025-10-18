import { motion } from 'framer-motion';
import { FaClock, FaTrophy, FaGem, FaCoins } from 'react-icons/fa';

const WaitingApprovalSection = ({ resetFlow }) => {
  return (
    <motion.div
      key="waiting"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        {/* Lottery-themed jackpot (no spinning) */}
        <motion.div
          className="mb-6 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-red-500 rounded-full flex items-center justify-center shadow-2xl">
            <FaTrophy className="text-white text-3xl" />
          </div>
          <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-md" />
        </motion.div>

        <motion.h2
          className="text-3xl font-bold text-white mb-4 text-center bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FaCoins className="inline mr-2" />
          Waiting for Jackpot Validation
        </motion.h2>

        <motion.p
          className="text-white/80 mb-6 text-center text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Your lucky ticket is being processed!<br />
          Our jackpot masters will validate your payment within <span className="font-semibold text-yellow-400">24 hours</span>.
        </motion.p>

        <motion.div
          className="bg-gradient-to-r from-yellow-500/20 to-red-500/20 text-yellow-300 px-6 py-3 rounded-xl mb-6 text-sm font-semibold border border-yellow-400/30 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <FaClock className="inline mr-2" />
          Ticket Status: Pending Jackpot Approval
        </motion.div>

        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-white/60 text-sm mb-2">Need help with your lucky draw?</p>
          <a
            href="mailto:support@lotteryapp.com"
            className="text-blue-400 hover:text-blue-300 underline text-sm"
          >
            Contact Jackpot Support
          </a>
        </motion.div>

        <motion.button
          className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={resetFlow}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Another Lucky Method
        </motion.button>
      </div>
    </motion.div>
  );
};

export default WaitingApprovalSection;