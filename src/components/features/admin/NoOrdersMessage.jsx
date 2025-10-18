import { motion } from 'framer-motion';

const NoOrdersMessage = () => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="backdrop-blur-xl rounded-3xl border bg-white/10 p-18 text-center">
    <div className="text-6xl mb-6">📦</div>
    <div className="text-white text-2xl font-semibold mb-2">No Orders Found</div>
    <div className="text-white/60">Orders will appear here once customers start purchasing tickets</div>
  </motion.div>
);

export default NoOrdersMessage;