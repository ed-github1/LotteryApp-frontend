import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useOrders } from '../../../context/OrdersContext';
import { useNavigate } from 'react-router-dom';

export function SuperballEntry() {
  const [jackpot, setJackpot] = useState(null);
  const [userCredits, setUserCredits] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUnlockCelebration, setShowUnlockCelebration] = useState(false);
  const { user, token, refreshUser } = useAuth();
  const { myPaidOrders } = useOrders();
  const navigate = useNavigate();

  // Calculate completed draws
  const completedDraws = myPaidOrders.length;
  const isUnlocked = completedDraws >= 10;
  const drawsNeeded = Math.max(0, 10 - completedDraws);

  // Show celebration when unlocked
  useEffect(() => {
    if (isUnlocked && !showUnlockCelebration) {
      setShowUnlockCelebration(true);
      setTimeout(() => setShowUnlockCelebration(false), 5000);
    }
  }, [isUnlocked]);

  useEffect(() => {
    loadData();
  }, [isUnlocked]);

  async function loadData() {
    // Only load jackpot data if unlocked
    if (!isUnlocked) {
      setLoading(false);
      return;
    }

    try {
      // Get jackpot
      const jackpotRes = await fetch('/api/superball/jackpot');
      const jackpotData = await jackpotRes.json();
      setJackpot(jackpotData);

      // Get user credits
      if (refreshUser) {
        await refreshUser();
      }
      setUserCredits(user?.credits || 0);

      // Get existing orders
      const ordersRes = await fetch('/api/superball/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setTickets(ordersData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  function generateRandomNumbers() {
    const numbers = [];
    while (numbers.length < 5) {
      const num = Math.floor(Math.random() * 50) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    return numbers.sort((a, b) => a - b);
  }

  function addTicket() {
    const numbers = generateRandomNumbers();
    setSelectedNumbers([...selectedNumbers, numbers]);
  }

  function removeTicket(index) {
    setSelectedNumbers(selectedNumbers.filter((_, i) => i !== index));
  }

  async function submitEntry() {
    if (selectedNumbers.length === 0) {
      alert('Please add at least one ticket first');
      return;
    }

    const creditsNeeded = selectedNumbers.length * 10;
    if (userCredits < creditsNeeded) {
      alert(`Not enough credits. You need ${creditsNeeded} credits but only have ${userCredits}.`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/superball/enter', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tickets: selectedNumbers.map(nums => ({ numbers: nums }))
        })
      });

      if (response.ok) {
        alert('Successfully entered Superball!');
        await loadData();
        setSelectedNumbers([]);
      } else {
        const error = await response.json();
        alert(error.message || 'Error entering Superball');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error entering Superball');
    } finally {
      setLoading(false);
    }
  }

  // Show locked state if user hasn't completed 10 draws
  if (!isUnlocked) {
    return (
      <>
        <AnimatePresence>
          {showUnlockCelebration && <UnlockCelebration />}
        </AnimatePresence>
        <LockedSuperBall completedDraws={completedDraws} drawsNeeded={drawsNeeded} />
      </>
    );
  }

  if (!jackpot?.active) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center border border-slate-700">
          <span className="text-6xl mb-4 block">🎯</span>
          <h1 className="text-3xl font-bold text-white mb-4">Superball</h1>
          <p className="text-slate-300 text-lg mb-2">No active Superball jackpot at this time.</p>
          <p className="text-slate-400">Superball activates after 10 consecutive draws without a Category 1 winner.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Unlock Celebration */}
      <AnimatePresence>
        {showUnlockCelebration && <UnlockCelebration />}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-black text-white mb-4">🎯 Superball Draw</h1>
        </motion.div>

        {/* Jackpot Display */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl shadow-2xl p-8 mb-6 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-2">Current Jackpot</h2>
          <p className="text-6xl font-black text-white">${jackpot.amount?.toLocaleString()}</p>
        </motion.div>

        {/* User Info */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 mb-6 border border-slate-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Your Credits</p>
              <p className="text-3xl font-bold text-white">{userCredits}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm">Cost per Ticket</p>
              <p className="text-3xl font-bold text-yellow-400">10 credits</p>
            </div>
          </div>
        </div>

        {/* Number Selection */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 mb-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Your Tickets</h3>
          <p className="text-slate-400 mb-4">Each ticket contains 5 randomly generated numbers from 1-50</p>
          
          <button
            onClick={addTicket}
            disabled={loading}
            className="w-full px-6 py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition mb-4"
          >
            + Add Random Ticket (10 credits)
          </button>

          {selectedNumbers.length > 0 && (
            <div className="space-y-3">
              {selectedNumbers.map((numbers, index) => (
                <div key={index} className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    {numbers.map((num, i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => removeTicket(index)}
                    className="text-red-400 hover:text-red-300 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={submitEntry}
          disabled={loading || selectedNumbers.length === 0}
          className={`w-full py-5 text-xl font-bold rounded-xl shadow-xl transition ${
            loading || selectedNumbers.length === 0
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:scale-[1.02]'
          }`}
        >
          {loading ? 'Submitting...' : `Enter Superball (${selectedNumbers.length} ticket${selectedNumbers.length !== 1 ? 's' : ''} - ${selectedNumbers.length * 10} credits)`}
        </button>

        {/* Existing Tickets */}
        {tickets.length > 0 && (
          <div className="mt-8 bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Your Submitted Tickets</h3>
            <div className="space-y-3">
              {tickets.map((order, i) => (
                <div key={i}>
                  {order.tickets?.map((ticket, j) => (
                    <div key={j} className="bg-slate-700/50 rounded-lg p-4 flex gap-2">
                      {ticket.numbers?.map((num, k) => (
                        <div
                          key={k}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

{/* Locked SuperBall State */}
const LockedSuperBall = ({ completedDraws, drawsNeeded }) => {
  const progressPercent = (completedDraws / 10) * 100;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-4xl w-full bg-gradient-to-br from-purple-900/30 via-purple-800/30 to-indigo-900/30 backdrop-blur-md rounded-2xl p-8 border-2 border-purple-400/30 overflow-hidden"
      >
        {/* Lock Icon Watermark */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
          <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="inline-block text-6xl mb-4"
            >
              🔒
            </motion.div>
            <h2 className="text-4xl font-extrabold text-white tracking-wide mb-2">
              🎱 SuperBall
              <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Special Draw
              </span>
            </h2>
            <p className="text-purple-200 text-lg">Exclusive mega prize draw for loyal players!</p>
          </div>

          {/* Progress Section */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white font-semibold text-lg">Your Progress</span>
              <span className="text-purple-300 font-bold text-lg">{completedDraws} / 10 Draws</span>
            </div>
            
            {/* Progress Bar */}
            <div className="relative w-full h-8 bg-purple-950/50 rounded-full overflow-hidden border-2 border-purple-400/30">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 relative"
              >
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-sm drop-shadow-lg">
                  {Math.round(progressPercent)}%
                </span>
              </div>
            </div>

            <motion.p
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-center mt-4 text-yellow-300 font-bold text-xl"
            >
              {drawsNeeded > 0 
                ? `Complete ${drawsNeeded} more draw${drawsNeeded > 1 ? 's' : ''} to unlock!`
                : "🎉 Unlocking SuperBall..."}
            </motion.p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            <FeatureCard 
              icon="💰"
              title="Mega Prizes"
              description="Win up to 10x bigger prizes than regular draws!"
            />
            <FeatureCard 
              icon="⚡"
              title="Exclusive Entry"
              description="Only for players who complete 10 draws"
            />
            <FeatureCard 
              icon="🎯"
              title="Better Odds"
              description="Smaller player pool = higher winning chances"
            />
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard/buy-ticket')}
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              🎫 Buy Tickets & Unlock SuperBall
            </motion.button>
            <p className="text-purple-300 text-sm mt-3">Each ticket purchase counts as 1 draw completion</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

{/* Feature Card Component */}
const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    className="bg-purple-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-400/20 text-center"
  >
    <div className="text-4xl mb-3">{icon}</div>
    <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
    <p className="text-purple-200 text-sm">{description}</p>
  </motion.div>
);

{/* Unlock Celebration Component */}
const UnlockCelebration = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
  >
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 180 }}
      transition={{ type: "spring", duration: 0.8 }}
      className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 rounded-3xl p-12 max-w-lg text-center shadow-2xl border-4 border-yellow-400 relative"
    >
      {/* Confetti Effect */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: 0, opacity: 1 }}
          animate={{ 
            y: [0, -200, -400],
            x: [0, Math.random() * 200 - 100],
            opacity: [1, 1, 0],
            rotate: [0, Math.random() * 360]
          }}
          transition={{ duration: 2, delay: i * 0.1 }}
          className="absolute text-4xl pointer-events-none"
          style={{ 
            left: `${Math.random() * 100}%`,
            top: '50%'
          }}
        >
          {['🎉', '🎊', '⭐', '✨', '🎈'][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}

      <motion.div
        animate={{ rotate: [0, 10, -10, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="text-8xl mb-6"
      >
        🎱
      </motion.div>
      
      <motion.h2
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg"
      >
        SuperBall Unlocked!
      </motion.h2>
      
      <p className="text-yellow-200 text-xl font-semibold mb-6">
        🎉 Congratulations! You've completed 10 draws! 🎉
      </p>
      
      <p className="text-white text-lg mb-8">
        You can now participate in the exclusive SuperBall draw with MEGA prizes!
      </p>

      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-yellow-300 font-bold text-2xl"
      >
        Entry now available! 🎫
      </motion.div>
    </motion.div>
  </motion.div>
);
