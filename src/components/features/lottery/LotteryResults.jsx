import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import PrizePoolBanner from '../../common/PrizePoolBanner';
import TicketsList from './TicketsList';
import UserLotteryTickets from './UserLotteryTickets';
import useLotteryResults from './hooks/useLotteryResults';
import WinnerNotificationModal from '../../common/WinnerNotificationModal';

const LotteryResults = ({ onConfettiChange }) => {
  const {
    loading,
    currentResults,
    allNumbers,
    todayWinningNumbers,
    winnerNumbersObj,
    displayOrders,
    allTickets,
    ticketPrizeMap,
    totalFromTickets,
    totalEarnings,
    hasWinner,
    userWinsForDraw 
  } = useLotteryResults(onConfettiChange);

  // Diagnostic logging for ticket filtering and date comparison
  if (displayOrders && displayOrders.length > 0) {
    console.log('🔎 Diagnostic: displayOrders count:', displayOrders.length);
    displayOrders.forEach((order, idx) => {
      const rawDrawDate = order.drawDate;
      let normalizedDrawDate = rawDrawDate;
      if (rawDrawDate && rawDrawDate.includes(' ')) {
        normalizedDrawDate = rawDrawDate.split(' ')[0];
      }
      const ymdhm = normalizedDrawDate;
      console.log(`🔎 Order[${idx}] rawDrawDate:`, rawDrawDate, '| normalized:', normalizedDrawDate, '| ymdhm:', ymdhm);
    });
    if (todayWinningNumbers && todayWinningNumbers.length > 0) {
      console.log('🔎 Diagnostic: todayWinningNumbers drawDate:', todayWinningNumbers[0].drawDate);
    }
  }

  const [showAvatarModal, setShowAvatarModal] = useState(true);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      </div>
    );
  }

  if (!currentResults?.length || !allNumbers?.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ...no results UI... */}
        {displayOrders?.length > 0 && (
          <UserLotteryTickets
            tickets={displayOrders.flatMap(order => order.tickets || [])}
            winningNumbers={todayWinningNumbers}
            winnerNumbersObj={winnerNumbersObj}
            prizeMap={ticketPrizeMap}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <WinnerNotificationModal
        open={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        hasWinner={hasWinner}
        totalEarnings={totalEarnings}
        userWinsForDraw={userWinsForDraw}
      />
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        {/* Winning Numbers */}
        <motion.div
          className="grid grid-cols-4 flex-wrap gap-6 sm:gap-8 justify-center items-center mb-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          <AnimatePresence>
            {todayWinningNumbers.map(({ country, number, drawDate }) => (
              <motion.div
                key={country + drawDate}
                variants={{
                  hidden: { scale: 0, rotate: -90, opacity: 0 },
                  visible: { scale: 1, rotate: 0, opacity: 1 }
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 flex items-center justify-center shadow-2xl text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                  {number}
                </div>
                <span className="text-sm sm:text-base font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full">
                  {country}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <TicketsList
          displayOrders={displayOrders}
          winningNumbers={todayWinningNumbers.map(w => w.number)}
          winnerNumbersObj={winnerNumbersObj}
          prizeMap={ticketPrizeMap}
        />
      </div>
    </>
  );
};

export default LotteryResults;