import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getAllUsers, updateUserRole, deleteUser } from '../services/usersService';
import { useAuth } from './AuthContext';

// Create the context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user: currentUser, token } = useAuth();

  // Fetch all users (admin only)
  const fetchUsers = useCallback(async () => {
    if (!token || currentUser?.role !== 'admin') {
      console.log('[UsersContext] Not authorized to fetch users');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data);
      console.log('[UsersContext] Users fetched:', data.length);
    } catch (err) {
      console.error('[UsersContext] Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [token, currentUser?.role]);

  // Update user role (admin only)
  const handleUpdateUserRole = useCallback(async (userId, newRole) => {
    if (!token || currentUser?.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    try {
      await updateUserRole(userId, newRole);
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(u => u._id === userId ? { ...u, role: newRole } : u)
      );
      console.log('[UsersContext] User role updated:', userId, newRole);
      return { success: true };
    } catch (err) {
      console.error('[UsersContext] Error updating user role:', err);
      throw err;
    }
  }, [token, currentUser?.role]);

  // Delete user (admin only)
  const handleDeleteUser = useCallback(async (userId) => {
    if (!token || currentUser?.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    try {
      await deleteUser(userId);
      // Remove from local state
      setUsers(prevUsers => prevUsers.filter(u => u._id !== userId));
      console.log('[UsersContext] User deleted:', userId);
      return { success: true };
    } catch (err) {
      console.error('[UsersContext] Error deleting user:', err);
      throw err;
    }
  }, [token, currentUser?.role]);

  // Get user statistics
  const getUserStats = useCallback(() => {
    return {
      total: users.length,
      admins: users.filter(u => u.role === 'admin').length,
      regularUsers: users.filter(u => u.role === 'user').length,
      verified: users.filter(u => u.isEmailVerified).length,
      unverified: users.filter(u => !u.isEmailVerified).length
    };
  }, [users]);

  // Filter users by search term
  const searchUsers = useCallback((searchTerm) => {
    if (!searchTerm) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(u => 
      u.email?.toLowerCase().includes(term) ||
      u.firstName?.toLowerCase().includes(term) ||
      u.lastName?.toLowerCase().includes(term) ||
      u._id?.includes(term)
    );
  }, [users]);

  // Filter users by role
  const filterUsersByRole = useCallback((role) => {
    if (role === 'all') return users;
    return users.filter(u => u.role === role);
  }, [users]);

  // Get user by ID
  const getUserById = useCallback((userId) => {
    return users.find(u => u._id === userId);
  }, [users]);

  // Auto-fetch users when admin logs in
  useEffect(() => {
    if (token && currentUser?.role === 'admin') {
      fetchUsers();
    }
  }, [token, currentUser?.role, fetchUsers]);

  const value = {
    users,
    loading,
    error,
    fetchUsers,
    updateUserRole: handleUpdateUserRole,
    deleteUser: handleDeleteUser,
    getUserStats,
    searchUsers,
    filterUsersByRole,
    getUserById
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy access
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
