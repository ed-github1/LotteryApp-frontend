import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CRYPTO_PROVIDERS } from './cryptoProviders';
import { FaCopy, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';

const PaymentQRSection = ({
    selected, totalAmount, qrUrl, qrData, copied, copyToClipboard,
    tkid, setTkid, tkidValid, isSubmitting, validateAndSubmit, error, resetFlow
}) => {
    const { t } = useTranslation();
    return (
        <motion.div
            key="qr"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
        >
            <motion.h2
                className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {t('payment.completePayment')}
            </motion.h2>
            <div className="flex flex-col items-center w-full">
                <motion.div
                    className="mb-6 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 w-full max-w-md"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="text-center mb-4">
                        <span className="block text-white text-xl font-semibold mb-2">{CRYPTO_PROVIDERS.find(p => p.code === selected)?.name}</span>
                        <span className="text-green-400 font-bold text-lg">${totalAmount.toFixed(2)}</span>
                    </div>
                    <motion.img
                        src={qrUrl}
                        alt="QR Code"
                        className="w-48 h-48 rounded-xl border-4 border-white/30 shadow-2xl mx-auto mb-4"
                        initial={{ rotate: -10, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    />
                    <div className="text-center">
                        <p className="text-white/80 text-sm mb-2">{t('payment.scanWithWallet')}</p>
                        <button
                            onClick={() => copyToClipboard(qrData)}
                            className="flex items-center gap-2 mx-auto px-3 py-1 bg-white/20 rounded-lg text-white text-sm hover:bg-white/30 transition-colors"
                        >
                            {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
                            {copied ? t('payment.copied') : t('payment.copyAddress')}
                        </button>
                    </div>
                </motion.div>
                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    {/* Inline instruction for TKID */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mb-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-3 border border-yellow-500/30"
                    >
                        <div className="flex items-start gap-2">
                            <span className="text-yellow-400 text-lg flex-shrink-0 mt-0.5">💡</span>
                            <div>
                                <p className="text-yellow-200 text-sm font-semibold mb-1">{t('payment.instruction.title')}</p>
                                <p className="text-yellow-100/90 text-xs">
                                    {t('payment.instruction.desc')}
                                    {t('payment.instruction.test')}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <label className="block text-white font-semibold mb-2">
                        {t('payment.transactionId')}
                    </label>
                    <div className="relative">
                        <input
                            className={`w-full px-6 py-3 rounded-xl border bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-4 text-white placeholder-white/60 text-center text-lg transition-all ${tkidValid === false ? 'border-red-400 focus:ring-red-500/50' :
                                tkidValid === true ? 'border-green-400 focus:ring-green-500/50' :
                                    'border-white/30 focus:ring-blue-500/50'
                                }`}
                            placeholder={t('payment.enterTransactionId')}
                            value={tkid}
                            onChange={e => setTkid(e.target.value)}
                            disabled={isSubmitting}
                        />
                        {tkid && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {tkidValid === true && <FaCheck className="text-green-400" />}
                                {tkidValid === false && <FaExclamationTriangle className="text-red-400" />}
                            </div>
                        )}
                    </div>
                    {tkidValid === false && (
                        <p className="text-red-400 text-sm mt-2">
                            {t('payment.txidValidation')}
                        </p>
                    )}
                </motion.div>
                {error && (
                    <motion.div
                        className="text-red-400 text-sm mt-4 bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/30 w-full max-w-md"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <FaExclamationTriangle className="inline mr-2" />
                        {error}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default PaymentQRSection;
