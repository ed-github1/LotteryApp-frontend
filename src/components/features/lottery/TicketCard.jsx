import { useTicket } from '../../../context/TicketContext';
import { motion } from 'framer-motion'
import { IoClose } from 'react-icons/io5'

const TicketCard = ({ ticket, idx, onDelete, winningTicketsMap = new Map(), isWinner = false, winningNumbers = [] }) => {
  const { countryConfigs } = useTicket();
  const selections = Array.isArray(ticket.selections)
    ? ticket.selections
    : Object.entries(ticket.selections || {}).map(([countryCode, number]) => ({ countryCode, number }));

  // Handle NaN price by displaying a fallback
  const displayPrice = ticket.price > 0 ? Number(ticket.price).toFixed(2) : 'N/A';

  // Determine if this ticket is a winner
  let prizeLabel = null;
  if (ticket._id && winningTicketsMap.has(ticket._id)) {
    const win = winningTicketsMap.get(ticket._id);
    if (win && win.prizeAmount > 0) {
      prizeLabel = `🏆 Prize: $${win.prizeAmount.toFixed(2)} USDT`;
    }
  } else if (isWinner) {
    // Fallback: show winner message even without API data
    prizeLabel = `🏆 Winner!`;
  }

  // Determine which numbers are matches
  const matchNumbers = Array.isArray(winningNumbers)
    ? winningNumbers.map(n => Number(n))
    : [];

  return (
    <>
      {/* Ticket Body */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: idx * 0.1 }}
        className="p-4 lg:p-8 bg-zinc-200 relative rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
        {/* Close Button - Positioned at the very edge of top right corner */}
        {onDelete && (
          <button
            onClick={onDelete}
            className="absolute right-0 top-0 z-20 w-7 h-7 lg:w-8 lg:h-8 bg-gray-200 hover:bg-red-500 text-gray-600 hover:text-white rounded-tr-xl rounded-bl-xl  flex items-center justify-center shadow transition-all duration-200 hover:scale-110"
          >
            <IoClose className="text-base lg:text-lg" />
          </button>
        )}
        {/* Ticket Header with Price and Prize */}
        <div className="flex items-center justify-between mb-4 lg:mb-6 border-b border-dashed border-gray-400 ml-4 lg:ml-8 pb-3 lg:pb-4">
          <div className="flex items-center gap-1 lg:gap-2 text-gray-700 text-xs lg:text-base font-semibold">
            ${displayPrice}
            <span className="text-gray-500 text-[10px] lg:text-sm">USDT</span>
          </div>
          <div className="font-mono text-[8px] lg:text-sm text-gray-700 mr-5">Tkt#{idx + 1}</div>
        </div>

        {/* Prize Label if winner */}
        {prizeLabel && (
          <div className="mb-2 ml-4 lg:ml-8">
            <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs lg:text-sm font-bold px-3 py-1 rounded-full shadow">
              {prizeLabel}
            </span>
          </div>
        )}

        {/* Selections Display */}
        <div className="flex items-center justify-center gap-1 lg:gap-2.5 mb-6 ml-2 lg:ml-6">
          {selections.map((sel, i) => {
            const country = countryConfigs.find(
              (c) => c.code === sel.countryCode
            );
            const isBonus = sel.countryCode === 'FR';
            const isMatch = matchNumbers.includes(Number(sel.number));
            return (
              <div key={i} className="flex flex-col items-center gap-0.5 lg:gap-1">
                {/* Number Ball */}
                <div className={`w-8 h-8 lg:w-11 lg:h-11 flex items-center justify-center rounded-full shadow-lg font-black text-xs lg:text-base
                  ${isMatch ? 'bg-blue-500 text-white' : isBonus ? 'bg-gray-300 text-gray-700' : 'bg-gray-300 text-gray-700'}`}
                >
                  {sel.number}
                </div>

                {/* Country Code */}
                <span className={`text-[8px] lg:text-xs text-center font-semibold
                  ${isMatch ? 'text-green-700' : isBonus ? 'text-gray-600' : 'text-gray-600'}`}
                >
                  {country ? country.code : sel.countryCode}
                  {isBonus && <span className="block text-[7px] lg:text-[8px] text-gray-700">Bonus</span>}
                </span>
              </div>
            );
          })}
        </div>

        {/* Left Side Yellow Border */}
        <div className="absolute left-0 top-0 bottom-0 w-4 lg:w-5 bg-yellow-400 flex items-center justify-center rounded-l-2xl">
          <span className="text-white text-xs lg:text-sm font-bold font-secondary transform -rotate-90 tracking-widest whitespace-nowrap">
            LOTTERY
          </span>
        </div>
      </motion.div>  </>
  )
}

export default TicketCard
