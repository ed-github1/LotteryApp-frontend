import {
  BiTrophy,
  BiUser,
} from 'react-icons/bi'
import { HiTicket, HiHome, HiSearch, HiClock } from 'react-icons/hi'
import { HiMiniBolt } from 'react-icons/hi2'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { CiSettings } from 'react-icons/ci';
import { FiUpload } from 'react-icons/fi';

const BottomNav = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user && user.role === 'admin';

  // Define your main navigation tabs
  const navTabs = [
    { icon: HiHome, label: 'Home', to: '/dashboard/buy-ticket' },
    { icon: HiMiniBolt, label: 'Super Ball', to: '/dashboard/superball' },
    { icon: BiTrophy, label: 'Results', to: '/dashboard/results' },
    { icon: HiTicket, label: 'Tickets', to: '/dashboard/purchase-history' },
    { icon: BiUser, label: 'Profile', to: '/dashboard/my-account' },
  ];

  // Add admin tabs if user is admin
  if (isAdmin) {
    navTabs.push(
      { icon: BiTrophy, label: 'Winners', to: '/dashboard/admin/winners' },
      { icon: CiSettings, label: 'Admin', to: '/dashboard/admin/orders' }
    );
  }

  return (
    <>
      {/* Top Bar - Simplified for mobile */}
      <nav className="fixed top-0 left-0 w-full z-50 lg:hidden">
        <div className="bg-white/20 backdrop-blur-md border-b border-white/30 px-4 py-3 shadow-lg">
          <div className="flex items-center justify-center">
            <div className="text-lg font-bold text-white">World Superlotto</div>
          </div>
        </div>
      </nav>

      {/* Bottom Tab Bar - The main navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 z-50 lg:hidden">
        <div className="flex items-center justify-around px-2 py-1 w-full">
          {navTabs.map(({ icon: Icon, label, to }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors min-w-0 flex-1"
              >
                <motion.div
                  className={`p-1 rounded-lg mb-1 ${
                    isActive 
                      ? 'bg-amber-100 text-amber-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} />
                </motion.div>
                <span className={`text-xs font-medium truncate ${
                  isActive ? 'text-amber-600' : 'text-gray-600'
                }`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;