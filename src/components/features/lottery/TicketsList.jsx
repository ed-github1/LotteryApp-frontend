import React from 'react'
import UserLotteryTickets from './UserLotteryTickets'

export default function TicketsList({
  displayOrders = [],
  prizeMap = {},
  checkIfTicketIsWinner = () => false,
  highlightActive = false,
  winningNumbers = [],
  winnerNumbersObj = {},
}) {
  return (
    <div className="mt-12">
      {displayOrders && displayOrders.length > 0 ? (
        displayOrders.map((order, orderIdx) => (
          <div key={order?._id || orderIdx} className="w-full mb-8">
            <h3 className="text-lg font-bold text-white mb-2">Order #{orderIdx + 1}</h3>
            <UserLotteryTickets
              tickets={order.tickets || []}
              winningNumbers={winningNumbers}
              winnerNumbersObj={winnerNumbersObj}
              prizeMap={prizeMap}
            />
          </div>
        ))
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
  )
}
