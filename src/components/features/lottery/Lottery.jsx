import { useNavigate } from 'react-router-dom';
import CountriesGrid from './CountriesGrid';
import SelectedCountryInfo from './SelectedCountryInfo';
import ActionButton from '../../common/ActionButtons';
import NumberSelectionGrid from './NumberSelectionGrid';
import { useLotteryLogic } from '../../hooks/useLotteryLogic';
import { motion } from 'framer-motion';

const Lottery = () => {
  const navigate = useNavigate();
  const {
    countryConfigs,
    tickets,
    selectedCountry,
    setSelectedCountry,
    countrySelections,
    selectedCount,
    totalPrice,
    isSaveDisabled,
    handleCountrySelect,
    handleNumberSelect,
    handleSaveTicket,
    handleRandomizeAll,
    handleRandomizeCountry,
    handleClearSelections,
    PRICE_PER_SELECTION,
    MAX_TICKETS,
  } = useLotteryLogic();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen  pb-10 w-full  sm:px-2 relative "
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto space-y-6"
      >
    
        <CountriesGrid
          countryConfigs={countryConfigs}
          countrySelections={countrySelections}
          handleCountrySelect={handleCountrySelect}
        />
        <SelectedCountryInfo
          selectedCountry={selectedCountry}
          pricePerSelection={PRICE_PER_SELECTION}
        />
      </motion.div>
      {/* Number selection grid as modal/drawer */}
      {selectedCountry && (
        <NumberSelectionGrid
          selectedCountry={selectedCountry}
          countrySelections={countrySelections}
          handleNumberSelect={handleNumberSelect}
          isModal={true}
          onClose={() => setSelectedCountry(null)}
          onRandomize={() => handleRandomizeCountry(selectedCountry.code)}
        />
      )}
      {/* Unified button container for mobile */}
      <div className="w-full max-w-7xl mx-auto px-1 mt-8 space-y-4">
        <ActionButton
          onClick={handleRandomizeAll}
          className="w-full py-4 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-xl hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02] transition-all duration-200 rounded-2xl border-2 border-blue-500/20"
          icon="🎲"
        >
          Quick Pick (Random)
        </ActionButton>
        <ActionButton
          onClick={handleClearSelections}
          className="w-full py-4 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-xl hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02] transition-all duration-200 rounded-2xl border-2 border-blue-500/20"
          icon="🗑️"
          disabled={selectedCount === 0}
        >
          Clear Selections
        </ActionButton>
        <ActionButton
          onClick={handleSaveTicket}
          className={`w-full h-16 py-4 font-bold text-xl shadow-2xl hover:scale-[1.02] transition-all duration-200 rounded-2xl border-2 ${!isSaveDisabled
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-xl hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02] transition-all duration-200 rounded-2xl border-2 border-blue-500/20'
            : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400 border-gray-500/20 cursor-not-allowed'
            }`}
          icon="🛒"
          disabled={isSaveDisabled}
        >
          {tickets.length >= MAX_TICKETS
            ? `Max ${MAX_TICKETS} Tickets Reached`
            : selectedCount < 7
              ? `Select ${7 - selectedCount} More Countries`
              : `Add Ticket - $${totalPrice} (${selectedCount}/8)`}
        </ActionButton>

        {tickets.length > 0 && (
          <>
            <button
              className="hidden md:flex fixed bottom-8 right-8 z-40 bg-gradient-to-r from-yellow-400 to-yellow-600 text-[#232946] font-bold rounded-full shadow-2xl items-center gap-3 px-6 py-4 text-lg hover:scale-105 transition-all focus:outline-none"
              onClick={() => navigate("/dashboard/ticket-summary")}
              aria-label="View Ticket Summary"
              style={{ boxShadow: '0 8px 32px 0 rgba(255,215,0,0.25)' }}
            >
              <span className="text-2xl">🎟️</span>
              <span>View Tickets ({tickets.length})</span>
            </button>
            <button
              className="flex md:hidden w-full max-w-7xl mx-auto px-4 mt-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-[#232946] font-bold shadow-lg items-center justify-center gap-3 py-4 text-lg"
              onClick={() => navigate("/dashboard/ticket-summary")}
              aria-label="View Ticket Summary"
            >
              <span className="text-2xl">🎟️</span>
              <span>View Tickets ({tickets.length})</span>
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}


export default Lottery;