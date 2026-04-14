import { create } from "zustand";

const useAuthStore = create((set)=>({
    user: null,
    showLogin: false,

    openLogin: () => set({showLogin:true}),
    closeLogin: () => set({showLogin:false}),

    setUser: (userData) => set({
        user: userData
    }),

    logOut: () => set({user:null, role: null})
}));

export default useAuthStore;