import React from "react";
import { motion } from 'framer-motion';

// Renders a list of user tickets matching the exact style of TicketCard
// FR must match exactly with FR winner number, other countries match if number appears anywhere in winners.

const UserLotteryTickets = ({ tickets, winningNumbers, winnerNumbersObj, prizeMap = {} }) => {
  if (!tickets || tickets.length === 0) {
    return <div className="text-center text-gray-500">No tickets found.</div>;
  }

  // Helper to check if a selection is a match
  // FR must match both country and number, others match if number appears anywhere in winner numbers
  const isMatch = (country, number) => {
    if (!winnerNumbersObj) return false;
    if (country === 'FR') {
      return winnerNumbersObj.FR && Number(number) === Number(winnerNumbersObj.FR);
    } else {
      // Only match if number appears in a non-FR winner number
      return Object.entries(winnerNumbersObj)
        .filter(([key]) => key !== 'FR')
        .map(([, val]) => Number(val))
        .includes(Number(number));
    }
  };

  // Helper to count matches for a ticket (no repeated numbers for non-FR, FR only by country)
  const countMatches = (selections) => {
    const matchedNumbers = new Set();
    let frMatched = false;
    selections.forEach(sel => {
      const country = sel.countryCode || sel.country;
      const number = sel.number;
      if (country === 'FR') {
        if (!frMatched && isMatch(country, number)) {
          frMatched = true;
        }
      } else {
        if (isMatch(country, number)) {
          matchedNumbers.add(number);
        }
      }
    });
    return matchedNumbers.size + (frMatched ? 1 : 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {tickets.map((ticket, idx) => {
        // Handle both array format and selections object format
        const selections = Array.isArray(ticket.selections)
          ? ticket.selections
          : ticket.selections
          ? Object.entries(ticket.selections).map(([countryCode, number]) => ({
              countryCode,
              number,
            }))
          : [];
        
        const displayPrice = ticket.price > 0 ? Number(ticket.price).toFixed(2) : 'N/A';
        const ticketNumber = ticket.ticketNumber || ticket._id;
        const ticketId = ticket.id || ticket._id;
        const prizeAmount = prizeMap[ticketId] || 0;
        const matchCount = countMatches(selections);
  const hasWon = prizeAmount > 0 || matchCount > 0;

        return (
          <motion.div
            key={ticket.id || idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 lg:p-8 bg-zinc-200 relative rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
          >
            {/* Ticket Header with Price and Ticket Number */}
            <div className="flex items-center justify-between mb-4 lg:mb-6 border-b border-dashed border-gray-400 ml-4 lg:ml-8 pb-3 lg:pb-4">
              <div className="flex items-center gap-1 lg:gap-2 text-gray-700 text-xs lg:text-base font-semibold">
                ${displayPrice}
                <span className="text-gray-500 text-[10px] lg:text-sm">USDT</span>
              </div>
              <div className="font-mono text-[8px] lg:text-sm text-gray-700 mr-5">Tkt#{idx + 1}</div>
            </div>

            {/* Prize Label if winner */}
            {hasWon && (
              <div className="mb-3 ml-4 lg:ml-8">
                <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs lg:text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                  🏆 {matchCount} Match{matchCount !== 1 ? 'es' : ''}
                  {prizeAmount > 0 && ` • Prize: $${prizeAmount.toFixed(2)} USDT`}
                </div>
              </div>
            )}
            {/* 0 Matches Badge if no matches and no prize */}
            {!hasWon && (
              <div className="mb-3 ml-4 lg:ml-8">
                <div className="inline-block bg-gray-400 text-white text-xs lg:text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                  🚫 0 matches
                </div>
              </div>
            )}

            {/* Selections Display */}
            <div className="flex items-center justify-center gap-1 lg:gap-2.5 mb-6 ml-2 lg:ml-6">
              {(() => {
                const seenNumbers = new Set();
                let frMatched = false;
                return selections.map((sel, i) => {
                  const country = sel.countryCode || sel.country;
                  const number = sel.number;
                  const isBonus = country === 'FR';
                  let matched = false;
                  if (country === 'FR') {
                    matched = isMatch(country, number) && !frMatched;
                    if (matched) frMatched = true;
                  } else {
                    matched = isMatch(country, number) && !seenNumbers.has(number);
                    if (matched) seenNumbers.add(number);
                  }
                  return (
                    <div key={i} className="flex flex-col items-center gap-0.5 lg:gap-1">
                      {/* Number Ball */}
                      <div 
                        className={`w-8 h-8 lg:w-11 lg:h-11 flex items-center justify-center rounded-full shadow-lg font-black text-xs lg:text-base
                          ${matched ? 'bg-blue-500 text-white' : isBonus ? 'bg-gray-300 text-gray-700' : 'bg-gray-300 text-gray-700'}`}
                      >
                        {number}
                      </div>

                      {/* Country Code */}
                      <span className={`text-[8px] lg:text-xs text-center font-semibold
                          ${matched ? 'text-green-700' : isBonus ? 'text-gray-600' : 'text-gray-600'}`}
                      >
                        {country}
                        {isBonus && <span className="block text-[7px] lg:text-[8px] text-gray-700">Bonus</span>}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Left Side Yellow Border */}
            <div className="absolute left-0 top-0 bottom-0 w-4 lg:w-5 bg-yellow-400 flex items-center justify-center rounded-l-2xl">
              <span className="text-white text-xs lg:text-sm font-bold font-secondary transform -rotate-90 tracking-widest whitespace-nowrap">
                LOTTERY
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default UserLotteryTickets;
