import { motion } from 'framer-motion';
import { useStepper } from '../../context/StepContext';
import { FaCheck } from 'react-icons/fa';

const Stepper = () => {
  const { steps = [], currentStep = 0, goToStep } = useStepper();

  if (!steps.length || currentStep === 0) return null;

  const progress =
    steps.length > 1 ? ((Math.max(0, currentStep - 1) / (steps.length - 1)) * 100) : 0;

  // Offset so the line starts/ends at the center of the circles, responsive
  const offset = 'calc(12.5% + 12px)';

  return (
    <div className="w-full mx-auto px-4 my-5 ">
      <div className="relative">
        {/* Track Container */}
        <div
          className="absolute top-6 h-1 bg-white/20 rounded-full"
          style={{ left: offset, right: offset }}
        >
          {/* Animated Progress */}
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 flex justify-between items-center">
          {steps.map((step, idx) => {
            const isActive = step.step === currentStep;
            const isCompleted = step.step < currentStep;

            return (
              <div
                key={step.step}
                className="flex flex-col items-center w-1/4 text-center cursor-default"
                aria-current={isActive ? 'step' : undefined}
              >
                <motion.button
                  onClick={() => isCompleted && goToStep(step.step)}
                  whileHover={isCompleted ? { scale: 1.06 } : { scale: 1.02 }}
                  whileTap={isCompleted ? { scale: 0.98 } : {}}
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all focus:outline-none
                    ${isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-500 text-white' : ''}
                    ${isActive ? 'bg-white border-emerald-500 text-emerald-600 shadow-lg' : 'bg-slate-800 border-white/20 text-gray-300'}
                  `}
                  aria-label={step.label}
                >
                  {isCompleted ? (
                    <motion.span
                      initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <FaCheck />
                    </motion.span>
                  ) : (
                    <motion.span
                      initial={{ scale: 0.9, opacity: 0.6 }}
                      animate={{ scale: isActive ? 1.08 : 1, opacity: isActive ? 1 : 0.9 }}
                      transition={{ duration: 0.28 }}
                      className="font-semibold"
                    >
                      {idx + 1}
                    </motion.span>
                  )}
                </motion.button>

                <motion.div
                  className={`mt-2 text-[10px] md:text-sm font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}
                  initial={{ y: 4, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.06 * idx }}
                >
                  {step.label}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Stepper;