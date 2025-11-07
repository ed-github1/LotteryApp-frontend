import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTicket } from "../../../context/TicketContext";
import { useStepper } from "../../../context/StepContext";
import TicketSummary from "../../features/lottery/TicketSummary";
import Stepper from "../../common/Stepper";

const TicketSummaryPage = () => {
  const { tickets, removeTicket, countryConfigs } = useTicket();
  const { goToNextStep } = useStepper();
  
  const [showInlineGuide, setShowInlineGuide] = useState(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenTicketSummaryGuide');
    return !hasSeenGuide;
  });

  const handleDismissGuide = () => {
    setShowInlineGuide(false);
    localStorage.setItem('hasSeenTicketSummaryGuide', 'true');
  };

  const handleDeleteTicket = (idx) => removeTicket(idx);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pb-32 lg:pb-12 ">
      <Stepper />
      
      {/* Inline Guide */}
      <AnimatePresence>
        {showInlineGuide && tickets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-7xl px-4 mb-4"
          >
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-4 shadow-lg border-2 border-green-300 relative">
              <button
                onClick={handleDismissGuide}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-sm"
              >
                ✕
              </button>
              <div className="flex items-center gap-3">
           
                <div>
                  <h3 className="text-white font-bold text-lg">📋 Revisa Tus Boletos</h3>
                  <p className="text-white/90 text-sm">Verifica tus selecciones, puedes borrar boletos si no estas seguro o regresar a escoger otros numeros, haz clic en el boton "Continue to Next Step" cuando estés listo</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full px-4 bg-white/5">
        <div className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Review Your Tickets
        </div>
        <TicketSummary
          tickets={tickets}
          handleDeleteTicket={handleDeleteTicket}
          countryConfigs={countryConfigs}
          onReview={goToNextStep}
        />
      </div>
    </div>
  );
};

export default TicketSummaryPage;