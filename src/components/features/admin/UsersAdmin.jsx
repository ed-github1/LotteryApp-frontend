import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaCrown, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { useUser } from '../../../context/UsersContext';
import UsersTable from './UsersTable';
import Loader from '../../common/Loader';

const UsersAdmin = () => {
    const { user } = useAuth();
    const { 
        users, 
        loading, 
        error, 
        fetchUsers, 
        updateUserRole, 
        deleteUser,
        getUserStats 
    } = useUser();    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const isAdmin = useMemo(() => user?.role === 'admin', [user?.role]);

    useEffect(() => {
        console.log('[UsersAdmin] Component mounted, isAdmin:', isAdmin);
        if (isAdmin) {
            console.log('[UsersAdmin] Fetching users...');
            fetchUsers();
        }
    }, [isAdmin, fetchUsers]);

    useEffect(() => {
        console.log('[UsersAdmin] Users state updated:', users?.length || 0, 'users');
    }, [users]);

    const handleUpdateRole = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
        } catch (err) {
            console.error('Error updating user role:', err);
            alert('Failed to update user role');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }
        try {
            await deleteUser(userId);
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Failed to delete user');
        }
    };

    // Filter users based on search and role
    const filteredUsers = useMemo(() => {
        if (!users || users.length === 0) return [];

        return users.filter(u => {
            const matchesSearch =
                u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole = roleFilter === 'all' || u.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    // Statistics
    const stats = useMemo(() => {
        if (!users || users.length === 0) {
            return { total: 0, admins: 0, verified: 0 };
        }
        return getUserStats();
    }, [users, getUserStats]);

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FaExclamationTriangle className="text-red-400 text-6xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                    <p className="text-white/70">You must be an admin to view this page.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                    <FaUsers className="text-blue-400" />
                    Users Management
                </h1>
                <p className="text-white/70">Manage all registered users in the system</p>
            </motion.div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                    <FaUsers className="text-blue-400 text-3xl mb-2" />
                    <h3 className="text-white/70 text-sm mb-1">Total Users</h3>
                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                    <FaCrown className="text-yellow-400 text-3xl mb-2" />
                    <h3 className="text-white/70 text-sm mb-1">Administrators</h3>
                    <p className="text-3xl font-bold text-white">{stats.admins}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                    <div className="text-green-400 text-3xl mb-2">✓</div>
                    <h3 className="text-white/70 text-sm mb-1">Verified Users</h3>
                    <p className="text-3xl font-bold text-white">{stats.verified}</p>
                </motion.div>
            </div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6"
            >
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>

                    {/* Role Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setRoleFilter('all')}
                            className={`px-4 py-3 rounded-xl font-semibold transition-all ${roleFilter === 'all'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                                }`}
                        >
                            All Users
                        </button>
                        <button
                            onClick={() => setRoleFilter('admin')}
                            className={`px-4 py-3 rounded-xl font-semibold transition-all ${roleFilter === 'admin'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                                }`}
                        >
                            Admins
                        </button>
                        <button
                            onClick={() => setRoleFilter('user')}
                            className={`px-4 py-3 rounded-xl font-semibold transition-all ${roleFilter === 'user'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                                }`}
                        >
                            Regular Users
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-6"
                >
                    <FaExclamationTriangle className="inline mr-2 text-red-400" />
                    <span className="text-red-400">{error}</span>
                </motion.div>
            )}

            {/* Users Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
            >
                {filteredUsers.length > 0 ? (
                    <UsersTable
                        users={filteredUsers}
                        onUpdateRole={handleUpdateRole}
                        onDeleteUser={handleDelete}
                    />
                ) : (
                    <div className="text-center py-12">
                        <FaUsers className="text-white/30 text-6xl mx-auto mb-4" />
                        <p className="text-white/70 text-lg">
                            {loading ? 'Loading users...' : 'No users found matching your criteria'}
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default UsersAdmin;
