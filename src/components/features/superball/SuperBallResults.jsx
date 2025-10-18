import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMySuperBallEntries, getSuperballWinners } from '../../../services/superballService';
import { useAuth } from '../../../context/AuthContext';

const SuperBallResults = ({ onConfettiChange }) => {
  const { token, user } = useAuth();
  const [superBallEntries, setSuperBallEntries] = useState([]);
  const [winnersData, setWinnersData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's SuperBall entries and winners data
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        
        // Fetch user's entries
        const entriesData = await getMySuperBallEntries(token);
        setSuperBallEntries(Array.isArray(entriesData) ? entriesData : []);
        
        // Fetch winners data
        const winners = await getSuperballWinners();
        setWinnersData(Array.isArray(winners) ? winners : []);
        
      } catch (error) {
        console.error('Error fetching SuperBall data:', error);
        setSuperBallEntries([]);
        setWinnersData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // SuperBall entries are the tickets themselves (not nested like lottery tickets)
  // Each entry has: orderId, numbers, drawDate, createdAt
  const ticketsToDisplay = Array.isArray(superBallEntries) ? superBallEntries : [];

 
  // Get the most recent winner number from winners data
  const latestWinner = winnersData.length > 0 ? winnersData[0] : null;
  const winningNumber = latestWinner ? latestWinner.winnerNumber : null;

  // Trigger confetti when user wins
  useEffect(() => {
    if (winnersData.length > 0 && user?.email && onConfettiChange) {
      const userWin = winnersData.some(draw => 
        draw.winners && draw.winners.some(w => w.email === user.email)
      );
      if (userWin) {
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
    }
  }, [winnersData, user?.email, onConfettiChange]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-6 mx-auto animate-spin shadow-2xl">
              <span className="text-4xl">🎱</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Loading SuperBall Results...</h2>
            <p className="text-white/70 max-w-md mx-auto px-4">
              Fetching the latest SuperBall data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Winning Number Display */}
      <div className="bg-gradient-to-br from-purple-900/50 via-purple-800/50 to-indigo-900/50 backdrop-blur-md rounded-2xl p-4 sm:p-8 my-4 sm:my-5 border border-purple-400/20 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center w-full"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-wide mb-2 sm:mb-3">
            🎱 SuperBall
            <span className="block sm:inline sm:ml-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Winning Number
            </span>
          </h2>
          <div className="text-purple-200 mt-2 sm:mt-3 text-xs sm:text-sm md:text-base">Latest Draw Result</div>
        </motion.div>
        <div className="flex justify-center gap-4 my-4 sm:my-8">
          <motion.div
            className="flex items-center justify-center rounded-full shadow-2xl bg-white"
            style={{ width: 64, height: 64, minWidth: 64, minHeight: 64 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {winningNumber !== null ? (
              <span
                className="font-extrabold"
                style={{
                  fontFamily: 'monospace',
                  fontSize: '2rem',
                  color: '#7c3aed',
                  textShadow: '0 2px 8px rgba(0,0,0,0.25), 0 1px 0 #fff'
                }}
              >
                {winningNumber}
              </span>
            ) : (
              <span className="text-purple-200 text-2xl">?</span>
            )}
          </motion.div>
        </div>
      </div>

      {/* User's SuperBall Tickets */}
      <SuperBallTicketSelections 
        tickets={ticketsToDisplay} 
        winnersData={winnersData}
        userEmail={user?.email}
      />
    </div>
  );
};

{/* User's SuperBall Tickets Component */}
const SuperBallTicketSelections = ({ tickets, winnersData, userEmail }) => {
  const [hasMatch, setHasMatch] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [totalPrize, setTotalPrize] = useState(0);

  // Get the most recent winner number
  const latestWinner = winnersData.length > 0 ? winnersData[0] : null;
  const winningNumber = latestWinner ? latestWinner.winnerNumber : null;

  // Check if user won in any draw
  useEffect(() => {
    if (winnersData.length > 0) {
      const userWin = winnersData.some(draw => 
        draw.winners && draw.winners.some(w => w.email === userEmail)
      );
      if (userWin) {
        setHasMatch(true);
        // Calculate total prize
        const userWins = winnersData.filter(draw => 
          draw.winners && draw.winners.some(w => w.email === userEmail)
        );
        const prize = userWins.reduce((sum, draw) => {
          const userWinner = draw.winners.find(w => w.email === userEmail);
          return sum + (userWinner ? userWinner.prize : 0);
        }, 0);
        setTotalPrize(prize);
        
        // Delay modal to let confetti trigger first
        setTimeout(() => {
          setShowWinnerModal(true);
        }, 500); // 500ms delay for confetti to start
      }
    }
  }, [winnersData, userEmail]);

  if (!tickets || tickets.length === 0) {
    return (
      <div className="mt-12 text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-xl">
          <span className="text-3xl">🎫</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Your SuperBall Orders</h3>
        <div className="bg-zinc-800/50 rounded-xl p-8 text-center max-w-2xl mx-auto">
          <p className="text-gray-400 text-lg mb-4">You haven't entered any SuperBall draws yet.</p>
          <p className="text-purple-400 text-sm mb-6">Purchase your SuperBall entry to participate in the special draw!</p>
          <button 
            onClick={() => window.location.href = '/dashboard/superball'}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg"
          >
            Enter Now →
          </button>
        </div>
      </div>
    );
  }

  // Helper to check if ticket matches
  const isMatch = (ticket) => ticket.numbers && ticket.numbers.includes(Number(winningNumber));
  
  const matchingTickets = tickets.filter(isMatch);

  useEffect(() => {
    if (winningNumber && matchingTickets.length > 0) {
      setHasMatch(true);
    }
  }, [winningNumber, matchingTickets.length]);

  return (
    <div className="mt-12">
      {/* Winner Modal */}
      <AnimatePresence>
        {showWinnerModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWinnerModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              {/* Modal Content */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border-2 border-yellow-400 rounded-2xl p-6 lg:p-8 text-center shadow-2xl max-w-md w-full relative"
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowWinnerModal(false)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl lg:text-3xl font-bold transition-colors"
                >
                  ×
                </button>

                <div className="text-5xl lg:text-6xl mb-4">🎊 🎉</div>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">CONGRATULATIONS!</h2>
                <p className="text-xl lg:text-2xl text-yellow-200 font-bold mb-4">You Won the SuperBall!</p>
                
                <div className="bg-white/10 rounded-xl p-4 lg:p-6 mb-4">
                  <div className="text-yellow-300 text-sm mb-2">Your Total Prize</div>
                  <div className="text-4xl lg:text-5xl font-extrabold text-white mb-2">
                    ${totalPrize.toFixed(2)}
                  </div>
                  <div className="text-yellow-200 text-lg lg:text-xl">USDT</div>
                </div>

                <div className="text-left bg-white/5 rounded-lg p-4 mb-4">
                  <p className="text-white font-semibold mb-2">💰 Payment Processing</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✅</span>
                      <span className="text-white/80">Winner Verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400">⏳</span>
                      <span className="text-white/80">USDT Deposit Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">💵</span>
                      <span className="text-white/60">Funds in Your Wallet</span>
                    </div>
                  </div>
                </div>

                <p className="text-white/90 text-sm mb-4">
                  Your USDT prize will be deposited to your wallet within 48 hours. You'll receive an email when complete.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
                  <button className="px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:scale-105 transition-all text-sm lg:text-base">
                    View My Wallet
                  </button>
                  <button className="px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:scale-105 transition-all text-sm lg:text-base">
                    Share News
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* No Match Message */}
      {winningNumber && !hasMatch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 backdrop-blur-md rounded-xl p-6 mb-6 text-center"
        >
          <p className="text-white/90 text-lg mb-2">
            The SuperBall draw is complete. Winner number was <span className="font-bold text-yellow-300">{winningNumber}</span>.
          </p>
          <p className="text-white/70 text-sm mb-4">
            Your tickets didn't match this time, but keep playing to unlock the next SuperBall!
          </p>
          <p className="text-purple-300 text-sm">
            Play 10 more regular draws to unlock the next SuperBall jackpot.
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard/buy-ticket'}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:scale-105 transition-all"
          >
            Play Regular Lottery
          </button>
        </motion.div>
      )}

      {/* Pending Status */}
      {!winningNumber && (
        <div className="bg-blue-500/20 border border-blue-400/50 rounded-xl p-4 mb-6 text-center">
          <p className="text-blue-200 font-semibold">
            ⏳ Your entries are confirmed for the SuperBall draw.
          </p>
          <p className="text-blue-300/80 text-sm mt-2">
            Results will be announced after the draw. Good luck! 🍀
          </p>
        </div>
      )}

      {/* Ticket List Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Your SuperBall Orders</h3>
        <p className="text-xs sm:text-sm md:text-base text-white/70 px-4">
          {winningNumber ? 'Check if your numbers match!' : 'Waiting for draw results...'}
        </p>
      </div>
      
      {/* Tickets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {tickets.map((ticket, idx) => (
          <div key={idx} className={`relative bg-zinc-200 rounded-2xl shadow-xl p-6 lg:p-8 flex flex-col justify-between transition-all ${isMatch(ticket) ? 'ring-4 ring-yellow-400 shadow-yellow-400/50' : 'hover:shadow-2xl'}`}>
            {/* Left Side Purple Border */}
            <div className="absolute left-0 top-0 bottom-0 w-4 lg:w-5 bg-purple-600 flex items-center justify-center rounded-l-2xl">
              <span className="text-white text-xs lg:text-sm font-bold font-secondary transform -rotate-90 tracking-widest whitespace-nowrap">
                SUPERBALL
              </span>
            </div>
            {/* Ticket Header */}
            <div className="flex items-center justify-between mb-6 border-b border-dashed border-gray-400 ml-6 lg:ml-8 pb-4">
              <div className="flex items-center gap-2 text-gray-700 text-sm lg:text-base font-semibold">
                $10
                <span className="text-gray-500 text-xs lg:text-sm">CREDITS</span>
              </div>
              <div className="font-bold text-base lg:text-lg text-purple-700">Order #{idx + 1}</div>
            </div>
            {/* Numbers Display */}
            <div className="flex items-center justify-center gap-3 lg:gap-4 mb-6 ml-4 lg:ml-6">
              {ticket.numbers && ticket.numbers.map((num, nidx) => (
                <div key={nidx} className="flex items-center justify-center">
                  <div className={`w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-full shadow-lg font-black text-base lg:text-lg ${Number(num) === Number(winningNumber) ? 'bg-yellow-300 text-white ring-2 ring-yellow-400' : 'bg-white text-gray-700'}`}>
                    {num}
                  </div>
                </div>
              ))}
            </div>
            {/* Draw Date */}
            <div className="text-sm lg:text-base text-purple-600 font-semibold ml-6 lg:ml-8">
              Draw: {new Date(ticket.drawDate).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuperBallResults;