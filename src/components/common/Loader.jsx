import { motion } from "framer-motion";

const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-[200px] w-full">
    <motion.div
      className="flex gap-2"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.15 } }
      }}
    >
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-purple-500"
          variants={{
            hidden: { scale: 0.5, opacity: 0.3 },
            visible: {
              scale: [0.5, 1.2, 0.5],
              opacity: [0.3, 1, 0.3],
              transition: { repeat: Infinity, duration: 1, delay: i * 0.2 }
            }
          }}
        />
      ))}
    </motion.div>
    <span className="mt-4 text-sm text-gray-400 font-medium tracking-wide">
      Loading...
    </span>
  </div>
);

export default Loader;