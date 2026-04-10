import { create } from 'zustand'

export const useAuthStore = create((set) => ({
    user: null,
    profile: null,

    setUser: (user) => set({
        user,
        profile: {
            fullName: user.user_metadata.full_name,
            email: user.email,
        }
    }),
    clearUser: () => set({ user: null, profile: null }),
}))