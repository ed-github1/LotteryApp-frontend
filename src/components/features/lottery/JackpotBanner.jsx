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
    const [prizePool, setPrizePool] = useState(null);
    const [animatedPrize, setAnimatedPrize] = useState(0);
    const [slideIndex, setSlideIndex] = useState(0);
    const dragX = useMotionValue(0);


useEffect(() => {
    const fetchPrizePool = async () => {
        const today = new Date();
        const dateToUse = drawDate || getMexicoCityDrawDateString();
        if (dateToUse) {
            try {
                const res = await getPrizePool(dateToUse);
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

// Animate prize pool number
useEffect(() => {
    if (prizePool && prizePool > 0) {
        let start = 0;
        const duration = 2000;
        const increment = prizePool / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= prizePool) {
                setAnimatedPrize(prizePool);
                clearInterval(timer);
            } else {
                setAnimatedPrize(start);
            }
        }, 16);
        return () => clearInterval(timer);
    }
}, [prizePool]);

// Auto-advance slides
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

// Slides configuration
const slides = [
    {
        type: 'jackpot',
        content: (
            <div className="relative z-10 text-center w-full">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="text-3xl"
                    >
                        💎
                    </motion.span>
                    <span className="text-sm sm:text-base font-bold text-yellow-300 tracking-widest uppercase">
                        Mega Jackpot
                    </span>
                </div>
                
                <div className="mb-2">
                    <p className="text-xs sm:text-sm text-white/70 font-medium mb-1">Current Prize Pool</p>
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="font-black text-4xl sm:text-5xl md:text-6xl bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl"
                    >
                        {prizePool !== null && typeof prizePool === 'number' && prizePool > 0
                            ? `$${animatedPrize.toFixed(2)}`
                            : <span className="text-2xl sm:text-3xl text-white/50">Loading...</span>
                        }
                    </motion.div>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-emerald-400">
                    <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 bg-emerald-400 rounded-full"
                    />
                    <span className="font-semibold">Growing every minute!</span>
                </div>
            </div>
        )
    },
    {
        type: 'nextdraw',
        content: (
            <div className="relative z-10 w-full flex items-center justify-center">
                <div className="w-full max-w-2xl">
                    <NextDrawBanner schedules={nextDraws} />
                </div>
            </div>
        )
    },
    {
        type: 'promotion',
        content: (
            <div className="relative z-10 text-center w-full">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-2xl sm:text-3xl"
                    >
                        🎟️
                    </motion.span>
                    <span className="text-sm sm:text-base font-bold text-blue-300 tracking-widest uppercase">
                        Special Offer
                    </span>
                </div>

                <div className="mb-2">
                    <p className="text-xs sm:text-sm text-white/70 font-medium mb-1">Loyalty Rewards</p>
                    <div className="font-black text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl">
                        1 Ticket = 1 Credit
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-white/80">
                    <span className="text-base">⭐</span>
                    <span className="font-semibold">Use credits for free plays!</span>
                </div>
            </div>
        )
    }
];

return (
    <div className="w-full max-w-7xl mx-auto mt-6 mb-4">
        {/* Sliding Banner */}
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-orange-900/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 overflow-hidden border border-purple-500/30 shadow-2xl min-h-[180px] sm:min-h-[200px]"
        >
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-20 -right-20 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl"
                />
            </div>

            {/* Slider Content */}
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
                    <div key={idx} className="w-full shrink-0 flex items-center justify-center">
                        {slide.content}
                    </div>
                ))}
            </motion.div>

            {/* Slider Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center space-x-2 z-20">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSlideIndex(idx)}
                        className={`h-2 w-2 rounded-full transition-all duration-300 hover:scale-110 ${
                            idx === slideIndex
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-400/50 w-6'
                                : 'bg-white/40 hover:bg-white/60'
                        }`}
                    />
                ))}
            </div>
        </motion.div>
    </div>
);
};

export default JackpotBanner;