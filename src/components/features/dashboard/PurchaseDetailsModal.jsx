import { motion } from 'framer-motion';

const TicketCard = ({ ticket, index }) => (
  <div className="bg-white/90 rounded-xl border-2 border-dashed border-gray-300 shadow-lg p-0 font-mono text-gray-800">
    <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-t-xl px-4 py-2 flex items-center justify-between border-b border-dashed border-gray-300">
      <span className="font-bold text-gray-700">Ticket #{index + 1}</span>
      <div className="px-3 py-1 text-green-700 font-bold rounded text-sm">${ticket.price} <span className="ml-1 text-xs">USDT</span></div>
    </div>
    <div className="p-4">
      <div className="text-sm font-semibold mb-2">Your Selections:</div>
      <div className="grid grid-cols-4 gap-2 text-center">
        {Object.entries(ticket.selections).map(([cc, num]) => (
          <div key={cc} className="bg-slate-200 rounded p-1">
            <span className="font-bold text-indigo-700">{cc}:</span> {num}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PurchaseDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        className="relative z-10 w-full max-w-2xl bg-gradient-to-br from-slate-700 via-gray-800 to-slate-900 rounded-2xl shadow-2xl border border-white/20 p-6"
      >
        <div className="flex justify-between items-center border-b border-white/20 pb-4 mb-4">
          <h3 className="text-xl font-bold text-white">Purchase Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl transition-colors">✕</button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
          {order.tickets?.length > 0 ? (
            order.tickets.map((ticket, idx) => <TicketCard key={idx} ticket={ticket} index={idx} />)
          ) : (
            <div className="text-center py-8 text-gray-400">No ticket details.</div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PurchaseDetailsModal;