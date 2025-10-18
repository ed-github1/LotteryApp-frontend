import { useEffect, useState } from 'react';
import { CircleFlag } from 'react-circle-flags';

// Helper: Get the soonest (next) draw from the array, cycling to the first if all are in the past
function getNextDraw(draws) {
  if (!Array.isArray(draws) || draws.length === 0) return null;
  const now = new Date();
  // Find the soonest future draw
  let soonest = null;
  for (const draw of draws) {
    const d = new Date(draw.drawDate);
    if (d > now && (!soonest || d < new Date(soonest.drawDate))) {
      soonest = draw;
    }
  }
  // If all draws are in the past, cycle to the first draw in the list (start again)
  if (!soonest) {
    soonest = draws[0];
  }
  return soonest;
}

const getFlagOrEmoji = (countryCode) => {
  if (countryCode?.toLowerCase() === 'superball') {
    return <span className="text-4xl">🎱</span>;
  }
  return (
    <CircleFlag
      countryCode={countryCode?.toLowerCase() || 'us'}
      className="w-10 h-10"
    />
  );
};

const NextDrawBanner = ({ schedules }) => {
  const [nextDraw, setNextDraw] = useState(null);

  useEffect(() => {
    if (schedules && schedules.length > 0) {
      setNextDraw(getNextDraw(schedules));
    }
  }, [schedules]);

  if (!nextDraw) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <span className="text-3xl mb-2">⏳</span>
        <span className="text-lg text-white font-bold">Loading next draw...</span>
      </div>
    );
  }

  const { countryCode, drawDate } = nextDraw;
  const isSuperball = countryCode?.toLowerCase() === 'superball';

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl min-w-[300px]">
      <div className="flex-shrink-0">
        {getFlagOrEmoji(countryCode)}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-white/90">Next Draw</span>
        <span className="text-lg font-bold text-[#FFD700]">
          {new Date(drawDate).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })}
        </span>
        <span className="text-xs text-white/70 mt-1">
          {isSuperball ? 'Superball' : countryCode}
        </span>
      </div>
    </div>
  );
};

export default NextDrawBanner;