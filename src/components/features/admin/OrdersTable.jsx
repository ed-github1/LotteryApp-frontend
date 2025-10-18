// filepath: src/components/features/admin/OrdersTable.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { MdCheckCircle, MdCancel, MdRestore, MdHourglassEmpty } from 'react-icons/md';

const OrdersTable = ({ filteredOrders, selected, handleSelectAll, handleSelect, batchLoading, handleSingleAction }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <MdCheckCircle className="text-emerald-500" title="Paid" />;
      case 'pending': return <MdHourglassEmpty className="text-amber-400" title="Pending" />;
      case 'rejected': return <MdCancel className="text-red-500" title="Rejected" />;
      default: return <MdHourglassEmpty className="text-gray-400" title="Unknown" />;
    }
  };

  return (
    <div className="overflow-x-auto text-xs">
      <table className="w-full">
        <thead className="bg-white/5 border-b border-white/10">
          <tr>
            <th className="px-6 py-4 text-left">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selected.length === filteredOrders.length && filteredOrders.length > 0}
                className="w-5 h-5 rounded bg-white/10 border-2 border-white/20 checked:bg-[#FFD700] checked:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/50 transition-all duration-200"
              />
            </th>
            <th className="px-6 py-4 text-left font-semibold text-white/80 uppercase tracking-wider">User</th>
            <th className="px-6 py-4 text-left font-semibold text-white/80 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-left font-semibold text-white/80 uppercase tracking-wider">Total</th>
            <th className="px-6 py-4 text-left font-semibold text-white/80 uppercase tracking-wider">Payment Method</th>
            <th className="px-6 py-4 text-left font-semibold text-white/80 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left font-semibold text-white/80 uppercase tracking-wider">TKID</th>
            <th className="px-6 py-4 text-left font-semibold text-white/80 uppercase tracking-wider">Tickets</th>
            <th className="px-6 py-4 text-left font-semibold text-white/80 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <AnimatePresence>
            {filteredOrders
              .sort((a, b) => new Date(a.purchasedDate) - new Date(b.purchasedDate))
              .map((order, index) => {
                const orderId = order._id || order.id;
                const isSelected = selected.includes(orderId);

                return (
                  <motion.tr
                    key={orderId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`hover:bg-white/5 transition-all duration-200 ${isSelected ? 'bg-[#FFD700]/10 border-l-4 border-l-[#FFD700]' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelect(orderId)}
                        className="w-5 h-5 rounded bg-white/10 border-2 border-white/20 checked:bg-[#FFD700] checked:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/50 transition-all duration-200"
                      />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white/90 font-medium">
                        {order.user?.email || order.user || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white/70 text-xs">
                        {order.purchasedDate ? new Date(order.purchasedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-[#FFD700] font-bold text-lg">
                        ${order.total?.toFixed(2) ?? '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white/90 font-medium">
                        {order.paymentMethod || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(order.paymentStatus)}`}>
                        <span>{getStatusIcon(order.paymentStatus)}</span>
                        <span className="capitalize text-xs font-normal">{order.paymentStatus}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white/70 font-mono text-sm">
                        {order.tkid || <span className="text-white/40 italic">N/A</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎫</span>
                        <span className="text-white/90 font-medium">{order.tickets?.length || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {order.paymentStatus === 'pending' && (
                          <>
                            <button
                              className="px-2 py-1 bg-emerald-500 text-white rounded text-sm hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                              disabled={batchLoading}
                              onClick={async () => {
                                await handleSingleAction(orderId, 'accepted');
                              }}
                              title="Approve"
                            >
                              <MdCheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                              disabled={batchLoading}
                              onClick={async () => {
                                await handleSingleAction(orderId, 'rejected');
                              }}
                              title="Reject"
                            >
                              <MdCancel className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {order.paymentStatus === 'rejected' && (
                          <button
                            className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                            disabled={batchLoading}
                            onClick={async () => {
                              await handleSingleAction(orderId, 'restored');
                            }}
                            title="Restore"
                          >
                            <MdRestore className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;