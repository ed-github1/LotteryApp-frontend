import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkSuperballStatus } from '../../services/superballService';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';

const SuperBallActivePopup = () => {
  const [isActive, setIsActive] = useState(false);
  const [jackpotAmount, setJackpotAmount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const socket = useSocket();
  const { user, token } = useAuth();

  // Define checkStatus outside useEffect so it's available everywhere
  const checkStatus = async () => {
    try {
      console.log('🎯 SuperBallActivePopup: Checking status...');
      const response = await checkSuperballStatus();
      console.log('🎯 SuperBallActivePopup: Response:', response);
      
      if (response && response.active) {
        console.log('🎯 SuperBallActivePopup: Superball is ACTIVE!');
        setIsActive(true);
        setJackpotAmount(response.amount);
        setShowPopup(true);
      } else {
        console.log('🎯 SuperBallActivePopup: Superball is NOT active');
        setIsActive(false);
        setShowPopup(false);
      }
    } catch (error) {
      console.error('🎯 SuperBallActivePopup: Error checking status:', error);
    }
  };

  useEffect(() => {
    // Check immediately on mount
    checkStatus();

    // Listen for SuperBall status updates via Socket.IO
    if (socket) {
      console.log('🎯 SuperBallActivePopup: Setting up socket listeners');
      
      socket.on('superballActivated', (data) => {
        console.log('🎉 SuperBall ACTIVATED via socket! Data:', data);
        setIsActive(true);
        setJackpotAmount(data.amount || 0);
        setShowPopup(true);
        console.log('🎯 SuperBallActivePopup: Popup triggered by socket event!');
      });

      socket.on('superballDeactivated', () => {
        console.log('🔴 SuperBall DEACTIVATED via socket');
        setIsActive(false);
        setShowPopup(false);
      });

      socket.on('superballJackpotUpdate', (data) => {
        console.log('💰 SuperBall jackpot UPDATED via socket:', data);
        if (data.amount) {
          setJackpotAmount(data.amount);
        }
      });
    } else {
      console.log('⚠️ SuperBallActivePopup: No socket connection available');
    }

    // Cleanup socket listeners
    return () => {
      if (socket) {
        socket.off('superballActivated');
        socket.off('superballDeactivated');
        socket.off('superballJackpotUpdate');
      }
    };
  }, [socket]);

  // Show popup when user logs in (user or token changes)
  useEffect(() => {
    if (user && token) {
      checkStatus();
    }
  }, [user, token]);

  const handleClose = () => {
    setShowPopup(false);
  };

  const handlePlayNow = () => {
    handleClose();
    navigate('/dashboard/superball');
  };

  if (!isActive || !user || !token) return null;

  return (
    <AnimatePresence>
      {showPopup && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-2 sm:p-4"
          >
            {/* Popup Content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-xl rounded-3xl border-4 border-purple-400/50 shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg overflow-y-auto overflow-x-hidden max-h-[90vh]"
              style={{ margin: '0 auto' }}
            >
              {/* Animated Background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{
                    rotate: -360,
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
                />
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 text-white/70 hover:text-white text-3xl font-bold transition-colors hover:rotate-90 transform duration-300"
              >
                ×
              </button>

              {/* Content */}
              <div className="relative z-10 p-8 lg:p-10 text-center">
                {/* Animated Icon */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="text-8xl mb-6"
                >
                  🎱
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl lg:text-5xl font-extrabold mb-4"
                >
                  <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
                    SuperBall is ACTIVE!
                  </span>
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl lg:text-2xl text-purple-200 mb-6 font-semibold"
                >
                  🎉 The Jackpot is Building! 🎉
                </motion.p>

                {/* Jackpot Amount */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', damping: 15 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl border-2 border-yellow-400/50 p-6 mb-6"
                >
                  <div className="text-sm text-purple-200 mb-2 uppercase tracking-wider font-semibold">
                    Current Jackpot
                  </div>
                  <div className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent drop-shadow-xl">
                    ${jackpotAmount.toFixed(2)}
                  </div>
                  <div className="text-xl text-yellow-300 font-bold mt-1">USDT</div>
                </motion.div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-white/90 text-base lg:text-lg mb-8 leading-relaxed"
                >
                  Pick a number from <span className="font-bold text-yellow-300">1 to 10</span> for your chance to win the entire jackpot!
                  <br />
                  <span className="text-purple-300 font-semibold">Winner takes all! 💰</span>
                </motion.p>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <button
                    onClick={handlePlayNow}
                    className="px-8 py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-gray-900 font-black text-lg rounded-xl shadow-2xl hover:scale-105 transition-transform duration-200 border-2 border-yellow-300"
                  >
                    🎱 Play SuperBall Now!
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all duration-200"
                  >
                    Maybe Later
                  </button>
                </motion.div>

                {/* Info Text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-white/60 text-sm mt-6"
                >
                  This popup will only show once per session
                </motion.p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SuperBallActivePopup;
