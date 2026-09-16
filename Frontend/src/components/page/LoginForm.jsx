import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { account, DB_ID, tablesDB, USER_TABLE_ID } from "../../appwriteConfig";
import { roleDashboard } from "../../utils/leaveRules";

const LoginForm = () => {
  const navigate = useNavigate();
  const closeLogin = useAuthStore((state) => state.closeLogin);
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [mustReset, setMustReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const finishLogin = (user, profile) => {
    const nextUser = {
      id: user.$id,
      email: user.email,
      name: profile.name || user.name || user.email,
      role: profile.role,
      department_id: profile.department_id || "",
      manager_id: profile.manager_id || "",
      leave_balance: Number(profile.leave_balance ?? 20),
      avatar_url: profile.avatar_url || "",
      first_login: Boolean(profile.first_login),
    };
    if (!roleDashboard[nextUser.role]) throw new Error("Your account has no valid role.");
    setUser(nextUser);
    closeLogin();
    navigate(roleDashboard[nextUser.role], { replace: true });
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await account.createEmailPasswordSession(email.trim(), password);
      const current = await account.get();
      const profile = await tablesDB.getRow(DB_ID, USER_TABLE_ID, current.$id);
      if (profile.first_login) {
        setMustReset(true);
      } else {
        finishLogin(current, profile);
      }
    } catch (loginError) {
      setError(loginError.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    if (newPassword.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await account.updatePassword(newPassword, password);
      const current = await account.get();
      const profile = await tablesDB.getRow(DB_ID, USER_TABLE_ID, current.$id);
      await tablesDB.updateRow(DB_ID, USER_TABLE_ID, current.$id, { first_login: false });
      finishLogin(current, { ...profile, first_login: false });
    } catch (resetError) {
      setError(resetError.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950/70 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">
        <h2 className="text-2xl font-bold text-slate-900">
          {mustReset ? "Set your new password" : "Sign in"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {mustReset
            ? "Your temporary password must be changed before continuing."
            : "Use your official organization email."}
        </p>
        {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {mustReset ? (
          <form onSubmit={resetPassword} className="mt-6 space-y-4">
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="New password (8+ characters)"
              className="w-full rounded-lg border p-3"
              required
              minLength={8}
            />
            <button disabled={loading} className="w-full rounded-lg bg-green-600 p-3 font-semibold text-white disabled:opacity-50">
              {loading ? "Saving..." : "Set password and continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-lg border p-3"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border p-3"
              required
            />
            <div className="flex gap-3">
              <button disabled={loading} className="flex-1 rounded-lg bg-green-600 p-3 font-semibold text-white disabled:opacity-50">
                {loading ? "Signing in..." : "Sign in"}
              </button>
              <button type="button" onClick={closeLogin} className="rounded-lg border px-5">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
