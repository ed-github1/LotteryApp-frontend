import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ConfettiLayer = ({ confetti }) => {
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => setScreenHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!confetti || confetti.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {confetti.map((c) => (
                <motion.div
                    key={c.id}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: screenHeight, opacity: 1, rotate: c.rot }}
                    transition={{ delay: c.delay, duration: 0.9, ease: 'easeOut' }}
                    style={{ left: `${c.left}%`, position: 'absolute', top: 0 }}
                >
                    <div style={{ width: c.size, height: c.size, background: c.bg, borderRadius: 3 }} />
                </motion.div>
            ))}
        </div>
    );
};

export default ConfettiLayer;