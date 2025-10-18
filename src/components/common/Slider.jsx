import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronRight, FaChevronLeft, FaTrophy, FaCoins, FaGift, FaRocket } from 'react-icons/fa'

const slides = [
  {
    id: 1,
    title: "Welcome to the Ultimate Lottery Experience",
    subtitle: "Join millions of winners worldwide",
    description: "Experience the thrill of lottery gaming with instant results, secure payments, and life-changing prizes waiting for you.",
    icon: FaRocket,
    gradient: "from-purple-600 via-blue-600 to-cyan-500",
    bgPattern: "bg-gradient-to-br from-purple-900/20 to-blue-900/20",
    stats: { players: "10M+", prizes: "$500M+", winners: "50K+" }
  },
  {
    id: 2,
    title: "Massive Jackpots & Instant Wins",
    subtitle: "Play now, win instantly",
    description: "Choose from multiple lottery games with jackpots reaching millions. Every ticket brings you closer to fortune!",
    icon: FaTrophy,
    gradient: "from-yellow-500 via-orange-500 to-red-500",
    bgPattern: "bg-gradient-to-br from-yellow-900/20 to-orange-900/20",
    stats: { jackpot: "$50M", tickets: "24/7", payout: "99.9%" }
  },
  {
    id: 3,
    title: "Secure & Trusted Platform",
    subtitle: "Your security is our priority",
    description: "Advanced encryption, instant payouts, and 24/7 customer support. Play with confidence on the most trusted lottery platform.",
    icon: FaCoins,
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    bgPattern: "bg-gradient-to-br from-green-900/20 to-emerald-900/20",
    stats: { security: "256-bit", support: "24/7", verified: "100%" }
  },
  {
    id: 4,
    title: "Exclusive Bonuses & Rewards",
    subtitle: "More chances to win big",
    description: "Get welcome bonuses, referral rewards, and special promotions. Maximize your winning potential with our exclusive offers.",
    icon: FaGift,
    gradient: "from-pink-500 via-rose-500 to-red-500",
    bgPattern: "bg-gradient-to-br from-pink-900/20 to-rose-900/20",
    stats: { bonus: "100%", referrals: "20%", promotions: "Daily" }
  }
]

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [currentSlide, isAutoPlaying])

  const currentSlideData = slides[currentSlide]
  const IconComponent = currentSlideData.icon

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Pattern */}
      <div className={`absolute inset-0 ${currentSlideData.bgPattern}`} />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400/20 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center justify-center p-8 lg:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Icon */}
              <motion.div
                className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-r ${currentSlideData.gradient} shadow-2xl`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <IconComponent className="w-12 h-12 text-white" />
              </motion.div>

              {/* Title */}
              <div className="space-y-4">
                <motion.h1
                  className="text-4xl lg:text-6xl font-bold text-white leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  {currentSlideData.title}
                </motion.h1>

                <motion.p
                  className="text-xl lg:text-2xl text-yellow-400 font-semibold"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  {currentSlideData.subtitle}
                </motion.p>
              </div>

              {/* Description */}
              <motion.p
                className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                {currentSlideData.description}
              </motion.p>

              {/* Stats */}
              <motion.div
                className="flex flex-wrap justify-center gap-6 lg:gap-12 mt-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {Object.entries(currentSlideData.stats).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r ${currentSlideData.gradient} bg-clip-text text-transparent`}>
                      {value}
                    </div>
                    <div className="text-sm lg:text-base text-gray-400 uppercase tracking-wide">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="pt-4"
              >
                <motion.button
                  className={`px-8 py-4 rounded-2xl bg-gradient-to-r ${currentSlideData.gradient} text-white font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300`}
                  whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Playing Now
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
        <motion.button
          onClick={prevSlide}
          className="pointer-events-auto p-4 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-all duration-300 border border-white/10"
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Previous slide"
        >
          <FaChevronLeft className="w-6 h-6" />
        </motion.button>

        <motion.button
          onClick={nextSlide}
          className="pointer-events-auto p-4 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-all duration-300 border border-white/10"
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Next slide"
        >
          <FaChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-12 bg-gradient-to-r from-yellow-400 to-yellow-600'
                : 'w-3 bg-white/30 hover:bg-white/50'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlide && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
                layoutId="activeIndicator"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 bg-black/30 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
        <span className="text-white font-medium">
          {currentSlide + 1} / {slides.length}
        </span>
      </div>

      {/* Auto-play Indicator */}
      <motion.div
        className="absolute top-8 left-8 w-3 h-3 rounded-full bg-green-400"
        animate={{ opacity: isAutoPlaying ? [0.3, 1, 0.3] : 0.3 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  )
}

export default Slider
