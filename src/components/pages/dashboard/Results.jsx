import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfettiLayer from '../../features/lottery/ConfettiLayer';
import SuperBallResults from '../../features/superball/SuperBallResults';
import LotteryResults from '../../features/lottery/LotteryResults';
import { SuperballBanner } from '../../common/SuperballBanner';

const tabs = [
	{
		key: 'lottery',
		label: '🎯 Lottery Results',
		gradient: 'from-yellow-400 to-orange-500',
	},
	{
		key: 'superball',
		label: '🟣 Super Ball Result',
		gradient: 'from-yellow-400 to-orange-500',
	},
];

const Results = () => {
	const [activeTab, setActiveTab] = useState('lottery');
	const [confetti, setConfetti] = useState([]);

	// Clear confetti after animation completes
	useEffect(() => {
		if (confetti.length > 0) {
			const timer = setTimeout(() => {
				setConfetti([]);
			}, 3000); // Clear after 3 seconds
			return () => clearTimeout(timer);
		}
	}, [confetti]);

	return (
		<div className="min-h-screen bg-transparent p-0 m-0 pt-16 pb-20">
			{/* Confetti Layer */}
			<ConfettiLayer confetti={confetti} />

			{/* Superball Banner */}
			<SuperballBanner />

			{/* Navigation Tabs */}
			<motion.div
				className="flex justify-center"
				initial={{ opacity: 0, y: -24 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="relative flex w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden">
					{tabs.map((tab, idx) => (
						<button
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							className={`flex-1 py-4 font-semibold text-base transition-all duration-200 z-10 relative
                ${activeTab === tab.key ? 'text-white' : 'text-white/60 hover:text-white'}
                focus:outline-none`}
							role="tab"
							aria-selected={activeTab === tab.key}
							tabIndex={activeTab === tab.key ? 0 : -1}
							style={{ borderRadius: 0 }}
						>
							{tab.label}
						</button>
					))}
					{/* Animated Tab Indicator */}
					<motion.div
						layout
						transition={{ type: 'spring', damping: 18, stiffness: 250 }}
						className="absolute top-0 h-full w-1/2 rounded-2xl pointer-events-none"
						style={{
							left: activeTab === 'superball' ? '50%' : '0%',
							background:
								activeTab === 'superball'
									? 'linear-gradient(to right, #a78bfa, #f472b6)'
									: 'linear-gradient(to right, #facc15, #f97316)',
							boxShadow: '0 2px 16px 0 rgba(0,0,0,0.12)',
						}}
					/>
				</div>
			</motion.div>

			{/* Animated Content */}
			<div className="w-full p-0 m-0">
				<AnimatePresence mode="wait">
					{activeTab === 'lottery' ? (
						<motion.div
							key="lottery"
							initial={{ opacity: 0, y: 24 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -24 }}
							transition={{ duration: 0.35 }}
						>
							<LotteryResults onConfettiChange={setConfetti} />
						</motion.div>
					) : (
						<motion.div
							key="superball"
							initial={{ opacity: 0, y: 24 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -24 }}
							transition={{ duration: 0.35 }}
						>
							<SuperBallResults onConfettiChange={setConfetti} />
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default Results;
