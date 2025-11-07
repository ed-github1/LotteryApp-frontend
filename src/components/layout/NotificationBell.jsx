import { useState } from 'react';
import { FiBell } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotificationBell = ({ user, collapsed }) => {
  const notificationCount = user?.notifications || 3;
  const [notifOpen, setNotifOpen] = useState(false);
  const notifications = [
    { id: 1, text: 'Lottery results uploaded', link: '/dashboard/results' },
    { id: 2, text: 'You won a prize!', link: '/dashboard/results' },
    { id: 3, text: 'Profile updated successfully', link: '/dashboard/my-account' },
  ];

  return (
    <div
      className={
        collapsed
          ? 'flex items-center justify-center w-full py-2 relative'
          : 'absolute top-3 right-5 z-20'
      }
      style={collapsed ? {} : { pointerEvents: 'auto' }}
    >
      <button
        className="relative flex items-center justify-center w-7 h-7 rounded-full bg-white/30 hover:bg-blue-500/30 shadow-lg transition-all duration-200 focus:outline-none"
        style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}
        aria-label="Show notifications"
        onClick={() => setNotifOpen((open) => !open)}
      >
        <FiBell className="text-base text-gray-700 group-hover:text-blue-700 transition-colors duration-200" />
        {notificationCount > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full shadow-lg border-2 border-white"
            style={{ zIndex: 2 }}
          >
            {notificationCount}
          </span>
        )}
      </button>
      {/* Notification dropdown */}
      {notifOpen && !collapsed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 top-12 z-50 min-w-[220px] bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 py-2 px-3 flex flex-col gap-2"
        >
          {notifications.length === 0 ? (
            <div className="text-gray-500 text-sm text-center py-2">No notifications</div>
          ) : (
            notifications.map(n => (
              <Link key={n.id} to={n.link} className="block text-gray-800 hover:bg-blue-100 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150">
                {n.text}
              </Link>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
};

export default NotificationBell;
