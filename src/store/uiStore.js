import { create } from "zustand";

export const useUIStore = create((set) => (
    {
        searchOpen : false,

        openSearch : () => set({searchOpen: true}),
        closeSearch : () => set({searchOpen:false}),

        profileOpen: false,
        openProfile: () => set({ profileOpen: true }),
        closeProfile: () => set({ profileOpen: false }),
    }

    
))