import React, { useState } from "react";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";
import useAuthStore from "../../store/authStore";
import { PROFILE_BUCKET_ID, storage } from "../../appwriteConfig";
import { updateUser } from "../../utils/appwriteData";
import Notifications from "./Notifications";

const DashboardLayout = ({ title, tabs, activeTab, onTabChange, children }) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileError, setProfileError] = useState("");

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  const uploadProfile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setProfileError("");
    try {
      const uploaded = await storage.createFile(PROFILE_BUCKET_ID, ID.unique(), file);
      const avatarUrl = storage.getFileView(PROFILE_BUCKET_ID, uploaded.$id).toString();
      await updateUser(user.id, { avatar_url: avatarUrl });
      setUser({ ...user, avatar_url: avatarUrl });
    } catch (uploadError) {
      setProfileError(uploadError.message || "Unable to upload profile image.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-30 border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">{user?.role}</p>
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowNotifications(true)} className="rounded-lg p-2 hover:bg-slate-100" title="Notifications">
              <Bell size={20} />
            </button>
            <label className="cursor-pointer" title="Upload profile image">
              {user?.avatar_url ? <img src={user.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" /> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-800">{user?.name?.charAt(0)?.toUpperCase()}</span>}
              <input type="file" accept="image/*" onChange={uploadProfile} className="hidden" />
            </label>
            <span className="hidden text-sm text-slate-600 md:block">{user?.name}</span>
            <button onClick={signOut} className="hidden items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm text-white md:flex">
              <LogOut size={16} /> Logout
            </button>
            <button onClick={() => setOpen(true)} className="rounded-lg p-2 md:hidden"><Menu /></button>
          </div>
        </div>
      </header>
      {profileError && <p className="mx-auto max-w-7xl px-4 pt-3 text-sm text-red-700 md:px-8">{profileError}</p>}
      <div className="mx-auto flex max-w-7xl gap-6 p-4 md:p-8">
        <aside className="hidden w-56 shrink-0 rounded-xl bg-white p-3 shadow-sm md:block">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm ${activeTab === tab.id ? "bg-green-100 font-semibold text-green-800" : "hover:bg-slate-50"}`}
            >
              {tab.label}
            </button>
          ))}
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setOpen(false)}>
          <aside className="h-full w-72 bg-white p-5" onClick={(event) => event.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="float-right"><X /></button>
            <div className="mt-12 space-y-1">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => { onTabChange(tab.id); setOpen(false); }} className={`w-full rounded-lg p-3 text-left ${activeTab === tab.id ? "bg-green-100 text-green-800" : ""}`}>
                  {tab.label}
                </button>
              ))}
              <button onClick={signOut} className="mt-6 flex w-full items-center gap-2 rounded-lg bg-red-600 p-3 text-white"><LogOut size={16} /> Logout</button>
            </div>
          </aside>
        </div>
      )}
      {showNotifications && <Notifications onClose={() => setShowNotifications(false)} />}
    </div>
  );
};

export default DashboardLayout;
