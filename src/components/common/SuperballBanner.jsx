import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function SuperballBanner() {
  const [status, setStatus] = useState(null);
  const [jackpot, setJackpot] = useState(null);

  useEffect(() => {
    checkSuperballStatus();
    const interval = setInterval(checkSuperballStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  async function checkSuperballStatus() {
    try {
      // Get jackpot info
      const jackpotRes = await fetch('/api/superball/jackpot');
      const jackpotData = await jackpotRes.json();
      setJackpot(jackpotData);
      setStatus(jackpotData);
    } catch (error) {
      console.error('Error checking Superball status:', error);
    }
  }

  if (!status) return null;

  if (status.active && jackpot) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-5xl"
            >
              🎯
            </motion.span>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-wide">Superball Jackpot Active!</h3>
              <p className="text-4xl font-bold mt-2">${jackpot.amount?.toLocaleString()}</p>
              <p className="text-sm text-white/80 mt-1">Enter now with your credits!</p>
            </div>
          </div>
          <Link
            to="/dashboard/superball"
            className="px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-xl shadow-lg hover:bg-yellow-300 hover:text-purple-700 transition-all hover:scale-105"
          >
            Enter Superball →
          </Link>
        </div>
      </motion.div>
    );
  }

  // Show countdown if streak exists
  if (status.currentStreak > 0) {
    return (
      <div className="w-full mb-6 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⏳</span>
            <div>
              <p className="text-sm text-slate-300">No Cat 1 Winner Streak</p>
              <p className="text-2xl font-bold">{status.currentStreak}/10</p>
            </div>
          </div>
          {status.currentStreak === 9 && (
            <p className="text-yellow-300 font-semibold animate-pulse">⚠️ Superball triggers on next draw!</p>
          )}
        </div>
      </div>
    );
  }

  return null;
}
