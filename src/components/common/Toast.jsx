import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertCircle } from 'react-icons/fi';

const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <FiCheckCircle className="w-6 h-6" />,
    error: <FiXCircle className="w-6 h-6" />,
    info: <FiInfo className="w-6 h-6" />,
    warning: <FiAlertCircle className="w-6 h-6" />
  };

  const colors = {
    success: 'bg-green-500 border-green-600',
    error: 'bg-red-500 border-red-600',
    info: 'bg-blue-500 border-blue-600',
    warning: 'bg-yellow-500 border-yellow-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`${colors[type]} text-white px-6 py-4 rounded-xl shadow-2xl border-2 flex items-center gap-3 min-w-[300px] max-w-[500px]`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 font-semibold">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition"
      >
        <FiXCircle className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
            duration={toast.duration}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
