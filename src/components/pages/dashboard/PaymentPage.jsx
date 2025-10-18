import { motion, AnimatePresence } from "framer-motion";
import Stepper from "../../common/Stepper";
import ActionButton from '../../common/ActionButtons'
import PaymentMethodSelector from "../../features/Payment/PaymentMethodSelector";
import PaymentSummaryHeader from "../../features/Payment/PaymentSummaryHeader";
import PaymentQRSection from "../../features/Payment/PaymentQrSection";
import usePayment from "../../hooks/usePayment";
import { FiRefreshCw } from "react-icons/fi";

function NavigationButtons({ isSubmitting, navigate }) {
  return (
    <motion.div
      className="flex gap-4 justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <ActionButton
        className="w-full py-4 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-xl hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02] transition-all duration-200 rounded-2xl border-2 border-blue-500/20"
        onClick={() => navigate('/dashboard/ticket-summary')}
        disabled={isSubmitting}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Go Back
      </ActionButton>
    </motion.div>
  );
}

// --- MAIN PAGE ---
const PaymentPage = () => {
  const {
    selected,
    setSelected,
    tkid,
    setTkid,
    isSubmitting,
    error,
    copied,
    tkidValid,
    timeLeft,
    totalAmount,
    qrData,
    qrUrl,
    copyToClipboard,
    validateAndSubmit,
    resetFlow,
    navigate
  } = usePayment();

  return (
    <>
      {selected && (
        <PaymentSummaryHeader totalAmount={totalAmount} timeLeft={timeLeft} />
      )}
      <Stepper currentStep={3} />
      <div className="min-h-screen flex flex-col items-center justify-center pb-30">
        <motion.div
          className="w-full max-w-7xl mx-auto pb-10 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {!selected ? (
              <PaymentMethodSelector selected={selected} setSelected={setSelected} />
            ) : (
              <PaymentQRSection
                selected={selected}
                totalAmount={totalAmount}
                qrUrl={qrUrl}
                qrData={qrData}
                copied={copied}
                copyToClipboard={copyToClipboard}
                tkid={tkid}
                setTkid={setTkid}
                tkidValid={tkidValid}
                isSubmitting={isSubmitting}
                validateAndSubmit={validateAndSubmit}
                error={error}
                resetFlow={resetFlow}
              />
            )}
          </AnimatePresence>
        </motion.div>
        {selected && (
          <motion.div
            className="flex flex-col gap-4 w-full max-w-2xl mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <ActionButton
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={validateAndSubmit}
              disabled={!tkid || tkidValid === false || isSubmitting}
              whileHover={{ scale: tkidValid ? 1.05 : 1 }}
              whileTap={{ scale: tkidValid ? 0.95 : 1 }}
            >
              {isSubmitting ? (
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <FiRefreshCw className="animate-spin h-5 w-5 mr-2" />
                  Submitting Transaction...
                </motion.div>
              ) : (
                "Submit Transaction"
              )}
            </ActionButton>
            <ActionButton
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={resetFlow}
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Choose Another Method
            </ActionButton>
            <NavigationButtons isSubmitting={isSubmitting} navigate={navigate} />
          </motion.div>
        )}
      </div>
    </>
  );
};

export default PaymentPage;
