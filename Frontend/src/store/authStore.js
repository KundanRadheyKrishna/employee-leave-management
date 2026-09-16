import { create } from "zustand";
import { account, tablesDB, DB_ID, USER_TABLE_ID } from "../appwriteConfig";

const toUser = (accountUser, row) => ({
    id: accountUser.$id,
    email: accountUser.email,
    name: row.name || accountUser.name || accountUser.email,
    role: row.role,
    department_id: row.department_id || "",
    manager_id: row.manager_id || "",
    leave_balance: Number(row.leave_balance ?? 20),
    avatar_url: row.avatar_url || "",
    first_login: Boolean(row.first_login),
});

const useAuthStore = create((set) => ({
    user: null,
    showLogin: false,
    loading: true, // 🔥 add this

    openLogin: () => set({ showLogin: true }),
    closeLogin: () => set({ showLogin: false }),

    setUser: (userData) => set({ user: userData, loading: false }),
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
      user: toUser(user, userRow),
      loading: false,
    });

  } catch {
    set({ user: null, loading: false });
  }
},
    // ✅ FIXED logout
    logout: async () => {
        try {
            await account.deleteSession("current");
        } catch (error) {
            if (error?.code !== 401) console.error("Logout error:", error);
        } finally {
        set({ user: null, loading: false }); // UI update

        }
    }


}));

export default useAuthStore;