import { useEffect, useState } from 'react';
import { getPrizePool } from '../../services/winnerService';

const PrizePoolBanner = ({ drawDate }) => {
    const [prizePool, setPrizePool] = useState(null);
    const [maxSingleWinner, setMaxSingleWinner] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Use today's date at draw time (19:00 UTC) to get current accumulated prize pool if no drawDate provided
        const today = new Date();
        const year = today.getUTCFullYear();
        const month = today.getUTCMonth();
        const day = today.getUTCDate();
        const todayDrawDate = new Date(Date.UTC(year, month, day, 19, 0, 0, 0));
        const dateToUse = drawDate || todayDrawDate.toISOString();
        setLoading(true);
        getPrizePool(dateToUse)
            .then(res => {
                let pool = null;
                let maxWinner = null;
                if (res) {
                    if (typeof res.maxSingleWinner === 'number' && res.maxSingleWinner > 0) {
                        maxWinner = Number(res.maxSingleWinner);
                    }
                    if (res.prizePool && typeof res.prizePool === 'object') {
                        if (typeof res.prizePool.undivided === 'number' && res.prizePool.undivided > 0) {
                            pool = Number(res.prizePool.undivided);
                        } else if (typeof res.prizePool.divided === 'number' && res.prizePool.divided > 0) {
                            pool = Number(res.prizePool.divided);
                        }
                    }
                }
                if (pool === null) {
                    console.warn('No valid prize pool found in response:', res);
                }
                setPrizePool(pool);
                setMaxSingleWinner(maxWinner);
            })
            .catch(() => {
                setPrizePool(null);
                setMaxSingleWinner(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [drawDate]);

    // Ensure values are numbers
    // Use maxSingleWinner as the main display value if present and valid
    const displayPrizePool = (typeof prizePool === 'number' && prizePool > 0)
        ? prizePool
        : null;
    const displayMaxSingleWinner = (typeof maxSingleWinner === 'number' && maxSingleWinner > 0)
        ? maxSingleWinner
        : null;

    if (loading) {
        return (
            <div className="mb-4 w-full bg-yellow-100 text-yellow-800 font-bold text-center py-3 rounded-xl shadow flex items-center justify-center gap-2">
                🏆 Prize Pool: <span className="text-2xl">Loading...</span>
            </div>
        );
    }

    if (displayPrizePool === null) {
        return (
            <div className="mb-4 w-full bg-yellow-100 text-yellow-800 font-bold text-center py-3 rounded-xl shadow flex items-center justify-center gap-2">
                🏆 Prize Pool: <span className="text-2xl">Loading...</span>
            </div>
        );
    }

    return (
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 rounded-2xl shadow-2xl border-2 border-yellow-400/30 p-4 sm:p-6 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                    <span className="text-2xl sm:text-3xl">🏆</span>
                </div>
                <div className="text-left">
                    <div className="text-xs sm:text-sm font-semibold text-white/90 uppercase tracking-wider mb-1">Prize Pool</div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white drop-shadow-lg">
                        ${displayPrizePool.toFixed(2)} <span className="text-sm sm:text-base font-medium">USDT</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrizePoolBanner;