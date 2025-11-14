import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const baseUrl = API_URL ? `${API_URL}/api/users` : '/api/users';

// Get all users (admin only)
export const getAllUsers = async () => {
    try {
        console.log('[usersService] Fetching users from:', baseUrl);
        const response = await axios.get(baseUrl);
        console.log('[usersService] Users response:', response.data);
        return response.data;
    } catch (error) {
        console.error('[usersService] Error fetching users:', error.response || error);
        console.error('[usersService] Error details:', {
            status: error.response?.status,
            data: error.response?.data,
            url: baseUrl
        });
        throw error;
    }
};

// Update user role (admin only)
export const updateUserRole = async (userId, role) => {
    try {
        const response = await axios.put(
            `${baseUrl}/${userId}/role`,
            { role }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
    }
};

// Delete user (admin only)
export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${baseUrl}/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
