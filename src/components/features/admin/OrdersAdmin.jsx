import { motion } from 'framer-motion';
import { MdSchedule, MdCheckCircle, MdCancel, MdAttachMoney } from 'react-icons/md';
import FilterTabs from '../admin/FilterTabs';
import DailyChart from '../admin/DailyChart';
import ActionBar from '../admin/ActionBar';
import OrdersTable from '../admin/OrdersTable';
import PaginationControls from '../../common/Pagination';
import NoOrdersMessage from '../admin/NoOrdersMessage';
import { useOrderManagement } from '../../hooks/useOrderManagement';
import { useOrders } from '../../../context/OrdersContext';

const OrdersAdmin = () => {
  const {
    selected, batchLoading, search, setSearch, type, setType, currentPage, startDate, setStartDate, endDate, setEndDate, showChart, setShowChart, authError, loading, totalPages, totalOrders, totalRevenue, dailyTotals, totalsLoading, totalsError, stats,
    handleBatchAction, handleSingleAction, handleDayClick, handleSelectAll, handleSelect, handlePageChange, handleExport,
    activeTab, setActiveTab,
    orders, paidOrders =[], monthlyRevenue = 0  } = useOrderManagement();

  const { pendingTotalCount, paidTotalCount, rejectedTotalCount } = useOrders();
 
  // Move these declarations above their first use to avoid ReferenceError
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();



  // Determine which orders to show based on filter type
  let filteredOrders = orders;
  let displayMonth = null;
  let displayYear = null;

  // Since the backend already filters orders by date range, we don't need to filter again here
  // Just use the orders as they come from the backend
  filteredOrders = orders;
  
  // Set display month based on type
  if (type === 'this-month') {
    displayMonth = now.toLocaleString('default', { month: 'long' });
    displayYear = currentYear;
  } else if (type === 'last-month') {
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    displayMonth = new Date(currentYear, lastMonth).toLocaleString('default', { month: 'long' });
    displayYear = lastMonthYear;
  } else {
    // For other filter types, show current month
    displayMonth = now.toLocaleString('default', { month: 'long' });
    displayYear = currentYear;
  }


  // Filter by search term (tkid)
  if (search.trim()) {
    filteredOrders = filteredOrders.filter(order => 
      order.tkid?.toLowerCase().includes(search.toLowerCase())
    );
  }

  const tabStats = {
    pending: pendingTotalCount,
    approved: paidTotalCount,
    rejected: rejectedTotalCount,
    'total-sold': monthlyRevenue.toFixed(2)
  };

  const tabs = [
    {
      key: 'pending',
      label: 'Pending',
      color: 'text-amber-400',
      bgColor: 'from-amber-500/20 to-orange-500/20',
      borderColor: 'border-amber-500/50',
      icon: <MdSchedule className="size-4" />
    },
    {
      key: 'approved',
      label: 'Approved',
      color: 'text-emerald-400',
      bgColor: 'from-emerald-500/20 to-teal-500/20',
      borderColor: 'border-emerald-500/50',
      icon: <MdCheckCircle className="size-4" />
    },
    {
      key: 'rejected',
      label: 'Rejected',
      color: 'text-red-400',
      bgColor: 'from-red-500/20 to-rose-500/20',
      borderColor: 'border-red-500/50',
      icon: <MdCancel className="size-4" />
    },
    {
      key: 'total-sold',
      label: 'Revenue',
      color: 'text-blue-400',
      bgColor: 'from-blue-500/20 to-indigo-500/20',
      borderColor: 'border-blue-500/50',
      icon: <MdAttachMoney className="size-4" />
    },
  ];

  return (
    <div className="min-h-screen w-full max-w-7xl pb-20 p-2">
      <motion.div
        key="orders"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Month/Year Header - Only show if a specific month is selected */}
        {(displayMonth && displayYear) && (
          <div className="text-center text-2xl font-bold text-white mb-4">
            {displayMonth} {displayYear}
          </div>
        )}
        {authError && (
          <div className="p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-2xl text-red-300 text-center mb-6 backdrop-blur-sm max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <MdCancel className="w-5 h-5" />
              <span>Unable to load orders: Authentication failed. Please log in as an admin.</span>
            </div>
          </div>
        )}
        
        <FilterTabs
          type={type}
          setType={setType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />

        {/* Responsive Tab Navigation */}
        <div className="flex justify-center w-full mb-6 bg-white/10 rounded-2xl">
          <div className="flex border-b border-slate-700/50 max-w-5xl overflow-x-auto flex-nowrap scrollbar-hide">
            {tabs.map((tab) => {
              const statValue = tabStats[tab.key];
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex flex-col items-center px-3 py-2 min-w-[90px] sm:min-w-[120px] flex-shrink-0 border-b-2 transition-colors duration-200 whitespace-nowrap ${
                    isActive
                      ? `border-yellow-400 text-yellow-400 `
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1">
                    <div className={`${isActive ? tab.color : 'text-slate-400'}`}>
                      {tab.icon}
                    </div>
                    <span className={`ml-1 text-xs sm:text-sm font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {statValue}
                    </span>
                  </div>
                  <div className={`text-xs font-medium uppercase tracking-wider ${isActive ? tab.color : 'text-slate-500'}`}>
                    {tab.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ActionBar - Show for all tabs, but different actions for revenue tab */}
        <ActionBar
          search={search}
          setSearch={setSearch}
          selected={selected}
          batchLoading={batchLoading}
          handleBatchAction={handleBatchAction}
          handleExport={handleExport}
          activeTab={activeTab}
          totalOrders={filteredOrders.length}
          showChart={showChart}
          setShowChart={setShowChart}
          type={type}
        />

        {/* Content Based on Active Tab - Full Width */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {activeTab === 'total-sold' ? (
            <div className="space-y-6">
              {/* Revenue Tab Content */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Revenue Overview</h3>
                  <p className="text-slate-400">Monthly revenue: <span className="text-green-400 font-bold">${monthlyRevenue.toFixed(2)}</span></p>
                </div>
                
                {/* Daily Chart for Revenue - Always show when on revenue tab and monthly view */}
                {(type === 'this-month' || type === 'last-month' || type === 'month') ? (
                  <>
             
                    <DailyChart
                      dailyTotals={dailyTotals}
                      loading={totalsLoading}
                      error={totalsError}
                      onDayClick={handleDayClick}
                      type={type}
                      showClose={false}
                    />
                  </>
                ) : (
                  /* Show message if no chart data available */
                  <div className="text-center py-8 text-slate-400">
                    <MdAttachMoney className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Daily charts are only available for monthly views</p>
                    <p className="text-sm mt-2">Switch to "This Month" or "Last Month" to see daily revenue breakdown</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Chart for Order Tabs - Only show when showChart is true */}
              {showChart && (type === 'this-month' || type === 'last-month' || type === 'month') && (
                <div className="mb-6">
                  <DailyChart
                    dailyTotals={dailyTotals}
                    loading={totalsLoading}
                    error={totalsError}
                    onDayClick={handleDayClick}
                    type={type}
                    onClose={() => setShowChart(false)}
                  />
                </div>
              )}

              {/* Orders Table or No Data Message - Full Width */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-amber-500"></div>
                    <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-amber-400 animate-ping"></div>
                  </div>
                </div>
              ) : filteredOrders.length === 0 && !authError ? (
                <NoOrdersMessage activeTab={activeTab} search={search} />
              ) : (
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden w-full">
                  {console.log('[OrdersAdmin] Rendering OrdersTable for tab:', activeTab, 'Orders:', filteredOrders)}
                  <OrdersTable
                    filteredOrders={filteredOrders}
                    selected={selected}
                    handleSelectAll={handleSelectAll}
                    handleSelect={handleSelect}
                    batchLoading={batchLoading}
                    handleSingleAction={handleSingleAction}
                    activeTab={activeTab}
                  />
                </div>
              )}

              {/* Pagination */}
              {filteredOrders.length > 0 && (
                <div className="mt-6">
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    loading={loading}
                    handlePageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrdersAdmin;