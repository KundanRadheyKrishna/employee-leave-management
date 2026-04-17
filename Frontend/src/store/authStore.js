import { create } from "zustand";
// import { account } from "../lib/appwrite"; // apna path
import { account, tablesDB, DB_ID, USER_TABLE_ID } from "../appwriteConfig";

const useAuthStore = create((set) => ({
    user: null,
    showLogin: false,
    loading: true, // 🔥 add this

    openLogin: () => set({ showLogin: true }),
    closeLogin: () => set({ showLogin: false }),

    setUser: (userData) => set({
        user: userData,
        loading: false,
    }),
 setLoading: (value) => set({ loading: value }),

 // 🔥 NEW IMPORTANT FUNCTION
    initUser: async () => {
  try {
    const user = await account.get();

    const userRow = await tablesDB.getRow(
      DB_ID,
      USER_TABLE_ID,
      user.$id
    );

    set({
      user: {
        id: user.$id,
        email: user.email,
        role: userRow.role,
        department_id: userRow.department_id,
        manager_id: userRow.manager_id,
      },
      loading: false,
    });

  } catch (err) {
    set({ user: null, loading: false });
  }
},
    // ✅ FIXED logout
    logout: async () => {
        try {
            await account.deleteSession("current"); // backend session delete
        } catch (err) {
            console.log("logout error", err);
        } finally {
        set({ user: null, loading: false }); // UI update

        }
    }


}));

export default useAuthStore;