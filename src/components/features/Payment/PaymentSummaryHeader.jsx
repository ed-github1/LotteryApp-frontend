import { motion } from 'motion/react'
import { FaClock } from 'react-icons/fa';
const PaymentSummaryHeader = ({ totalAmount, timeLeft }) => {
    return (
        <motion.div
            className="mt-6 mb-4 mx-auto p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 w-full max-w-7xl px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-white font-semibold">Total Amount</h3>
                    <p className="text-2xl font-bold text-green-400">${totalAmount.toFixed(2)}</p>
                </div>
                {timeLeft && (
                    <div className="text-right">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                            <FaClock className="text-yellow-400" />
                            Time Left
                        </h3>
                        <p className="text-xl font-bold text-yellow-400">{timeLeft}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}


export default PaymentSummaryHeader