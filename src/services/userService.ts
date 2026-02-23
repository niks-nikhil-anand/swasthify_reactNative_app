import apiClient from '../api/apiClient';

export const userService = {
    updatePhone: async (phone: string) => {
        try {
            const response = await apiClient.patch('/api/me/update-phone', { phone });
            return response.data;
        } catch (error: any) {
            throw error.response?.data?.message || 'Failed to update phone number';
        }
    },

    updateEmail: async (email: string) => {
        try {
            const response = await apiClient.patch('/api/me/update-email', { email });
            return response.data;
        } catch (error: any) {
            throw error.response?.data?.message || 'Failed to update email address';
        }
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
        try {
            const response = await apiClient.patch('/api/me/change-password', {
                currentPassword,
                newPassword,
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data?.message || 'Failed to change password';
        }
    },

    updateName: async (name: string) => {
        try {
            // Note: End-point not specified in the prompt but implied by requirements
            const response = await apiClient.patch('/api/me/update-name', { name });
            return response.data;
        } catch (error: any) {
            throw error.response?.data?.message || 'Failed to update name';
        }
    },

    updateProfile: async (data: Partial<any>) => {
        try {
            const response = await apiClient.patch('/api/me/update-profile', data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data?.message || 'Failed to update profile';
        }
    }
};
