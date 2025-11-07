import { BiHistory, BiLogOut, BiCrown, BiUpload } from 'react-icons/bi'
import { HiTicket, HiUser, HiChevronLeft } from 'react-icons/hi'
import { HiMiniTrophy, HiMiniSparkles, HiMiniBolt } from 'react-icons/hi2'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import NotificationBell from './NotificationBell';

// Navigation Options Component with Clean Theme
const getNavOptions = (isAdmin) => {
  const options = [

    {
      icon: HiMiniBolt,
      label: 'Super Ball',
      to: '/dashboard/superball',
      description: 'Main jackpot'
    },
    {
      icon: HiTicket,
      label: 'Buy Tickets',
      to: '/dashboard/buy-ticket',
      description: 'Purchase entries'
    },
    {
      icon: HiMiniTrophy,
      label: 'Results',
      to: '/dashboard/results',
      description: 'Winning numbers'
    },
    {
      icon: BiHistory,
      label: 'History',
      to: '/dashboard/purchase-history',
      description: 'Past purchases'
    },
    isAdmin && {
      icon: BiCrown,
      label: 'Orders',
      to: '/dashboard/admin/orders',
      description: 'Management panel'
    },
    isAdmin && {
      icon: BiUpload,
      label: 'Upload Winner Numbers',
      to: '/dashboard/admin/upload-winner-number',
      description: 'Upload winning numbers'
    },
    isAdmin && {
      icon: HiMiniSparkles,
      label: 'Winners',
      to: '/dashboard/admin/winners',
      description: 'Winners by hit'
    },

  ];
  return options.filter(Boolean);
};



// Modern User Profile Component with dropdown actions
const UserProfile = ({ user, collapsed }) => {
  const initial = user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`border-b border-white/10 overflow-visible ${collapsed ? 'px-2 py-2' : 'px-6 py-5'} bg-white/10 rounded-b-xl`}
    >
      {collapsed ? (
        <div className="flex flex-col items-center justify-center w-full gap-y-3" style={{ minHeight: '80px' }}>
          <div className="relative flex-shrink-0">
            {/* Bell in collapsed mode: keep above avatar */}
            <NotificationBell user={user} collapsed={true} />
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="size-12 rounded-full border-2 border-white/30 shadow-lg object-cover transition-all duration-200"
              />
            ) : (
              <div className="size-12 flex items-center justify-center rounded-full border-2 border-white/30 bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-base shadow-lg">
                {initial}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center w-full justify-between">
          {/* Bell in expanded mode: top-right of card */}
          <div className="">
            <NotificationBell user={user} collapsed={false} />
          </div>
          {/* Left: Avatar and User Info */}
          <div className="flex items-center gap-x-3">
            <div className="relative flex-shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="size-12 rounded-full border-2 border-white/30 shadow-lg object-cover transition-all duration-200"
                />
              ) : (
                <div className="size-12 flex items-center justify-center rounded-full border-2 border-white/30 bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-base shadow-lg">
                  {initial}
                </div>
              )}
            </div>
            {/* User Info */}
            <div className="flex flex-col min-w-0 pl-2">
              <h3 className="font-bold text-white text-sm truncate">{user?.firstName || 'User'}</h3>
              <p className="text-xs text-gray-300 truncate">{user?.email || 'user@example.com'}</p>
              {user?.role === 'admin' && (
                <span className="inline-flex items-center gap-1 text-xs text-yellow-400 mt-0.5">
                  <BiCrown className="text-xs" /> Admin
                </span>
              )}
            </div>
          </div>
          {/* Divider */}
          <div className="h-8 w-px bg-white/20 mx-3 rounded-full" />
        </div>
      )}
    </motion.div>
  );
}

