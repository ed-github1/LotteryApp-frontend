import React, { useState, useEffect } from "react";

const gradientMap = {
  gold: "bg-gradient-to-b from-[#FFD700] to-[#FFFBEA]",
  silver: "bg-gradient-to-b from-[#B0BEC5] to-[#F5F5F5]",
  bronze: "bg-gradient-to-b from-[#BCAAA4] to-[#F5F5F5]",
};

const TicketCard = ({
  ticket,
  idx,
  onDelete,
  prize = "Main prize",
  amount = "$60,000,000",
  nextDraw = "2025-07-15T22:30:00", // Use ISO format for reliability
  color = "gold",
  buttonText = "Play Now",
  prizeWon = 0,
  winningNumbers = [],
  isWinner = false,
}) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const displayPrice = isNaN(ticket.price) ? "0.00" : ticket.price.toFixed(2);
  const displayPrizeWon = (typeof prizeWon === 'number' && prizeWon > 0) ? prizeWon.toFixed(2) : null;

  useEffect(() => {
    const nextDrawDate = new Date(nextDraw);

    const updateCountdown = () => {
      const now = new Date();
      const timeDiff = nextDrawDate - now;
      if (timeDiff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      setCountdown({ days, hours, minutes, seconds });
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(interval);
  }, [nextDraw]);

  return (
    <div className="relative w-80 rounded-2xl shadow-xl overflow-hidden bg-white flex flex-col">
      {/* Side Perforations */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 pointer-events-none">
        <div className="w-7 h-12 bg-transparent rounded-full shadow-inner border border-white/40"></div>
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 pointer-events-none">
        <div className="w-7 h-12 bg-transparent rounded-full shadow-inner border border-white/40"></div>
      </div>
      {/* Gradient Top */}
      <div className={`p-6 ${gradientMap[color]} text-center`}>
        <div className="uppercase text-lg font-semibold text-gray-700 opacity-80">{prize}</div>
        <div className="text-4xl font-extrabold font-title text-gray-900 mt-2 drop-shadow">{amount}</div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 pb-6">
        <div className="text-center mb-2">
          <div className="text-gray-700 font-semibold">Next draw:</div>
          <div className="text-sm text-gray-500">{nextDraw}</div>
        </div>
        {/* Countdown */}
        <div className="flex justify-center gap-2 my-2">
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center">
            <div className="text-xl font-bold text-gray-900">{countdown.days}</div>
            <div className="text-xs text-gray-500">Days</div>
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center">
            <div className="text-xl font-bold text-gray-900">{countdown.hours}</div>
            <div className="text-xs text-gray-500">Hours</div>
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center">
            <div className="text-xl font-bold text-gray-900">{countdown.minutes}</div>
            <div className="text-xs text-gray-500">Min</div>
          </div>
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-center">
            <div className="text-xl font-bold text-gray-900">{countdown.seconds}</div>
            <div className="text-xs text-gray-500">Sec</div>
          </div>
        </div>
        {/* Winnings / Price Display */}
        {/* Ticket selections (numbers) */}
        {ticket && (ticket.selections || ticket.selection || ticket.numbers || ticket) && (
          <div className="w-full mb-4">
            <div className="flex flex-wrap gap-3 justify-center">
              {(() => {
                const selections = ticket.selections ?? ticket.selection ?? ticket.numbers ?? ticket
                // normalize to array of { country, number }
                let items = []
                if (Array.isArray(selections)) {
                  items = selections.map((s) => {
                    if (s && typeof s === 'object') return { country: s.country || s.countryCode || s.code || '', number: s.number ?? s.value ?? s }
                    return { country: '', number: s }
                  })
                } else if (selections && typeof selections === 'object') {
                  items = Object.entries(selections).map(([k, v]) => ({ country: k, number: v }))
                }
                return items.map((it, i) => {
                  const numStr = String(it.number ?? '')
                  const isMatch = (winningNumbers || []).map(n => String(n)).includes(numStr)
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="text-[10px] text-gray-500 font-bold uppercase">{it.country}</div>
                      <div className={`relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${
                        isMatch
                          ? 'bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 text-white border-2 border-green-300/50'
                          : 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 text-slate-300 border border-slate-600/50'
                      }`}>
                        <span className="drop-shadow text-sm">{numStr}</span>
                        {isMatch && <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>}
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        )}
        <div className="text-center mb-4">
          {displayPrizeWon ? (
            <p className="text-green-600 font-semibold">Winnings: ${displayPrizeWon} USDT</p>
          ) : (
            <p className="text-gray-700 font-semibold">Price: ${displayPrice}</p>
          )}
        </div>
        {/* Button */}
        <button
          className={`mt-4 w-full py-2 rounded-lg font-bold shadow-md transition ${
            color === "gold"
              ? "bg-gradient-to-b from-[#FFD700] to-[#FFC300] text-gray-900 hover:from-[#FFC300]"
              : color === "silver"
              ? "bg-gradient-to-b from-[#B0BEC5] to-[#CFD8DC] text-gray-900 hover:from-[#90A4AE]"
              : "bg-gradient-to-b from-[#BCAAA4] to-[#D7CCC8] text-gray-900 hover:from-[#A1887F]"
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default TicketCard;

