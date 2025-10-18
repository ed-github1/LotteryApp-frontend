import { motion, AnimatePresence } from 'framer-motion';
import ActionButton from '../../../components/common/ActionButtons';

const flipVariants = {
  front: { rotateY: 0 },
  back: { rotateY: 180 },
};

const glowVariants = {
  selected: {
    scale: 1.05,
    transition: { type: 'spring', stiffness: 300, damping: 15 },
  },
  idle: {
    scale: 1,
  },
};

const redGradient = "bg-gradient-to-r from-[#f43f5e] via-[#db2777] to-[#ef4444]";

const SuperBallNumberSelection = ({
  handleGenerateTicket,
  selectedNumbers,
  filledSlots,
  selectionRatio,
  handleSlotClick,
  clearSlot,
  showModal,
  activeSlot,
  handleNumberSelect,
  closeModal,
  loading,
  credits,
  handleRandomizeSlot // Add this prop
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 my-5 border border-white/20"
  >
    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center w-full flex items-center justify-center mb-6"
    >
      <div className="flex justify-between items-center p-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight p-6">

            🎱 Pick Your
            <span className="ml-1">
              Super Ball Numbers 🎱
            </span>
          </h2>
        </div>
      </div>
    </motion.div>

    {/* Styled SuperBall Slots Grid or No Credits Message */}
  {credits > 0 ? (
      <div className="max-w-7xl">
        <div className="grid grid-cols-5 gap-x-4 gap-y-8 justify-items-center mb-6 max-w-md mx-auto">
          {selectedNumbers.map((number, index) => {
            const hasSelection = typeof number === 'number';
            return (
              <div key={index} className="flex flex-col items-center space-y-3 text-center relative">
                <motion.div
                  className="relative"
                  style={{ perspective: 1000 }}
                  variants={glowVariants}
                  animate={hasSelection ? 'selected' : 'idle'}
                >
                  <motion.button
                    type="button"
                    onClick={() => handleSlotClick(index)}
                    className="size-16 md:size-20 rounded-full relative"
                    style={{ transformStyle: 'preserve-3d' }}
                    variants={flipVariants}
                    animate={hasSelection ? 'back' : 'front'}
                    transition={{
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {/* Front Side: Question Mark */}
                    <div
                      className={`absolute inset-0 flex items-center justify-center rounded-full border-2 border-white/50 ${redGradient} shadow-lg`}
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <span className="text-3xl md:text-4xl font-black text-black" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
                        ?
                      </span>
                    </div>
                    {/* Back Side: Number */}
                    <div
                      className={`absolute inset-0 rounded-full flex items-center justify-center ${redGradient} shadow-lg`}
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <span className="text-3xl md:text-4xl font-black text-black" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
                        {number}
                      </span>
                    </div>
                  </motion.button>
                  {/* REMOVED: Clear button for filled slots */}
                  {/*
                  {hasSelection && (
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        clearSlot(index);
                      }}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-base font-bold shadow hover:bg-red-600 transition"
                    >
                      ×
                    </button>
                  )}
                  */}
                </motion.div>
                {/* Slot label */}
                <span className="text-xs font-semibold text-white/90 text-center tracking-wide mt-2">
                  Slot {index + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    ) : (
      <div className="w-full flex flex-col items-center justify-center py-12">
        <div className="text-2xl font-bold text-white mb-2">Not enough credits</div>
        <div className="text-white/80 text-base mb-4">You need SuperBall credits to play. Earn credits by purchasing regular lottery tickets.</div>
        <div className="text-white/60 text-sm">Go to the lottery page to buy tickets and earn credits.</div>
      </div>
    )}

    {/* Progress and Generate Button - REMOVED */}
    <div className="flex flex-col items-center w-full">
      <div className="mb-4 w-full max-w-md">
        <div className="text-white/70 mb-2 text-center">
          {filledSlots}/5 slots filled
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
        </div>
      </div>
      {/* Button removed from here */}
    </div>

    {/* Number Selection Modal */}
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white/20 backdrop-blur-md rounded-2xl p-6 max-w-sm w-full border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Choose Number for Slot {activeSlot + 1}
              </h3>
              <p className="text-white/70 text-sm">
                Select a number from 1 to 10
              </p>
            </div>

            {/* Numbers Grid in Modal */}
            <div className="grid grid-cols-5 gap-3 mb-6">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((number) => (
                <motion.button
                  key={number}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNumberSelect(number)}
                  className={`w-12 h-12 rounded-full font-bold text-lg transition-all bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg`}
                  disabled={credits <= 0}
                >
                  {number}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default SuperBallNumberSelection;
