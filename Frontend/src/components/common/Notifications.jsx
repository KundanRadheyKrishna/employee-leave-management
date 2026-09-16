import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Query } from "appwrite";
import useAuthStore from "../../store/authStore";
import { DB_ID, NOTIFICATION_TABLE_ID, tablesDB } from "../../appwriteConfig";

const Notifications = ({ onClose }) => {
  const user = useAuthStore((state) => state.user);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await tablesDB.listRows(DB_ID, NOTIFICATION_TABLE_ID, [
          Query.equal("user_id", user.id),
          Query.orderDesc("created_at"),
          Query.limit(50),
        ]);
        setItems(response.rows);
      } catch (loadError) {
        setError(loadError.message || "Unable to load notifications.");
      }
    };
    if (user?.id) load();
  }, [user]);

  const markRead = async (item) => {
    if (item.read) return;
    try {
      await tablesDB.updateRow(DB_ID, NOTIFICATION_TABLE_ID, item.$id, { read: true });
      setItems((current) => current.map((row) => (row.$id === item.$id ? { ...row, read: true } : row)));
    } catch (markError) {
      setError(markError.message || "Unable to mark notification as read.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <section className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Notifications</h2>
          <button onClick={onClose}><X /></button>
        </div>
        {error && <p className="mt-4 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
        <div className="mt-5 space-y-2">
          {items.length === 0 && <p className="text-sm text-slate-500">No notifications.</p>}
          {items.map((item) => (
            <button key={item.$id} onClick={() => markRead(item)} className={`w-full rounded-lg border p-3 text-left ${item.read ? "bg-white" : "bg-green-50"}`}>
              <p className="text-sm">{item.message || "You have a new update."}</p>
              <p className="mt-1 text-xs text-slate-400">{item.created_at ? new Date(item.created_at).toLocaleString() : ""}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Notifications;
