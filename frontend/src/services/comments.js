import api from './api';

export const commentsService = {
    getComments: async (postId) => {
        const response = await api.get(`/posts/${postId}/comments`);
        return response.data;
    },

    addComment: async (postId, commentData) => {
        const response = await api.post(`/posts/${postId}/comments`, commentData);
        return response.data;
    },

    deleteComment: async (postId, commentId) => {
        const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
        return response.data;
    },
};
