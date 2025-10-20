import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDraw } from '../../../context/DrawContext';
import { useOrders } from '../../../context/OrdersContext';
import { useAuth } from '../../../context/AuthContext';
import PrizePoolBanner from '../../common/PrizePoolBanner';
import TicketsList from './TicketsList';
import useWinnerNumbers from '../../../hooks/useWinnerNumbers';
import useTicketPrizes from '../../../hooks/useTicketPrizes';
import { getMyWins } from '../../../services/rewardsService';
import UserLotteryTickets from './UserLotteryTickets';

const LotteryResults = ({ onConfettiChange }) => {
  const { getDrawsWeekRange, nextDraws } = useDraw();
  const { myPaidOrders, fetchMyPaidOrders } = useOrders();
  const { token } = useAuth();
  const [userWins, setUserWins] = useState([]);
  const [loading, setLoading] = useState(true);
  // Removed manual refresh state
  const { loading: winnersLoading, currentResults, fetch: fetchWinnerNumbers, allNumbers, grouped, sortedDates } = useWinnerNumbers();

  // Fetch user orders and current winner numbers on component mount
  useEffect(() => {
    const loadData = async () => {
      await fetchMyPaidOrders();
      try {
        setLoading(true);
        // fetch winner numbers via hook
        await fetchWinnerNumbers();

        // Fetch user wins via service
        try {
          // Debug: Check if auth token exists
          console.log('🔑 Auth token check:', token ? 'Token exists' : 'No token found');
          
          if (!token) {
            console.log('⚠️ No token available, skipping wins fetch');
            setUserWins([]);
          } else {
            const winsData = await getMyWins(token);
            console.log('🎯 Raw wins data from API:', winsData);
            const winsArray = Array.isArray(winsData.wins) ? winsData.wins : [];
            console.log('🎯 Wins array:', winsArray);
            setUserWins(winsArray);
          }
        } catch (error) {
          console.error('⚠️ Could not fetch user wins:', error.response?.status, error.response?.data);
          console.log('⚠️ Using local winner detection only');
          setUserWins([]);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [fetchMyPaidOrders, fetchWinnerNumbers]);

  // Removed manual refresh function

  // Group results by drawDate and sort dates globally for use throughout the component
  // allNumbers, grouped, sortedDates are provided by useWinnerNumbers hook

  const weekRange = getDrawsWeekRange(nextDraws);

  // Determine today's draw date (daily draws at 20:00 UTC)
  const today = new Date();
  const todayDateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

  // Show tickets for the draw that has winner numbers (or today's draw if no winner numbers yet)
  let currentDrawDate = null;
  let targetDateStr = todayDateStr; // Default to today
  

  // Helper to extract YYYY-MM-DD from various date formats
  const extractDateStr = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes(' ')) {
      return dateStr.split(' ')[0];
    }
    return new Date(dateStr).toISOString().split('T')[0];
  };

  // Filter winning numbers for today's draw only
  const todayWinningNumbers = allNumbers.filter(w => extractDateStr(w.drawDate) === todayDateStr);
  // Build winnerNumbersObj for highlight logic
  const winnerNumbersObj = {};
  todayWinningNumbers.forEach(w => {
    winnerNumbersObj[w.country] = w.number;
  });
  
  // If winner numbers exist, use their draw date
  if (allNumbers && allNumbers.length > 0 && allNumbers[0].drawDate) {
    targetDateStr = extractDateStr(allNumbers[0].drawDate);
    currentDrawDate = new Date(targetDateStr + 'T00:00:00Z');
    console.log('✅ Using winner numbers date:', targetDateStr);
  } else if (currentResults && currentResults.length > 0 && currentResults[0].drawDate) {
    // Fallback: try getting date from currentResults
    targetDateStr = extractDateStr(currentResults[0].drawDate);
    currentDrawDate = new Date(targetDateStr + 'T00:00:00Z');
  } else {
    // If no winner numbers yet, use today's date for ticket filtering
    currentDrawDate = today;
  }

  // Filter user wins for the current draw date
  let userWinsForDraw = [];

  
  if (currentDrawDate && userWins.length > 0) {
    const drawDateStr = extractDateStr(targetDateStr) || currentDrawDate.toISOString().split('T')[0];
    console.log('🔍 Looking for wins with drawDateStr:', drawDateStr);
    
    userWinsForDraw = userWins.filter(win => {
      const winDateStr = extractDateStr(win.drawDate);
      console.log('🔍 Comparing win date:', winDateStr, 'vs target:', drawDateStr);
      return winDateStr === drawDateStr;
    });

  }

  // Calculate total earnings for current draw
  let totalEarnings = 0;
  if (userWinsForDraw.length > 0) {
    totalEarnings = userWinsForDraw.reduce((sum, win) => {
      const prize = win.prize || win.prizeAmount || 0;
      console.log('🔍 Adding prize:', prize, 'from win:', win);
      return sum + prize;
    }, 0);
  }

  // computePrizeForTicket is now handled inside useTicketPrizes

  // Winner detection: ticket and winner number must have the same draw date, then match country and number
  const checkIfTicketIsWinner = (ticket) => {
    if (!allNumbers || allNumbers.length === 0) return false;
    const ticketDrawDateStr = extractDateStr(ticket.orderDrawDate || ticket.drawDate);
    const selections = Array.isArray(ticket.selections)
      ? ticket.selections
      : Object.entries(ticket.selections || {}).map(([countryCode, number]) => ({ countryCode, number }));
    // Only count as winner if BOTH country, number, and draw date match
    return selections.some(sel => {
      return allNumbers.some(winObj => {
        const winnerDrawDateStr = extractDateStr(winObj.drawDate);
        return (
          winObj.country === sel.countryCode &&
          String(winObj.number) === String(sel.number) &&
          winnerDrawDateStr === ticketDrawDateStr
        );
      });
    });
  };

  // For daily draws, just get today's date
  let startDrawDate = null;
  if (currentDrawDate) {
    startDrawDate = new Date(currentDrawDate);
    startDrawDate.setUTCHours(0,0,0,0);
  }

  // Show only tickets for today's draw
  let displayOrders = [];
  if (myPaidOrders && myPaidOrders.length > 0) {
    displayOrders = myPaidOrders.filter(order => {
      if (order.paymentStatus !== 'paid') return false;
      if (!order.drawDate) return false;
      let orderDateObj;
      if (order.drawDate.includes('T')) {
        orderDateObj = new Date(order.drawDate);
      } else {
        const [datePart, timePart] = order.drawDate.split(' ');
        orderDateObj = new Date(datePart + 'T' + (timePart || '00:00:00') + 'Z');
      }
      const orderDateStr = orderDateObj.toISOString().split('T')[0];
      // Only match today's date
      return orderDateStr === todayDateStr;
    });
  }
  // Sort by drawDate descending
  displayOrders = displayOrders
    .filter(Boolean)
    .sort((a, b) => new Date(b.drawDate) - new Date(a.drawDate));

  // Flatten all tickets from all orders into a single array for prize matching
  const allTickets = displayOrders.flatMap(order => 
    (order.tickets || []).map(ticket => ({
      ...ticket,
      orderId: order._id,
      orderDrawDate: order.drawDate
    }))
  );
 

  // Compute per-ticket prize map using hook (pass individual tickets, not orders)
  const { prizeMap: ticketPrizeMap, totalFromTickets } = useTicketPrizes({ 
    displayOrders: allTickets,  // Pass individual tickets
    userWinsForDraw 
  });



  // Check if the user has at least one ticket with a match (for confetti)
  const winnerNumbersArray = todayWinningNumbers.map(w => Number(w.number));
  const hasWinner = displayOrders.some(order =>
    (order.tickets || []).some(ticket => {
      const selections = Array.isArray(ticket.selections)
        ? ticket.selections.map(sel => Number(sel.number))
        : Object.values(ticket.selections || {}).map(n => Number(n));
      return selections.some(userNum => winnerNumbersArray.includes(userNum));
    })
  );


  // Generate confetti if there's a winner and trigger via callback
  useEffect(() => {
    if (hasWinner && onConfettiChange) {
      const generateConfetti = () => {
        return Array.from({ length: 100 }, (_, i) => ({
          id: i,
          left: Math.random() * 100,
          rot: Math.random() * 360,
          delay: Math.random() * 2,
          size: Math.random() * 10 + 5,
          bg: `hsl(${Math.random() * 360}, 100%, 50%)`
        }));
      };
      onConfettiChange(generateConfetti());
    }
  }, [hasWinner, onConfettiChange]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto animate-spin shadow-2xl">
              <span className="text-4xl">🎯</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Loading Results...</h2>
            <p className="text-white/70 max-w-md mx-auto px-4">
              Fetching the latest winner numbers...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentResults || !currentResults.length || !allNumbers || allNumbers.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="min-h-[50vh]">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">🎯 Lottery Results</h2>
            
            {/* Draw Date Display */}
            <div className="mb-6">
              <span className="text-sm text-white/70 bg-white/10 px-4 py-2 rounded-full inline-block">
                Today's Draw: {today.toLocaleDateString()}
              </span>
              <p className="text-xs text-white/60 mt-3">
                Daily draw at 8:00 PM UTC (20:00 UTC) • Results will be available after the draw
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center min-h-[30vh] text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl">
                <span className="text-4xl">🎯</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Waiting for Today's Draw</h2>
              <p className="text-white/70 max-w-md mx-auto px-4">
                Winner numbers will be announced after today's lottery draw at 8:00 PM UTC.
              </p>
            </div>
          </div>

          {/* Show user's tickets for today's draw */}
          {myPaidOrders && myPaidOrders.length > 0 && (
            <div className="w-full max-w-4xl mx-auto">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-6 text-center">Your Tickets for Today's Draw</h3>
              {displayOrders && displayOrders.length > 0 ? (
                <UserLotteryTickets
                  tickets={displayOrders.flatMap(order => order.tickets || [])}
                  winningNumbers={todayWinningNumbers}
                  winnerNumbersObj={winnerNumbersObj}
                  prizeMap={ticketPrizeMap}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-xl">
                    <span className="text-3xl">🎫</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">No Tickets for Today</h3>
                  <p className="text-white/70 max-w-md mx-auto px-4">
                    You don't have any tickets for today's draw. Visit the lottery page to purchase tickets!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }



  // Find the latest available draw date
  let latestDrawDateIso = null;
  if (sortedDates && sortedDates.length > 0) {
    // Use the first result's drawDate, parse to ISO
    const firstDraw = grouped[sortedDates[0]][0];
    if (firstDraw && firstDraw.drawDate) {
      if (firstDraw.drawDate.includes('T')) {
        latestDrawDateIso = new Date(firstDraw.drawDate).toISOString();
      } else {
        // Parse 'YYYY-MM-DD HH:mm:ss' as UTC
        const [datePart, timePart] = firstDraw.drawDate.split(' ');
        latestDrawDateIso = new Date(datePart + 'T' + (timePart || '00:00:00') + 'Z').toISOString();
      }
    }
  }


  return (
    <div className="max-w-7xl mx-auto px-2  sm:px-6 lg:px-8 py-8">
      <div className="min-h-[50vh] rounded-2xllg:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">🎯 Lottery Results</h2>
      
          {/* 0 Matches Badge */}
          {allTickets.length > 0 && allTickets.every(ticket => !checkIfTicketIsWinner(ticket)) && (
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                <span>🚫</span> 0 matches
              </span>
            </div>
          )}
          {/* Draw Date Display */}
          <div className="mb-6">
            <span className="text-sm text-white/70 bg-white/10 px-4 py-2 rounded-full inline-block">
              Today's Draw: {today.toLocaleDateString()}
            </span>
            <p className="text-xs text-white/60 mt-3">
              Daily draw at 7:00 PM  • Results announced
            </p>
          </div>
        </div>

        {/* Winning Numbers */}
        <motion.div
          className="grid grid-cols-4 flex-wrap gap-6 sm:gap-8 justify-center items-center mb-12 "
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
            {allNumbers.map(({ country, number, drawDate }) => (
              <motion.div
                key={country + drawDate}
                variants={{
                  hidden: { scale: 0, rotate: -90, opacity: 0 },
                  visible: { scale: 1, rotate: 0, opacity: 1 }
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex flex-col items-center gap-2 "
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24  rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 flex items-center justify-center shadow-2xl text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                  {number}
                </div>
                <span className="text-sm sm:text-base font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full">
                  {country}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    {/* Inline Prize Pool and Total Earnings Container */}
          <div className="flex flex-col sm:flex-row justify-center items-stretch gap-4 sm:gap-6 my-8 max-w-4xl mx-auto">
            {currentDrawDate && (
              <div className="flex-1 min-w-0">
                <PrizePoolBanner drawDate={latestDrawDateIso} />
              </div>
            )}
            {(totalFromTickets > 0 || totalEarnings > 0) && (
              <div className="flex-1 min-w-0">
                <div className="h-full flex items-center justify-center bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-2xl shadow-2xl border-2 border-green-400/30 p-4 sm:p-6 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                      <span className="text-2xl sm:text-3xl">💰</span>
                    </div>
                    <div className="text-left">
                      <div className="text-xs sm:text-sm font-semibold text-white/90 uppercase tracking-wider mb-1">Total Earnings</div>
                      <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white drop-shadow-lg">
                        ${(totalFromTickets || totalEarnings).toFixed(2)} <span className="text-sm sm:text-base font-medium">USDT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
      {/* Tickets Section */}
      <TicketsList
        displayOrders={displayOrders}
        checkIfTicketIsWinner={checkIfTicketIsWinner}
        winningNumbers={todayWinningNumbers.map(w => w.number)}
        winnerNumbersObj={winnerNumbersObj}
        highlightActive={todayWinningNumbers.length >= 5}
        prizeMap={ticketPrizeMap}
      />
    </div>
  );
}

export default LotteryResults;