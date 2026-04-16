import { create } from "zustand";
// import { account } from "../lib/appwrite"; // apna path
import { account } from "../appwriteConfig";

const useAuthStore = create((set) => ({
    user: null,
    showLogin: false,
    loading: true, // 🔥 add this

    openLogin: () => set({ showLogin: true }),
    closeLogin: () => set({ showLogin: false }),

    setUser: (userData) => set({
        user: userData
    }),
 setLoading: (value) => set({ loading: value }),
    // ✅ FIXED logout
    logout: async () => {
        try {
            await account.deleteSession("current"); // backend session delete
        } catch (err) {
            console.log("logout error", err);
        } finally {
        set({ user: null }); // UI update

        }
    }


}));

export default useAuthStore;