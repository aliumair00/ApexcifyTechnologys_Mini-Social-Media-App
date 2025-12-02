import { create } from 'zustand';

export const useUsersStore = create((set) => ({
    users: [],
    currentProfile: null,
    following: [],
    followers: [],
    loading: false,

    setUsers: (users) => set({ users }),

    setCurrentProfile: (profile) => set({ currentProfile: profile }),

    toggleFollow: (userId) =>
        set((state) => {
            const isFollowing = state.following.includes(userId);
            return {
                following: isFollowing
                    ? state.following.filter((id) => id !== userId)
                    : [...state.following, userId],
            };
        }),

    setFollowing: (following) => set({ following }),
    setFollowers: (followers) => set({ followers }),
    setLoading: (loading) => set({ loading }),
}));
