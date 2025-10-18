import { useState } from 'react';
import { useOrders } from '../../../context/OrdersContext';
import { useAuth } from '../../../context/AuthContext'; // Add this import
import DrawsHistoryTable from './DrawsHistoryTable';
import { AnimatePresence, motion } from 'framer-motion';
import TicketsReceipt from '../../common/TicketsReceipt';

const PurchaseHistory = () => {
  const { myPaidOrders, loading } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Always use an array, never undefined
  const userOrders = myPaidOrders || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#232946] via-[#1a1d2e] to-[#232946] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#FFD700] border-t-transparent mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading your history...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/20"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                🕰️ Purchase
                <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-[#fde68a] to-[#f59e0b]">
                  History
                </span>
              </h2>
              <p className="text-white/60 mt-2">
                A record of all your lottery ticket purchases.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Transaction History Section */}
        {userOrders.length > 0 ? (
          <DrawsHistoryTable orders={userOrders} onSelectOrder={setSelectedOrder} />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-xl rounded-3xl border bg-white/10 p-18 text-center"
          >
            <div className="text-6xl mb-6">🛒</div>
            <div className="text-white text-2xl font-semibold mb-2">No Purchases Found</div>
            <div className="text-white/60">You haven't made any lottery ticket purchases yet.</div>
          </motion.div>
        )}

        {/* Improved Modal for viewing receipt */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
              onClick={() => setSelectedOrder(null)} // Close on backdrop click
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-h-[90vh] w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()} // Prevent close on content click
              >
                <button
                  className="absolute top-4 right-4 z-10 text-white text-2xl font-bold hover:text-[#FFD700] bg-black/60 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                  onClick={() => setSelectedOrder(null)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <div className="overflow-y-auto p-6 max-h-[85vh]">
                  <TicketsReceipt
                    tickets={selectedOrder.tickets || []}
                    date={selectedOrder.purchasedDate ? new Date(selectedOrder.purchasedDate).toLocaleDateString() : 'N/A'}
                    receiptNumber={`#${(selectedOrder._id || selectedOrder.id || '').toString().slice(-8).toUpperCase()}`}
                    customerId={selectedOrder.user?.email || 'N/A'} // Use email or fallback
                    total={selectedOrder.total || 0}
                    paymentStatus={selectedOrder.paymentStatus || 'N/A'}
                    tkid={selectedOrder.tkid || 'N/A'}
                    paymentMethod={selectedOrder.paymentMethod || 'N/A'}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PurchaseHistory;
