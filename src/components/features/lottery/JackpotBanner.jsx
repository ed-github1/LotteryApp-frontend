import { useEffect, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { useDraw } from '../../../context/DrawContext'
import { getPrizePool, getMexicoCityDrawDateString } from '../../../services/winnerService';
import NextDrawBanner from '../../common/NextDrawBanner'

const SPRING_OPTIONS = {
    type: "spring",
    mass: 2,
    stiffness: 300,
    damping: 40,
};

const JackpotBanner = ({drawDate}) => {
    const ONE_SECOND = 1000;
    const AUTO_DELAY = ONE_SECOND * 8;
    const DRAG_BUFFER = 50;
    const { nextDraws, getCurrentFridayUTC } = useDraw();
    const fridayDrawDate = getCurrentFridayUTC();
    const [slideIndex, setSlideIndex] = useState(0);
    const [prizePool, setPrizePool] = useState(null);
    const [prizePoolRes, setPrizePoolRes] = useState(null);
    const dragX = useMotionValue(0);


useEffect(() => {
    const fetchPrizePool = async () => {
        // Use today's date at draw time (19:00 UTC) to get current accumulated prize pool
        const today = new Date();
    const dateToUse = drawDate || getMexicoCityDrawDateString();
        if (dateToUse) {
            try {
                const res = await getPrizePool(dateToUse);
                setPrizePoolRes(res);
                // Extract the correct prize pool value and ensure it's a number > 0
                let pool = null;
                if (res && typeof res.maxSingleWinner === 'number' && res.maxSingleWinner > 0) {
                    pool = Number(res.maxSingleWinner);
                } else if (res && res.prizePool && typeof res.prizePool === 'object') {
                    if (typeof res.prizePool.undivided === 'number' && res.prizePool.undivided > 0) {
                        pool = Number(res.prizePool.undivided);
                    } else if (typeof res.prizePool.divided === 'number' && res.prizePool.divided > 0) {
                        pool = Number(res.prizePool.divided);
                    }
                } else if (res && typeof res.prizePool === 'number' && res.prizePool > 0) {
                    pool = Number(res.prizePool);
                }
                setPrizePool(pool);
            } catch (err) {
                setPrizePool(null);
                console.error('Error fetching prize pool:', err);
            }
        }
    };
    fetchPrizePool();
}, [drawDate, fridayDrawDate]);


    // Slides for the banner
    const slides = [
        {
            type: 'jackpot',
            content: (
                <div className="flex flex-col items-center gap-3 w-full justify-center text-center">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl animate-bounce">💰</span>
                        <span className="text-sm font-semibold text-yellow-300 tracking-wider">MEGA JACKPOT</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-white/90 font-medium">Current Prize Pool</span>
                        <span className="font-black text-2xl md:text-3xl bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
                            {prizePool !== null && typeof prizePool === 'number' && prizePool > 0
                                ? `$${prizePool.toFixed(2)}`
                                : <span className="text-yellow-200">Not Available</span>
                            }
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/80">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span>Growing every minute</span>
                    </div>
                </div>
            )
        },
        {
            type: 'nextdraw',
            content: (
                <div className="flex-1 min-w-[100px] w-full">
                    <NextDrawBanner schedules={nextDraws} /> {/* <-- pass nextDraws here */}
                </div>
            )
        },
        {
            type: 'winners',
            content: (
                <div className="flex flex-col items-center gap-3 w-full justify-center text-center">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🏆</span>
                        <span className="text-sm font-semibold text-green-300 tracking-wider">RECENT WINNERS</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-white/90 font-medium">Last Week's Big Winner</span>
                        <span className="font-black text-xl md:text-2xl bg-gradient-to-r from-green-300 via-emerald-400 to-teal-500 bg-clip-text text-transparent">
                            $2,500,000
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/80">
                        <span>🎯</span>
                        <span>Could be you next!</span>
                    </div>
                                            {/* Full API response for debugging */}
                                            <pre style={{ fontSize: '10px', color: 'orange', marginTop: '2px' }}>API response: {JSON.stringify(window._lastPrizePoolRes, null, 2)}</pre>
                </div>
            )
        },
        {
            type: 'special',
            content: (
                <div className="flex flex-col items-center gap-3 w-full justify-center text-center">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl animate-pulse">⚡</span>
                        <span className="text-sm font-semibold text-purple-300 tracking-wider">SUPER BALL BONUS</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-white/90 font-medium">Special Promotion</span>
                        <span className="font-black text-xl md:text-2xl bg-gradient-to-r from-purple-300 via-violet-400 to-indigo-500 bg-clip-text text-transparent">
                            10 Tickets = 10 FREE
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/80">
                        <span>🔥</span>
                        <span>Limited time offer</span>
                    </div>
                </div>
            )
        },
        {
            type: 'stats',
            content: (
                <div className="flex flex-col items-center gap-3 w-full justify-center text-center">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">📊</span>
                        <span className="text-sm font-semibold text-blue-300 tracking-wider">LIVE STATS</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                        <div className="flex flex-col items-center">
                            <span className="font-black text-lg text-white">1.2M</span>
                            <span className="text-xs text-white/80">Active Players</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="font-black text-lg text-white">$850M</span>
                            <span className="text-xs text-white/80">Paid Out</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/80">
                        <span>🌟</span>
                        <span>Join the winning community</span>
                    </div>
                </div>
            )
        }
    ];

    useEffect(() => {
        const intervalRef = setInterval(() => {
            const x = dragX.get();
            if (x === 0) {
                setSlideIndex((pv) => (pv === slides.length - 1 ? 0 : pv + 1));
            }
        }, AUTO_DELAY);
        return () => clearInterval(intervalRef);
        // eslint-disable-next-line
    }, []);

    const onDragEnd = () => {
        const x = dragX.get();
        if (x <= -DRAG_BUFFER && slideIndex < slides.length - 1) {
            setSlideIndex((pv) => pv + 1);
        } else if (x >= DRAG_BUFFER && slideIndex > 0) {
            setSlideIndex((pv) => pv - 1);
        }
    };

    return (
        <div className="relative w-full max-w-7xl mx-auto  backdrop-blur-xl rounded-2xl px-4 py-4 sm:px-6 sm:py-6 overflow-hidden min-h-[120px] border border-white/20 shadow-2xl">
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                style={{ x: dragX }}
                animate={{ translateX: `-${slideIndex * 100}%` }}
                transition={SPRING_OPTIONS}
                onDragEnd={onDragEnd}
                className="flex items-center cursor-grab active:cursor-grabbing"
            >
                {slides.map((slide, idx) => (
                    <div key={idx} className="w-full shrink-0 flex items-center justify-center py-2">
                        {slide.content}
                    </div>
                ))}
            </motion.div>
            <div className="flex justify-center space-x-3 mt-4">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSlideIndex(idx)}
                        className={`h-3 w-3 rounded-full transition-all duration-300 hover:scale-110 ${idx === slideIndex
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-400/50'
                            : 'bg-white/40 hover:bg-white/60'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default JackpotBanner;