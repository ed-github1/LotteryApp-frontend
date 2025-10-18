import { useEffect, useState } from 'react';
import { CircleFlag } from 'react-circle-flags';
import { useOrders } from '../../context/OrdersContext';

// --- Redesigned DrawCountdown: Premium glassmorphic card, glowing flag, bold countdown ---

// Helper: Calculate time remaining for countdown
function getTimeRemaining(targetDate) {
  if (!targetDate) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const now = new Date();
  const end = new Date(targetDate);
  if (isNaN(end.getTime())) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const totalMs = end - now;
  if (totalMs <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const seconds = Math.floor((totalMs / 1000) % 60);
  const minutes = Math.floor((totalMs / 1000 / 60) % 60);
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  return { total: totalMs, days, hours, minutes, seconds };
}

const DrawCountdown = () => {
  // --- Context: Get nextDraws, loading, and fetchNextDraws from OrdersContext ---
  const { nextDraws, fetchNextDraws, loading } = useOrders();
  // --- State: Countdown time and next draw info ---
  const [time, setTime] = useState({ total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [nextDraw, setNextDraw] = useState(null);

  // --- Effect: Find the soonest upcoming draw from the draws array ---
  useEffect(() => {
    if (Array.isArray(nextDraws) && nextDraws.length > 0) {
      const now = new Date();
      const futureDraws = nextDraws.filter(draw => new Date(draw.drawDate) > now);
      if (futureDraws.length > 0) {
        const sortedDraws = futureDraws.sort((a, b) => new Date(a.drawDate) - new Date(b.drawDate));
        setNextDraw(sortedDraws[0]);
      } else {
        setNextDraw(null);
      }
    } else {
      setNextDraw(null);
    }
  }, [nextDraws]);

  // --- Effect: Start countdown timer for the next draw ---
  useEffect(() => {
    if (!nextDraw) return;
    const updateTimer = () => {
      const timeRemaining = getTimeRemaining(nextDraw.drawDate);
      setTime(timeRemaining);
      if (timeRemaining.total <= 0) fetchNextDraws();
    };
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [nextDraw, fetchNextDraws]);

  // --- Helper: Format numbers as two digits ---
  const formatNumber = (num) => String(num).padStart(2, '0');

  // --- Loading state: Show animated placeholder ---
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <div className="animate-pulse w-20 h-20 bg-white/20 rounded-full mb-4" />
        <p className="text-white/60">Loading next draw...</p>
      </div>
    );
  }

  // --- No draws state: Show fallback card ---
  if (!nextDraw || time.total <= 0) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 bg-white/5 rounded-3xl border border-white/10 shadow-xl">
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-2">
          <svg className="w-10 h-10 text-white/60" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-white/70 font-semibold text-lg">No upcoming draws</p>
          <p className="text-sm text-white/50">Check back soon!</p>
        </div>
      </div>
    );
  }

  // --- Main card: Glassmorphic, glowing flag, bold countdown, modern layout ---
  return (
    <div className="relative flex flex-col items-center gap-6 p-8 bg-white/10 rounded-3xl border border-white/10 shadow-2xl max-w-md mx-auto">
      {/* Glowing flag or Superball emoji */}
      <div className="relative mb-2">
        {nextDraw.countryCode?.trim().toLowerCase() === 'superball' ? (
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-yellow-100/30 shadow-2xl border-4 border-yellow-300 text-6xl animate-bounce">
            🎱
          </div>
        ) : (
          <CircleFlag countryCode={nextDraw.countryCode?.toLowerCase() || 'us'} className="w-20 h-20 shadow-2xl border-4 border-white/30" />
        )}
      </div>
      {/* Country name and draw date */}
      <div className="text-center mb-2">
        <h3 className="text-2xl font-bold text-white drop-shadow">
          {nextDraw.countryCode === 'Superball' ? 'Superball' : nextDraw.countryCode || 'Draw'}
        </h3>
        <p className="text-sm text-[#FFD700] font-semibold mt-1">
          {new Date(nextDraw.drawDate).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })}
        </p>
      </div>
      {/* Countdown blocks: Days, Hours, Minutes, Seconds */}
      <div className="flex gap-3 items-center justify-center">
        {/* Days */}
        <div className="flex flex-col items-center bg-white/20 rounded-xl px-4 py-2 min-w-[60px]">
          <span className="text-3xl md:text-4xl font-extrabold text-[#FFD700] tabular-nums tracking-tight">
            {formatNumber(time.days)}
          </span>
          <span className="text-xs text-white/80 font-medium uppercase tracking-wide">Days</span>
        </div>
        <span className="text-[#FFD700] text-3xl font-bold animate-pulse">:</span>
        {/* Hours */}
        <div className="flex flex-col items-center bg-white/20 rounded-xl px-4 py-2 min-w-[60px]">
          <span className="text-3xl md:text-4xl font-extrabold text-[#FFD700] tabular-nums tracking-tight">
            {formatNumber(time.hours)}
          </span>
          <span className="text-xs text-white/80 font-medium uppercase tracking-wide">Hours</span>
        </div>
        <span className="text-[#FFD700] text-3xl font-bold animate-pulse">:</span>
        {/* Minutes */}
        <div className="flex flex-col items-center bg-white/20 rounded-xl px-4 py-2 min-w-[60px]">
          <span className="text-3xl md:text-4xl font-extrabold text-[#FFD700] tabular-nums tracking-tight">
            {formatNumber(time.minutes)}
          </span>
          <span className="text-xs text-white/80 font-medium uppercase tracking-wide">Min</span>
        </div>
        <span className="text-[#FFD700] text-3xl font-bold animate-pulse">:</span>
        {/* Seconds */}
        <div className="flex flex-col items-center bg-white/20 rounded-xl px-4 py-2 min-w-[60px]">
          <span className="text-3xl md:text-4xl font-extrabold text-[#FFD700] tabular-nums tracking-tight">
            {formatNumber(time.seconds)}
          </span>
          <span className="text-xs text-white/80 font-medium uppercase tracking-wide">Sec</span>
        </div>
      </div>
    </div>
  );
};

export default DrawCountdown;
