import { motion, AnimatePresence } from "framer-motion"
import { CircleFlag } from "react-circle-flags"

const NumberSelectionGrid = ({
  selectedCountry,
  countrySelections,
  handleNumberSelect,
  isModal = false,
  onClose,
  onRandomize
}) => {
  if (!selectedCountry) return null

  const gridVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
    exit: { opacity: 0, y: 24, scale: 0.95, transition: { duration: 0.15 } }
  }

  const content = (
    <div
      className={`w-full max-w-md bg-white/40 rounded-xl shadow-lg p-6 ${
        isModal ? '' : 'mb-6'
      }`}
    >
      <div className="text-center mb-4">
        <div className="flex items-center justify-center">
          <CircleFlag
            countryCode={selectedCountry.flag}
            alt={selectedCountry.name}
            className="h-6 w-auto mr-2"
          />
          <span className="text-neutral-100 font-title">
            {selectedCountry.name}
          </span>
        </div>
        <h3 className="text-lg font-secondary font-extrabold text-zinc-200 mb-2">
          Pick Your Lucky Number
        </h3>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCountry.code}
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid grid-cols-9 gap-2"
        >
          {Array(selectedCountry.totalNumbers)
            .fill(0)
            .map((_, i) => {
              const number = i + 1
              const selected = countrySelections[selectedCountry.code] === number
              return (
                <motion.button
                  key={number}
                  onClick={() => handleNumberSelect(number)}
                  whileHover={{ scale: 1.15, boxShadow: "0 0 0 4px #FFD70055" }}
                  whileTap={{ scale: 0.95 }}
                  className={`size-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-150 ${
                    selected
                      ? 'bg-[#FFD700] text-white shadow-lg scale-110'
                      : 'bg-gray-100 text-gray-700 hover:bg-amber-100 hover:border-yellow-300'
                  }`}
                >
                  {number}
                </motion.button>
              )
            })}
        </motion.div>
      </AnimatePresence>

      {isModal && (
        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-[#FFD700] text-gray-700 font-bold hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onRandomize}
            className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors"
          >
            🎲
          </button>
        </div>
      )}
    </div>
  )

  if (isModal) {
    return (
      <AnimatePresence>
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md bg-opacity-50 p-4"
        >
          <div className="w-full max-w-md">{content}</div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return content
}

export default NumberSelectionGrid


