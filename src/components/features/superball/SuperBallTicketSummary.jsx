import { motion, AnimatePresence } from 'framer-motion';
import ActionButton from '../../common/ActionButtons';
import { IoClose } from 'react-icons/io5';
import { useTicket } from '../../../context/TicketContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { sendSuperBallOrder } from '../../../services/superballService';

const SuperBallTicketSummary = ({ handleReview }) => {
  const { superBallTickets, removeSuperBallTicket, clearSuperBallTickets } = useTicket();
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!token) {
      alert('You must be logged in to submit tickets.');
      return;
    }
    if (superBallTickets.length === 0) {
      alert('No tickets to submit.');
      return;
    }
    try {
      await sendSuperBallOrder(superBallTickets, token);
      clearSuperBallTickets();
      alert('SuperBall tickets submitted!');
      navigate('/dashboard/superball');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to submit SuperBall tickets.');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 bg-white/20 p-4 rounded-2xl"
      >
        {superBallTickets.length === 0 ? (
          <p className="text-center text-gray-500">No tickets found. Please add some tickets first.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <AnimatePresence>
              {superBallTickets.map((ticket, idx) => (
                <SuperBallTicketCard
                  key={ticket.id || idx}
                  ticket={ticket}
                  idx={idx}
                  handleDeleteTicket={removeSuperBallTicket}
                  showDelete={true}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
      <div className="space-y-4 mt-8 mb-8">
        <ActionButton
          onClick={() => navigate('/dashboard/superball')}
          className="w-full py-4 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-xl hover:from-gray-400 hover:to-gray-500 rounded-2xl"
        >
          Back to Selection
        </ActionButton>
        <ActionButton
          onClick={handleSubmit}
          className="w-full py-4 h-16 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg shadow-xl hover:from-green-600 hover:to-emerald-600 rounded-2xl"
        >
          Confirm & Submit Tickets
        </ActionButton>
      </div>
    </>
  );
};

const SuperBallTicketCard = ({ ticket, idx, handleDeleteTicket, showDelete = false }) => {
  return (
    <motion.div
      key={ticket.id || idx}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{ duration: 0.3 }}
      className="relative bg-zinc-200 rounded-2xl shadow-xl p-6 lg:p-8 flex flex-col justify-between transition-all hover:shadow-2xl"
    >
      {/* Left Side Purple Border */}
      <div className="absolute left-0 top-0 bottom-0 w-4 lg:w-5 bg-purple-600 flex items-center justify-center rounded-l-2xl">
        <span className="text-white text-xs lg:text-sm font-bold font-secondary transform -rotate-90 tracking-widest whitespace-nowrap">
          SUPERBALL
        </span>
      </div>
      {/* Close Button */}
      {showDelete && (
        <button
          onClick={() => handleDeleteTicket(idx)}
          className="absolute right-0 top-0 z-20 w-7 h-7 lg:w-8 lg:h-8 bg-gray-200 hover:bg-red-500 text-gray-600 hover:text-white rounded-tr-2xl rounded-bl-xl flex items-center justify-center shadow transition-all duration-200 hover:scale-110"
        >
          <IoClose className="text-base lg:text-lg" />
        </button>
      )}
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
            <div className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-full shadow-lg font-black text-base lg:text-lg bg-white text-gray-700">
              {num}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SuperBallTicketSummary;