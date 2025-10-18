import { motion } from 'motion/react'
import { CRYPTO_PROVIDERS } from './cryptoProviders';


const PaymentMethodSelector = ({ selected, setSelected }) => {
    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
            }}
        >
            {CRYPTO_PROVIDERS.map((provider) => (
                <motion.button
                    key={provider.code}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 shadow-xl bg-white/10 backdrop-blur-sm text-white text-lg font-semibold hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${selected === provider.code ? 'border-blue-400 bg-blue-500/20 shadow-blue-500/50' : 'border-white/20 hover:border-white/40'}`}
                    onClick={() => setSelected(provider.code)}
                    variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.div
                        className="text-4xl mb-3"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                    >
                        {provider.icon}
                    </motion.div>
                    <span className="text-center">{provider.name}</span>
                </motion.button>
            ))}
        </motion.div>
    );
}





export default PaymentMethodSelector