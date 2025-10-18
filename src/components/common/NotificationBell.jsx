import { useState, useRef } from 'react'
import { BiBell } from 'react-icons/bi'

// Example notification context (replace with your real context if needed)
const notificationsExample = [
    { id: 1, message: 'Your payment was successful!', read: false },
    { id: 2, message: 'New draw results are available.', read: false },
]

const NotificationBell = ({ notifications = notificationsExample }) => {
    const [open, setOpen] = useState(false)
    const bellRef = useRef(null)
    const unreadCount = notifications.filter(n => !n.read).length

    const handleToggle = () => setOpen((prev) => !prev)

    return (
        <div className="relative" ref={bellRef}>
            <button
                className="relative focus:outline-none"
                aria-label="Notifications"
                onClick={handleToggle}
            >
                <BiBell className="text-[#FFD700] size-6 sm:text-3xl" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                )}
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100 font-bold text-gray-700">Notifications</div>
                    <ul className="max-h-60 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <li className="p-4 text-gray-400 text-center">No notifications</li>
                        ) : (
                            notifications.map((n) => (
                                <li key={n.id} className={`p-4 border-b border-gray-100 text-sm ${n.read ? 'text-gray-400' : 'text-gray-700 font-bold'}`}>{n.message}</li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default NotificationBell
