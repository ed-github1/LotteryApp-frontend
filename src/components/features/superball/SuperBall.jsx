import { motion, AnimatePresence } from 'framer-motion';
import { BsStarFill, BsTrophyFill, BsGem } from 'react-icons/bs';
import { HiFire } from 'react-icons/hi';
import { FaCoins } from 'react-icons/fa';
import { useSuperBall } from '../../hooks/useSuperBall';
import SuperBallNumberSelection from './SuperBallNumberSelection';
import SuperBallTicketSummary from './SuperBallTicketSummary';
import { useAuth } from '../../../context/AuthContext';
import { useOrders } from '../../../context/OrdersContext';
import { useState, useEffect } from 'react';
import { checkSuperballStatus } from '../../../services/superballService';
import { toast } from 'react-toastify';

import ActionButton from '../../common/ActionButtons';
import { DotExpandButton } from '../../common/ActionButtons';
import { useNavigate } from 'react-router-dom';
import { useTicket } from '../../../context/TicketContext';

const DisplayCredits = () => {
  const { user } = useAuth()
  const credits = user?.credits || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-2xl shadow-lg"
    >
      {/* Inner container */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10">
        {/* Main content */}
        <div className="relative z-10">
          {/* Header with modern card design */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
              className='text-2xl'
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              >
                ⭐
              </motion.div>
              <div>
                <motion.h3
                  className="text-lg md:text-xl font-bold text-white"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Super Ball Credits
                </motion.h3>
                <motion.p
                  className="text-xs md:text-sm text-gray-300"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  Ready to play
                </motion.p>
              </div>
            </div>

            {/* Credits display - casino style */}
            <motion.div
              className="bg-white/5 rounded-xl p-3  min-w-[100px]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4, type: "spring" }}
            >
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-slate-900 font-bold text-xs"
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 360 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  $
                </motion.div>
                <motion.span
                  className="text-xl md:text-2xl font-bold text-yellow-400 font-mono"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.3, type: "spring" }}
                >
                  {credits.toLocaleString()}
                </motion.span>
              </div>
              <div className="text-xs text-center text-gray-400 mt-1">Credits</div>
            </motion.div>
          </div>

          {/* Info cards - minimalist design */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <motion.div
              className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-lg p-3 border border-blue-400/20"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center"
                  initial={{ rotate: -45 }}
                  animate={{ rotate: 0 }}
                  transition={{ delay: 1, duration: 0.3 }}
                >
                  <FaCoins className="text-blue-400 text-sm" />
                </motion.div>
                <div>
                  <div className="text-white font-semibold text-sm">Earn Credits</div>
                  <div className="text-gray-400 text-xs">10 tickets = 1 credit</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 rounded-lg p-3 border border-emerald-400/20"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.3 }}
                >
                  <BsGem className="text-emerald-400 text-sm" />
                </motion.div>
                <div>
                  <div className="text-white font-semibold text-sm">Permanent</div>
                  <div className="text-gray-400 text-xs">Never expire</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-orange-500/10 to-orange-600/20 rounded-lg p-3 border border-orange-400/20"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center"
                  initial={{ rotate: 45 }}
                  animate={{ rotate: 0 }}
                  transition={{ delay: 1.4, duration: 0.3 }}
                >
                  <HiFire className="text-orange-400 text-sm" />
                </motion.div>
                <div>
                  <div className="text-white font-semibold text-sm">Weekly Draws</div>
                  <div className="text-gray-400 text-xs">Exclusive prizes</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}



const SuperBall = () => {
  const { user, token, refreshUser } = useAuth();
  const { myPaidOrders } = useOrders();
  const credits = user?.credits || 0;
  const [reviewMode, setReviewMode] = useState(false);
  const [showUnlockCelebration, setShowUnlockCelebration] = useState(false);
  const navigate = useNavigate();
  const { superBallTickets: contextSuperBallTickets, addSuperBallTicket, removeSuperBallTicket } = useTicket(); // Use context

  // Jackpot state
  const [jackpotData, setJackpotData] = useState(null);
  const [jackpotLoading, setJackpotLoading] = useState(true);

  // Calculate completed draws (each paid order = 1 draw participation)
  const completedDraws = myPaidOrders.length;
  const isUnlocked = completedDraws >= 10;
  const drawsNeeded = Math.max(0, 10 - completedDraws);

  // Fetch jackpot status
  useEffect(() => {
    const fetchJackpot = async () => {
      try {
        const data = await checkSuperballStatus();
        setJackpotData(data);
      } catch (error) {
        console.error('Error fetching jackpot:', error);
        toast.error('Failed to load SuperBall status');
      } finally {
        setJackpotLoading(false);
      }
    };
    fetchJackpot();
  }, []);

  // Show celebration when unlocked
  useEffect(() => {
    if (isUnlocked && !showUnlockCelebration) {
      setShowUnlockCelebration(true);
      setTimeout(() => setShowUnlockCelebration(false), 5000);
    }
  }, [isUnlocked]);

  // Fetch user credits on mount
  useEffect(() => {
    if (refreshUser) {
      refreshUser();
    }
  }, []);

  const {
    isDrawing,
    selectedNumbers,
    filledSlots,
    handleGenerateTicket,
    handleSlotClick,
    clearSlot,
    showModal,
    setShowModal,
    closeModal,
    activeSlot,
    handleNumberSelect,
    handleRandomizeAllSuperBall,
    handleClearSelectionsSuperBall,
    handleReview,
  } = useSuperBall();


  // Use context for deletion
  const handleDeleteTicket = (idx) => {
    removeSuperBallTicket(idx);
  };

  const handleAddTicket = (numbers) => {
    const ticket = { numbers };
    addSuperBallTicket(ticket);
  };



  // Always show progress bar and number selection UI




  // Always render the main UI. If credits === 0, disable number selection and purchase button, but show progress/info.

  return (
    <div className="w-full relative pb-32 lg:pb-8">
      {/* Unlock Celebration */}
      <AnimatePresence>
        {showUnlockCelebration && <UnlockCelebration />}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Success Banner when Unlocked */}
        {isUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/50 rounded-xl p-4 mb-6"
          >
            <p className="text-green-200 font-bold text-lg text-center">
              🎉 Congratulations! You've unlocked the SuperBall draw with a mega USDT jackpot!
            </p>
            <p className="text-green-300/80 text-sm text-center mt-2">
              ✅ You're eligible to enter!
            </p>
          </motion.div>
        )}

        {/* Jackpot Display */}
        {isUnlocked && jackpotData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-2 border-yellow-400/50 rounded-2xl p-6 text-center mb-6"
          >
            <div className="text-yellow-300 text-sm font-semibold mb-2">Current Jackpot</div>
            <div className="text-5xl font-extrabold text-white mb-2">
              ${jackpotData.active ? jackpotData.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
            </div>
            <div className="text-yellow-200 text-lg">USDT</div>
            {jackpotData.active ? (
              <p className="text-yellow-300/80 text-xs mt-3">
                💰 All prizes paid in USDT within 48 hours of winning
              </p>
            ) : (
              <p className="text-yellow-300/80 text-xs mt-3">
                ⏳ Jackpot will be available when draw is triggered
              </p>
            )}
          </motion.div>
        )}

        {/* How It Works Section */}
        {isUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-md rounded-xl p-6 mb-6"
          >
            <h3 className="text-white font-bold text-xl mb-4 text-center">🎯 How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/90">
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <p className="font-semibold">Pick 5 numbers (1-10)</p>
                  <p className="text-sm text-white/70">Choose any 5 unique numbers</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <p className="font-semibold">Entry costs 10 credits per ticket</p>
                  <p className="text-sm text-white/70">Use your earned credits</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <p className="font-semibold">Winner number will be drawn (1-10)</p>
                  <p className="text-sm text-white/70">One winning number announced</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">4️⃣</span>
                <div>
                  <p className="font-semibold">Match ANY number = WIN!</p>
                  <p className="text-sm text-white/70">If the winning number matches any of your 5 numbers, you win!</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">5️⃣</span>
                <div>
                  <p className="font-semibold">Winners share USDT jackpot equally</p>
                  <p className="text-sm text-white/70">Prize split among all winners</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">6️⃣</span>
                <div>
                  <p className="font-semibold">USDT deposited within 48 hours</p>
                  <p className="text-sm text-white/70">Real cryptocurrency prizes</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <DisplayCredits />

        {credits === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center bg-yellow-500/20 border border-yellow-400/50 rounded-xl p-4 mb-4"
          >
            <p className="text-yellow-300 font-bold text-xl">⚠️ Not enough credits</p>
            <p className="text-yellow-200 text-sm mt-2">
              You need SuperBall credits to play. Earn credits by purchasing regular lottery tickets.
            </p>
            <p className="text-yellow-300/80 text-xs mt-2">
              💡 10 regular tickets = 1 SuperBall credit
            </p>
          </motion.div>
        )}
        {/* Main Number Selection - Now includes the modal */}
        {!reviewMode && (
          <>
            <div className={credits === 0 ? 'opacity-40 pointer-events-none' : ''}>
              <SuperBallNumberSelection
                credits={user?.credits || 0}
                handleGenerateTicket={handleGenerateTicket}
                selectedNumbers={selectedNumbers}
                filledSlots={filledSlots}
                handleSlotClick={handleSlotClick}
                clearSlot={clearSlot}
                showModal={showModal}
                setShowModal={setShowModal}
                closeModal={closeModal}
                activeSlot={activeSlot}
                handleNumberSelect={handleNumberSelect}
              />
            </div>

            {/* Action buttons with better spacing */}
            <div className={credits === 0 ? 'opacity-40 pointer-events-none' : ''}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ActionButton
                    onClick={handleRandomizeAllSuperBall}
                    className="w-full h-14 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base shadow-xl hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02] transition-all duration-200 rounded-xl border border-blue-500/20"
                    icon="🎲"
                  >
                    Quick Pick (Random)
                  </ActionButton>
                  <ActionButton
                    onClick={handleClearSelectionsSuperBall}
                    className="w-full h-14 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold text-base shadow-xl hover:from-slate-700 hover:to-slate-800 hover:scale-[1.02] transition-all duration-200 rounded-xl border border-slate-500/20"
                    icon="🗑️"
                  >
                    Clear Selections
                  </ActionButton>
                </div>
              </div>
            </div>

            {/* Generate Ticket Button */}
            <ActionButton
              onClick={handleGenerateTicket}
              disabled={isDrawing || filledSlots === 0 || credits === 0}
              icon="🛒"
              className={`w-full h-14 py-3 font-bold text-lg rounded-xl border ${!(isDrawing || filledSlots === 0 || credits === 0)
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-500/20 hover:from-green-700 hover:to-emerald-700 hover:scale-[1.02]'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400 cursor-not-allowed border-gray-500/20'
                } transition-all duration-200`}
            >
              {credits === 0 
                ? '⚠️ Insufficient Credits' 
                : isDrawing 
                  ? 'Generating...' 
                  : filledSlots === 0 
                    ? 'Please select 5 numbers' 
                    : 'Add Ticket - 10 Credits'}
            </ActionButton>
            
            {/* Validation Messages */}
            {filledSlots > 0 && filledSlots < 5 && (
              <p className="text-yellow-300 text-sm text-center">
                ⚠️ Please select exactly 5 numbers to create a ticket
              </p>
            )}

            {/* View Tickets Button */}
            <DotExpandButton
              onClick={() => navigate('/dashboard/superball-ticket-summary')}
              className="w-full h-14 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white border border-purple-500/20 font-bold rounded-xl shadow-xl items-center gap-3 px-6 hover:scale-[1.02] transition-all focus:outline-none text-lg hover:from-purple-700 hover:to-pink-700"
              icon="🎟️"
              tickets={contextSuperBallTickets.length}
            >
              View Tickets
            </DotExpandButton>
          </>
        )}
        {/* Custom SuperBall Ticket Review Step - Now using the component */}
        {reviewMode && (
          <SuperBallTicketSummary
            superBallTickets={contextSuperBallTickets} // Use context state
            handleDeleteTicket={handleDeleteTicket}
            handleReview={handleReview}
            setReviewMode={setReviewMode}
          />
        )}
      </div>
    </div>
  );
};