// Navigation Menu Component with Lottery Theme
const Navigation = ({ location, user, collapsed }) => {
  const isAdmin = user?.role === 'admin';
  const navOptions = getNavOptions(isAdmin);

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <nav className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar ${collapsed ? 'px-2 py-2' : 'px-4 py-2'
      } space-y-1`}>
      {!collapsed && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide px-2">
            Menu
          </h4>
        </div>
      )}

      {navOptions.map(({ icon: Icon, label, to, description }, index) => {
        const isActive = location.pathname === to;

        return (
          <motion.div
            key={to}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="relative group"
          >
            <Link
              to={to}
              className={`group relative flex items-center transition-all duration-200 overflow-hidden ${collapsed
                  ? 'justify-center p-2 mx-1 rounded-lg'
                  : 'gap-3 px-3 py-2 rounded-lg'
                } ${isActive
                  ? 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 shadow-lg'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              title={collapsed ? label : ''}
            >
              {/* Clean active indicator */}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-white rounded-r-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* Clean icon */}
              <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                <Icon className={`text-base transition-colors duration-200 ${isActive
                    ? 'text-white'
                    : 'text-gray-400 group-hover:text-gray-300'
                  }`} />
              </div>

              {/* Clean text content */}
              <div className={`flex-1 min-w-0 overflow-hidden ${collapsed ? 'hidden' : 'block'}`}>
                <div className={`font-medium text-sm truncate ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                  }`}>
                  {label}
                </div>
                <div className={`text-xs truncate ${isActive ? 'text-blue-200' : 'text-gray-500 group-hover:text-gray-400'
                  }`}>
                  {description}
                </div>
              </div>
            </Link>

            {/* Clean tooltip for collapsed state */}
            {collapsed && (
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap">
                <div className="font-medium">{label}</div>
                <div className="text-xs text-gray-400">{description}</div>
                {/* Clean tooltip arrow */}
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
              </div>
            )}
          </motion.div>
        );
      })}
    </nav>
  );
}

// Security Section Component with Clean Theme
const SecuritySection = ({ collapsed }) => {
  const { logout } = useAuth()
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`border-t border-white/10 overflow-hidden ${collapsed ? 'px-2 pb-4 pt-4' : 'px-4 pb-6 pt-4'
        }`}
    >
      {/* Clean Logout Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-medium flex items-center justify-center transition-all duration-200 flex-shrink-0 ${collapsed
            ? 'p-2 rounded-lg'
            : 'py-2.5 px-3 rounded-lg gap-2'
          }`}
        onClick={handleLogout}
        aria-label='Log Out'
      >
        <BiLogOut className="text-base" />
        {!collapsed && <span>Logout</span>}
      </motion.button>

      {/* Clean version info */}
      {!collapsed && (
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            v2.0.0
          </p>
        </div>
      )}
    </motion.div>
  )
}

// Main Sidebar Component with Lottery Theme
const Sidebar = ({ collapsed, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);

  // Add this style block inside the Sidebar component
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      backdrop-filter: blur(10px);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 10px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  `;

  return (
    <>
      {/* Add the style tag */}
      <style>{scrollbarStyles}</style>

      {/* Desktop Sidebar with Clean Background */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1
        }}
        transition={{
          x: { duration: 0.4, ease: "easeOut" },
          opacity: { duration: 0.4, ease: "easeOut" }
        }}
        className="fixed hidden lg:flex flex-col top-0 left-0 h-screen z-40 bg-white/10 backdrop-blur-xl border-r border-white/10 shadow-xl overflow-hidden"
        style={{
          width: collapsed ? '64px' : '256px',
          transition: 'width 0.3s ease-in-out'
        }}
      >
        {/* Content */}
        <div className="relative flex flex-col h-full">
          {/* Notification Bell Container */}
          {/* NotificationBell now inside UserProfile, remove from here */}
          <UserProfile user={user} collapsed={collapsed} />
          {/* Clean Toggle Button */}
          <motion.div
            className={`border-b border-white/10 flex justify-center overflow-hidden ${collapsed ? 'px-2 py-3' : 'px-4 py-3'}`}
          >
            <motion.button
              onClick={onToggle}
              className="flex items-center justify-center p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-200 flex-shrink-0"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: collapsed ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <HiChevronLeft size={16} />
              </motion.div>
            </motion.button>
          </motion.div>
          <Navigation location={location} user={user} collapsed={collapsed} />
          <SecuritySection collapsed={collapsed} />
        </div>
      </motion.aside>

      {/* NotificationBell fixed to right side of screen */}
      <AnimatePresence>
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 15 }}
          className="fixed top-8 right-6 z-[120]"
        >
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Sidebar
