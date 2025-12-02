import api from './api';

export const usersService = {
    getUserProfile: async (userId) => {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },

    updateProfile: async (userData) => {
        const response = await api.put('/users/profile', userData);
        return response.data;
    },

    searchUsers: async (query) => {
        const response = await api.get(`/users/search?q=${query}`);
        return response.data;
    },

    uploadProfilePicture: async (formData) => {
        const response = await api.post('/users/profile-picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    uploadBanner: async (formData) => {
        const response = await api.post('/users/banner', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
