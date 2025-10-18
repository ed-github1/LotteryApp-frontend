import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Stepper from "../../common/Stepper";
import WaitingApprovalSection from "../../features/Payment/WaitingApprovalSection";

const WaitingApprovalPage = () => {
    const navigate = useNavigate();
    const [orderStatus, setOrderStatus] = useState("pending");

    const resetFlow = () => {
        navigate('/dashboard/payment');
    };

    return (
        <div className="min-h-screen  relative overflow-hidden">
            {/* Lottery-themed background elements */}
            <motion.div
                className="absolute top-10 left-10 text-yellow-400 text-6xl opacity-10"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                🏆
            </motion.div>
            <motion.div
                className="absolute bottom-10 right-10 text-red-400 text-6xl opacity-10"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
                💰
            </motion.div>

            <Stepper currentStep={4} /> 
            <motion.h2
                className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                Waiting for Jackpot Validation
            </motion.h2>
            <div className="min-h-screen flex flex-col items-center justify-center pb-20">
                <motion.div
                    className="w-full max-w-4xl mx-auto bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-yellow-400/30 relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Jackpot glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-red-500/5 rounded-3xl blur-xl" />

                    <WaitingApprovalSection resetFlow={resetFlow} />
                </motion.div>
            </div>
        </div>
    );
};

export default WaitingApprovalPage;

