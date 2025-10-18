import { motion } from 'framer-motion';
import { CircleFlag } from 'react-circle-flags';

const WinningNumber = ({ number, delay, isSpecial = false }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 260, damping: 20, delay }}
    className={`relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full font-bold text-xl shadow-lg
      ${isSpecial
        ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-800 border-2 border-yellow-300'
        : 'bg-gradient-to-br from-slate-100 to-slate-300 text-[#232946] border-2 border-white/50'
      }`}
  >
    {/* Bulb Animation */}
    <div className={`absolute inset-0 rounded-full animate-pulse-light ${isSpecial ? 'bg-yellow-400' : 'bg-white'}`} style={{ animationDelay: `${delay}s` }}></div>
    <span className="relative z-10">{number}</span>
  </motion.div>
);

const DrawResultCard = ({ draw }) => (
  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl">
    <div className="flex items-center gap-3 mb-4">
      <CircleFlag countryCode={draw.countryCode.toLowerCase()} className="w-8 h-8 shadow-md" />
      <h3 className="text-xl font-bold text-white">{draw.name}</h3>
    </div>
    <div className="flex flex-wrap gap-3">
      {draw.numbers.map((num, i) => (
        <WinningNumber
          key={i}
          number={num}
          delay={0.2 + i * 0.15}
          isSpecial={i >= draw.numbers.length - 2} // Example: last 2 numbers are special
        />
      ))}
    </div>
  </div>
);

const RecentDrawResults = ({ draws }) => (
  <div>
    <h2 className="text-2xl font-bold text-white mb-4 px-2">Recent Draw Results</h2>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {draws.map(draw => (
        <DrawResultCard key={draw.id} draw={draw} />
      ))}
    </div>
  </div>
);

export default RecentDrawResults;