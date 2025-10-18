import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Simplified DailyChart with single bar for revenue
const DailyChart = ({ dailyTotals, loading, error, onDayClick, type, onClose }) => {
  // Custom tooltip for better interactivity
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-white/20 text-black">
          <p className="font-semibold">{`Day ${label}`}</p>
          <p style={{ color: payload[0].color }}>
            Revenue: ${payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-6 p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Add close button in the top-right corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          aria-label="Close chart"
        >
          ✕
        </button>

        <h3 className="text-white text-lg font-semibold mb-4">
          Daily Revenue Breakdown ({type === 'this-month' ? 'This Month' : type === 'last-month' ? 'Last Month' : 'Selected Period'})
        </h3>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700]"></div>
          <span className="ml-2 text-white/60">Loading chart...</span>
        </div>
      )}
      {error && (
        <div className="text-red-400 text-center p-4 bg-red-500/10 rounded-lg">
          <p className="font-semibold">Error loading data</p>
          <p>{error}</p>
        </div>
      )}
      {!loading && !error && dailyTotals.length === 0 && (
        <div className="text-white/60 text-center p-4">
          No data available for this period. Try selecting a different month.
        </div>
      )}
      {!loading && !error && dailyTotals.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={dailyTotals}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onClick={(data) => onDayClick && onDayClick(data)}
            className="cursor-pointer"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis
              dataKey="day"
              stroke="#ffffff80"
              tick={{ fontSize: 12 }}
              label={{ value: 'Day of Month', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#ffffff80' } }}
            />
            <YAxis
              stroke="#ffffff80"
              tick={{ fontSize: 12 }}
              label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#ffffff80' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Single bar for revenue */}
            <Bar
              dataKey="revenue"
              fill="url(#revenueGradient)"
              name="Revenue ($)"
              radius={[4, 4, 0, 0]}
              animationBegin={0}
              animationDuration={1000}
            />
            {/* Gradient for visual appeal */}
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FFD700" stopOpacity={0.2} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      )}
      {!loading && !error && dailyTotals.length > 0 && (
        <p className="text-white/60 text-sm mt-2 text-center">
          Click on a bar to drill down into that day's orders.
        </p>
      )}
    </div>
  );
};

export default DailyChart;