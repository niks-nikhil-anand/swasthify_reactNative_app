import apiClient from '../api/apiClient';

export const authService = {
    register: async (data: any) => {
        try {
            const response = await apiClient.post('/api/auth/register', data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data?.message || 'Registration failed';
        }
    },

    login: async (data: any) => {
        try {
            const response = await apiClient.post('/api/auth/login', data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data?.message || 'Login failed';
        }
    }
};
