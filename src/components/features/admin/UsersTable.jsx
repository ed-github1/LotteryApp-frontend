import { motion } from 'framer-motion';
import { FaUser, FaCrown, FaTrash, FaUserShield } from 'react-icons/fa';
import { useState } from 'react';

const UsersTable = ({ users, onUpdateRole, onDeleteUser }) => {
    const [expandedRow, setExpandedRow] = useState(null);

    const getRoleBadge = (role) => {
        if (role === 'admin') {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-semibold">
                    <FaCrown className="text-xs" />
                    Admin
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold">
                <FaUser className="text-xs" />
                User
            </span>
        );
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-white/10">
                        <th className="text-left py-4 px-4 text-white/70 font-semibold text-sm">User</th>
                        <th className="text-left py-4 px-4 text-white/70 font-semibold text-sm">Email</th>
                        <th className="text-left py-4 px-4 text-white/70 font-semibold text-sm">Role</th>
                        <th className="text-left py-4 px-4 text-white/70 font-semibold text-sm">Joined</th>
                        <th className="text-left py-4 px-4 text-white/70 font-semibold text-sm">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => {
                        // Safety check for user object
                        if (!user) return null;
                        
                        const userId = user._id || user.id;
                        
                        return (
                        <motion.tr
                            key={userId || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.firstName}
                                            className="size-10 rounded-full border-2 border-white/20"
                                        />
                                    ) : (
                                        <div className="size-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                                            {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-white font-semibold">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-white/50 text-xs">ID: {user._id?.slice(-6) || user.id?.slice(-6) || 'N/A'}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <p className="text-white/80">{user.email}</p>
                                {user.isEmailVerified ? (
                                    <p className="text-green-400 text-xs">✓ Verified</p>
                                ) : (
                                    <p className="text-yellow-400 text-xs">⚠ Not verified</p>
                                )}
                            </td>
                            <td className="py-4 px-4">
                                {getRoleBadge(user.role)}
                            </td>
                            <td className="py-4 px-4">
                                <p className="text-white/70">{formatDate(user.createdAt)}</p>
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onUpdateRole(userId, user.role === 'admin' ? 'user' : 'admin')}
                                        className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors"
                                        title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                    >
                                        <FaUserShield />
                                    </button>
                                    <button
                                        onClick={() => onDeleteUser(userId)}
                                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                                        title="Delete User"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </motion.tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;
