const TableHeader = () => (
  <thead className="bg-black/30">
    <tr>
      <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Transaction ID</th>
      <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Total</th>
      <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Date</th>
      <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Tickets</th>
      <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Details</th>
    </tr>
  </thead>
);

const TableRow = ({ order, onSelectOrder }) => (
  <tr className="hover:bg-white/10 transition-colors duration-200">
    <td className="px-4 py-3 text-sm font-mono text-gray-300">{order.id?.substring(0, 8)}...</td>
    <td className="px-4 py-3 text-sm text-[#FFD700] font-bold">${order.total.toFixed(2)}</td>
    <td className="px-4 py-3 text-sm text-gray-300">{new Date(order.date).toLocaleDateString()}</td>
    <td className="px-4 py-3 text-sm text-gray-300">{order.tickets?.length || 0}</td>
    <td className="px-4 py-3">
      {order.paymentStatus === 'paid' ? (
        <button
          onClick={() => onSelectOrder(order)}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
        >
          View Receipt
        </button>
      ) : (
        <span className="px-4 py-2 rounded-lg bg-gray-300/30 text-gray-400 font-semibold">
          {order.paymentStatus === 'pending' ? 'Pending' : order.paymentStatus === 'rejected' ? 'Rejected' : order.paymentStatus}
        </span>
      )}
    </td>
  </tr>
);

const DrawsHistoryTable = ({ orders, onSelectOrder }) => (
  <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <TableHeader />
        <tbody className="divide-y divide-white/10">
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <TableRow key={order._id || index} order={order} onSelectOrder={onSelectOrder} />
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-16 text-center">
                <div className="text-gray-400">
                  <div className="text-6xl mb-4">🎫</div>
                  <div className="text-xl font-medium">No transactions yet</div>
                  <p>Your lottery ticket purchases will appear here.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default DrawsHistoryTable;