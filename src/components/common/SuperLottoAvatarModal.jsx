import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import superLottoAvatar from '../../assets/banners/superlotto-avatar.png';

const SuperLottoAvatarModal = ({ 
  open, 
  onClose, 
  title = 'Welcome to SuperLotto!', 
  lines = ['Select your lucky numbers from the grid', 'Add multiple tickets for better chances', 'Complete your purchase and await the draw', 'Check results and claim your winnings!'] 
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
              
              {/* Text content box - text instructions centered */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className='relative z-20 bg-gradient-to-br from-purple-600/95 via-purple-500/95 to-pink-500/95 rounded-3xl shadow-2xl border-4 border-purple-300 p-4 sm:p-6 md:p-8 mx-auto'
                style={{ maxWidth: '500px' }}
              >
                
                <button
                  onClick={onClose}
                  className='absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-purple-600 hover:text-purple-700 shadow-lg transition-all hover:scale-110'
                >
                  <span className='text-lg sm:text-xl font-bold'>×</span>
                </button>

                {/* Decorations */}
                <div className='absolute -top-3 -left-3 text-3xl sm:text-4xl animate-bounce'>✨</div>
                <div className='absolute -top-3 -right-3 text-3xl sm:text-4xl animate-bounce' style={{ animationDelay: '0.1s' }}>🎰</div>

                <div className='flex items-center gap-2 mb-4 justify-center'>
                  <span className='text-xl sm:text-2xl'>🎰</span>
                  <span className='text-white font-black text-xs sm:text-sm uppercase tracking-wider'>Tutorial</span>
                  <div className='flex gap-0.5'>
                    <span className='text-white text-sm sm:text-base'>★</span>
                    <span className='text-white text-sm sm:text-base'>★</span>
                    <span className='text-white text-sm sm:text-base'>★</span>
                  </div>
                </div>

                <h2 className='text-lg sm:text-xl md:text-2xl font-black text-white mb-4 sm:mb-6 text-center drop-shadow-lg'>
                  {title}
                </h2>

                {/* Instructions centered */}
                <div className='space-y-3 sm:space-y-4 mb-6'>
                  {lines.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className='flex items-center justify-center text-center gap-3 group'
                    >
                      <div className='flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-white/90 to-white/70 flex items-center justify-center text-purple-600 font-bold text-sm border border-white/50'>
                        {index + 1}
                      </div>
                      <p className='flex-1 text-white text-sm sm:text-base leading-relaxed text-center max-w-sm'>
                        {line}
                      </p>
                      <span className='text-base sm:text-lg opacity-70 flex-shrink-0'>
                        {index === 0 ? '🎯' : index === 1 ? '🎟️' : index === 2 ? '💳' : '🏆'}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className='w-full bg-gradient-to-r from-white/95 via-white/90 to-white/95 hover:from-white hover:via-white hover:to-white text-purple-600 font-black py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 shadow-lg border-2 border-white/70 hover:border-white flex items-center justify-center gap-2 sm:gap-3 uppercase tracking-wider text-sm sm:text-base'
                >
                  <span className='text-lg sm:text-xl'>🎲</span>
                  <span>Start Playing</span>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                  </svg>
                </motion.button>
              </motion.div>

              {/* Avatar - positioned bottom-right */}
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
                  src={superLottoAvatar}
                  alt='Casino Host'
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

export default SuperLottoAvatarModal;
