import api from './api';

export const followService = {
    followUser: async (userId) => {
        const response = await api.post(`/users/${userId}/follow`);
        return response.data;
    },

    unfollowUser: async (userId) => {
        const response = await api.delete(`/users/${userId}/follow`);
        return response.data;
    },

    getFollowers: async (userId) => {
        const response = await api.get(`/users/${userId}/followers`);
        return response.data;
    },

    getFollowing: async (userId) => {
        const response = await api.get(`/users/${userId}/following`);
        return response.data;
    },
};
