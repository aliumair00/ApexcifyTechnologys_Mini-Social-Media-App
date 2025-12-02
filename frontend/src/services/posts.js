import api from './api';

export const postsService = {
    getAllPosts: async () => {
        const response = await api.get('/posts');
        return response.data;
    },

    getPostById: async (postId) => {
        const response = await api.get(`/posts/${postId}`);
        return response.data;
    },

    createPost: async (postData) => {
        const response = await api.post('/posts', postData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    deletePost: async (postId) => {
        const response = await api.delete(`/posts/${postId}`);
        return response.data;
    },

    likePost: async (postId) => {
        const response = await api.post(`/posts/${postId}/like`);
        return response.data;
    },

    unlikePost: async (postId) => {
        const response = await api.delete(`/posts/${postId}/like`);
        return response.data;
    },

    getUserPosts: async (userId) => {
        const response = await api.get(`/posts/user/${userId}`);
        return response.data;
    },

    updatePost: async (postId, formData) => {
        const response = await api.put(`/posts/${postId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};