{/* Locked SuperBall State */}
const LockedSuperBall = ({ completedDraws, drawsNeeded }) => {
  const progressPercent = (completedDraws / 10) * 100;
  const navigate = useNavigate();

  return (
    <div className="w-full relative pb-32 lg:pb-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-5xl mx-auto bg-gradient-to-br from-purple-900/30 via-purple-800/30 to-indigo-900/30 backdrop-blur-md rounded-2xl p-8 border-2 border-purple-400/30 overflow-hidden"
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
              � SuperBall
              <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Special Draw
              </span>
            </h2>
            <p className="text-purple-200 text-lg mb-4">Exclusive mega prize draw for loyal players!</p>
            
            {/* Encouragement Message */}
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-4 max-w-2xl mx-auto"
            >
              <p className="text-yellow-200 font-semibold text-lg">
                Keep playing! Complete {drawsNeeded} more regular lottery draw{drawsNeeded > 1 ? 's' : ''} to unlock the exclusive SuperBall jackpot.
              </p>
              <p className="text-yellow-300/80 text-sm mt-2">
                💡 Every regular lottery entry counts toward your SuperBall unlock progress.
              </p>
            </motion.div>
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
            <p className="text-center mt-2 text-purple-300 text-sm">
              You're {drawsNeeded <= 3 ? 'so close to' : 'working toward'} the mega jackpot!
            </p>
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
              🎫 Play Regular Lottery →
            </motion.button>
            <p className="text-purple-300 text-sm mt-3">Each regular lottery ticket purchase counts as 1 draw completion</p>
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
        Start playing now! 🎫
      </motion.div>
    </motion.div>
  </motion.div>
);

export default SuperBall;