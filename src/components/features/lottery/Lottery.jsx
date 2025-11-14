import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CountriesGrid from './CountriesGrid';
import SelectedCountryInfo from './SelectedCountryInfo';
import ActionButton from '../../common/ActionButtons';
import NumberSelectionGrid from './NumberSelectionGrid';
import { useLotteryLogic } from '../../hooks/useLotteryLogic';
import { motion, AnimatePresence } from 'framer-motion';
import SuperLottoAvatarModal from '../../common/SuperLottoAvatarModal';

const Lottery = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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

  const [showTutorialModal, setShowTutorialModal] = useState(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenLotteryTutorial');
    return !hasSeenTutorial;
  });

  const [showInlineGuide, setShowInlineGuide] = useState(true);

  // Start inline guide after closing intro modal
  const handleCloseTutorial = () => {
    setShowTutorialModal(false);
    localStorage.setItem('hasSeenLotteryTutorial', 'true');
    setShowInlineGuide(true);
  };

  // Dismiss inline guide
  const handleDismissGuide = () => {
    setShowInlineGuide(false);
  };

  return (
    <>
      {/* Intro Modal */}
      <SuperLottoAvatarModal
        open={showTutorialModal}
        onClose={handleCloseTutorial}
        title={t('lottery.welcome')}
        lines={[
          t('lottery.tutorial.line1'),
          t('lottery.tutorial.line2'),
          t('lottery.tutorial.line3'),
          t('lottery.tutorial.line4')
        ]}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-screen pb-10 w-full sm:px-2 relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto space-y-6"
        >
          {/* Inline Guide: Select Countries */}
          <AnimatePresence>
            {showInlineGuide && selectedCount === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-4 shadow-lg border-2 border-purple-300 relative"
              >
                <button
                  onClick={handleDismissGuide}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-sm"
                >
                  ✕
                </button>
                <div className="flex items-center gap-3">

                  <div>
                    <h3 className="text-white font-bold text-lg">{t('lottery.guide.step1.title')}</h3>
                    <p className="text-white/90 text-sm">{t('lottery.guide.step1.desc')}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Inline Guide: Choose Numbers */}
            {showInlineGuide && selectedCount > 0 && selectedCount < 7 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 shadow-lg border-2 border-blue-300 relative"
              >
                <button
                  onClick={handleDismissGuide}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-sm"
                >
                  ✕
                </button>
                <div className="flex items-center gap-3">

                  <div>
                    <h3 className="text-white font-bold text-lg">{t('lottery.guide.step2.title')} ({selectedCount}/8)</h3>
                    <p className="text-white/90 text-sm">{t('lottery.guide.step2.desc')}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div id="countries-grid">
            <CountriesGrid
              countryConfigs={countryConfigs}
              countrySelections={countrySelections}
              handleCountrySelect={handleCountrySelect}
            />
          </div>
          <SelectedCountryInfo
            selectedCountry={selectedCountry}
            pricePerSelection={PRICE_PER_SELECTION}
          />
        </motion.div>

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

        <div className="w-full max-w-7xl mx-auto px-1 mt-8 space-y-4">
          {/* Inline Guide: Add Ticket */}
          <AnimatePresence>
            {showInlineGuide && selectedCount === 7 && tickets.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-4 shadow-lg border-2 border-green-300 relative"
              >
                <button
                  onClick={handleDismissGuide}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-sm"
                >
                  ✕
                </button>
                <div className="flex items-center gap-3">

                  <div>
                    <h3 className="text-white font-bold text-lg">{t('lottery.guide.step3.title')}</h3>
                    <p className="text-white/90 text-sm">{t('lottery.guide.step3.desc')}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ActionButton
            onClick={handleRandomizeAll}
            className="w-full py-4 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-xl hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02] transition-all duration-200 rounded-2xl border-2 border-blue-500/20"
            icon="🎲"
          >
            {t('lottery.randomizeAll')}
          </ActionButton>

          <ActionButton
            onClick={handleClearSelections}
            className="w-full py-4 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-xl hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02] transition-all duration-200 rounded-2xl border-2 border-blue-500/20"
            icon="🗑️"
            disabled={selectedCount === 0}
          >
            {t('lottery.clearSelections')}
          </ActionButton>

          <div id="add-ticket-button">
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
          </div>

          {tickets.length > 0 && (
            <>
              {/* Inline Guide: View Tickets */}
              <AnimatePresence>
                {showInlineGuide && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-4 shadow-lg border-2 border-yellow-300 relative"
                  >
                    <button
                      onClick={handleDismissGuide}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-sm"
                    >
                      ✕
                    </button>
                    <div className="flex items-center gap-3">

                      <div>
                        <h3 className="text-white font-bold text-lg">{t('lottery.guide.step4.title')}</h3>
                        <p className="text-white/90 text-sm">{t('lottery.guide.step4.desc')}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                id="view-tickets-button"
                className="hidden md:flex fixed bottom-8 right-8 z-40 bg-gradient-to-r from-yellow-400 to-yellow-600 text-[#232946] font-bold rounded-full shadow-2xl items-center gap-3 px-6 py-4 text-lg hover:scale-105 transition-all focus:outline-none"
                onClick={() => navigate("/dashboard/ticket-summary")}
                aria-label="View Ticket Summary"
                style={{ boxShadow: '0 8px 32px 0 rgba(255,215,0,0.25)' }}
              >
                <span className="text-2xl">🎫</span>
                <span>{t('lottery.viewTickets')} ({tickets.length})</span>
              </button>

              <button
                id="view-tickets-button-mobile"
                className="flex md:hidden w-full max-w-7xl mx-auto px-4 mt-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-[#232946] font-bold shadow-lg items-center justify-center gap-3 py-4 text-lg"
                onClick={() => navigate("/dashboard/ticket-summary")}
                aria-label="View Ticket Summary"
              >
                <span className="text-2xl">🎫</span>
                <span>{t('lottery.viewTickets')} ({tickets.length})</span>
              </button>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Lottery;