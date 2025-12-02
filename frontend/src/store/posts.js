import { create } from 'zustand';

export const usePostsStore = create((set) => ({
    posts: [],
    loading: false,
    error: null,

    setPosts: (posts) => set({ posts }),

    addPost: (post) =>
        set((state) => ({
            posts: [post, ...state.posts],
        })),

    updatePost: (postId, updates) =>
        set((state) => ({
            posts: state.posts.map((post) =>
                post._id === postId ? { ...post, ...updates } : post
            ),
        })),

    deletePost: (postId) =>
        set((state) => ({
            posts: state.posts.filter((post) => post._id !== postId),
        })),

    toggleLike: (postId, userId) =>
        set((state) => ({
            posts: state.posts.map((post) => {
                if (post._id === postId) {
                    const isLiked = post.likes.includes(userId);
                    return {
                        ...post,
                        likes: isLiked
                            ? post.likes.filter((id) => id !== userId)
                            : [...post.likes, userId],
                    };
                }
                return post;
            }),
        })),

    updateAuthorAvatar: (userId, profilePicture) =>
        set((state) => ({
            posts: state.posts.map((post) =>
                post.author?._id === userId
                    ? { ...post, author: { ...post.author, profilePicture } }
                    : post
            ),
        })),

    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
}));
