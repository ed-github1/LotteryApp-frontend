import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import winnerAvatar from '../../assets/banners/superlotto-avatar-winner.png';

const WinnerNotificationModal = ({ 
  open, 
  onClose, 
  totalPrize = 0,
  winningTicketsCount = 0
}) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/60 z-50'
            onClick={onClose}
          />

          {/* Container with slide-in from right */}
          <div className='fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4 sm:p-6'>
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='relative pointer-events-auto w-full max-w-md sm:max-w-lg md:max-w-2xl'
              style={{ height: 'auto', minHeight: '350px' }}
            >
              
              {/* Content box */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className='relative z-20 bg-gradient-to-br from-yellow-500/95 via-orange-500/95 to-red-500/95 rounded-3xl shadow-2xl border-4 border-yellow-300 p-4 sm:p-6 md:p-8 mx-auto'
                style={{ maxWidth: '500px' }}
              >
                
                <button
                  onClick={onClose}
                  className='absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-red-600 hover:text-red-700 shadow-lg transition-all hover:scale-110'
                >
                  <span className='text-lg sm:text-xl font-bold'>×</span>
                </button>

                {/* Confetti decorations */}
                <div className='absolute -top-3 -left-3 text-3xl sm:text-4xl animate-bounce'>🎉</div>
                <div className='absolute -top-3 -right-3 text-3xl sm:text-4xl animate-bounce' style={{ animationDelay: '0.1s' }}>🎊</div>

                <div className='flex items-center gap-2 mb-4 justify-center'>
                  <span className='text-xl sm:text-2xl'>🏆</span>
                  <span className='text-white font-black text-xs sm:text-sm uppercase tracking-wider'>Winner!</span>
                  <div className='flex gap-0.5'>
                    <span className='text-white text-sm sm:text-base'>★</span>
                    <span className='text-white text-sm sm:text-base'>★</span>
                    <span className='text-white text-sm sm:text-base'>★</span>
                  </div>
                </div>

                <h2 className='text-2xl sm:text-3xl md:text-4xl font-black text-white text-center mb-2 drop-shadow-lg'>
                  CONGRATULATIONS!
                </h2>

                <p className='text-white/90 text-center text-base sm:text-lg font-semibold mb-4'>
                  You have winning tickets! 🎯
                </p>

                {/* Winner Stats */}
                <div className='bg-white/95 rounded-2xl p-4 sm:p-6 mb-4 shadow-xl'>
                  <div className='text-center mb-3'>
                    <div className='text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1'>
                      Total Prize
                    </div>
                    <div className='text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text'>
                      ${totalPrize.toFixed(2)}
                    </div>
                    <div className='text-xs text-gray-500 font-medium mt-1'>USDT</div>
                  </div>

                  <div className='flex items-center justify-center gap-2 text-gray-700'>
                    <span className='text-xl sm:text-2xl'>🎫</span>
                    <span className='font-bold text-base sm:text-lg'>
                      {winningTicketsCount} Winning Ticket{winningTicketsCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Instructions */}
                <div className='bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 mb-4 border-2 border-white/40'>
                  <p className='text-white text-xs sm:text-sm text-center leading-relaxed'>
                    🎉 Your winnings will be credited automatically!
                    <br />
                    Scroll down to see your winning tickets highlighted.
                  </p>
                </div>

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className='w-full bg-white hover:bg-gray-100 text-orange-600 font-black py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 sm:gap-3 uppercase tracking-wider text-sm sm:text-base'
                >
                  <span className='text-lg sm:text-xl'>👀</span>
                  <span>View My Winning Tickets</span>
                  <svg className='w-4 h-4 sm:w-5 sm:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M19 9l-7 7-7-7' />
                  </svg>
                </motion.button>
              </motion.div>

              {/* Winner Avatar - positioned bottom-right */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, type: 'spring', damping: 20 }}
                className='absolute bottom-0 right-0 z-[60] pointer-events-none'
                style={{ 
                  width: 'clamp(128px, 33vw, 320px)',
                  height: 'auto'
                }}
              >
                <img 
                  src={winnerAvatar} 
                  alt="Winner Avatar" 
                  className='w-full h-auto object-contain drop-shadow-2xl'
                />
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WinnerNotificationModal;
